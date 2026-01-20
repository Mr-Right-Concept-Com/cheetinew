import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
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
  TicketIcon,
  Cloud,
  HardDrive,
} from "lucide-react";
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
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { 
  useAdminMetrics, 
  useRevenueByMonth, 
  useUserGrowth, 
  useRevenueByService,
  useRecentActivity,
  useServerStatus 
} from "@/hooks/useAdminMetrics";

const AdminDashboard = () => {
  const { data: metrics, isLoading: metricsLoading } = useAdminMetrics();
  const { data: revenueByMonth } = useRevenueByMonth(12);
  const { data: userGrowth } = useUserGrowth(30);
  const { data: revenueByService } = useRevenueByService();
  const { data: recentActivity } = useRecentActivity(10);
  const { data: serverStatus } = useServerStatus();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(value);
  };

  // Transform user growth data for chart
  const userGrowthChartData = userGrowth?.slice(-12).map(d => ({
    date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    users: d.users,
  })) || [];

  // Transform revenue data for chart
  const revenueChartData = revenueByMonth || [];

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
                +12.5%
              </div>
            </div>
            {metricsLoading ? (
              <Skeleton className="h-9 w-32" />
            ) : (
              <p className="text-2xl md:text-3xl font-bold text-primary">{formatCurrency(metrics?.mrr || 0)}</p>
            )}
            <p className="text-xs md:text-sm text-muted-foreground mt-1">Monthly Recurring Revenue</p>
            <div className="mt-3">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-muted-foreground">Target: $30,000</span>
                <span className="font-medium">{Math.round(((metrics?.mrr || 0) / 30000) * 100)}%</span>
              </div>
              <Progress value={((metrics?.mrr || 0) / 30000) * 100} className="h-2" />
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
                +12.5%
              </div>
            </div>
            {metricsLoading ? (
              <Skeleton className="h-9 w-32" />
            ) : (
              <p className="text-2xl md:text-3xl font-bold text-accent">{formatCurrency(metrics?.arr || 0)}</p>
            )}
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
                +8.3%
              </div>
            </div>
            {metricsLoading ? (
              <Skeleton className="h-9 w-24" />
            ) : (
              <p className="text-2xl md:text-3xl font-bold text-green-500">{(metrics?.ltvCacRatio || 0).toFixed(1)}x</p>
            )}
            <p className="text-xs md:text-sm text-muted-foreground mt-1">LTV:CAC Ratio</p>
            <p className="text-xs text-muted-foreground mt-3">Target: &gt;3.0x</p>
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
            {metricsLoading ? (
              <Skeleton className="h-9 w-20" />
            ) : (
              <p className="text-2xl md:text-3xl font-bold text-blue-500">{metrics?.netRevenueRetention || 0}%</p>
            )}
            <p className="text-xs md:text-sm text-muted-foreground mt-1">Net Revenue Retention</p>
            <p className="text-xs text-muted-foreground mt-3">Churn Rate: <span className="font-semibold">{metrics?.churnRate || 0}%</span></p>
          </CardContent>
        </Card>
      </div>

      {/* MRR Trend Chart & User Growth */}
      <div className="grid lg:grid-cols-2 gap-6 md:gap-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg md:text-xl flex items-center gap-2">
              <LineChartIcon className="h-5 w-5 text-primary" />
              Revenue Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueChartData}>
                  <defs>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
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
                    formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    fill="url(#revenueGradient)"
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
              User Growth (30 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={userGrowthChartData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="date" className="text-xs fill-muted-foreground" />
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

      {/* Revenue by Service & Quick Stats */}
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
                    data={revenueByService || []}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {(revenueByService || []).map((entry, index) => (
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
              Key Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 md:p-4 border rounded-lg bg-background/50">
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Users</p>
                  {metricsLoading ? (
                    <Skeleton className="h-7 w-16" />
                  ) : (
                    <p className="text-xl font-bold">{metrics?.totalUsers.toLocaleString() || 0}</p>
                  )}
                </div>
              </div>
              <Badge className="bg-green-500/10 text-green-500 border-none">
                +{metrics?.newUsersThisMonth || 0} this month
              </Badge>
            </div>

            <div className="flex items-center justify-between p-3 md:p-4 border rounded-lg bg-background/50">
              <div className="flex items-center gap-3">
                <Globe className="h-5 w-5 text-accent" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Domains</p>
                  {metricsLoading ? (
                    <Skeleton className="h-7 w-12" />
                  ) : (
                    <p className="text-xl font-bold">{metrics?.totalDomains || 0}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 md:p-4 border rounded-lg bg-background/50">
              <div className="flex items-center gap-3">
                <HardDrive className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Hosting Accounts</p>
                  {metricsLoading ? (
                    <Skeleton className="h-7 w-12" />
                  ) : (
                    <p className="text-xl font-bold">{metrics?.totalHosting || 0}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 md:p-4 border rounded-lg bg-background/50">
              <div className="flex items-center gap-3">
                <Cloud className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Cloud Instances</p>
                  {metricsLoading ? (
                    <Skeleton className="h-7 w-12" />
                  ) : (
                    <p className="text-xl font-bold">{metrics?.totalCloudInstances || 0}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 md:p-4 border rounded-lg bg-background/50">
              <div className="flex items-center gap-3">
                <TicketIcon className="h-5 w-5 text-yellow-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Open Tickets</p>
                  {metricsLoading ? (
                    <Skeleton className="h-7 w-12" />
                  ) : (
                    <p className="text-xl font-bold">{metrics?.openTickets || 0}</p>
                  )}
                </div>
              </div>
              <span className="text-xs text-muted-foreground">
                Avg response: {metrics?.ticketResponseTime || 0}h
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Server Status & Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-6 md:gap-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg md:text-xl flex items-center gap-2">
              <Server className="h-5 w-5 text-primary" />
              Server Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">CPU Usage</span>
                  <span className="font-medium">{Math.round(serverStatus?.cpuUsage || 0)}%</span>
                </div>
                <Progress value={serverStatus?.cpuUsage || 0} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Memory Usage</span>
                  <span className="font-medium">{Math.round(serverStatus?.memoryUsage || 0)}%</span>
                </div>
                <Progress value={serverStatus?.memoryUsage || 0} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Disk Usage</span>
                  <span className="font-medium">{Math.round(serverStatus?.diskUsage || 0)}%</span>
                </div>
                <Progress value={serverStatus?.diskUsage || 0} className="h-2" />
              </div>
            </div>
            <div className="pt-3 border-t grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Network In</p>
                <p className="font-semibold">{(serverStatus?.networkIn || 0).toFixed(1)} GB/s</p>
              </div>
              <div>
                <p className="text-muted-foreground">Network Out</p>
                <p className="font-semibold">{(serverStatus?.networkOut || 0).toFixed(1)} GB/s</p>
              </div>
              <div>
                <p className="text-muted-foreground">Active Connections</p>
                <p className="font-semibold">{serverStatus?.activeConnections || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg md:text-xl flex items-center gap-2">
              <Activity className="h-5 w-5 text-accent" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-[350px] overflow-y-auto">
              {recentActivity && recentActivity.length > 0 ? (
                recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 p-3 border rounded-lg bg-background/50">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">
                        {activity.resource_type && (
                          <span className="capitalize">{activity.resource_type} • </span>
                        )}
                        {new Date(activity.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No recent activity</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Users className="h-5 w-5 text-primary" />
              <TrendingUp className="h-4 w-4 text-green-500" />
            </div>
            {metricsLoading ? (
              <Skeleton className="h-7 w-16" />
            ) : (
              <p className="text-xl font-bold">{metrics?.totalUsers.toLocaleString() || 0}</p>
            )}
            <p className="text-xs text-muted-foreground">Total Users</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Activity className="h-5 w-5 text-accent" />
              <TrendingUp className="h-4 w-4 text-green-500" />
            </div>
            {metricsLoading ? (
              <Skeleton className="h-7 w-16" />
            ) : (
              <p className="text-xl font-bold">{metrics?.activeSubscriptions || 0}</p>
            )}
            <p className="text-xs text-muted-foreground">Active Subs</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Globe className="h-5 w-5 text-blue-500" />
            </div>
            {metricsLoading ? (
              <Skeleton className="h-7 w-12" />
            ) : (
              <p className="text-xl font-bold">{metrics?.totalDomains || 0}</p>
            )}
            <p className="text-xs text-muted-foreground">Domains</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <HardDrive className="h-5 w-5 text-green-500" />
            </div>
            {metricsLoading ? (
              <Skeleton className="h-7 w-12" />
            ) : (
              <p className="text-xl font-bold">{metrics?.totalHosting || 0}</p>
            )}
            <p className="text-xs text-muted-foreground">Hosting</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Cloud className="h-5 w-5 text-purple-500" />
            </div>
            {metricsLoading ? (
              <Skeleton className="h-7 w-12" />
            ) : (
              <p className="text-xl font-bold">{metrics?.totalCloudInstances || 0}</p>
            )}
            <p className="text-xs text-muted-foreground">Cloud VPS</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
            </div>
            {metricsLoading ? (
              <Skeleton className="h-7 w-12" />
            ) : (
              <p className="text-xl font-bold">{metrics?.openTickets || 0}</p>
            )}
            <p className="text-xs text-muted-foreground">Open Tickets</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
