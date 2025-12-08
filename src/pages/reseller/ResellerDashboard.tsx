import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Users,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  Package,
  Globe,
  Server,
  Mail,
  Building,
  RefreshCw,
  Plus,
  Settings,
  FileText,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
} from "recharts";

const ResellerDashboard = () => {
  // Revenue data for charts
  const revenueData = [
    { month: "Jan", revenue: 2400, clients: 12 },
    { month: "Feb", revenue: 3100, clients: 15 },
    { month: "Mar", revenue: 2800, clients: 14 },
    { month: "Apr", revenue: 4200, clients: 19 },
    { month: "May", revenue: 5100, clients: 24 },
    { month: "Jun", revenue: 4800, clients: 22 },
    { month: "Jul", revenue: 6200, clients: 28 },
    { month: "Aug", revenue: 7100, clients: 32 },
    { month: "Sep", revenue: 6800, clients: 30 },
    { month: "Oct", revenue: 8500, clients: 38 },
    { month: "Nov", revenue: 9200, clients: 42 },
    { month: "Dec", revenue: 10500, clients: 48 },
  ];

  const productBreakdown = [
    { name: "Hosting", sales: 45, revenue: 4500 },
    { name: "Cloud VPS", sales: 22, revenue: 3300 },
    { name: "Domains", sales: 67, revenue: 1340 },
    { name: "Email", sales: 34, revenue: 680 },
  ];

  // Reseller metrics
  const resellerMetrics = {
    totalRevenue: 10500,
    totalClients: 48,
    activeServices: 168,
    commissionEarned: 2625,
    pendingPayouts: 850,
    conversionRate: 32.5,
  };

  const recentClients = [
    { name: "TechStart Inc.", services: 5, revenue: 299, status: "active", joinDate: "2 days ago" },
    { name: "Green Farms Co.", services: 3, revenue: 149, status: "active", joinDate: "5 days ago" },
    { name: "Urban Design Studio", services: 7, revenue: 449, status: "active", joinDate: "1 week ago" },
    { name: "Alpha Consulting", services: 2, revenue: 79, status: "pending", joinDate: "1 week ago" },
  ];

  const topProducts = [
    { name: "Pro Hosting", sold: 28, revenue: 2240, commission: 448 },
    { name: "Cloud VPS - 2GB", sold: 15, revenue: 1195, commission: 239 },
    { name: ".com Domain", sold: 45, revenue: 540, commission: 108 },
    { name: "Business Email", sold: 22, revenue: 660, commission: 132 },
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(value);
  };

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Reseller Dashboard</h1>
          <p className="text-sm md:text-base text-muted-foreground">Manage your white-label hosting business</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Add Client
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <Card className="bg-gradient-to-br from-primary/20 to-primary/5 border-primary/20">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded-lg bg-primary/20">
                <DollarSign className="h-5 w-5 text-primary" />
              </div>
              <div className="flex items-center gap-1 text-green-500 text-sm font-medium">
                <ArrowUpRight className="h-4 w-4" />
                +24.5%
              </div>
            </div>
            <p className="text-2xl md:text-3xl font-bold text-primary">{formatCurrency(resellerMetrics.totalRevenue)}</p>
            <p className="text-xs md:text-sm text-muted-foreground mt-1">Total Revenue (This Month)</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-accent/20 to-accent/5 border-accent/20">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded-lg bg-accent/20">
                <Users className="h-5 w-5 text-accent" />
              </div>
              <div className="flex items-center gap-1 text-green-500 text-sm font-medium">
                <ArrowUpRight className="h-4 w-4" />
                +6
              </div>
            </div>
            <p className="text-2xl md:text-3xl font-bold text-accent">{resellerMetrics.totalClients}</p>
            <p className="text-xs md:text-sm text-muted-foreground mt-1">Active Clients</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/20 to-green-500/5 border-green-500/20">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded-lg bg-green-500/20">
                <TrendingUp className="h-5 w-5 text-green-500" />
              </div>
              <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20 text-xs">
                25%
              </Badge>
            </div>
            <p className="text-2xl md:text-3xl font-bold text-green-500">{formatCurrency(resellerMetrics.commissionEarned)}</p>
            <p className="text-xs md:text-sm text-muted-foreground mt-1">Commission Earned</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500/20 to-blue-500/5 border-blue-500/20">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded-lg bg-blue-500/20">
                <Package className="h-5 w-5 text-blue-500" />
              </div>
              <Badge variant="outline" className="text-xs">Active</Badge>
            </div>
            <p className="text-2xl md:text-3xl font-bold text-blue-500">{resellerMetrics.activeServices}</p>
            <p className="text-xs md:text-sm text-muted-foreground mt-1">Active Services</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6 md:gap-8">
        {/* Revenue Trend */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg md:text-xl flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Revenue Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="resellerRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" className="text-xs fill-muted-foreground" />
                  <YAxis className="text-xs fill-muted-foreground" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                    labelStyle={{ color: 'hsl(var(--foreground))' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    fill="url(#resellerRevenue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Client Growth */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg md:text-xl flex items-center gap-2">
              <Users className="h-5 w-5 text-accent" />
              Client Growth
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" className="text-xs fill-muted-foreground" />
                  <YAxis className="text-xs fill-muted-foreground" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                    labelStyle={{ color: 'hsl(var(--foreground))' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="clients"
                    stroke="hsl(var(--accent))"
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--accent))' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Product Breakdown */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg md:text-xl">Product Sales Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={productBreakdown}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="name" className="text-xs fill-muted-foreground" />
                <YAxis className="text-xs fill-muted-foreground" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Bar dataKey="sales" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Recent Clients & Top Products */}
      <div className="grid lg:grid-cols-2 gap-6 md:gap-8">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg md:text-xl">Recent Clients</CardTitle>
              <Link to="/reseller/clients">
                <Button variant="ghost" size="sm">View All</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentClients.map((client, i) => (
              <div key={i} className="flex items-center justify-between p-3 border rounded-lg bg-background/50">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Building className="h-4 w-4 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm truncate">{client.name}</p>
                    <p className="text-xs text-muted-foreground">{client.services} services • {client.joinDate}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-sm font-semibold text-green-500">{formatCurrency(client.revenue)}/mo</span>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${
                      client.status === "active" 
                        ? "bg-green-500/10 text-green-500 border-green-500/20" 
                        : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                    }`}
                  >
                    {client.status}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg md:text-xl">Top Products</CardTitle>
              <Link to="/reseller/products">
                <Button variant="ghost" size="sm">View All</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {topProducts.map((product, i) => (
              <div key={i} className="flex items-center justify-between p-3 border rounded-lg bg-background/50">
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-sm">{product.name}</p>
                  <p className="text-xs text-muted-foreground">{product.sold} sold</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-sm font-semibold">{formatCurrency(product.revenue)}</span>
                  <span className="text-xs text-green-500">+{formatCurrency(product.commission)} commission</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="cursor-pointer hover:border-primary/50 transition-colors">
          <CardContent className="p-4 text-center">
            <div className="p-3 rounded-lg bg-primary/10 w-fit mx-auto mb-3">
              <Plus className="h-6 w-6 text-primary" />
            </div>
            <p className="font-medium text-sm">Add Client</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:border-primary/50 transition-colors">
          <CardContent className="p-4 text-center">
            <div className="p-3 rounded-lg bg-accent/10 w-fit mx-auto mb-3">
              <Settings className="h-6 w-6 text-accent" />
            </div>
            <p className="font-medium text-sm">White-Label</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:border-primary/50 transition-colors">
          <CardContent className="p-4 text-center">
            <div className="p-3 rounded-lg bg-green-500/10 w-fit mx-auto mb-3">
              <FileText className="h-6 w-6 text-green-500" />
            </div>
            <p className="font-medium text-sm">Reports</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:border-primary/50 transition-colors">
          <CardContent className="p-4 text-center">
            <div className="p-3 rounded-lg bg-blue-500/10 w-fit mx-auto mb-3">
              <DollarSign className="h-6 w-6 text-blue-500" />
            </div>
            <p className="font-medium text-sm">Payouts</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResellerDashboard;
