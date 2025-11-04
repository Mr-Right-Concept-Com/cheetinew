import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Globe, MoreVertical, RefreshCw, Shield, AlertTriangle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const DomainsManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const domains = [
    { id: 1, domain: "example.com", user: "john@example.com", registrar: "Namecheap", status: "active", ssl: true, expiry: "2025-01-10" },
    { id: 2, domain: "mystore.com", user: "sarah@example.com", registrar: "GoDaddy", status: "active", ssl: true, expiry: "2025-03-15" },
    { id: 3, domain: "blog.tech", user: "mike@example.com", registrar: "Cloudflare", status: "expired", ssl: false, expiry: "2024-09-20" },
    { id: 4, domain: "portfolio.dev", user: "emma@example.com", registrar: "Namecheap", status: "active", ssl: true, expiry: "2024-12-25" },
    { id: 5, domain: "enterprise.io", user: "david@example.com", registrar: "GoDaddy", status: "active", ssl: true, expiry: "2025-06-30" },
  ];

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2 break-words">Domains Management</h1>
          <p className="text-sm md:text-base text-muted-foreground break-words">Manage domain registrations and renewals</p>
        </div>
        <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
          <Globe className="mr-2 h-4 w-4 flex-shrink-0" />
          <span className="truncate">Register Domain</span>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <Card>
          <CardContent className="p-4 md:p-6">
            <p className="text-xs md:text-sm text-muted-foreground mb-1 truncate">Total Domains</p>
            <p className="text-2xl md:text-3xl font-bold truncate">892</p>
            <Badge variant="outline" className="mt-2 bg-green-500/10 text-green-500 border-green-500/20 text-xs whitespace-nowrap">
              +15 this month
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 md:p-6">
            <p className="text-xs md:text-sm text-muted-foreground mb-1 truncate">Active</p>
            <p className="text-2xl md:text-3xl font-bold truncate">857</p>
            <Badge variant="outline" className="mt-2 bg-green-500/10 text-green-500 border-green-500/20 text-xs whitespace-nowrap">
              96% active
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 md:p-6">
            <p className="text-xs md:text-sm text-muted-foreground mb-1 truncate">Expiring Soon</p>
            <p className="text-2xl md:text-3xl font-bold truncate">23</p>
            <Badge variant="outline" className="mt-2 bg-yellow-500/10 text-yellow-500 border-yellow-500/20 text-xs whitespace-nowrap">
              Next 30 days
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 md:p-6">
            <p className="text-xs md:text-sm text-muted-foreground mb-1 truncate">SSL Enabled</p>
            <p className="text-2xl md:text-3xl font-bold truncate">847</p>
            <Badge variant="outline" className="mt-2 bg-green-500/10 text-green-500 border-green-500/20 text-xs whitespace-nowrap">
              99% secured
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Domains Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle className="text-lg md:text-xl truncate">All Domains</CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground flex-shrink-0" />
              <Input
                placeholder="Search domains..."
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
                    <TableHead className="whitespace-nowrap">Domain</TableHead>
                    <TableHead className="whitespace-nowrap">Owner</TableHead>
                    <TableHead className="whitespace-nowrap">Registrar</TableHead>
                    <TableHead className="whitespace-nowrap">Status</TableHead>
                    <TableHead className="whitespace-nowrap">SSL</TableHead>
                    <TableHead className="whitespace-nowrap">Expiry</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {domains.map((domain) => (
                    <TableRow key={domain.id}>
                      <TableCell className="font-medium">
                        <div className="truncate max-w-[150px] md:max-w-none">{domain.domain}</div>
                      </TableCell>
                      <TableCell>
                        <div className="truncate max-w-[150px] md:max-w-none">{domain.user}</div>
                      </TableCell>
                      <TableCell>
                        <div className="truncate max-w-[120px] md:max-w-none">{domain.registrar}</div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={`whitespace-nowrap ${
                            domain.status === "active" 
                              ? "bg-green-500/10 text-green-500 border-green-500/20" 
                              : "bg-red-500/10 text-red-500 border-red-500/20"
                          }`}
                        >
                          {domain.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {domain.ssl ? (
                          <Shield className="h-4 w-4 text-green-500" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                        )}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">{domain.expiry}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-popover">
                            <DropdownMenuItem>
                              <Globe className="mr-2 h-4 w-4" />
                              Manage DNS
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Shield className="mr-2 h-4 w-4" />
                              Renew SSL
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <RefreshCw className="mr-2 h-4 w-4" />
                              Renew Domain
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

      {/* Renewal Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg md:text-xl truncate flex items-center gap-2">
            Renewal Alerts
            <Badge variant="destructive" className="text-xs whitespace-nowrap">23 Expiring</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { domain: "urgentsite.com", owner: "client1@example.com", days: 5 },
              { domain: "importantapp.io", owner: "client2@example.com", days: 12 },
              { domain: "mybusiness.net", owner: "client3@example.com", days: 18 },
              { domain: "portfolio.dev", owner: "emma@example.com", days: 25 },
            ].map((alert, i) => (
              <div key={i} className="flex items-center justify-between p-3 md:p-4 border rounded-lg gap-2">
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-sm md:text-base truncate">{alert.domain}</p>
                  <p className="text-xs md:text-sm text-muted-foreground truncate">{alert.owner}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Badge 
                    variant="outline" 
                    className={`text-xs whitespace-nowrap ${
                      alert.days <= 7 
                        ? "bg-red-500/10 text-red-500 border-red-500/20" 
                        : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                    }`}
                  >
                    {alert.days} days
                  </Badge>
                  <Button size="sm" variant="outline" className="whitespace-nowrap">
                    <RefreshCw className="mr-1 h-3 w-3" />
                    Renew
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DomainsManagement;
