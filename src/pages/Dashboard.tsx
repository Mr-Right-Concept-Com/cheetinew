import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/Navigation";
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

const Dashboard = () => {
  const stats = [
    {
      title: "Active Websites",
      value: "3",
      change: "+1 this month",
      icon: Server,
      color: "text-primary",
    },
    {
      title: "Cloud Instances",
      value: "2",
      change: "All running",
      icon: Cloud,
      color: "text-accent",
    },
    {
      title: "Total Bandwidth",
      value: "248 GB",
      change: "62% of limit",
      icon: TrendingUp,
      color: "text-primary",
    },
    {
      title: "Uptime",
      value: "99.98%",
      change: "Last 30 days",
      icon: Activity,
      color: "text-green-500",
    },
  ];

  const websites = [
    {
      name: "myapp.com",
      status: "Active",
      visitors: "2.4K",
      uptime: "100%",
      storage: "4.2 GB",
    },
    {
      name: "portfolio.dev",
      status: "Active",
      visitors: "890",
      uptime: "99.9%",
      storage: "1.8 GB",
    },
    {
      name: "blog.io",
      status: "Active",
      visitors: "5.1K",
      uptime: "100%",
      storage: "3.5 GB",
    },
  ];

  const cloudInstances = [
    {
      name: "production-api",
      type: "VPS Pro",
      cpu: "4 vCPU",
      ram: "8 GB",
      status: "Running",
      region: "US-East",
    },
    {
      name: "staging-server",
      type: "VPS Basic",
      cpu: "2 vCPU",
      ram: "4 GB",
      status: "Running",
      region: "EU-West",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="pt-20 px-4 pb-12">
        <div className="container mx-auto space-y-8">
          {/* Welcome Banner */}
          <Card className="bg-gradient-speed border-none shadow-glow mt-8">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                    <Zap className="w-10 h-10 text-primary-foreground" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-primary-foreground mb-2">
                      Welcome back to CheetiHost! 🚀
                    </h2>
                    <p className="text-primary-foreground/90 text-lg">
                      Your hosting is running smoothly. Ready to launch something new?
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Link to="/dashboard/hosting">
                    <Button size="lg" variant="secondary" className="gap-2">
                      <Plus className="h-5 w-5" />
                      New Website
                    </Button>
                  </Link>
                  <Link to="/dashboard/cloud">
                    <Button size="lg" variant="secondary" className="gap-2">
                      <Cloud className="h-5 w-5" />
                      Deploy Cloud
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card key={index} className="hover:shadow-elegant transition-all bg-card/50 backdrop-blur">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">{stat.title}</p>
                      <p className="text-3xl font-bold">{stat.value}</p>
                      <p className="text-xs text-muted-foreground">{stat.change}</p>
                    </div>
                    <div className={`p-3 rounded-lg bg-primary/10 ${stat.color}`}>
                      <stat.icon className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Websites Section */}
          <Card className="bg-card/50 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-2xl">Your Websites</CardTitle>
                <CardDescription>Manage all your hosted websites</CardDescription>
              </div>
              <Link to="/dashboard/hosting">
                <Button variant="outline" size="sm">
                  View All
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {websites.map((site, index) => (
                  <div
                    key={index}
                    className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-lg border border-border hover:border-primary/50 transition-all bg-background/50"
                  >
                    <div className="flex items-center space-x-4 mb-4 md:mb-0">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Server className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg">{site.name}</h4>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <div className="w-2 h-2 rounded-full bg-green-500" />
                          <span>{site.status}</span>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-6">
                      <div>
                        <p className="text-sm text-muted-foreground">Visitors</p>
                        <p className="font-semibold">{site.visitors}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Uptime</p>
                        <p className="font-semibold">{site.uptime}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Storage</p>
                        <p className="font-semibold">{site.storage}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="mt-4 md:mt-0">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Cloud Instances Section */}
          <Card className="bg-card/50 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-2xl">Cloud Instances</CardTitle>
                <CardDescription>Your VPS and cloud servers</CardDescription>
              </div>
              <Link to="/dashboard/cloud">
                <Button variant="outline" size="sm">
                  View All
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cloudInstances.map((instance, index) => (
                  <div
                    key={index}
                    className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-lg border border-border hover:border-accent/50 transition-all bg-background/50"
                  >
                    <div className="flex items-center space-x-4 mb-4 md:mb-0">
                      <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                        <Cloud className="h-6 w-6 text-accent" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg">{instance.name}</h4>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                          <span>{instance.status}</span>
                          <span>•</span>
                          <span>{instance.region}</span>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-6">
                      <div>
                        <p className="text-sm text-muted-foreground">Type</p>
                        <p className="font-semibold">{instance.type}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">CPU</p>
                        <p className="font-semibold">{instance.cpu}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">RAM</p>
                        <p className="font-semibold">{instance.ram}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="mt-4 md:mt-0">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-gradient-speed border-none shadow-glow hover:shadow-elegant transition-all cursor-pointer">
              <CardContent className="p-6 text-center space-y-4">
                <div className="w-12 h-12 rounded-lg bg-primary-foreground/20 flex items-center justify-center mx-auto">
                  <Globe className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="font-semibold text-lg text-primary-foreground">Register Domain</h3>
                <p className="text-sm text-primary-foreground/80">Search and register your perfect domain</p>
                <Link to="/dashboard/domains">
                  <Button variant="secondary" size="sm">
                    Get Started
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur hover:shadow-elegant transition-all cursor-pointer border-accent/20">
              <CardContent className="p-6 text-center space-y-4">
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mx-auto">
                  <Zap className="h-6 w-6 text-accent" />
                </div>
                <h3 className="font-semibold text-lg">Deploy Cloud Instance</h3>
                <p className="text-sm text-muted-foreground">Launch a new VPS in under 60 seconds</p>
                <Link to="/dashboard/cloud">
                  <Button variant="outline" size="sm">
                    Deploy Now
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur hover:shadow-elegant transition-all cursor-pointer border-primary/20">
              <CardContent className="p-6 text-center space-y-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto">
                  <Database className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg">Backups & Snapshots</h3>
                <p className="text-sm text-muted-foreground">Secure your data with automated backups</p>
                <Link to="/dashboard/backups">
                  <Button variant="outline" size="sm">
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
