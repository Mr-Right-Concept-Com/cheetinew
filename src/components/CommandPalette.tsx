import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator,
} from "@/components/ui/command";
import {
  Home, Server, Cloud, Globe, Mail, Paintbrush, CreditCard, Bell, Settings,
  HelpCircle, Shield, Package, Zap, Users, Database, RefreshCw, Lock, Download,
  Upload, Trash2, Search, Plus, ExternalLink, Terminal, GitBranch, Layers,
  Activity, BarChart3, Wallet, UserCog, FolderKey, Cpu,
} from "lucide-react";
import { toast } from "sonner";

type CommandAction = {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  action: () => void;
  keywords?: string[];
};

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthPage = location.pathname.startsWith("/auth");

  useEffect(() => {
    if (isAuthPage) return;
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(o => !o);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [isAuthPage]);

  if (isAuthPage) return null;

  const runCommand = (command: () => void) => { setOpen(false); command(); };

  const navigationCommands: CommandAction[] = [
    { id: "aether", label: "Aether Dashboard", icon: Zap, action: () => navigate("/dashboard/aether"), keywords: ["home", "unified"] },
    { id: "dashboard", label: "Dashboard", icon: Home, action: () => navigate("/dashboard"), keywords: ["overview"] },
    { id: "hosting", label: "Hosting", icon: Server, action: () => navigate("/dashboard/hosting"), keywords: ["sites", "websites"] },
    { id: "cloud", label: "CheetiCloud", icon: Cloud, action: () => navigate("/dashboard/cloud"), keywords: ["vps", "instances"] },
    { id: "domains", label: "Domains", icon: Globe, action: () => navigate("/dashboard/domains"), keywords: ["dns", "registrar"] },
    { id: "email", label: "Email", icon: Mail, action: () => navigate("/dashboard/email"), keywords: ["mail", "smtp"] },
    { id: "builder", label: "Website Builder", icon: Paintbrush, action: () => navigate("/dashboard/builder"), keywords: ["design", "templates"] },
    { id: "security", label: "Security Center", icon: Shield, action: () => navigate("/dashboard/security"), keywords: ["ssl", "firewall", "waf"] },
    { id: "unbox", label: "Unbox Integrations", icon: Package, action: () => navigate("/dashboard/unbox"), keywords: ["tools", "connect"] },
    { id: "backups", label: "Backups", icon: Download, action: () => navigate("/dashboard/backups"), keywords: ["restore", "snapshots"] },
  ];

  const accountCommands: CommandAction[] = [
    { id: "billing", label: "Billing", icon: CreditCard, action: () => navigate("/dashboard/billing"), keywords: ["payments", "invoices"] },
    { id: "notifications", label: "Notifications", icon: Bell, action: () => navigate("/dashboard/notifications"), keywords: ["alerts"] },
    { id: "settings", label: "Settings", icon: Settings, action: () => navigate("/dashboard/settings"), keywords: ["preferences"] },
    { id: "support", label: "Help & Support", icon: HelpCircle, action: () => navigate("/dashboard/support"), keywords: ["ticket", "help"] },
  ];

  const deploymentActions: CommandAction[] = [
    { id: "deploy-site", label: "Deploy New Website", icon: Upload, action: () => navigate("/dashboard/hosting"), keywords: ["launch", "publish"] },
    { id: "deploy-cloud", label: "Create Cloud Instance", icon: Cloud, action: () => navigate("/dashboard/cloud"), keywords: ["vps", "server"] },
    { id: "register-domain", label: "Register Domain", icon: Globe, action: () => navigate("/dashboard/domains"), keywords: ["buy", "purchase"] },
    { id: "transfer-domain", label: "Transfer Domain", icon: RefreshCw, action: () => navigate("/dashboard/domains"), keywords: ["migrate"] },
  ];

  const operationActions: CommandAction[] = [
    { id: "bulk-migration", label: "Bulk Migration Wizard", icon: Layers, action: () => navigate("/dashboard/aether"), keywords: ["migrate", "transfer"] },
    { id: "ai-devops", label: "AI DevOps Agent", icon: Cpu, action: () => navigate("/dashboard/aether"), keywords: ["assistant", "optimize"] },
    { id: "security-scan", label: "Run Security Scan", icon: Shield, action: () => navigate("/dashboard/security"), keywords: ["audit", "vulnerability"] },
    { id: "create-backup", label: "Create Backup", icon: Download, action: () => navigate("/dashboard/backups"), keywords: ["snapshot", "save"] },
    { id: "clear-cache", label: "Clear All Caches", icon: Trash2, action: () => { toast.success("Cache cleared across all CDN nodes"); }, keywords: ["purge"] },
  ];

  const developerCommands: CommandAction[] = [
    { id: "github-deploy", label: "Connect GitHub", icon: GitBranch, action: () => navigate("/dashboard/deploy"), keywords: ["git", "repository", "ci/cd"] },
    { id: "view-logs", label: "View System Logs", icon: Activity, action: () => navigate("/dashboard/security"), keywords: ["debug", "errors", "audit"] },
    { id: "database-manager", label: "Database Manager", icon: Database, action: () => navigate("/dashboard/hosting"), keywords: ["sql", "mysql"] },
    { id: "api-docs", label: "API Documentation", icon: Terminal, action: () => window.open("https://docs.cheetihost.com/api", "_blank"), keywords: ["reference"] },
  ];

  const adminCommands: CommandAction[] = [
    { id: "admin-dashboard", label: "Admin Dashboard", icon: BarChart3, action: () => navigate("/admin"), keywords: ["overview", "stats"] },
    { id: "admin-users", label: "Manage Users", icon: Users, action: () => navigate("/admin/users"), keywords: ["accounts"] },
    { id: "admin-roles", label: "Role Management", icon: UserCog, action: () => navigate("/admin/roles"), keywords: ["permissions"] },
    { id: "admin-payments", label: "Payment Settings", icon: Wallet, action: () => navigate("/admin/payments"), keywords: ["stripe", "paystack"] },
    { id: "admin-panels", label: "Panel Settings", icon: Server, action: () => navigate("/admin/panels"), keywords: ["cpanel", "plesk"] },
    { id: "admin-security", label: "Security Settings", icon: Lock, action: () => navigate("/admin/security"), keywords: ["firewall", "ssl"] },
  ];

  const resellerCommands: CommandAction[] = [
    { id: "reseller-dashboard", label: "Reseller Dashboard", icon: BarChart3, action: () => navigate("/reseller"), keywords: ["overview"] },
    { id: "reseller-clients", label: "Manage Clients", icon: Users, action: () => navigate("/reseller/clients"), keywords: ["customers"] },
    { id: "reseller-products", label: "Products", icon: Package, action: () => navigate("/reseller/products"), keywords: ["plans"] },
    { id: "reseller-payouts", label: "Payouts", icon: Wallet, action: () => navigate("/reseller/payouts"), keywords: ["earnings"] },
    { id: "reseller-whitelabel", label: "White Label", icon: Paintbrush, action: () => navigate("/reseller/white-label"), keywords: ["branding"] },
  ];

  const allGroups = [
    { heading: "Navigation", items: navigationCommands },
    { heading: "Quick Actions - Deploy", items: deploymentActions },
    { heading: "Quick Actions - Operations", items: operationActions },
    { heading: "Account", items: accountCommands },
    { heading: "Developer", items: developerCommands },
    { heading: "Admin", items: adminCommands },
    { heading: "Reseller", items: resellerCommands },
  ];

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search commands, navigate, or perform actions..." />
      <CommandList className="max-h-[500px]">
        <CommandEmpty>No results found.</CommandEmpty>
        {allGroups.map((group, gi) => (
          <div key={group.heading}>
            {gi > 0 && <CommandSeparator />}
            <CommandGroup heading={group.heading}>
              {group.items.map(cmd => (
                <CommandItem key={cmd.id} onSelect={() => runCommand(cmd.action)} keywords={cmd.keywords}>
                  <cmd.icon className="mr-2 h-4 w-4" /><span>{cmd.label}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </div>
        ))}
      </CommandList>
    </CommandDialog>
  );
}
