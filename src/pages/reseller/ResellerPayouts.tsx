import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Wallet, ArrowDownToLine, Clock, CheckCircle2, Ban, Building2, CreditCard, AlertCircle } from "lucide-react";

const payoutHistory = [
  { id: "PAY-001", amount: 2500.00, method: "Bank Transfer", status: "completed", requestedDate: "2024-06-01", processedDate: "2024-06-03", account: "**** 4521" },
  { id: "PAY-002", amount: 1800.00, method: "PayPal", status: "completed", requestedDate: "2024-05-15", processedDate: "2024-05-16", account: "john@example.com" },
  { id: "PAY-003", amount: 3200.00, method: "Bank Transfer", status: "processing", requestedDate: "2024-06-08", processedDate: null, account: "**** 4521" },
  { id: "PAY-004", amount: 1500.00, method: "Wire Transfer", status: "pending", requestedDate: "2024-06-10", processedDate: null, account: "**** 7890" },
  { id: "PAY-005", amount: 500.00, method: "PayPal", status: "failed", requestedDate: "2024-05-20", processedDate: null, account: "old@email.com" },
];

const paymentMethods = [
  { id: "bank-1", type: "Bank Transfer", name: "Chase Bank", account: "**** 4521", default: true },
  { id: "paypal-1", type: "PayPal", name: "PayPal", account: "john@example.com", default: false },
  { id: "wire-1", type: "Wire Transfer", name: "International Wire", account: "**** 7890", default: false },
];

const ResellerPayouts = () => {
  const { toast } = useToast();
  const [isPayoutDialogOpen, setIsPayoutDialogOpen] = useState(false);
  const [isAddMethodOpen, setIsAddMethodOpen] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("bank-1");
  const [methods, setMethods] = useState(paymentMethods);

  const availableBalance = 4850.75;
  const pendingBalance = 1099.84;
  const totalEarnings = 28500.00;
  const minimumPayout = 100;

  const handleRequestPayout = () => {
    const amount = parseFloat(payoutAmount);
    if (amount < minimumPayout) {
      toast({ title: "Invalid Amount", description: `Minimum payout is $${minimumPayout}`, variant: "destructive" });
      return;
    }
    if (amount > availableBalance) {
      toast({ title: "Insufficient Balance", description: "Payout amount exceeds available balance", variant: "destructive" });
      return;
    }
    toast({ title: "Payout Requested", description: `$${amount.toFixed(2)} payout has been requested and will be processed within 2-3 business days.` });
    setIsPayoutDialogOpen(false);
    setPayoutAmount("");
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
        <div>
          <h1 className="text-3xl font-bold">Payouts</h1>
          <p className="text-muted-foreground">Manage your earnings and withdraw funds</p>
        </div>
        <Dialog open={isPayoutDialogOpen} onOpenChange={setIsPayoutDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <ArrowDownToLine className="h-4 w-4" />
              Request Payout
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Request Payout</DialogTitle>
              <DialogDescription>Withdraw your available balance to your preferred payment method.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">Available Balance</p>
                <p className="text-3xl font-bold">${availableBalance.toFixed(2)}</p>
              </div>
              <div className="space-y-2">
                <Label>Amount ($)</Label>
                <Input type="number" step="0.01" min={minimumPayout} max={availableBalance} value={payoutAmount} onChange={(e) => setPayoutAmount(e.target.value)} placeholder={`Min $${minimumPayout}`} />
                <p className="text-sm text-muted-foreground">Minimum payout: ${minimumPayout}</p>
              </div>
              <div className="space-y-2">
                <Label>Payment Method</Label>
                <Select value={selectedMethod} onValueChange={setSelectedMethod}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {methods.map(method => (
                      <SelectItem key={method.id} value={method.id}>
                        <div className="flex items-center gap-2">
                          <span>{method.type}</span>
                          <span className="text-muted-foreground">({method.account})</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="p-4 bg-amber-500/10 rounded-lg flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-amber-500">Processing Time</p>
                  <p className="text-muted-foreground">Payouts are processed within 2-3 business days. Bank transfers may take additional 1-2 days.</p>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsPayoutDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleRequestPayout}>Request ${payoutAmount || "0.00"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="md:col-span-2">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Available Balance</p>
                <p className="text-4xl font-bold text-primary">${availableBalance.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground mt-2">Ready for withdrawal</p>
              </div>
              <div className="p-4 rounded-full bg-primary/10">
                <Wallet className="h-10 w-10 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">${pendingBalance.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground mt-1">Clearing in 7 days</p>
              </div>
              <div className="p-3 rounded-lg bg-amber-500/10">
                <Clock className="h-6 w-6 text-amber-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Earnings</p>
                <p className="text-2xl font-bold">${totalEarnings.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground mt-1">All time</p>
              </div>
              <div className="p-3 rounded-lg bg-green-500/10">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress to next payout tier */}
      <Card>
        <CardHeader>
          <CardTitle>Payout Tier Progress</CardTitle>
          <CardDescription>Reach higher tiers to unlock lower fees and faster processing</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span>Current Tier: Silver</span>
              <span>Next Tier: Gold ($50,000 lifetime earnings)</span>
            </div>
            <Progress value={(totalEarnings / 50000) * 100} className="h-3" />
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>${totalEarnings.toLocaleString()} earned</span>
              <span>${(50000 - totalEarnings).toLocaleString()} to go</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>Manage your payout destinations</CardDescription>
            </div>
            <Button variant="outline" size="sm">Add Method</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {methods.map(method => (
              <div key={method.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-muted">
                    {method.type === "Bank Transfer" ? <Building2 className="h-5 w-5" /> : <CreditCard className="h-5 w-5" />}
                  </div>
                  <div>
                    <p className="font-medium">{method.name}</p>
                    <p className="text-sm text-muted-foreground">{method.account}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {method.default && <Badge>Default</Badge>}
                  <Button variant="ghost" size="sm">Edit</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payout History */}
      <Card>
        <CardHeader>
          <CardTitle>Payout History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Account</TableHead>
                <TableHead>Requested</TableHead>
                <TableHead>Processed</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payoutHistory.map((payout) => (
                <TableRow key={payout.id}>
                  <TableCell className="font-medium">{payout.id}</TableCell>
                  <TableCell>${payout.amount.toFixed(2)}</TableCell>
                  <TableCell>{payout.method}</TableCell>
                  <TableCell className="text-muted-foreground">{payout.account}</TableCell>
                  <TableCell>{payout.requestedDate}</TableCell>
                  <TableCell>{payout.processedDate || "-"}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(payout.status)}
                      <Badge variant={
                        payout.status === "completed" ? "default" : 
                        payout.status === "processing" ? "secondary" : 
                        payout.status === "pending" ? "outline" : "destructive"
                      }>
                        {payout.status}
                      </Badge>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResellerPayouts;