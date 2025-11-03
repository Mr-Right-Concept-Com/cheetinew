import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Server, Zap, Shield, HardDrive, Globe, Check } from "lucide-react";
import { Navigation } from "@/components/Navigation";

const Hosting = () => {
  const features = [
    {
      icon: Zap,
      title: "Lightning Fast SSD",
      description: "NVMe SSD storage for blazing-fast website performance",
    },
    {
      icon: Shield,
      title: "Free SSL Certificates",
      description: "Automatic SSL installation and renewal for all domains",
    },
    {
      icon: Globe,
      title: "Global CDN",
      description: "Content delivery network for faster loading worldwide",
    },
    {
      icon: HardDrive,
      title: "Daily Backups",
      description: "Automatic daily backups with one-click restore",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Navigation />

      <div className="pt-32 pb-20 px-4">
        <div className="container mx-auto space-y-16">
          <div className="text-center space-y-6 max-w-3xl mx-auto animate-fade-in-up">
            <h1 className="text-5xl lg:text-6xl font-bold">
              Web <span className="text-primary">Hosting</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Fast, secure, and reliable hosting for your websites and applications
            </p>
            <Link to="/pricing">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-glow">
                View Plans
              </Button>
            </Link>
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

export default Hosting;
