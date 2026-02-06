import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, DollarSign, MoreVertical, Download, CheckCircle, XCircle, TrendingUp, TrendingDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const BillingManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: transactions, isLoading: txLoading } = useQuery({
    queryKey: ["admin-transactions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      return data;
    },
  });

  const { data: invoices, isLoading: invLoading } = useQuery({
    queryKey: ["admin-invoices"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("invoices")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      return data;
    },
  });

  const { data: subscriptions } = useQuery({
    queryKey: ["admin-subscriptions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("subscriptions")
        .select("status, amount, plan_type")
        .eq("status", "active");
      if (error) throw error;
      return data;
    },
  });

  const isLoading = txLoading || invLoading;
  const allTx = transactions ?? [];
  const allInv = invoices ?? [];
  const allSubs = subscriptions ?? [];

  const totalRevenue = allTx.filter(t => t.status === "completed").reduce((sum, t) => sum + (t.amount || 0), 0);
  const failedPayments = allTx.filter(t => t.status === "failed").reduce((sum, t) => sum + (t.amount || 0), 0);
  const pendingPayments = allInv.filter(i => i.status === "pending").reduce((sum, i) => sum + (i.total || 0), 0);
  const mrr = allSubs.reduce((sum, s) => sum + (s.amount || 0), 0);

  const filtered = allTx.filter(t =>
    (t.description || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (t.provider || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2 break-words">Billing Management</h1>
          <p className="text-sm md:text-base text-muted-foreground break-words">Monitor payments and transactions</p>
        </div>
        <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
          <Download className="mr-2 h-4 w-4 flex-shrink-0" />
          <span className="truncate">Export Report</span>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="h-5 w-5 text-primary flex-shrink-0" />
              <TrendingUp className="h-4 w-4 text-green-500" />
            </div>
            {isLoading ? <Skeleton className="h-9 w-24" /> : <p className="text-2xl md:text-3xl font-bold truncate">{formatCurrency(totalRevenue)}</p>}
            <p className="text-xs md:text-sm text-muted-foreground truncate">Total Revenue</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="h-5 w-5 text-accent flex-shrink-0" />
              <TrendingUp className="h-4 w-4 text-green-500" />
            </div>
            {isLoading ? <Skeleton className="h-9 w-24" /> : <p className="text-2xl md:text-3xl font-bold truncate">{formatCurrency(mrr)}</p>}
            <p className="text-xs md:text-sm text-muted-foreground truncate">MRR</p>
            <Badge variant="outline" className="mt-2 bg-primary/10 text-primary border-primary/20 text-xs whitespace-nowrap">
              {allSubs.length} subscriptions
            </Badge>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between mb-2">
              <XCircle className="h-5 w-5 text-destructive flex-shrink-0" />
              <TrendingDown className="h-4 w-4 text-green-500" />
            </div>
            {isLoading ? <Skeleton className="h-9 w-24" /> : <p className="text-2xl md:text-3xl font-bold truncate">{formatCurrency(failedPayments)}</p>}
            <p className="text-xs md:text-sm text-muted-foreground truncate">Failed Payments</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="h-5 w-5 text-yellow-500 flex-shrink-0" />
            </div>
            {isLoading ? <Skeleton className="h-9 w-24" /> : <p className="text-2xl md:text-3xl font-bold truncate">{formatCurrency(pendingPayments)}</p>}
            <p className="text-xs md:text-sm text-muted-foreground truncate">Pending</p>
          </CardContent>
        </Card>
      </div>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle className="text-lg md:text-xl truncate">Recent Transactions</CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground flex-shrink-0" />
              <Input
                placeholder="Search transactions..."
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
              <DollarSign className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground">{searchQuery ? "No transactions match your search" : "No transactions yet"}</p>
            </div>
          ) : (
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <div className="inline-block min-w-full align-middle">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="whitespace-nowrap">ID</TableHead>
                      <TableHead className="whitespace-nowrap">Description</TableHead>
                      <TableHead className="whitespace-nowrap">Amount</TableHead>
                      <TableHead className="whitespace-nowrap">Provider</TableHead>
                      <TableHead className="whitespace-nowrap">Status</TableHead>
                      <TableHead className="whitespace-nowrap">Date</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((tx) => (
                      <TableRow key={tx.id}>
                        <TableCell className="font-medium">
                          <div className="truncate max-w-[100px] md:max-w-none font-mono text-xs">{tx.id.slice(0, 8)}...</div>
                        </TableCell>
                        <TableCell>
                          <div className="truncate max-w-[150px] md:max-w-none">{tx.description || "Payment"}</div>
                        </TableCell>
                        <TableCell className="font-semibold whitespace-nowrap">
                          {formatCurrency(tx.amount)}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="whitespace-nowrap capitalize">{tx.provider || "—"}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {tx.status === "completed" && <CheckCircle className="h-4 w-4 text-green-500" />}
                            {tx.status === "failed" && <XCircle className="h-4 w-4 text-destructive" />}
                            {tx.status === "pending" && <DollarSign className="h-4 w-4 text-yellow-500" />}
                            <Badge
                              variant="outline"
                              className={`whitespace-nowrap ${
                                tx.status === "completed"
                                  ? "bg-green-500/10 text-green-500 border-green-500/20"
                                  : tx.status === "failed"
                                  ? "bg-destructive/10 text-destructive border-destructive/20"
                                  : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                              }`}
                            >
                              {tx.status}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {new Date(tx.created_at!).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-popover">
                              <DropdownMenuItem><Download className="mr-2 h-4 w-4" />Download Invoice</DropdownMenuItem>
                              <DropdownMenuItem><DollarSign className="mr-2 h-4 w-4" />Process Refund</DropdownMenuItem>
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

export default BillingManagement;
