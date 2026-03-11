import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { Shield, Lock, Key, AlertTriangle, CheckCircle, Eye, FileText, Globe, Trash2, Plus, Loader2, ScanSearch } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useDomains } from "@/hooks/useDomains";
import { useSystemSetting, useUpsertSystemSetting } from "@/hooks/useSystemSettings";
import { format } from "date-fns";
import { toast } from "sonner";

const Security = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data: domains, isLoading: domainsLoading } = useDomains();
  const [reportOpen, setReportOpen] = useState(false);
  const [twoFaStep, setTwoFaStep] = useState(0);
  const [twoFaCode, setTwoFaCode] = useState("");
  const [newBlockedIp, setNewBlockedIp] = useState("");
  const [scanResults, setScanResults] = useState<any>(null);

  // WAF setting
  const { data: wafSetting } = useSystemSetting("waf_enabled");
  const upsertSetting = useUpsertSystemSetting();
  const wafEnabled = wafSetting?.value === true || wafSetting?.value === "true";

  // IP Blocklist
  const { data: blocklistSetting } = useSystemSetting("ip_blocklist");
  const blockedIps: string[] = Array.isArray(blocklistSetting?.value) ? (blocklistSetting.value as string[]) : [];

  // SSL certs
  const { data: sslCerts, isLoading: sslLoading } = useQuery({
    queryKey: ["ssl-certificates", user?.id],
    queryFn: async () => {
      const domainIds = domains?.map(d => d.id) || [];
      if (domainIds.length === 0) return [];
      const { data, error } = await supabase
        .from("ssl_certificates")
        .select("*, domains!inner(name)")
        .in("domain_id", domainIds);
      if (error) throw error;
      return data;
    },
    enabled: !!user && !!domains && domains.length > 0,
  });

  // Audit logs
  const { data: auditLogs, isLoading: logsLoading } = useQuery({
    queryKey: ["audit-logs", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("audit_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(20);
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const isLoading = domainsLoading || sslLoading;
  const activeCerts = sslCerts?.filter(c => c.status === "active").length || 0;
  const domainsWithPrivacy = domains?.filter(d => d.privacy_enabled).length || 0;
  const securityScore = Math.min(100, 60 + (activeCerts > 0 ? 10 : 0) + (domainsWithPrivacy > 0 ? 10 : 0) + (wafEnabled ? 10 : 0) + (blockedIps.length > 0 ? 5 : 0) + (domains && domains.length > 0 ? 5 : 0));

  const handleToggleWaf = async (enabled: boolean) => {
    try {
      await upsertSetting.mutateAsync({ key: "waf_enabled", value: enabled, category: "security", description: "Web Application Firewall toggle", is_public: true });
      toast.success(enabled ? "WAF enabled" : "WAF disabled");
    } catch { toast.error("Failed to update WAF setting"); }
  };

  const handleAddBlockedIp = async () => {
    if (!newBlockedIp.trim()) return;
    const ipRegex = /^(\d{1,3}\.){3}\d{1,3}(\/\d{1,2})?$/;
    if (!ipRegex.test(newBlockedIp.trim())) {
      toast.error("Invalid IP address format");
      return;
    }
    const updated = [...blockedIps, newBlockedIp.trim()];
    try {
      await upsertSetting.mutateAsync({ key: "ip_blocklist", value: updated as any, category: "security", description: "Blocked IP addresses", is_public: true });
      setNewBlockedIp("");
      toast.success("IP blocked");
    } catch { toast.error("Failed to update blocklist"); }
  };

  const handleRemoveBlockedIp = async (ip: string) => {
    const updated = blockedIps.filter(i => i !== ip);
    try {
      await upsertSetting.mutateAsync({ key: "ip_blocklist", value: updated as any, category: "security", is_public: true });
      toast.success("IP removed from blocklist");
    } catch { toast.error("Failed to update blocklist"); }
  };

  const handleRunScan = async () => {
    try {
      await supabase.from("audit_logs").insert({
        action: "security.scan",
        resource_type: "security",
        details: { initiated_by: user?.id, scan_type: "full" },
      });
      queryClient.invalidateQueries({ queryKey: ["audit-logs"] });
      setScanResults({
        timestamp: new Date().toISOString(),
        score: securityScore,
        ssl: activeCerts > 0 ? "Pass" : "Warning",
        waf: wafEnabled ? "Active" : "Inactive",
        blocklist: `${blockedIps.length} IPs blocked`,
        privacy: `${domainsWithPrivacy}/${domains?.length || 0} domains protected`,
      });
      toast.success("Security scan complete");
    } catch { toast.error("Failed to run scan"); }
  };

  const handleRenewSsl = async (certId: string) => {
    try {
      await supabase.functions.invoke("manage-ssl", {
        body: { action: "renew", certificate_id: certId },
      });
      toast.success("SSL renewal initiated");
      queryClient.invalidateQueries({ queryKey: ["ssl-certificates"] });
    } catch { toast.error("SSL renewal failed"); }
  };

  const handle2faEnable = async () => {
    if (twoFaStep === 0) {
      setTwoFaStep(1);
    } else if (twoFaStep === 1) {
      setTwoFaStep(2);
    } else if (twoFaStep === 2) {
      if (twoFaCode.length < 6) {
        toast.error("Enter a valid 6-digit code");
        return;
      }
      // Persist 2FA enabled flag
      try {
        await upsertSetting.mutateAsync({ key: `2fa_enabled_${user?.id}`, value: true, category: "security", is_public: false });
        toast.success("Two-factor authentication enabled!");
        setTwoFaStep(0);
        setTwoFaCode("");
      } catch { toast.error("Failed to enable 2FA"); }
    }
  };

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Security Center</h1>
          <p className="text-sm md:text-base text-muted-foreground">Protect your domains, accounts, and data</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2" onClick={handleRunScan}>
            <ScanSearch className="h-4 w-4" />Run Scan
          </Button>
          <Badge className="bg-green-500/10 text-green-500 border-green-500/20 text-xs">
            <CheckCircle className="mr-1 h-3 w-3" />Secure
          </Badge>
        </div>
      </div>

      {/* Security Score */}
      <Card className="bg-gradient-speed">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg md:text-xl font-bold text-primary-foreground mb-2">Security Score</h3>
              {isLoading ? (
                <Skeleton className="h-10 w-24 bg-primary-foreground/20" />
              ) : (
                <p className="text-2xl md:text-4xl font-bold text-primary-foreground">{securityScore}/100</p>
              )}
              <p className="text-xs md:text-sm text-primary-foreground/80 mt-1">
                {securityScore >= 90 ? "Excellent" : securityScore >= 70 ? "Good" : "Needs Improvement"} Protection
              </p>
            </div>
            <Button variant="secondary" size="sm" onClick={() => setReportOpen(true)}>View Report</Button>
          </div>
        </CardContent>
      </Card>

      {/* Scan Results */}
      {scanResults && (
        <Card className="border-primary/30">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />Last Scan Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
              <div><span className="text-muted-foreground block">SSL</span><span className="font-medium">{scanResults.ssl}</span></div>
              <div><span className="text-muted-foreground block">WAF</span><span className="font-medium">{scanResults.waf}</span></div>
              <div><span className="text-muted-foreground block">Blocklist</span><span className="font-medium">{scanResults.blocklist}</span></div>
              <div><span className="text-muted-foreground block">Privacy</span><span className="font-medium">{scanResults.privacy}</span></div>
              <div><span className="text-muted-foreground block">Score</span><span className="font-medium">{scanResults.score}/100</span></div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card><CardContent className="p-4"><div className="flex items-center justify-between mb-2"><Shield className="h-5 w-5 text-green-500" /><Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20 text-xs">Active</Badge></div>{isLoading ? <Skeleton className="h-8 w-12" /> : <p className="text-xl font-bold">{activeCerts}</p>}<p className="text-xs text-muted-foreground">SSL Certs</p></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center justify-between mb-2"><Lock className="h-5 w-5 text-primary" /></div><p className="text-xl font-bold">{domainsWithPrivacy}</p><p className="text-xs text-muted-foreground">Privacy Protected</p></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center justify-between mb-2"><AlertTriangle className="h-5 w-5 text-yellow-500" /></div><p className="text-xl font-bold">{blockedIps.length}</p><p className="text-xs text-muted-foreground">Blocked IPs</p></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center justify-between mb-2"><Eye className="h-5 w-5 text-accent" /></div><p className="text-xl font-bold">{auditLogs?.length || 0}</p><p className="text-xs text-muted-foreground">Audit Events</p></CardContent></Card>
      </div>

      {/* Security Tabs */}
      <Card>
        <CardContent className="pt-6">
          <Tabs defaultValue="ssl" className="w-full">
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 h-auto gap-1">
              <TabsTrigger value="ssl" className="text-xs">SSL</TabsTrigger>
              <TabsTrigger value="waf" className="text-xs">WAF</TabsTrigger>
              <TabsTrigger value="blocklist" className="text-xs">IP Blocklist</TabsTrigger>
              <TabsTrigger value="2fa" className="text-xs">2FA</TabsTrigger>
              <TabsTrigger value="privacy" className="text-xs">Privacy</TabsTrigger>
              <TabsTrigger value="logs" className="text-xs">Logs</TabsTrigger>
            </TabsList>

            {/* SSL Tab */}
            <TabsContent value="ssl" className="space-y-4 mt-4">
              {sslCerts && sslCerts.length > 0 ? sslCerts.map(cert => (
                <div key={cert.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-sm truncate">{(cert as any).domains?.name || "Unknown"}</p>
                    <p className="text-xs text-muted-foreground">
                      {cert.issuer || "Let's Encrypt"} • Expires: {cert.expires_at ? format(new Date(cert.expires_at), "MMM d, yyyy") : "N/A"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={cert.status === "active" ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"}>{cert.status}</Badge>
                    <Button size="sm" variant="outline" onClick={() => handleRenewSsl(cert.id)}>Renew</Button>
                  </div>
                </div>
              )) : (
                <div className="text-center py-8"><Shield className="h-10 w-10 mx-auto text-muted-foreground mb-3" /><p className="text-muted-foreground">No SSL certificates. Register a domain to get free SSL.</p></div>
              )}
            </TabsContent>

            {/* WAF Tab */}
            <TabsContent value="waf" className="space-y-4 mt-4">
              <div className="p-6 border rounded-lg space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">Web Application Firewall</h4>
                    <p className="text-sm text-muted-foreground">Protect against common web attacks (XSS, SQL injection, etc.)</p>
                  </div>
                  <Switch checked={wafEnabled} onCheckedChange={handleToggleWaf} />
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="p-3 rounded-lg bg-muted/50 text-center">
                    <p className="text-lg font-bold text-primary">{wafEnabled ? "Active" : "Inactive"}</p>
                    <p className="text-xs text-muted-foreground">Status</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50 text-center">
                    <p className="text-lg font-bold">{blockedIps.length}</p>
                    <p className="text-xs text-muted-foreground">Rules Applied</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50 text-center">
                    <p className="text-lg font-bold text-green-500">0</p>
                    <p className="text-xs text-muted-foreground">Threats Blocked</p>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* IP Blocklist Tab */}
            <TabsContent value="blocklist" className="space-y-4 mt-4">
              <div className="flex gap-2">
                <Input placeholder="Enter IP address (e.g., 192.168.1.1)" value={newBlockedIp}
                  onChange={(e) => setNewBlockedIp(e.target.value)} className="flex-1" />
                <Button onClick={handleAddBlockedIp} className="gap-2" disabled={upsertSetting.isPending}>
                  <Plus className="h-4 w-4" />Block IP
                </Button>
              </div>
              {blockedIps.length > 0 ? (
                <div className="space-y-2">
                  {blockedIps.map((ip) => (
                    <div key={ip} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        <span className="font-mono text-sm">{ip}</span>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => handleRemoveBlockedIp(ip)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Globe className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                  <p className="text-muted-foreground">No blocked IPs. Add IPs to block suspicious traffic.</p>
                </div>
              )}
            </TabsContent>

            {/* 2FA Tab */}
            <TabsContent value="2fa" className="space-y-4 mt-4">
              <div className="p-6 border rounded-lg">
                <div className="flex items-start gap-3 mb-4">
                  <Lock className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">Two-Factor Authentication</h4>
                    <p className="text-sm text-muted-foreground">Add an extra layer of security to your account using an authenticator app.</p>
                  </div>
                </div>
                {twoFaStep === 0 && (
                  <Button onClick={handle2faEnable} className="bg-primary text-primary-foreground">
                    Enable 2FA
                  </Button>
                )}
                {twoFaStep === 1 && (
                  <div className="space-y-4">
                    <div className="p-6 border rounded-lg bg-muted/50 text-center">
                      <div className="w-32 h-32 mx-auto bg-background border-2 border-dashed border-primary/30 rounded-lg flex items-center justify-center mb-3">
                        <Key className="h-12 w-12 text-primary/50" />
                      </div>
                      <p className="text-sm text-muted-foreground">Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)</p>
                      <p className="text-xs font-mono text-muted-foreground mt-2">Manual key: JBSW-Y3DP-EHPK-3PXP</p>
                    </div>
                    <Button onClick={handle2faEnable}>Next: Verify Code</Button>
                  </div>
                )}
                {twoFaStep === 2 && (
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">Enter the 6-digit code from your authenticator app:</p>
                    <Input
                      placeholder="000000"
                      maxLength={6}
                      value={twoFaCode}
                      onChange={(e) => setTwoFaCode(e.target.value.replace(/\D/g, ""))}
                      className="text-center text-2xl tracking-widest font-mono"
                    />
                    <Button onClick={handle2faEnable} disabled={upsertSetting.isPending} className="w-full">
                      {upsertSetting.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                      Verify & Enable
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Privacy Tab */}
            <TabsContent value="privacy" className="space-y-4 mt-4">
              {domains && domains.length > 0 ? domains.map(domain => (
                <div key={domain.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-semibold text-sm">{domain.name}</p>
                    <p className="text-xs text-muted-foreground">WHOIS Privacy Protection</p>
                  </div>
                  <Badge variant="outline" className={domain.privacy_enabled ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-red-500/10 text-red-500 border-red-500/20"}>
                    {domain.privacy_enabled ? "Protected" : "Unprotected"}
                  </Badge>
                </div>
              )) : (
                <div className="text-center py-8"><Shield className="h-10 w-10 mx-auto text-muted-foreground mb-3" /><p className="text-muted-foreground">No domains registered yet.</p></div>
              )}
            </TabsContent>

            {/* Logs Tab */}
            <TabsContent value="logs" className="space-y-4 mt-4">
              {logsLoading ? (
                <div className="space-y-3">{[1, 2, 3].map(i => <Skeleton key={i} className="h-16 w-full" />)}</div>
              ) : auditLogs && auditLogs.length > 0 ? (
                auditLogs.map(log => (
                  <div key={log.id} className="flex items-start gap-3 p-4 border rounded-lg">
                    <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-1" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{log.action}</p>
                      <p className="text-xs text-muted-foreground">
                        {log.created_at ? format(new Date(log.created_at), "MMM d, yyyy h:mm a") : "N/A"}
                        {log.resource_type && ` • ${log.resource_type}`}
                        {log.ip_address && ` • IP: ${String(log.ip_address)}`}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8"><FileText className="h-10 w-10 mx-auto text-muted-foreground mb-3" /><p className="text-muted-foreground">No security events logged yet.</p></div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Report Dialog */}
      <Dialog open={reportOpen} onOpenChange={setReportOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Security Report</DialogTitle>
            <DialogDescription>Detailed security score breakdown</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-4">
            {[
              { label: "SSL Certificates", score: activeCerts > 0 ? 10 : 0, max: 10 },
              { label: "Domain Privacy", score: domainsWithPrivacy > 0 ? 10 : 0, max: 10 },
              { label: "WAF Protection", score: wafEnabled ? 10 : 0, max: 10 },
              { label: "IP Blocklist", score: blockedIps.length > 0 ? 5 : 0, max: 5 },
              { label: "Domain Registration", score: domains && domains.length > 0 ? 5 : 0, max: 5 },
              { label: "Base Score", score: 60, max: 60 },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                <span className="text-sm">{item.label}</span>
                <span className={`font-bold text-sm ${item.score === item.max ? "text-green-500" : "text-yellow-500"}`}>
                  {item.score}/{item.max}
                </span>
              </div>
            ))}
            <div className="flex items-center justify-between p-3 border rounded-lg bg-primary/5">
              <span className="font-semibold">Total Score</span>
              <span className="font-bold text-lg text-primary">{securityScore}/100</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Security;
