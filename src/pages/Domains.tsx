import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Globe, Search, Plus, Shield, Lock, Clock, Settings, RefreshCw, Trash2, FileEdit,
} from "lucide-react";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { useDomains, useCreateDomain, useDomainStats, useDNSRecords, useCreateDNSRecord, useDeleteDNSRecord, useDeleteDomain, useUpdateDomain, Domain } from "@/hooks/useDomains";
import { format } from "date-fns";

const Domains = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDNSDialogOpen, setIsDNSDialogOpen] = useState(false);
  const [isBulkTransferOpen, setIsBulkTransferOpen] = useState(false);
  const [newDomain, setNewDomain] = useState({ name: "", authCode: "" });
  const [selectedDomainId, setSelectedDomainId] = useState<string | null>(null);
  const [bulkTransferText, setBulkTransferText] = useState("");
  const [dnsForm, setDnsForm] = useState<{ type: "A" | "AAAA" | "CNAME" | "MX" | "TXT" | "NS" | "SRV"; name: string; value: string; ttl: number; priority: number }>({ type: "A", name: "@", value: "", ttl: 3600, priority: 10 });
  const [nsForm, setNsForm] = useState({ ns1: "", ns2: "", ns3: "", ns4: "" });

  const { data: domains, isLoading } = useDomains();
  const { data: stats } = useDomainStats();
  const { data: dnsRecords, isLoading: dnsLoading } = useDNSRecords(selectedDomainId || "");
  const createDomain = useCreateDomain();
  const deleteDomain = useDeleteDomain();
  const updateDomain = useUpdateDomain();
  const createDNSRecord = useCreateDNSRecord();
  const deleteDNSRecord = useDeleteDNSRecord();

  const handleRegisterDomain = async () => {
    if (!newDomain.name) return;
    const parts = newDomain.name.split(".");
    const tld = parts.length > 1 ? parts.pop() : "com";
    await createDomain.mutateAsync({ name: newDomain.name, tld, registrar: "CheetiHost", auto_renew: true, privacy_enabled: true });
    setNewDomain({ name: "", authCode: "" });
    setIsDialogOpen(false);
  };

  const handleAddDNSRecord = async () => {
    if (!selectedDomainId || !dnsForm.value) { toast.error("Please fill in all fields"); return; }
    await createDNSRecord.mutateAsync({
      domain_id: selectedDomainId, type: dnsForm.type, name: dnsForm.name, value: dnsForm.value, ttl: dnsForm.ttl, priority: dnsForm.type === "MX" ? dnsForm.priority : null,
    });
    setDnsForm({ type: "A", name: "@", value: "", ttl: 3600, priority: 10 });
    setIsDNSDialogOpen(false);
  };

  const handleBulkTransfer = () => {
    const lines = bulkTransferText.trim().split("\n").filter(Boolean);
    if (lines.length === 0) { toast.error("Please enter domains to transfer"); return; }
    lines.forEach(line => {
      const [domain, authCode] = line.split(",").map(s => s.trim());
      if (domain) {
        createDomain.mutate({ name: domain, registrar: "Transfer", auto_renew: true });
      }
    });
    toast.success(`Transferring ${lines.length} domain(s)...`);
    setBulkTransferText("");
    setIsBulkTransferOpen(false);
  };

  const togglePrivacy = (domain: Domain) => {
    updateDomain.mutate({ id: domain.id, privacy_enabled: !domain.privacy_enabled });
  };

  const toggleAutoRenew = (domain: Domain) => {
    updateDomain.mutate({ id: domain.id, auto_renew: !domain.auto_renew });
  };

  const toggleLock = (domain: Domain) => {
    updateDomain.mutate({ id: domain.id, transfer_lock: !domain.transfer_lock });
  };

  const handleSaveNameservers = (domainId: string) => {
    const ns = [nsForm.ns1, nsForm.ns2, nsForm.ns3, nsForm.ns4].filter(Boolean);
    if (ns.length < 2) { toast.error("At least 2 nameservers required"); return; }
    updateDomain.mutate({ id: domainId, nameservers: ns });
    toast.success("Nameservers updated!");
  };

  const getStatusBadge = (status: Domain["status"], expiryDate: string | null) => {
    if (status === "expired") return { className: "bg-red-500/10 text-red-500 border-none", label: "Expired" };
    if (expiryDate) {
      const expiry = new Date(expiryDate);
      const thirtyDays = new Date(Date.now() + 30 * 86400000);
      if (expiry <= thirtyDays) return { className: "bg-yellow-500/10 text-yellow-500 border-none", label: "Expiring Soon" };
    }
    if (status === "active") return { className: "bg-green-500/10 text-green-500 border-none", label: "Active" };
    return { className: "bg-muted text-muted-foreground border-none", label: status };
  };

  const filteredDomains = domains?.filter(d => d.name.toLowerCase().includes(searchQuery.toLowerCase())) || [];
  const selectedDomain = domains?.find(d => d.id === selectedDomainId);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 md:py-8 space-y-6 md:space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Domain Management</h1>
            <p className="text-sm md:text-base text-muted-foreground">Register, transfer, and manage your domains</p>
          </div>
          <div className="flex gap-2">
            <Dialog open={isBulkTransferOpen} onOpenChange={setIsBulkTransferOpen}>
              <DialogTrigger asChild><Button variant="outline" className="gap-2"><RefreshCw className="h-4 w-4" /> Bulk Transfer</Button></DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Bulk Domain Transfer</DialogTitle><DialogDescription>Enter one domain per line. Format: domain.com, authcode</DialogDescription></DialogHeader>
                <Textarea placeholder="example.com, AUTH123&#10;mydomain.net, AUTH456" rows={6} value={bulkTransferText} onChange={e => setBulkTransferText(e.target.value)} className="font-mono text-sm" />
                <DialogFooter><Button onClick={handleBulkTransfer} disabled={createDomain.isPending}>Transfer Domains</Button></DialogFooter>
              </DialogContent>
            </Dialog>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild><Button className="gap-2"><Plus className="h-4 w-4" /> Register Domain</Button></DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader><DialogTitle>Register Domain</DialogTitle><DialogDescription>Register a new domain with CheetiHost</DialogDescription></DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2"><Label>Domain Name</Label><Input placeholder="example.com" value={newDomain.name} onChange={e => setNewDomain(p => ({ ...p, name: e.target.value }))} /></div>
                </div>
                <DialogFooter><Button className="w-full" onClick={handleRegisterDomain} disabled={createDomain.isPending || !newDomain.name}>{createDomain.isPending ? "Registering..." : "Register Domain"}</Button></DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: "Total Domains", value: stats?.total.toString() || "0", icon: Globe },
            { label: "Active", value: stats?.active.toString() || "0", icon: Shield },
            { label: "Expiring Soon", value: stats?.expiringSoon.toString() || "0", icon: Clock },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <Card key={i} className="bg-card/50 backdrop-blur">
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 md:p-3 rounded-lg bg-primary/10"><Icon className="h-5 w-5 md:h-6 md:w-6 text-primary" /></div>
                    <div>{isLoading ? <Skeleton className="h-8 w-12" /> : <p className="text-xl md:text-2xl font-bold">{stat.value}</p>}<p className="text-xs md:text-sm text-muted-foreground">{stat.label}</p></div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Search */}
        <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
          <CardContent className="p-4 md:p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search your domains..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-9 h-10 md:h-12" />
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="domains" className="space-y-6">
          <TabsList className="grid grid-cols-3 w-full max-w-md">
            <TabsTrigger value="domains">My Domains</TabsTrigger>
            <TabsTrigger value="dns">DNS Records</TabsTrigger>
            <TabsTrigger value="nameservers">Nameservers</TabsTrigger>
          </TabsList>

          <TabsContent value="domains" className="space-y-4">
            <Card className="bg-card/50 backdrop-blur">
              <CardHeader className="pb-3"><CardTitle>Your Domains</CardTitle></CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">{[1, 2, 3].map(i => <Skeleton key={i} className="h-20 w-full" />)}</div>
                ) : filteredDomains.length > 0 ? (
                  <div className="space-y-3">
                    {filteredDomains.map(domain => {
                      const sb = getStatusBadge(domain.status, domain.expiry_date);
                      return (
                        <div key={domain.id} className="p-4 md:p-6 rounded-lg border bg-background/50 hover:border-primary/50 transition-all">
                          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                            <div className="flex items-start gap-3 min-w-0 flex-1">
                              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0"><Globe className="h-5 w-5 text-primary" /></div>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2 mb-2 flex-wrap">
                                  <h3 className="font-semibold truncate">{domain.name}</h3>
                                  <Badge className={sb.className}>{sb.label}</Badge>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-muted-foreground">
                                  <div><Clock className="h-3 w-3 inline mr-1" />{domain.expiry_date ? format(new Date(domain.expiry_date), "MMM d, yyyy") : "N/A"}</div>
                                  <div className="flex items-center gap-2">
                                    <Switch checked={domain.auto_renew} onCheckedChange={() => toggleAutoRenew(domain)} className="scale-75" />
                                    <span>Auto-Renew</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Switch checked={domain.privacy_enabled} onCheckedChange={() => togglePrivacy(domain)} className="scale-75" />
                                    <span>WHOIS Privacy</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2 flex-shrink-0 flex-wrap">
                              <Button variant="outline" size="sm" onClick={() => { setSelectedDomainId(domain.id); }}>
                                <FileEdit className="h-4 w-4 mr-1" /> DNS
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => toggleLock(domain)}>
                                <Lock className="h-4 w-4 mr-1" /> {domain.transfer_lock ? "Unlock" : "Lock"}
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => toast.success(`Renewal initiated for ${domain.name}`)}>
                                <RefreshCw className="h-4 w-4 mr-1" /> Renew
                              </Button>
                              <Button variant="ghost" size="sm" className="text-destructive" onClick={() => deleteDomain.mutate(domain.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
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
                    <Button onClick={() => setIsDialogOpen(true)} className="gap-2"><Plus className="h-4 w-4" /> Register Domain</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="dns" className="space-y-4">
            <Card className="bg-card/50 backdrop-blur">
              <CardHeader className="pb-3">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <CardTitle>DNS Records</CardTitle>
                    <CardDescription>{selectedDomain ? `Managing DNS for ${selectedDomain.name}` : "Select a domain first"}</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    {!selectedDomainId && domains && domains.length > 0 && (
                      <Select onValueChange={setSelectedDomainId}>
                        <SelectTrigger className="w-[200px]"><SelectValue placeholder="Select domain" /></SelectTrigger>
                        <SelectContent>{domains.map(d => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}</SelectContent>
                      </Select>
                    )}
                    {selectedDomainId && (
                      <Dialog open={isDNSDialogOpen} onOpenChange={setIsDNSDialogOpen}>
                        <DialogTrigger asChild><Button size="sm" className="gap-1"><Plus className="h-4 w-4" /> Add Record</Button></DialogTrigger>
                        <DialogContent>
                          <DialogHeader><DialogTitle>Add DNS Record</DialogTitle></DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <Label>Type</Label>
                              <Select value={dnsForm.type} onValueChange={v => setDnsForm(p => ({ ...p, type: v as typeof p.type }))}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>{["A", "AAAA", "CNAME", "MX", "TXT", "NS", "SRV"].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2"><Label>Name</Label><Input value={dnsForm.name} onChange={e => setDnsForm(p => ({ ...p, name: e.target.value }))} placeholder="@ or subdomain" /></div>
                            <div className="space-y-2"><Label>Value</Label><Input value={dnsForm.value} onChange={e => setDnsForm(p => ({ ...p, value: e.target.value }))} placeholder={dnsForm.type === "A" ? "192.168.1.1" : dnsForm.type === "CNAME" ? "target.example.com" : "value"} /></div>
                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-2"><Label>TTL</Label><Input type="number" value={dnsForm.ttl} onChange={e => setDnsForm(p => ({ ...p, ttl: parseInt(e.target.value) || 3600 }))} /></div>
                              {dnsForm.type === "MX" && <div className="space-y-2"><Label>Priority</Label><Input type="number" value={dnsForm.priority} onChange={e => setDnsForm(p => ({ ...p, priority: parseInt(e.target.value) || 10 }))} /></div>}
                            </div>
                          </div>
                          <DialogFooter><Button onClick={handleAddDNSRecord} disabled={createDNSRecord.isPending}>{createDNSRecord.isPending ? "Adding..." : "Add Record"}</Button></DialogFooter>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {!selectedDomainId ? (
                  <div className="text-center py-12"><Globe className="h-12 w-12 mx-auto text-muted-foreground mb-4" /><p className="text-muted-foreground">Select a domain to manage DNS records</p></div>
                ) : dnsLoading ? (
                  <div className="space-y-2">{[1, 2, 3].map(i => <Skeleton key={i} className="h-12 w-full" />)}</div>
                ) : dnsRecords && dnsRecords.length > 0 ? (
                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader><TableRow><TableHead>Type</TableHead><TableHead>Name</TableHead><TableHead>Value</TableHead><TableHead className="hidden md:table-cell">TTL</TableHead><TableHead className="w-[60px]"></TableHead></TableRow></TableHeader>
                      <TableBody>
                        {dnsRecords.map(record => (
                          <TableRow key={record.id}>
                            <TableCell><Badge variant="outline" className="text-[10px]">{record.type}</Badge></TableCell>
                            <TableCell className="font-mono text-sm">{record.name}</TableCell>
                            <TableCell className="font-mono text-sm truncate max-w-[200px]">{record.value}</TableCell>
                            <TableCell className="hidden md:table-cell text-sm text-muted-foreground">{record.ttl}s</TableCell>
                            <TableCell>
                              {!record.is_system && (
                                <Button variant="ghost" size="sm" className="text-destructive h-8 w-8 p-0" onClick={() => deleteDNSRecord.mutate({ id: record.id, domainId: selectedDomainId! })}>
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-12"><p className="text-muted-foreground mb-4">No DNS records yet</p><Button size="sm" onClick={() => setIsDNSDialogOpen(true)} className="gap-1"><Plus className="h-4 w-4" /> Add Record</Button></div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="nameservers" className="space-y-4">
            <Card className="bg-card/50 backdrop-blur">
              <CardHeader><CardTitle>Nameserver Configuration</CardTitle><CardDescription>Select a domain and configure custom nameservers</CardDescription></CardHeader>
              <CardContent className="space-y-4">
                <Select onValueChange={setSelectedDomainId} value={selectedDomainId || undefined}>
                  <SelectTrigger className="w-full max-w-md"><SelectValue placeholder="Select domain" /></SelectTrigger>
                  <SelectContent>{domains?.map(d => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}</SelectContent>
                </Select>
                {selectedDomainId && (
                  <div className="space-y-3 max-w-md">
                    {["ns1", "ns2", "ns3", "ns4"].map((ns, i) => (
                      <div key={ns} className="space-y-1">
                        <Label className="text-xs">{ns.toUpperCase()}{i < 2 && " *"}</Label>
                        <Input placeholder={`${ns}.cheetihost.com`} value={(nsForm as any)[ns]} onChange={e => setNsForm(p => ({ ...p, [ns]: e.target.value }))} className="font-mono text-sm" />
                      </div>
                    ))}
                    <Button onClick={() => handleSaveNameservers(selectedDomainId)}>Save Nameservers</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Domains;
