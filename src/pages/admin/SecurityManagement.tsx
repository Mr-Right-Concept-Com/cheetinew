import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Shield, CheckCircle, Lock, Eye, Ban } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const SecurityManagement = () => {
  const { data: sslCerts, isLoading: sslLoading } = useQuery({
    queryKey: ["admin-ssl-certs-full"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ssl_certificates")
        .select("*, domains(name)")
        .order("created_at", { ascending: false });
      if (error) {
        const { data: fallback, error: fbError } = await supabase
          .from("ssl_certificates")
          .select("*")
          .order("created_at", { ascending: false });
        if (fbError) throw fbError;
        return fallback;
      }
      return data;
    },
  });

  const { data: auditLogs } = useQuery({
    queryKey: ["admin-recent-audit-logs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("audit_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(20);
      if (error) throw error;
      return data;
    },
  });

  const certs = sslCerts ?? [];
  const logs = auditLogs ?? [];
  const activeCerts = certs.filter(c => c.status === "active").length;
  const expiringCerts = certs.filter(c => {
    if (!c.expires_at) return false;
    const daysUntil = (new Date(c.expires_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
    return daysUntil <= 30 && daysUntil > 0;
  });

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2 break-words">Security Management</h1>
          <p className="text-sm md:text-base text-muted-foreground break-words">Monitor and manage platform security</p>
        </div>
        <Badge className="w-fit bg-green-500/10 text-green-500 border-green-500/20 text-xs whitespace-nowrap">
          <CheckCircle className="mr-1 h-3 w-3" />
          All Systems Secure
        </Badge>
      </div>

      {/* Security Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <Card>
          <CardContent className="p-4 md:p-6">
            <p className="text-xs md:text-sm text-muted-foreground mb-1 truncate">SSL Certificates</p>
            {sslLoading ? <Skeleton className="h-9 w-16" /> : <p className="text-2xl md:text-3xl font-bold truncate">{certs.length}</p>}
            <Badge variant="outline" className="mt-2 bg-green-500/10 text-green-500 border-green-500/20 text-xs whitespace-nowrap">
              {activeCerts} Active
            </Badge>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 md:p-6">
            <p className="text-xs md:text-sm text-muted-foreground mb-1 truncate">Expiring Soon</p>
            {sslLoading ? <Skeleton className="h-9 w-16" /> : <p className="text-2xl md:text-3xl font-bold truncate">{expiringCerts.length}</p>}
            {expiringCerts.length > 0 && (
              <Badge variant="outline" className="mt-2 bg-yellow-500/10 text-yellow-500 border-yellow-500/20 text-xs whitespace-nowrap">
                Next 30 days
              </Badge>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 md:p-6">
            <p className="text-xs md:text-sm text-muted-foreground mb-1 truncate">Audit Events</p>
            {sslLoading ? <Skeleton className="h-9 w-16" /> : <p className="text-2xl md:text-3xl font-bold truncate">{logs.length}</p>}
            <Badge variant="outline" className="mt-2 bg-primary/10 text-primary border-primary/20 text-xs whitespace-nowrap">
              Recent
            </Badge>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 md:p-6">
            <p className="text-xs md:text-sm text-muted-foreground mb-1 truncate">Security Score</p>
            <p className="text-2xl md:text-3xl font-bold truncate">
              {certs.length > 0 ? Math.round((activeCerts / certs.length) * 100) : 100}/100
            </p>
            <Badge variant="outline" className="mt-2 bg-green-500/10 text-green-500 border-green-500/20 text-xs whitespace-nowrap">
              {activeCerts === certs.length ? "Excellent" : "Needs Review"}
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Security Tabs */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg md:text-xl truncate">Security Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="ssl" className="w-full">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-3 h-auto gap-2">
              <TabsTrigger value="ssl" className="text-xs md:text-sm whitespace-nowrap">SSL Certificates</TabsTrigger>
              <TabsTrigger value="audit" className="text-xs md:text-sm whitespace-nowrap">Audit Log</TabsTrigger>
              <TabsTrigger value="monitoring" className="text-xs md:text-sm whitespace-nowrap">Monitoring</TabsTrigger>
            </TabsList>

            <TabsContent value="ssl" className="mt-4">
              {sslLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map(i => <Skeleton key={i} className="h-12 w-full" />)}
                </div>
              ) : certs.length === 0 ? (
                <div className="text-center py-12">
                  <Shield className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                  <p className="text-muted-foreground">No SSL certificates found</p>
                </div>
              ) : (
                <div className="overflow-x-auto -mx-4 sm:mx-0">
                  <div className="inline-block min-w-full align-middle">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="whitespace-nowrap">Domain</TableHead>
                          <TableHead className="whitespace-nowrap">Issuer</TableHead>
                          <TableHead className="whitespace-nowrap">Status</TableHead>
                          <TableHead className="whitespace-nowrap">Expiry</TableHead>
                          <TableHead className="whitespace-nowrap">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {certs.map((cert: any) => (
                          <TableRow key={cert.id}>
                            <TableCell className="font-medium">
                              <div className="truncate max-w-[150px] md:max-w-none">
                                {cert.domains?.name || cert.domain_id?.slice(0, 8) || "—"}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="truncate max-w-[120px] md:max-w-none">{cert.issuer || "—"}</div>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className={`whitespace-nowrap ${
                                  cert.status === "active"
                                    ? "bg-green-500/10 text-green-500 border-green-500/20"
                                    : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                                }`}
                              >
                                {cert.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="whitespace-nowrap">
                              {cert.expires_at ? new Date(cert.expires_at).toLocaleDateString() : "—"}
                            </TableCell>
                            <TableCell>
                              <Button size="sm" variant="outline" className="whitespace-nowrap">Renew</Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="audit" className="mt-4">
              {logs.length === 0 ? (
                <div className="text-center py-12">
                  <Eye className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                  <p className="text-muted-foreground">No audit events recorded yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {logs.map((log) => (
                    <div key={log.id} className="flex items-center justify-between p-3 md:p-4 border rounded-lg gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-sm md:text-base truncate">{log.action}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {log.resource_type ? `${log.resource_type}` : ""} • {new Date(log.created_at!).toLocaleString()}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-xs whitespace-nowrap capitalize">
                        {log.resource_type || "system"}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="monitoring" className="mt-4">
              <div className="space-y-4">
                {[
                  { icon: Eye, label: "Active Monitoring", status: "Online", color: "green" },
                  { icon: Shield, label: "DDoS Protection", status: "Active", color: "green" },
                  { icon: Lock, label: "Encryption", status: "Enabled", color: "green" },
                  { icon: Ban, label: "Firewall", status: "Active", color: "green" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 md:p-4 border rounded-lg">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <item.icon className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="font-medium text-sm md:text-base truncate">{item.label}</span>
                    </div>
                    <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20 text-xs whitespace-nowrap">
                      {item.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecurityManagement;
