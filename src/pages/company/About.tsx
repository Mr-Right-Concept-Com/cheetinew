import { Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Globe, Users, Zap, Shield, Award, ChevronRight } from "lucide-react";

const About = () => (
  <div className="min-h-screen bg-background">
    <Navigation />
    <div className="container mx-auto px-4 pt-24 pb-16 max-w-4xl space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold">About <span className="text-primary">CheetiHost</span></h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          We're on a mission to make the internet faster, more accessible, and more secure for everyone.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Our Story</h2>
          <p className="text-muted-foreground">
            Founded in 2024, CheetiHost was born from a simple idea: hosting should be fast, simple, and affordable.
            Our name comes from "Cheeti" — inspired by the cheetah, the fastest animal on land. We bring that speed
            to your websites and applications.
          </p>
          <p className="text-muted-foreground">
            Today, we serve millions of websites across 150+ countries with our AI-powered infrastructure
            that automatically optimizes performance and security.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[
            { icon: Globe, label: "150+", desc: "Countries served" },
            { icon: Users, label: "4M+", desc: "Happy customers" },
            { icon: Zap, label: "99.9%", desc: "Uptime SLA" },
            { icon: Shield, label: "24/7", desc: "Expert support" },
          ].map((s, i) => (
            <Card key={i}>
              <CardContent className="p-4 text-center space-y-2">
                <s.icon className="h-6 w-6 mx-auto text-primary" />
                <p className="text-2xl font-bold">{s.label}</p>
                <p className="text-xs text-muted-foreground">{s.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-center">Our Values</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: Zap, title: "Speed First", desc: "Every millisecond matters. We optimize relentlessly." },
            { icon: Shield, title: "Security Always", desc: "Enterprise-grade protection for every account." },
            { icon: Award, title: "Customer Obsessed", desc: "Your success is our success. Period." },
          ].map((v, i) => (
            <Card key={i} className="bg-card/50 backdrop-blur">
              <CardContent className="p-6 text-center space-y-3">
                <v.icon className="h-8 w-8 mx-auto text-primary" />
                <h3 className="font-semibold">{v.title}</h3>
                <p className="text-sm text-muted-foreground">{v.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="text-center">
        <Link to="/pricing">
          <Button size="lg" className="gap-2">
            Get Started Today <ChevronRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  </div>
);

export default About;
