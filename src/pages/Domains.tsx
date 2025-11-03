import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Globe, Search, Shield, Lock } from "lucide-react";
import { Navigation } from "@/components/Navigation";

const Domains = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const features = [
    {
      icon: Search,
      title: "Easy Domain Search",
      description: "Find your perfect domain with our instant search tool",
    },
    {
      icon: Shield,
      title: "Domain Privacy",
      description: "Free WHOIS privacy protection included",
    },
    {
      icon: Lock,
      title: "Secure Transfer",
      description: "Easy and secure domain transfer process",
    },
    {
      icon: Globe,
      title: "DNS Management",
      description: "Full control over your DNS records",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Navigation />

      <div className="pt-32 pb-20 px-4">
        <div className="container mx-auto space-y-16">
          <div className="text-center space-y-6 max-w-3xl mx-auto animate-fade-in-up">
            <h1 className="text-5xl lg:text-6xl font-bold">
              Find Your Perfect <span className="text-primary">Domain</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Register your domain and build your online presence today
            </p>

            <Card className="bg-card/80 backdrop-blur border-primary/20">
              <CardContent className="p-6">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      placeholder="Search for your domain..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 h-12 text-lg"
                    />
                  </div>
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8">
                    Search
                  </Button>
                </div>
                <div className="flex gap-4 mt-4 text-sm">
                  <span className="text-muted-foreground">.com</span>
                  <span className="text-muted-foreground">.net</span>
                  <span className="text-muted-foreground">.io</span>
                  <span className="text-muted-foreground">.dev</span>
                  <span className="text-muted-foreground">.app</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-card/50 backdrop-blur hover:shadow-glow transition-all">
                <CardContent className="p-6 space-y-4 text-center">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Domains;
