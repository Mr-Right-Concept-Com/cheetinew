import {
  PanelAdapter,
  PanelCredentials,
  DomainInfo,
  DNSRecord,
  HostingAccount,
  EmailAccount,
  SSLInfo,
  BackupInfo,
  CloudInstance,
  MigrationTask,
} from '../types';

// Base Panel Adapter - Common functionality for all panel adapters
export abstract class BasePanelAdapter implements PanelAdapter {
  protected credentials: PanelCredentials;
  protected isAuthenticated: boolean = false;

  constructor(credentials: PanelCredentials) {
    this.credentials = credentials;
  }

  // Helper for making authenticated API requests
  protected async makeRequest<T>(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    body?: unknown
  ): Promise<T> {
    const url = `${this.credentials.apiUrl}${endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.credentials.apiKey}`,
    };

    if (this.credentials.username) {
      headers['X-Username'] = this.credentials.username;
    }

    try {
      // In test mode, return mock data
      if (this.credentials.mode === 'test') {
        return this.getMockResponse<T>(endpoint, method);
      }

      const response = await fetch(url, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`[${this.credentials.panelType}] API Error:`, error);
      throw error;
    }
  }

  // Abstract method - each panel implements its own mock responses
  protected abstract getMockResponse<T>(endpoint: string, method: string): T;

  // Common implementations
  abstract authenticate(): Promise<boolean>;
  abstract validateCredentials(): Promise<boolean>;
  abstract listDomains(): Promise<DomainInfo[]>;
  abstract getDomain(id: string): Promise<DomainInfo>;
  abstract createDomain(domain: Partial<DomainInfo>): Promise<DomainInfo>;
  abstract updateDNS(domainId: string, records: DNSRecord[]): Promise<boolean>;
  abstract transferDomain(domainId: string, authCode: string): Promise<MigrationTask>;
  abstract listHostingAccounts(): Promise<HostingAccount[]>;
  abstract getHostingAccount(id: string): Promise<HostingAccount>;
  abstract createHostingAccount(account: Partial<HostingAccount>): Promise<HostingAccount>;
  abstract suspendAccount(id: string): Promise<boolean>;
  abstract unsuspendAccount(id: string): Promise<boolean>;
  abstract listEmailAccounts(domain: string): Promise<EmailAccount[]>;
  abstract createEmailAccount(email: Partial<EmailAccount>): Promise<EmailAccount>;
  abstract deleteEmailAccount(id: string): Promise<boolean>;
  abstract getSSLStatus(domain: string): Promise<SSLInfo>;
  abstract installSSL(domain: string): Promise<boolean>;
  abstract renewSSL(domain: string): Promise<boolean>;
  abstract listBackups(resourceId: string): Promise<BackupInfo[]>;
  abstract createBackup(resourceId: string, type: BackupInfo['type']): Promise<BackupInfo>;
  abstract restoreBackup(backupId: string): Promise<boolean>;
  abstract getResourceUsage(accountId: string): Promise<{
    cpu: number;
    ram: number;
    disk: number;
    bandwidth: number;
  }>;

  // Optional cloud methods with default implementations
  listInstances?(): Promise<CloudInstance[]> {
    throw new Error('Cloud instances not supported by this panel');
  }

  createInstance?(config: Partial<CloudInstance>): Promise<CloudInstance> {
    throw new Error('Cloud instances not supported by this panel');
  }

  deleteInstance?(id: string): Promise<boolean> {
    throw new Error('Cloud instances not supported by this panel');
  }

  // Utility methods
  protected generateId(): string {
    return `${this.credentials.panelType}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  protected log(message: string, data?: unknown): void {
    const prefix = `[${this.credentials.panelType.toUpperCase()}][${this.credentials.mode}]`;
    if (data) {
      console.log(`${prefix} ${message}`, data);
    } else {
      console.log(`${prefix} ${message}`);
    }
  }
}
