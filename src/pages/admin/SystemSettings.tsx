import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Settings, 
  Database, 
  Mail, 
  Shield, 
  Globe, 
  Server,
  Zap,
  AlertTriangle,
} from "lucide-react";

const SystemSettings = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold mb-2">System Settings</h1>
        <p className="text-muted-foreground">
          Configure platform-wide settings and integrations
        </p>
      </div>

      {/* Main Content */}
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
                <Input id="platformName" defaultValue="CheetiHost" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="supportEmail">Support Email</Label>
                <Input id="supportEmail" type="email" defaultValue="support@cheetihost.com" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="defaultRegion">Default Deployment Region</Label>
                <Input id="defaultRegion" defaultValue="US-East-1" />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold">New User Registrations</h4>
                  <p className="text-sm text-muted-foreground">
                    Allow new users to create accounts
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold">Email Verification Required</h4>
                  <p className="text-sm text-muted-foreground">
                    Require email verification for new accounts
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <Button className="bg-primary">Save Changes</Button>
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
                  <Input id="maxCPU" type="number" defaultValue="32" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxRAM">Max RAM (GB)</Label>
                  <Input id="maxRAM" type="number" defaultValue="128" />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="maxStorage">Max Storage (GB)</Label>
                  <Input id="maxStorage" type="number" defaultValue="1000" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxBandwidth">Max Bandwidth (TB)</Label>
                  <Input id="maxBandwidth" type="number" defaultValue="10" />
                </div>
              </div>

              <Button className="bg-primary">Update Limits</Button>
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
                <Input id="smtpHost" defaultValue="smtp.cheetihost.com" />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="smtpPort">SMTP Port</Label>
                  <Input id="smtpPort" type="number" defaultValue="587" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtpEncryption">Encryption</Label>
                  <Input id="smtpEncryption" defaultValue="TLS" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="smtpUser">SMTP Username</Label>
                <Input id="smtpUser" defaultValue="noreply@cheetihost.com" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="smtpPassword">SMTP Password</Label>
                <Input id="smtpPassword" type="password" placeholder="••••••••" />
              </div>

              <div className="flex gap-2">
                <Button className="bg-primary">Save SMTP Settings</Button>
                <Button variant="outline">Test Connection</Button>
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
                  <p className="text-sm text-muted-foreground">
                    Require 2FA for all admin accounts
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold">IP Whitelist</h4>
                  <p className="text-sm text-muted-foreground">
                    Enable IP whitelisting for admin panel
                  </p>
                </div>
                <Switch />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold">DDoS Protection</h4>
                  <p className="text-sm text-muted-foreground">
                    Advanced DDoS mitigation enabled
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                <Input id="sessionTimeout" type="number" defaultValue="30" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                <Input id="maxLoginAttempts" type="number" defaultValue="5" />
              </div>

              <Button className="bg-primary">Update Security Settings</Button>
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
                  <p className="text-sm text-muted-foreground">
                    Allow external API access
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rateLimit">Rate Limit (requests/hour)</Label>
                <Input id="rateLimit" type="number" defaultValue="1000" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="apiDocs">API Documentation URL</Label>
                <Input id="apiDocs" defaultValue="https://docs.cheetihost.com/api" />
              </div>

              <Button className="bg-primary">Save API Settings</Button>
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
                  <p className="text-sm text-muted-foreground">
                    Temporarily disable user access
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="bg-primary/10 text-primary">
                    Active
                  </Badge>
                  <Switch />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="maintenanceMessage">Maintenance Message</Label>
                <Input
                  id="maintenanceMessage"
                  defaultValue="We're performing scheduled maintenance. We'll be back shortly!"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="estimatedEnd">Estimated End Time</Label>
                <Input id="estimatedEnd" type="datetime-local" />
              </div>

              <Button variant="destructive">Enable Maintenance Mode</Button>
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

              <Button variant="outline" className="w-full">
                View Full System Diagnostics
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SystemSettings;
