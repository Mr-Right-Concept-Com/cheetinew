import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Mail, Shield, Database, Users, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const EmailManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const emailAccounts = [
    { id: 1, email: "admin@cheetihost.com", domain: "cheetihost.com", storage: "45GB / 100GB", status: "active" },
    { id: 2, email: "support@example.com", domain: "example.com", storage: "12GB / 50GB", status: "active" },
    { id: 3, email: "info@mystore.com", domain: "mystore.com", storage: "89GB / 100GB", status: "warning" },
    { id: 4, email: "contact@blog.tech", domain: "blog.tech", storage: "5GB / 25GB", status: "active" },
  ];

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2 break-words">Email Management</h1>
          <p className="text-sm md:text-base text-muted-foreground break-words">
            Manage business email accounts and settings
          </p>
        </div>
        <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
          <Mail className="mr-2 h-4 w-4 flex-shrink-0" />
          <span className="truncate">Create Email</span>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <Card>
          <CardContent className="p-4 md:p-6">
            <p className="text-xs md:text-sm text-muted-foreground mb-1 truncate">Total Accounts</p>
            <p className="text-2xl md:text-3xl font-bold truncate">248</p>
            <Badge variant="outline" className="mt-2 bg-primary/10 text-primary border-primary/20 text-xs whitespace-nowrap">
              +12 this month
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 md:p-6">
            <p className="text-xs md:text-sm text-muted-foreground mb-1 truncate">Storage Used</p>
            <p className="text-2xl md:text-3xl font-bold truncate">2.4TB</p>
            <Badge variant="outline" className="mt-2 bg-accent/10 text-accent border-accent/20 text-xs whitespace-nowrap">
              of 5TB
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 md:p-6">
            <p className="text-xs md:text-sm text-muted-foreground mb-1 truncate">Spam Blocked</p>
            <p className="text-2xl md:text-3xl font-bold truncate">15.2K</p>
            <Badge variant="outline" className="mt-2 bg-green-500/10 text-green-500 border-green-500/20 text-xs whitespace-nowrap">
              Today
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 md:p-6">
            <p className="text-xs md:text-sm text-muted-foreground mb-1 truncate">Migrations</p>
            <p className="text-2xl md:text-3xl font-bold truncate">34</p>
            <Badge variant="outline" className="mt-2 bg-primary/10 text-primary border-primary/20 text-xs whitespace-nowrap">
              In Progress
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Email Accounts Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle className="text-lg md:text-xl truncate">Email Accounts</CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground flex-shrink-0" />
              <Input
                placeholder="Search emails..."
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
                    <TableHead className="whitespace-nowrap">Email Address</TableHead>
                    <TableHead className="whitespace-nowrap">Domain</TableHead>
                    <TableHead className="whitespace-nowrap">Storage</TableHead>
                    <TableHead className="whitespace-nowrap">Status</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {emailAccounts.map((account) => (
                    <TableRow key={account.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                          <span className="truncate max-w-[150px] md:max-w-none">{account.email}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="truncate max-w-[120px] md:max-w-none">{account.domain}</div>
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-sm">{account.storage}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`whitespace-nowrap ${
                            account.status === "active"
                              ? "bg-green-500/10 text-green-500 border-green-500/20"
                              : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                          }`}
                        >
                          {account.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-popover">
                            <DropdownMenuItem>
                              <Shield className="mr-2 h-4 w-4" />
                              Security Settings
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Database className="mr-2 h-4 w-4" />
                              Manage Storage
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Users className="mr-2 h-4 w-4" />
                              View Activity
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

      {/* Migration Queue */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg md:text-xl truncate flex items-center gap-2">
            Active Migrations
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-xs whitespace-nowrap">
              34 In Progress
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { from: "Gmail", to: "support@cheetihost.com", progress: 75 },
              { from: "Outlook", to: "admin@example.com", progress: 45 },
              { from: "Yahoo Mail", to: "info@mystore.com", progress: 90 },
            ].map((migration, i) => (
              <div key={i} className="flex items-center justify-between p-3 md:p-4 border rounded-lg gap-2">
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-sm md:text-base truncate">{migration.to}</p>
                  <p className="text-xs md:text-sm text-muted-foreground">From: {migration.from}</p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="text-right">
                    <p className="text-sm font-medium">{migration.progress}%</p>
                    <div className="w-20 h-2 bg-muted rounded-full mt-1">
                      <div
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${migration.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailManagement;
