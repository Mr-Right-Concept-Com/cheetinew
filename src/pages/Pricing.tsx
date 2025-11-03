import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Sparkles } from "lucide-react";
import { Navigation } from "@/components/Navigation";

const Pricing = () => {
  const plans = [
    {
      name: "Starter",
      price: "$9",
      period: "/month",
      description: "Perfect for personal projects and small websites",
      features: [
        "1 Website",
        "10GB SSD Storage",
        "100GB Bandwidth",
        "Free SSL Certificate",
        "Daily Backups",
        "24/7 Email Support",
        "99.9% Uptime SLA",
        "1-Click WordPress Install",
      ],
      cta: "Get Started",
      featured: false,
    },
    {
      name: "Professional",
      price: "$29",
      period: "/month",
      description: "Best for growing businesses and agencies",
      features: [
        "5 Websites",
        "50GB SSD Storage",
        "Unlimited Bandwidth",
        "Free SSL Certificates",
        "Hourly Backups",
        "Priority Support (24/7)",
        "99.99% Uptime SLA",
        "Free Domain (1 year)",
        "CDN Included",
        "Staging Environment",
        "Advanced Analytics",
        "Git Integration",
      ],
      cta: "Start Free Trial",
      featured: true,
    },
    {
      name: "Enterprise",
      price: "$99",
      period: "/month",
      description: "For mission-critical applications at scale",
      features: [
        "Unlimited Websites",
        "200GB SSD Storage",
        "Unlimited Bandwidth",
        "Free SSL Certificates",
        "Real-time Backups",
        "Dedicated Support Manager",
        "99.99% Uptime SLA",
        "Free Domains (Unlimited)",
        "Global CDN",
        "White-label Options",
        "Advanced Security Suite",
        "Custom Development Support",
        "Priority Feature Requests",
        "Dedicated IP Addresses",
      ],
      cta: "Contact Sales",
      featured: false,
    },
  ];

  const cloudPlans = [
    {
      name: "Cloud Basic",
      price: "$19",
      period: "/month",
      specs: {
        cpu: "2 vCPU",
        ram: "4GB RAM",
        storage: "80GB SSD",
        bandwidth: "4TB Transfer",
      },
    },
    {
      name: "Cloud Pro",
      price: "$49",
      period: "/month",
      specs: {
        cpu: "4 vCPU",
        ram: "8GB RAM",
        storage: "160GB SSD",
        bandwidth: "8TB Transfer",
      },
    },
    {
      name: "Cloud Performance",
      price: "$99",
      period: "/month",
      specs: {
        cpu: "8 vCPU",
        ram: "16GB RAM",
        storage: "320GB SSD",
        bandwidth: "16TB Transfer",
      },
    },
    {
      name: "Cloud Enterprise",
      price: "$199",
      period: "/month",
      specs: {
        cpu: "16 vCPU",
        ram: "32GB RAM",
        storage: "640GB SSD",
        bandwidth: "32TB Transfer",
      },
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Navigation />

      <div className="pt-32 pb-20 px-4">
        <div className="container mx-auto space-y-20">
          {/* Header */}
          <div className="text-center space-y-6 max-w-3xl mx-auto animate-fade-in-up">
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Simple, Transparent Pricing</span>
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold">
              Choose Your <span className="text-primary">Perfect Plan</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Start free, scale as you grow. All plans include our core features with no hidden fees.
            </p>
          </div>

          {/* Web Hosting Plans */}
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-2">Web Hosting Plans</h2>
              <p className="text-muted-foreground">
                Lightning-fast hosting for websites and applications
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {plans.map((plan, index) => (
                <Card
                  key={index}
                  className={`relative ${
                    plan.featured
                      ? "border-primary shadow-glow scale-105 bg-card"
                      : "hover:border-primary/50 bg-card/50 backdrop-blur"
                  } transition-all duration-300 animate-fade-in-up`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {plan.featured && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <div className="bg-gradient-speed text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
                        Most Popular
                      </div>
                    </div>
                  )}
                  <CardContent className="p-8 space-y-6">
                    <div>
                      <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                      <p className="text-muted-foreground text-sm">{plan.description}</p>
                    </div>
                    <div className="flex items-baseline">
                      <span className="text-5xl font-bold text-primary">{plan.price}</span>
                      <span className="text-muted-foreground ml-2">{plan.period}</span>
                    </div>
                    <ul className="space-y-3">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start space-x-3">
                          <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Link to="/dashboard" className="block">
                      <Button
                        className={`w-full ${
                          plan.featured
                            ? "bg-primary hover:bg-primary/90 text-primary-foreground shadow-glow"
                            : "bg-secondary hover:bg-secondary/90"
                        }`}
                      >
                        {plan.cta}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Cloud VPS Plans */}
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-2">Cloud VPS Plans</h2>
              <p className="text-muted-foreground">
                Scalable cloud infrastructure for demanding workloads
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {cloudPlans.map((plan, index) => (
                <Card
                  key={index}
                  className="hover:border-accent/50 hover:shadow-elegant transition-all bg-card/50 backdrop-blur animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-6 space-y-6">
                    <div>
                      <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                      <div className="flex items-baseline">
                        <span className="text-3xl font-bold text-accent">{plan.price}</span>
                        <span className="text-muted-foreground ml-2 text-sm">{plan.period}</span>
                      </div>
                    </div>
                    <div className="space-y-3 pt-4 border-t border-border">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">CPU</span>
                        <span className="text-sm font-semibold">{plan.specs.cpu}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">RAM</span>
                        <span className="text-sm font-semibold">{plan.specs.ram}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Storage</span>
                        <span className="text-sm font-semibold">{plan.specs.storage}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Transfer</span>
                        <span className="text-sm font-semibold">{plan.specs.bandwidth}</span>
                      </div>
                    </div>
                    <Link to="/dashboard" className="block">
                      <Button variant="outline" className="w-full">
                        Deploy Now
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* FAQ Section */}
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-2">Frequently Asked Questions</h2>
              <p className="text-muted-foreground">Everything you need to know about our pricing</p>
            </div>

            <div className="space-y-4">
              {[
                {
                  q: "Can I upgrade or downgrade my plan?",
                  a: "Yes! You can change your plan at any time. Upgrades are instant, and downgrades take effect at the end of your billing cycle.",
                },
                {
                  q: "Is there a free trial?",
                  a: "We offer a 14-day free trial on Professional and Enterprise plans with full access to all features.",
                },
                {
                  q: "What payment methods do you accept?",
                  a: "We accept all major credit cards, PayPal, and wire transfers for Enterprise customers.",
                },
                {
                  q: "Do you offer refunds?",
                  a: "Yes, we have a 30-day money-back guarantee. If you're not satisfied, we'll refund your payment in full.",
                },
              ].map((faq, index) => (
                <Card key={index} className="bg-card/50 backdrop-blur">
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-2">{faq.q}</h3>
                    <p className="text-muted-foreground text-sm">{faq.a}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center space-y-6 pt-8">
            <h2 className="text-3xl font-bold">Still Have Questions?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our team is here to help. Reach out and we'll find the perfect solution for your needs.
            </p>
            <div className="flex gap-4 justify-center">
              <Link to="/contact">
                <Button size="lg" variant="outline">
                  Contact Sales
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-glow">
                  Start Free Trial
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
