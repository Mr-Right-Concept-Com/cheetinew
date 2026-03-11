import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Layout, Plus, Search, Zap, Globe, Smartphone, Palette, Code, Eye, Sparkles, Server, Settings,
} from "lucide-react";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { useHostingAccounts, useHostingStats, useCreateHostingAccount } from "@/hooks/useHosting";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const templates = [
  { id: 1, name: "Business Pro", category: "Business", image: "🏢", pages: 5, premium: true, description: "Professional business website with services, team, and contact pages." },
  { id: 2, name: "Portfolio Dark", category: "Portfolio", image: "🎨", pages: 3, premium: false, description: "Elegant dark-themed portfolio with gallery and project showcase." },
  { id: 3, name: "E-Commerce", category: "Shop", image: "🛍️", pages: 8, premium: true, description: "Full e-commerce store with cart, checkout, and product management." },
  { id: 4, name: "Blog Minimal", category: "Blog", image: "✍️", pages: 4, premium: false, description: "Clean minimal blog with categories, tags, and newsletter signup." },
  { id: 5, name: "Landing Pro", category: "Marketing", image: "🚀", pages: 1, premium: true, description: "High-converting landing page with CTA, testimonials, and analytics." },
  { id: 6, name: "Restaurant", category: "Business", image: "🍴", pages: 6, premium: false, description: "Restaurant website with menu, reservations, and location map." },
  { id: 7, name: "Agency Studio", category: "Portfolio", image: "🎯", pages: 5, premium: true, description: "Creative agency portfolio with case studies and team bios." },
  { id: 8, name: "SaaS Starter", category: "Marketing", image: "💻", pages: 4, premium: false, description: "SaaS product landing with pricing, features, and documentation." },
  { id: 9, name: "Fashion Store", category: "Shop", image: "👗", pages: 7, premium: true, description: "Fashion e-commerce with lookbook, collections, and wishlist." },
];

const WebsiteBuilder = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [previewTemplate, setPreviewTemplate] = useState<typeof templates[0] | null>(null);
  const [createSiteOpen, setCreateSiteOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<typeof templates[0] | null>(null);
  const [siteName, setSiteName] = useState("");
  const [siteDomain, setSiteDomain] = useState("");
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiOpen, setAiOpen] = useState(false);
  const [aiResult, setAiResult] = useState<typeof templates[0] | null>(null);

  const { data: hostingAccounts, isLoading: accountsLoading } = useHostingAccounts();
  const { data: hostingStats, isLoading: statsLoading } = useHostingStats();
  const createHosting = useCreateHostingAccount();

  const filterTemplates = (category?: string) => {
    let filtered = templates;
    if (category && category !== "all") {
      filtered = filtered.filter(t => t.category.toLowerCase() === category.toLowerCase());
    }
    if (searchQuery) {
      filtered = filtered.filter(t =>
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return filtered;
  };

  const handleCreateSite = async () => {
    if (!siteName.trim()) { toast.error("Site name is required"); return; }
    try {
      await createHosting.mutateAsync({
        name: siteName,
        plan: "starter",
        region: "us-east-1",
        plan_type: "shared",
      });
      toast.success("Site created! Go to Hosting to manage it.");
      setCreateSiteOpen(false);
      setSiteName("");
      setSiteDomain("");
      setSelectedTemplate(null);
    } catch { toast.error("Failed to create site"); }
  };

  const handleUseTemplate = (template: typeof templates[0]) => {
    setSelectedTemplate(template);
    setSiteName(template.name + " Site");
    setCreateSiteOpen(true);
  };

  const handleAiGenerate = () => {
    if (!aiPrompt.trim()) { toast.error("Describe your website first"); return; }
    const prompt = aiPrompt.toLowerCase();
    let match = templates[0];
    if (prompt.includes("shop") || prompt.includes("store") || prompt.includes("ecommerce") || prompt.includes("sell")) {
      match = templates.find(t => t.category === "Shop") || templates[0];
    } else if (prompt.includes("blog") || prompt.includes("write") || prompt.includes("article")) {
      match = templates.find(t => t.category === "Blog") || templates[0];
    } else if (prompt.includes("portfolio") || prompt.includes("creative") || prompt.includes("gallery")) {
      match = templates.find(t => t.category === "Portfolio") || templates[0];
    } else if (prompt.includes("landing") || prompt.includes("marketing") || prompt.includes("saas")) {
      match = templates.find(t => t.category === "Marketing") || templates[0];
    }
    setAiResult(match);
    toast.success(`Cheeti AI recommends: ${match.name}`);
  };

  const renderTemplateGrid = (category?: string) => {
    const filtered = filterTemplates(category);
    if (filtered.length === 0) {
      return (
        <div className="text-center py-12">
          <Layout className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No templates found</p>
        </div>
      );
    }
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(template => (
          <Card key={template.id} className="group cursor-pointer hover:shadow-elegant transition-all bg-background/50 overflow-hidden">
            <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-6xl relative">
              {template.image}
              {template.premium && (
                <Badge className="absolute top-3 right-3 bg-gradient-speed text-primary-foreground border-none">Premium</Badge>
              )}
              <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-2">
                <Button size="sm" className="gap-2" onClick={() => setPreviewTemplate(template)}>
                  <Eye className="h-4 w-4" />Preview
                </Button>
                <Button size="sm" variant="secondary" className="gap-2" onClick={() => handleUseTemplate(template)}>
                  <Plus className="h-4 w-4" />Use
                </Button>
              </div>
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg mb-1">{template.name}</h3>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{template.category}</span>
                <span>{template.pages} pages</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 md:py-8 space-y-6 md:space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Website Builder</h1>
            <p className="text-muted-foreground">Create stunning websites with AI-powered templates</p>
          </div>
          <Button className="bg-gradient-speed text-primary-foreground shadow-glow gap-2" size="lg"
            onClick={() => { setSelectedTemplate(null); setSiteName(""); setCreateSiteOpen(true); }}>
            <Plus className="h-5 w-5" />Create from Scratch
          </Button>
        </div>

        {/* My Sites */}
        {hostingAccounts && hostingAccounts.length > 0 && (
          <Card className="bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-lg">My Sites</CardTitle>
              <CardDescription>Your existing websites</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {hostingAccounts.slice(0, 6).map(site => (
                  <div key={site.id} className="p-4 rounded-lg border border-border bg-background/50 hover:border-primary/50 transition-all">
                    <div className="flex items-center gap-3 mb-2">
                      <Server className="h-5 w-5 text-primary" />
                      <h4 className="font-semibold text-sm truncate">{site.name}</h4>
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className={site.status === "active" ? "bg-green-500/10 text-green-500 border-green-500/20" : ""}>{site.status}</Badge>
                      <Link to="/dashboard/hosting"><Button variant="ghost" size="sm"><Settings className="h-4 w-4" /></Button></Link>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Active Sites", value: hostingStats?.active ?? 0, icon: Layout, bg: "bg-primary/10", color: "text-primary" },
            { label: "Total Sites", value: hostingStats?.total ?? 0, icon: Eye, bg: "bg-accent/10", color: "text-accent" },
            { label: "Storage Used", value: `${hostingStats?.storagePercentage ?? 0}%`, icon: Zap, bg: "bg-primary/10", color: "text-primary" },
            { label: "Templates", value: templates.length, icon: Globe, bg: "bg-accent/10", color: "text-accent" },
          ].map((stat, i) => (
            <Card key={i} className="bg-card/50 backdrop-blur">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center gap-3">
                  <div className={`p-2 md:p-3 rounded-lg ${stat.bg}`}><stat.icon className={`h-5 w-5 ${stat.color}`} /></div>
                  <div>{statsLoading ? <Skeleton className="h-8 w-12" /> : <p className="text-xl md:text-2xl font-bold">{stat.value}</p>}<p className="text-xs text-muted-foreground">{stat.label}</p></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* AI Banner */}
        <Card className="bg-gradient-speed border-none shadow-glow">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Sparkles className="h-10 w-10 text-primary-foreground" />
                <div>
                  <h3 className="text-xl font-bold text-primary-foreground">AI-Powered Design Assistant</h3>
                  <p className="text-primary-foreground/90">Let Cheeti AI recommend the perfect template</p>
                </div>
              </div>
              <Button variant="secondary" size="lg" className="gap-2" onClick={() => setAiOpen(true)}>
                Try Cheeti AI<Sparkles className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Templates */}
        <Card className="bg-card/50 backdrop-blur">
          <CardHeader>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div><CardTitle className="text-2xl">Choose a Template</CardTitle><CardDescription>Start with a professionally designed template</CardDescription></div>
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search templates..." className="pl-10" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="space-y-6">
              <TabsList className="grid grid-cols-3 md:grid-cols-6 w-full max-w-2xl">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="business">Business</TabsTrigger>
                <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
                <TabsTrigger value="shop">Shop</TabsTrigger>
                <TabsTrigger value="blog">Blog</TabsTrigger>
                <TabsTrigger value="marketing">Marketing</TabsTrigger>
              </TabsList>
              {["all", "business", "portfolio", "shop", "blog", "marketing"].map(cat => (
                <TabsContent key={cat} value={cat}>{renderTemplateGrid(cat === "all" ? undefined : cat)}</TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: Smartphone, title: "Mobile Optimized", desc: "All templates are fully responsive", bg: "bg-primary/10", color: "text-primary" },
            { icon: Palette, title: "Custom Styling", desc: "Customize colors, fonts, and layouts", bg: "bg-accent/10", color: "text-accent" },
            { icon: Code, title: "Code Access", desc: "Full access to HTML, CSS, and JavaScript", bg: "bg-primary/10", color: "text-primary" },
          ].map((f, i) => (
            <Card key={i} className="bg-card/50 backdrop-blur hover:shadow-elegant transition-all">
              <CardContent className="p-6 text-center space-y-4">
                <div className={`w-12 h-12 rounded-lg ${f.bg} flex items-center justify-center mx-auto`}>
                  <f.icon className={`h-6 w-6 ${f.color}`} />
                </div>
                <h3 className="font-semibold text-lg">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Preview Dialog */}
      <Dialog open={!!previewTemplate} onOpenChange={(open) => !open && setPreviewTemplate(null)}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="text-3xl">{previewTemplate?.image}</span>{previewTemplate?.name}
            </DialogTitle>
            <DialogDescription>{previewTemplate?.category} • {previewTemplate?.pages} pages</DialogDescription>
          </DialogHeader>
          <div className="aspect-video bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg flex items-center justify-center text-8xl">
            {previewTemplate?.image}
          </div>
          <p className="text-sm text-muted-foreground">{previewTemplate?.description}</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPreviewTemplate(null)}>Close</Button>
            <Button onClick={() => { setPreviewTemplate(null); if (previewTemplate) handleUseTemplate(previewTemplate); }}>
              Use This Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Site Dialog */}
      <Dialog open={createSiteOpen} onOpenChange={setCreateSiteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedTemplate ? `Create with ${selectedTemplate.name}` : "Create from Scratch"}</DialogTitle>
            <DialogDescription>Set up your new website</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Site Name</Label>
              <Input placeholder="My Awesome Website" value={siteName} onChange={(e) => setSiteName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Domain (optional)</Label>
              <Input placeholder="example.com" value={siteDomain} onChange={(e) => setSiteDomain(e.target.value)} />
            </div>
            <Button onClick={handleCreateSite} className="w-full" disabled={createHosting.isPending}>
              {createHosting.isPending ? "Creating..." : "Create Site"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* AI Dialog */}
      <Dialog open={aiOpen} onOpenChange={setAiOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-primary" />Cheeti AI Assistant</DialogTitle>
            <DialogDescription>Describe your ideal website and we'll find the best template</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Textarea placeholder="E.g., I need a modern online store for selling handmade jewelry with a gallery and checkout..."
              rows={4} value={aiPrompt} onChange={(e) => setAiPrompt(e.target.value)} />
            <Button onClick={handleAiGenerate} className="w-full gap-2">
              <Sparkles className="h-4 w-4" />Get Recommendation
            </Button>
            {aiResult && (
              <Card className="border-primary/30">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl">{aiResult.image}</span>
                    <div>
                      <h4 className="font-semibold">{aiResult.name}</h4>
                      <p className="text-xs text-muted-foreground">{aiResult.category} • {aiResult.pages} pages</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{aiResult.description}</p>
                  <Button size="sm" onClick={() => { setAiOpen(false); handleUseTemplate(aiResult); }}>Use This Template</Button>
                </CardContent>
              </Card>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WebsiteBuilder;
