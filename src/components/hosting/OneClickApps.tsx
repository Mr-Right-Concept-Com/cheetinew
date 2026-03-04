import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const apps = [
  { name: "WordPress", icon: "📝", category: "CMS", description: "Most popular CMS platform", version: "6.4" },
  { name: "Laravel", icon: "🔴", category: "Framework", description: "PHP web application framework", version: "11.x" },
  { name: "Node.js", icon: "🟢", category: "Runtime", description: "JavaScript server runtime", version: "20 LTS" },
  { name: "Ghost", icon: "👻", category: "CMS", description: "Professional publishing platform", version: "5.x" },
  { name: "Joomla", icon: "🟠", category: "CMS", description: "Flexible content management", version: "5.0" },
  { name: "Drupal", icon: "💧", category: "CMS", description: "Enterprise content platform", version: "10.x" },
  { name: "PrestaShop", icon: "🛒", category: "E-Commerce", description: "Open-source e-commerce", version: "8.x" },
  { name: "Magento", icon: "🧡", category: "E-Commerce", description: "Enterprise e-commerce", version: "2.4" },
  { name: "phpMyAdmin", icon: "🗃️", category: "Database", description: "MySQL administration tool", version: "5.2" },
  { name: "Redis", icon: "🔴", category: "Cache", description: "In-memory data store", version: "7.x" },
  { name: "Python", icon: "🐍", category: "Runtime", description: "Python web applications", version: "3.12" },
  { name: "Next.js", icon: "▲", category: "Framework", description: "React framework for production", version: "14.x" },
];

interface OneClickAppsProps {
  hostingId: string;
  hostingName: string;
}

export const OneClickApps = ({ hostingId, hostingName }: OneClickAppsProps) => {
  const handleInstall = (appName: string) => {
    toast.success(`Installing ${appName} on ${hostingName}...`, {
      description: "This may take a few minutes. You'll be notified when complete.",
    });
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {apps.map((app) => (
        <Card key={app.name} className="hover:border-primary/50 transition-all">
          <CardContent className="p-4">
            <div className="flex items-start gap-3 mb-3">
              <div className="text-3xl">{app.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold truncate">{app.name}</h4>
                  <Badge variant="outline" className="text-[10px] shrink-0">{app.version}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">{app.description}</p>
                <Badge variant="secondary" className="text-[10px] mt-1">{app.category}</Badge>
              </div>
            </div>
            <Button size="sm" className="w-full" onClick={() => handleInstall(app.name)}>
              Install
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
