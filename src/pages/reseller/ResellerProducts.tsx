import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Package, Globe, Mail, Cloud, Server, Palette, Settings } from "lucide-react";

const defaultProducts = [
  { id: "1", name: "Starter Hosting", category: "hosting", basePrice: 9.99, resellerPrice: 4.99, margin: 50, active: true, description: "Perfect for small websites" },
  { id: "2", name: "Business Hosting", category: "hosting", basePrice: 24.99, resellerPrice: 12.49, margin: 50, active: true, description: "Ideal for growing businesses" },
  { id: "3", name: "Enterprise Hosting", category: "hosting", basePrice: 79.99, resellerPrice: 39.99, margin: 50, active: true, description: "High-performance hosting" },
  { id: "4", name: ".com Domain", category: "domains", basePrice: 12.99, resellerPrice: 8.99, margin: 31, active: true, description: "Most popular domain extension" },
  { id: "5", name: ".net Domain", category: "domains", basePrice: 14.99, resellerPrice: 9.99, margin: 33, active: true, description: "Tech-focused domain" },
  { id: "6", name: "Professional Email", category: "email", basePrice: 4.99, resellerPrice: 2.49, margin: 50, active: true, description: "Business email solution" },
  { id: "7", name: "Cloud VPS Basic", category: "cloud", basePrice: 19.99, resellerPrice: 9.99, margin: 50, active: true, description: "Entry-level cloud server" },
  { id: "8", name: "Cloud VPS Pro", category: "cloud", basePrice: 49.99, resellerPrice: 24.99, margin: 50, active: true, description: "High-performance VPS" },
];

const categories = [
  { id: "hosting", name: "Web Hosting", icon: Server },
  { id: "domains", name: "Domains", icon: Globe },
  { id: "email", name: "Email", icon: Mail },
  { id: "cloud", name: "Cloud", icon: Cloud },
];

const ResellerProducts = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState(defaultProducts);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<typeof defaultProducts[0] | null>(null);
  const [newProduct, setNewProduct] = useState({ 
    name: "", 
    category: "hosting", 
    basePrice: 0, 
    resellerPrice: 0, 
    description: "" 
  });

  const handleAddProduct = () => {
    const margin = ((newProduct.basePrice - newProduct.resellerPrice) / newProduct.basePrice * 100).toFixed(0);
    const product = {
      id: Date.now().toString(),
      ...newProduct,
      margin: parseFloat(margin),
      active: true,
    };
    setProducts([...products, product]);
    setNewProduct({ name: "", category: "hosting", basePrice: 0, resellerPrice: 0, description: "" });
    setIsAddDialogOpen(false);
    toast({ title: "Product Added", description: `${product.name} has been added to your catalog.` });
  };

  const handleToggleProduct = (id: string) => {
    setProducts(products.map(p => p.id === id ? { ...p, active: !p.active } : p));
    const product = products.find(p => p.id === id);
    toast({ 
      title: product?.active ? "Product Disabled" : "Product Enabled", 
      description: `${product?.name} is now ${product?.active ? "disabled" : "enabled"}.` 
    });
  };

  const handleUpdatePrice = (id: string, newPrice: number) => {
    setProducts(products.map(p => {
      if (p.id === id) {
        const margin = ((newPrice - p.resellerPrice) / newPrice * 100).toFixed(0);
        return { ...p, basePrice: newPrice, margin: parseFloat(margin) };
      }
      return p;
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-muted-foreground">Manage your product catalog and pricing</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
              <DialogDescription>Add a new product to your reseller catalog.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Product Name</Label>
                <Input value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} placeholder="Premium Hosting" />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={newProduct.category} onValueChange={(value) => setNewProduct({ ...newProduct, category: value })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Your Sell Price ($)</Label>
                  <Input type="number" step="0.01" value={newProduct.basePrice} onChange={(e) => setNewProduct({ ...newProduct, basePrice: parseFloat(e.target.value) })} />
                </div>
                <div className="space-y-2">
                  <Label>Your Cost ($)</Label>
                  <Input type="number" step="0.01" value={newProduct.resellerPrice} onChange={(e) => setNewProduct({ ...newProduct, resellerPrice: parseFloat(e.target.value) })} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea value={newProduct.description} onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} placeholder="Product description..." />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAddProduct}>Add Product</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Products</p>
                <p className="text-2xl font-bold">{products.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-green-500/10">
                <Package className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Products</p>
                <p className="text-2xl font-bold">{products.filter(p => p.active).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-blue-500/10">
                <span className="text-2xl">%</span>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Margin</p>
                <p className="text-2xl font-bold">{(products.reduce((sum, p) => sum + p.margin, 0) / products.length).toFixed(0)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-amber-500/10">
                <Palette className="h-6 w-6 text-amber-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Categories</p>
                <p className="text-2xl font-bold">{categories.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Products by Category */}
      <Tabs defaultValue="hosting" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          {categories.map(cat => {
            const Icon = cat.icon;
            return (
              <TabsTrigger key={cat.id} value={cat.id} className="gap-2">
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{cat.name}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>
        {categories.map(category => (
          <TabsContent key={category.id} value={category.id}>
            <div className="grid gap-4">
              {products.filter(p => p.category === category.id).map(product => (
                <Card key={product.id} className={!product.active ? "opacity-50" : ""}>
                  <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-lg">{product.name}</h3>
                          <Badge variant={product.active ? "default" : "secondary"}>
                            {product.active ? "Active" : "Disabled"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{product.description}</p>
                      </div>
                      <div className="flex flex-wrap items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Your Cost</p>
                          <p className="font-medium">${product.resellerPrice.toFixed(2)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Sell Price</p>
                          <Input 
                            type="number" 
                            step="0.01" 
                            className="w-24 text-right" 
                            value={product.basePrice} 
                            onChange={(e) => handleUpdatePrice(product.id, parseFloat(e.target.value))} 
                          />
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Margin</p>
                          <p className="font-bold text-green-500">{product.margin}%</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch checked={product.active} onCheckedChange={() => handleToggleProduct(product.id)} />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default ResellerProducts;