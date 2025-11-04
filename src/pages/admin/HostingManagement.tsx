import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Server, MoreVertical, Power, RefreshCw, AlertCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const HostingManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const hostings = [
    { id: 1, domain: "example.com", user: "john@example.com", plan: "Pro", status: "active", uptime: "99.9%", created: "2024-01-10" },
    { id: 2, domain: "mystore.com", user: "sarah@example.com", plan: "Business", status: "active", uptime: "100%", created: "2024-02-15" },
    { id: 3, domain: "blog.tech", user: "mike@example.com", plan: "Starter", status: "suspended", uptime: "0%", created: "2024-03-08" },
    { id: 4, domain: "portfolio.dev", user: "emma@example.com", plan: "Pro", status: "active", uptime: "99.8%", created: "2024-03-20" },
    { id: 5, domain: "enterprise.io", user: "david@example.com", plan: "Enterprise", status: "active", uptime: "100%", created: "2024-04-01" },
  ];

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2 break-words">Hosting Management</h1>
          <p className="text-sm md:text-base text-muted-foreground break-words">Monitor and manage all hosting accounts</p>
        </div>
        <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
          <Server className="mr-2 h-4 w-4 flex-shrink-0" />
          <span className="truncate">Add Hosting</span>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <Card>
          <CardContent className="p-4 md:p-6">
            <p className="text-xs md:text-sm text-muted-foreground mb-1 truncate">Total Hosting</p>
            <p className="text-2xl md:text-3xl font-bold truncate">487</p>
            <Badge variant="outline" className="mt-2 bg-green-500/10 text-green-500 border-green-500/20 text-xs whitespace-nowrap">
              +8% this month
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 md:p-6">
            <p className="text-xs md:text-sm text-muted-foreground mb-1 truncate">Active Sites</p>
            <p className="text-2xl md:text-3xl font-bold truncate">472</p>
            <Badge variant="outline" className="mt-2 bg-green-500/10 text-green-500 border-green-500/20 text-xs whitespace-nowrap">
              97% uptime
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 md:p-6">
            <p className="text-xs md:text-sm text-muted-foreground mb-1 truncate">Suspended</p>
            <p className="text-2xl md:text-3xl font-bold truncate">8</p>
            <Badge variant="outline" className="mt-2 bg-red-500/10 text-red-500 border-red-500/20 text-xs whitespace-nowrap">
              Requires action
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 md:p-6">
            <p className="text-xs md:text-sm text-muted-foreground mb-1 truncate">Avg Response</p>
            <p className="text-2xl md:text-3xl font-bold truncate">124ms</p>
            <Badge variant="outline" className="mt-2 bg-primary/10 text-primary border-primary/20 text-xs whitespace-nowrap">
              Excellent
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Hosting Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle className="text-lg md:text-xl truncate">All Hosting Accounts</CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground flex-shrink-0" />
              <Input
                placeholder="Search hosting..."
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
                    <TableHead className="whitespace-nowrap">User</TableHead>
                    <TableHead className="whitespace-nowrap">Plan</TableHead>
                    <TableHead className="whitespace-nowrap">Status</TableHead>
                    <TableHead className="whitespace-nowrap">Uptime</TableHead>
                    <TableHead className="whitespace-nowrap">Created</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {hostings.map((hosting) => (
                    <TableRow key={hosting.id}>
                      <TableCell className="font-medium">
                        <div className="truncate max-w-[150px] md:max-w-none">{hosting.domain}</div>
                      </TableCell>
                      <TableCell>
                        <div className="truncate max-w-[150px] md:max-w-none">{hosting.user}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="whitespace-nowrap">{hosting.plan}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={`whitespace-nowrap ${
                            hosting.status === "active" 
                              ? "bg-green-500/10 text-green-500 border-green-500/20" 
                              : "bg-red-500/10 text-red-500 border-red-500/20"
                          }`}
                        >
                          {hosting.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className={`font-medium ${
                          parseFloat(hosting.uptime) > 99 ? "text-green-500" : "text-red-500"
                        }`}>
                          {hosting.uptime}
                        </span>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">{hosting.created}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-popover">
                            <DropdownMenuItem>
                              <Server className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <RefreshCw className="mr-2 h-4 w-4" />
                              Restart Server
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              <Power className="mr-2 h-4 w-4" />
                              Suspend
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

      {/* Server Health */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg md:text-xl truncate">Server Health Monitor</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: "Web-Server-01", load: "45%", health: "good", sites: 124 },
              { name: "Web-Server-02", load: "62%", health: "good", sites: 98 },
              { name: "Web-Server-03", load: "89%", health: "warning", sites: 156 },
              { name: "Web-Server-04", load: "34%", health: "good", sites: 87 },
              { name: "Web-Server-05", load: "71%", health: "good", sites: 112 },
              { name: "Web-Server-06", load: "56%", health: "good", sites: 95 },
            ].map((server, i) => (
              <div key={i} className="p-3 md:p-4 border rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-sm md:text-base truncate flex-1">{server.name}</p>
                  <AlertCircle 
                    className={`h-4 w-4 flex-shrink-0 ${
                      server.health === "good" ? "text-green-500" : "text-yellow-500"
                    }`} 
                  />
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Load:</span>
                    <span className={`font-medium ${
                      parseInt(server.load) > 80 ? "text-yellow-500" : "text-green-500"
                    }`}>{server.load}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Active Sites:</span>
                    <span className="font-medium">{server.sites}</span>
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

export default HostingManagement;
