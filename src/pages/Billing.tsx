import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CreditCard,
  Download,
  AlertCircle,
  CheckCircle,
  Calendar,
  DollarSign,
  TrendingUp,
  Plus,
  ExternalLink,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useSubscriptions, useCancelSubscription, useInvoices, usePaymentMethods, useSetDefaultPaymentMethod, useDeletePaymentMethod } from "@/hooks/useBilling";
import { format } from "date-fns";
import { toast } from "sonner";

const Billing = () => {
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancelSubId, setCancelSubId] = useState<string | null>(null);
  
  const { data: subscriptions, isLoading: loadingSubs } = useSubscriptions();
  const { data: invoices, isLoading: loadingInvoices } = useInvoices();
  const { data: paymentMethods, isLoading: loadingPayments } = usePaymentMethods();
  const cancelSubscription = useCancelSubscription();
  const setDefaultPayment = useSetDefaultPaymentMethod();
  const deletePaymentMethod = useDeletePaymentMethod();

  const isLoading = loadingSubs || loadingInvoices || loadingPayments;

  // Calculate stats from real data
  const totalSpent = invoices?.filter(i => i.status === 'paid').reduce((sum, i) => sum + (i.total || 0), 0) || 0;
  const activePlans = subscriptions?.filter(s => s.status === 'active').length || 0;
  const nextPayment = subscriptions?.find(s => s.status === 'active')?.amount || 0;
  const paidInvoices = invoices?.filter(i => i.status === 'paid').length || 0;
  const totalInvoices = invoices?.length || 1;
  const successRate = Math.round((paidInvoices / totalInvoices) * 100);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">Billing & Payments</h1>
            <p className="text-muted-foreground">
              Manage your subscriptions, invoices, and payment methods
            </p>
          </div>
          <Button 
            className="gap-2" 
            variant="outline"
            onClick={() => {
              if (!invoices || invoices.length === 0) {
                toast.info("No invoices to download");
                return;
              }
              toast.success(`Preparing ${invoices.length} invoices for download...`);
            }}
          >
            <Download className="h-4 w-4" />
            Download All Invoices
          </Button>
        </div>

        {/* Alert Banner */}
        {subscriptions && subscriptions.length > 0 && (
          <Alert className="border-accent/50 bg-accent/10">
            <AlertCircle className="h-4 w-4 text-accent" />
            <AlertDescription className="text-accent">
              Your next billing date is <strong>
                {subscriptions[0].current_period_end 
                  ? format(new Date(subscriptions[0].current_period_end), 'MMMM d, yyyy')
                  : 'N/A'
                }
              </strong> for ${subscriptions[0].amount}. Update your payment method before then.
            </AlertDescription>
          </Alert>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-card/50 backdrop-blur">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <DollarSign className="h-6 w-6 text-primary" />
                </div>
                <div>
                  {isLoading ? (
                    <Skeleton className="h-8 w-20" />
                  ) : (
                    <p className="text-2xl font-bold">${totalSpent.toFixed(2)}</p>
                  )}
                  <p className="text-sm text-muted-foreground">Total Spent</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card/50 backdrop-blur">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-accent/10">
                  <Calendar className="h-6 w-6 text-accent" />
                </div>
                <div>
                  {isLoading ? (
                    <Skeleton className="h-8 w-12" />
                  ) : (
                    <p className="text-2xl font-bold">{activePlans}</p>
                  )}
                  <p className="text-sm text-muted-foreground">Active Plans</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card/50 backdrop-blur">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <div>
                  {isLoading ? (
                    <Skeleton className="h-8 w-20" />
                  ) : (
                    <p className="text-2xl font-bold">${nextPayment.toFixed(2)}</p>
                  )}
                  <p className="text-sm text-muted-foreground">Next Payment</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card/50 backdrop-blur">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <CheckCircle className="h-6 w-6 text-primary" />
                </div>
                <div>
                  {isLoading ? (
                    <Skeleton className="h-8 w-16" />
                  ) : (
                    <p className="text-2xl font-bold">{successRate}%</p>
                  )}
                  <p className="text-sm text-muted-foreground">Payment Success</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="subscriptions" className="space-y-6">
          <TabsList className="grid grid-cols-3 w-full max-w-md">
            <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
            <TabsTrigger value="invoices">Invoices</TabsTrigger>
            <TabsTrigger value="payments">Payment Methods</TabsTrigger>
          </TabsList>

          {/* Subscriptions Tab */}
          <TabsContent value="subscriptions" className="space-y-6">
            <Card className="bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle>Active Subscriptions</CardTitle>
                <CardDescription>Manage your current plans and services</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {loadingSubs ? (
                  <div className="space-y-4">
                    <Skeleton className="h-32 w-full" />
                    <Skeleton className="h-32 w-full" />
                  </div>
                ) : subscriptions?.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No active subscriptions found.
                  </div>
                ) : (
                  subscriptions?.map((sub) => (
                    <div key={sub.id} className="p-6 rounded-lg border border-border bg-background/50 space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-lg">{sub.plan_name}</h3>
                            <Badge className={`border-none ${
                              sub.status === 'active' 
                                ? 'bg-primary/10 text-primary' 
                                : 'bg-muted text-muted-foreground'
                            }`}>
                              {sub.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {sub.plan_type} Plan • {sub.interval || 'Monthly'}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold">${sub.amount}</p>
                          <p className="text-sm text-muted-foreground">/{sub.interval || 'month'}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t border-border">
                        <p className="text-sm text-muted-foreground">
                          Next billing: <strong>
                            {sub.current_period_end 
                              ? format(new Date(sub.current_period_end), 'MMMM d, yyyy')
                              : 'N/A'
                            }
                          </strong>
                        </p>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => toast.info("Plan change will be available in the next release.")}>Change Plan</Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            disabled={sub.cancel_at_period_end}
                            onClick={() => {
                              setCancelSubId(sub.id);
                              setCancelDialogOpen(true);
                            }}
                          >
                            {sub.cancel_at_period_end ? "Cancelling..." : "Cancel"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Invoices Tab */}
          <TabsContent value="invoices" className="space-y-6">
            <Card className="bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle>Billing History</CardTitle>
                <CardDescription>View and download your invoices</CardDescription>
              </CardHeader>
              <CardContent>
                {loadingInvoices ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-20 w-full" />
                    ))}
                  </div>
                ) : invoices?.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No invoices found.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {invoices?.map((invoice) => (
                      <div
                        key={invoice.id}
                        className="flex items-center justify-between p-4 rounded-lg border border-border bg-background/50 hover:border-primary/50 transition-all"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                            <CreditCard className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-semibold">{invoice.invoice_number || invoice.id.slice(0, 8)}</h4>
                            <p className="text-sm text-muted-foreground">Invoice</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <p className="font-semibold">${invoice.total}</p>
                            <p className="text-sm text-muted-foreground">
                              {invoice.created_at 
                                ? format(new Date(invoice.created_at), 'MMM d, yyyy')
                                : 'N/A'
                              }
                            </p>
                          </div>
                          <Badge
                            variant={invoice.status === "paid" ? "default" : "secondary"}
                            className={invoice.status === "paid" ? "bg-primary/10 text-primary border-none" : ""}
                          >
                            {invoice.status}
                          </Badge>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="gap-2"
                            onClick={() => toast.success(`Downloading invoice ${invoice.invoice_number || invoice.id.slice(0, 8)}...`)}
                          >
                            <Download className="h-4 w-4" />
                            PDF
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payment Methods Tab */}
          <TabsContent value="payments" className="space-y-6">
            <Card className="bg-card/50 backdrop-blur">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Payment Methods</CardTitle>
                  <CardDescription>Manage your saved payment methods</CardDescription>
                </div>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Payment Method
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {loadingPayments ? (
                  <div className="space-y-4">
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                  </div>
                ) : paymentMethods?.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No payment methods found. Add one to get started.
                  </div>
                ) : (
                  paymentMethods?.map((method) => (
                    <div
                      key={method.id}
                      className="flex items-center justify-between p-6 rounded-lg border border-border bg-background/50"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                          <CreditCard className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold">
                              {method.brand || method.type} •••• {method.last_four}
                            </h4>
                            {method.is_default && (
                              <Badge className="bg-primary/10 text-primary border-none">Default</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Expires {method.exp_month}/{method.exp_year}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {!method.is_default && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setDefaultPayment.mutate(method.id)}
                            disabled={setDefaultPayment.isPending}
                          >
                            Set Default
                          </Button>
                        )}
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-destructive"
                          onClick={() => deletePaymentMethod.mutate(method.id)}
                          disabled={deletePaymentMethod.isPending}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Upgrade Banner */}
        <Card className="bg-gradient-speed border-none shadow-glow">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <TrendingUp className="h-10 w-10 text-primary-foreground" />
                <div>
                  <h3 className="text-xl font-bold text-primary-foreground">Save 20% with Annual Billing</h3>
                  <p className="text-primary-foreground/90">
                    Switch to yearly payments and get 2 months free!
                  </p>
                </div>
              </div>
              <Button 
                variant="secondary" 
                size="lg" 
                className="gap-2"
                onClick={() => toast.info("Annual billing switch will be available in the next release.")}
              >
                Switch to Annual
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cancel Subscription Dialog */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Subscription</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel? Your subscription will remain active until the end of the current billing period.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelDialogOpen(false)}>Keep Subscription</Button>
            <Button 
              variant="destructive" 
              disabled={cancelSubscription.isPending}
              onClick={() => {
                if (cancelSubId) {
                  cancelSubscription.mutate(cancelSubId);
                  setCancelDialogOpen(false);
                }
              }}
            >
              {cancelSubscription.isPending ? "Cancelling..." : "Confirm Cancel"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Billing;
