import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Server, MoreVertical, Power, RefreshCw } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const HostingManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: hostingAccounts, isLoading } = useQuery({
    queryKey: ["admin-hosting-accounts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("hosting_accounts")
        .select("*, profiles!hosting_accounts_user_id_fkey(full_name)")
        .order("created_at", { ascending: false });
      if (error) {
        // Fallback without join if FK doesn't exist
        const { data: fallback, error: fbError } = await supabase
          .from("hosting_accounts")
          .select("*")
          .order("created_at", { ascending: false });
        if (fbError) throw fbError;
        return fallback;
      }
      return data;
    },
  });

  const accounts = hostingAccounts ?? [];
  const filtered = accounts.filter((h: any) =>
    h.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalCount = accounts.length;
  const activeCount = accounts.filter((h: any) => h.status === "active").length;
  const suspendedCount = accounts.filter((h: any) => h.status === "suspended").length;

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2 break-words">Hosting Management</h1>
          <p className="text-sm md:text-base text-muted-foreground break-words">Monitor and manage all hosting accounts</p>
        </div>
        <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
          <Server className="mr-2 h-4 w-4 flex-shrink-0" />
          <span className="truncate">Add Hosting</span>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <Card>
          <CardContent className="p-4 md:p-6">
            <p className="text-xs md:text-sm text-muted-foreground mb-1 truncate">Total Hosting</p>
            {isLoading ? <Skeleton className="h-9 w-16" /> : <p className="text-2xl md:text-3xl font-bold truncate">{totalCount}</p>}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 md:p-6">
            <p className="text-xs md:text-sm text-muted-foreground mb-1 truncate">Active Sites</p>
            {isLoading ? <Skeleton className="h-9 w-16" /> : <p className="text-2xl md:text-3xl font-bold truncate">{activeCount}</p>}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 md:p-6">
            <p className="text-xs md:text-sm text-muted-foreground mb-1 truncate">Suspended</p>
            {isLoading ? <Skeleton className="h-9 w-16" /> : <p className="text-2xl md:text-3xl font-bold truncate">{suspendedCount}</p>}
            {suspendedCount > 0 && (
              <Badge variant="outline" className="mt-2 bg-destructive/10 text-destructive border-destructive/20 text-xs whitespace-nowrap">
                Requires action
              </Badge>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 md:p-6">
            <p className="text-xs md:text-sm text-muted-foreground mb-1 truncate">Active Rate</p>
            {isLoading ? <Skeleton className="h-9 w-16" /> : (
              <p className="text-2xl md:text-3xl font-bold truncate">
                {totalCount > 0 ? Math.round((activeCount / totalCount) * 100) : 0}%
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Hosting Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle className="text-lg md:text-xl truncate">All Hosting Accounts</CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground flex-shrink-0" />
              <Input
                placeholder="Search hosting..."
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
              <Server className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground">{searchQuery ? "No hosting accounts match your search" : "No hosting accounts yet"}</p>
            </div>
          ) : (
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <div className="inline-block min-w-full align-middle">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="whitespace-nowrap">Name</TableHead>
                      <TableHead className="whitespace-nowrap">Plan</TableHead>
                      <TableHead className="whitespace-nowrap">Region</TableHead>
                      <TableHead className="whitespace-nowrap">Status</TableHead>
                      <TableHead className="whitespace-nowrap">Storage</TableHead>
                      <TableHead className="whitespace-nowrap">Created</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((hosting: any) => (
                      <TableRow key={hosting.id}>
                        <TableCell className="font-medium">
                          <div className="truncate max-w-[150px] md:max-w-none">{hosting.name}</div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="whitespace-nowrap capitalize">{hosting.plan}</Badge>
                        </TableCell>
                        <TableCell className="whitespace-nowrap">{hosting.region || "—"}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`whitespace-nowrap ${
                              hosting.status === "active"
                                ? "bg-green-500/10 text-green-500 border-green-500/20"
                                : hosting.status === "suspended"
                                ? "bg-destructive/10 text-destructive border-destructive/20"
                                : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                            }`}
                          >
                            {hosting.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {hosting.storage_used_gb ?? 0}/{hosting.storage_limit_gb ?? 0} GB
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {new Date(hosting.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-popover">
                              <DropdownMenuItem><Server className="mr-2 h-4 w-4" />View Details</DropdownMenuItem>
                              <DropdownMenuItem><RefreshCw className="mr-2 h-4 w-4" />Restart Server</DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive"><Power className="mr-2 h-4 w-4" />Suspend</DropdownMenuItem>
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

export default HostingManagement;
