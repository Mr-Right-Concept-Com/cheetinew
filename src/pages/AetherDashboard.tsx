import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Activity, 
  Globe, 
  Server, 
  Cloud, 
  Database, 
  Shield, 
  Zap, 
  Plus,
  Settings,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Layers,
  Command,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { InfrastructureMap } from "@/components/dashboard/InfrastructureMap";
import { 
  DraggableWidget, 
  Widget, 
  getWidgetContent, 
  AVAILABLE_WIDGETS,
  WidgetSize
} from "@/components/dashboard/DraggableWidgets";
import { BulkMigrationWizard } from "@/components/dashboard/BulkMigrationWizard";
import { AIDevOpsAgent } from "@/components/dashboard/AIDevOpsAgent";
import { BladePanel } from "@/components/ui/blade-panel";

const AetherDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [showMigrationWizard, setShowMigrationWizard] = useState(false);
  const [showAIAgent, setShowAIAgent] = useState(false);
  const [widgets, setWidgets] = useState<Widget[]>([
    { id: 'stats', type: 'stats', title: 'Quick Stats', size: 'medium', position: 0, enabled: true },
    { id: 'traffic', type: 'traffic', title: 'Traffic', size: 'small', position: 1, enabled: true },
    { id: 'storage', type: 'storage', title: 'Storage', size: 'small', position: 2, enabled: true },
    { id: 'security', type: 'security', title: 'Security', size: 'small', position: 3, enabled: true },
    { id: 'performance', type: 'performance', title: 'Performance', size: 'medium', position: 4, enabled: true },
  ]);

  // Use real panel connections data
  const panelQuery = useQuery({
    queryKey: ["panel-connections"],
    queryFn: async () => {
      const { data, error } = await supabase.from("panel_connections").select("*").eq("is_active", true);
      if (error) throw error;
      return data;
    },
  });

  const connectedPanels = panelQuery.data?.map(p => ({
    name: p.name,
    type: p.panel_type,
    sites: 0,
    status: p.sync_status === "synced" ? "healthy" : "warning",
    region: (p.metadata as any)?.region || "Global",
  })) || [];

  // Use real data for stats
  const hostingQuery = useQuery({
    queryKey: ["aether-hosting-count"],
    queryFn: async () => {
      const { count } = await supabase.from("hosting_accounts").select("*", { count: "exact", head: true });
      return count || 0;
    },
  });
  const cloudQuery = useQuery({
    queryKey: ["aether-cloud-count"],
    queryFn: async () => {
      const { count } = await supabase.from("cloud_instances").select("*", { count: "exact", head: true });
      return count || 0;
    },
  });
  const domainQuery = useQuery({
    queryKey: ["aether-domain-count"],
    queryFn: async () => {
      const { count } = await supabase.from("domains").select("*", { count: "exact", head: true });
      return count || 0;
    },
  });

  const globalStats = [
    { label: "Total Sites", value: (hostingQuery.data ?? 0).toString(), icon: Globe, trend: "hosting accounts" },
    { label: "Cloud Instances", value: (cloudQuery.data ?? 0).toString(), icon: Cloud, trend: "all regions" },
    { label: "Active Domains", value: (domainQuery.data ?? 0).toString(), icon: Layers, trend: "registered" },
    { label: "Global Uptime", value: "99.97%", icon: Activity, trend: "last 30 days" },
  ];

  const handleRemoveWidget = (id: string) => {
    setWidgets(prev => prev.filter(w => w.id !== id));
  };

  const handleResizeWidget = (id: string, size: WidgetSize) => {
    setWidgets(prev => prev.map(w => w.id === id ? { ...w, size } : w));
  };

  const handleAddWidget = (widgetConfig: typeof AVAILABLE_WIDGETS[0]) => {
    const newWidget: Widget = {
      ...widgetConfig,
      position: widgets.length,
      enabled: true,
    };
    setWidgets(prev => [...prev, newWidget]);
  };

  return (
    <div className="space-y-6 md:space-y-8 p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            Aether Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Unified control center for all your panels, sites, and infrastructure
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Command className="h-4 w-4" />
            <span className="hidden sm:inline">CMD+K</span>
          </Button>
          <Button variant="outline" size="sm" onClick={() => setShowAIAgent(true)}>
            <Zap className="mr-2 h-4 w-4" />
            AI DevOps
          </Button>
          <Button variant="outline" size="sm" onClick={() => setShowMigrationWizard(true)}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Bulk Migration
          </Button>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Plus className="mr-2 h-4 w-4" />
            Add Panel
          </Button>
        </div>
      </div>

      {/* Global Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {globalStats.map((stat, idx) => (
          <Card key={idx} className="bg-card/50 backdrop-blur border-border/50 hover:shadow-elegant transition-all">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <stat.icon className="h-5 w-5 text-primary" />
                </div>
                <Badge variant="outline" className="text-xs bg-primary/5 text-primary border-primary/20">
                  {stat.trend}
                </Badge>
              </div>
              <p className="text-2xl md:text-3xl font-bold">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Connected Panels Overview */}
      <Card className="bg-card/50 backdrop-blur border-border/50">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Server className="h-5 w-5 text-primary" />
            Connected Panels
          </CardTitle>
          <Button variant="ghost" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Manage
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {connectedPanels.map((panel, idx) => (
              <Card key={idx} className="border-2 hover:border-primary/50 transition-colors cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {panel.status === 'healthy' ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-yellow-500" />
                      )}
                      <Badge variant="outline" className="text-xs">
                        {panel.region}
                      </Badge>
                    </div>
                  </div>
                  <h4 className="font-semibold text-sm truncate">{panel.name}</h4>
                  <p className="text-2xl font-bold mt-1">{panel.sites}</p>
                  <p className="text-xs text-muted-foreground">Active Sites</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Dashboard Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-muted/50 p-1">
          <TabsTrigger value="overview" className="data-[state=active]:bg-background">
            Overview
          </TabsTrigger>
          <TabsTrigger value="infrastructure" className="data-[state=active]:bg-background">
            Infrastructure
          </TabsTrigger>
          <TabsTrigger value="widgets" className="data-[state=active]:bg-background">
            Widgets
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Infrastructure Map */}
          <InfrastructureMap showCarbonFootprint />
          
          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 hover:shadow-elegant transition-all cursor-pointer group">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 rounded-lg bg-primary/20 group-hover:bg-primary/30 transition-colors">
                  <Globe className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold">Deploy Site</h4>
                  <p className="text-sm text-muted-foreground">Launch a new website instantly</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20 hover:shadow-elegant transition-all cursor-pointer group">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 rounded-lg bg-accent/20 group-hover:bg-accent/30 transition-colors">
                  <Cloud className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h4 className="font-semibold">Spin Up Cloud</h4>
                  <p className="text-sm text-muted-foreground">Create cloud instance</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20 hover:shadow-elegant transition-all cursor-pointer group">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 rounded-lg bg-green-500/20 group-hover:bg-green-500/30 transition-colors">
                  <Shield className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <h4 className="font-semibold">Security Scan</h4>
                  <p className="text-sm text-muted-foreground">Run cross-panel audit</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="infrastructure" className="space-y-6">
          <InfrastructureMap showCarbonFootprint />
          
          {/* Detailed Infrastructure Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Database className="h-4 w-4 text-primary" />
                  Database Clusters
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: "Primary (PostgreSQL)", region: "US-East", status: "healthy", connections: 45 },
                    { name: "Replica (PostgreSQL)", region: "EU-West", status: "healthy", connections: 23 },
                    { name: "Redis Cache", region: "Global", status: "healthy", connections: 128 },
                  ].map((db, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <div>
                          <p className="text-sm font-medium">{db.name}</p>
                          <p className="text-xs text-muted-foreground">{db.region}</p>
                        </div>
                      </div>
                      <Badge variant="outline">{db.connections} conn</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Zap className="h-4 w-4 text-primary" />
                  Edge Nodes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: "CDN Edge - Americas", requests: "2.4M/day", latency: "12ms" },
                    { name: "CDN Edge - Europe", requests: "1.8M/day", latency: "18ms" },
                    { name: "CDN Edge - Asia Pacific", requests: "1.2M/day", latency: "25ms" },
                  ].map((edge, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div>
                        <p className="text-sm font-medium">{edge.name}</p>
                        <p className="text-xs text-muted-foreground">{edge.requests}</p>
                      </div>
                      <Badge className="bg-primary/10 text-primary">{edge.latency}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="widgets" className="space-y-6">
          {/* Add Widget Button */}
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Customize Your Dashboard</h3>
            <div className="flex gap-2">
              {AVAILABLE_WIDGETS.filter(w => !widgets.find(widget => widget.id === w.id)).map((widget) => (
                <Button
                  key={widget.id}
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddWidget(widget)}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  {widget.title}
                </Button>
              ))}
            </div>
          </div>

          {/* Draggable Widgets Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {widgets.map((widget) => (
              <DraggableWidget
                key={widget.id}
                widget={widget}
                onRemove={handleRemoveWidget}
                onResize={handleResizeWidget}
              >
                {getWidgetContent(widget.type)}
              </DraggableWidget>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Bulk Migration Wizard Blade Panel */}
      <BladePanel
        isOpen={showMigrationWizard}
        onClose={() => setShowMigrationWizard(false)}
        title="Bulk Migration Wizard"
        size="lg"
      >
        <BulkMigrationWizard />
      </BladePanel>

      {/* AI DevOps Agent Blade Panel */}
      <BladePanel
        isOpen={showAIAgent}
        onClose={() => setShowAIAgent(false)}
        title="AI DevOps Agent"
        size="lg"
      >
        <AIDevOpsAgent />
      </BladePanel>
    </div>
  );
};

export default AetherDashboard;
