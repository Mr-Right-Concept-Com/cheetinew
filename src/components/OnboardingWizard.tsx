import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Globe, Server, Mail, GitBranch, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface OnboardingWizardProps {
  onDismiss: () => void;
}

const options = [
  { icon: Server, title: "Build a Website", description: "Set up hosting and deploy your site", route: "/dashboard/hosting", color: "bg-primary/10 text-primary" },
  { icon: Globe, title: "Register a Domain", description: "Find and register your perfect domain", route: "/dashboard/domains", color: "bg-accent/10 text-accent" },
  { icon: Mail, title: "Set Up Email", description: "Create professional email accounts", route: "/dashboard/email", color: "bg-green-500/10 text-green-500" },
  { icon: GitBranch, title: "Deploy from GitHub", description: "Connect your repo and deploy instantly", route: "/dashboard/deploy", color: "bg-primary/10 text-primary" },
];

export function OnboardingWizard({ onDismiss }: OnboardingWizardProps) {
  const navigate = useNavigate();

  const handleSelect = (route: string) => {
    navigate(route);
  };

  const handleSkip = () => {
    localStorage.setItem("cheetihost_onboarding_dismissed", "true");
    onDismiss();
  };

  return (
    <Card className="bg-card/50 backdrop-blur border-primary/20">
      <CardContent className="p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl md:text-2xl font-bold">Welcome to CheetiHost! 🎉</h2>
            <p className="text-sm text-muted-foreground mt-1">What would you like to do first?</p>
          </div>
          <Button variant="ghost" size="sm" onClick={handleSkip} className="text-muted-foreground">
            <X className="h-4 w-4 mr-1" />Skip
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {options.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleSelect(opt.route)}
              className="flex items-start gap-4 p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-muted/30 transition-all text-left group"
            >
              <div className={`p-3 rounded-lg ${opt.color.split(" ")[0]} flex-shrink-0`}>
                <opt.icon className={`h-6 w-6 ${opt.color.split(" ")[1]}`} />
              </div>
              <div>
                <h3 className="font-semibold group-hover:text-primary transition-colors">{opt.title}</h3>
                <p className="text-sm text-muted-foreground">{opt.description}</p>
              </div>
            </button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-4 text-center">
          You can always find these options in the sidebar. <button onClick={handleSkip} className="underline">Don't show again</button>
        </p>
      </CardContent>
    </Card>
  );
}
