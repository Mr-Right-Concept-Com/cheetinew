import {
  PaymentConfig,
  PaymentProvider,
  PaymentIntent,
  Subscription,
  Customer,
  Invoice,
  EnvironmentMode,
  PaymentStatus,
} from './types';

// Base Payment Gateway - Common interface for all payment providers
export abstract class PaymentGateway {
  protected config: PaymentConfig;
  protected isInitialized: boolean = false;

  constructor(config: PaymentConfig) {
    this.config = config;
  }

  abstract initialize(): Promise<boolean>;

  // Payment Intent
  abstract createPaymentIntent(
    amount: number,
    currency: string,
    metadata?: Record<string, string>
  ): Promise<PaymentIntent>;
  
  abstract confirmPayment(paymentId: string): Promise<boolean>;
  abstract getPaymentStatus(paymentId: string): Promise<PaymentStatus>;
  abstract refundPayment(paymentId: string, amount?: number): Promise<boolean>;

  // Customers
  abstract createCustomer(
    email: string,
    name: string,
    metadata?: Record<string, string>
  ): Promise<Customer>;
  abstract getCustomer(customerId: string): Promise<Customer>;

  // Subscriptions
  abstract createSubscription(
    customerId: string,
    planId: string,
    metadata?: Record<string, string>
  ): Promise<Subscription>;
  abstract cancelSubscription(subscriptionId: string, immediately?: boolean): Promise<boolean>;
  abstract getSubscription(subscriptionId: string): Promise<Subscription>;

  // Invoices
  abstract listInvoices(customerId: string): Promise<Invoice[]>;
  abstract getInvoice(invoiceId: string): Promise<Invoice>;

  // Webhooks
  abstract verifyWebhookSignature(payload: string, signature: string): Promise<boolean>;
  abstract handleWebhook(event: unknown): Promise<void>;

  // Utilities
  protected generateReference(): string {
    return `${this.config.provider}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  protected log(message: string, data?: unknown): void {
    const prefix = `[${this.config.provider.toUpperCase()}][${this.config.mode}]`;
    if (data) {
      console.log(`${prefix} ${message}`, data);
    } else {
      console.log(`${prefix} ${message}`);
    }
  }

  getConfig(): PaymentConfig {
    return this.config;
  }

  isActive(): boolean {
    return this.config.isActive && this.isInitialized;
  }

  getMode(): EnvironmentMode {
    return this.config.mode;
  }
}
