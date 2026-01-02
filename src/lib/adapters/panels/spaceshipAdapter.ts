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

// Spaceship Adapter - Spaceship.com API implementation
export class SpaceshipAdapter extends BasePanelAdapter {
  constructor(credentials: PanelCredentials) {
    super(credentials);
  }

  protected getMockResponse<T>(endpoint: string, method: string): T {
    const mockData: Record<string, unknown> = {
      '/domains': [
        {
          id: 'spaceship_domain_1',
          name: 'spaceship-example.io',
          status: 'active',
          registrar: 'Spaceship',
          expiresAt: '2025-08-20',
          autoRenew: true,
          privacy: true,
          dnsRecords: [
            { id: 'sp_dns_1', type: 'A', name: '@', value: '76.76.21.21', ttl: 300 },
            { id: 'sp_dns_2', type: 'CNAME', name: 'www', value: 'spaceship-example.io', ttl: 300 },
          ],
          ssl: { status: 'active', issuer: 'Spaceship SSL', autoRenew: true },
          panelId: this.credentials.id,
        },
        {
          id: 'spaceship_domain_2',
          name: 'myproject.dev',
          status: 'active',
          registrar: 'Spaceship',
          expiresAt: '2025-05-10',
          autoRenew: false,
          privacy: false,
          dnsRecords: [],
          ssl: { status: 'none', autoRenew: false },
          panelId: this.credentials.id,
        },
      ],
      '/hosting/sites': [
        {
          id: 'spaceship_site_1',
          domain: 'spaceship-example.io',
          username: 'spaceship_user',
          status: 'active',
          plan: 'Spaceship Pro',
          diskUsage: 3500,
          diskLimit: 50000,
          bandwidthUsage: 80000,
          bandwidthLimit: 500000,
          cpuUsage: 20,
          ramUsage: 512,
          databases: 5,
          emails: 20,
          panelId: this.credentials.id,
          panelType: 'spaceship',
        },
      ],
      '/email/accounts': [
        {
          id: 'sp_email_1',
          email: 'hello@spaceship-example.io',
          domain: 'spaceship-example.io',
          quota: 10240,
          used: 2048,
          status: 'active',
          panelId: this.credentials.id,
        },
      ],
      '/auth/validate': { valid: true },
      '/auth/login': { authenticated: true, apiKey: 'spaceship_test_key' },
    };

    const key = Object.keys(mockData).find(k => endpoint.includes(k));
    return (key ? mockData[key] : { success: true }) as T;
  }

  async authenticate(): Promise<boolean> {
    try {
      const response = await this.makeRequest<{ authenticated: boolean }>('/auth/login', 'POST');
      this.isAuthenticated = response.authenticated;
      this.log('Spaceship authentication successful');
      return this.isAuthenticated;
    } catch (error) {
      this.log('Spaceship authentication failed', error);
      return false;
    }
  }

  async validateCredentials(): Promise<boolean> {
    try {
      const response = await this.makeRequest<{ valid: boolean }>('/auth/validate');
      return response.valid;
    } catch {
      return false;
    }
  }

  async listDomains(): Promise<DomainInfo[]> {
    return this.makeRequest<DomainInfo[]>('/domains');
  }

  async getDomain(id: string): Promise<DomainInfo> {
    return this.makeRequest<DomainInfo>(`/domains/${id}`);
  }

  async createDomain(domain: Partial<DomainInfo>): Promise<DomainInfo> {
    return this.makeRequest<DomainInfo>('/domains', 'POST', domain);
  }

  async updateDNS(domainId: string, records: DNSRecord[]): Promise<boolean> {
    await this.makeRequest(`/domains/${domainId}/dns`, 'PUT', { records });
    return true;
  }

  async transferDomain(domainId: string, authCode: string): Promise<MigrationTask> {
    return this.makeRequest<MigrationTask>('/domains/transfer', 'POST', {
      domainId,
      authCode,
    });
  }

  async listHostingAccounts(): Promise<HostingAccount[]> {
    return this.makeRequest<HostingAccount[]>('/hosting/sites');
  }

  async getHostingAccount(id: string): Promise<HostingAccount> {
    return this.makeRequest<HostingAccount>(`/hosting/sites/${id}`);
  }

  async createHostingAccount(account: Partial<HostingAccount>): Promise<HostingAccount> {
    return this.makeRequest<HostingAccount>('/hosting/sites', 'POST', account);
  }

  async suspendAccount(id: string): Promise<boolean> {
    await this.makeRequest(`/hosting/sites/${id}/suspend`, 'POST');
    return true;
  }

  async unsuspendAccount(id: string): Promise<boolean> {
    await this.makeRequest(`/hosting/sites/${id}/activate`, 'POST');
    return true;
  }

  async listEmailAccounts(domain: string): Promise<EmailAccount[]> {
    return this.makeRequest<EmailAccount[]>(`/email/accounts?domain=${domain}`);
  }

  async createEmailAccount(email: Partial<EmailAccount>): Promise<EmailAccount> {
    return this.makeRequest<EmailAccount>('/email/accounts', 'POST', email);
  }

  async deleteEmailAccount(id: string): Promise<boolean> {
    await this.makeRequest(`/email/accounts/${id}`, 'DELETE');
    return true;
  }

  async getSSLStatus(domain: string): Promise<SSLInfo> {
    return this.makeRequest<SSLInfo>(`/ssl/${domain}`);
  }

  async installSSL(domain: string): Promise<boolean> {
    await this.makeRequest(`/ssl/${domain}/provision`, 'POST');
    return true;
  }

  async renewSSL(domain: string): Promise<boolean> {
    await this.makeRequest(`/ssl/${domain}/renew`, 'POST');
    return true;
  }

  async listBackups(resourceId: string): Promise<BackupInfo[]> {
    return this.makeRequest<BackupInfo[]>(`/backups?site=${resourceId}`);
  }

  async createBackup(resourceId: string, type: BackupInfo['type']): Promise<BackupInfo> {
    return this.makeRequest<BackupInfo>('/backups', 'POST', {
      siteId: resourceId,
      type,
    });
  }

  async restoreBackup(backupId: string): Promise<boolean> {
    await this.makeRequest(`/backups/${backupId}/restore`, 'POST');
    return true;
  }

  async getResourceUsage(accountId: string): Promise<{
    cpu: number;
    ram: number;
    disk: number;
    bandwidth: number;
  }> {
    return this.makeRequest(`/hosting/sites/${accountId}/metrics`);
  }
}
