import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DollarSign, TrendingUp, CreditCard, FileText, Download, ArrowUpRight, Calendar } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { usePageMeta } from "@/hooks/usePageMeta";

const ResellerBilling = () => {
  usePageMeta("Reseller Billing", "Manage invoices, transactions, and revenue");
  const [dateRange, setDateRange] = useState("30days");
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: commissions, isLoading: commLoading } = useQuery({
    queryKey: ["reseller-commissions"],
    queryFn: async () => {
      const { data, error } = await supabase.from("reseller_commissions").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: payouts } = useQuery({
    queryKey: ["reseller-payouts-billing"],
    queryFn: async () => {
      const { data, error } = await supabase.from("reseller_payouts").select("*").order("created_at", { ascending: false }).limit(10);
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: products } = useQuery({
    queryKey: ["reseller-products-billing"],
    queryFn: async () => {
      const { data, error } = await supabase.from("reseller_products").select("*").eq("is_active", true);
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const allCommissions = commissions ?? [];
  const allPayouts = payouts ?? [];
  const allProducts = products ?? [];

  const totalRevenue = allCommissions.reduce((sum, c) => sum + (c.amount || 0), 0);
  const pendingAmount = allCommissions.filter(c => c.status === "pending").reduce((sum, c) => sum + (c.amount || 0), 0);
  const paidAmount = allCommissions.filter(c => c.status === "paid").reduce((sum, c) => sum + (c.amount || 0), 0);
  const totalProfit = totalRevenue * 0.5; // Approximate margin

  // Build chart data from commissions grouped by month
  const monthMap = new Map<string, number>();
  allCommissions.forEach(c => {
    const month = new Date(c.created_at!).toLocaleString("en-US", { month: "short" });
    monthMap.set(month, (monthMap.get(month) || 0) + c.amount);
  });
  const revenueData = Array.from(monthMap.entries()).map(([month, revenue]) => ({ month, revenue, profit: revenue * 0.5 }));

  // Revenue breakdown from products
  const typeMap = new Map<string, number>();
  allProducts.forEach(p => typeMap.set(p.type, (typeMap.get(p.type) || 0) + (p.reseller_price || 0)));
  const colors = ["hsl(var(--primary))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))"];
  const revenueBreakdown = Array.from(typeMap.entries()).map(([name, value], i) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), value, color: colors[i % colors.length] }));

  const handleExport = () => {
    const csv = "Date,Amount,Status\n" + allCommissions.map(c => `${c.created_at},${c.amount},${c.status}`).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "reseller-billing.csv"; a.click();
    toast({ title: "Exported", description: "Billing data downloaded as CSV." });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div><h1 className="text-3xl font-bold">Billing</h1><p className="text-muted-foreground">Manage invoices, transactions, and revenue</p></div>
        <div className="flex items-center gap-2">
          <Select value={dateRange} onValueChange={setDateRange}><SelectTrigger className="w-40"><Calendar className="h-4 w-4 mr-2" /><SelectValue /></SelectTrigger><SelectContent><SelectItem value="7days">Last 7 days</SelectItem><SelectItem value="30days">Last 30 days</SelectItem><SelectItem value="90days">Last 90 days</SelectItem><SelectItem value="year">This year</SelectItem></SelectContent></Select>
          <Button variant="outline" className="gap-2" onClick={handleExport}><Download className="h-4 w-4" />Export</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card><CardContent className="pt-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Total Revenue</p>{commLoading ? <Skeleton className="h-8 w-20" /> : <p className="text-2xl font-bold">${totalRevenue.toLocaleString()}</p>}<div className="flex items-center text-green-500 text-sm mt-1"><ArrowUpRight className="h-3 w-3 mr-1" /><span>From commissions</span></div></div><div className="p-3 rounded-lg bg-primary/10"><DollarSign className="h-6 w-6 text-primary" /></div></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Est. Profit</p>{commLoading ? <Skeleton className="h-8 w-20" /> : <p className="text-2xl font-bold">${totalProfit.toLocaleString()}</p>}</div><div className="p-3 rounded-lg bg-green-500/10"><TrendingUp className="h-6 w-6 text-green-500" /></div></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Pending</p>{commLoading ? <Skeleton className="h-8 w-20" /> : <p className="text-2xl font-bold">${pendingAmount.toFixed(2)}</p>}</div><div className="p-3 rounded-lg bg-amber-500/10"><FileText className="h-6 w-6 text-amber-500" /></div></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Paid Out</p>{commLoading ? <Skeleton className="h-8 w-20" /> : <p className="text-2xl font-bold">${paidAmount.toFixed(2)}</p>}</div><div className="p-3 rounded-lg bg-primary/10"><CreditCard className="h-6 w-6 text-primary" /></div></div></CardContent></Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Revenue & Profit</CardTitle><CardDescription>Commission trends</CardDescription></CardHeader>
          <CardContent>
            {revenueData.length === 0 ? <div className="h-[300px] flex items-center justify-center text-muted-foreground">No commission data yet</div> : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }} />
                  <Bar dataKey="revenue" fill="hsl(var(--primary))" name="Revenue" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="profit" fill="hsl(var(--chart-2))" name="Profit" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Revenue Breakdown</CardTitle><CardDescription>By service category</CardDescription></CardHeader>
          <CardContent>
            {revenueBreakdown.length === 0 ? <div className="h-[250px] flex items-center justify-center text-muted-foreground">No product data</div> : (
              <>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart><Pie data={revenueBreakdown} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">{revenueBreakdown.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}</Pie><Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }} /></PieChart>
                </ResponsiveContainer>
                <div className="space-y-2 mt-4">{revenueBreakdown.map((item) => <div key={item.name} className="flex items-center justify-between text-sm"><div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} /><span>{item.name}</span></div><span className="font-medium">${item.value.toLocaleString()}</span></div>)}</div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="commissions" className="space-y-4">
        <TabsList><TabsTrigger value="commissions">Commissions</TabsTrigger><TabsTrigger value="payouts">Payouts</TabsTrigger></TabsList>
        <TabsContent value="commissions">
          <Card>
            <CardHeader><CardTitle>Recent Commissions</CardTitle></CardHeader>
            <CardContent>
              {commLoading ? <div className="space-y-3">{[1, 2, 3].map(i => <Skeleton key={i} className="h-12 w-full" />)}</div> : allCommissions.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">No commissions yet</div>
              ) : (
                <Table>
                  <TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Amount</TableHead><TableHead>Rate</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
                  <TableBody>{allCommissions.slice(0, 20).map((c) => <TableRow key={c.id}><TableCell>{new Date(c.created_at!).toLocaleDateString()}</TableCell><TableCell className="font-medium">${c.amount.toFixed(2)}</TableCell><TableCell>{c.percentage}%</TableCell><TableCell><Badge variant={c.status === "paid" ? "default" : c.status === "pending" ? "secondary" : "destructive"}>{c.status}</Badge></TableCell></TableRow>)}</TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="payouts">
          <Card>
            <CardHeader><CardTitle>Recent Payouts</CardTitle></CardHeader>
            <CardContent>
              {allPayouts.length === 0 ? <div className="text-center py-12 text-muted-foreground">No payouts yet</div> : (
                <Table>
                  <TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Amount</TableHead><TableHead>Method</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
                  <TableBody>{allPayouts.map((p) => <TableRow key={p.id}><TableCell>{new Date(p.created_at!).toLocaleDateString()}</TableCell><TableCell className="font-medium">${p.amount.toFixed(2)}</TableCell><TableCell>{p.payout_method || "—"}</TableCell><TableCell><Badge variant={p.status === "completed" ? "default" : p.status === "pending" ? "secondary" : "destructive"}>{p.status}</Badge></TableCell></TableRow>)}</TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ResellerBilling;
