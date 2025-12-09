import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DollarSign, TrendingUp, CreditCard, FileText, Download, ArrowUpRight, ArrowDownRight, Calendar, Filter } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";

const revenueData = [
  { month: "Jan", revenue: 4250, expenses: 2125, profit: 2125 },
  { month: "Feb", revenue: 5100, expenses: 2550, profit: 2550 },
  { month: "Mar", revenue: 4800, expenses: 2400, profit: 2400 },
  { month: "Apr", revenue: 6200, expenses: 3100, profit: 3100 },
  { month: "May", revenue: 7100, expenses: 3550, profit: 3550 },
  { month: "Jun", revenue: 8500, expenses: 4250, profit: 4250 },
];

const invoices = [
  { id: "INV-2024-001", client: "Acme Corp", amount: 299.95, status: "paid", date: "2024-06-01", dueDate: "2024-06-15" },
  { id: "INV-2024-002", client: "TechStart Inc", amount: 49.98, status: "paid", date: "2024-06-02", dueDate: "2024-06-16" },
  { id: "INV-2024-003", client: "Global Media", amount: 899.88, status: "pending", date: "2024-06-05", dueDate: "2024-06-19" },
  { id: "INV-2024-004", client: "Design Studio", amount: 199.96, status: "pending", date: "2024-06-08", dueDate: "2024-06-22" },
  { id: "INV-2024-005", client: "Local Shop", amount: 24.99, status: "overdue", date: "2024-05-15", dueDate: "2024-05-29" },
];

const transactions = [
  { id: "TXN-001", type: "payment", description: "Payment from Acme Corp", amount: 299.95, date: "2024-06-01" },
  { id: "TXN-002", type: "payout", description: "Payout to your account", amount: -500.00, date: "2024-06-02" },
  { id: "TXN-003", type: "payment", description: "Payment from TechStart Inc", amount: 49.98, date: "2024-06-03" },
  { id: "TXN-004", type: "fee", description: "Platform fee - June", amount: -85.00, date: "2024-06-05" },
  { id: "TXN-005", type: "payment", description: "Payment from Design Studio", amount: 199.96, date: "2024-06-08" },
];

const revenueBreakdown = [
  { name: "Hosting", value: 4250, color: "hsl(var(--primary))" },
  { name: "Domains", value: 1850, color: "hsl(var(--chart-2))" },
  { name: "Email", value: 1200, color: "hsl(var(--chart-3))" },
  { name: "Cloud", value: 1200, color: "hsl(var(--chart-4))" },
];

const ResellerBilling = () => {
  const [dateRange, setDateRange] = useState("30days");
  const totalRevenue = revenueData.reduce((sum, d) => sum + d.revenue, 0);
  const totalProfit = revenueData.reduce((sum, d) => sum + d.profit, 0);
  const pendingAmount = invoices.filter(i => i.status === "pending").reduce((sum, i) => sum + i.amount, 0);
  const overdueAmount = invoices.filter(i => i.status === "overdue").reduce((sum, i) => sum + i.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Billing</h1>
          <p className="text-muted-foreground">Manage invoices, transactions, and revenue</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-40">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
              <SelectItem value="year">This year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">${totalRevenue.toLocaleString()}</p>
                <div className="flex items-center text-green-500 text-sm mt-1">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  <span>+18.2% from last period</span>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-primary/10">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Net Profit</p>
                <p className="text-2xl font-bold">${totalProfit.toLocaleString()}</p>
                <div className="flex items-center text-green-500 text-sm mt-1">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  <span>50% margin</span>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-green-500/10">
                <TrendingUp className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">${pendingAmount.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground mt-1">{invoices.filter(i => i.status === "pending").length} invoices</p>
              </div>
              <div className="p-3 rounded-lg bg-amber-500/10">
                <FileText className="h-6 w-6 text-amber-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Overdue</p>
                <p className="text-2xl font-bold text-destructive">${overdueAmount.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground mt-1">{invoices.filter(i => i.status === "overdue").length} invoices</p>
              </div>
              <div className="p-3 rounded-lg bg-destructive/10">
                <CreditCard className="h-6 w-6 text-destructive" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Revenue & Profit</CardTitle>
            <CardDescription>Monthly revenue and profit trends</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }} />
                <Bar dataKey="revenue" fill="hsl(var(--primary))" name="Revenue" radius={[4, 4, 0, 0]} />
                <Bar dataKey="profit" fill="hsl(var(--chart-2))" name="Profit" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Revenue Breakdown</CardTitle>
            <CardDescription>By service category</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={revenueBreakdown} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {revenueBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-4">
              {revenueBreakdown.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span>{item.name}</span>
                  </div>
                  <span className="font-medium">${item.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for Invoices and Transactions */}
      <Tabs defaultValue="invoices" className="space-y-4">
        <TabsList>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
        </TabsList>
        <TabsContent value="invoices">
          <Card>
            <CardHeader>
              <CardTitle>Recent Invoices</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">{invoice.id}</TableCell>
                      <TableCell>{invoice.client}</TableCell>
                      <TableCell>${invoice.amount.toFixed(2)}</TableCell>
                      <TableCell>{invoice.date}</TableCell>
                      <TableCell>{invoice.dueDate}</TableCell>
                      <TableCell>
                        <Badge variant={invoice.status === "paid" ? "default" : invoice.status === "pending" ? "secondary" : "destructive"}>
                          {invoice.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">View</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Transaction</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((txn) => (
                    <TableRow key={txn.id}>
                      <TableCell className="font-medium">{txn.id}</TableCell>
                      <TableCell>{txn.description}</TableCell>
                      <TableCell className={txn.amount < 0 ? "text-destructive" : "text-green-500"}>
                        {txn.amount < 0 ? "-" : "+"}${Math.abs(txn.amount).toFixed(2)}
                      </TableCell>
                      <TableCell>{txn.date}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ResellerBilling;