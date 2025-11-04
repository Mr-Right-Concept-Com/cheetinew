import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, DollarSign, MoreVertical, Download, CheckCircle, XCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const BillingManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const transactions = [
    { id: "INV-001", user: "john@example.com", amount: 49.99, plan: "Pro", status: "paid", date: "2024-10-15" },
    { id: "INV-002", user: "sarah@example.com", amount: 149.99, plan: "Business", status: "paid", date: "2024-10-18" },
    { id: "INV-003", user: "mike@example.com", amount: 19.99, plan: "Starter", status: "failed", date: "2024-10-20" },
    { id: "INV-004", user: "emma@example.com", amount: 49.99, plan: "Pro", status: "paid", date: "2024-10-22" },
    { id: "INV-005", user: "david@example.com", amount: 299.99, plan: "Enterprise", status: "pending", date: "2024-10-25" },
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
            <p className="text-xs md:text-sm text-muted-foreground mb-1 truncate">Total Revenue</p>
            <p className="text-2xl md:text-3xl font-bold truncate">$24,567</p>
            <Badge variant="outline" className="mt-2 bg-green-500/10 text-green-500 border-green-500/20 text-xs whitespace-nowrap">
              +18% vs last month
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 md:p-6">
            <p className="text-xs md:text-sm text-muted-foreground mb-1 truncate">This Month</p>
            <p className="text-2xl md:text-3xl font-bold truncate">$8,234</p>
            <Badge variant="outline" className="mt-2 bg-primary/10 text-primary border-primary/20 text-xs whitespace-nowrap">
              142 transactions
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 md:p-6">
            <p className="text-xs md:text-sm text-muted-foreground mb-1 truncate">Failed Payments</p>
            <p className="text-2xl md:text-3xl font-bold truncate">$892</p>
            <Badge variant="outline" className="mt-2 bg-red-500/10 text-red-500 border-red-500/20 text-xs whitespace-nowrap">
              12 failures
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 md:p-6">
            <p className="text-xs md:text-sm text-muted-foreground mb-1 truncate">Pending</p>
            <p className="text-2xl md:text-3xl font-bold truncate">$1,245</p>
            <Badge variant="outline" className="mt-2 bg-yellow-500/10 text-yellow-500 border-yellow-500/20 text-xs whitespace-nowrap">
              5 pending
            </Badge>
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

      {/* Revenue Chart Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg md:text-xl truncate">Revenue Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center border-2 border-dashed rounded-lg">
            <p className="text-muted-foreground text-sm md:text-base">Revenue chart will be displayed here</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BillingManagement;
