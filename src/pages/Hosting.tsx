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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Server, Globe, Plus, Activity, HardDrive, Users, TrendingUp, Settings, RotateCcw, Database, Shield, FileText, Copy, Terminal, ChevronLeft,
} from "lucide-react";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { useHostingAccounts, useCreateHostingAccount, useHostingStats, HostingAccount } from "@/hooks/useHosting";
import { OneClickApps } from "@/components/hosting/OneClickApps";
import { FileManager } from "@/components/hosting/FileManager";
import { CronManager } from "@/components/hosting/CronManager";
import { ResourceCharts } from "@/components/hosting/ResourceCharts";

const mockLogs = [
  { date: "2026-03-04 14:23:01", ip: "203.0.113.42", request: "GET /index.php HTTP/2", status: 200 },
  { date: "2026-03-04 14:22:58", ip: "198.51.100.7", request: "POST /wp-admin/admin-ajax.php HTTP/2", status: 200 },
  { date: "2026-03-04 14:22:45", ip: "192.0.2.15", request: "GET /wp-content/uploads/logo.png HTTP/2", status: 304 },
  { date: "2026-03-04 14:22:30", ip: "203.0.113.42", request: "GET /wp-login.php HTTP/2", status: 200 },
  { date: "2026-03-04 14:22:12", ip: "198.51.100.99", request: "GET /xmlrpc.php HTTP/2", status: 403 },
  { date: "2026-03-04 14:21:55", ip: "192.0.2.15", request: "GET /robots.txt HTTP/2", status: 200 },
  { date: "2026-03-04 14:21:40", ip: "203.0.113.88", request: "GET /sitemap.xml HTTP/2", status: 200 },
  { date: "2026-03-04 14:21:22", ip: "198.51.100.7", request: "GET /feed/ HTTP/2", status: 200 },
];

const Hosting = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newSite, setNewSite] = useState({ name: "", plan: "", region: "" });
  const [selectedSite, setSelectedSite] = useState<HostingAccount | null>(null);
  const [phpVersion, setPhpVersion] = useState("8.2");

  const { data: hostingAccounts, isLoading } = useHostingAccounts();
  const { data: stats } = useHostingStats();
  const createHosting = useCreateHostingAccount();

  const handleCreateSite = async () => {
    if (!newSite.name || !newSite.plan) return;
    await createHosting.mutateAsync({ name: newSite.name, plan: newSite.plan, region: newSite.region || "us-east-1" });
    setNewSite({ name: "", plan: "", region: "" });
    setIsDialogOpen(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const getStatusBadge = (status: HostingAccount["status"]) => {
    const m: Record<string, { className: string; label: string }> = {
      active: { className: "bg-green-500/10 text-green-500 border-none", label: "Active" },
      pending: { className: "bg-yellow-500/10 text-yellow-500 border-none", label: "Pending" },
      suspended: { className: "bg-red-500/10 text-red-500 border-none", label: "Suspended" },
      terminated: { className: "bg-muted text-muted-foreground border-none", label: "Terminated" },
    };
    return m[status] || m.pending;
  };

  // If a site is selected, show tabbed management
  if (selectedSite) {
    const s = selectedSite;
    const storagePercent = s.storage_limit_gb > 0 ? (s.storage_used_gb / s.storage_limit_gb) * 100 : 0;
    const bwPercent = s.bandwidth_limit_gb > 0 ? (s.bandwidth_used_gb / s.bandwidth_limit_gb) * 100 : 0;

    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6 md:py-8 space-y-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => setSelectedSite(null)} className="gap-1">
              <ChevronLeft className="h-4 w-4" /> Back
            </Button>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl md:text-3xl font-bold truncate">{s.name}</h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge className={getStatusBadge(s.status).className}>{getStatusBadge(s.status).label}</Badge>
                <Badge variant="outline">{s.plan}</Badge>
                <span className="text-sm text-muted-foreground">{s.region}</span>
              </div>
            </div>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="flex flex-wrap h-auto gap-1">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="apps">Apps</TabsTrigger>
              <TabsTrigger value="files">Files</TabsTrigger>
              <TabsTrigger value="databases">Databases</TabsTrigger>
              <TabsTrigger value="ssh">SSH/SFTP</TabsTrigger>
              <TabsTrigger value="php">PHP</TabsTrigger>
              <TabsTrigger value="cron">Cron Jobs</TabsTrigger>
              <TabsTrigger value="logs">Logs</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2"><CardTitle className="text-sm">Storage</CardTitle></CardHeader>
                  <CardContent>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{s.storage_used_gb} GB</span>
                      <span>{s.storage_limit_gb} GB</span>
                    </div>
                    <Progress value={storagePercent} className="h-2" />
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2"><CardTitle className="text-sm">Bandwidth</CardTitle></CardHeader>
                  <CardContent>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{s.bandwidth_used_gb} GB</span>
                      <span>{s.bandwidth_limit_gb} GB</span>
                    </div>
                    <Progress value={bwPercent} className="h-2" />
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2"><CardTitle className="text-sm">Databases</CardTitle></CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">{s.databases_used} / {s.databases_limit}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2"><CardTitle className="text-sm">Email Accounts</CardTitle></CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">{s.email_accounts_used} / {s.email_accounts_limit}</p>
                  </CardContent>
                </Card>
              </div>
              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-sm">Quick Info</CardTitle></CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">IP Address</span><span className="font-mono">{s.ip_address || "Assigning..."}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">SSL</span><Badge variant="outline" className={s.ssl_enabled ? "bg-green-500/10 text-green-500" : ""}>{s.ssl_enabled ? "Active" : "Inactive"}</Badge></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Panel</span><span>{s.panel_type || "CheetiPanel"}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Plan Type</span><span className="capitalize">{s.plan_type}</span></div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="apps"><OneClickApps hostingId={s.id} hostingName={s.name} /></TabsContent>
            <TabsContent value="files"><FileManager /></TabsContent>

            <TabsContent value="databases" className="space-y-4">
              <Card>
                <CardHeader><CardTitle className="text-lg">MySQL Databases</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div><p className="font-medium font-mono text-sm">{s.name.replace(/\./g, "_")}_db</p><p className="text-xs text-muted-foreground">MySQL 8.0 • 42 MB</p></div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => toast.info("Opening phpMyAdmin...")}>phpMyAdmin</Button>
                      <Button size="sm" variant="outline" onClick={() => toast.success("Backup started...")}>Backup</Button>
                    </div>
                  </div>
                  <Button className="gap-1" size="sm"><Plus className="h-3 w-3" /> Create Database</Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="ssh" className="space-y-4">
              <Card>
                <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Terminal className="h-5 w-5" /> SSH/SFTP Access</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { label: "Host", value: s.ip_address || `${s.name}.cheetihost.com` },
                    { label: "Port", value: "22" },
                    { label: "Username", value: s.name.replace(/\./g, "_").slice(0, 8) },
                    { label: "Protocol", value: "SSH / SFTP" },
                  ].map(item => (
                    <div key={item.label} className="flex items-center justify-between p-3 border rounded-lg">
                      <div><p className="text-xs text-muted-foreground">{item.label}</p><p className="font-mono text-sm">{item.value}</p></div>
                      <Button size="sm" variant="ghost" onClick={() => copyToClipboard(item.value)}><Copy className="h-3 w-3" /></Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="php" className="space-y-4">
              <Card>
                <CardHeader><CardTitle className="text-lg">PHP Configuration</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>PHP Version</Label>
                    <div className="flex gap-2">
                      <Select value={phpVersion} onValueChange={setPhpVersion}>
                        <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {["7.4", "8.0", "8.1", "8.2", "8.3"].map(v => <SelectItem key={v} value={v}>PHP {v}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <Button onClick={() => toast.success(`PHP version changed to ${phpVersion}`)}>Apply</Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    {[
                      { label: "memory_limit", value: "256M" },
                      { label: "max_execution_time", value: "300" },
                      { label: "upload_max_filesize", value: "128M" },
                      { label: "post_max_size", value: "128M" },
                    ].map(i => (
                      <div key={i.label} className="flex justify-between p-2 border rounded">
                        <span className="font-mono text-xs text-muted-foreground">{i.label}</span>
                        <span className="font-mono text-xs">{i.value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="cron"><CronManager /></TabsContent>

            <TabsContent value="logs">
              <Card>
                <CardHeader><CardTitle className="text-lg">Access Logs</CardTitle></CardHeader>
                <CardContent>
                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>IP</TableHead>
                          <TableHead className="hidden md:table-cell">Request</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {mockLogs.map((log, i) => (
                          <TableRow key={i}>
                            <TableCell className="font-mono text-xs">{log.date}</TableCell>
                            <TableCell className="font-mono text-xs">{log.ip}</TableCell>
                            <TableCell className="font-mono text-xs hidden md:table-cell truncate max-w-[300px]">{log.request}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className={`text-[10px] ${log.status < 300 ? "bg-green-500/10 text-green-500" : log.status < 400 ? "bg-yellow-500/10 text-yellow-500" : "bg-red-500/10 text-red-500"}`}>
                                {log.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="resources"><ResourceCharts /></TabsContent>
          </Tabs>
        </div>
      </div>
    );
  }

  // Sites List View
  const statsData = [
    { label: "Active Sites", value: stats?.active.toString() || "0", icon: Globe, bgColor: "bg-primary/10", iconColor: "text-primary" },
    { label: "Total Sites", value: stats?.total.toString() || "0", icon: Users, bgColor: "bg-accent/10", iconColor: "text-accent" },
    { label: "Storage Used", value: `${stats?.storagePercentage || 0}%`, icon: Activity, bgColor: "bg-green-500/10", iconColor: "text-green-500" },
    { label: "Total Storage", value: `${stats?.usedStorageGB || 0} GB`, icon: HardDrive, bgColor: "bg-primary/10", iconColor: "text-primary" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 md:py-8 space-y-6 md:space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Web Hosting</h1>
            <p className="text-sm md:text-base text-muted-foreground">Manage your websites and hosting services</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 w-full sm:w-auto"><Plus className="h-4 w-4" /> Add New Site</Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Website</DialogTitle>
                <DialogDescription>Deploy a new website to CheetiHost in minutes</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Domain Name</Label>
                  <Input placeholder="example.com" value={newSite.name} onChange={(e) => setNewSite(p => ({ ...p, name: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Select Plan</Label>
                  <Select value={newSite.plan} onValueChange={(v) => setNewSite(p => ({ ...p, plan: v }))}>
                    <SelectTrigger><SelectValue placeholder="Choose a plan" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="starter">Starter - $9.99/mo</SelectItem>
                      <SelectItem value="pro">Pro - $29.99/mo</SelectItem>
                      <SelectItem value="business">Business - $49.99/mo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Server Region</Label>
                  <Select value={newSite.region} onValueChange={(v) => setNewSite(p => ({ ...p, region: v }))}>
                    <SelectTrigger><SelectValue placeholder="Select region" /></SelectTrigger>
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
                <Button className="w-full" onClick={handleCreateSite} disabled={createHosting.isPending || !newSite.name || !newSite.plan}>
                  {createHosting.isPending ? "Deploying..." : "Deploy Website"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statsData.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <Card key={i} className="bg-card/50 backdrop-blur">
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className={`p-2 md:p-3 rounded-lg ${stat.bgColor}`}><Icon className={`h-5 w-5 md:h-6 md:w-6 ${stat.iconColor}`} /></div>
                    <div className="min-w-0 flex-1">
                      {isLoading ? <Skeleton className="h-8 w-16" /> : <p className="text-xl md:text-2xl font-bold truncate">{stat.value}</p>}
                      <p className="text-xs md:text-sm text-muted-foreground truncate">{stat.label}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="bg-card/50 backdrop-blur">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl md:text-2xl">Your Websites</CardTitle>
            <CardDescription>Click "Manage" to access full site controls</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">{[1, 2, 3].map(i => <div key={i} className="p-6 rounded-lg border"><Skeleton className="h-12 w-full" /></div>)}</div>
            ) : hostingAccounts && hostingAccounts.length > 0 ? (
              <div className="space-y-3 md:space-y-4">
                {hostingAccounts.map((site) => {
                  const statusBadge = getStatusBadge(site.status);
                  const storagePercent = site.storage_limit_gb > 0 ? (site.storage_used_gb / site.storage_limit_gb) * 100 : 0;
                  return (
                    <div key={site.id} className="p-4 md:p-6 rounded-lg border border-border bg-background/50 hover:border-primary/50 transition-all">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex items-start gap-3 md:gap-4 min-w-0 flex-1">
                          <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Globe className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <h3 className="font-semibold text-base md:text-lg truncate">{site.name}</h3>
                              <Badge className={statusBadge.className}>{statusBadge.label}</Badge>
                              <Badge variant="outline">{site.plan}</Badge>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-muted-foreground mt-2">
                              <div><Server className="h-3 w-3 inline mr-1" />{site.region}</div>
                              <div><Shield className="h-3 w-3 inline mr-1" />{site.ssl_enabled ? "SSL ✓" : "No SSL"}</div>
                              <div><HardDrive className="h-3 w-3 inline mr-1" />{Math.round(storagePercent)}%</div>
                              <div><TrendingUp className="h-3 w-3 inline mr-1" />{site.bandwidth_used_gb} GB</div>
                            </div>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="gap-2" onClick={() => setSelectedSite(site)}>
                          <Settings className="h-4 w-4" /> Manage
                        </Button>
                      </div>
                      <div className="mt-4 space-y-2">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-muted-foreground">Storage</span>
                          <span>{site.storage_used_gb} / {site.storage_limit_gb} GB</span>
                        </div>
                        <Progress value={storagePercent} className="h-1.5" />
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
                <Button onClick={() => setIsDialogOpen(true)} className="gap-2"><Plus className="h-4 w-4" /> Add New Site</Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Hosting;
