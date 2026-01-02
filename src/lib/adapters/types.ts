// Panel-Agnostic Adapter Types
// Supports cPanel, Plesk, Hostinger, Spaceship, and custom panels

export type PanelType = 'cpanel' | 'plesk' | 'hostinger' | 'spaceship' | 'custom';
export type PaymentProvider = 'stripe' | 'paystack' | 'flutterwave' | 'mobilemoney';
export type EnvironmentMode = 'test' | 'live';

export interface PanelCredentials {
  id: string;
  name: string;
  panelType: PanelType;
  apiUrl: string;
  apiKey: string;
  apiSecret?: string;
  username?: string;
  isActive: boolean;
  mode: EnvironmentMode;
  createdAt: string;
  lastSync?: string;
}

export interface PaymentCredentials {
  id: string;
  provider: PaymentProvider;
  publicKey: string;
  secretKey: string;
  webhookSecret?: string;
  isActive: boolean;
  mode: EnvironmentMode;
  supportedCurrencies: string[];
  createdAt: string;
}

export interface DomainInfo {
  id: string;
  name: string;
  status: 'active' | 'pending' | 'expired' | 'transferring';
  registrar: string;
  expiresAt: string;
  autoRenew: boolean;
  privacy: boolean;
  dnsRecords: DNSRecord[];
  ssl: SSLInfo;
  panelId: string;
}

export interface DNSRecord {
  id: string;
  type: 'A' | 'AAAA' | 'CNAME' | 'MX' | 'TXT' | 'NS' | 'SRV';
  name: string;
  value: string;
  ttl: number;
  priority?: number;
}

export interface SSLInfo {
  status: 'active' | 'pending' | 'expired' | 'none';
  issuer?: string;
  expiresAt?: string;
  autoRenew: boolean;
}

export interface HostingAccount {
  id: string;
  domain: string;
  username: string;
  status: 'active' | 'suspended' | 'pending';
  plan: string;
  diskUsage: number;
  diskLimit: number;
  bandwidthUsage: number;
  bandwidthLimit: number;
  cpuUsage: number;
  ramUsage: number;
  databases: number;
  emails: number;
  panelId: string;
  panelType: PanelType;
}

export interface CloudInstance {
  id: string;
  name: string;
  status: 'running' | 'stopped' | 'pending' | 'error';
  type: string;
  region: string;
  cpu: number;
  ram: number;
  storage: number;
  ipAddress: string;
  privateIp?: string;
  os: string;
  createdAt: string;
  monthlyCost: number;
  panelId: string;
}

export interface EmailAccount {
  id: string;
  email: string;
  domain: string;
  quota: number;
  used: number;
  status: 'active' | 'suspended';
  forwardTo?: string;
  autoResponder?: boolean;
  panelId: string;
}

export interface BackupInfo {
  id: string;
  name: string;
  type: 'full' | 'incremental' | 'database' | 'files';
  size: number;
  createdAt: string;
  status: 'completed' | 'in_progress' | 'failed';
  location: 'local' | 'remote' | 'depin';
  encrypted: boolean;
  resourceId: string;
}

export interface MigrationTask {
  id: string;
  sourcePanel: string;
  targetPanel: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  progress: number;
  type: 'domain' | 'hosting' | 'email' | 'database' | 'full';
  resources: string[];
  startedAt?: string;
  completedAt?: string;
  error?: string;
}

export interface BulkOperation {
  id: string;
  type: 'migrate' | 'backup' | 'ssl' | 'dns_update' | 'scale';
  status: 'queued' | 'running' | 'completed' | 'failed';
  totalItems: number;
  completedItems: number;
  failedItems: number;
  createdAt: string;
  completedAt?: string;
}

// Panel Adapter Interface
export interface PanelAdapter {
  // Authentication
  authenticate(): Promise<boolean>;
  validateCredentials(): Promise<boolean>;
  
  // Domains
  listDomains(): Promise<DomainInfo[]>;
  getDomain(id: string): Promise<DomainInfo>;
  createDomain(domain: Partial<DomainInfo>): Promise<DomainInfo>;
  updateDNS(domainId: string, records: DNSRecord[]): Promise<boolean>;
  transferDomain(domainId: string, authCode: string): Promise<MigrationTask>;
  
  // Hosting
  listHostingAccounts(): Promise<HostingAccount[]>;
  getHostingAccount(id: string): Promise<HostingAccount>;
  createHostingAccount(account: Partial<HostingAccount>): Promise<HostingAccount>;
  suspendAccount(id: string): Promise<boolean>;
  unsuspendAccount(id: string): Promise<boolean>;
  
  // Email
  listEmailAccounts(domain: string): Promise<EmailAccount[]>;
  createEmailAccount(email: Partial<EmailAccount>): Promise<EmailAccount>;
  deleteEmailAccount(id: string): Promise<boolean>;
  
  // SSL
  getSSLStatus(domain: string): Promise<SSLInfo>;
  installSSL(domain: string): Promise<boolean>;
  renewSSL(domain: string): Promise<boolean>;
  
  // Backups
  listBackups(resourceId: string): Promise<BackupInfo[]>;
  createBackup(resourceId: string, type: BackupInfo['type']): Promise<BackupInfo>;
  restoreBackup(backupId: string): Promise<boolean>;
  
  // Cloud (if supported)
  listInstances?(): Promise<CloudInstance[]>;
  createInstance?(config: Partial<CloudInstance>): Promise<CloudInstance>;
  deleteInstance?(id: string): Promise<boolean>;
  
  // Stats
  getResourceUsage(accountId: string): Promise<{
    cpu: number;
    ram: number;
    disk: number;
    bandwidth: number;
  }>;
}

// Payment Adapter Interface
export interface PaymentAdapter {
  provider: PaymentProvider;
  mode: EnvironmentMode;
  
  // Core
  initialize(credentials: PaymentCredentials): Promise<boolean>;
  
  // Payments
  createPaymentIntent(amount: number, currency: string, metadata?: Record<string, string>): Promise<{
    clientSecret: string;
    paymentId: string;
  }>;
  confirmPayment(paymentId: string): Promise<boolean>;
  refundPayment(paymentId: string, amount?: number): Promise<boolean>;
  
  // Subscriptions
  createSubscription(customerId: string, priceId: string): Promise<{
    subscriptionId: string;
    status: string;
  }>;
  cancelSubscription(subscriptionId: string): Promise<boolean>;
  
  // Customers
  createCustomer(email: string, name: string, metadata?: Record<string, string>): Promise<{
    customerId: string;
  }>;
  
  // Webhooks
  verifyWebhook(payload: string, signature: string): Promise<boolean>;
  handleWebhook(event: unknown): Promise<void>;
}
