import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Mail, Shield, Database, Users, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const EmailManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: emailAccounts, isLoading } = useQuery({
    queryKey: ["admin-email-accounts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("email_accounts")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const accounts = emailAccounts ?? [];
  const filtered = accounts.filter(a =>
    a.email_address?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalCount = accounts.length;
  const activeCount = accounts.filter(a => a.status === "active").length;
  const totalStorageMB = accounts.reduce((sum, a) => sum + (a.used_mb || 0), 0);
  const totalQuotaMB = accounts.reduce((sum, a) => sum + (a.quota_mb || 0), 0);

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2 break-words">Email Management</h1>
          <p className="text-sm md:text-base text-muted-foreground break-words">Manage business email accounts and settings</p>
        </div>
        <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
          <Mail className="mr-2 h-4 w-4 flex-shrink-0" />
          <span className="truncate">Create Email</span>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <Card>
          <CardContent className="p-4 md:p-6">
            <p className="text-xs md:text-sm text-muted-foreground mb-1 truncate">Total Accounts</p>
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
            <p className="text-xs md:text-sm text-muted-foreground mb-1 truncate">Storage Used</p>
            {isLoading ? <Skeleton className="h-9 w-16" /> : (
              <p className="text-2xl md:text-3xl font-bold truncate">
                {totalStorageMB >= 1024 ? `${(totalStorageMB / 1024).toFixed(1)} GB` : `${totalStorageMB} MB`}
              </p>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              of {totalQuotaMB >= 1024 ? `${(totalQuotaMB / 1024).toFixed(1)} GB` : `${totalQuotaMB} MB`}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 md:p-6">
            <p className="text-xs md:text-sm text-muted-foreground mb-1 truncate">Usage Rate</p>
            {isLoading ? <Skeleton className="h-9 w-16" /> : (
              <p className="text-2xl md:text-3xl font-bold truncate">
                {totalQuotaMB > 0 ? Math.round((totalStorageMB / totalQuotaMB) * 100) : 0}%
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Email Accounts Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle className="text-lg md:text-xl truncate">Email Accounts</CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground flex-shrink-0" />
              <Input
                placeholder="Search emails..."
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
              <Mail className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground">{searchQuery ? "No email accounts match your search" : "No email accounts yet"}</p>
            </div>
          ) : (
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <div className="inline-block min-w-full align-middle">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="whitespace-nowrap">Email Address</TableHead>
                      <TableHead className="whitespace-nowrap">Display Name</TableHead>
                      <TableHead className="whitespace-nowrap">Storage</TableHead>
                      <TableHead className="whitespace-nowrap">Status</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((account) => (
                      <TableRow key={account.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                            <span className="truncate max-w-[150px] md:max-w-none">{account.email_address}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="truncate max-w-[120px] md:max-w-none">{account.display_name || "—"}</div>
                        </TableCell>
                        <TableCell className="whitespace-nowrap text-sm">
                          {account.used_mb || 0} / {account.quota_mb || 0} MB
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`whitespace-nowrap ${
                              account.status === "active"
                                ? "bg-green-500/10 text-green-500 border-green-500/20"
                                : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                            }`}
                          >
                            {account.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-popover">
                              <DropdownMenuItem><Shield className="mr-2 h-4 w-4" />Security Settings</DropdownMenuItem>
                              <DropdownMenuItem><Database className="mr-2 h-4 w-4" />Manage Storage</DropdownMenuItem>
                              <DropdownMenuItem><Users className="mr-2 h-4 w-4" />View Activity</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailManagement;
