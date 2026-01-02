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
  CloudInstance,
} from '../types';

// Hostinger Adapter - hPanel API implementation
export class HostingerAdapter extends BasePanelAdapter {
  constructor(credentials: PanelCredentials) {
    super(credentials);
  }

  protected getMockResponse<T>(endpoint: string, method: string): T {
    const mockData: Record<string, unknown> = {
      '/v1/domains': [
        {
          id: 'hostinger_domain_1',
          name: 'hostinger-site.com',
          status: 'active',
          registrar: 'Hostinger',
          expiresAt: '2026-03-15',
          autoRenew: true,
          privacy: true,
          dnsRecords: [
            { id: 'dns_1', type: 'A', name: '@', value: '185.199.108.153', ttl: 3600 },
          ],
          ssl: { status: 'active', issuer: "Let's Encrypt", autoRenew: true },
          panelId: this.credentials.id,
        },
      ],
      '/v1/hosting': [
        {
          id: 'hostinger_acc_1',
          domain: 'hostinger-site.com',
          username: 'u123456789',
          status: 'active',
          plan: 'Premium Web Hosting',
          diskUsage: 8000,
          diskLimit: 100000,
          bandwidthUsage: 150000,
          bandwidthLimit: -1, // Unlimited
          cpuUsage: 15,
          ramUsage: 256,
          databases: 10,
          emails: 50,
          panelId: this.credentials.id,
          panelType: 'hostinger',
        },
      ],
      '/v1/email': [
        {
          id: 'hmail_1',
          email: 'contact@hostinger-site.com',
          domain: 'hostinger-site.com',
          quota: 5120,
          used: 1024,
          status: 'active',
          panelId: this.credentials.id,
        },
      ],
      '/v1/vps': [
        {
          id: 'hvps_1',
          name: 'vps-kvm-1',
          status: 'running',
          type: 'KVM 1',
          region: 'Netherlands',
          cpu: 1,
          ram: 1024,
          storage: 20,
          ipAddress: '185.199.108.200',
          os: 'Ubuntu 22.04',
          createdAt: new Date().toISOString(),
          monthlyCost: 4.99,
          panelId: this.credentials.id,
        },
      ],
      '/v1/auth/verify': { valid: true },
      '/v1/auth/token': { authenticated: true, token: 'hostinger_test_token' },
    };

    const key = Object.keys(mockData).find(k => endpoint.includes(k));
    return (key ? mockData[key] : { success: true }) as T;
  }

  async authenticate(): Promise<boolean> {
    try {
      const response = await this.makeRequest<{ authenticated: boolean }>('/v1/auth/token', 'POST');
      this.isAuthenticated = response.authenticated;
      this.log('Hostinger authentication successful');
      return this.isAuthenticated;
    } catch (error) {
      this.log('Hostinger authentication failed', error);
      return false;
    }
  }

  async validateCredentials(): Promise<boolean> {
    try {
      const response = await this.makeRequest<{ valid: boolean }>('/v1/auth/verify');
      return response.valid;
    } catch {
      return false;
    }
  }

  async listDomains(): Promise<DomainInfo[]> {
    return this.makeRequest<DomainInfo[]>('/v1/domains');
  }

  async getDomain(id: string): Promise<DomainInfo> {
    return this.makeRequest<DomainInfo>(`/v1/domains/${id}`);
  }

  async createDomain(domain: Partial<DomainInfo>): Promise<DomainInfo> {
    return this.makeRequest<DomainInfo>('/v1/domains', 'POST', domain);
  }

  async updateDNS(domainId: string, records: DNSRecord[]): Promise<boolean> {
    await this.makeRequest(`/v1/domains/${domainId}/dns-zone`, 'PUT', { records });
    return true;
  }

  async transferDomain(domainId: string, authCode: string): Promise<MigrationTask> {
    return this.makeRequest<MigrationTask>('/v1/domains/transfer', 'POST', {
      domainId,
      authCode,
    });
  }

  async listHostingAccounts(): Promise<HostingAccount[]> {
    return this.makeRequest<HostingAccount[]>('/v1/hosting');
  }

  async getHostingAccount(id: string): Promise<HostingAccount> {
    return this.makeRequest<HostingAccount>(`/v1/hosting/${id}`);
  }

  async createHostingAccount(account: Partial<HostingAccount>): Promise<HostingAccount> {
    return this.makeRequest<HostingAccount>('/v1/hosting', 'POST', account);
  }

  async suspendAccount(id: string): Promise<boolean> {
    await this.makeRequest(`/v1/hosting/${id}/suspend`, 'POST');
    return true;
  }

  async unsuspendAccount(id: string): Promise<boolean> {
    await this.makeRequest(`/v1/hosting/${id}/unsuspend`, 'POST');
    return true;
  }

  async listEmailAccounts(domain: string): Promise<EmailAccount[]> {
    return this.makeRequest<EmailAccount[]>(`/v1/email/${domain}`);
  }

  async createEmailAccount(email: Partial<EmailAccount>): Promise<EmailAccount> {
    return this.makeRequest<EmailAccount>('/v1/email', 'POST', email);
  }

  async deleteEmailAccount(id: string): Promise<boolean> {
    await this.makeRequest(`/v1/email/${id}`, 'DELETE');
    return true;
  }

  async getSSLStatus(domain: string): Promise<SSLInfo> {
    return this.makeRequest<SSLInfo>(`/v1/ssl/${domain}`);
  }

  async installSSL(domain: string): Promise<boolean> {
    await this.makeRequest(`/v1/ssl/${domain}/install`, 'POST');
    return true;
  }

  async renewSSL(domain: string): Promise<boolean> {
    await this.makeRequest(`/v1/ssl/${domain}/renew`, 'POST');
    return true;
  }

  async listBackups(resourceId: string): Promise<BackupInfo[]> {
    return this.makeRequest<BackupInfo[]>(`/v1/backups/${resourceId}`);
  }

  async createBackup(resourceId: string, type: BackupInfo['type']): Promise<BackupInfo> {
    return this.makeRequest<BackupInfo>('/v1/backups', 'POST', {
      hostingId: resourceId,
      type,
    });
  }

  async restoreBackup(backupId: string): Promise<boolean> {
    await this.makeRequest(`/v1/backups/${backupId}/restore`, 'POST');
    return true;
  }

  async getResourceUsage(accountId: string): Promise<{
    cpu: number;
    ram: number;
    disk: number;
    bandwidth: number;
  }> {
    return this.makeRequest(`/v1/hosting/${accountId}/usage`);
  }

  // Hostinger VPS support
  async listInstances(): Promise<CloudInstance[]> {
    return this.makeRequest<CloudInstance[]>('/v1/vps');
  }

  async createInstance(config: Partial<CloudInstance>): Promise<CloudInstance> {
    return this.makeRequest<CloudInstance>('/v1/vps', 'POST', config);
  }

  async deleteInstance(id: string): Promise<boolean> {
    await this.makeRequest(`/v1/vps/${id}`, 'DELETE');
    return true;
  }
}
