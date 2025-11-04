import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Server, DollarSign, AlertTriangle, TrendingUp, Activity } from "lucide-react";

const AdminDashboard = () => {
  return (
    <div className="space-y-6 md:space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold mb-2 break-words">Admin Dashboard</h1>
        <p className="text-sm md:text-base text-muted-foreground break-words">System overview and key metrics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 md:gap-6">
        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between mb-2">
              <Users className="h-6 w-6 md:h-8 md:w-8 text-primary flex-shrink-0" />
              <TrendingUp className="h-4 w-4 text-green-500 flex-shrink-0" />
            </div>
            <p className="text-xl md:text-2xl font-bold truncate">1,247</p>
            <p className="text-xs md:text-sm text-muted-foreground truncate">Total Users</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between mb-2">
              <Server className="h-6 w-6 md:h-8 md:w-8 text-accent flex-shrink-0" />
              <Activity className="h-4 w-4 text-green-500 flex-shrink-0" />
            </div>
            <p className="text-xl md:text-2xl font-bold truncate">487</p>
            <p className="text-xs md:text-sm text-muted-foreground truncate">Active Hosts</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="h-6 w-6 md:h-8 md:w-8 text-primary flex-shrink-0" />
              <TrendingUp className="h-4 w-4 text-green-500 flex-shrink-0" />
            </div>
            <p className="text-xl md:text-2xl font-bold truncate">$24.5K</p>
            <p className="text-xs md:text-sm text-muted-foreground truncate">Monthly Revenue</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between mb-2">
              <AlertTriangle className="h-6 w-6 md:h-8 md:w-8 text-destructive flex-shrink-0" />
              <Badge variant="destructive" className="text-xs whitespace-nowrap">3</Badge>
            </div>
            <p className="text-xl md:text-2xl font-bold truncate">Alerts</p>
            <p className="text-xs md:text-sm text-muted-foreground truncate">Requires Action</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between mb-2">
              <Activity className="h-6 w-6 md:h-8 md:w-8 text-accent flex-shrink-0" />
              <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20 text-xs whitespace-nowrap">99.9%</Badge>
            </div>
            <p className="text-xl md:text-2xl font-bold truncate">Uptime</p>
            <p className="text-xs md:text-sm text-muted-foreground truncate">System Health</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between mb-2">
              <Server className="h-6 w-6 md:h-8 md:w-8 text-primary flex-shrink-0" />
              <Badge variant="outline" className="text-xs whitespace-nowrap">72%</Badge>
            </div>
            <p className="text-xl md:text-2xl font-bold truncate">Load</p>
            <p className="text-xs md:text-sm text-muted-foreground truncate">Server Capacity</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & Alerts */}
      <div className="grid lg:grid-cols-2 gap-6 md:gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl truncate">Recent User Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { user: "john@example.com", action: "Created new hosting", time: "2 min ago", type: "success" },
              { user: "sarah@example.com", action: "Domain registered", time: "15 min ago", type: "success" },
              { user: "mike@example.com", action: "Payment failed", time: "32 min ago", type: "error" },
              { user: "emma@example.com", action: "VPS deployed", time: "1 hour ago", type: "success" },
            ].map((activity, i) => (
              <div key={i} className="flex items-center justify-between p-3 md:p-4 border rounded-lg gap-2">
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-sm md:text-base truncate">{activity.user}</p>
                  <p className="text-xs md:text-sm text-muted-foreground truncate">{activity.action}</p>
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <Badge 
                    variant="outline" 
                    className={`text-xs whitespace-nowrap ${
                      activity.type === "success" 
                        ? "bg-green-500/10 text-green-500 border-green-500/20" 
                        : "bg-red-500/10 text-red-500 border-red-500/20"
                    }`}
                  >
                    {activity.type}
                  </Badge>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">{activity.time}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl truncate flex items-center gap-2">
              System Alerts
              <Badge variant="destructive" className="text-xs whitespace-nowrap">3 New</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { title: "High CPU usage on Server-03", severity: "high", time: "5 min ago" },
              { title: "Backup failed for VPS-147", severity: "medium", time: "1 hour ago" },
              { title: "SSL renewal needed for 5 domains", severity: "low", time: "3 hours ago" },
              { title: "Low disk space on Server-12", severity: "high", time: "4 hours ago" },
            ].map((alert, i) => (
              <div key={i} className="flex items-start justify-between p-3 md:p-4 border rounded-lg gap-2">
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  <AlertTriangle className={`h-4 w-4 md:h-5 md:w-5 flex-shrink-0 mt-0.5 ${
                    alert.severity === "high" ? "text-destructive" : 
                    alert.severity === "medium" ? "text-yellow-500" : "text-muted-foreground"
                  }`} />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-sm md:text-base break-words">{alert.title}</p>
                    <p className="text-xs text-muted-foreground whitespace-nowrap">{alert.time}</p>
                  </div>
                </div>
                <Badge 
                  variant="outline" 
                  className={`text-xs whitespace-nowrap flex-shrink-0 ${
                    alert.severity === "high" ? "bg-red-500/10 text-red-500 border-red-500/20" :
                    alert.severity === "medium" ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" :
                    "bg-blue-500/10 text-blue-500 border-blue-500/20"
                  }`}
                >
                  {alert.severity}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg md:text-xl truncate">Server Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: "Server-01", status: "online", cpu: "45%", ram: "62%", region: "US-East" },
              { name: "Server-02", status: "online", cpu: "38%", ram: "54%", region: "EU-West" },
              { name: "Server-03", status: "warning", cpu: "87%", ram: "78%", region: "Asia-Pacific" },
              { name: "Server-04", status: "online", cpu: "52%", ram: "48%", region: "US-West" },
            ].map((server, i) => (
              <div key={i} className="p-3 md:p-4 border rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-sm md:text-base truncate flex-1">{server.name}</p>
                  <Badge 
                    variant="outline" 
                    className={`text-xs whitespace-nowrap flex-shrink-0 ${
                      server.status === "online" 
                        ? "bg-green-500/10 text-green-500 border-green-500/20" 
                        : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                    }`}
                  >
                    {server.status}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground truncate">{server.region}</p>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">CPU:</span>
                    <span className="font-medium">{server.cpu}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">RAM:</span>
                    <span className="font-medium">{server.ram}</span>
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

export default AdminDashboard;
