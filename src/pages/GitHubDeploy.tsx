import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Github,
  Rocket,
  Globe,
  Server,
  Zap,
  Construction,
} from "lucide-react";

export function GitHubDeploy() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Deploy from GitHub</h1>
        <p className="text-muted-foreground">
          Connect your GitHub account to deploy projects instantly
        </p>
      </div>

      <Card className="max-w-3xl mx-auto">
        <CardContent className="p-8 md:p-12 text-center space-y-8">
          <div className="relative mx-auto w-fit">
            <div className="p-6 rounded-full bg-primary/10">
              <Github className="h-16 w-16 text-primary" />
            </div>
            <div className="absolute -top-2 -right-2">
              <Badge className="bg-accent text-accent-foreground gap-1">
                <Construction className="h-3 w-3" />
                Coming Soon
              </Badge>
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-3xl font-bold">GitHub Deploy is Coming Soon</h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              We're building a deployment experience that's 20x better than Vercel & Netlify.
              Push to deploy, instant previews, and global edge distribution — all from your GitHub repos.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-lg mx-auto">
            <div className="p-4 rounded-lg bg-muted/30 space-y-2">
              <Zap className="h-6 w-6 text-primary mx-auto" />
              <p className="text-sm font-medium">Instant Deploys</p>
              <p className="text-xs text-muted-foreground">Push to deploy</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/30 space-y-2">
              <Globe className="h-6 w-6 text-accent mx-auto" />
              <p className="text-sm font-medium">Edge Network</p>
              <p className="text-xs text-muted-foreground">Global CDN</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/30 space-y-2">
              <Server className="h-6 w-6 text-primary mx-auto" />
              <p className="text-sm font-medium">Auto SSL</p>
              <p className="text-xs text-muted-foreground">Free HTTPS</p>
            </div>
          </div>

          <div className="pt-4">
            <Button size="lg" disabled className="gap-2">
              <Rocket className="h-5 w-5" />
              Launching Q2 2026
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default GitHubDeploy;
