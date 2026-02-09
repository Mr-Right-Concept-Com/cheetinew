import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Package, Plus, Search, Settings, ExternalLink, CheckCircle, Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const Unbox = () => {
  const { user } = useAuth();

  // Fetch real hosting/domain/email counts to show connected services
  const { data: serviceCounts, isLoading } = useQuery({
    queryKey: ["unbox-services", user?.id],
    queryFn: async () => {
      const [hosting, domains, email, cloud] = await Promise.all([
        supabase.from("hosting_accounts").select("*", { count: "exact", head: true }),
        supabase.from("domains").select("*", { count: "exact", head: true }),
        supabase.from("email_accounts").select("*", { count: "exact", head: true }),
        supabase.from("cloud_instances").select("*", { count: "exact", head: true }),
      ]);
      return {
        hosting: hosting.count || 0,
        domains: domains.count || 0,
        email: email.count || 0,
        cloud: cloud.count || 0,
        total: (hosting.count || 0) + (domains.count || 0) + (email.count || 0) + (cloud.count || 0),
      };
    },
    enabled: !!user,
  });

  const connectedServices = [
    { name: "Web Hosting", category: "Hosting", status: "connected", icon: "🌐", count: serviceCounts?.hosting || 0 },
    { name: "Domain Names", category: "Domains", status: "connected", icon: "🔗", count: serviceCounts?.domains || 0 },
    { name: "Email Accounts", category: "Email", status: "connected", icon: "📧", count: serviceCounts?.email || 0 },
    { name: "Cloud Instances", category: "Cloud", status: "connected", icon: "☁️", count: serviceCounts?.cloud || 0 },
  ];

  const availableTools = [
    { name: "Google Analytics", category: "Analytics", icon: "📊" },
    { name: "Cloudflare CDN", category: "CDN & Security", icon: "🛡️" },
    { name: "Stripe Payments", category: "Payments", icon: "💳" },
    { name: "Slack Notifications", category: "Communication", icon: "💼" },
    { name: "Zapier Automation", category: "Automation", icon: "⚡" },
    { name: "HubSpot CRM", category: "CRM", icon: "🎯" },
  ];

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2 break-words">Unbox</h1>
          <p className="text-sm md:text-base text-muted-foreground break-words">
            Configure and connect all your web tools in one place
          </p>
        </div>
        <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
          <Plus className="mr-2 h-4 w-4 flex-shrink-0" />
          <span className="truncate">Connect New Tool</span>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between mb-2">
              <Package className="h-5 w-5 text-primary flex-shrink-0" />
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-xs">Active</Badge>
            </div>
            {isLoading ? <Skeleton className="h-8 w-12" /> : <p className="text-xl md:text-2xl font-bold truncate">{serviceCounts?.total || 0}</p>}
            <p className="text-xs md:text-sm text-muted-foreground truncate">Total Services</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
              <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20 text-xs">Synced</Badge>
            </div>
            <p className="text-xl md:text-2xl font-bold truncate">100%</p>
            <p className="text-xs md:text-sm text-muted-foreground truncate">Sync Status</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between mb-2">
              <Clock className="h-5 w-5 text-accent flex-shrink-0" />
              <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20 text-xs">Real-time</Badge>
            </div>
            <p className="text-xl md:text-2xl font-bold truncate">Live</p>
            <p className="text-xs md:text-sm text-muted-foreground truncate">Data Sync</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between mb-2">
              <Settings className="h-5 w-5 text-muted-foreground flex-shrink-0" />
              <Badge variant="outline" className="text-xs">Available</Badge>
            </div>
            <p className="text-xl md:text-2xl font-bold truncate">6</p>
            <p className="text-xs md:text-sm text-muted-foreground truncate">Integrations</p>
          </CardContent>
        </Card>
      </div>

      {/* Connected Services */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg md:text-xl truncate">Your Services</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {connectedServices.map((service, i) => (
              <Card key={i} className="border-2">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="text-2xl flex-shrink-0">{service.icon}</div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm md:text-base truncate">{service.name}</h4>
                        <p className="text-xs text-muted-foreground truncate">{service.count} {service.category.toLowerCase()}</p>
                      </div>
                    </div>
                    <Badge className={`text-xs whitespace-nowrap ${
                      service.count > 0 
                        ? "bg-green-500/10 text-green-500 border-green-500/20" 
                        : "bg-muted text-muted-foreground"
                    }`}>
                      {service.count > 0 ? (
                        <><CheckCircle className="mr-1 h-3 w-3" />Active</>
                      ) : "Empty"}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1 text-xs">
                      <Settings className="mr-1 h-3 w-3" />
                      Configure
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1 text-xs">
                      <ExternalLink className="mr-1 h-3 w-3" />
                      Open
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Available Integrations */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle className="text-lg md:text-xl truncate">Available Integrations</CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground flex-shrink-0" />
              <Input placeholder="Search tools..." className="pl-10 w-full" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableTools.map((tool, i) => (
              <Card key={i} className="border hover:border-primary/50 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="text-2xl flex-shrink-0">{tool.icon}</div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm md:text-base truncate">{tool.name}</h4>
                        <p className="text-xs text-muted-foreground truncate">{tool.category}</p>
                      </div>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="w-full text-xs">
                    <Plus className="mr-1 h-3 w-3" />
                    Connect
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Unbox;
