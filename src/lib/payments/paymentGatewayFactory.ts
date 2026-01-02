import { PaymentGateway } from './paymentGateway';
import { PaymentConfig, PaymentProvider, EnvironmentMode, TEST_KEYS } from './types';
import { StripeGateway } from './providers/stripeGateway';
import { PaystackGateway } from './providers/paystackGateway';
import { FlutterwaveGateway } from './providers/flutterwaveGateway';
import { MobileMoneyGateway } from './providers/mobileMoneyGateway';

// Payment Gateway Factory - Creates and manages payment gateways
export class PaymentGatewayFactory {
  private static gateways: Map<string, PaymentGateway> = new Map();
  private static configs: Map<string, PaymentConfig> = new Map();

  static createGateway(config: PaymentConfig): PaymentGateway {
    const key = `${config.provider}-${config.mode}`;
    
    if (this.gateways.has(key)) {
      return this.gateways.get(key)!;
    }

    let gateway: PaymentGateway;

    switch (config.provider) {
      case 'stripe':
        gateway = new StripeGateway(config);
        break;
      case 'paystack':
        gateway = new PaystackGateway(config);
        break;
      case 'flutterwave':
        gateway = new FlutterwaveGateway(config);
        break;
      case 'mobilemoney':
        gateway = new MobileMoneyGateway(config);
        break;
      default:
        throw new Error(`Unsupported payment provider: ${config.provider}`);
    }

    this.gateways.set(key, gateway);
    this.configs.set(key, config);
    
    return gateway;
  }

  static getGateway(provider: PaymentProvider, mode: EnvironmentMode = 'test'): PaymentGateway | undefined {
    return this.gateways.get(`${provider}-${mode}`);
  }

  static removeGateway(provider: PaymentProvider, mode: EnvironmentMode): boolean {
    return this.gateways.delete(`${provider}-${mode}`);
  }

  static getAllGateways(): Map<string, PaymentGateway> {
    return new Map(this.gateways);
  }

  static getSupportedProviders(): PaymentProvider[] {
    return ['stripe', 'paystack', 'flutterwave', 'mobilemoney'];
  }

  // Create a test mode gateway with default test keys
  static createTestGateway(provider: PaymentProvider): PaymentGateway {
    const testKeys = TEST_KEYS[provider];
    
    const config: PaymentConfig = {
      id: `test_${provider}_${Date.now()}`,
      provider,
      displayName: this.getProviderDisplayName(provider),
      publicKey: testKeys.publicKey,
      secretKey: testKeys.secretKey,
      mode: 'test',
      isActive: true,
      supportedCurrencies: this.getDefaultCurrencies(provider),
      supportedCountries: this.getDefaultCountries(provider),
      features: this.getDefaultFeatures(provider),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return this.createGateway(config);
  }

  private static getProviderDisplayName(provider: PaymentProvider): string {
    const names: Record<PaymentProvider, string> = {
      stripe: 'Stripe',
      paystack: 'Paystack',
      flutterwave: 'Flutterwave',
      mobilemoney: 'Mobile Money',
    };
    return names[provider];
  }

  private static getDefaultCurrencies(provider: PaymentProvider): string[] {
    const currencies: Record<PaymentProvider, string[]> = {
      stripe: ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'NGN', 'ZAR', 'KES'],
      paystack: ['NGN', 'GHS', 'ZAR', 'KES', 'USD'],
      flutterwave: ['NGN', 'GHS', 'KES', 'TZS', 'UGX', 'ZAR', 'USD', 'EUR', 'GBP'],
      mobilemoney: ['KES', 'TZS', 'UGX', 'GHS', 'NGN', 'XOF'],
    };
    return currencies[provider];
  }

  private static getDefaultCountries(provider: PaymentProvider): string[] {
    const countries: Record<PaymentProvider, string[]> = {
      stripe: ['US', 'GB', 'CA', 'AU', 'NG', 'ZA', 'KE', 'GH'],
      paystack: ['NG', 'GH', 'ZA', 'KE'],
      flutterwave: ['NG', 'GH', 'KE', 'TZ', 'UG', 'ZA', 'RW', 'CI'],
      mobilemoney: ['KE', 'TZ', 'UG', 'GH', 'NG', 'CI', 'SN'],
    };
    return countries[provider];
  }

  private static getDefaultFeatures(provider: PaymentProvider): PaymentConfig['features'] {
    const features: Record<PaymentProvider, PaymentConfig['features']> = {
      stripe: {
        subscriptions: true,
        invoices: true,
        refunds: true,
        disputes: true,
        payouts: true,
        mobileMoney: false,
        bankTransfer: true,
        cards: true,
        ussd: false,
      },
      paystack: {
        subscriptions: true,
        invoices: true,
        refunds: true,
        disputes: true,
        payouts: true,
        mobileMoney: true,
        bankTransfer: true,
        cards: true,
        ussd: true,
      },
      flutterwave: {
        subscriptions: true,
        invoices: true,
        refunds: true,
        disputes: true,
        payouts: true,
        mobileMoney: true,
        bankTransfer: true,
        cards: true,
        ussd: true,
      },
      mobilemoney: {
        subscriptions: true,
        invoices: false,
        refunds: true,
        disputes: false,
        payouts: true,
        mobileMoney: true,
        bankTransfer: false,
        cards: false,
        ussd: false,
      },
    };
    return features[provider];
  }

  // Update gateway mode (switch between test and live)
  static async switchMode(
    provider: PaymentProvider,
    newMode: EnvironmentMode,
    liveKeys?: { publicKey: string; secretKey: string; webhookSecret?: string }
  ): Promise<PaymentGateway> {
    const currentKey = `${provider}-${newMode === 'live' ? 'test' : 'live'}`;
    const currentConfig = this.configs.get(currentKey);

    if (!currentConfig) {
      throw new Error(`No existing configuration found for ${provider}`);
    }

    // If switching to live mode, require live keys
    if (newMode === 'live' && !liveKeys) {
      throw new Error('Live API keys are required to switch to live mode');
    }

    const newConfig: PaymentConfig = {
      ...currentConfig,
      mode: newMode,
      publicKey: newMode === 'live' ? liveKeys!.publicKey : TEST_KEYS[provider].publicKey,
      secretKey: newMode === 'live' ? liveKeys!.secretKey : TEST_KEYS[provider].secretKey,
      webhookSecret: newMode === 'live' ? liveKeys?.webhookSecret : undefined,
      updatedAt: new Date().toISOString(),
    };

    const gateway = this.createGateway(newConfig);
    await gateway.initialize();
    
    return gateway;
  }
}
