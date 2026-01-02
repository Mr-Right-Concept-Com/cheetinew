// Payment Gateway Types
// Supports Stripe, Paystack, Flutterwave, Mobile Money

export type PaymentProvider = 'stripe' | 'paystack' | 'flutterwave' | 'mobilemoney';
export type EnvironmentMode = 'test' | 'live';
export type PaymentStatus = 'pending' | 'processing' | 'successful' | 'failed' | 'cancelled' | 'refunded';
export type SubscriptionStatus = 'active' | 'cancelled' | 'past_due' | 'trialing' | 'paused';

export interface PaymentConfig {
  id: string;
  provider: PaymentProvider;
  displayName: string;
  publicKey: string;
  secretKey: string;
  webhookSecret?: string;
  mode: EnvironmentMode;
  isActive: boolean;
  supportedCurrencies: string[];
  supportedCountries: string[];
  features: PaymentFeatures;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentFeatures {
  subscriptions: boolean;
  invoices: boolean;
  refunds: boolean;
  disputes: boolean;
  payouts: boolean;
  mobileMoney: boolean;
  bankTransfer: boolean;
  cards: boolean;
  ussd: boolean;
}

export interface PaymentIntent {
  id: string;
  provider: PaymentProvider;
  amount: number;
  currency: string;
  status: PaymentStatus;
  clientSecret?: string;
  paymentUrl?: string;
  reference: string;
  customerId?: string;
  metadata: Record<string, string>;
  createdAt: string;
  completedAt?: string;
}

export interface Subscription {
  id: string;
  provider: PaymentProvider;
  customerId: string;
  planId: string;
  planName: string;
  status: SubscriptionStatus;
  amount: number;
  currency: string;
  interval: 'monthly' | 'yearly' | 'weekly';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  createdAt: string;
}

export interface Customer {
  id: string;
  provider: PaymentProvider;
  email: string;
  name: string;
  phone?: string;
  metadata: Record<string, string>;
  createdAt: string;
}

export interface Invoice {
  id: string;
  provider: PaymentProvider;
  customerId: string;
  subscriptionId?: string;
  amount: number;
  currency: string;
  status: 'draft' | 'open' | 'paid' | 'void' | 'uncollectible';
  dueDate: string;
  paidAt?: string;
  hostedInvoiceUrl?: string;
  pdfUrl?: string;
  createdAt: string;
}

export interface Payout {
  id: string;
  provider: PaymentProvider;
  amount: number;
  currency: string;
  status: 'pending' | 'in_transit' | 'paid' | 'failed' | 'cancelled';
  destination: string;
  arrivalDate: string;
  createdAt: string;
}

export interface WebhookEvent {
  id: string;
  provider: PaymentProvider;
  type: string;
  data: unknown;
  createdAt: string;
}

// Mobile Money specific types
export interface MobileMoneyProvider {
  code: string;
  name: string;
  country: string;
  currency: string;
}

export const MOBILE_MONEY_PROVIDERS: MobileMoneyProvider[] = [
  { code: 'mpesa_ke', name: 'M-Pesa Kenya', country: 'KE', currency: 'KES' },
  { code: 'mpesa_tz', name: 'M-Pesa Tanzania', country: 'TZ', currency: 'TZS' },
  { code: 'mtn_gh', name: 'MTN Mobile Money Ghana', country: 'GH', currency: 'GHS' },
  { code: 'mtn_ug', name: 'MTN Mobile Money Uganda', country: 'UG', currency: 'UGX' },
  { code: 'mtn_ng', name: 'MTN Mobile Money Nigeria', country: 'NG', currency: 'NGN' },
  { code: 'airtel_ng', name: 'Airtel Money Nigeria', country: 'NG', currency: 'NGN' },
  { code: 'vodafone_gh', name: 'Vodafone Cash Ghana', country: 'GH', currency: 'GHS' },
  { code: 'tigo_gh', name: 'Tigo Cash Ghana', country: 'GH', currency: 'GHS' },
  { code: 'orange_ci', name: 'Orange Money Ivory Coast', country: 'CI', currency: 'XOF' },
  { code: 'wave_sn', name: 'Wave Senegal', country: 'SN', currency: 'XOF' },
];

// Provider configurations for test mode
export const TEST_KEYS: Record<PaymentProvider, { publicKey: string; secretKey: string }> = {
  stripe: {
    publicKey: 'pk_test_TYooMQauvdEDq54NiTphI7jx',
    secretKey: 'sk_test_4eC39HqLyjWDarjtT1zdp7dc',
  },
  paystack: {
    publicKey: 'pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    secretKey: 'sk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
  },
  flutterwave: {
    publicKey: 'FLWPUBK_TEST-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx-X',
    secretKey: 'FLWSECK_TEST-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx-X',
  },
  mobilemoney: {
    publicKey: 'mm_test_public_key',
    secretKey: 'mm_test_secret_key',
  },
};
