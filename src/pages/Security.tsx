import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, Lock, Key, AlertTriangle, CheckCircle, Eye, FileText } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Security = () => {
  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2 break-words">Security Center</h1>
          <p className="text-sm md:text-base text-muted-foreground break-words">
            Protect your domains, products, accounts, and data
          </p>
        </div>
        <Badge className="w-fit bg-green-500/10 text-green-500 border-green-500/20 text-xs whitespace-nowrap">
          <CheckCircle className="mr-1 h-3 w-3" />
          All Systems Secure
        </Badge>
      </div>

      {/* Security Score */}
      <Card className="bg-gradient-speed">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg md:text-xl font-bold text-primary-foreground mb-2">
                Security Score
              </h3>
              <p className="text-2xl md:text-4xl font-bold text-primary-foreground">95/100</p>
              <p className="text-xs md:text-sm text-primary-foreground/80 mt-1">Excellent Protection</p>
            </div>
            <Button variant="secondary" size="sm" className="w-full sm:w-auto whitespace-nowrap">
              View Report
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Security Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between mb-2">
              <Shield className="h-5 w-5 text-green-500 flex-shrink-0" />
              <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20 text-xs">
                Active
              </Badge>
            </div>
            <p className="text-xl md:text-2xl font-bold truncate">12</p>
            <p className="text-xs md:text-sm text-muted-foreground truncate">SSL Certificates</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between mb-2">
              <Lock className="h-5 w-5 text-primary flex-shrink-0" />
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-xs">
                Enabled
              </Badge>
            </div>
            <p className="text-xl md:text-2xl font-bold truncate">8</p>
            <p className="text-xs md:text-sm text-muted-foreground truncate">2FA Protected</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between mb-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0" />
              <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20 text-xs">
                Low
              </Badge>
            </div>
            <p className="text-xl md:text-2xl font-bold truncate">2</p>
            <p className="text-xs md:text-sm text-muted-foreground truncate">Threats Blocked</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between mb-2">
              <Eye className="h-5 w-5 text-accent flex-shrink-0" />
              <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20 text-xs">
                Monitoring
              </Badge>
            </div>
            <p className="text-xl md:text-2xl font-bold truncate">24/7</p>
            <p className="text-xs md:text-sm text-muted-foreground truncate">Active Monitoring</p>
          </CardContent>
        </Card>
      </div>

      {/* Security Tabs */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg md:text-xl truncate">Security Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="ssl" className="w-full">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 h-auto gap-2">
              <TabsTrigger value="ssl" className="text-xs md:text-sm whitespace-nowrap">SSL Certificates</TabsTrigger>
              <TabsTrigger value="2fa" className="text-xs md:text-sm whitespace-nowrap">Two-Factor Auth</TabsTrigger>
              <TabsTrigger value="privacy" className="text-xs md:text-sm whitespace-nowrap">Domain Privacy</TabsTrigger>
              <TabsTrigger value="logs" className="text-xs md:text-sm whitespace-nowrap">Security Logs</TabsTrigger>
            </TabsList>

            <TabsContent value="ssl" className="space-y-4 mt-4">
              {[
                { domain: "cheetihost.com", status: "active", expiry: "2025-12-15" },
                { domain: "mywebsite.com", status: "active", expiry: "2025-10-20" },
                { domain: "blog.tech", status: "expiring", expiry: "2025-01-05" },
              ].map((cert, i) => (
                <div key={i} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 md:p-4 border rounded-lg gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-sm md:text-base truncate">{cert.domain}</p>
                    <p className="text-xs md:text-sm text-muted-foreground">Expires: {cert.expiry}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0 w-full sm:w-auto">
                    <Badge
                      variant="outline"
                      className={`text-xs whitespace-nowrap ${
                        cert.status === "active"
                          ? "bg-green-500/10 text-green-500 border-green-500/20"
                          : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                      }`}
                    >
                      {cert.status}
                    </Badge>
                    <Button size="sm" variant="outline" className="whitespace-nowrap">
                      Renew
                    </Button>
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="2fa" className="space-y-4 mt-4">
              <div className="p-4 md:p-6 border rounded-lg">
                <div className="flex items-start gap-3 mb-4">
                  <Lock className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm md:text-base mb-1">Two-Factor Authentication</h4>
                    <p className="text-xs md:text-sm text-muted-foreground break-words">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                </div>
                <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
                  Enable 2FA
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="privacy" className="space-y-4 mt-4">
              {[
                { domain: "cheetihost.com", protected: true },
                { domain: "mywebsite.com", protected: true },
                { domain: "blog.tech", protected: false },
              ].map((item, i) => (
                <div key={i} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 md:p-4 border rounded-lg gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-sm md:text-base truncate">{item.domain}</p>
                    <p className="text-xs md:text-sm text-muted-foreground">WHOIS Privacy Protection</p>
                  </div>
                  <Badge
                    variant="outline"
                    className={`text-xs whitespace-nowrap ${
                      item.protected
                        ? "bg-green-500/10 text-green-500 border-green-500/20"
                        : "bg-red-500/10 text-red-500 border-red-500/20"
                    }`}
                  >
                    {item.protected ? "Protected" : "Unprotected"}
                  </Badge>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="logs" className="space-y-4 mt-4">
              {[
                { action: "Login from new device", time: "2 hours ago", type: "info" },
                { action: "SSL certificate renewed", time: "1 day ago", type: "success" },
                { action: "Failed login attempt blocked", time: "3 days ago", type: "warning" },
              ].map((log, i) => (
                <div key={i} className="flex items-start gap-3 p-3 md:p-4 border rounded-lg">
                  <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-1" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm md:text-base break-words">{log.action}</p>
                    <p className="text-xs text-muted-foreground">{log.time}</p>
                  </div>
                </div>
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Security;
