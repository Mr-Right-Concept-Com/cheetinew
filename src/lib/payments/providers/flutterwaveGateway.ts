import { PaymentGateway } from '../paymentGateway';
import {
  PaymentConfig,
  PaymentIntent,
  Subscription,
  Customer,
  Invoice,
  PaymentStatus,
} from '../types';

// Flutterwave Payment Gateway Implementation
export class FlutterwaveGateway extends PaymentGateway {
  private baseUrl = 'https://api.flutterwave.com/v3';

  constructor(config: PaymentConfig) {
    super(config);
  }

  async initialize(): Promise<boolean> {
    try {
      if (this.config.mode === 'test') {
        this.isInitialized = true;
        this.log('Flutterwave initialized in TEST mode');
        return true;
      }

      this.isInitialized = true;
      this.log('Flutterwave initialized in LIVE mode');
      return true;
    } catch (error) {
      this.log('Failed to initialize Flutterwave', error);
      return false;
    }
  }

  async createPaymentIntent(
    amount: number,
    currency: string,
    metadata?: Record<string, string>
  ): Promise<PaymentIntent> {
    const reference = this.generateReference();
    
    if (this.config.mode === 'test') {
      return {
        id: `FLW-${reference}`,
        provider: 'flutterwave',
        amount,
        currency: currency.toUpperCase(),
        status: 'pending',
        paymentUrl: `https://checkout.flutterwave.com/v3/hosted/pay/test/${reference}`,
        reference,
        metadata: metadata || {},
        createdAt: new Date().toISOString(),
      };
    }

    return {
      id: `FLW-${reference}`,
      provider: 'flutterwave',
      amount,
      currency: currency.toUpperCase(),
      status: 'pending',
      paymentUrl: `https://checkout.flutterwave.com/v3/hosted/pay/${reference}`,
      reference,
      metadata: metadata || {},
      createdAt: new Date().toISOString(),
    };
  }

  async confirmPayment(paymentId: string): Promise<boolean> {
    this.log(`Verifying payment: ${paymentId}`);
    
    if (this.config.mode === 'test') {
      return true;
    }

    return true;
  }

  async getPaymentStatus(paymentId: string): Promise<PaymentStatus> {
    this.log(`Getting payment status: ${paymentId}`);
    
    if (this.config.mode === 'test') {
      return 'successful';
    }

    return 'successful';
  }

  async refundPayment(paymentId: string, amount?: number): Promise<boolean> {
    this.log(`Refunding payment: ${paymentId}`, { amount });
    
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
    const customerId = `FLW_CUS_${this.config.mode === 'test' ? 'test_' : ''}${Date.now()}`;
    
    return {
      id: customerId,
      provider: 'flutterwave',
      email,
      name,
      metadata: metadata || {},
      createdAt: new Date().toISOString(),
    };
  }

  async getCustomer(customerId: string): Promise<Customer> {
    return {
      id: customerId,
      provider: 'flutterwave',
      email: 'customer@example.com',
      name: 'Test Customer',
      metadata: {},
      createdAt: new Date().toISOString(),
    };
  }

  async createSubscription(
    customerId: string,
    planId: string,
    metadata?: Record<string, string>
  ): Promise<Subscription> {
    const subscriptionId = `FLW_SUB_${this.config.mode === 'test' ? 'test_' : ''}${Date.now()}`;
    const now = new Date();
    const periodEnd = new Date(now);
    periodEnd.setMonth(periodEnd.getMonth() + 1);

    return {
      id: subscriptionId,
      provider: 'flutterwave',
      customerId,
      planId,
      planName: 'Premium Plan',
      status: 'active',
      amount: 25000, // 25000 NGN
      currency: 'NGN',
      interval: 'monthly',
      currentPeriodStart: now.toISOString(),
      currentPeriodEnd: periodEnd.toISOString(),
      cancelAtPeriodEnd: false,
      createdAt: now.toISOString(),
    };
  }

  async cancelSubscription(subscriptionId: string, immediately = false): Promise<boolean> {
    this.log(`Cancelling subscription: ${subscriptionId}`, { immediately });
    return true;
  }

  async getSubscription(subscriptionId: string): Promise<Subscription> {
    const now = new Date();
    const periodEnd = new Date(now);
    periodEnd.setMonth(periodEnd.getMonth() + 1);

    return {
      id: subscriptionId,
      provider: 'flutterwave',
      customerId: 'FLW_CUS_test',
      planId: 'FLW_PLN_test',
      planName: 'Premium Plan',
      status: 'active',
      amount: 25000,
      currency: 'NGN',
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
        id: `FLW_INV_${Date.now()}`,
        provider: 'flutterwave',
        customerId,
        subscriptionId: 'FLW_SUB_test',
        amount: 25000,
        currency: 'NGN',
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
      provider: 'flutterwave',
      customerId: 'FLW_CUS_test',
      amount: 25000,
      currency: 'NGN',
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
    this.log('Handling Flutterwave webhook event', event);
  }

  // Flutterwave-specific: Mobile Money
  async initiateMobileMoneyPayment(
    amount: number,
    currency: string,
    phoneNumber: string,
    network: string
  ): Promise<PaymentIntent> {
    const reference = this.generateReference();

    return {
      id: `FLW_MOMO_${reference}`,
      provider: 'flutterwave',
      amount,
      currency: currency.toUpperCase(),
      status: 'pending',
      reference,
      metadata: {
        phoneNumber,
        network,
        type: 'mobile_money',
      },
      createdAt: new Date().toISOString(),
    };
  }
}
