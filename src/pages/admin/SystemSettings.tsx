import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Settings, 
  Database, 
  Mail, 
  Shield, 
  Globe, 
  Server,
  Zap,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { useSystemSettings, useSaveSettingsGroup, getSettingValue } from "@/hooks/useSystemSettings";
import { toast } from "sonner";

const SystemSettings = () => {
  const { data: allSettings, isLoading } = useSystemSettings();
  const saveSettings = useSaveSettingsGroup();

  // General settings state
  const [general, setGeneral] = useState({
    platform_name: "CheetiHost",
    support_email: "support@cheetihost.com",
    default_region: "US-East-1",
    allow_registration: true,
    require_email_verification: true,
  });

  // Resource limits state
  const [resources, setResources] = useState({
    max_cpu: "32",
    max_ram: "128",
    max_storage: "1000",
    max_bandwidth: "10",
  });

  // SMTP state
  const [smtp, setSmtp] = useState({
    host: "smtp.cheetihost.com",
    port: "587",
    encryption: "TLS",
    username: "noreply@cheetihost.com",
    password: "",
  });

  // Security state
  const [security, setSecurity] = useState({
    require_2fa_admin: true,
    ip_whitelist: false,
    ddos_protection: true,
    session_timeout: "30",
    max_login_attempts: "5",
  });

  // API state
  const [api, setApi] = useState({
    public_access: true,
    rate_limit: "1000",
    docs_url: "https://docs.cheetihost.com/api",
  });

  // Maintenance state
  const [maintenance, setMaintenance] = useState({
    enabled: false,
    message: "We're performing scheduled maintenance. We'll be back shortly!",
    estimated_end: "",
  });

  // Hydrate state from DB
  useEffect(() => {
    if (!allSettings) return;
    setGeneral({
      platform_name: getSettingValue(allSettings, "platform_name", "CheetiHost"),
      support_email: getSettingValue(allSettings, "support_email", "support@cheetihost.com"),
      default_region: getSettingValue(allSettings, "default_region", "US-East-1"),
      allow_registration: getSettingValue(allSettings, "allow_registration", true),
      require_email_verification: getSettingValue(allSettings, "require_email_verification", true),
    });
    setResources({
      max_cpu: getSettingValue(allSettings, "max_cpu", "32"),
      max_ram: getSettingValue(allSettings, "max_ram", "128"),
      max_storage: getSettingValue(allSettings, "max_storage", "1000"),
      max_bandwidth: getSettingValue(allSettings, "max_bandwidth", "10"),
    });
    setSmtp({
      host: getSettingValue(allSettings, "smtp_host", "smtp.cheetihost.com"),
      port: getSettingValue(allSettings, "smtp_port", "587"),
      encryption: getSettingValue(allSettings, "smtp_encryption", "TLS"),
      username: getSettingValue(allSettings, "smtp_username", "noreply@cheetihost.com"),
      password: "",
    });
    setSecurity({
      require_2fa_admin: getSettingValue(allSettings, "require_2fa_admin", true),
      ip_whitelist: getSettingValue(allSettings, "ip_whitelist", false),
      ddos_protection: getSettingValue(allSettings, "ddos_protection", true),
      session_timeout: getSettingValue(allSettings, "session_timeout", "30"),
      max_login_attempts: getSettingValue(allSettings, "max_login_attempts", "5"),
    });
    setApi({
      public_access: getSettingValue(allSettings, "api_public_access", true),
      rate_limit: getSettingValue(allSettings, "api_rate_limit", "1000"),
      docs_url: getSettingValue(allSettings, "api_docs_url", "https://docs.cheetihost.com/api"),
    });
    setMaintenance({
      enabled: getSettingValue(allSettings, "maintenance_enabled", false),
      message: getSettingValue(allSettings, "maintenance_message", "We're performing scheduled maintenance. We'll be back shortly!"),
      estimated_end: getSettingValue(allSettings, "maintenance_estimated_end", ""),
    });
  }, [allSettings]);

  const handleSaveGeneral = () => {
    saveSettings.mutate([
      { key: "platform_name", value: general.platform_name, category: "general" },
      { key: "support_email", value: general.support_email, category: "general" },
      { key: "default_region", value: general.default_region, category: "general" },
      { key: "allow_registration", value: general.allow_registration, category: "general" },
      { key: "require_email_verification", value: general.require_email_verification, category: "general" },
    ]);
  };

  const handleSaveResources = () => {
    saveSettings.mutate([
      { key: "max_cpu", value: resources.max_cpu, category: "resources" },
      { key: "max_ram", value: resources.max_ram, category: "resources" },
      { key: "max_storage", value: resources.max_storage, category: "resources" },
      { key: "max_bandwidth", value: resources.max_bandwidth, category: "resources" },
    ]);
  };

  const handleSaveSmtp = () => {
    const settings: { key: string; value: string; category: string }[] = [
      { key: "smtp_host", value: smtp.host, category: "email" },
      { key: "smtp_port", value: smtp.port, category: "email" },
      { key: "smtp_encryption", value: smtp.encryption, category: "email" },
      { key: "smtp_username", value: smtp.username, category: "email" },
    ];
    if (smtp.password) {
      settings.push({ key: "smtp_password", value: smtp.password, category: "email" });
    }
    saveSettings.mutate(settings);
  };

  const handleSaveSecurity = () => {
    saveSettings.mutate([
      { key: "require_2fa_admin", value: security.require_2fa_admin, category: "security" },
      { key: "ip_whitelist", value: security.ip_whitelist, category: "security" },
      { key: "ddos_protection", value: security.ddos_protection, category: "security" },
      { key: "session_timeout", value: security.session_timeout, category: "security" },
      { key: "max_login_attempts", value: security.max_login_attempts, category: "security" },
    ]);
  };

  const handleSaveApi = () => {
    saveSettings.mutate([
      { key: "api_public_access", value: api.public_access, category: "api" },
      { key: "api_rate_limit", value: api.rate_limit, category: "api" },
      { key: "api_docs_url", value: api.docs_url, category: "api" },
    ]);
  };

  const handleToggleMaintenance = () => {
    const newEnabled = !maintenance.enabled;
    setMaintenance(prev => ({ ...prev, enabled: newEnabled }));
    saveSettings.mutate([
      { key: "maintenance_enabled", value: newEnabled, category: "maintenance" },
      { key: "maintenance_message", value: maintenance.message, category: "maintenance" },
      { key: "maintenance_estimated_end", value: maintenance.estimated_end, category: "maintenance" },
    ]);
  };

  const isSaving = saveSettings.isPending;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-5 w-96" />
        </div>
        <Skeleton className="h-12 w-full max-w-3xl" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold mb-2">System Settings</h1>
        <p className="text-muted-foreground">
          Configure platform-wide settings and integrations
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid grid-cols-5 w-full max-w-3xl">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="api">API</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          <Card className="bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle>Platform Settings</CardTitle>
              <CardDescription>Basic configuration for CheetiHost platform</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="platformName">Platform Name</Label>
                <Input
                  id="platformName"
                  value={general.platform_name}
                  onChange={(e) => setGeneral(p => ({ ...p, platform_name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="supportEmail">Support Email</Label>
                <Input
                  id="supportEmail"
                  type="email"
                  value={general.support_email}
                  onChange={(e) => setGeneral(p => ({ ...p, support_email: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="defaultRegion">Default Deployment Region</Label>
                <Input
                  id="defaultRegion"
                  value={general.default_region}
                  onChange={(e) => setGeneral(p => ({ ...p, default_region: e.target.value }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold">New User Registrations</h4>
                  <p className="text-sm text-muted-foreground">Allow new users to create accounts</p>
                </div>
                <Switch
                  checked={general.allow_registration}
                  onCheckedChange={(v) => setGeneral(p => ({ ...p, allow_registration: v }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold">Email Verification Required</h4>
                  <p className="text-sm text-muted-foreground">Require email verification for new accounts</p>
                </div>
                <Switch
                  checked={general.require_email_verification}
                  onCheckedChange={(v) => setGeneral(p => ({ ...p, require_email_verification: v }))}
                />
              </div>
              <Button onClick={handleSaveGeneral} disabled={isSaving} className="bg-primary">
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle>Resource Limits</CardTitle>
              <CardDescription>Default resource allocations for new deployments</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="maxCPU">Max CPU Cores</Label>
                  <Input
                    id="maxCPU"
                    type="number"
                    value={resources.max_cpu}
                    onChange={(e) => setResources(p => ({ ...p, max_cpu: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxRAM">Max RAM (GB)</Label>
                  <Input
                    id="maxRAM"
                    type="number"
                    value={resources.max_ram}
                    onChange={(e) => setResources(p => ({ ...p, max_ram: e.target.value }))}
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="maxStorage">Max Storage (GB)</Label>
                  <Input
                    id="maxStorage"
                    type="number"
                    value={resources.max_storage}
                    onChange={(e) => setResources(p => ({ ...p, max_storage: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxBandwidth">Max Bandwidth (TB)</Label>
                  <Input
                    id="maxBandwidth"
                    type="number"
                    value={resources.max_bandwidth}
                    onChange={(e) => setResources(p => ({ ...p, max_bandwidth: e.target.value }))}
                  />
                </div>
              </div>
              <Button onClick={handleSaveResources} disabled={isSaving} className="bg-primary">
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Update Limits
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Email Settings */}
        <TabsContent value="email" className="space-y-6">
          <Card className="bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle>SMTP Configuration</CardTitle>
              <CardDescription>Configure email delivery settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="smtpHost">SMTP Host</Label>
                <Input
                  id="smtpHost"
                  value={smtp.host}
                  onChange={(e) => setSmtp(p => ({ ...p, host: e.target.value }))}
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="smtpPort">SMTP Port</Label>
                  <Input
                    id="smtpPort"
                    type="number"
                    value={smtp.port}
                    onChange={(e) => setSmtp(p => ({ ...p, port: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtpEncryption">Encryption</Label>
                  <Input
                    id="smtpEncryption"
                    value={smtp.encryption}
                    onChange={(e) => setSmtp(p => ({ ...p, encryption: e.target.value }))}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="smtpUser">SMTP Username</Label>
                <Input
                  id="smtpUser"
                  value={smtp.username}
                  onChange={(e) => setSmtp(p => ({ ...p, username: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="smtpPassword">SMTP Password</Label>
                <Input
                  id="smtpPassword"
                  type="password"
                  placeholder="••••••••"
                  value={smtp.password}
                  onChange={(e) => setSmtp(p => ({ ...p, password: e.target.value }))}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSaveSmtp} disabled={isSaving} className="bg-primary">
                  {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save SMTP Settings
                </Button>
                <Button variant="outline" onClick={() => toast.info("SMTP test connection initiated")}>
                  Test Connection
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle>Email Templates</CardTitle>
              <CardDescription>Manage transactional email templates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {[
                  { name: "Welcome Email", status: "Active" },
                  { name: "Password Reset", status: "Active" },
                  { name: "Invoice Receipt", status: "Active" },
                  { name: "Service Downtime Alert", status: "Active" },
                ].map((template, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 rounded-lg border border-border bg-background/50"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Mail className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{template.name}</h4>
                        <p className="text-sm text-muted-foreground">Status: {template.status}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Edit</Button>
                      <Button variant="outline" size="sm">Preview</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-6">
          <Card className="bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle>Security Policies</CardTitle>
              <CardDescription>Configure platform security settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold">Two-Factor Authentication</h4>
                  <p className="text-sm text-muted-foreground">Require 2FA for all admin accounts</p>
                </div>
                <Switch
                  checked={security.require_2fa_admin}
                  onCheckedChange={(v) => setSecurity(p => ({ ...p, require_2fa_admin: v }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold">IP Whitelist</h4>
                  <p className="text-sm text-muted-foreground">Enable IP whitelisting for admin panel</p>
                </div>
                <Switch
                  checked={security.ip_whitelist}
                  onCheckedChange={(v) => setSecurity(p => ({ ...p, ip_whitelist: v }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold">DDoS Protection</h4>
                  <p className="text-sm text-muted-foreground">Advanced DDoS mitigation enabled</p>
                </div>
                <Switch
                  checked={security.ddos_protection}
                  onCheckedChange={(v) => setSecurity(p => ({ ...p, ddos_protection: v }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                <Input
                  id="sessionTimeout"
                  type="number"
                  value={security.session_timeout}
                  onChange={(e) => setSecurity(p => ({ ...p, session_timeout: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                <Input
                  id="maxLoginAttempts"
                  type="number"
                  value={security.max_login_attempts}
                  onChange={(e) => setSecurity(p => ({ ...p, max_login_attempts: e.target.value }))}
                />
              </div>
              <Button onClick={handleSaveSecurity} disabled={isSaving} className="bg-primary">
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Update Security Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* API Settings */}
        <TabsContent value="api" className="space-y-6">
          <Card className="bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle>API Configuration</CardTitle>
              <CardDescription>Manage API access and rate limits</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="apiVersion">API Version</Label>
                <Input id="apiVersion" defaultValue="v1" disabled />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold">Public API Access</h4>
                  <p className="text-sm text-muted-foreground">Allow external API access</p>
                </div>
                <Switch
                  checked={api.public_access}
                  onCheckedChange={(v) => setApi(p => ({ ...p, public_access: v }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rateLimit">Rate Limit (requests/hour)</Label>
                <Input
                  id="rateLimit"
                  type="number"
                  value={api.rate_limit}
                  onChange={(e) => setApi(p => ({ ...p, rate_limit: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="apiDocs">API Documentation URL</Label>
                <Input
                  id="apiDocs"
                  value={api.docs_url}
                  onChange={(e) => setApi(p => ({ ...p, docs_url: e.target.value }))}
                />
              </div>
              <Button onClick={handleSaveApi} disabled={isSaving} className="bg-primary">
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save API Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Maintenance Settings */}
        <TabsContent value="maintenance" className="space-y-6">
          <Card className="bg-card/50 backdrop-blur border-accent/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-accent" />
                Maintenance Mode
              </CardTitle>
              <CardDescription>Enable maintenance mode for platform updates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-background/50">
                <div>
                  <h4 className="font-semibold">Maintenance Mode</h4>
                  <p className="text-sm text-muted-foreground">Temporarily disable user access</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge
                    variant="outline"
                    className={maintenance.enabled
                      ? "bg-destructive/10 text-destructive"
                      : "bg-primary/10 text-primary"
                    }
                  >
                    {maintenance.enabled ? "Enabled" : "Disabled"}
                  </Badge>
                  <Switch
                    checked={maintenance.enabled}
                    onCheckedChange={() => handleToggleMaintenance()}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="maintenanceMessage">Maintenance Message</Label>
                <Input
                  id="maintenanceMessage"
                  value={maintenance.message}
                  onChange={(e) => setMaintenance(p => ({ ...p, message: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="estimatedEnd">Estimated End Time</Label>
                <Input
                  id="estimatedEnd"
                  type="datetime-local"
                  value={maintenance.estimated_end}
                  onChange={(e) => setMaintenance(p => ({ ...p, estimated_end: e.target.value }))}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle>System Health</CardTitle>
              <CardDescription>Monitor platform performance and status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg border border-border bg-background/50">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Server className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Server Status</p>
                      <p className="text-xl font-bold">Online</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 rounded-lg border border-border bg-background/50">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                      <Database className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Database Status</p>
                      <p className="text-xl font-bold">Healthy</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SystemSettings;
