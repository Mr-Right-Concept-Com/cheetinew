import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Server,
  Cloud,
  Globe,
  Activity,
  TrendingUp,
  Database,
  Zap,
  ChevronRight,
  Plus,
  Settings,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useHostingAccounts, useHostingStats } from "@/hooks/useHosting";
import { useCloudInstances } from "@/hooks/useCloudInstances";

const Dashboard = () => {
  const { profile } = useAuth();
  const { data: hostingAccounts, isLoading: hostingLoading } = useHostingAccounts();
  const { data: hostingStats } = useHostingStats();
  const { data: cloudInstances, isLoading: cloudLoading } = useCloudInstances();

  const activeHosting = hostingStats?.active ?? 0;
  const runningCloud = cloudInstances?.filter(i => i.status === "running").length ?? 0;
  const totalBandwidth = hostingStats?.usedBandwidthGB ?? 0;
  const bandwidthLimit = hostingStats?.totalBandwidthGB ?? 1;
  const bandwidthPercent = bandwidthLimit > 0 ? Math.round((totalBandwidth / bandwidthLimit) * 100) : 0;

  const stats = [
    {
      title: "Active Websites",
      value: activeHosting.toString(),
      change: `${hostingStats?.total ?? 0} total`,
      icon: Server,
      color: "text-primary",
      loading: hostingLoading,
    },
    {
      title: "Cloud Instances",
      value: runningCloud.toString(),
      change: `${cloudInstances?.length ?? 0} total`,
      icon: Cloud,
      color: "text-accent",
      loading: cloudLoading,
    },
    {
      title: "Total Bandwidth",
      value: `${totalBandwidth} GB`,
      change: `${bandwidthPercent}% of limit`,
      icon: TrendingUp,
      color: "text-primary",
      loading: hostingLoading,
    },
    {
      title: "Uptime",
      value: "99.98%",
      change: "Last 30 days",
      icon: Activity,
      color: "text-primary",
      loading: false,
    },
  ];

  const displayName = profile?.full_name || "User";

  return (
    <div className="min-h-screen bg-background">
      <div className="px-4 py-8">
        <div className="container mx-auto space-y-8">
          {/* Welcome Banner */}
          <Card className="bg-gradient-speed border-none shadow-glow mt-8">
            <CardContent className="p-4 md:p-6 lg:p-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6">
                <div className="flex items-center gap-3 md:gap-6 w-full md:w-auto">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-primary-foreground/20 flex items-center justify-center flex-shrink-0">
                    <Zap className="w-8 h-8 md:w-10 md:h-10 text-primary-foreground" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-primary-foreground mb-1 md:mb-2 break-words">
                      Welcome back, {displayName}! 🚀
                    </h2>
                    <p className="text-sm md:text-base lg:text-lg text-primary-foreground/90 break-words">
                      Your hosting is running smoothly. Ready to launch something new?
                    </p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 md:gap-3 w-full md:w-auto">
                  <Link to="/dashboard/hosting" className="w-full sm:w-auto">
                    <Button size="lg" variant="secondary" className="gap-2 w-full">
                      <Plus className="h-4 w-4 md:h-5 md:w-5 flex-shrink-0" />
                      <span className="truncate">New Website</span>
                    </Button>
                  </Link>
                  <Link to="/dashboard/cloud" className="w-full sm:w-auto">
                    <Button size="lg" variant="secondary" className="gap-2 w-full">
                      <Cloud className="h-4 w-4 md:h-5 md:w-5 flex-shrink-0" />
                      <span className="truncate">Deploy Cloud</span>
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {stats.map((stat, index) => (
              <Card key={index} className="hover:shadow-elegant transition-all bg-card/50 backdrop-blur">
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 min-w-0 flex-1">
                      <p className="text-xs md:text-sm text-muted-foreground truncate">{stat.title}</p>
                      {stat.loading ? (
                        <Skeleton className="h-9 w-16" />
                      ) : (
                        <p className="text-2xl md:text-3xl font-bold truncate">{stat.value}</p>
                      )}
                      <p className="text-xs text-muted-foreground truncate">{stat.change}</p>
                    </div>
                    <div className={`p-2 md:p-3 rounded-lg bg-primary/10 ${stat.color} flex-shrink-0`}>
                      <stat.icon className="h-5 w-5 md:h-6 md:w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Websites Section */}
          <Card className="bg-card/50 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="min-w-0 flex-1">
                <CardTitle className="text-xl md:text-2xl truncate">Your Websites</CardTitle>
                <CardDescription className="truncate">Manage all your hosted websites</CardDescription>
              </div>
              <Link to="/dashboard/hosting" className="flex-shrink-0">
                <Button variant="outline" size="sm" className="whitespace-nowrap">
                  <span className="hidden sm:inline">View All</span>
                  <ChevronRight className="h-4 w-4 sm:ml-2" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {hostingLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="p-4 rounded-lg border border-border">
                      <Skeleton className="h-12 w-full" />
                    </div>
                  ))}
                </div>
              ) : hostingAccounts && hostingAccounts.length > 0 ? (
                <div className="space-y-4">
                  {hostingAccounts.slice(0, 3).map((site) => (
                    <div
                      key={site.id}
                      className="flex flex-col md:flex-row md:items-center justify-between p-3 md:p-4 rounded-lg border border-border hover:border-primary/50 transition-all bg-background/50 gap-4"
                    >
                      <div className="flex items-center space-x-3 md:space-x-4 min-w-0 flex-1">
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Server className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="font-semibold text-base md:text-lg truncate">{site.name}</h4>
                          <div className="flex items-center space-x-2 text-xs md:text-sm text-muted-foreground">
                            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${site.status === 'active' ? 'bg-primary animate-pulse' : 'bg-muted-foreground'}`} />
                            <span className="truncate capitalize">{site.status}</span>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 md:gap-6">
                        <div>
                          <p className="text-xs md:text-sm text-muted-foreground truncate">Plan</p>
                          <p className="font-semibold text-sm md:text-base truncate capitalize">{site.plan}</p>
                        </div>
                        <div>
                          <p className="text-xs md:text-sm text-muted-foreground truncate">Region</p>
                          <p className="font-semibold text-sm md:text-base truncate">{site.region}</p>
                        </div>
                        <div>
                          <p className="text-xs md:text-sm text-muted-foreground truncate">Storage</p>
                          <p className="font-semibold text-sm md:text-base truncate">{site.storage_used_gb} GB</p>
                        </div>
                      </div>
                      <Link to="/dashboard/hosting">
                        <Button variant="ghost" size="sm" className="flex-shrink-0 self-end md:self-center">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Server className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                  <p className="text-muted-foreground">No websites yet. Add your first one!</p>
                  <Link to="/dashboard/hosting">
                    <Button size="sm" className="mt-3 gap-2"><Plus className="h-4 w-4" />Add Website</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Cloud Instances Section */}
          <Card className="bg-card/50 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="min-w-0 flex-1">
                <CardTitle className="text-xl md:text-2xl truncate">Cloud Instances</CardTitle>
                <CardDescription className="truncate">Your VPS and cloud servers</CardDescription>
              </div>
              <Link to="/dashboard/cloud" className="flex-shrink-0">
                <Button variant="outline" size="sm" className="whitespace-nowrap">
                  <span className="hidden sm:inline">View All</span>
                  <ChevronRight className="h-4 w-4 sm:ml-2" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {cloudLoading ? (
                <div className="space-y-4">
                  {[1, 2].map(i => (
                    <div key={i} className="p-4 rounded-lg border border-border">
                      <Skeleton className="h-12 w-full" />
                    </div>
                  ))}
                </div>
              ) : cloudInstances && cloudInstances.length > 0 ? (
                <div className="space-y-4">
                  {cloudInstances.slice(0, 3).map((instance) => (
                    <div
                      key={instance.id}
                      className="flex flex-col md:flex-row md:items-center justify-between p-3 md:p-4 rounded-lg border border-border hover:border-accent/50 transition-all bg-background/50 gap-4"
                    >
                      <div className="flex items-center space-x-3 md:space-x-4 min-w-0 flex-1">
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                          <Cloud className="h-5 w-5 md:h-6 md:w-6 text-accent" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="font-semibold text-base md:text-lg truncate">{instance.name}</h4>
                          <div className="flex items-center space-x-2 text-xs md:text-sm text-muted-foreground flex-wrap">
                            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${instance.status === 'running' ? 'bg-primary animate-pulse' : 'bg-muted-foreground'}`} />
                            <span className="truncate capitalize">{instance.status}</span>
                            <span className="flex-shrink-0">•</span>
                            <span className="truncate">{instance.region}</span>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 md:gap-6">
                        <div>
                          <p className="text-xs md:text-sm text-muted-foreground truncate">Type</p>
                          <p className="font-semibold text-sm md:text-base truncate">{instance.type}</p>
                        </div>
                        <div>
                          <p className="text-xs md:text-sm text-muted-foreground truncate">CPU</p>
                          <p className="font-semibold text-sm md:text-base truncate">{instance.vcpu} vCPU</p>
                        </div>
                        <div>
                          <p className="text-xs md:text-sm text-muted-foreground truncate">RAM</p>
                          <p className="font-semibold text-sm md:text-base truncate">{instance.ram_gb} GB</p>
                        </div>
                      </div>
                      <Link to="/dashboard/cloud">
                        <Button variant="ghost" size="sm" className="flex-shrink-0 self-end md:self-center">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Cloud className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                  <p className="text-muted-foreground">No cloud instances yet.</p>
                  <Link to="/dashboard/cloud">
                    <Button size="sm" className="mt-3 gap-2"><Plus className="h-4 w-4" />Deploy Instance</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <Card className="bg-gradient-speed border-none shadow-glow hover:shadow-elegant transition-all cursor-pointer">
              <CardContent className="p-4 md:p-6 text-center space-y-3 md:space-y-4">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-primary-foreground/20 flex items-center justify-center mx-auto">
                  <Globe className="h-5 w-5 md:h-6 md:w-6 text-primary-foreground" />
                </div>
                <h3 className="font-semibold text-base md:text-lg text-primary-foreground truncate">Register Domain</h3>
                <p className="text-xs md:text-sm text-primary-foreground/80 break-words">Search and register your perfect domain</p>
                <Link to="/dashboard/domains">
                  <Button variant="secondary" size="sm" className="w-full sm:w-auto">
                    Get Started
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur hover:shadow-elegant transition-all cursor-pointer border-accent/20">
              <CardContent className="p-4 md:p-6 text-center space-y-3 md:space-y-4">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-accent/10 flex items-center justify-center mx-auto">
                  <Zap className="h-5 w-5 md:h-6 md:w-6 text-accent" />
                </div>
                <h3 className="font-semibold text-base md:text-lg truncate">Deploy Cloud Instance</h3>
                <p className="text-xs md:text-sm text-muted-foreground break-words">Launch a new VPS in under 60 seconds</p>
                <Link to="/dashboard/cloud">
                  <Button variant="outline" size="sm" className="w-full sm:w-auto">
                    Deploy Now
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur hover:shadow-elegant transition-all cursor-pointer border-primary/20">
              <CardContent className="p-4 md:p-6 text-center space-y-3 md:space-y-4">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto">
                  <Database className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-base md:text-lg truncate">Backups & Snapshots</h3>
                <p className="text-xs md:text-sm text-muted-foreground break-words">Secure your data with automated backups</p>
                <Link to="/dashboard/backups">
                  <Button variant="outline" size="sm" className="w-full sm:w-auto">
                    Manage Backups
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
