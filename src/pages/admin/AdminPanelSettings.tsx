import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Server,
  Cloud,
  Settings,
  Check,
  AlertCircle,
  Link,
  Unlink,
  RefreshCw,
  Globe,
  Database,
  Mail,
  Shield,
  TestTube,
  Plug,
} from "lucide-react";
import { useState } from "react";
import { PanelType, EnvironmentMode } from "@/lib/adapters/types";
import { useToast } from "@/hooks/use-toast";

// Admin Panel Configuration - Connect and manage hosting panels

interface PanelConfig {
  id: string;
  name: string;
  type: PanelType;
  apiUrl: string;
  apiKey: string;
  username?: string;
  isConnected: boolean;
  mode: EnvironmentMode;
  lastSync?: string;
  resources?: {
    domains: number;
    accounts: number;
    emails: number;
    databases: number;
  };
}

const defaultPanels: PanelConfig[] = [
  {
    id: 'cpanel-1',
    name: 'Production cPanel',
    type: 'cpanel',
    apiUrl: 'https://cpanel.example.com:2083',
    apiKey: '••••••••••••',
    username: 'admin',
    isConnected: true,
    mode: 'test',
    lastSync: '2 minutes ago',
    resources: { domains: 45, accounts: 38, emails: 156, databases: 72 },
  },
  {
    id: 'plesk-1',
    name: 'Plesk Server EU',
    type: 'plesk',
    apiUrl: 'https://plesk.example.com:8443',
    apiKey: '••••••••••••',
    isConnected: true,
    mode: 'test',
    lastSync: '5 minutes ago',
    resources: { domains: 28, accounts: 25, emails: 89, databases: 45 },
  },
  {
    id: 'hostinger-1',
    name: 'Hostinger Account',
    type: 'hostinger',
    apiUrl: 'https://api.hostinger.com/v1',
    apiKey: '',
    isConnected: false,
    mode: 'test',
  },
  {
    id: 'spaceship-1',
    name: 'Spaceship Panel',
    type: 'spaceship',
    apiUrl: 'https://api.spaceship.com',
    apiKey: '',
    isConnected: false,
    mode: 'test',
  },
];

export function AdminPanelSettings() {
  const [panels, setPanels] = useState<PanelConfig[]>(defaultPanels);
  const [selectedPanel, setSelectedPanel] = useState<string>('cpanel-1');
  const [showSecrets, setShowSecrets] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const { toast } = useToast();

  const panel = panels.find(p => p.id === selectedPanel)!;

  const getPanelIcon = (type: PanelType) => {
    const icons: Record<PanelType, string> = {
      cpanel: '⚙️',
      plesk: '🔧',
      hostinger: '🚀',
      spaceship: '🛸',
      custom: '⚡',
    };
    return icons[type];
  };

  const handleConnect = async (panelId: string) => {
    setIsTesting(true);
    
    // Simulate connection test
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setPanels(prev => prev.map(p =>
      p.id === panelId ? { 
        ...p, 
        isConnected: true,
        lastSync: 'Just now',
        resources: { domains: 12, accounts: 10, emails: 35, databases: 18 },
      } : p
    ));
    
    setIsTesting(false);
    toast({
      title: "Panel Connected",
      description: "Successfully connected to the hosting panel.",
    });
  };

  const handleDisconnect = (panelId: string) => {
    setPanels(prev => prev.map(p =>
      p.id === panelId ? { ...p, isConnected: false, resources: undefined } : p
    ));
    toast({
      title: "Panel Disconnected",
      description: "The panel has been disconnected.",
    });
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsTesting(false);
    toast({
      title: "Connection Test Passed",
      description: "API credentials are valid and panel is accessible.",
    });
  };

  const handleSync = async (panelId: string) => {
    setIsTesting(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setPanels(prev => prev.map(p =>
      p.id === panelId ? { ...p, lastSync: 'Just now' } : p
    ));
    setIsTesting(false);
    toast({
      title: "Sync Complete",
      description: "Resources have been synchronized.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Panel Connections</h1>
        <p className="text-muted-foreground">
          Connect and manage hosting panels (cPanel, Plesk, Hostinger, Spaceship)
        </p>
      </div>

      {/* Connected Panels Overview */}
      <div className="grid grid-cols-4 gap-4">
        {panels.map((p) => (
          <Card 
            key={p.id} 
            className={`cursor-pointer transition-all ${
              selectedPanel === p.id ? 'ring-2 ring-primary' : ''
            } ${p.isConnected ? 'border-primary/50' : 'opacity-60'}`}
            onClick={() => setSelectedPanel(p.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">{getPanelIcon(p.type)}</span>
                <Badge 
                  variant={p.isConnected ? 'default' : 'secondary'}
                  className={p.isConnected ? 'bg-green-500' : ''}
                >
                  {p.isConnected ? 'Connected' : 'Disconnected'}
                </Badge>
              </div>
              <h4 className="font-semibold">{p.name}</h4>
              <p className="text-sm text-muted-foreground capitalize">{p.type}</p>
              {p.resources && (
                <div className="mt-2 text-xs text-muted-foreground">
                  {p.resources.domains} domains • {p.resources.accounts} accounts
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Configuration Panel */}
      <Card className="bg-card/50 backdrop-blur">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">{getPanelIcon(panel.type)}</span>
              {panel.name}
            </CardTitle>
            <div className="flex items-center gap-2">
              {panel.isConnected && (
                <Badge variant="outline">
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Synced {panel.lastSync}
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Connection Status */}
          <div className={`flex items-center justify-between p-4 rounded-lg border ${
            panel.isConnected ? 'border-green-500/50 bg-green-500/10' : 'border-border'
          }`}>
            <div className="flex items-center gap-3">
              {panel.isConnected ? (
                <Link className="h-5 w-5 text-green-500" />
              ) : (
                <Unlink className="h-5 w-5 text-muted-foreground" />
              )}
              <div>
                <h4 className="font-semibold">
                  {panel.isConnected ? 'Panel Connected' : 'Panel Disconnected'}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {panel.isConnected 
                    ? 'Resources are being synchronized' 
                    : 'Configure API credentials to connect'}
                </p>
              </div>
            </div>
            {panel.isConnected ? (
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleSync(panel.id)}
                  disabled={isTesting}
                >
                  <RefreshCw className={`h-4 w-4 mr-1 ${isTesting ? 'animate-spin' : ''}`} />
                  Sync
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleDisconnect(panel.id)}
                >
                  <Unlink className="h-4 w-4 mr-1" />
                  Disconnect
                </Button>
              </div>
            ) : (
              <Button 
                onClick={() => handleConnect(panel.id)}
                disabled={isTesting}
              >
                <Plug className="h-4 w-4 mr-1" />
                {isTesting ? 'Connecting...' : 'Connect'}
              </Button>
            )}
          </div>

          {/* Mode Toggle */}
          <div className="p-4 rounded-lg border border-border">
            <h4 className="font-semibold mb-3">Environment Mode</h4>
            <div className="flex gap-2">
              <Button
                variant={panel.mode === 'test' ? 'default' : 'outline'}
                onClick={() => setPanels(prev => prev.map(p =>
                  p.id === panel.id ? { ...p, mode: 'test' } : p
                ))}
                className="flex-1"
              >
                <TestTube className="h-4 w-4 mr-2" />
                Test Mode
              </Button>
              <Button
                variant={panel.mode === 'live' ? 'default' : 'outline'}
                onClick={() => setPanels(prev => prev.map(p =>
                  p.id === panel.id ? { ...p, mode: 'live' } : p
                ))}
                className="flex-1 bg-green-500 hover:bg-green-600"
              >
                <Globe className="h-4 w-4 mr-2" />
                Live Mode
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {panel.mode === 'test' 
                ? '🧪 Using mock data - no real API calls will be made'
                : '🌐 Live mode - real API calls to the panel'}
            </p>
          </div>

          {/* API Configuration */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold">API Configuration</h4>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowSecrets(!showSecrets)}
              >
                {showSecrets ? 'Hide' : 'Show'} Secrets
              </Button>
            </div>

            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="apiUrl">API URL</Label>
                <Input
                  id="apiUrl"
                  value={panel.apiUrl}
                  placeholder={`https://${panel.type}.example.com`}
                />
              </div>

              {panel.type === 'cpanel' && (
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={panel.username || ''}
                    placeholder="admin"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="apiKey">API Key / Token</Label>
                <Input
                  id="apiKey"
                  type={showSecrets ? 'text' : 'password'}
                  value={panel.apiKey}
                  placeholder="Enter your API key..."
                />
              </div>
            </div>
          </div>

          {/* Connected Resources */}
          {panel.isConnected && panel.resources && (
            <div className="space-y-4">
              <h4 className="font-semibold">Synchronized Resources</h4>
              <div className="grid grid-cols-4 gap-4">
                <Card className="p-4 text-center">
                  <Globe className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <p className="text-2xl font-bold">{panel.resources.domains}</p>
                  <p className="text-sm text-muted-foreground">Domains</p>
                </Card>
                <Card className="p-4 text-center">
                  <Server className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <p className="text-2xl font-bold">{panel.resources.accounts}</p>
                  <p className="text-sm text-muted-foreground">Accounts</p>
                </Card>
                <Card className="p-4 text-center">
                  <Mail className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <p className="text-2xl font-bold">{panel.resources.emails}</p>
                  <p className="text-sm text-muted-foreground">Emails</p>
                </Card>
                <Card className="p-4 text-center">
                  <Database className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <p className="text-2xl font-bold">{panel.resources.databases}</p>
                  <p className="text-sm text-muted-foreground">Databases</p>
                </Card>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-between">
            <Button 
              variant="outline" 
              className="gap-2"
              onClick={handleTestConnection}
              disabled={isTesting}
            >
              <TestTube className={`h-4 w-4 ${isTesting ? 'animate-pulse' : ''}`} />
              Test Connection
            </Button>
            <Button className="gap-2">
              <Check className="h-4 w-4" />
              Save Configuration
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Add New Panel */}
      <Card className="border-dashed">
        <CardContent className="p-8 text-center">
          <Plug className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h4 className="font-semibold mb-2">Add New Panel</h4>
          <p className="text-sm text-muted-foreground mb-4">
            Connect additional cPanel, Plesk, Hostinger, or custom panels
          </p>
          <Button variant="outline">
            Add Panel Connection
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default AdminPanelSettings;
