import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  ShoppingCart,
  CreditCard,
  CheckCircle,
  ArrowLeft,
  Lock,
  Shield,
  Trash2,
} from "lucide-react";

type Step = "review" | "billing" | "payment" | "confirmation";

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, removeItem, subtotal, total, clearCart, itemCount } = useCart();
  const [step, setStep] = useState<Step>("review");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [isProcessing, setIsProcessing] = useState(false);

  const [billingInfo, setBillingInfo] = useState({
    fullName: "",
    email: user?.email || "",
    address: "",
    city: "",
    country: "",
    zip: "",
  });

  if (itemCount === 0 && step !== "confirmation") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center">
          <CardContent className="p-8 space-y-4">
            <ShoppingCart className="h-16 w-16 mx-auto text-muted-foreground" />
            <h2 className="text-2xl font-bold">Your cart is empty</h2>
            <p className="text-muted-foreground">Add some services to get started.</p>
            <Button onClick={() => navigate("/pricing")} className="gap-2">
              Browse Plans
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      // Create subscription records for each item
      for (const item of items) {
        await supabase.from("subscriptions").insert({
          user_id: user!.id,
          plan_name: item.name,
          plan_type: item.type,
          amount: item.price * item.quantity,
          interval: item.period === "yearly" ? "yearly" : "monthly",
          status: "active",
          current_period_start: new Date().toISOString(),
          current_period_end: new Date(Date.now() + (item.period === "yearly" ? 365 : 30) * 86400000).toISOString(),
        });

        // Call provisioning edge functions based on type
        if (item.type === "hosting") {
          await supabase.functions.invoke("provision-hosting", {
            body: { name: item.name, plan: item.name, userId: user!.id },
          });
        } else if (item.type === "domain") {
          await supabase.functions.invoke("provision-domain", {
            body: { domain: item.name, userId: user!.id },
          });
        } else if (item.type === "cloud" || item.type === "vps") {
          await supabase.functions.invoke("provision-vps", {
            body: { name: item.name, userId: user!.id },
          });
        }
      }

      clearCart();
      setStep("confirmation");
      toast.success("Payment successful! Your services are being provisioned.");
    } catch (error) {
      toast.error("Payment processing failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const steps: { key: Step; label: string; number: number }[] = [
    { key: "review", label: "Review", number: 1 },
    { key: "billing", label: "Billing", number: 2 },
    { key: "payment", label: "Payment", number: 3 },
    { key: "confirmation", label: "Done", number: 4 },
  ];

  const stepIndex = steps.findIndex((s) => s.key === step);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Checkout</h1>
            <p className="text-muted-foreground">Complete your purchase</p>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-between">
          {steps.map((s, i) => (
            <div key={s.key} className="flex items-center gap-2 flex-1">
              <div
                className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium shrink-0 ${
                  i <= stepIndex
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {i < stepIndex ? <CheckCircle className="h-4 w-4" /> : s.number}
              </div>
              <span className={`text-sm hidden sm:block ${i <= stepIndex ? "font-medium" : "text-muted-foreground"}`}>
                {s.label}
              </span>
              {i < steps.length - 1 && (
                <div className={`flex-1 h-px mx-2 ${i < stepIndex ? "bg-primary" : "bg-border"}`} />
              )}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {step === "review" && (
              <Card>
                <CardHeader>
                  <CardTitle>Order Review</CardTitle>
                  <CardDescription>Verify your items before proceeding</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 rounded-lg border">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{item.name}</p>
                          <Badge variant="outline" className="text-xs">{item.type}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {item.quantity}x · {item.period === "once" ? "One-time" : `Billed ${item.period}`}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => removeItem(item.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Button onClick={() => setStep("billing")} className="w-full">
                    Continue to Billing
                  </Button>
                </CardContent>
              </Card>
            )}

            {step === "billing" && (
              <Card>
                <CardHeader>
                  <CardTitle>Billing Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <Label>Full Name</Label>
                      <Input value={billingInfo.fullName} onChange={(e) => setBillingInfo({ ...billingInfo, fullName: e.target.value })} placeholder="John Doe" />
                    </div>
                    <div className="col-span-2">
                      <Label>Email</Label>
                      <Input value={billingInfo.email} onChange={(e) => setBillingInfo({ ...billingInfo, email: e.target.value })} type="email" />
                    </div>
                    <div className="col-span-2">
                      <Label>Address</Label>
                      <Input value={billingInfo.address} onChange={(e) => setBillingInfo({ ...billingInfo, address: e.target.value })} />
                    </div>
                    <div>
                      <Label>City</Label>
                      <Input value={billingInfo.city} onChange={(e) => setBillingInfo({ ...billingInfo, city: e.target.value })} />
                    </div>
                    <div>
                      <Label>ZIP</Label>
                      <Input value={billingInfo.zip} onChange={(e) => setBillingInfo({ ...billingInfo, zip: e.target.value })} />
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setStep("review")}>Back</Button>
                    <Button onClick={() => setStep("payment")} className="flex-1">Continue to Payment</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {step === "payment" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="h-5 w-5" />
                    Secure Payment
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 rounded-lg border cursor-pointer hover:bg-muted/50">
                      <RadioGroupItem value="card" id="card" />
                      <Label htmlFor="card" className="flex-1 cursor-pointer">
                        <p className="font-medium">Credit/Debit Card</p>
                        <p className="text-sm text-muted-foreground">Visa, Mastercard, AMEX</p>
                      </Label>
                      <CreditCard className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="flex items-center space-x-3 p-3 rounded-lg border cursor-pointer hover:bg-muted/50">
                      <RadioGroupItem value="paystack" id="paystack" />
                      <Label htmlFor="paystack" className="flex-1 cursor-pointer">
                        <p className="font-medium">Paystack</p>
                        <p className="text-sm text-muted-foreground">Cards, bank, mobile money</p>
                      </Label>
                    </div>
                  </RadioGroup>

                  {paymentMethod === "card" && (
                    <div className="space-y-4">
                      <div>
                        <Label>Card Number</Label>
                        <Input placeholder="4242 4242 4242 4242" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Expiry</Label>
                          <Input placeholder="MM/YY" />
                        </div>
                        <div>
                          <Label>CVC</Label>
                          <Input placeholder="123" />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Shield className="h-4 w-4" />
                    <span>Your payment is secured with 256-bit SSL encryption</span>
                  </div>

                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setStep("billing")}>Back</Button>
                    <Button
                      onClick={handlePayment}
                      disabled={isProcessing}
                      className="flex-1 bg-gradient-speed text-primary-foreground shadow-glow"
                    >
                      {isProcessing ? "Processing..." : `Pay $${total.toFixed(2)}`}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {step === "confirmation" && (
              <Card>
                <CardContent className="p-8 text-center space-y-4">
                  <div className="p-4 rounded-full bg-green-500/10 w-fit mx-auto">
                    <CheckCircle className="h-12 w-12 text-green-500" />
                  </div>
                  <h2 className="text-2xl font-bold">Payment Successful!</h2>
                  <p className="text-muted-foreground">
                    Your services are being provisioned. You'll receive a confirmation email shortly.
                  </p>
                  <Button onClick={() => navigate("/dashboard")} className="gap-2">
                    Go to Dashboard
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Order Summary Sidebar */}
          {step !== "confirmation" && (
            <Card className="h-fit sticky top-24">
              <CardHeader>
                <CardTitle className="text-lg">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="truncate mr-2">{item.name}</span>
                    <span className="font-medium shrink-0">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <Separator />
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Checkout;
