import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Check, Sparkles, ShoppingCart, ChevronDown, ChevronUp } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { useAuth } from "@/hooks/useAuth";
import { usePlans } from "@/hooks/useBilling";
import { useCart } from "@/hooks/useCart";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type BillingPeriod = "monthly" | "yearly" | "biennial";

const Pricing = () => {
  const { user } = useAuth();
  const dashboardLink = user ? "/dashboard" : "/auth/signup";
  const [productTab, setProductTab] = useState("hosting");
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>("yearly");
  const [showComparison, setShowComparison] = useState(false);
  const { addItem } = useCart();

  const { data: hostingPlans, isLoading: loadingHosting } = usePlans("hosting");
  const { data: cloudPlans, isLoading: loadingCloud } = usePlans("cloud");

  const getPrice = (plan: { price_monthly: number; price_yearly?: number | null; price_biennial?: number | null }) => {
    if (billingPeriod === "yearly" && plan.price_yearly) return +(plan.price_yearly / 12).toFixed(2);
    if (billingPeriod === "biennial" && plan.price_biennial) return +(plan.price_biennial / 24).toFixed(2);
    return plan.price_monthly;
  };

  const getDiscount = (plan: { price_monthly: number; price_yearly?: number | null; price_biennial?: number | null }) => {
    const monthlyTotal = plan.price_monthly;
    const effective = getPrice(plan);
    if (effective >= monthlyTotal) return 0;
    return Math.round(((monthlyTotal - effective) / monthlyTotal) * 100);
  };

  const handleAddToCart = (plan: { name: string; description?: string | null; price_monthly: number; price_yearly?: number | null; price_biennial?: number | null; type: string }) => {
    const price = billingPeriod === "yearly" && plan.price_yearly
      ? plan.price_yearly
      : billingPeriod === "biennial" && plan.price_biennial
        ? plan.price_biennial
        : plan.price_monthly;
    addItem({
      type: plan.type === "cloud" ? "cloud" : "hosting",
      name: `${plan.name} Plan`,
      description: plan.description || undefined,
      price,
      period: billingPeriod,
      quantity: 1,
    });
  };

  const renderPlans = (plans: typeof hostingPlans, loading: boolean, cols = 3) => {
    if (loading) {
      return (
        <div className={`grid md:grid-cols-${cols} gap-6 max-w-7xl mx-auto`}>
          {Array.from({ length: cols }).map((_, i) => (
            <Card key={i} className="bg-card/50 backdrop-blur">
              <CardContent className="p-6 space-y-4">
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-12 w-24" />
                <div className="space-y-2">{[1,2,3,4].map(j => <Skeleton key={j} className="h-4 w-full" />)}</div>
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      );
    }

    return (
      <div className={`grid md:grid-cols-${Math.min(cols, plans?.length || cols)} gap-6 max-w-7xl mx-auto`}>
        {plans?.map((plan, index) => {
          const features = Array.isArray(plan.features) ? plan.features as string[] : [];
          const price = getPrice(plan);
          const discount = getDiscount(plan);
          return (
            <Card
              key={plan.id}
              className={`relative ${
                plan.is_featured
                  ? "border-primary shadow-glow md:scale-105 bg-card"
                  : "hover:border-primary/50 bg-card/50 backdrop-blur"
              } transition-all duration-300 animate-fade-in-up`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {plan.is_featured && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Badge className="bg-gradient-speed text-primary-foreground px-3 py-1 text-xs font-semibold">
                    MOST POPULAR
                  </Badge>
                </div>
              )}
              {discount > 0 && (
                <div className="absolute top-3 right-3">
                  <Badge variant="destructive" className="text-xs font-bold">{discount}% OFF</Badge>
                </div>
              )}
              <CardContent className="p-6 space-y-5">
                <div>
                  <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
                  <p className="text-muted-foreground text-xs">{plan.description}</p>
                </div>
                <div>
                  <div className="flex items-baseline gap-2">
                    {discount > 0 && (
                      <span className="text-lg text-muted-foreground line-through">${plan.price_monthly}</span>
                    )}
                    <span className="text-4xl font-bold text-primary">${price}</span>
                    <span className="text-muted-foreground text-sm">/mo</span>
                  </div>
                  {billingPeriod !== "monthly" && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Renews at ${plan.price_monthly}/mo
                    </p>
                  )}
                  {billingPeriod === "yearly" && (
                    <Badge variant="secondary" className="mt-2 text-xs">+3 months free</Badge>
                  )}
                </div>
                <ul className="space-y-2">
                  {features.map((feature, fi) => (
                    <li key={fi} className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-xs">{String(feature)}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className={`w-full gap-2 ${
                    plan.is_featured ? "bg-primary hover:bg-primary/90 text-primary-foreground shadow-glow" : ""
                  }`}
                  variant={plan.is_featured ? "default" : "secondary"}
                  onClick={() => handleAddToCart(plan)}
                >
                  <ShoppingCart className="h-4 w-4" /> Add to Cart
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  };

  const comparisonFeatures = [
    "SSD Storage", "Bandwidth", "Free SSL", "Daily Backups", "Free Domain",
    "CDN Included", "SSH Access", "Staging Environment", "Priority Support", "White-label",
  ];

  const faqs = [
    { q: "Can I upgrade or downgrade my plan?", a: "Yes! You can change your plan at any time. Upgrades are instant, and downgrades take effect at the end of your billing cycle." },
    { q: "Is there a free trial?", a: "We offer a 14-day free trial on Professional and Enterprise plans with full access to all features." },
    { q: "What payment methods do you accept?", a: "We accept all major credit cards via Stripe, Paystack, Flutterwave, and mobile money for African markets." },
    { q: "Do you offer refunds?", a: "Yes, we have a 30-day money-back guarantee. If you're not satisfied, we'll refund your payment in full." },
    { q: "Is there a setup fee?", a: "No setup fees on any plan. You only pay the listed subscription price." },
    { q: "Can I host multiple websites?", a: "Yes! Professional and Enterprise plans support multiple websites. Check the plan features for exact limits." },
  ];

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Navigation />

      <div className="pt-28 pb-16 px-4">
        <div className="container mx-auto space-y-12">
          {/* Header */}
          <div className="text-center space-y-4 max-w-3xl mx-auto animate-fade-in-up">
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Simple, Transparent Pricing</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
              Choose Your <span className="text-primary">Perfect Plan</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Start free, scale as you grow. All plans include our core features.
            </p>
          </div>

          {/* Trust Strip */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5"><Check className="h-4 w-4 text-primary" /> 30-day money-back guarantee</div>
            <div className="flex items-center gap-1.5"><Check className="h-4 w-4 text-primary" /> 24/7 expert support</div>
            <div className="flex items-center gap-1.5"><Check className="h-4 w-4 text-primary" /> Cancel anytime</div>
          </div>

          {/* Product Type Tabs */}
          <Tabs value={productTab} onValueChange={setProductTab} className="w-full">
            <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-3 sm:grid-cols-6 h-auto">
              <TabsTrigger value="hosting" className="text-xs py-2">Web Hosting</TabsTrigger>
              <TabsTrigger value="cloud" className="text-xs py-2">Cloud VPS</TabsTrigger>
              <TabsTrigger value="wordpress" className="text-xs py-2">WordPress</TabsTrigger>
              <TabsTrigger value="builder" className="text-xs py-2">Builder</TabsTrigger>
              <TabsTrigger value="email" className="text-xs py-2">Email</TabsTrigger>
              <TabsTrigger value="domains" className="text-xs py-2">Domains</TabsTrigger>
            </TabsList>

            {/* Billing Period Toggle */}
            <div className="flex items-center justify-center gap-2 mt-6">
              {(["monthly", "yearly", "biennial"] as BillingPeriod[]).map((period) => (
                <Button
                  key={period}
                  variant={billingPeriod === period ? "default" : "outline"}
                  size="sm"
                  onClick={() => setBillingPeriod(period)}
                  className={`relative ${billingPeriod === period ? "bg-primary text-primary-foreground" : ""}`}
                >
                  {period === "monthly" ? "Monthly" : period === "yearly" ? "1 Year" : "2 Years"}
                  {period === "biennial" && (
                    <Badge className="absolute -top-2 -right-2 text-[10px] px-1 py-0 bg-destructive text-destructive-foreground">BEST</Badge>
                  )}
                </Button>
              ))}
            </div>

            <TabsContent value="hosting" className="mt-8">
              {renderPlans(hostingPlans, loadingHosting, 3)}
            </TabsContent>

            <TabsContent value="cloud" className="mt-8">
              {renderPlans(cloudPlans, loadingCloud, 4)}
            </TabsContent>

            <TabsContent value="wordpress" className="mt-8">
              {renderPlans(hostingPlans, loadingHosting, 3)}
            </TabsContent>

            <TabsContent value="builder" className="mt-8">
              <div className="text-center py-12 text-muted-foreground">
                <Sparkles className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-2">AI Website Builder</h3>
                <p className="text-sm">Included free with all hosting plans. <Link to="/dashboard/builder" className="text-primary hover:underline">Try it now →</Link></p>
              </div>
            </TabsContent>

            <TabsContent value="email" className="mt-8">
              <div className="text-center py-12 text-muted-foreground">
                <Sparkles className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-2">Professional Email</h3>
                <p className="text-sm mb-4">Starting at $1.59/mo per mailbox</p>
                <Link to="/dashboard/email"><Button>Set Up Email</Button></Link>
              </div>
            </TabsContent>

            <TabsContent value="domains" className="mt-8">
              <div className="text-center py-12 text-muted-foreground">
                <Sparkles className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-2">Domain Registration</h3>
                <p className="text-sm mb-4">Starting at $1.88/yr with free WHOIS privacy</p>
                <Link to="/dashboard/domains"><Button>Search Domains</Button></Link>
              </div>
            </TabsContent>
          </Tabs>

          {/* Feature Comparison */}
          <div className="max-w-4xl mx-auto">
            <Button
              variant="ghost"
              className="w-full gap-2 text-muted-foreground"
              onClick={() => setShowComparison(!showComparison)}
            >
              {showComparison ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              {showComparison ? "Hide" : "View"} Full Feature Comparison
            </Button>

            {showComparison && (
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left p-3 text-muted-foreground font-medium">Feature</th>
                      {hostingPlans?.map((p) => (
                        <th key={p.id} className="text-center p-3 font-semibold">{p.name}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonFeatures.map((feature, i) => (
                      <tr key={i} className="border-b border-border/50">
                        <td className="p-3 text-muted-foreground">{feature}</td>
                        {hostingPlans?.map((p, pi) => (
                          <td key={p.id} className="text-center p-3">
                            <Check className={`h-4 w-4 mx-auto ${pi >= (i > 5 ? 1 : 0) ? "text-primary" : "text-muted-foreground/30"}`} />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* FAQ */}
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-2xl font-bold text-center">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, i) => (
                <AccordionItem key={i} value={`faq-${i}`}>
                  <AccordionTrigger className="text-sm text-left">{faq.q}</AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground">{faq.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {/* Not sure CTA */}
          <div className="text-center space-y-4 pt-4">
            <h2 className="text-2xl font-bold">Not Sure Which Plan?</h2>
            <p className="text-sm text-muted-foreground max-w-xl mx-auto">
              Our AI assistant can recommend the perfect plan based on your needs. Or talk to our sales team.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/dashboard/support">
                <Button size="lg" variant="outline">Contact Sales</Button>
              </Link>
              <Link to={dashboardLink}>
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-glow">
                  {user ? "Go to Dashboard" : "Start Free Trial"}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
