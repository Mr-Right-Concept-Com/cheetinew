import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Plus, Package, Globe, Mail, Cloud, Server, Palette } from "lucide-react";
import { usePageMeta } from "@/hooks/usePageMeta";

const categories = [
  { id: "hosting", name: "Web Hosting", icon: Server },
  { id: "domains", name: "Domains", icon: Globe },
  { id: "email", name: "Email", icon: Mail },
  { id: "cloud", name: "Cloud", icon: Cloud },
];

const ResellerProducts = () => {
  usePageMeta("Reseller Products", "Manage your product catalog and pricing");
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: "", category: "hosting", basePrice: 0, resellerPrice: 0, description: "" });

  const { data: products, isLoading } = useQuery({
    queryKey: ["reseller-products"],
    queryFn: async () => {
      const { data, error } = await supabase.from("reseller_products").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const addProduct = useMutation({
    mutationFn: async () => {
      const margin = newProduct.basePrice > 0 ? ((newProduct.basePrice - newProduct.resellerPrice) / newProduct.basePrice * 100) : 0;
      const { error } = await supabase.from("reseller_products").insert({
        reseller_id: user!.id, name: newProduct.name, type: newProduct.category,
        base_price: newProduct.resellerPrice, reseller_price: newProduct.basePrice,
        markup_percentage: margin, description: newProduct.description, is_active: true,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reseller-products"] });
      setIsAddDialogOpen(false);
      setNewProduct({ name: "", category: "hosting", basePrice: 0, resellerPrice: 0, description: "" });
      toast({ title: "Product Added", description: "New product added to your catalog." });
    },
    onError: () => toast({ title: "Error", description: "Failed to add product.", variant: "destructive" }),
  });

  const toggleProduct = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const { error } = await supabase.from("reseller_products").update({ is_active: !isActive }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["reseller-products"] }),
  });

  const updatePrice = useMutation({
    mutationFn: async ({ id, price }: { id: string; price: number }) => {
      const { error } = await supabase.from("reseller_products").update({ reseller_price: price }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["reseller-products"] }),
  });

  const allProducts = products ?? [];
  const activeProducts = allProducts.filter(p => p.is_active);
  const avgMargin = allProducts.length > 0 ? allProducts.reduce((sum, p) => sum + (p.markup_percentage || 0), 0) / allProducts.length : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div><h1 className="text-3xl font-bold">Products</h1><p className="text-muted-foreground">Manage your product catalog and pricing</p></div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild><Button className="gap-2"><Plus className="h-4 w-4" />Add Product</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add New Product</DialogTitle><DialogDescription>Add a new product to your reseller catalog.</DialogDescription></DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2"><Label>Product Name</Label><Input value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} placeholder="Premium Hosting" /></div>
              <div className="space-y-2"><Label>Category</Label><Select value={newProduct.category} onValueChange={(value) => setNewProduct({ ...newProduct, category: value })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{categories.map(cat => <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>)}</SelectContent></Select></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Your Sell Price ($)</Label><Input type="number" step="0.01" value={newProduct.basePrice} onChange={(e) => setNewProduct({ ...newProduct, basePrice: parseFloat(e.target.value) || 0 })} /></div>
                <div className="space-y-2"><Label>Your Cost ($)</Label><Input type="number" step="0.01" value={newProduct.resellerPrice} onChange={(e) => setNewProduct({ ...newProduct, resellerPrice: parseFloat(e.target.value) || 0 })} /></div>
              </div>
              <div className="space-y-2"><Label>Description</Label><Textarea value={newProduct.description} onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} placeholder="Product description..." /></div>
            </div>
            <DialogFooter><Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button><Button onClick={() => addProduct.mutate()} disabled={addProduct.isPending || !newProduct.name}>{addProduct.isPending ? "Adding..." : "Add Product"}</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card><CardContent className="pt-6"><div className="flex items-center gap-4"><div className="p-3 rounded-lg bg-primary/10"><Package className="h-6 w-6 text-primary" /></div><div><p className="text-sm text-muted-foreground">Total Products</p>{isLoading ? <Skeleton className="h-8 w-12" /> : <p className="text-2xl font-bold">{allProducts.length}</p>}</div></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center gap-4"><div className="p-3 rounded-lg bg-green-500/10"><Package className="h-6 w-6 text-green-500" /></div><div><p className="text-sm text-muted-foreground">Active Products</p>{isLoading ? <Skeleton className="h-8 w-12" /> : <p className="text-2xl font-bold">{activeProducts.length}</p>}</div></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center gap-4"><div className="p-3 rounded-lg bg-blue-500/10"><span className="text-2xl">%</span></div><div><p className="text-sm text-muted-foreground">Avg Margin</p>{isLoading ? <Skeleton className="h-8 w-12" /> : <p className="text-2xl font-bold">{avgMargin.toFixed(0)}%</p>}</div></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center gap-4"><div className="p-3 rounded-lg bg-amber-500/10"><Palette className="h-6 w-6 text-amber-500" /></div><div><p className="text-sm text-muted-foreground">Categories</p><p className="text-2xl font-bold">{categories.length}</p></div></div></CardContent></Card>
      </div>

      {isLoading ? (
        <div className="space-y-4">{[1, 2, 3].map(i => <Skeleton key={i} className="h-24 w-full" />)}</div>
      ) : (
        <Tabs defaultValue="hosting" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            {categories.map(cat => { const Icon = cat.icon; return <TabsTrigger key={cat.id} value={cat.id} className="gap-2"><Icon className="h-4 w-4" /><span className="hidden sm:inline">{cat.name}</span></TabsTrigger>; })}
          </TabsList>
          {categories.map(category => (
            <TabsContent key={category.id} value={category.id}>
              <div className="grid gap-4">
                {allProducts.filter(p => p.type === category.id).length === 0 ? (
                  <Card><CardContent className="py-8 text-center"><p className="text-muted-foreground">No products in this category. Add one above!</p></CardContent></Card>
                ) : allProducts.filter(p => p.type === category.id).map(product => (
                  <Card key={product.id} className={!product.is_active ? "opacity-50" : ""}>
                    <CardContent className="pt-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2"><h3 className="font-semibold text-lg">{product.name}</h3><Badge variant={product.is_active ? "default" : "secondary"}>{product.is_active ? "Active" : "Disabled"}</Badge></div>
                          <p className="text-sm text-muted-foreground mt-1">{product.description || "No description"}</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-4">
                          <div className="text-right"><p className="text-sm text-muted-foreground">Your Cost</p><p className="font-medium">${(product.base_price || 0).toFixed(2)}</p></div>
                          <div className="text-right"><p className="text-sm text-muted-foreground">Sell Price</p><Input type="number" step="0.01" className="w-24 text-right" defaultValue={product.reseller_price} onBlur={(e) => updatePrice.mutate({ id: product.id, price: parseFloat(e.target.value) || 0 })} /></div>
                          <div className="text-right"><p className="text-sm text-muted-foreground">Margin</p><p className="font-bold text-green-500">{(product.markup_percentage || 0).toFixed(0)}%</p></div>
                          <Switch checked={product.is_active ?? true} onCheckedChange={() => toggleProduct.mutate({ id: product.id, isActive: product.is_active ?? true })} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  );
};

export default ResellerProducts;
