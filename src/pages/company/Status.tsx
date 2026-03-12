import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertTriangle, Clock } from "lucide-react";

const services = [
  { name: "Web Hosting", status: "operational", uptime: "99.99%" },
  { name: "Cloud VPS", status: "operational", uptime: "99.98%" },
  { name: "Domain Registration", status: "operational", uptime: "100%" },
  { name: "Email Services", status: "operational", uptime: "99.97%" },
  { name: "DNS & CDN", status: "operational", uptime: "99.99%" },
  { name: "SSL Certificates", status: "operational", uptime: "100%" },
  { name: "Website Builder", status: "operational", uptime: "99.95%" },
  { name: "API & Dashboard", status: "operational", uptime: "99.99%" },
  { name: "Backup Systems", status: "operational", uptime: "99.98%" },
  { name: "Support & Ticketing", status: "operational", uptime: "100%" },
];

const incidents = [
  { date: "Mar 8, 2026", title: "Scheduled maintenance on EU datacenter", status: "resolved", desc: "Completed within maintenance window. No downtime." },
  { date: "Feb 25, 2026", title: "Brief DNS propagation delay", status: "resolved", desc: "DNS changes were delayed by ~5 minutes. Root cause identified and fixed." },
];

const Status = () => (
  <div className="min-h-screen bg-background">
    <Navigation />
    <div className="container mx-auto px-4 pt-24 pb-16 max-w-4xl space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold">System <span className="text-primary">Status</span></h1>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20">
          <CheckCircle className="h-5 w-5 text-green-500" />
          <span className="font-medium text-green-500">All Systems Operational</span>
        </div>
      </div>

      <Card>
        <CardHeader><CardTitle>Services</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {services.map((s, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-lg border">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="font-medium text-sm">{s.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground">{s.uptime} uptime</span>
                <Badge className="bg-green-500/10 text-green-500 border-green-500/20 text-xs">Operational</Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Recent Incidents</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {incidents.map((inc, i) => (
            <div key={i} className="p-4 rounded-lg border space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-sm">{inc.title}</h4>
                <Badge variant="outline" className="text-xs">{inc.date}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">{inc.desc}</p>
              <Badge className="bg-green-500/10 text-green-500 border-green-500/20 text-xs">
                <CheckCircle className="mr-1 h-3 w-3" />Resolved
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  </div>
);

export default Status;
