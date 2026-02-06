import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Globe, MoreVertical, RefreshCw, Shield, AlertTriangle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const DomainsManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: domains, isLoading } = useQuery({
    queryKey: ["admin-domains"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("domains")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: sslCerts } = useQuery({
    queryKey: ["admin-ssl-certs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ssl_certificates")
        .select("domain_id, status")
      if (error) throw error;
      return data;
    },
  });

  const allDomains = domains ?? [];
  const sslMap = new Map((sslCerts ?? []).map(c => [c.domain_id, c.status]));

  const filtered = allDomains.filter(d =>
    d.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalCount = allDomains.length;
  const activeCount = allDomains.filter(d => d.status === "active").length;
  const now = new Date();
  const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  const expiringSoon = allDomains.filter(d => d.expiry_date && new Date(d.expiry_date) <= thirtyDaysFromNow && new Date(d.expiry_date) > now);
  const sslEnabledCount = allDomains.filter(d => sslMap.has(d.id) && sslMap.get(d.id) === "active").length;

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2 break-words">Domains Management</h1>
          <p className="text-sm md:text-base text-muted-foreground break-words">Manage domain registrations and renewals</p>
        </div>
        <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
          <Globe className="mr-2 h-4 w-4 flex-shrink-0" />
          <span className="truncate">Register Domain</span>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <Card>
          <CardContent className="p-4 md:p-6">
            <p className="text-xs md:text-sm text-muted-foreground mb-1 truncate">Total Domains</p>
            {isLoading ? <Skeleton className="h-9 w-16" /> : <p className="text-2xl md:text-3xl font-bold truncate">{totalCount}</p>}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 md:p-6">
            <p className="text-xs md:text-sm text-muted-foreground mb-1 truncate">Active</p>
            {isLoading ? <Skeleton className="h-9 w-16" /> : <p className="text-2xl md:text-3xl font-bold truncate">{activeCount}</p>}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 md:p-6">
            <p className="text-xs md:text-sm text-muted-foreground mb-1 truncate">Expiring Soon</p>
            {isLoading ? <Skeleton className="h-9 w-16" /> : <p className="text-2xl md:text-3xl font-bold truncate">{expiringSoon.length}</p>}
            {expiringSoon.length > 0 && (
              <Badge variant="outline" className="mt-2 bg-yellow-500/10 text-yellow-500 border-yellow-500/20 text-xs whitespace-nowrap">
                Next 30 days
              </Badge>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 md:p-6">
            <p className="text-xs md:text-sm text-muted-foreground mb-1 truncate">SSL Enabled</p>
            {isLoading ? <Skeleton className="h-9 w-16" /> : <p className="text-2xl md:text-3xl font-bold truncate">{sslEnabledCount}</p>}
          </CardContent>
        </Card>
      </div>

      {/* Domains Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle className="text-lg md:text-xl truncate">All Domains</CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground flex-shrink-0" />
              <Input
                placeholder="Search domains..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => <Skeleton key={i} className="h-12 w-full" />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12">
              <Globe className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground">{searchQuery ? "No domains match your search" : "No domains registered yet"}</p>
            </div>
          ) : (
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <div className="inline-block min-w-full align-middle">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="whitespace-nowrap">Domain</TableHead>
                      <TableHead className="whitespace-nowrap">Registrar</TableHead>
                      <TableHead className="whitespace-nowrap">Status</TableHead>
                      <TableHead className="whitespace-nowrap">SSL</TableHead>
                      <TableHead className="whitespace-nowrap">Expiry</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((domain) => {
                      const hasSSL = sslMap.has(domain.id) && sslMap.get(domain.id) === "active";
                      return (
                        <TableRow key={domain.id}>
                          <TableCell className="font-medium">
                            <div className="truncate max-w-[150px] md:max-w-none">{domain.name}</div>
                          </TableCell>
                          <TableCell>
                            <div className="truncate max-w-[120px] md:max-w-none">{domain.registrar || "—"}</div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={`whitespace-nowrap ${
                                domain.status === "active"
                                  ? "bg-green-500/10 text-green-500 border-green-500/20"
                                  : "bg-destructive/10 text-destructive border-destructive/20"
                              }`}
                            >
                              {domain.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {hasSSL ? (
                              <Shield className="h-4 w-4 text-green-500" />
                            ) : (
                              <AlertTriangle className="h-4 w-4 text-destructive" />
                            )}
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            {domain.expiry_date ? new Date(domain.expiry_date).toLocaleDateString() : "—"}
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="bg-popover">
                                <DropdownMenuItem><Globe className="mr-2 h-4 w-4" />Manage DNS</DropdownMenuItem>
                                <DropdownMenuItem><Shield className="mr-2 h-4 w-4" />Renew SSL</DropdownMenuItem>
                                <DropdownMenuItem><RefreshCw className="mr-2 h-4 w-4" />Renew Domain</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Renewal Alerts */}
      {expiringSoon.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl truncate flex items-center gap-2">
              Renewal Alerts
              <Badge variant="destructive" className="text-xs whitespace-nowrap">{expiringSoon.length} Expiring</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {expiringSoon.map((domain) => {
                const daysLeft = Math.ceil((new Date(domain.expiry_date!).getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                return (
                  <div key={domain.id} className="flex items-center justify-between p-3 md:p-4 border rounded-lg gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-sm md:text-base truncate">{domain.name}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Badge
                        variant="outline"
                        className={`text-xs whitespace-nowrap ${
                          daysLeft <= 7
                            ? "bg-destructive/10 text-destructive border-destructive/20"
                            : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                        }`}
                      >
                        {daysLeft} days
                      </Badge>
                      <Button size="sm" variant="outline" className="whitespace-nowrap">
                        <RefreshCw className="mr-1 h-3 w-3" />Renew
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DomainsManagement;
