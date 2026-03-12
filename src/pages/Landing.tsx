import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Server, Cloud, Globe, Zap, Shield, ChevronRight, Check, TrendingUp,
  Lock, Gauge, Sparkles, Star, Mail, Paintbrush, Award, Users, BarChart3,
} from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { useAuth } from "@/hooks/useAuth";
import { DomainSearch } from "@/components/DomainSearch";
import { useState, useEffect, useRef } from "react";

// Animated counter hook
function useCounter(target: number, duration = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        let start = 0;
        const step = target / (duration / 16);
        const timer = setInterval(() => {
          start += step;
          if (start >= target) { setCount(target); clearInterval(timer); }
          else setCount(Math.floor(start));
        }, 16);
        observer.disconnect();
      }
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);
  return { count, ref };
}

const Landing = () => {
  const { user } = useAuth();
  const dashboardLink = user ? "/dashboard" : "/auth/signup";

  const stats = [
    { label: "Websites Hosted", value: 10000000, suffix: "+", icon: Globe },
    { label: "Happy Clients", value: 4000000, suffix: "+", icon: Users },
    { label: "Countries", value: 150, suffix: "+", icon: BarChart3 },
    { label: "Uptime", value: 99.9, suffix: "%", icon: Gauge, decimal: true },
  ];

  const features = [
    { icon: Zap, title: "Lightning Fast", description: "Optimized infrastructure with global CDN for blazing-fast load times" },
    { icon: Shield, title: "Enterprise Security", description: "Advanced DDoS protection, SSL certificates, and automated backups" },
    { icon: TrendingUp, title: "Auto-Scaling", description: "Seamlessly scale resources based on traffic with zero downtime" },
    { icon: Gauge, title: "99.9% Uptime", description: "Redundant infrastructure ensures your sites are always online" },
    { icon: Lock, title: "Free SSL", description: "Automatic SSL certificates for all domains at no extra cost" },
    { icon: Sparkles, title: "AI-Powered", description: "Intelligent optimization and predictive scaling for peak performance" },
  ];

  const products = [
    { icon: Server, title: "Web Hosting", desc: "From $2.99/mo", detail: "Managed hosting with 1-click installs", link: "/pricing" },
    { icon: Cloud, title: "Cloud VPS", desc: "From $5.99/mo", detail: "Scalable cloud with root access", link: "/pricing" },
    { icon: Globe, title: "Domains", desc: "From $1.88/yr", detail: "500+ TLDs with free WHOIS privacy", link: "/dashboard/domains" },
    { icon: Paintbrush, title: "AI Website Builder", desc: "From $4.99/mo", detail: "Drag & drop with AI content generation", link: "/dashboard/builder" },
    { icon: Mail, title: "Professional Email", desc: "From $1.59/mo", detail: "Business email with anti-spam", link: "/dashboard/email" },
    { icon: Shield, title: "SSL Certificates", desc: "Free", detail: "Auto-renew Let's Encrypt certificates", link: "/dashboard/security" },
  ];

  const testimonials = [
    { name: "Sarah Chen", role: "CTO, TechFlow", content: "CheetiHost transformed our infrastructure. The speed improvements were immediate and the support team is exceptional.", avatar: "SC", rating: 5 },
    { name: "Marcus Johnson", role: "Founder, StartupHub", content: "Migrating to CheetiHost was seamless. Their auto-scaling saved us during our product launch surge.", avatar: "MJ", rating: 5 },
    { name: "Amara Okafor", role: "Lead Developer, CloudApps", content: "The AI-powered optimization is incredible. Our page load times dropped by 60% without any manual tuning.", avatar: "AO", rating: 5 },
  ];

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Navigation />

      {/* Hero Section with Domain Search */}
      <section className="relative pt-28 pb-16 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,hsl(var(--cheeti-gold)/0.1),transparent_50%)]" />
        <div className="container mx-auto relative z-10 text-center space-y-6 max-w-4xl">
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 animate-fade-in">
            <Sparkles className="h-4 w-4 text-primary animate-pulse-glow" />
            <span className="text-sm font-medium text-primary">AI-Powered Cloud Hosting Platform</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight animate-fade-in-up">
            Find Your Perfect{" "}
            <span className="text-primary">Domain</span> &{" "}
            <span className="text-primary">Hosting</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: "100ms" }}>
            Lightning-fast hosting, domain registration, and AI-powered tools. Everything you need to succeed online.
          </p>

          {/* Domain Search */}
          <div className="animate-fade-in-up" style={{ animationDelay: "200ms" }}>
            <DomainSearch compact />
          </div>

          {/* Trust Strip */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 pt-4 text-sm text-muted-foreground animate-fade-in" style={{ animationDelay: "400ms" }}>
            <div className="flex items-center gap-1.5">
              <Check className="h-4 w-4 text-primary" /> 30-Day Money-Back
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="h-4 w-4 text-primary" /> Free SSL
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="h-4 w-4 text-primary" /> 24/7 Support
            </div>
            <div className="flex items-center gap-1.5">
              <div className="flex">
                {[1,2,3,4,5].map(i => <Star key={i} className="h-3.5 w-3.5 text-primary fill-primary" />)}
              </div>
              <span>4.7/5 Trustpilot</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Counter */}
      <section className="py-12 px-4 border-y border-border bg-card/30 backdrop-blur">
        <div className="container mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl">
          {stats.map((stat, i) => {
            const counter = useCounter(stat.decimal ? 999 : stat.value > 100000 ? stat.value / 1000 : stat.value);
            return (
              <div key={i} ref={counter.ref} className="text-center space-y-1">
                <stat.icon className="h-6 w-6 mx-auto text-primary mb-2" />
                <div className="text-2xl sm:text-3xl font-bold text-foreground">
                  {stat.decimal ? "99.9" : stat.value > 100000 ? `${(counter.count / 1000).toFixed(0)}M` : counter.count.toLocaleString()}
                  {!stat.decimal && stat.suffix}
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Product Cards */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12 space-y-3">
            <h2 className="text-3xl lg:text-4xl font-bold">Everything You Need to <span className="text-primary">Succeed Online</span></h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">From domain registration to AI-powered website building</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
            {products.map((product, i) => (
              <Link key={i} to={product.link}>
                <Card className="group hover:shadow-glow hover:border-primary/50 transition-all duration-300 bg-card/50 backdrop-blur h-full">
                  <CardContent className="p-5 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <product.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{product.title}</h3>
                        <p className="text-xs text-primary font-medium">{product.desc}</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{product.detail}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-background/50">
        <div className="container mx-auto">
          <div className="text-center mb-12 space-y-3">
            <h2 className="text-3xl lg:text-4xl font-bold">Why Choose <span className="text-primary">CheetiHost</span>?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Built for speed, designed for simplicity, powered by innovation</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {features.map((feature, i) => (
              <Card key={i} className="group hover:shadow-glow hover:border-primary/50 transition-all duration-300 bg-card/50 backdrop-blur" style={{ animationDelay: `${i * 100}ms` }}>
                <CardContent className="p-5 space-y-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12 space-y-3">
            <h2 className="text-3xl lg:text-4xl font-bold">Loved by <span className="text-primary">Developers</span></h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Join thousands of happy customers</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {testimonials.map((t, i) => (
              <Card key={i} className="bg-card/50 backdrop-blur hover:shadow-elegant transition-all">
                <CardContent className="p-5 space-y-3">
                  <div className="flex gap-0.5">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} className="h-4 w-4 text-primary fill-primary" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground italic">"{t.content}"</p>
                  <div className="flex items-center gap-3 pt-1">
                    <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-sm font-semibold text-primary">{t.avatar}</div>
                    <div>
                      <div className="font-semibold text-sm">{t.name}</div>
                      <div className="text-xs text-muted-foreground">{t.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <Card className="bg-gradient-speed border-none shadow-glow">
            <CardContent className="p-10 text-center space-y-5">
              <h2 className="text-3xl lg:text-4xl font-bold text-primary-foreground">Ready to Go Lightning Fast?</h2>
              <p className="text-lg text-primary-foreground/90 max-w-2xl mx-auto">Join millions of customers who trust CheetiHost.</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                <Link to={dashboardLink}>
                  <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                    {user ? "Go to Dashboard" : "Start Free Trial"} <ChevronRight className="ml-1 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/pricing">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10">
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
          <div className="grid sm:grid-cols-2 md:grid-cols-5 gap-8 mb-8">
            <div className="sm:col-span-2 md:col-span-1 space-y-3">
              <h4 className="font-bold text-lg text-primary">CheetiHost</h4>
              <p className="text-xs text-muted-foreground">Speed. Simplicity. Cheeti. The world's fastest AI-powered hosting platform.</p>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-sm">Products</h4>
              <ul className="space-y-1.5 text-xs text-muted-foreground">
                <li><Link to="/pricing" className="hover:text-primary transition-colors">Web Hosting</Link></li>
                <li><Link to="/pricing" className="hover:text-primary transition-colors">Cloud VPS</Link></li>
                <li><Link to="/dashboard/domains" className="hover:text-primary transition-colors">Domains</Link></li>
                <li><Link to="/dashboard/email" className="hover:text-primary transition-colors">Email Hosting</Link></li>
                <li><Link to="/dashboard/builder" className="hover:text-primary transition-colors">Website Builder</Link></li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-sm">Company</h4>
              <ul className="space-y-1.5 text-xs text-muted-foreground">
                <li><Link to="/company/about" className="hover:text-primary transition-colors">About Us</Link></li>
                <li><Link to="/company/contact" className="hover:text-primary transition-colors">Contact</Link></li>
                <li><Link to="/company/blog" className="hover:text-primary transition-colors">Blog</Link></li>
                <li><Link to="/company/status" className="hover:text-primary transition-colors">Status</Link></li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-sm">Support</h4>
              <ul className="space-y-1.5 text-xs text-muted-foreground">
                <li><Link to="/dashboard/support" className="hover:text-primary transition-colors">Help Center</Link></li>
                <li><Link to="/dashboard/support" className="hover:text-primary transition-colors">Documentation</Link></li>
                <li><Link to="/company/status" className="hover:text-primary transition-colors">Status</Link></li>
                <li><Link to="/dashboard/support" className="hover:text-primary transition-colors">Community</Link></li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-sm">Legal</h4>
              <ul className="space-y-1.5 text-xs text-muted-foreground">
                <li><Link to="/legal/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                <li><Link to="/legal/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
                <li><Link to="/legal/cookies" className="hover:text-primary transition-colors">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>
          {/* Newsletter */}
          <div className="py-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground">Subscribe to our newsletter for hosting tips and deals.</p>
            <div className="flex gap-2">
              <Input placeholder="your@email.com" className="h-9 w-56 text-xs" />
              <Button size="sm" className="h-9" onClick={() => { const input = document.querySelector<HTMLInputElement>('footer input'); if (input?.value && input.value.includes('@')) { toast.success("Subscribed! You'll receive our latest updates."); input.value = ''; } else { toast.error("Please enter a valid email address"); } }}>Subscribe</Button>
            </div>
          </div>
          <div className="pt-6 border-t border-border text-center text-xs text-muted-foreground">
            <p>&copy; 2026 CheetiHost. All rights reserved. Speed. Simplicity. Cheeti.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Need Input import for newsletter
import { Input } from "@/components/ui/input";

export default Landing;
