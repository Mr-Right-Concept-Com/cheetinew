import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Globe,
  Search,
  Plus,
  MoreVertical,
  Shield,
  Lock,
  Clock,
  ExternalLink,
  Settings,
  RefreshCw,
  Trash2,
  FileEdit,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const Domains = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const domains = [
    {
      id: 1,
      name: "mywebsite.com",
      status: "active",
      expiry: "2025-06-15",
      autoRenew: true,
      privacy: true,
      registrar: "CheetiHost",
    },
    {
      id: 2,
      name: "blog.example.com",
      status: "active",
      expiry: "2025-03-20",
      autoRenew: true,
      privacy: true,
      registrar: "CheetiHost",
    },
    {
      id: 3,
      name: "shop.mystore.com",
      status: "expiring-soon",
      expiry: "2024-12-25",
      autoRenew: false,
      privacy: false,
      registrar: "External",
    },
  ];

  const stats = [
    { label: "Total Domains", value: "3", icon: Globe },
    { label: "Active", value: "3", icon: Shield },
    { label: "Expiring Soon", value: "1", icon: Clock },
  ];

  const dnsRecords = [
    { type: "A", name: "@", value: "192.168.1.1", ttl: "3600" },
    { type: "CNAME", name: "www", value: "mywebsite.com", ttl: "3600" },
    { type: "MX", name: "@", value: "mail.mywebsite.com", ttl: "3600" },
    { type: "TXT", name: "@", value: "v=spf1 include:_spf.google.com ~all", ttl: "3600" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 md:py-8 space-y-6 md:space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2 truncate">Domain Management</h1>
            <p className="text-sm md:text-base text-muted-foreground">
              Register, transfer, and manage your domains
            </p>
          </div>
        </div>

        {/* Domain Search */}
        <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
          <CardContent className="p-4 md:p-6">
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-muted-foreground" />
                  <Input
                    placeholder="Search for your perfect domain..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 md:pl-10 h-10 md:h-12 text-sm md:text-lg"
                  />
                </div>
                <Button size="lg" className="gap-2 w-full sm:w-auto h-10 md:h-12">
                  <Search className="h-4 w-4" />
                  Search Domain
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 md:gap-4 text-xs md:text-sm">
                <span className="text-muted-foreground">.com - $12.99/yr</span>
                <span className="text-muted-foreground">.net - $14.99/yr</span>
                <span className="text-muted-foreground">.io - $39.99/yr</span>
                <span className="text-muted-foreground">.dev - $12.99/yr</span>
                <span className="text-muted-foreground">.app - $14.99/yr</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="bg-card/50 backdrop-blur">
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="p-2 md:p-3 rounded-lg bg-primary/10">
                      <Icon className="h-5 w-5 md:h-6 md:w-6 text-primary" />
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

        {/* Domains List & DNS Management */}
        <Tabs defaultValue="domains" className="space-y-6">
          <TabsList className="grid grid-cols-2 w-full max-w-md">
            <TabsTrigger value="domains">My Domains</TabsTrigger>
            <TabsTrigger value="dns">DNS Records</TabsTrigger>
          </TabsList>

          {/* Domains Tab */}
          <TabsContent value="domains" className="space-y-4">
            <Card className="bg-card/50 backdrop-blur">
              <CardHeader className="pb-3">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <CardTitle className="text-xl md:text-2xl">Your Domains</CardTitle>
                    <CardDescription>Manage your registered domains</CardDescription>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="gap-2 w-full sm:w-auto">
                        <Plus className="h-4 w-4" />
                        Transfer Domain
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Transfer Domain</DialogTitle>
                        <DialogDescription>
                          Transfer your domain to CheetiHost
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="transferDomain">Domain Name</Label>
                          <Input id="transferDomain" placeholder="example.com" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="authCode">Authorization Code</Label>
                          <Input id="authCode" placeholder="EPP/Auth code" />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button className="w-full">Start Transfer</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 md:space-y-4">
                  {domains.map((domain) => (
                    <div
                      key={domain.id}
                      className="p-4 md:p-6 rounded-lg border border-border bg-background/50 hover:border-primary/50 transition-all"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex items-start gap-3 md:gap-4 min-w-0 flex-1">
                          <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Globe className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                              <h3 className="font-semibold text-base md:text-lg truncate">{domain.name}</h3>
                              <Badge
                                variant={domain.status === "active" ? "default" : "secondary"}
                                className={`flex-shrink-0 ${
                                  domain.status === "active"
                                    ? "bg-green-500/10 text-green-500 border-none"
                                    : "bg-yellow-500/10 text-yellow-500 border-none"
                                }`}
                              >
                                {domain.status === "active" ? "Active" : "Expiring Soon"}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs md:text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3 flex-shrink-0" />
                                <span className="truncate">Expires: {domain.expiry}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <RefreshCw className="h-3 w-3 flex-shrink-0" />
                                <span className="truncate">Auto-Renew: {domain.autoRenew ? "On" : "Off"}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Shield className="h-3 w-3 flex-shrink-0" />
                                <span className="truncate">Privacy: {domain.privacy ? "Protected" : "Off"}</span>
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
                              <DropdownMenuItem className="gap-2">
                                <FileEdit className="h-4 w-4" />
                                Edit DNS
                              </DropdownMenuItem>
                              <DropdownMenuItem className="gap-2">
                                <Shield className="h-4 w-4" />
                                Privacy Settings
                              </DropdownMenuItem>
                              <DropdownMenuItem className="gap-2">
                                <RefreshCw className="h-4 w-4" />
                                Renew Domain
                              </DropdownMenuItem>
                              <DropdownMenuItem className="gap-2">
                                <Lock className="h-4 w-4" />
                                Lock/Unlock
                              </DropdownMenuItem>
                              <DropdownMenuItem className="gap-2 text-destructive">
                                <Trash2 className="h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* DNS Records Tab */}
          <TabsContent value="dns" className="space-y-4">
            <Card className="bg-card/50 backdrop-blur">
              <CardHeader className="pb-3">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <CardTitle className="text-xl md:text-2xl">DNS Records</CardTitle>
                    <CardDescription>Manage DNS records for mywebsite.com</CardDescription>
                  </div>
                  <Button className="gap-2 w-full sm:w-auto">
                    <Plus className="h-4 w-4" />
                    Add Record
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[80px] md:w-[100px]">Type</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead className="hidden md:table-cell">Value</TableHead>
                        <TableHead className="w-[80px] md:w-[100px]">TTL</TableHead>
                        <TableHead className="w-[80px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {dnsRecords.map((record, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <Badge variant="outline" className="font-mono text-xs">
                              {record.type}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-mono text-xs md:text-sm truncate max-w-[100px] md:max-w-none">
                            {record.name}
                          </TableCell>
                          <TableCell className="hidden md:table-cell font-mono text-xs md:text-sm truncate max-w-xs">
                            {record.value}
                          </TableCell>
                          <TableCell className="text-xs md:text-sm">{record.ttl}</TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem className="gap-2">
                                  <FileEdit className="h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem className="gap-2 text-destructive">
                                  <Trash2 className="h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Features */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="bg-card/50 backdrop-blur hover:shadow-elegant transition-all cursor-pointer">
            <CardContent className="p-4 md:p-6 text-center space-y-3 md:space-y-4">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto">
                <Shield className="h-5 w-5 md:h-6 md:w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-base md:text-lg mb-1">WHOIS Privacy</h3>
                <p className="text-xs md:text-sm text-muted-foreground">
                  Free privacy protection included
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur hover:shadow-elegant transition-all cursor-pointer">
            <CardContent className="p-4 md:p-6 text-center space-y-3 md:space-y-4">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-accent/10 flex items-center justify-center mx-auto">
                <RefreshCw className="h-5 w-5 md:h-6 md:w-6 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold text-base md:text-lg mb-1">Auto-Renewal</h3>
                <p className="text-xs md:text-sm text-muted-foreground">
                  Never lose your domain
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur hover:shadow-elegant transition-all cursor-pointer">
            <CardContent className="p-4 md:p-6 text-center space-y-3 md:space-y-4">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto">
                <Lock className="h-5 w-5 md:h-6 md:w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-base md:text-lg mb-1">Domain Lock</h3>
                <p className="text-xs md:text-sm text-muted-foreground">
                  Prevent unauthorized transfers
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Domains;
