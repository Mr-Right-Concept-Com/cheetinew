import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Cloud as CloudIcon,
  Plus,
  MoreVertical,
  Activity,
  Cpu,
  HardDrive,
  Server,
  Power,
  PowerOff,
  RotateCcw,
  RefreshCw,
  Settings,
  BarChart3,
  Globe,
  Zap,
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

const Cloud = () => {
  const instances = [
    {
      id: 1,
      name: "Production Server",
      type: "General Purpose",
      cpu: 4,
      ram: 8,
      disk: 160,
      status: "running",
      region: "US East",
      ipAddress: "45.123.45.67",
      cpuUsage: 45,
      ramUsage: 62,
      diskUsage: 38,
    },
    {
      id: 2,
      name: "Development Server",
      type: "CPU Optimized",
      cpu: 8,
      ram: 16,
      disk: 320,
      status: "running",
      region: "EU West",
      ipAddress: "52.234.56.78",
      cpuUsage: 28,
      ramUsage: 41,
      diskUsage: 55,
    },
    {
      id: 3,
      name: "Database Server",
      type: "Memory Optimized",
      cpu: 4,
      ram: 32,
      disk: 500,
      status: "stopped",
      region: "Asia SE",
      ipAddress: "13.145.67.89",
      cpuUsage: 0,
      ramUsage: 0,
      diskUsage: 72,
    },
  ];

  const stats = [
    { label: "Active Instances", value: "2", icon: Server, color: "text-primary" },
    { label: "Total vCPU", value: "12", icon: Cpu, color: "text-accent" },
    { label: "Total RAM", value: "56 GB", icon: Activity, color: "text-green-500" },
    { label: "Total Storage", value: "980 GB", icon: HardDrive, color: "text-primary" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 md:py-8 space-y-6 md:space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2 truncate">CheetiCloud VPS</h1>
            <p className="text-sm md:text-base text-muted-foreground">
              Manage your cloud infrastructure and virtual machines
            </p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="gap-2 w-full sm:w-auto">
                <Plus className="h-4 w-4" />
                Create Instance
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Instance</DialogTitle>
                <DialogDescription>
                  Deploy a new cloud server in your preferred region
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="instanceName">Instance Name</Label>
                  <Input id="instanceName" placeholder="production-server-01" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="instanceType">Instance Type</Label>
                  <Select>
                    <SelectTrigger id="instanceType">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General Purpose</SelectItem>
                      <SelectItem value="cpu">CPU Optimized</SelectItem>
                      <SelectItem value="memory">Memory Optimized</SelectItem>
                      <SelectItem value="storage">Storage Optimized</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="instanceSize">Size</Label>
                  <Select>
                    <SelectTrigger id="instanceSize">
                      <SelectValue placeholder="Choose size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">2 vCPU / 4 GB RAM - $20/mo</SelectItem>
                      <SelectItem value="medium">4 vCPU / 8 GB RAM - $40/mo</SelectItem>
                      <SelectItem value="large">8 vCPU / 16 GB RAM - $80/mo</SelectItem>
                      <SelectItem value="xlarge">16 vCPU / 32 GB RAM - $160/mo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="region">Region</Label>
                  <Select>
                    <SelectTrigger id="region">
                      <SelectValue placeholder="Select region" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="us-east">US East (New York)</SelectItem>
                      <SelectItem value="us-west">US West (San Francisco)</SelectItem>
                      <SelectItem value="eu-west">Europe (London)</SelectItem>
                      <SelectItem value="asia">Asia (Singapore)</SelectItem>
                      <SelectItem value="africa">Africa (Lagos)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="os">Operating System</Label>
                  <Select>
                    <SelectTrigger id="os">
                      <SelectValue placeholder="Select OS" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ubuntu">Ubuntu 22.04 LTS</SelectItem>
                      <SelectItem value="debian">Debian 11</SelectItem>
                      <SelectItem value="centos">CentOS 8</SelectItem>
                      <SelectItem value="windows">Windows Server 2022</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button className="w-full">Deploy Instance</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="bg-card/50 backdrop-blur">
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className={`p-2 md:p-3 rounded-lg bg-${stat.color}/10`}>
                      <Icon className={`h-5 w-5 md:h-6 md:w-6 ${stat.color}`} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xl md:text-2xl font-bold truncate">{stat.value}</p>
                      <p className="text-xs md:text-sm text-muted-foreground truncate">{stat.label}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Instances List */}
        <Card className="bg-card/50 backdrop-blur">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl md:text-2xl">Cloud Instances</CardTitle>
            <CardDescription>Manage your virtual machines and resources</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 md:space-y-4">
              {instances.map((instance) => (
                <div
                  key={instance.id}
                  className="p-4 md:p-6 rounded-lg border border-border bg-background/50 hover:border-primary/50 transition-all"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    <div className="flex items-start gap-3 md:gap-4 min-w-0 flex-1">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                        <CloudIcon className="h-5 w-5 md:h-6 md:w-6 text-accent" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <h3 className="font-semibold text-base md:text-lg truncate">{instance.name}</h3>
                          <Badge
                            variant={instance.status === "running" ? "default" : "secondary"}
                            className={`flex-shrink-0 ${
                              instance.status === "running"
                                ? "bg-green-500/10 text-green-500 border-none"
                                : "bg-gray-500/10 text-gray-500 border-none"
                            }`}
                          >
                            {instance.status}
                          </Badge>
                          <Badge variant="outline" className="flex-shrink-0">{instance.type}</Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs md:text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Cpu className="h-3 w-3 flex-shrink-0" />
                            <span className="truncate">{instance.cpu} vCPU</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Activity className="h-3 w-3 flex-shrink-0" />
                            <span className="truncate">{instance.ram} GB RAM</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <HardDrive className="h-3 w-3 flex-shrink-0" />
                            <span className="truncate">{instance.disk} GB SSD</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Globe className="h-3 w-3 flex-shrink-0" />
                            <span className="truncate">{instance.region}</span>
                          </div>
                        </div>
                        <p className="text-xs md:text-sm text-muted-foreground mt-2 font-mono truncate">
                          IP: {instance.ipAddress}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0 self-start">
                      {instance.status === "running" ? (
                        <Button variant="outline" size="sm" className="gap-2">
                          <PowerOff className="h-4 w-4" />
                          <span className="hidden sm:inline">Stop</span>
                        </Button>
                      ) : (
                        <Button variant="outline" size="sm" className="gap-2">
                          <Power className="h-4 w-4" />
                          <span className="hidden sm:inline">Start</span>
                        </Button>
                      )}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="gap-2">
                            <RotateCcw className="h-4 w-4" />
                            Restart
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2">
                            <RefreshCw className="h-4 w-4" />
                            Resize
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2">
                            <Settings className="h-4 w-4" />
                            Configure
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2">
                            <BarChart3 className="h-4 w-4" />
                            View Metrics
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2">
                            <CloudIcon className="h-4 w-4" />
                            Create Snapshot
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  {/* Resource Usage */}
                  {instance.status === "running" && (
                    <div className="mt-4 space-y-3">
                      <div>
                        <div className="flex justify-between text-xs md:text-sm mb-1">
                          <span className="text-muted-foreground">CPU Usage</span>
                          <span className="font-medium">{instance.cpuUsage}%</span>
                        </div>
                        <Progress value={instance.cpuUsage} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-xs md:text-sm mb-1">
                          <span className="text-muted-foreground">RAM Usage</span>
                          <span className="font-medium">{instance.ramUsage}%</span>
                        </div>
                        <Progress value={instance.ramUsage} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-xs md:text-sm mb-1">
                          <span className="text-muted-foreground">Disk Usage</span>
                          <span className="font-medium">{instance.diskUsage}%</span>
                        </div>
                        <Progress value={instance.diskUsage} className="h-2" />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Features */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="bg-card/50 backdrop-blur hover:shadow-elegant transition-all cursor-pointer">
            <CardContent className="p-4 md:p-6 text-center space-y-3 md:space-y-4">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto">
                <Zap className="h-5 w-5 md:h-6 md:w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-base md:text-lg mb-1">Auto-Scaling</h3>
                <p className="text-xs md:text-sm text-muted-foreground">
                  Scale resources automatically
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur hover:shadow-elegant transition-all cursor-pointer">
            <CardContent className="p-4 md:p-6 text-center space-y-3 md:space-y-4">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-accent/10 flex items-center justify-center mx-auto">
                <CloudIcon className="h-5 w-5 md:h-6 md:w-6 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold text-base md:text-lg mb-1">Snapshots</h3>
                <p className="text-xs md:text-sm text-muted-foreground">
                  Instant backup & restore
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur hover:shadow-elegant transition-all cursor-pointer">
            <CardContent className="p-4 md:p-6 text-center space-y-3 md:space-y-4">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto">
                <BarChart3 className="h-5 w-5 md:h-6 md:w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-base md:text-lg mb-1">Monitoring</h3>
                <p className="text-xs md:text-sm text-muted-foreground">
                  Real-time metrics & alerts
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Cloud;
