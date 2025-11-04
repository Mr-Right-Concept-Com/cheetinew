import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

const Billing = () => {
  const invoices = [
    { id: "INV-2024-001", date: "2024-01-15", amount: 29.99, status: "paid", plan: "Pro Hosting" },
    { id: "INV-2024-002", date: "2024-02-15", amount: 29.99, status: "paid", plan: "Pro Hosting" },
    { id: "INV-2024-003", date: "2024-03-15", amount: 29.99, status: "pending", plan: "Pro Hosting" },
  ];

  const paymentMethods = [
    { id: 1, type: "Visa", last4: "4242", expiry: "12/25", default: true },
    { id: 2, type: "Mastercard", last4: "8888", expiry: "09/26", default: false },
  ];

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
          <Button className="gap-2" variant="outline">
            <Download className="h-4 w-4" />
            Download All Invoices
          </Button>
        </div>

        {/* Alert Banner */}
        <Alert className="border-accent/50 bg-accent/10">
          <AlertCircle className="h-4 w-4 text-accent" />
          <AlertDescription className="text-accent">
            Your next billing date is <strong>March 15, 2024</strong> for $29.99. Update your payment method before then.
          </AlertDescription>
        </Alert>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-card/50 backdrop-blur">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <DollarSign className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">$89.97</p>
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
                  <p className="text-2xl font-bold">3</p>
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
                  <p className="text-2xl font-bold">$29.99</p>
                  <p className="text-sm text-muted-foreground">Next Payment</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card/50 backdrop-blur">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-green-500/10">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">100%</p>
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
                <div className="p-6 rounded-lg border border-border bg-background/50 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">Pro Hosting Plan</h3>
                        <Badge className="bg-primary/10 text-primary border-none">Active</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        100 GB Storage • Unlimited Bandwidth • Free SSL
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">$29.99</p>
                      <p className="text-sm text-muted-foreground">/month</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <p className="text-sm text-muted-foreground">
                      Next billing: <strong>March 15, 2024</strong>
                    </p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Change Plan</Button>
                      <Button variant="destructive" size="sm">Cancel</Button>
                    </div>
                  </div>
                </div>

                <div className="p-6 rounded-lg border border-border bg-background/50 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">CheetiCloud VPS</h3>
                        <Badge className="bg-accent/10 text-accent border-none">Active</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        4 vCPU • 8 GB RAM • 160 GB SSD
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">$49.99</p>
                      <p className="text-sm text-muted-foreground">/month</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <p className="text-sm text-muted-foreground">
                      Next billing: <strong>March 20, 2024</strong>
                    </p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Upgrade</Button>
                      <Button variant="destructive" size="sm">Cancel</Button>
                    </div>
                  </div>
                </div>
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
                <div className="space-y-3">
                  {invoices.map((invoice) => (
                    <div
                      key={invoice.id}
                      className="flex items-center justify-between p-4 rounded-lg border border-border bg-background/50 hover:border-primary/50 transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                          <CreditCard className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold">{invoice.id}</h4>
                          <p className="text-sm text-muted-foreground">{invoice.plan}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className="font-semibold">${invoice.amount}</p>
                          <p className="text-sm text-muted-foreground">{invoice.date}</p>
                        </div>
                        <Badge
                          variant={invoice.status === "paid" ? "default" : "secondary"}
                          className={invoice.status === "paid" ? "bg-green-500/10 text-green-500 border-none" : ""}
                        >
                          {invoice.status}
                        </Badge>
                        <Button variant="ghost" size="sm" className="gap-2">
                          <Download className="h-4 w-4" />
                          PDF
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
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
                {paymentMethods.map((method) => (
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
                            {method.type} •••• {method.last4}
                          </h4>
                          {method.default && (
                            <Badge className="bg-primary/10 text-primary border-none">Default</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">Expires {method.expiry}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {!method.default && <Button variant="outline" size="sm">Set Default</Button>}
                      <Button variant="ghost" size="sm">Edit</Button>
                      <Button variant="ghost" size="sm" className="text-destructive">
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
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
              <Button variant="secondary" size="lg" className="gap-2">
                Switch to Annual
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Billing;
