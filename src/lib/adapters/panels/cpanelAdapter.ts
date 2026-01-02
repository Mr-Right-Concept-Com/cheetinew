import { BasePanelAdapter } from './basePanelAdapter';
import {
  PanelCredentials,
  DomainInfo,
  DNSRecord,
  HostingAccount,
  EmailAccount,
  SSLInfo,
  BackupInfo,
  MigrationTask,
} from '../types';

// cPanel Adapter - Full implementation for cPanel/WHM API
export class CPanelAdapter extends BasePanelAdapter {
  constructor(credentials: PanelCredentials) {
    super(credentials);
  }

  protected getMockResponse<T>(endpoint: string, method: string): T {
    // Mock responses for test mode
    const mockData: Record<string, unknown> = {
      '/api/domains': [
        {
          id: 'cpanel_domain_1',
          name: 'example.com',
          status: 'active',
          registrar: 'cPanel',
          expiresAt: '2025-12-31',
          autoRenew: true,
          privacy: true,
          dnsRecords: [],
          ssl: { status: 'active', autoRenew: true },
          panelId: this.credentials.id,
        },
      ],
      '/api/accounts': [
        {
          id: 'cpanel_acc_1',
          domain: 'example.com',
          username: 'exampleuser',
          status: 'active',
          plan: 'Pro Hosting',
          diskUsage: 2500,
          diskLimit: 10000,
          bandwidthUsage: 50000,
          bandwidthLimit: 100000,
          cpuUsage: 25,
          ramUsage: 512,
          databases: 3,
          emails: 10,
          panelId: this.credentials.id,
          panelType: 'cpanel',
        },
      ],
      '/api/email': [
        {
          id: 'email_1',
          email: 'info@example.com',
          domain: 'example.com',
          quota: 1024,
          used: 256,
          status: 'active',
          panelId: this.credentials.id,
        },
      ],
      '/api/validate': { valid: true },
      '/api/authenticate': { authenticated: true, token: 'mock_token' },
    };

    const key = Object.keys(mockData).find(k => endpoint.includes(k));
    return (key ? mockData[key] : { success: true }) as T;
  }

  async authenticate(): Promise<boolean> {
    try {
      const response = await this.makeRequest<{ authenticated: boolean }>('/api/authenticate', 'POST');
      this.isAuthenticated = response.authenticated;
      this.log('Authentication successful');
      return this.isAuthenticated;
    } catch (error) {
      this.log('Authentication failed', error);
      return false;
    }
  }

  async validateCredentials(): Promise<boolean> {
    try {
      const response = await this.makeRequest<{ valid: boolean }>('/api/validate');
      return response.valid;
    } catch {
      return false;
    }
  }

  async listDomains(): Promise<DomainInfo[]> {
    return this.makeRequest<DomainInfo[]>('/api/domains');
  }

  async getDomain(id: string): Promise<DomainInfo> {
    return this.makeRequest<DomainInfo>(`/api/domains/${id}`);
  }

  async createDomain(domain: Partial<DomainInfo>): Promise<DomainInfo> {
    return this.makeRequest<DomainInfo>('/api/domains', 'POST', domain);
  }

  async updateDNS(domainId: string, records: DNSRecord[]): Promise<boolean> {
    await this.makeRequest(`/api/domains/${domainId}/dns`, 'PUT', { records });
    return true;
  }

  async transferDomain(domainId: string, authCode: string): Promise<MigrationTask> {
    return this.makeRequest<MigrationTask>('/api/transfers', 'POST', {
      domainId,
      authCode,
      type: 'domain',
    });
  }

  async listHostingAccounts(): Promise<HostingAccount[]> {
    return this.makeRequest<HostingAccount[]>('/api/accounts');
  }

  async getHostingAccount(id: string): Promise<HostingAccount> {
    return this.makeRequest<HostingAccount>(`/api/accounts/${id}`);
  }

  async createHostingAccount(account: Partial<HostingAccount>): Promise<HostingAccount> {
    return this.makeRequest<HostingAccount>('/api/accounts', 'POST', account);
  }

  async suspendAccount(id: string): Promise<boolean> {
    await this.makeRequest(`/api/accounts/${id}/suspend`, 'POST');
    return true;
  }

  async unsuspendAccount(id: string): Promise<boolean> {
    await this.makeRequest(`/api/accounts/${id}/unsuspend`, 'POST');
    return true;
  }

  async listEmailAccounts(domain: string): Promise<EmailAccount[]> {
    return this.makeRequest<EmailAccount[]>(`/api/email?domain=${domain}`);
  }

  async createEmailAccount(email: Partial<EmailAccount>): Promise<EmailAccount> {
    return this.makeRequest<EmailAccount>('/api/email', 'POST', email);
  }

  async deleteEmailAccount(id: string): Promise<boolean> {
    await this.makeRequest(`/api/email/${id}`, 'DELETE');
    return true;
  }

  async getSSLStatus(domain: string): Promise<SSLInfo> {
    return this.makeRequest<SSLInfo>(`/api/ssl/${domain}`);
  }

  async installSSL(domain: string): Promise<boolean> {
    await this.makeRequest(`/api/ssl/${domain}/install`, 'POST');
    return true;
  }

  async renewSSL(domain: string): Promise<boolean> {
    await this.makeRequest(`/api/ssl/${domain}/renew`, 'POST');
    return true;
  }

  async listBackups(resourceId: string): Promise<BackupInfo[]> {
    return this.makeRequest<BackupInfo[]>(`/api/backups?resource=${resourceId}`);
  }

  async createBackup(resourceId: string, type: BackupInfo['type']): Promise<BackupInfo> {
    return this.makeRequest<BackupInfo>('/api/backups', 'POST', {
      resourceId,
      type,
    });
  }

  async restoreBackup(backupId: string): Promise<boolean> {
    await this.makeRequest(`/api/backups/${backupId}/restore`, 'POST');
    return true;
  }

  async getResourceUsage(accountId: string): Promise<{
    cpu: number;
    ram: number;
    disk: number;
    bandwidth: number;
  }> {
    return this.makeRequest(`/api/accounts/${accountId}/usage`);
  }
}
