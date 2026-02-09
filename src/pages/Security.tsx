import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Shield, Lock, Key, AlertTriangle, CheckCircle, Eye, FileText } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useDomains } from "@/hooks/useDomains";
import { format } from "date-fns";

const Security = () => {
  const { user } = useAuth();
  const { data: domains, isLoading: domainsLoading } = useDomains();

  // Fetch SSL certificates for user's domains
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

  // Fetch recent audit logs
  const { data: auditLogs, isLoading: logsLoading } = useQuery({
    queryKey: ["audit-logs", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("audit_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10);
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const isLoading = domainsLoading || sslLoading;
  const activeCerts = sslCerts?.filter(c => c.status === "active").length || 0;
  const domainsWithPrivacy = domains?.filter(d => d.privacy_enabled).length || 0;
  const totalDomains = domains?.length || 0;
  const securityScore = Math.min(100, 60 + (activeCerts > 0 ? 15 : 0) + (domainsWithPrivacy > 0 ? 15 : 0) + (totalDomains > 0 ? 10 : 0));

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2 break-words">Security Center</h1>
          <p className="text-sm md:text-base text-muted-foreground break-words">
            Protect your domains, products, accounts, and data
          </p>
        </div>
        <Badge className="w-fit bg-green-500/10 text-green-500 border-green-500/20 text-xs whitespace-nowrap">
          <CheckCircle className="mr-1 h-3 w-3" />
          All Systems Secure
        </Badge>
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
            <Button variant="secondary" size="sm" className="w-full sm:w-auto whitespace-nowrap">
              View Report
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Security Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between mb-2">
              <Shield className="h-5 w-5 text-green-500 flex-shrink-0" />
              <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20 text-xs">Active</Badge>
            </div>
            {isLoading ? <Skeleton className="h-8 w-12" /> : <p className="text-xl md:text-2xl font-bold truncate">{activeCerts}</p>}
            <p className="text-xs md:text-sm text-muted-foreground truncate">SSL Certificates</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between mb-2">
              <Lock className="h-5 w-5 text-primary flex-shrink-0" />
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-xs">Enabled</Badge>
            </div>
            <p className="text-xl md:text-2xl font-bold truncate">{domainsWithPrivacy}</p>
            <p className="text-xs md:text-sm text-muted-foreground truncate">Privacy Protected</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between mb-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0" />
              <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20 text-xs">Low</Badge>
            </div>
            <p className="text-xl md:text-2xl font-bold truncate">{auditLogs?.length || 0}</p>
            <p className="text-xs md:text-sm text-muted-foreground truncate">Audit Events</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between mb-2">
              <Eye className="h-5 w-5 text-accent flex-shrink-0" />
              <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20 text-xs">Monitoring</Badge>
            </div>
            <p className="text-xl md:text-2xl font-bold truncate">24/7</p>
            <p className="text-xs md:text-sm text-muted-foreground truncate">Active Monitoring</p>
          </CardContent>
        </Card>
      </div>

      {/* Security Tabs */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg md:text-xl truncate">Security Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="ssl" className="w-full">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 h-auto gap-2">
              <TabsTrigger value="ssl" className="text-xs md:text-sm whitespace-nowrap">SSL Certificates</TabsTrigger>
              <TabsTrigger value="2fa" className="text-xs md:text-sm whitespace-nowrap">Two-Factor Auth</TabsTrigger>
              <TabsTrigger value="privacy" className="text-xs md:text-sm whitespace-nowrap">Domain Privacy</TabsTrigger>
              <TabsTrigger value="logs" className="text-xs md:text-sm whitespace-nowrap">Security Logs</TabsTrigger>
            </TabsList>

            <TabsContent value="ssl" className="space-y-4 mt-4">
              {sslLoading ? (
                <div className="space-y-3">{[1,2].map(i => <Skeleton key={i} className="h-16 w-full" />)}</div>
              ) : sslCerts && sslCerts.length > 0 ? (
                sslCerts.map((cert) => (
                  <div key={cert.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 md:p-4 border rounded-lg gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-sm md:text-base truncate">{(cert as any).domains?.name || "Unknown"}</p>
                      <p className="text-xs md:text-sm text-muted-foreground">
                        Expires: {cert.expires_at ? format(new Date(cert.expires_at), "MMM d, yyyy") : "N/A"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Badge variant="outline" className={`text-xs whitespace-nowrap ${
                        cert.status === "active" ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                      }`}>{cert.status}</Badge>
                      <Button size="sm" variant="outline" className="whitespace-nowrap">Renew</Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Shield className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                  <p className="text-muted-foreground">No SSL certificates found. Register a domain to get free SSL.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="2fa" className="space-y-4 mt-4">
              <div className="p-4 md:p-6 border rounded-lg">
                <div className="flex items-start gap-3 mb-4">
                  <Lock className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm md:text-base mb-1">Two-Factor Authentication</h4>
                    <p className="text-xs md:text-sm text-muted-foreground break-words">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                </div>
                <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">Enable 2FA</Button>
              </div>
            </TabsContent>

            <TabsContent value="privacy" className="space-y-4 mt-4">
              {domainsLoading ? (
                <div className="space-y-3">{[1,2].map(i => <Skeleton key={i} className="h-16 w-full" />)}</div>
              ) : domains && domains.length > 0 ? (
                domains.map((domain) => (
                  <div key={domain.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 md:p-4 border rounded-lg gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-sm md:text-base truncate">{domain.name}</p>
                      <p className="text-xs md:text-sm text-muted-foreground">WHOIS Privacy Protection</p>
                    </div>
                    <Badge variant="outline" className={`text-xs whitespace-nowrap ${
                      domain.privacy_enabled ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-red-500/10 text-red-500 border-red-500/20"
                    }`}>{domain.privacy_enabled ? "Protected" : "Unprotected"}</Badge>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Shield className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                  <p className="text-muted-foreground">No domains registered yet.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="logs" className="space-y-4 mt-4">
              {logsLoading ? (
                <div className="space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-16 w-full" />)}</div>
              ) : auditLogs && auditLogs.length > 0 ? (
                auditLogs.map((log) => (
                  <div key={log.id} className="flex items-start gap-3 p-3 md:p-4 border rounded-lg">
                    <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-1" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm md:text-base break-words">{log.action}</p>
                      <p className="text-xs text-muted-foreground">
                        {log.created_at ? format(new Date(log.created_at), "MMM d, yyyy h:mm a") : "N/A"}
                        {log.resource_type && ` • ${log.resource_type}`}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                  <p className="text-muted-foreground">No security events logged yet.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Security;
