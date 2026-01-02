import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  CreditCard, 
  DollarSign, 
  Settings,
  Check,
  AlertCircle,
  Shield,
  Smartphone,
  Globe,
  RefreshCw,
} from "lucide-react";
import { useState } from "react";
import { PaymentProvider, EnvironmentMode, TEST_KEYS } from "@/lib/payments/types";

// Admin Payment Configuration - Toggle between test and live modes

interface PaymentGatewayConfig {
  provider: PaymentProvider;
  displayName: string;
  logo: string;
  isEnabled: boolean;
  mode: EnvironmentMode;
  publicKey: string;
  secretKey: string;
  webhookSecret?: string;
  supportedCurrencies: string[];
}

const defaultConfigs: PaymentGatewayConfig[] = [
  {
    provider: 'stripe',
    displayName: 'Stripe',
    logo: '💳',
    isEnabled: true,
    mode: 'test',
    publicKey: TEST_KEYS.stripe.publicKey,
    secretKey: '••••••••••••',
    webhookSecret: '',
    supportedCurrencies: ['USD', 'EUR', 'GBP', 'NGN'],
  },
  {
    provider: 'paystack',
    displayName: 'Paystack',
    logo: '🏦',
    isEnabled: true,
    mode: 'test',
    publicKey: TEST_KEYS.paystack.publicKey,
    secretKey: '••••••••••••',
    webhookSecret: '',
    supportedCurrencies: ['NGN', 'GHS', 'ZAR', 'KES'],
  },
  {
    provider: 'flutterwave',
    displayName: 'Flutterwave',
    logo: '🦋',
    isEnabled: false,
    mode: 'test',
    publicKey: TEST_KEYS.flutterwave.publicKey,
    secretKey: '••••••••••••',
    webhookSecret: '',
    supportedCurrencies: ['NGN', 'GHS', 'KES', 'TZS', 'UGX', 'USD'],
  },
  {
    provider: 'mobilemoney',
    displayName: 'Mobile Money',
    logo: '📱',
    isEnabled: false,
    mode: 'test',
    publicKey: TEST_KEYS.mobilemoney.publicKey,
    secretKey: '••••••••••••',
    webhookSecret: '',
    supportedCurrencies: ['KES', 'TZS', 'UGX', 'GHS', 'XOF'],
  },
];

export function AdminPaymentSettings() {
  const [configs, setConfigs] = useState<PaymentGatewayConfig[]>(defaultConfigs);
  const [selectedProvider, setSelectedProvider] = useState<PaymentProvider>('stripe');
  const [showSecrets, setShowSecrets] = useState(false);

  const selectedConfig = configs.find(c => c.provider === selectedProvider)!;

  const handleToggleEnabled = (provider: PaymentProvider) => {
    setConfigs(prev => prev.map(c => 
      c.provider === provider ? { ...c, isEnabled: !c.isEnabled } : c
    ));
  };

  const handleToggleMode = (provider: PaymentProvider, mode: EnvironmentMode) => {
    setConfigs(prev => prev.map(c => 
      c.provider === provider ? { ...c, mode } : c
    ));
  };

  const handleUpdateKey = (provider: PaymentProvider, keyType: 'publicKey' | 'secretKey' | 'webhookSecret', value: string) => {
    setConfigs(prev => prev.map(c =>
      c.provider === provider ? { ...c, [keyType]: value } : c
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Payment Gateway Settings</h1>
        <p className="text-muted-foreground">
          Configure payment providers with test or live API keys
        </p>
      </div>

      {/* Quick Status */}
      <div className="grid grid-cols-4 gap-4">
        {configs.map((config) => (
          <Card key={config.provider} className={`${config.isEnabled ? 'border-primary/50' : 'opacity-60'}`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">{config.logo}</span>
                <Badge 
                  variant={config.mode === 'test' ? 'secondary' : 'default'}
                  className={config.mode === 'live' ? 'bg-green-500' : ''}
                >
                  {config.mode.toUpperCase()}
                </Badge>
              </div>
              <h4 className="font-semibold">{config.displayName}</h4>
              <p className="text-sm text-muted-foreground">
                {config.isEnabled ? 'Active' : 'Disabled'}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Configuration Panel */}
      <Card className="bg-card/50 backdrop-blur">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Gateway Configuration</CardTitle>
            <Select value={selectedProvider} onValueChange={(v) => setSelectedProvider(v as PaymentProvider)}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {configs.map((config) => (
                  <SelectItem key={config.provider} value={config.provider}>
                    <span className="flex items-center gap-2">
                      <span>{config.logo}</span>
                      {config.displayName}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Enable/Disable */}
          <div className="flex items-center justify-between p-4 rounded-lg border border-border">
            <div>
              <h4 className="font-semibold">Enable {selectedConfig.displayName}</h4>
              <p className="text-sm text-muted-foreground">
                Allow payments through this gateway
              </p>
            </div>
            <Switch
              checked={selectedConfig.isEnabled}
              onCheckedChange={() => handleToggleEnabled(selectedProvider)}
            />
          </div>

          {/* Mode Toggle */}
          <div className="p-4 rounded-lg border border-border">
            <h4 className="font-semibold mb-3">Environment Mode</h4>
            <div className="flex gap-2">
              <Button
                variant={selectedConfig.mode === 'test' ? 'default' : 'outline'}
                onClick={() => handleToggleMode(selectedProvider, 'test')}
                className="flex-1"
              >
                <Shield className="h-4 w-4 mr-2" />
                Test Mode
              </Button>
              <Button
                variant={selectedConfig.mode === 'live' ? 'default' : 'outline'}
                onClick={() => handleToggleMode(selectedProvider, 'live')}
                className="flex-1 bg-green-500 hover:bg-green-600"
              >
                <Globe className="h-4 w-4 mr-2" />
                Live Mode
              </Button>
            </div>
            {selectedConfig.mode === 'test' && (
              <p className="text-sm text-muted-foreground mt-2 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                Using test keys - no real payments will be processed
              </p>
            )}
            {selectedConfig.mode === 'live' && (
              <p className="text-sm text-green-500 mt-2 flex items-center gap-1">
                <Check className="h-3 w-3" />
                Live mode - real payments will be processed
              </p>
            )}
          </div>

          {/* API Keys */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold">API Keys</h4>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowSecrets(!showSecrets)}
              >
                {showSecrets ? 'Hide' : 'Show'} Secrets
              </Button>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="publicKey">Public Key (Publishable)</Label>
                <Input
                  id="publicKey"
                  value={selectedConfig.publicKey}
                  onChange={(e) => handleUpdateKey(selectedProvider, 'publicKey', e.target.value)}
                  placeholder={`${selectedProvider}_pk_...`}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="secretKey">Secret Key</Label>
                <Input
                  id="secretKey"
                  type={showSecrets ? 'text' : 'password'}
                  value={selectedConfig.secretKey}
                  onChange={(e) => handleUpdateKey(selectedProvider, 'secretKey', e.target.value)}
                  placeholder={`${selectedProvider}_sk_...`}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="webhookSecret">Webhook Secret (Optional)</Label>
                <Input
                  id="webhookSecret"
                  type={showSecrets ? 'text' : 'password'}
                  value={selectedConfig.webhookSecret}
                  onChange={(e) => handleUpdateKey(selectedProvider, 'webhookSecret', e.target.value)}
                  placeholder={`${selectedProvider}_wh_...`}
                />
              </div>
            </div>
          </div>

          {/* Supported Currencies */}
          <div className="space-y-2">
            <h4 className="font-semibold">Supported Currencies</h4>
            <div className="flex flex-wrap gap-2">
              {selectedConfig.supportedCurrencies.map((currency) => (
                <Badge key={currency} variant="secondary">
                  {currency}
                </Badge>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between">
            <Button variant="outline" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Test Connection
            </Button>
            <Button className="gap-2">
              <Check className="h-4 w-4" />
              Save Configuration
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Mobile Money Providers (if selected) */}
      {selectedProvider === 'mobilemoney' && (
        <Card className="bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5 text-primary" />
              Mobile Money Providers
            </CardTitle>
            <CardDescription>
              Enable specific mobile money networks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { name: 'M-Pesa Kenya', code: 'mpesa_ke', country: '🇰🇪' },
                { name: 'M-Pesa Tanzania', code: 'mpesa_tz', country: '🇹🇿' },
                { name: 'MTN Ghana', code: 'mtn_gh', country: '🇬🇭' },
                { name: 'MTN Uganda', code: 'mtn_ug', country: '🇺🇬' },
                { name: 'MTN Nigeria', code: 'mtn_ng', country: '🇳🇬' },
                { name: 'Airtel Nigeria', code: 'airtel_ng', country: '🇳🇬' },
                { name: 'Vodafone Ghana', code: 'vodafone_gh', country: '🇬🇭' },
                { name: 'Orange Ivory Coast', code: 'orange_ci', country: '🇨🇮' },
                { name: 'Wave Senegal', code: 'wave_sn', country: '🇸🇳' },
              ].map((provider) => (
                <div
                  key={provider.code}
                  className="flex items-center justify-between p-3 rounded-lg border border-border"
                >
                  <div className="flex items-center gap-2">
                    <span>{provider.country}</span>
                    <span className="text-sm">{provider.name}</span>
                  </div>
                  <Switch defaultChecked={['mpesa_ke', 'mtn_gh', 'mtn_ng'].includes(provider.code)} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default AdminPaymentSettings;
