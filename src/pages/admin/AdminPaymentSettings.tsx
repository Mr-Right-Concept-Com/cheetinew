import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Check,
  AlertCircle,
  Shield,
  Globe,
  RefreshCw,
  Smartphone,
  Eye,
  EyeOff,
  Loader2,
  Key,
} from "lucide-react";
import { useState } from "react";
import { PaymentProvider, TEST_KEYS } from "@/lib/payments/types";
import { 
  usePaymentGateways, 
  useUpdatePaymentGateway, 
  useToggleGatewayMode,
  useTestGatewayConnection,
  PaymentGatewaySettings 
} from "@/hooks/usePaymentGateways";

// Gateway logos/icons
const gatewayLogos: Record<PaymentProvider, string> = {
  stripe: '💳',
  paystack: '🏦',
  flutterwave: '🦋',
  mobilemoney: '📱',
};

export function AdminPaymentSettings() {
  const { gateways, isLoading } = usePaymentGateways();
  const updateGateway = useUpdatePaymentGateway();
  const toggleMode = useToggleGatewayMode();
  const testConnection = useTestGatewayConnection();

  const [selectedProvider, setSelectedProvider] = useState<PaymentProvider>('stripe');
  const [showSecrets, setShowSecrets] = useState(false);
  const [editingKeys, setEditingKeys] = useState<{
    publicKey: string;
    secretKey: string;
    webhookSecret: string;
  } | null>(null);
  const [showLiveKeyDialog, setShowLiveKeyDialog] = useState(false);
  const [liveKeys, setLiveKeys] = useState({
    publicKey: '',
    secretKey: '',
    webhookSecret: '',
  });

  const selectedConfig = gateways.find(c => c.provider === selectedProvider);

  const handleToggleEnabled = async (provider: PaymentProvider) => {
    const gateway = gateways.find(g => g.provider === provider);
    if (!gateway) return;

    await updateGateway.mutateAsync({
      id: gateway.id,
      provider,
      isActive: !gateway.isActive,
    });
  };

  const handleSwitchToLive = async () => {
    if (!selectedConfig) return;

    if (!liveKeys.publicKey || !liveKeys.secretKey) {
      return;
    }

    await toggleMode.mutateAsync({
      id: selectedConfig.id,
      provider: selectedProvider,
      mode: 'live',
      liveKeys: {
        publicKey: liveKeys.publicKey,
        secretKey: liveKeys.secretKey,
        webhookSecret: liveKeys.webhookSecret || undefined,
      },
    });

    setShowLiveKeyDialog(false);
    setLiveKeys({ publicKey: '', secretKey: '', webhookSecret: '' });
  };

  const handleSwitchToTest = async () => {
    if (!selectedConfig) return;

    await toggleMode.mutateAsync({
      id: selectedConfig.id,
      provider: selectedProvider,
      mode: 'test',
    });
  };

  const handleTestConnection = async () => {
    if (!selectedConfig) return;

    await testConnection.mutateAsync({
      provider: selectedProvider,
      publicKey: selectedConfig.publicKey,
    });
  };

  const handleSaveKeys = async () => {
    if (!selectedConfig || !editingKeys) return;

    await updateGateway.mutateAsync({
      id: selectedConfig.id,
      provider: selectedProvider,
      publicKey: editingKeys.publicKey,
      secretKey: editingKeys.secretKey,
      webhookSecret: editingKeys.webhookSecret,
    });

    setEditingKeys(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Payment Gateway Settings</h1>
        <p className="text-muted-foreground">
          Configure payment providers - using test keys by default. Paste live keys when ready to go live.
        </p>
      </div>

      {/* Quick Status */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {gateways.map((config) => (
          <Card 
            key={config.provider} 
            className={`cursor-pointer transition-all ${
              config.isActive ? 'border-primary/50 bg-primary/5' : 'opacity-60'
            } ${selectedProvider === config.provider ? 'ring-2 ring-primary' : ''}`}
            onClick={() => setSelectedProvider(config.provider)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">{gatewayLogos[config.provider]}</span>
                <Badge 
                  variant={config.mode === 'test' ? 'secondary' : 'default'}
                  className={config.mode === 'live' ? 'bg-green-500 hover:bg-green-600' : ''}
                >
                  {config.mode.toUpperCase()}
                </Badge>
              </div>
              <h4 className="font-semibold">{config.displayName}</h4>
              <p className="text-sm text-muted-foreground">
                {config.isActive ? 'Active' : 'Disabled'}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Configuration Panel */}
      {selectedConfig && (
        <Card className="bg-card/50 backdrop-blur">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{gatewayLogos[selectedProvider]}</span>
                <div>
                  <CardTitle>{selectedConfig.displayName} Configuration</CardTitle>
                  <CardDescription>
                    {selectedConfig.mode === 'test' 
                      ? 'Using demo test keys - no real payments processed'
                      : 'Live mode - real payments are being processed'
                    }
                  </CardDescription>
                </div>
              </div>
              <Select value={selectedProvider} onValueChange={(v) => setSelectedProvider(v as PaymentProvider)}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {gateways.map((config) => (
                    <SelectItem key={config.provider} value={config.provider}>
                      <span className="flex items-center gap-2">
                        <span>{gatewayLogos[config.provider]}</span>
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
                checked={selectedConfig.isActive}
                onCheckedChange={() => handleToggleEnabled(selectedProvider)}
                disabled={updateGateway.isPending}
              />
            </div>

            {/* Mode Toggle - Easy Live Switch */}
            <div className="p-4 rounded-lg border border-border">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-semibold">Environment Mode</h4>
                  <p className="text-sm text-muted-foreground">
                    Switch between test and live modes without rebuilding
                  </p>
                </div>
                <Badge variant={selectedConfig.mode === 'live' ? 'default' : 'secondary'} className={selectedConfig.mode === 'live' ? 'bg-green-500' : ''}>
                  {selectedConfig.mode === 'live' ? 'LIVE' : 'TEST'}
                </Badge>
              </div>

              <div className="flex gap-2">
                <Button
                  variant={selectedConfig.mode === 'test' ? 'default' : 'outline'}
                  onClick={handleSwitchToTest}
                  className="flex-1"
                  disabled={toggleMode.isPending}
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Test Mode
                </Button>

                <Dialog open={showLiveKeyDialog} onOpenChange={setShowLiveKeyDialog}>
                  <DialogTrigger asChild>
                    <Button
                      variant={selectedConfig.mode === 'live' ? 'default' : 'outline'}
                      className={`flex-1 ${selectedConfig.mode === 'live' ? 'bg-green-500 hover:bg-green-600' : ''}`}
                      disabled={toggleMode.isPending}
                    >
                      <Globe className="h-4 w-4 mr-2" />
                      Live Mode
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <Key className="h-5 w-5" />
                        Enter Live API Keys for {selectedConfig.displayName}
                      </DialogTitle>
                      <DialogDescription>
                        Paste your production API keys to enable live payments. No rebuild required.
                      </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="livePublicKey">Public Key (Publishable)</Label>
                        <Input
                          id="livePublicKey"
                          value={liveKeys.publicKey}
                          onChange={(e) => setLiveKeys(prev => ({ ...prev, publicKey: e.target.value }))}
                          placeholder={`pk_live_...`}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="liveSecretKey">Secret Key</Label>
                        <Input
                          id="liveSecretKey"
                          type="password"
                          value={liveKeys.secretKey}
                          onChange={(e) => setLiveKeys(prev => ({ ...prev, secretKey: e.target.value }))}
                          placeholder={`sk_live_...`}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="liveWebhookSecret">Webhook Secret (Optional)</Label>
                        <Input
                          id="liveWebhookSecret"
                          type="password"
                          value={liveKeys.webhookSecret}
                          onChange={(e) => setLiveKeys(prev => ({ ...prev, webhookSecret: e.target.value }))}
                          placeholder={`whsec_...`}
                        />
                      </div>
                    </div>

                    <DialogFooter>
                      <Button variant="outline" onClick={() => setShowLiveKeyDialog(false)}>
                        Cancel
                      </Button>
                      <Button 
                        onClick={handleSwitchToLive}
                        disabled={!liveKeys.publicKey || !liveKeys.secretKey || toggleMode.isPending}
                        variant="default"
                      >
                        {toggleMode.isPending ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Check className="h-4 w-4 mr-2" />
                        )}
                        Switch to Live
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              {selectedConfig.mode === 'test' && (
                <p className="text-sm text-muted-foreground mt-3 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  Using demo test keys - no real payments will be processed
                </p>
              )}
              {selectedConfig.mode === 'live' && (
                <p className="text-sm text-primary mt-3 flex items-center gap-1">
                  <Check className="h-3 w-3" />
                  Live mode active - real payments are being processed
                </p>
              )}
            </div>

            {/* API Keys Display */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">API Keys</h4>
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setShowSecrets(!showSecrets)}
                  >
                    {showSecrets ? <EyeOff className="h-4 w-4 mr-1" /> : <Eye className="h-4 w-4 mr-1" />}
                    {showSecrets ? 'Hide' : 'Show'}
                  </Button>
                  {!editingKeys && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setEditingKeys({
                        publicKey: selectedConfig.publicKey,
                        secretKey: '',
                        webhookSecret: '',
                      })}
                    >
                      <Key className="h-4 w-4 mr-1" />
                      Edit Keys
                    </Button>
                  )}
                </div>
              </div>

              {editingKeys ? (
                <div className="space-y-4 p-4 border border-dashed border-primary/50 rounded-lg">
                  <div className="space-y-2">
                    <Label htmlFor="publicKey">Public Key (Publishable)</Label>
                    <Input
                      id="publicKey"
                      value={editingKeys.publicKey}
                      onChange={(e) => setEditingKeys(prev => prev ? { ...prev, publicKey: e.target.value } : null)}
                      placeholder={`${selectedProvider}_pk_...`}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="secretKey">Secret Key</Label>
                    <Input
                      id="secretKey"
                      type={showSecrets ? 'text' : 'password'}
                      value={editingKeys.secretKey}
                      onChange={(e) => setEditingKeys(prev => prev ? { ...prev, secretKey: e.target.value } : null)}
                      placeholder={`${selectedProvider}_sk_...`}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="webhookSecret">Webhook Secret (Optional)</Label>
                    <Input
                      id="webhookSecret"
                      type={showSecrets ? 'text' : 'password'}
                      value={editingKeys.webhookSecret}
                      onChange={(e) => setEditingKeys(prev => prev ? { ...prev, webhookSecret: e.target.value } : null)}
                      placeholder={`${selectedProvider}_wh_...`}
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setEditingKeys(null)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSaveKeys} disabled={updateGateway.isPending}>
                      {updateGateway.isPending ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Check className="h-4 w-4 mr-2" />
                      )}
                      Save Keys
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Public Key</Label>
                    <div className="p-2 bg-muted rounded-md font-mono text-sm">
                      {showSecrets ? selectedConfig.publicKey : selectedConfig.publicKey.slice(0, 20) + '••••••••'}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Secret Key</Label>
                    <div className="p-2 bg-muted rounded-md font-mono text-sm">
                      {selectedConfig.secretKey || '(not set)'}
                    </div>
                  </div>
                </div>
              )}
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
            <div className="flex justify-between pt-4 border-t">
              <Button 
                variant="outline" 
                className="gap-2"
                onClick={handleTestConnection}
                disabled={testConnection.isPending}
              >
                {testConnection.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
                Test Connection
              </Button>
              <div className="text-sm text-muted-foreground">
                Changes are saved automatically
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Mobile Money Providers (if selected) */}
      {selectedProvider === 'mobilemoney' && selectedConfig && (
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
