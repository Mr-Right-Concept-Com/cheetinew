import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Server,
  Globe,
  Plus,
  MoreVertical,
  Activity,
  HardDrive,
  Users,
  TrendingUp,
  Power,
  Settings,
  RotateCcw,
  Database,
  Shield,
  FileText,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useHostingAccounts, useCreateHostingAccount, useHostingStats, HostingAccount } from "@/hooks/useHosting";

const Hosting = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newSite, setNewSite] = useState({ name: "", plan: "", region: "" });
  
  const { data: hostingAccounts, isLoading } = useHostingAccounts();
  const { data: stats } = useHostingStats();
  const createHosting = useCreateHostingAccount();

  const handleCreateSite = async () => {
    if (!newSite.name || !newSite.plan) return;
    
    await createHosting.mutateAsync({
      name: newSite.name,
      plan: newSite.plan,
      region: newSite.region || "us-east-1",
    });
    
    setNewSite({ name: "", plan: "", region: "" });
    setIsDialogOpen(false);
  };

  const getStatusBadge = (status: HostingAccount["status"]) => {
    const statusConfig = {
      active: { className: "bg-green-500/10 text-green-500 border-none", label: "Active" },
      pending: { className: "bg-yellow-500/10 text-yellow-500 border-none", label: "Pending" },
      suspended: { className: "bg-red-500/10 text-red-500 border-none", label: "Suspended" },
      terminated: { className: "bg-muted text-muted-foreground border-none", label: "Terminated" },
    };
    return statusConfig[status] || statusConfig.pending;
  };

  const statsData = [
    { label: "Active Sites", value: stats?.active.toString() || "0", icon: Globe, bgColor: "bg-primary/10", iconColor: "text-primary" },
    { label: "Total Sites", value: stats?.total.toString() || "0", icon: Users, bgColor: "bg-accent/10", iconColor: "text-accent" },
    { label: "Storage Used", value: `${stats?.storagePercentage || 0}%`, icon: Activity, bgColor: "bg-green-500/10", iconColor: "text-green-500" },
    { label: "Total Storage", value: `${stats?.usedStorageGB || 0} GB`, icon: HardDrive, bgColor: "bg-primary/10", iconColor: "text-primary" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 md:py-8 space-y-6 md:space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2 truncate">Web Hosting</h1>
            <p className="text-sm md:text-base text-muted-foreground">
              Manage your websites and hosting services
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 w-full sm:w-auto">
                <Plus className="h-4 w-4" />
                Add New Site
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Website</DialogTitle>
                <DialogDescription>
                  Deploy a new website to CheetiHost in minutes
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="domain">Domain Name</Label>
                  <Input 
                    id="domain" 
                    placeholder="example.com" 
                    value={newSite.name}
                    onChange={(e) => setNewSite(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="plan">Select Plan</Label>
                  <Select 
                    value={newSite.plan}
                    onValueChange={(value) => setNewSite(prev => ({ ...prev, plan: value }))}
                  >
                    <SelectTrigger id="plan">
                      <SelectValue placeholder="Choose a plan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="starter">Starter - $9.99/mo</SelectItem>
                      <SelectItem value="pro">Pro - $29.99/mo</SelectItem>
                      <SelectItem value="business">Business - $49.99/mo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="region">Server Region</Label>
                  <Select 
                    value={newSite.region}
                    onValueChange={(value) => setNewSite(prev => ({ ...prev, region: value }))}
                  >
                    <SelectTrigger id="region">
                      <SelectValue placeholder="Select region" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="us-east-1">US East (New York)</SelectItem>
                      <SelectItem value="us-west-1">US West (San Francisco)</SelectItem>
                      <SelectItem value="eu-west-1">Europe (London)</SelectItem>
                      <SelectItem value="asia-southeast-1">Asia (Singapore)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button 
                  className="w-full" 
                  onClick={handleCreateSite}
                  disabled={createHosting.isPending || !newSite.name || !newSite.plan}
                >
                  {createHosting.isPending ? "Deploying..." : "Deploy Website"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statsData.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="bg-card/50 backdrop-blur">
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className={`p-2 md:p-3 rounded-lg ${stat.bgColor}`}>
                      <Icon className={`h-5 w-5 md:h-6 md:w-6 ${stat.iconColor}`} />
                    </div>
                    <div className="min-w-0 flex-1">
                      {isLoading ? (
                        <Skeleton className="h-8 w-16" />
                      ) : (
                        <p className="text-xl md:text-2xl font-bold truncate">{stat.value}</p>
                      )}
                      <p className="text-xs md:text-sm text-muted-foreground truncate">{stat.label}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Sites Management */}
        <Card className="bg-card/50 backdrop-blur">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl md:text-2xl">Your Websites</CardTitle>
            <CardDescription>Manage your hosted websites and applications</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-6 rounded-lg border border-border">
                    <Skeleton className="h-12 w-full" />
                  </div>
                ))}
              </div>
            ) : hostingAccounts && hostingAccounts.length > 0 ? (
              <div className="space-y-3 md:space-y-4">
                {hostingAccounts.map((site) => {
                  const statusBadge = getStatusBadge(site.status);
                  const storagePercent = site.storage_limit_gb > 0 
                    ? (site.storage_used_gb / site.storage_limit_gb) * 100 
                    : 0;
                  const bandwidthPercent = site.bandwidth_limit_gb > 0 
                    ? (site.bandwidth_used_gb / site.bandwidth_limit_gb) * 100 
                    : 0;

                  return (
                    <div
                      key={site.id}
                      className="p-4 md:p-6 rounded-lg border border-border bg-background/50 hover:border-primary/50 transition-all"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex items-start gap-3 md:gap-4 min-w-0 flex-1">
                          <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Globe className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <h3 className="font-semibold text-base md:text-lg truncate">{site.name}</h3>
                              <Badge
                                variant="default"
                                className={statusBadge.className}
                              >
                                {statusBadge.label}
                              </Badge>
                              <Badge variant="outline" className="flex-shrink-0">{site.plan}</Badge>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 md:gap-4 text-xs md:text-sm text-muted-foreground mt-2">
                              <div className="truncate">
                                <Server className="h-3 w-3 inline mr-1" />
                                {site.region}
                              </div>
                              <div className="truncate">
                                <Activity className="h-3 w-3 inline mr-1" />
                                {site.ssl_enabled ? "SSL ✓" : "No SSL"}
                              </div>
                              <div className="truncate">
                                <HardDrive className="h-3 w-3 inline mr-1" />
                                {Math.round(storagePercent)}%
                              </div>
                              <div className="truncate">
                                <TrendingUp className="h-3 w-3 inline mr-1" />
                                {site.bandwidth_used_gb} GB
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                          <Button variant="outline" size="sm" className="gap-2">
                            <Settings className="h-4 w-4" />
                            <span className="hidden sm:inline">Manage</span>
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="gap-2" onClick={() => toast.success(`Restarting server for ${site.name}...`)}>
                                <Power className="h-4 w-4" />
                                Restart Server
                              </DropdownMenuItem>
                              <DropdownMenuItem className="gap-2" onClick={() => toast.success(`Creating backup for ${site.name}...`)}>
                                <RotateCcw className="h-4 w-4" />
                                Create Backup
                              </DropdownMenuItem>
                              <DropdownMenuItem className="gap-2" onClick={() => toast.info("Database manager opening...")}>
                                <Database className="h-4 w-4" />
                                Database Access
                              </DropdownMenuItem>
                              <DropdownMenuItem className="gap-2" onClick={() => toast.success(`SSL certificate active for ${site.name}`)}>
                                <Shield className="h-4 w-4" />
                                SSL Certificate
                              </DropdownMenuItem>
                              <DropdownMenuItem className="gap-2" onClick={() => toast.info("Opening server logs...")}>
                                <FileText className="h-4 w-4" />
                                View Logs
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>

                      {/* Resource Usage Progress Bars */}
                      <div className="mt-4 space-y-3">
                        <div>
                          <div className="flex justify-between text-xs md:text-sm mb-1">
                            <span className="text-muted-foreground">Storage Used</span>
                            <span className="font-medium">{site.storage_used_gb} / {site.storage_limit_gb} GB</span>
                          </div>
                          <Progress value={storagePercent} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-xs md:text-sm mb-1">
                            <span className="text-muted-foreground">Bandwidth Used</span>
                            <span className="font-medium">{site.bandwidth_used_gb} / {site.bandwidth_limit_gb} GB</span>
                          </div>
                          <Progress value={bandwidthPercent} className="h-2" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <Globe className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No websites yet</h3>
                <p className="text-muted-foreground mb-4">Get started by adding your first website</p>
                <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add New Site
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="bg-card/50 backdrop-blur hover:shadow-elegant transition-all cursor-pointer">
            <CardContent className="p-4 md:p-6 text-center space-y-3 md:space-y-4">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto">
                <Server className="h-5 w-5 md:h-6 md:w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-base md:text-lg mb-1">One-Click Apps</h3>
                <p className="text-xs md:text-sm text-muted-foreground">
                  Install WordPress, Laravel, Node.js
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur hover:shadow-elegant transition-all cursor-pointer">
            <CardContent className="p-4 md:p-6 text-center space-y-3 md:space-y-4">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-accent/10 flex items-center justify-center mx-auto">
                <Shield className="h-5 w-5 md:h-6 md:w-6 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold text-base md:text-lg mb-1">SSL Manager</h3>
                <p className="text-xs md:text-sm text-muted-foreground">
                  Free SSL certificates & auto-renewal
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur hover:shadow-elegant transition-all cursor-pointer">
            <CardContent className="p-4 md:p-6 text-center space-y-3 md:space-y-4">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto">
                <Database className="h-5 w-5 md:h-6 md:w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-base md:text-lg mb-1">Database Manager</h3>
                <p className="text-xs md:text-sm text-muted-foreground">
                  MySQL, PostgreSQL & backups
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Hosting;
