import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Globe,
  Search,
  Plus,
  MoreVertical,
  Shield,
  Lock,
  Clock,
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
import { useDomains, useCreateDomain, useDomainStats, useDNSRecords, useDeleteDomain, Domain } from "@/hooks/useDomains";
import { format } from "date-fns";

const Domains = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newDomain, setNewDomain] = useState({ name: "", authCode: "" });
  const [selectedDomainId, setSelectedDomainId] = useState<string | null>(null);
  
  const { data: domains, isLoading } = useDomains();
  const { data: stats } = useDomainStats();
  const { data: dnsRecords, isLoading: dnsLoading } = useDNSRecords(selectedDomainId || "");
  const createDomain = useCreateDomain();
  const deleteDomain = useDeleteDomain();

  const handleRegisterDomain = async () => {
    if (!newDomain.name) return;
    
    const parts = newDomain.name.split(".");
    const tld = parts.length > 1 ? parts.pop() : "com";
    const name = parts.join(".");
    
    await createDomain.mutateAsync({
      name: newDomain.name,
      tld,
      registrar: "CheetiHost",
      auto_renew: true,
      privacy_enabled: true,
    });
    
    setNewDomain({ name: "", authCode: "" });
    setIsDialogOpen(false);
  };

  const getStatusBadge = (status: Domain["status"], expiryDate: string | null) => {
    if (status === "expired") {
      return { className: "bg-red-500/10 text-red-500 border-none", label: "Expired" };
    }
    if (expiryDate) {
      const expiry = new Date(expiryDate);
      const now = new Date();
      const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
      if (expiry <= thirtyDaysFromNow) {
        return { className: "bg-yellow-500/10 text-yellow-500 border-none", label: "Expiring Soon" };
      }
    }
    if (status === "active") {
      return { className: "bg-green-500/10 text-green-500 border-none", label: "Active" };
    }
    return { className: "bg-muted text-muted-foreground border-none", label: status };
  };

  const statsData = [
    { label: "Total Domains", value: stats?.total.toString() || "0", icon: Globe },
    { label: "Active", value: stats?.active.toString() || "0", icon: Shield },
    { label: "Expiring Soon", value: stats?.expiringSoon.toString() || "0", icon: Clock },
  ];

  const filteredDomains = domains?.filter(d => 
    d.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

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
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="lg" className="gap-2 w-full sm:w-auto h-10 md:h-12">
                      <Plus className="h-4 w-4" />
                      Register Domain
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Register Domain</DialogTitle>
                      <DialogDescription>
                        Register a new domain with CheetiHost
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="domainName">Domain Name</Label>
                        <Input 
                          id="domainName" 
                          placeholder="example.com" 
                          value={newDomain.name}
                          onChange={(e) => setNewDomain(prev => ({ ...prev, name: e.target.value }))}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button 
                        className="w-full" 
                        onClick={handleRegisterDomain}
                        disabled={createDomain.isPending || !newDomain.name}
                      >
                        {createDomain.isPending ? "Registering..." : "Register Domain"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
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
          {statsData.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="bg-card/50 backdrop-blur">
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="p-2 md:p-3 rounded-lg bg-primary/10">
                      <Icon className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      {isLoading ? (
                        <Skeleton className="h-8 w-12" />
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
                </div>
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
                ) : filteredDomains.length > 0 ? (
                  <div className="space-y-3 md:space-y-4">
                    {filteredDomains.map((domain) => {
                      const statusBadge = getStatusBadge(domain.status, domain.expiry_date);
                      
                      return (
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
                                    variant="default"
                                    className={statusBadge.className}
                                  >
                                    {statusBadge.label}
                                  </Badge>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs md:text-sm text-muted-foreground">
                                  <div className="flex items-center gap-1">
                                    <Clock className="h-3 w-3 flex-shrink-0" />
                                    <span className="truncate">
                                      Expires: {domain.expiry_date 
                                        ? format(new Date(domain.expiry_date), "MMM d, yyyy")
                                        : "N/A"}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <RefreshCw className="h-3 w-3 flex-shrink-0" />
                                    <span className="truncate">Auto-Renew: {domain.auto_renew ? "On" : "Off"}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Shield className="h-3 w-3 flex-shrink-0" />
                                    <span className="truncate">Privacy: {domain.privacy_enabled ? "Protected" : "Off"}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2 flex-shrink-0">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="gap-2"
                                onClick={() => setSelectedDomainId(domain.id)}
                              >
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
                                  <DropdownMenuItem 
                                    className="gap-2"
                                    onClick={() => setSelectedDomainId(domain.id)}
                                  >
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
                                  <DropdownMenuItem 
                                    className="gap-2 text-destructive"
                                    onClick={() => deleteDomain.mutate(domain.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Globe className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No domains yet</h3>
                    <p className="text-muted-foreground mb-4">Register your first domain to get started</p>
                    <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
                      <Plus className="h-4 w-4" />
                      Register Domain
                    </Button>
                  </div>
                )}
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
                    <CardDescription>
                      {selectedDomainId 
                        ? `Manage DNS records for ${domains?.find(d => d.id === selectedDomainId)?.name || "selected domain"}`
                        : "Select a domain to manage DNS records"}
                    </CardDescription>
                  </div>
                  {selectedDomainId && (
                    <Button className="gap-2 w-full sm:w-auto">
                      <Plus className="h-4 w-4" />
                      Add Record
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {!selectedDomainId ? (
                  <div className="text-center py-12">
                    <Globe className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Select a domain from the "My Domains" tab to manage DNS records</p>
                  </div>
                ) : dnsLoading ? (
                  <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-12 w-full" />
                    ))}
                  </div>
                ) : dnsRecords && dnsRecords.length > 0 ? (
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
                        {dnsRecords.map((record) => (
                          <TableRow key={record.id}>
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
                ) : (
                  <div className="text-center py-12">
                    <FileEdit className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No DNS records</h3>
                    <p className="text-muted-foreground mb-4">Add your first DNS record</p>
                    <Button className="gap-2">
                      <Plus className="h-4 w-4" />
                      Add Record
                    </Button>
                  </div>
                )}
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
                <h3 className="font-semibold text-base md:text-lg mb-1">Transfer Lock</h3>
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
