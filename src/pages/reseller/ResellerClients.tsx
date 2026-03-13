import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Search, Users, Mail, Phone, Building2, MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { usePageMeta } from "@/hooks/usePageMeta";
import { z } from "zod";
import { clientSchema } from "@/lib/validations";

const ResellerClients = () => {
  usePageMeta("Reseller Clients", "Manage your reseller clients");
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newClient, setNewClient] = useState({ name: "", email: "", phone: "", company: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { data: clients, isLoading } = useQuery({
    queryKey: ["reseller-clients"],
    queryFn: async () => {
      const { data, error } = await supabase.from("reseller_clients").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const addClient = useMutation({
    mutationFn: async (client: z.infer<typeof clientSchema>) => {
      const { error } = await supabase.from("reseller_clients").insert({
        reseller_id: user!.id, name: client.name, email: client.email, phone: client.phone || null, company: client.company || null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reseller-clients"] });
      setIsAddDialogOpen(false);
      setNewClient({ name: "", email: "", phone: "", company: "" });
      toast({ title: "Client Added", description: "New client has been added." });
    },
    onError: () => toast({ title: "Error", description: "Failed to add client.", variant: "destructive" }),
  });

  const toggleStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("reseller_clients").update({ status: status === "active" ? "suspended" : "active" }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["reseller-clients"] }); toast({ title: "Status Updated" }); },
  });

  const deleteClient = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("reseller_clients").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["reseller-clients"] }); toast({ title: "Client Removed", variant: "destructive" }); },
  });

  const handleAddClient = () => {
    const result = clientSchema.safeParse(newClient);
    if (!result.success) {
      const errs: Record<string, string> = {};
      result.error.issues.forEach(i => { errs[i.path[0] as string] = i.message; });
      setErrors(errs);
      return;
    }
    setErrors({});
    addClient.mutate(result.data);
  };

  const allClients = clients ?? [];
  const filteredClients = allClients.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.email.toLowerCase().includes(searchQuery.toLowerCase()));
  const totalRevenue = allClients.reduce((sum, c) => sum + (c.total_revenue || 0), 0);
  const activeClients = allClients.filter(c => c.status === "active").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div><h1 className="text-3xl font-bold">Clients</h1><p className="text-muted-foreground">Manage your reseller clients and their services</p></div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild><Button className="gap-2"><Plus className="h-4 w-4" />Add Client</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add New Client</DialogTitle><DialogDescription>Create a new client account under your reseller portal.</DialogDescription></DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2"><Label>Company Name</Label><Input value={newClient.name} onChange={(e) => setNewClient({ ...newClient, name: e.target.value })} placeholder="Acme Corp" />{errors.name && <p className="text-xs text-destructive">{errors.name}</p>}</div>
              <div className="space-y-2"><Label>Email</Label><Input type="email" value={newClient.email} onChange={(e) => setNewClient({ ...newClient, email: e.target.value })} placeholder="admin@acme.com" />{errors.email && <p className="text-xs text-destructive">{errors.email}</p>}</div>
              <div className="space-y-2"><Label>Phone</Label><Input value={newClient.phone} onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })} placeholder="+1 555-0100" /></div>
              <div className="space-y-2"><Label>Company</Label><Input value={newClient.company} onChange={(e) => setNewClient({ ...newClient, company: e.target.value })} placeholder="Company name" /></div>
            </div>
            <DialogFooter><Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button><Button onClick={handleAddClient} disabled={addClient.isPending}>{addClient.isPending ? "Adding..." : "Add Client"}</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card><CardContent className="pt-6"><div className="flex items-center gap-4"><div className="p-3 rounded-lg bg-primary/10"><Users className="h-6 w-6 text-primary" /></div><div><p className="text-sm text-muted-foreground">Total Clients</p>{isLoading ? <Skeleton className="h-8 w-12" /> : <p className="text-2xl font-bold">{allClients.length}</p>}</div></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center gap-4"><div className="p-3 rounded-lg bg-green-500/10"><Users className="h-6 w-6 text-green-500" /></div><div><p className="text-sm text-muted-foreground">Active Clients</p>{isLoading ? <Skeleton className="h-8 w-12" /> : <p className="text-2xl font-bold">{activeClients}</p>}</div></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center gap-4"><div className="p-3 rounded-lg bg-blue-500/10"><Building2 className="h-6 w-6 text-blue-500" /></div><div><p className="text-sm text-muted-foreground">Total Services</p>{isLoading ? <Skeleton className="h-8 w-12" /> : <p className="text-2xl font-bold">{allClients.reduce((sum, c) => sum + (c.services_count || 0), 0)}</p>}</div></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center gap-4"><div className="p-3 rounded-lg bg-amber-500/10"><span className="text-2xl">$</span></div><div><p className="text-sm text-muted-foreground">Monthly Revenue</p>{isLoading ? <Skeleton className="h-8 w-16" /> : <p className="text-2xl font-bold">${totalRevenue.toFixed(2)}</p>}</div></div></CardContent></Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle>Client List</CardTitle>
            <div className="relative w-full md:w-80"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search clients..." className="pl-10" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} /></div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">{[1, 2, 3].map(i => <Skeleton key={i} className="h-16 w-full" />)}</div>
          ) : filteredClients.length === 0 ? (
            <div className="text-center py-12"><Users className="h-10 w-10 mx-auto text-muted-foreground mb-3" /><p className="text-muted-foreground">{searchQuery ? "No clients match your search" : "No clients yet. Add your first client!"}</p></div>
          ) : (
            <Table>
              <TableHeader><TableRow><TableHead>Client</TableHead><TableHead>Contact</TableHead><TableHead>Services</TableHead><TableHead>Revenue</TableHead><TableHead>Status</TableHead><TableHead className="w-10"></TableHead></TableRow></TableHeader>
              <TableBody>
                {filteredClients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell><div><p className="font-medium">{client.name}</p><p className="text-sm text-muted-foreground">{client.company || "—"}</p></div></TableCell>
                    <TableCell><div className="space-y-1"><div className="flex items-center gap-2 text-sm"><Mail className="h-3 w-3" />{client.email}</div>{client.phone && <div className="flex items-center gap-2 text-sm text-muted-foreground"><Phone className="h-3 w-3" />{client.phone}</div>}</div></TableCell>
                    <TableCell>{client.services_count || 0}</TableCell>
                    <TableCell>${(client.total_revenue || 0).toFixed(2)}/mo</TableCell>
                    <TableCell><Badge variant={client.status === "active" ? "default" : "destructive"}>{client.status}</Badge></TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => toggleStatus.mutate({ id: client.id, status: client.status || "active" })}>{client.status === "active" ? "Suspend" : "Activate"}</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive" onClick={() => deleteClient.mutate(client.id)}>Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ResellerClients;
