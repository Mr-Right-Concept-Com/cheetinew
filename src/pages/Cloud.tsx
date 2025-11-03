import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Cloud as CloudIcon, Activity, TrendingUp, Layers } from "lucide-react";
import { Navigation } from "@/components/Navigation";

const Cloud = () => {
  const features = [
    {
      icon: Activity,
      title: "Auto-Scaling",
      description: "Automatically scale resources based on demand",
    },
    {
      icon: TrendingUp,
      title: "Performance Optimized",
      description: "High-performance VPS with dedicated resources",
    },
    {
      icon: Layers,
      title: "Snapshots",
      description: "Create instant snapshots for backup and cloning",
    },
    {
      icon: CloudIcon,
      title: "Global Regions",
      description: "Deploy in multiple regions worldwide",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Navigation />

      <div className="pt-32 pb-20 px-4">
        <div className="container mx-auto space-y-16">
          <div className="text-center space-y-6 max-w-3xl mx-auto animate-fade-in-up">
            <h1 className="text-5xl lg:text-6xl font-bold">
              <span className="text-accent">Cloud</span> VPS
            </h1>
            <p className="text-xl text-muted-foreground">
              Scalable cloud infrastructure for your most demanding applications
            </p>
            <Link to="/pricing">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                View Plans
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-card/50 backdrop-blur hover:shadow-elegant transition-all">
                <CardContent className="p-6 space-y-4 text-center">
                  <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mx-auto">
                    <feature.icon className="h-6 w-6 text-accent" />
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

export default Cloud;
