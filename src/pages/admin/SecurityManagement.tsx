import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Shield, AlertTriangle, CheckCircle, Lock, Eye, Ban } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const SecurityManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const threats = [
    { id: 1, type: "DDoS Attack", target: "cheetihost.com", severity: "high", status: "blocked", time: "2 hours ago" },
    { id: 2, type: "Brute Force", target: "user@example.com", severity: "medium", status: "blocked", time: "5 hours ago" },
    { id: 3, type: "SQL Injection", target: "api.cheetihost.com", severity: "high", status: "blocked", time: "1 day ago" },
  ];

  const sslCerts = [
    { id: 1, domain: "cheetihost.com", issuer: "Let's Encrypt", status: "active", expiry: "2025-12-15" },
    { id: 2, domain: "api.cheetihost.com", issuer: "Let's Encrypt", status: "active", expiry: "2025-11-20" },
    { id: 3, domain: "blog.cheetihost.com", issuer: "Let's Encrypt", status: "expiring", expiry: "2025-01-10" },
  ];

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2 break-words">Security Management</h1>
          <p className="text-sm md:text-base text-muted-foreground break-words">Monitor and manage platform security</p>
        </div>
        <Badge className="w-fit bg-green-500/10 text-green-500 border-green-500/20 text-xs whitespace-nowrap">
          <CheckCircle className="mr-1 h-3 w-3" />
          All Systems Secure
        </Badge>
      </div>

      {/* Security Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <Card>
          <CardContent className="p-4 md:p-6">
            <p className="text-xs md:text-sm text-muted-foreground mb-1 truncate">Threats Blocked</p>
            <p className="text-2xl md:text-3xl font-bold truncate">147</p>
            <Badge variant="outline" className="mt-2 bg-green-500/10 text-green-500 border-green-500/20 text-xs whitespace-nowrap">
              Today
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 md:p-6">
            <p className="text-xs md:text-sm text-muted-foreground mb-1 truncate">SSL Certificates</p>
            <p className="text-2xl md:text-3xl font-bold truncate">892</p>
            <Badge variant="outline" className="mt-2 bg-green-500/10 text-green-500 border-green-500/20 text-xs whitespace-nowrap">
              Active
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 md:p-6">
            <p className="text-xs md:text-sm text-muted-foreground mb-1 truncate">2FA Enabled</p>
            <p className="text-2xl md:text-3xl font-bold truncate">87%</p>
            <Badge variant="outline" className="mt-2 bg-primary/10 text-primary border-primary/20 text-xs whitespace-nowrap">
              Users
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 md:p-6">
            <p className="text-xs md:text-sm text-muted-foreground mb-1 truncate">Security Score</p>
            <p className="text-2xl md:text-3xl font-bold truncate">95/100</p>
            <Badge variant="outline" className="mt-2 bg-green-500/10 text-green-500 border-green-500/20 text-xs whitespace-nowrap">
              Excellent
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Security Tabs */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg md:text-xl truncate">Security Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="threats" className="w-full">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-3 h-auto gap-2">
              <TabsTrigger value="threats" className="text-xs md:text-sm whitespace-nowrap">Threats</TabsTrigger>
              <TabsTrigger value="ssl" className="text-xs md:text-sm whitespace-nowrap">SSL Certificates</TabsTrigger>
              <TabsTrigger value="monitoring" className="text-xs md:text-sm whitespace-nowrap">Monitoring</TabsTrigger>
            </TabsList>

            <TabsContent value="threats" className="mt-4">
              <div className="space-y-4">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <Input
                    placeholder="Search threats..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-full"
                  />
                </div>
                <div className="overflow-x-auto -mx-4 sm:mx-0">
                  <div className="inline-block min-w-full align-middle">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="whitespace-nowrap">Type</TableHead>
                          <TableHead className="whitespace-nowrap">Target</TableHead>
                          <TableHead className="whitespace-nowrap">Severity</TableHead>
                          <TableHead className="whitespace-nowrap">Status</TableHead>
                          <TableHead className="whitespace-nowrap">Time</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {threats.map((threat) => (
                          <TableRow key={threat.id}>
                            <TableCell className="font-medium">
                              <div className="truncate max-w-[150px] md:max-w-none">{threat.type}</div>
                            </TableCell>
                            <TableCell>
                              <div className="truncate max-w-[150px] md:max-w-none">{threat.target}</div>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className={`whitespace-nowrap ${
                                  threat.severity === "high"
                                    ? "bg-red-500/10 text-red-500 border-red-500/20"
                                    : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                                }`}
                              >
                                {threat.severity}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge className="whitespace-nowrap bg-green-500/10 text-green-500 border-green-500/20">
                                {threat.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                              {threat.time}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="ssl" className="mt-4">
              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <div className="inline-block min-w-full align-middle">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="whitespace-nowrap">Domain</TableHead>
                        <TableHead className="whitespace-nowrap">Issuer</TableHead>
                        <TableHead className="whitespace-nowrap">Status</TableHead>
                        <TableHead className="whitespace-nowrap">Expiry</TableHead>
                        <TableHead className="whitespace-nowrap">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sslCerts.map((cert) => (
                        <TableRow key={cert.id}>
                          <TableCell className="font-medium">
                            <div className="truncate max-w-[150px] md:max-w-none">{cert.domain}</div>
                          </TableCell>
                          <TableCell>
                            <div className="truncate max-w-[120px] md:max-w-none">{cert.issuer}</div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={`whitespace-nowrap ${
                                cert.status === "active"
                                  ? "bg-green-500/10 text-green-500 border-green-500/20"
                                  : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                              }`}
                            >
                              {cert.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="whitespace-nowrap">{cert.expiry}</TableCell>
                          <TableCell>
                            <Button size="sm" variant="outline" className="whitespace-nowrap">
                              Renew
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="monitoring" className="mt-4">
              <div className="space-y-4">
                {[
                  { icon: Eye, label: "Active Monitoring", status: "Online", color: "green" },
                  { icon: Shield, label: "DDoS Protection", status: "Active", color: "green" },
                  { icon: Lock, label: "Encryption", status: "Enabled", color: "green" },
                  { icon: Ban, label: "Firewall", status: "Active", color: "green" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 md:p-4 border rounded-lg">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <item.icon className={`h-5 w-5 text-${item.color}-500 flex-shrink-0`} />
                      <span className="font-medium text-sm md:text-base truncate">{item.label}</span>
                    </div>
                    <Badge
                      variant="outline"
                      className={`bg-${item.color}-500/10 text-${item.color}-500 border-${item.color}-500/20 text-xs whitespace-nowrap`}
                    >
                      {item.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecurityManagement;
