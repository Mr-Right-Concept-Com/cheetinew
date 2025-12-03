import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, DollarSign, MoreVertical, Download, CheckCircle, XCircle, TrendingUp, TrendingDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

const BillingManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const transactions = [
    { id: "INV-001", user: "john@example.com", amount: 49.99, plan: "Pro", status: "paid", date: "2024-10-15" },
    { id: "INV-002", user: "sarah@example.com", amount: 149.99, plan: "Business", status: "paid", date: "2024-10-18" },
    { id: "INV-003", user: "mike@example.com", amount: 19.99, plan: "Starter", status: "failed", date: "2024-10-20" },
    { id: "INV-004", user: "emma@example.com", amount: 49.99, plan: "Pro", status: "paid", date: "2024-10-22" },
    { id: "INV-005", user: "david@example.com", amount: 299.99, plan: "Enterprise", status: "pending", date: "2024-10-25" },
  ];

  const revenueData = [
    { month: "Jan", revenue: 12400, subscriptions: 85 },
    { month: "Feb", revenue: 14200, subscriptions: 92 },
    { month: "Mar", revenue: 16800, subscriptions: 108 },
    { month: "Apr", revenue: 15600, subscriptions: 102 },
    { month: "May", revenue: 18900, subscriptions: 125 },
    { month: "Jun", revenue: 21200, subscriptions: 138 },
    { month: "Jul", revenue: 19800, subscriptions: 132 },
    { month: "Aug", revenue: 22400, subscriptions: 148 },
    { month: "Sep", revenue: 24100, subscriptions: 156 },
    { month: "Oct", revenue: 24567, subscriptions: 162 },
  ];

  const planDistribution = [
    { name: "Starter", users: 420, revenue: 8380 },
    { name: "Pro", users: 380, revenue: 18962 },
    { name: "Business", users: 210, revenue: 31479 },
    { name: "Enterprise", users: 45, revenue: 13496 },
  ];

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2 break-words">Billing Management</h1>
          <p className="text-sm md:text-base text-muted-foreground break-words">Monitor payments and transactions</p>
        </div>
        <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
          <Download className="mr-2 h-4 w-4 flex-shrink-0" />
          <span className="truncate">Export Report</span>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="h-5 w-5 text-primary flex-shrink-0" />
              <TrendingUp className="h-4 w-4 text-green-500" />
            </div>
            <p className="text-2xl md:text-3xl font-bold truncate">$24,567</p>
            <p className="text-xs md:text-sm text-muted-foreground truncate">Total Revenue</p>
            <Badge variant="outline" className="mt-2 bg-green-500/10 text-green-500 border-green-500/20 text-xs whitespace-nowrap">
              +18% vs last month
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="h-5 w-5 text-accent flex-shrink-0" />
              <TrendingUp className="h-4 w-4 text-green-500" />
            </div>
            <p className="text-2xl md:text-3xl font-bold truncate">$8,234</p>
            <p className="text-xs md:text-sm text-muted-foreground truncate">This Month</p>
            <Badge variant="outline" className="mt-2 bg-primary/10 text-primary border-primary/20 text-xs whitespace-nowrap">
              142 transactions
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between mb-2">
              <XCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
              <TrendingDown className="h-4 w-4 text-green-500" />
            </div>
            <p className="text-2xl md:text-3xl font-bold truncate">$892</p>
            <p className="text-xs md:text-sm text-muted-foreground truncate">Failed Payments</p>
            <Badge variant="outline" className="mt-2 bg-red-500/10 text-red-500 border-red-500/20 text-xs whitespace-nowrap">
              12 failures
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="h-5 w-5 text-yellow-500 flex-shrink-0" />
            </div>
            <p className="text-2xl md:text-3xl font-bold truncate">$1,245</p>
            <p className="text-xs md:text-sm text-muted-foreground truncate">Pending</p>
            <Badge variant="outline" className="mt-2 bg-yellow-500/10 text-yellow-500 border-yellow-500/20 text-xs whitespace-nowrap">
              5 pending
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl truncate">Revenue Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(value) => `$${value / 1000}k`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                    formatter={(value: number) => [`$${value.toLocaleString()}`, "Revenue"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="hsl(var(--primary))"
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl truncate">Plan Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={planDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="users" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle className="text-lg md:text-xl truncate">Recent Transactions</CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground flex-shrink-0" />
              <Input
                placeholder="Search transactions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <div className="inline-block min-w-full align-middle">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="whitespace-nowrap">Invoice ID</TableHead>
                    <TableHead className="whitespace-nowrap">User</TableHead>
                    <TableHead className="whitespace-nowrap">Amount</TableHead>
                    <TableHead className="whitespace-nowrap">Plan</TableHead>
                    <TableHead className="whitespace-nowrap">Status</TableHead>
                    <TableHead className="whitespace-nowrap">Date</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-medium">
                        <div className="truncate max-w-[100px] md:max-w-none">{transaction.id}</div>
                      </TableCell>
                      <TableCell>
                        <div className="truncate max-w-[150px] md:max-w-none">{transaction.user}</div>
                      </TableCell>
                      <TableCell className="font-semibold whitespace-nowrap">
                        ${transaction.amount}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="whitespace-nowrap">{transaction.plan}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {transaction.status === "paid" && <CheckCircle className="h-4 w-4 text-green-500" />}
                          {transaction.status === "failed" && <XCircle className="h-4 w-4 text-red-500" />}
                          {transaction.status === "pending" && <DollarSign className="h-4 w-4 text-yellow-500" />}
                          <Badge 
                            variant="outline" 
                            className={`whitespace-nowrap ${
                              transaction.status === "paid" 
                                ? "bg-green-500/10 text-green-500 border-green-500/20" 
                                : transaction.status === "failed"
                                ? "bg-red-500/10 text-red-500 border-red-500/20"
                                : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                            }`}
                          >
                            {transaction.status}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">{transaction.date}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-popover">
                            <DropdownMenuItem>
                              <Download className="mr-2 h-4 w-4" />
                              Download Invoice
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <DollarSign className="mr-2 h-4 w-4" />
                              Process Refund
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Monthly Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg md:text-xl truncate">Monthly Revenue by Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {planDistribution.map((plan, i) => (
              <div key={i} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-sm">{plan.name}</span>
                  <Badge variant="outline" className="text-xs">
                    {plan.users} users
                  </Badge>
                </div>
                <p className="text-2xl font-bold text-primary">${plan.revenue.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Monthly revenue</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BillingManagement;
