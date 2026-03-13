import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Wallet, ArrowDownToLine, Clock, CheckCircle2, Ban, Building2, CreditCard, AlertCircle } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { usePageMeta } from "@/hooks/usePageMeta";

const ResellerPayouts = () => {
  usePageMeta("Reseller Payouts", "Manage your earnings and withdraw funds");
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isPayoutDialogOpen, setIsPayoutDialogOpen] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("bank_transfer");

  const { data: payouts, isLoading } = useQuery({
    queryKey: ["reseller-payouts"],
    queryFn: async () => {
      const { data, error } = await supabase.from("reseller_payouts").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: commissions } = useQuery({
    queryKey: ["reseller-commissions-balance"],
    queryFn: async () => {
      const { data, error } = await supabase.from("reseller_commissions").select("amount, status");
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const requestPayout = useMutation({
    mutationFn: async (amount: number) => {
      const { error } = await supabase.from("reseller_payouts").insert({
        reseller_id: user!.id, amount, payout_method: selectedMethod, status: "pending",
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reseller-payouts"] });
      setIsPayoutDialogOpen(false);
      setPayoutAmount("");
      toast({ title: "Payout Requested", description: "Your payout will be processed within 2-3 business days." });
    },
    onError: () => toast({ title: "Error", description: "Failed to request payout.", variant: "destructive" }),
  });

  const allPayouts = payouts ?? [];
  const allCommissions = commissions ?? [];
  const totalEarnings = allCommissions.reduce((sum, c) => sum + (c.amount || 0), 0);
  const paidOut = allPayouts.filter(p => p.status === "completed").reduce((sum, p) => sum + (p.amount || 0), 0);
  const pendingPayouts = allPayouts.filter(p => p.status === "pending" || p.status === "processing").reduce((sum, p) => sum + (p.amount || 0), 0);
  const availableBalance = totalEarnings - paidOut - pendingPayouts;
  const minimumPayout = 100;

  const handleRequestPayout = () => {
    const amount = parseFloat(payoutAmount);
    if (isNaN(amount) || amount < minimumPayout) { toast({ title: "Invalid Amount", description: `Minimum payout is $${minimumPayout}`, variant: "destructive" }); return; }
    if (amount > availableBalance) { toast({ title: "Insufficient Balance", description: "Amount exceeds available balance", variant: "destructive" }); return; }
    requestPayout.mutate(amount);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "processing": return <Clock className="h-4 w-4 text-blue-500 animate-pulse" />;
      case "pending": return <Clock className="h-4 w-4 text-amber-500" />;
      case "failed": return <Ban className="h-4 w-4 text-destructive" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div><h1 className="text-3xl font-bold">Payouts</h1><p className="text-muted-foreground">Manage your earnings and withdraw funds</p></div>
        <Dialog open={isPayoutDialogOpen} onOpenChange={setIsPayoutDialogOpen}>
          <DialogTrigger asChild><Button className="gap-2"><ArrowDownToLine className="h-4 w-4" />Request Payout</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Request Payout</DialogTitle><DialogDescription>Withdraw your available balance.</DialogDescription></DialogHeader>
            <div className="space-y-4 py-4">
              <div className="p-4 bg-muted/50 rounded-lg"><p className="text-sm text-muted-foreground">Available Balance</p><p className="text-3xl font-bold">${Math.max(0, availableBalance).toFixed(2)}</p></div>
              <div className="space-y-2"><Label>Amount ($)</Label><Input type="number" step="0.01" min={minimumPayout} max={availableBalance} value={payoutAmount} onChange={(e) => setPayoutAmount(e.target.value)} placeholder={`Min $${minimumPayout}`} /><p className="text-sm text-muted-foreground">Minimum payout: ${minimumPayout}</p></div>
              <div className="space-y-2"><Label>Payment Method</Label><Select value={selectedMethod} onValueChange={setSelectedMethod}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="bank_transfer">Bank Transfer</SelectItem><SelectItem value="paypal">PayPal</SelectItem><SelectItem value="wire_transfer">Wire Transfer</SelectItem></SelectContent></Select></div>
              <div className="p-4 bg-amber-500/10 rounded-lg flex items-start gap-3"><AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" /><div className="text-sm"><p className="font-medium text-amber-500">Processing Time</p><p className="text-muted-foreground">Payouts are processed within 2-3 business days.</p></div></div>
            </div>
            <DialogFooter><Button variant="outline" onClick={() => setIsPayoutDialogOpen(false)}>Cancel</Button><Button onClick={handleRequestPayout} disabled={requestPayout.isPending}>{requestPayout.isPending ? "Processing..." : `Request $${payoutAmount || "0.00"}`}</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="md:col-span-2"><CardContent className="pt-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Available Balance</p>{isLoading ? <Skeleton className="h-10 w-32" /> : <p className="text-4xl font-bold text-primary">${Math.max(0, availableBalance).toFixed(2)}</p>}<p className="text-sm text-muted-foreground mt-2">Ready for withdrawal</p></div><div className="p-4 rounded-full bg-primary/10"><Wallet className="h-10 w-10 text-primary" /></div></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Pending</p>{isLoading ? <Skeleton className="h-8 w-20" /> : <p className="text-2xl font-bold">${pendingPayouts.toFixed(2)}</p>}</div><div className="p-3 rounded-lg bg-amber-500/10"><Clock className="h-6 w-6 text-amber-500" /></div></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Total Earnings</p>{isLoading ? <Skeleton className="h-8 w-20" /> : <p className="text-2xl font-bold">${totalEarnings.toLocaleString()}</p>}<p className="text-sm text-muted-foreground mt-1">All time</p></div><div className="p-3 rounded-lg bg-green-500/10"><CheckCircle2 className="h-6 w-6 text-green-500" /></div></div></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Payout Tier Progress</CardTitle><CardDescription>Reach higher tiers to unlock lower fees</CardDescription></CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm"><span>Current Tier: {totalEarnings >= 50000 ? "Gold" : "Silver"}</span><span>Next Tier: Gold ($50,000 lifetime earnings)</span></div>
            <Progress value={Math.min((totalEarnings / 50000) * 100, 100)} className="h-3" />
            <div className="flex items-center justify-between text-sm text-muted-foreground"><span>${totalEarnings.toLocaleString()} earned</span><span>${Math.max(0, 50000 - totalEarnings).toLocaleString()} to go</span></div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Payout History</CardTitle></CardHeader>
        <CardContent>
          {isLoading ? <div className="space-y-3">{[1, 2, 3].map(i => <Skeleton key={i} className="h-12 w-full" />)}</div> : allPayouts.length === 0 ? (
            <div className="text-center py-12"><Wallet className="h-10 w-10 mx-auto text-muted-foreground mb-3" /><p className="text-muted-foreground">No payouts yet. Request your first payout above!</p></div>
          ) : (
            <Table>
              <TableHeader><TableRow><TableHead>Amount</TableHead><TableHead>Method</TableHead><TableHead>Requested</TableHead><TableHead>Processed</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
              <TableBody>
                {allPayouts.map((payout) => (
                  <TableRow key={payout.id}>
                    <TableCell className="font-medium">${payout.amount.toFixed(2)}</TableCell>
                    <TableCell>{payout.payout_method || "—"}</TableCell>
                    <TableCell>{new Date(payout.created_at!).toLocaleDateString()}</TableCell>
                    <TableCell>{payout.processed_at ? new Date(payout.processed_at).toLocaleDateString() : "—"}</TableCell>
                    <TableCell><div className="flex items-center gap-2">{getStatusIcon(payout.status || "pending")}<Badge variant={payout.status === "completed" ? "default" : payout.status === "processing" ? "secondary" : payout.status === "pending" ? "outline" : "destructive"}>{payout.status}</Badge></div></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ResellerPayouts;
