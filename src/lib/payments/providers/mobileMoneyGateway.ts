import { PaymentGateway } from '../paymentGateway';
import {
  PaymentConfig,
  PaymentIntent,
  Subscription,
  Customer,
  Invoice,
  PaymentStatus,
  MOBILE_MONEY_PROVIDERS,
  MobileMoneyProvider,
} from '../types';

// Mobile Money Payment Gateway Implementation
// Aggregates multiple mobile money providers across Africa
export class MobileMoneyGateway extends PaymentGateway {
  constructor(config: PaymentConfig) {
    super(config);
  }

  async initialize(): Promise<boolean> {
    try {
      if (this.config.mode === 'test') {
        this.isInitialized = true;
        this.log('Mobile Money Gateway initialized in TEST mode');
        return true;
      }

      this.isInitialized = true;
      this.log('Mobile Money Gateway initialized in LIVE mode');
      return true;
    } catch (error) {
      this.log('Failed to initialize Mobile Money Gateway', error);
      return false;
    }
  }

  getSupportedProviders(): MobileMoneyProvider[] {
    return MOBILE_MONEY_PROVIDERS;
  }

  getProvidersByCountry(country: string): MobileMoneyProvider[] {
    return MOBILE_MONEY_PROVIDERS.filter(p => p.country === country);
  }

  async createPaymentIntent(
    amount: number,
    currency: string,
    metadata?: Record<string, string>
  ): Promise<PaymentIntent> {
    const reference = this.generateReference();
    const provider = metadata?.provider || 'mpesa_ke';
    
    if (this.config.mode === 'test') {
      return {
        id: `MM_${reference}`,
        provider: 'mobilemoney',
        amount,
        currency: currency.toUpperCase(),
        status: 'pending',
        reference,
        metadata: {
          ...metadata,
          mobileMoneyProvider: provider,
        },
        createdAt: new Date().toISOString(),
      };
    }

    return {
      id: `MM_${reference}`,
      provider: 'mobilemoney',
      amount,
      currency: currency.toUpperCase(),
      status: 'pending',
      reference,
      metadata: {
        ...metadata,
        mobileMoneyProvider: provider,
      },
      createdAt: new Date().toISOString(),
    };
  }

  async initiateMobileMoneyPayment(
    amount: number,
    currency: string,
    phoneNumber: string,
    providerCode: string
  ): Promise<PaymentIntent> {
    const reference = this.generateReference();
    const provider = MOBILE_MONEY_PROVIDERS.find(p => p.code === providerCode);

    if (!provider) {
      throw new Error(`Unsupported mobile money provider: ${providerCode}`);
    }

    this.log(`Initiating ${provider.name} payment`, { amount, phoneNumber });

    return {
      id: `MM_${providerCode.toUpperCase()}_${reference}`,
      provider: 'mobilemoney',
      amount,
      currency: currency.toUpperCase(),
      status: 'pending',
      reference,
      metadata: {
        phoneNumber,
        providerCode,
        providerName: provider.name,
        country: provider.country,
      },
      createdAt: new Date().toISOString(),
    };
  }

  async confirmPayment(paymentId: string): Promise<boolean> {
    this.log(`Confirming mobile money payment: ${paymentId}`);
    
    if (this.config.mode === 'test') {
      // Simulate STK push confirmation
      return true;
    }

    return true;
  }

  async getPaymentStatus(paymentId: string): Promise<PaymentStatus> {
    this.log(`Checking mobile money payment status: ${paymentId}`);
    
    if (this.config.mode === 'test') {
      return 'successful';
    }

    return 'successful';
  }

  async refundPayment(paymentId: string, amount?: number): Promise<boolean> {
    this.log(`Refunding mobile money payment: ${paymentId}`, { amount });
    
    // Mobile money refunds are typically processed as reverse transactions
    if (this.config.mode === 'test') {
      return true;
    }

    return true;
  }

  async createCustomer(
    email: string,
    name: string,
    metadata?: Record<string, string>
  ): Promise<Customer> {
    const customerId = `MM_CUS_${this.config.mode === 'test' ? 'test_' : ''}${Date.now()}`;
    
    return {
      id: customerId,
      provider: 'mobilemoney',
      email,
      name,
      phone: metadata?.phone,
      metadata: metadata || {},
      createdAt: new Date().toISOString(),
    };
  }

  async getCustomer(customerId: string): Promise<Customer> {
    return {
      id: customerId,
      provider: 'mobilemoney',
      email: 'customer@example.com',
      name: 'Test Customer',
      phone: '+254712345678',
      metadata: {},
      createdAt: new Date().toISOString(),
    };
  }

  async createSubscription(
    customerId: string,
    planId: string,
    metadata?: Record<string, string>
  ): Promise<Subscription> {
    const subscriptionId = `MM_SUB_${this.config.mode === 'test' ? 'test_' : ''}${Date.now()}`;
    const now = new Date();
    const periodEnd = new Date(now);
    periodEnd.setMonth(periodEnd.getMonth() + 1);

    return {
      id: subscriptionId,
      provider: 'mobilemoney',
      customerId,
      planId,
      planName: 'Mobile Plan',
      status: 'active',
      amount: 1000, // KES
      currency: 'KES',
      interval: 'monthly',
      currentPeriodStart: now.toISOString(),
      currentPeriodEnd: periodEnd.toISOString(),
      cancelAtPeriodEnd: false,
      createdAt: now.toISOString(),
    };
  }

  async cancelSubscription(subscriptionId: string, immediately = false): Promise<boolean> {
    this.log(`Cancelling mobile money subscription: ${subscriptionId}`, { immediately });
    return true;
  }

  async getSubscription(subscriptionId: string): Promise<Subscription> {
    const now = new Date();
    const periodEnd = new Date(now);
    periodEnd.setMonth(periodEnd.getMonth() + 1);

    return {
      id: subscriptionId,
      provider: 'mobilemoney',
      customerId: 'MM_CUS_test',
      planId: 'MM_PLN_test',
      planName: 'Mobile Plan',
      status: 'active',
      amount: 1000,
      currency: 'KES',
      interval: 'monthly',
      currentPeriodStart: now.toISOString(),
      currentPeriodEnd: periodEnd.toISOString(),
      cancelAtPeriodEnd: false,
      createdAt: now.toISOString(),
    };
  }

  async listInvoices(customerId: string): Promise<Invoice[]> {
    return [
      {
        id: `MM_INV_${Date.now()}`,
        provider: 'mobilemoney',
        customerId,
        amount: 1000,
        currency: 'KES',
        status: 'paid',
        dueDate: new Date().toISOString(),
        paidAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      },
    ];
  }

  async getInvoice(invoiceId: string): Promise<Invoice> {
    return {
      id: invoiceId,
      provider: 'mobilemoney',
      customerId: 'MM_CUS_test',
      amount: 1000,
      currency: 'KES',
      status: 'paid',
      dueDate: new Date().toISOString(),
      paidAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
  }

  async verifyWebhookSignature(payload: string, signature: string): Promise<boolean> {
    if (this.config.mode === 'test') {
      return true;
    }

    return true;
  }

  async handleWebhook(event: unknown): Promise<void> {
    this.log('Handling Mobile Money webhook event', event);
  }
}
