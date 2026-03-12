import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Package, Plus, Search, Settings, ExternalLink, CheckCircle, Clock, Loader2, ArrowRight, Zap, BarChart3 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { format } from "date-fns";

const serviceRoutes: Record<string, string> = {
  "Web Hosting": "/dashboard/hosting",
  "Domain Names": "/dashboard/domains",
  "Email Accounts": "/dashboard/email",
  "Cloud Instances": "/dashboard/cloud",
};

const Unbox = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [connectDialogOpen, setConnectDialogOpen] = useState(false);

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

  // Recent purchases from transactions
  const { data: recentPurchases = [] } = useQuery({
    queryKey: ["unbox-purchases", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .eq("status", "completed")
        .order("created_at", { ascending: false })
        .limit(5);
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  // Real-time subscription status
  const { data: subscriptions = [] } = useQuery({
    queryKey: ["unbox-subscriptions", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("subscriptions")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10);
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  const connectedServices = [
    { name: "Web Hosting", category: "Hosting", icon: "🌐", count: serviceCounts?.hosting || 0 },
    { name: "Domain Names", category: "Domains", icon: "🔗", count: serviceCounts?.domains || 0 },
    { name: "Email Accounts", category: "Email", icon: "📧", count: serviceCounts?.email || 0 },
    { name: "Cloud Instances", category: "Cloud", icon: "☁️", count: serviceCounts?.cloud || 0 },
  ];

  const availableTools = [
    { name: "Google Analytics", category: "Analytics", icon: "📊", desc: "Track website traffic and user behavior" },
    { name: "Cloudflare CDN", category: "CDN & Security", icon: "🛡️", desc: "Speed up and protect your websites" },
    { name: "Stripe Payments", category: "Payments", icon: "💳", desc: "Accept online payments globally" },
    { name: "Slack Notifications", category: "Communication", icon: "💼", desc: "Get alerts in your Slack workspace" },
    { name: "Zapier Automation", category: "Automation", icon: "⚡", desc: "Automate workflows across apps" },
    { name: "HubSpot CRM", category: "CRM", icon: "🎯", desc: "Manage contacts and sales pipeline" },
  ];

  const filteredTools = availableTools.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleConnect = (toolName: string) => {
    toast.info(`${toolName} integration coming soon! We're working on connecting this service.`);
  };

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2 break-words">Unbox</h1>
          <p className="text-sm md:text-base text-muted-foreground break-words">
            Auto-activate and manage all your services in one place
          </p>
        </div>
        <Button onClick={() => setConnectDialogOpen(true)} className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
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
            <p className="text-xl md:text-2xl font-bold truncate">{subscriptions.filter(s => s.status === "active").length}</p>
            <p className="text-xs md:text-sm text-muted-foreground truncate">Active Subscriptions</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between mb-2">
              <Zap className="h-5 w-5 text-accent flex-shrink-0" />
              <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20 text-xs">Real-time</Badge>
            </div>
            <p className="text-xl md:text-2xl font-bold truncate">Live</p>
            <p className="text-xs md:text-sm text-muted-foreground truncate">Data Sync</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between mb-2">
              <BarChart3 className="h-5 w-5 text-muted-foreground flex-shrink-0" />
              <Badge variant="outline" className="text-xs">Available</Badge>
            </div>
            <p className="text-xl md:text-2xl font-bold truncate">{availableTools.length}</p>
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
                    <Button size="sm" variant="outline" className="flex-1 text-xs" onClick={() => navigate(serviceRoutes[service.name])}>
                      <Settings className="mr-1 h-3 w-3" />
                      Configure
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1 text-xs" onClick={() => navigate(serviceRoutes[service.name])}>
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

      {/* Recent Purchases / Provisioning */}
      {recentPurchases.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl truncate">Recent Purchases</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentPurchases.map((purchase) => (
                <div key={purchase.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3 min-w-0">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="font-medium text-sm truncate">{purchase.description || "Service Purchase"}</p>
                      <p className="text-xs text-muted-foreground">{format(new Date(purchase.created_at!), "MMM d, yyyy")}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-500/10 text-green-500 border-green-500/20 text-xs">Provisioned</Badge>
                    <span className="font-semibold text-sm">${Number(purchase.amount).toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Active Subscriptions */}
      {subscriptions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl truncate">Active Subscriptions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {subscriptions.map((sub) => (
                <div key={sub.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate">{sub.plan_name}</p>
                    <p className="text-xs text-muted-foreground">{sub.plan_type} · {sub.interval}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={`text-xs ${sub.status === "active" ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-muted text-muted-foreground"}`}>
                      {sub.status}
                    </Badge>
                    <span className="font-semibold text-sm">${Number(sub.amount).toFixed(2)}/{sub.interval === "monthly" ? "mo" : "yr"}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Available Integrations */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle className="text-lg md:text-xl truncate">Available Integrations</CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground flex-shrink-0" />
              <Input
                placeholder="Search tools..."
                className="pl-10 w-full"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTools.map((tool, i) => (
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
                  <p className="text-xs text-muted-foreground mb-3">{tool.desc}</p>
                  <Button size="sm" variant="outline" className="w-full text-xs" onClick={() => handleConnect(tool.name)}>
                    <Plus className="mr-1 h-3 w-3" />
                    Connect
                  </Button>
                </CardContent>
              </Card>
            ))}
            {filteredTools.length === 0 && (
              <div className="col-span-full text-center py-8 text-muted-foreground">
                <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No integrations match "{search}"</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Connect New Tool Dialog */}
      <Dialog open={connectDialogOpen} onOpenChange={setConnectDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Connect a New Tool</DialogTitle>
            <DialogDescription>Browse and connect third-party integrations to your CheetiHost account.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {availableTools.map((tool, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg border hover:border-primary/50 transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="text-xl">{tool.icon}</div>
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate">{tool.name}</p>
                    <p className="text-xs text-muted-foreground">{tool.desc}</p>
                  </div>
                </div>
                <Button size="sm" variant="outline" onClick={() => { handleConnect(tool.name); setConnectDialogOpen(false); }}>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Unbox;
