import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Layout,
  Plus,
  Search,
  Zap,
  Globe,
  Smartphone,
  Palette,
  Code,
  Eye,
  Sparkles,
} from "lucide-react";
import { useHostingStats } from "@/hooks/useHosting";
import { Skeleton } from "@/components/ui/skeleton";

const templates = [
  { id: 1, name: "Business Pro", category: "Business", image: "🏢", pages: 5, premium: true },
  { id: 2, name: "Portfolio Dark", category: "Portfolio", image: "🎨", pages: 3, premium: false },
  { id: 3, name: "E-Commerce", category: "Shop", image: "🛍️", pages: 8, premium: true },
  { id: 4, name: "Blog Minimal", category: "Blog", image: "✍️", pages: 4, premium: false },
  { id: 5, name: "Landing Pro", category: "Marketing", image: "🚀", pages: 1, premium: true },
  { id: 6, name: "Restaurant", category: "Business", image: "🍴", pages: 6, premium: false },
];

const WebsiteBuilder = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: hostingStats, isLoading: statsLoading } = useHostingStats();

  const filteredTemplates = templates.filter((t) =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">Website Builder</h1>
            <p className="text-muted-foreground">
              Create stunning websites with AI-powered templates in minutes
            </p>
          </div>
          <Button className="bg-gradient-speed text-primary-foreground shadow-glow gap-2" size="lg">
            <Plus className="h-5 w-5" />
            Create from Scratch
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-card/50 backdrop-blur">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Layout className="h-6 w-6 text-primary" />
                </div>
                <div>
                  {statsLoading ? <Skeleton className="h-8 w-12" /> : <p className="text-2xl font-bold">{hostingStats?.active ?? 0}</p>}
                  <p className="text-sm text-muted-foreground">Active Sites</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card/50 backdrop-blur">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-accent/10">
                  <Eye className="h-6 w-6 text-accent" />
                </div>
                <div>
                  {statsLoading ? <Skeleton className="h-8 w-12" /> : <p className="text-2xl font-bold">{hostingStats?.total ?? 0}</p>}
                  <p className="text-sm text-muted-foreground">Total Sites</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card/50 backdrop-blur">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <div>
                  {statsLoading ? <Skeleton className="h-8 w-12" /> : <p className="text-2xl font-bold">{hostingStats?.storagePercentage ?? 0}%</p>}
                  <p className="text-sm text-muted-foreground">Storage Used</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card/50 backdrop-blur">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-accent/10">
                  <Globe className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold">6</p>
                  <p className="text-sm text-muted-foreground">Templates</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Features Banner */}
        <Card className="bg-gradient-speed border-none shadow-glow">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Sparkles className="h-10 w-10 text-primary-foreground" />
                <div>
                  <h3 className="text-xl font-bold text-primary-foreground">AI-Powered Design Assistant</h3>
                  <p className="text-primary-foreground/90">
                    Let Cheeti AI help you build, optimize, and scale your website
                  </p>
                </div>
              </div>
              <Button variant="secondary" size="lg" className="gap-2">
                Try Cheeti AI
                <Sparkles className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Templates Section */}
        <Card className="bg-card/50 backdrop-blur">
          <CardHeader>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <CardTitle className="text-2xl">Choose a Template</CardTitle>
                <CardDescription>Start with a professionally designed template</CardDescription>
              </div>
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search templates..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="space-y-6">
              <TabsList className="grid grid-cols-6 w-full max-w-2xl">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="business">Business</TabsTrigger>
                <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
                <TabsTrigger value="shop">Shop</TabsTrigger>
                <TabsTrigger value="blog">Blog</TabsTrigger>
                <TabsTrigger value="marketing">Marketing</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredTemplates.map((template) => (
                    <Card
                      key={template.id}
                      className="group cursor-pointer hover:shadow-elegant transition-all bg-background/50 backdrop-blur overflow-hidden"
                    >
                      <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-6xl relative">
                        {template.image}
                        {template.premium && (
                          <Badge className="absolute top-3 right-3 bg-gradient-speed text-primary-foreground border-none">
                            Premium
                          </Badge>
                        )}
                        <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-2">
                          <Button size="sm" className="gap-2">
                            <Eye className="h-4 w-4" />
                            Preview
                          </Button>
                          <Button size="sm" variant="secondary" className="gap-2">
                            <Plus className="h-4 w-4" />
                            Use
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
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="bg-card/50 backdrop-blur hover:shadow-elegant transition-all">
            <CardContent className="p-6 text-center space-y-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto">
                <Smartphone className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg">Mobile Optimized</h3>
              <p className="text-sm text-muted-foreground">
                All templates are fully responsive and mobile-ready
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur hover:shadow-elegant transition-all">
            <CardContent className="p-6 text-center space-y-4">
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mx-auto">
                <Palette className="h-6 w-6 text-accent" />
              </div>
              <h3 className="font-semibold text-lg">Custom Styling</h3>
              <p className="text-sm text-muted-foreground">
                Customize colors, fonts, and layouts with ease
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur hover:shadow-elegant transition-all">
            <CardContent className="p-6 text-center space-y-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto">
                <Code className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg">Code Access</h3>
              <p className="text-sm text-muted-foreground">
                Full access to HTML, CSS, and JavaScript code
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default WebsiteBuilder;
