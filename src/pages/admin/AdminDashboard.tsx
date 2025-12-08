import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Users,
  Server,
  DollarSign,
  AlertTriangle,
  TrendingUp,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  Repeat,
  LineChart as LineChartIcon,
  PieChart as PieChartIcon,
  BarChart3,
  Globe,
  RefreshCw,
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
  PieChart,
  Pie,
  Cell,
} from "recharts";

const AdminDashboard = () => {
  // Investor Metrics
  const investorMetrics = {
    mrr: { value: 24500, change: 12.5, target: 30000 },
    arr: { value: 294000, change: 12.5 },
    ltv: { value: 1250, change: 8.3 },
    cac: { value: 85, change: -5.2 },
    ltvCacRatio: 14.7,
    churnRate: 2.1,
    netRevenueRetention: 115,
    paybackPeriod: 3.2,
  };

  // MRR Trend Data
  const mrrTrendData = [
    { month: "Jan", mrr: 15200, users: 890 },
    { month: "Feb", mrr: 16800, users: 945 },
    { month: "Mar", mrr: 17500, users: 987 },
    { month: "Apr", mrr: 19200, users: 1023 },
    { month: "May", mrr: 20100, users: 1078 },
    { month: "Jun", mrr: 21500, users: 1112 },
    { month: "Jul", mrr: 22300, users: 1156 },
    { month: "Aug", mrr: 23100, users: 1189 },
    { month: "Sep", mrr: 23800, users: 1212 },
    { month: "Oct", mrr: 24100, users: 1234 },
    { month: "Nov", mrr: 24500, users: 1247 },
    { month: "Dec", mrr: 25800, users: 1285 },
  ];

  // Revenue by Service (for pie chart)
  const revenueByService = [
    { name: "Hosting", value: 12400, color: "hsl(var(--primary))" },
    { name: "Cloud VPS", value: 7350, color: "hsl(var(--accent))" },
    { name: "Domains", value: 2940, color: "hsl(210, 100%, 50%)" },
    { name: "Email", value: 1225, color: "hsl(142, 76%, 36%)" },
    { name: "Add-ons", value: 585, color: "hsl(280, 70%, 50%)" },
  ];

  const revenueBreakdown = [
    { name: "Hosting", value: 12400, percentage: 50.6, color: "bg-primary" },
    { name: "Cloud VPS", value: 7350, percentage: 30.0, color: "bg-accent" },
    { name: "Domains", value: 2940, percentage: 12.0, color: "bg-blue-500" },
    { name: "Email", value: 1225, percentage: 5.0, color: "bg-green-500" },
    { name: "Add-ons", value: 585, percentage: 2.4, color: "bg-purple-500" },
  ];

  const growthMetrics = [
    { label: "New Signups (This Month)", value: 347, change: 23.5 },
    { label: "Converted to Paid", value: 89, change: 18.2 },
    { label: "Conversion Rate", value: "25.6%", change: 4.1 },
    { label: "Active Subscriptions", value: 1247, change: 8.7 },
  ];

  const userActivity = [
    { user: "john@example.com", action: "Upgraded to Pro Plan", time: "2 min ago", type: "success", revenue: "+$29.99" },
    { user: "sarah@example.com", action: "Registered 3 domains", time: "15 min ago", type: "success", revenue: "+$38.97" },
    { user: "mike@example.com", action: "Payment failed", time: "32 min ago", type: "error", revenue: "-$49.99" },
    { user: "emma@example.com", action: "Deployed Cloud VPS", time: "1 hour ago", type: "success", revenue: "+$79.99" },
    { user: "alex@example.com", action: "Cancelled subscription", time: "2 hours ago", type: "warning", revenue: "-$29.99" },
  ];

  const systemAlerts = [
    { title: "High CPU usage on Server-03", severity: "high", time: "5 min ago", impact: "12 users affected" },
    { title: "Backup failed for VPS-147", severity: "medium", time: "1 hour ago", impact: "1 user affected" },
    { title: "SSL renewal needed for 5 domains", severity: "low", time: "3 hours ago", impact: "5 domains" },
    { title: "Low disk space on Server-12", severity: "high", time: "4 hours ago", impact: "8 users affected" },
  ];

  const serverStatus = [
    { name: "US-East-01", status: "online", cpu: 45, ram: 62, region: "New York", users: 312 },
    { name: "EU-West-01", status: "online", cpu: 38, ram: 54, region: "London", users: 287 },
    { name: "Asia-SE-01", status: "warning", cpu: 87, ram: 78, region: "Singapore", users: 198 },
    { name: "US-West-01", status: "online", cpu: 52, ram: 48, region: "San Francisco", users: 256 },
    { name: "Africa-01", status: "online", cpu: 23, ram: 31, region: "Lagos", users: 124 },
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(value);
  };

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-sm md:text-base text-muted-foreground">Real-time business intelligence and system metrics</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <Button size="sm" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Investor Metrics - MRR, ARR, LTV */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <Card className="bg-gradient-to-br from-primary/20 to-primary/5 border-primary/20">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded-lg bg-primary/20">
                <DollarSign className="h-5 w-5 text-primary" />
              </div>
              <div className="flex items-center gap-1 text-green-500 text-sm font-medium">
                <ArrowUpRight className="h-4 w-4" />
                +{investorMetrics.mrr.change}%
              </div>
            </div>
            <p className="text-2xl md:text-3xl font-bold text-primary">{formatCurrency(investorMetrics.mrr.value)}</p>
            <p className="text-xs md:text-sm text-muted-foreground mt-1">Monthly Recurring Revenue</p>
            <div className="mt-3">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-muted-foreground">Target: {formatCurrency(investorMetrics.mrr.target)}</span>
                <span className="font-medium">{Math.round((investorMetrics.mrr.value / investorMetrics.mrr.target) * 100)}%</span>
              </div>
              <Progress value={(investorMetrics.mrr.value / investorMetrics.mrr.target) * 100} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-accent/20 to-accent/5 border-accent/20">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded-lg bg-accent/20">
                <TrendingUp className="h-5 w-5 text-accent" />
              </div>
              <div className="flex items-center gap-1 text-green-500 text-sm font-medium">
                <ArrowUpRight className="h-4 w-4" />
                +{investorMetrics.arr.change}%
              </div>
            </div>
            <p className="text-2xl md:text-3xl font-bold text-accent">{formatCurrency(investorMetrics.arr.value)}</p>
            <p className="text-xs md:text-sm text-muted-foreground mt-1">Annual Recurring Revenue</p>
            <p className="text-xs text-muted-foreground mt-3">Projected from current MRR</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/20 to-green-500/5 border-green-500/20">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded-lg bg-green-500/20">
                <Target className="h-5 w-5 text-green-500" />
              </div>
              <div className="flex items-center gap-1 text-green-500 text-sm font-medium">
                <ArrowUpRight className="h-4 w-4" />
                +{investorMetrics.ltv.change}%
              </div>
            </div>
            <p className="text-2xl md:text-3xl font-bold text-green-500">{formatCurrency(investorMetrics.ltv.value)}</p>
            <p className="text-xs md:text-sm text-muted-foreground mt-1">Customer Lifetime Value</p>
            <p className="text-xs text-muted-foreground mt-3">LTV:CAC Ratio: <span className="font-semibold text-green-500">{investorMetrics.ltvCacRatio}x</span></p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500/20 to-blue-500/5 border-blue-500/20">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded-lg bg-blue-500/20">
                <Repeat className="h-5 w-5 text-blue-500" />
              </div>
              <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20 text-xs">
                Healthy
              </Badge>
            </div>
            <p className="text-2xl md:text-3xl font-bold text-blue-500">{investorMetrics.netRevenueRetention}%</p>
            <p className="text-xs md:text-sm text-muted-foreground mt-1">Net Revenue Retention</p>
            <p className="text-xs text-muted-foreground mt-3">Churn Rate: <span className="font-semibold">{investorMetrics.churnRate}%</span></p>
          </CardContent>
        </Card>
      </div>

      {/* MRR Trend Chart & User Growth */}
      <div className="grid lg:grid-cols-2 gap-6 md:gap-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg md:text-xl flex items-center gap-2">
              <LineChartIcon className="h-5 w-5 text-primary" />
              MRR Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mrrTrendData}>
                  <defs>
                    <linearGradient id="mrrGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" className="text-xs fill-muted-foreground" />
                  <YAxis className="text-xs fill-muted-foreground" tickFormatter={(v) => `$${v/1000}k`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                    labelStyle={{ color: 'hsl(var(--foreground))' }}
                    formatter={(value: number) => [`$${value.toLocaleString()}`, 'MRR']}
                  />
                  <Area
                    type="monotone"
                    dataKey="mrr"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    fill="url(#mrrGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg md:text-xl flex items-center gap-2">
              <Users className="h-5 w-5 text-accent" />
              User Growth
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mrrTrendData}>
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
                    dataKey="users"
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

      {/* Revenue Breakdown Chart & Growth Metrics */}
      <div className="grid lg:grid-cols-2 gap-6 md:gap-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg md:text-xl flex items-center gap-2">
              <PieChartIcon className="h-5 w-5 text-accent" />
              Revenue by Service
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={revenueByService}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {revenueByService.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                    formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg md:text-xl flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Growth Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {growthMetrics.map((metric, i) => (
              <div key={i} className="flex items-center justify-between p-3 md:p-4 border rounded-lg bg-background/50">
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-muted-foreground truncate">{metric.label}</p>
                  <p className="text-xl md:text-2xl font-bold">{metric.value}</p>
                </div>
                <div className={`flex items-center gap-1 text-sm font-medium ${metric.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {metric.change >= 0 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                  {metric.change >= 0 ? '+' : ''}{metric.change}%
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Revenue Breakdown List */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg md:text-xl flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-accent" />
            Revenue Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {revenueBreakdown.map((item, i) => (
            <div key={i} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${item.color}`} />
                  <span className="font-medium">{item.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-muted-foreground">{item.percentage}%</span>
                  <span className="font-semibold">{formatCurrency(item.value)}</span>
                </div>
              </div>
              <Progress value={item.percentage} className="h-2" />
            </div>
          ))}
          <div className="pt-3 border-t flex justify-between items-center">
            <span className="font-semibold">Total MRR</span>
            <span className="text-xl font-bold text-primary">{formatCurrency(investorMetrics.mrr.value)}</span>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Users className="h-5 w-5 text-primary" />
              <TrendingUp className="h-4 w-4 text-green-500" />
            </div>
            <p className="text-xl font-bold">1,247</p>
            <p className="text-xs text-muted-foreground">Total Users</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Server className="h-5 w-5 text-accent" />
              <Activity className="h-4 w-4 text-green-500" />
            </div>
            <p className="text-xl font-bold">487</p>
            <p className="text-xs text-muted-foreground">Active Hosts</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Globe className="h-5 w-5 text-blue-500" />
              <Badge variant="outline" className="text-xs">Active</Badge>
            </div>
            <p className="text-xl font-bold">1,893</p>
            <p className="text-xs text-muted-foreground">Domains</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <Badge variant="destructive" className="text-xs">3</Badge>
            </div>
            <p className="text-xl font-bold">Alerts</p>
            <p className="text-xs text-muted-foreground">Requires Action</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Activity className="h-5 w-5 text-green-500" />
              <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20 text-xs">99.9%</Badge>
            </div>
            <p className="text-xl font-bold">Uptime</p>
            <p className="text-xs text-muted-foreground">30-day average</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="h-5 w-5 text-primary" />
              <Badge variant="outline" className="text-xs">{investorMetrics.cac.change}%</Badge>
            </div>
            <p className="text-xl font-bold">${investorMetrics.cac.value}</p>
            <p className="text-xs text-muted-foreground">CAC</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & Alerts */}
      <div className="grid lg:grid-cols-2 gap-6 md:gap-8">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg md:text-xl">Recent Activity</CardTitle>
              <Link to="/admin/users">
                <Button variant="ghost" size="sm">View All</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {userActivity.map((activity, i) => (
              <div key={i} className="flex items-center justify-between p-3 border rounded-lg bg-background/50 gap-2">
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-sm truncate">{activity.user}</p>
                  <p className="text-xs text-muted-foreground truncate">{activity.action}</p>
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <span className={`text-xs font-semibold ${
                    activity.revenue.startsWith('+') ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {activity.revenue}
                  </span>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${
                      activity.type === "success" 
                        ? "bg-green-500/10 text-green-500 border-green-500/20" 
                        : activity.type === "error"
                        ? "bg-red-500/10 text-red-500 border-red-500/20"
                        : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                    }`}
                  >
                    {activity.time}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg md:text-xl flex items-center gap-2">
                System Alerts
                <Badge variant="destructive" className="text-xs">3 New</Badge>
              </CardTitle>
              <Link to="/admin/security">
                <Button variant="ghost" size="sm">Manage</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {systemAlerts.map((alert, i) => (
              <div key={i} className="flex items-start justify-between p-3 border rounded-lg bg-background/50 gap-2">
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  <AlertTriangle className={`h-5 w-5 flex-shrink-0 mt-0.5 ${
                    alert.severity === "high" ? "text-destructive" : 
                    alert.severity === "medium" ? "text-yellow-500" : "text-muted-foreground"
                  }`} />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm">{alert.title}</p>
                    <p className="text-xs text-muted-foreground">{alert.impact}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${
                      alert.severity === "high" ? "bg-red-500/10 text-red-500 border-red-500/20" :
                      alert.severity === "medium" ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" :
                      "bg-blue-500/10 text-blue-500 border-blue-500/20"
                    }`}
                  >
                    {alert.severity}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{alert.time}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Server Status */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg md:text-xl">Global Infrastructure</CardTitle>
            <Link to="/admin/hosting">
              <Button variant="outline" size="sm">Manage Servers</Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {serverStatus.map((server, i) => (
              <div key={i} className="p-4 border rounded-lg space-y-3 bg-background/50">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-sm truncate flex-1">{server.name}</p>
                  <Badge 
                    variant="outline" 
                    className={`text-xs flex-shrink-0 ${
                      server.status === "online" 
                        ? "bg-green-500/10 text-green-500 border-green-500/20" 
                        : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                    }`}
                  >
                    {server.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Globe className="h-3 w-3" />
                  {server.region}
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">CPU</span>
                    <span className={`font-medium ${server.cpu > 80 ? 'text-red-500' : ''}`}>{server.cpu}%</span>
                  </div>
                  <Progress value={server.cpu} className={`h-1.5 ${server.cpu > 80 ? '[&>div]:bg-red-500' : ''}`} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">RAM</span>
                    <span className={`font-medium ${server.ram > 80 ? 'text-red-500' : ''}`}>{server.ram}%</span>
                  </div>
                  <Progress value={server.ram} className={`h-1.5 ${server.ram > 80 ? '[&>div]:bg-red-500' : ''}`} />
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground pt-1 border-t">
                  <Users className="h-3 w-3" />
                  {server.users} active users
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;