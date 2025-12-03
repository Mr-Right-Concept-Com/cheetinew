import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Server,
  Cloud,
  Globe,
  Zap,
  Shield,
  ChevronRight,
  Check,
  TrendingUp,
  Lock,
  Gauge,
  Sparkles,
  Users,
  Award,
} from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { useAuth } from "@/hooks/useAuth";
import mascot from "@/assets/mascot-cheeti.png";

const Landing = () => {
  const { user } = useAuth();

  const features = [
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Optimized infrastructure with global CDN for blazing-fast load times",
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Advanced DDoS protection, SSL certificates, and automated backups",
    },
    {
      icon: TrendingUp,
      title: "Auto-Scaling",
      description: "Seamlessly scale resources based on traffic with zero downtime",
    },
    {
      icon: Gauge,
      title: "99.9% Uptime",
      description: "Redundant infrastructure ensures your sites are always online",
    },
    {
      icon: Lock,
      title: "Free SSL",
      description: "Automatic SSL certificates for all domains at no extra cost",
    },
    {
      icon: Sparkles,
      title: "AI-Powered",
      description: "Intelligent optimization and predictive scaling for peak performance",
    },
  ];

  const plans = [
    {
      name: "Starter",
      price: "$9",
      period: "/month",
      description: "Perfect for personal projects",
      features: [
        "1 Website",
        "10GB SSD Storage",
        "100GB Bandwidth",
        "Free SSL Certificate",
        "Daily Backups",
        "24/7 Support",
      ],
      cta: "Get Started",
      featured: false,
    },
    {
      name: "Professional",
      price: "$29",
      period: "/month",
      description: "Best for growing businesses",
      features: [
        "5 Websites",
        "50GB SSD Storage",
        "Unlimited Bandwidth",
        "Free SSL Certificates",
        "Hourly Backups",
        "Priority Support",
        "Free Domain (1 year)",
        "CDN Included",
      ],
      cta: "Start Free Trial",
      featured: true,
    },
    {
      name: "Enterprise",
      price: "$99",
      period: "/month",
      description: "For mission-critical applications",
      features: [
        "Unlimited Websites",
        "200GB SSD Storage",
        "Unlimited Bandwidth",
        "Free SSL Certificates",
        "Real-time Backups",
        "Dedicated Support",
        "White-label Options",
        "Advanced Analytics",
      ],
      cta: "Contact Sales",
      featured: false,
    },
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "CTO, TechFlow",
      content:
        "CheetiHost transformed our infrastructure. The speed improvements were immediate and the support team is exceptional.",
      avatar: "SC",
    },
    {
      name: "Marcus Johnson",
      role: "Founder, StartupHub",
      content:
        "Migrating to CheetiHost was seamless. Their auto-scaling saved us during our product launch surge.",
      avatar: "MJ",
    },
    {
      name: "Amara Okafor",
      role: "Lead Developer, CloudApps",
      content:
        "The AI-powered optimization is incredible. Our page load times dropped by 60% without any manual tuning.",
      avatar: "AO",
    },
  ];

  const dashboardLink = user ? "/dashboard" : "/auth/signup";

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Navigation />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,hsl(var(--cheeti-gold)/0.1),transparent_50%)]" />
        
        <div className="container mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fade-in-up">
              <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                <Sparkles className="h-4 w-4 text-primary animate-pulse-glow" />
                <span className="text-sm font-medium text-primary">AI-Powered Cloud Hosting</span>
              </div>

              <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                <span className="text-foreground">Speed.</span>{" "}
                <span className="text-foreground">Simplicity.</span>{" "}
                <span className="text-primary">Cheeti.</span>
              </h1>

              <p className="text-xl text-muted-foreground max-w-xl">
                Experience lightning-fast hosting with AI-driven optimization. Deploy globally in seconds and scale
                effortlessly with CheetiHost.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to={dashboardLink}>
                  <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground shadow-glow">
                    {user ? "Go to Dashboard" : "Start Free Trial"}
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/pricing">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    View Pricing
                  </Button>
                </Link>
              </div>

              <div className="flex items-center space-x-6 pt-4">
                <div className="flex items-center space-x-2">
                  <Check className="h-5 w-5 text-primary" />
                  <span className="text-sm text-muted-foreground">Free SSL</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="h-5 w-5 text-primary" />
                  <span className="text-sm text-muted-foreground">24/7 Support</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="h-5 w-5 text-primary" />
                  <span className="text-sm text-muted-foreground">99.9% Uptime</span>
                </div>
              </div>
            </div>

            <div className="relative animate-fade-in">
              <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full" />
              <img
                src={mascot}
                alt="Cheeti Mascot"
                className="relative z-10 w-full max-w-md mx-auto animate-bounce-subtle"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-background/50">
        <div className="container mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl lg:text-5xl font-bold">
              Why Choose <span className="text-primary">CheetiHost</span>?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Built for speed, designed for simplicity, powered by innovation
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="group hover:shadow-glow hover:border-primary/50 transition-all duration-300 animate-fade-in-up bg-card/50 backdrop-blur"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6 space-y-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl lg:text-5xl font-bold">
              Simple, Transparent <span className="text-primary">Pricing</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose the perfect plan for your needs. All plans include our core features.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <Card
                key={index}
                className={`relative ${
                  plan.featured
                    ? "border-primary shadow-glow scale-105 bg-card"
                    : "hover:border-primary/50 bg-card/50 backdrop-blur"
                } transition-all duration-300`}
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
                  <Link to={dashboardLink} className="block">
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
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 bg-background/50">
        <div className="container mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl lg:text-5xl font-bold">
              Loved by <span className="text-primary">Developers</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join thousands of happy customers building amazing things
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-card/50 backdrop-blur hover:shadow-elegant transition-all">
                <CardContent className="p-6 space-y-4">
                  <p className="text-muted-foreground italic">"{testimonial.content}"</p>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-semibold text-primary">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <Card className="bg-gradient-speed border-none shadow-glow">
            <CardContent className="p-12 text-center space-y-6">
              <h2 className="text-4xl lg:text-5xl font-bold text-primary-foreground">
                Ready to Go Lightning Fast?
              </h2>
              <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto">
                Join thousands of developers and businesses who trust CheetiHost for their hosting needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Link to={dashboardLink}>
                  <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                    {user ? "Go to Dashboard" : "Start Free Trial"}
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/pricing">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10"
                  >
                    View Pricing
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-border bg-background/50">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-4">
              <h4 className="font-semibold text-lg">Products</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link to="/dashboard/hosting" className="hover:text-primary transition-colors">Web Hosting</Link></li>
                <li><Link to="/dashboard/cloud" className="hover:text-primary transition-colors">Cloud VPS</Link></li>
                <li><Link to="/dashboard/domains" className="hover:text-primary transition-colors">Domains</Link></li>
                <li><Link to="/dashboard/email" className="hover:text-primary transition-colors">Email Hosting</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold text-lg">Company</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link to="/" className="hover:text-primary transition-colors">About Us</Link></li>
                <li><Link to="/" className="hover:text-primary transition-colors">Contact</Link></li>
                <li><Link to="/" className="hover:text-primary transition-colors">Careers</Link></li>
                <li><Link to="/" className="hover:text-primary transition-colors">Blog</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold text-lg">Support</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link to="/dashboard/support" className="hover:text-primary transition-colors">Documentation</Link></li>
                <li><Link to="/dashboard/support" className="hover:text-primary transition-colors">Help Center</Link></li>
                <li><Link to="/" className="hover:text-primary transition-colors">Status</Link></li>
                <li><Link to="/" className="hover:text-primary transition-colors">Community</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold text-lg">Legal</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link to="/" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                <li><Link to="/" className="hover:text-primary transition-colors">Terms of Service</Link></li>
                <li><Link to="/" className="hover:text-primary transition-colors">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-border text-center text-muted-foreground">
            <p>&copy; 2025 CheetiHost. All rights reserved. Speed. Simplicity. Cheeti.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
