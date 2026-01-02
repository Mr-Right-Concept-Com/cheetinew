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

// Plesk Adapter - Full implementation for Plesk API
export class PleskAdapter extends BasePanelAdapter {
  constructor(credentials: PanelCredentials) {
    super(credentials);
  }

  protected getMockResponse<T>(endpoint: string, method: string): T {
    const mockData: Record<string, unknown> = {
      '/api/webspaces': [
        {
          id: 'plesk_domain_1',
          name: 'mysite.com',
          status: 'active',
          registrar: 'Plesk',
          expiresAt: '2025-11-30',
          autoRenew: true,
          privacy: false,
          dnsRecords: [],
          ssl: { status: 'active', autoRenew: true },
          panelId: this.credentials.id,
        },
      ],
      '/api/subscriptions': [
        {
          id: 'plesk_acc_1',
          domain: 'mysite.com',
          username: 'mysiteadmin',
          status: 'active',
          plan: 'Business',
          diskUsage: 5000,
          diskLimit: 25000,
          bandwidthUsage: 75000,
          bandwidthLimit: 200000,
          cpuUsage: 40,
          ramUsage: 1024,
          databases: 5,
          emails: 25,
          panelId: this.credentials.id,
          panelType: 'plesk',
        },
      ],
      '/api/mail': [
        {
          id: 'plesk_email_1',
          email: 'admin@mysite.com',
          domain: 'mysite.com',
          quota: 2048,
          used: 512,
          status: 'active',
          panelId: this.credentials.id,
        },
      ],
      '/api/servers': [
        {
          id: 'plesk_vm_1',
          name: 'webserver-01',
          status: 'running',
          type: 'VPS Basic',
          region: 'EU-West',
          cpu: 2,
          ram: 4096,
          storage: 50,
          ipAddress: '192.168.1.100',
          os: 'Ubuntu 22.04',
          createdAt: new Date().toISOString(),
          monthlyCost: 15.00,
          panelId: this.credentials.id,
        },
      ],
      '/api/authenticate': { authenticated: true },
      '/api/validate': { valid: true },
    };

    const key = Object.keys(mockData).find(k => endpoint.includes(k));
    return (key ? mockData[key] : { success: true }) as T;
  }

  async authenticate(): Promise<boolean> {
    try {
      const response = await this.makeRequest<{ authenticated: boolean }>('/api/authenticate', 'POST');
      this.isAuthenticated = response.authenticated;
      this.log('Plesk authentication successful');
      return this.isAuthenticated;
    } catch (error) {
      this.log('Plesk authentication failed', error);
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
    return this.makeRequest<DomainInfo[]>('/api/webspaces');
  }

  async getDomain(id: string): Promise<DomainInfo> {
    return this.makeRequest<DomainInfo>(`/api/webspaces/${id}`);
  }

  async createDomain(domain: Partial<DomainInfo>): Promise<DomainInfo> {
    return this.makeRequest<DomainInfo>('/api/webspaces', 'POST', domain);
  }

  async updateDNS(domainId: string, records: DNSRecord[]): Promise<boolean> {
    await this.makeRequest(`/api/webspaces/${domainId}/dns`, 'PUT', { records });
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
    return this.makeRequest<HostingAccount[]>('/api/subscriptions');
  }

  async getHostingAccount(id: string): Promise<HostingAccount> {
    return this.makeRequest<HostingAccount>(`/api/subscriptions/${id}`);
  }

  async createHostingAccount(account: Partial<HostingAccount>): Promise<HostingAccount> {
    return this.makeRequest<HostingAccount>('/api/subscriptions', 'POST', account);
  }

  async suspendAccount(id: string): Promise<boolean> {
    await this.makeRequest(`/api/subscriptions/${id}/suspend`, 'POST');
    return true;
  }

  async unsuspendAccount(id: string): Promise<boolean> {
    await this.makeRequest(`/api/subscriptions/${id}/activate`, 'POST');
    return true;
  }

  async listEmailAccounts(domain: string): Promise<EmailAccount[]> {
    return this.makeRequest<EmailAccount[]>(`/api/mail?domain=${domain}`);
  }

  async createEmailAccount(email: Partial<EmailAccount>): Promise<EmailAccount> {
    return this.makeRequest<EmailAccount>('/api/mail', 'POST', email);
  }

  async deleteEmailAccount(id: string): Promise<boolean> {
    await this.makeRequest(`/api/mail/${id}`, 'DELETE');
    return true;
  }

  async getSSLStatus(domain: string): Promise<SSLInfo> {
    return this.makeRequest<SSLInfo>(`/api/certificates/${domain}`);
  }

  async installSSL(domain: string): Promise<boolean> {
    await this.makeRequest(`/api/certificates/${domain}/install`, 'POST');
    return true;
  }

  async renewSSL(domain: string): Promise<boolean> {
    await this.makeRequest(`/api/certificates/${domain}/renew`, 'POST');
    return true;
  }

  async listBackups(resourceId: string): Promise<BackupInfo[]> {
    return this.makeRequest<BackupInfo[]>(`/api/backup-manager?subscription=${resourceId}`);
  }

  async createBackup(resourceId: string, type: BackupInfo['type']): Promise<BackupInfo> {
    return this.makeRequest<BackupInfo>('/api/backup-manager', 'POST', {
      resourceId,
      type,
    });
  }

  async restoreBackup(backupId: string): Promise<boolean> {
    await this.makeRequest(`/api/backup-manager/${backupId}/restore`, 'POST');
    return true;
  }

  async getResourceUsage(accountId: string): Promise<{
    cpu: number;
    ram: number;
    disk: number;
    bandwidth: number;
  }> {
    return this.makeRequest(`/api/subscriptions/${accountId}/statistics`);
  }

  // Plesk supports cloud instances
  async listInstances(): Promise<CloudInstance[]> {
    return this.makeRequest<CloudInstance[]>('/api/servers');
  }

  async createInstance(config: Partial<CloudInstance>): Promise<CloudInstance> {
    return this.makeRequest<CloudInstance>('/api/servers', 'POST', config);
  }

  async deleteInstance(id: string): Promise<boolean> {
    await this.makeRequest(`/api/servers/${id}`, 'DELETE');
    return true;
  }
}
