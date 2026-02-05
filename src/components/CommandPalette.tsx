import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Home,
  Server,
  Cloud,
  Globe,
  Mail,
  Paintbrush,
  CreditCard,
  Bell,
  Settings,
  HelpCircle,
  Shield,
  Package,
  Zap,
  Users,
  Database,
  RefreshCw,
  Lock,
  Download,
  Upload,
  Trash2,
  Search,
  Plus,
  ExternalLink,
  Terminal,
  GitBranch,
  Layers,
  Activity,
  BarChart3,
  Wallet,
  UserCog,
  FolderKey,
  Cpu,
} from "lucide-react";
import { toast } from "sonner";

type CommandAction = {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  shortcut?: string;
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
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [isAuthPage]);

  // Don't render on auth pages to avoid context issues during transitions
  if (isAuthPage) {
    return null;
  }

  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
  };

  // Navigation commands
  const navigationCommands: CommandAction[] = [
    { id: "aether", label: "Aether Dashboard", icon: Zap, action: () => navigate("/dashboard/aether"), keywords: ["home", "main", "unified"] },
    { id: "dashboard", label: "Dashboard", icon: Home, action: () => navigate("/dashboard"), keywords: ["overview"] },
    { id: "hosting", label: "Hosting", icon: Server, action: () => navigate("/dashboard/hosting"), keywords: ["sites", "websites"] },
    { id: "cloud", label: "CheetiCloud", icon: Cloud, action: () => navigate("/dashboard/cloud"), keywords: ["vps", "instances"] },
    { id: "domains", label: "Domains", icon: Globe, action: () => navigate("/dashboard/domains"), keywords: ["dns", "registrar"] },
    { id: "email", label: "Email", icon: Mail, action: () => navigate("/dashboard/email"), keywords: ["mail", "smtp"] },
    { id: "builder", label: "Website Builder", icon: Paintbrush, action: () => navigate("/dashboard/builder"), keywords: ["design", "drag"] },
    { id: "security", label: "Security Center", icon: Shield, action: () => navigate("/dashboard/security"), keywords: ["ssl", "firewall"] },
    { id: "unbox", label: "Unbox Integrations", icon: Package, action: () => navigate("/dashboard/unbox"), keywords: ["tools", "connect"] },
    { id: "backups", label: "Backups", icon: Download, action: () => navigate("/dashboard/backups"), keywords: ["restore", "snapshots"] },
  ];

  // Account commands
  const accountCommands: CommandAction[] = [
    { id: "billing", label: "Billing", icon: CreditCard, action: () => navigate("/dashboard/billing"), keywords: ["payments", "invoices"] },
    { id: "notifications", label: "Notifications", icon: Bell, action: () => navigate("/dashboard/notifications"), keywords: ["alerts"] },
    { id: "settings", label: "Settings", icon: Settings, action: () => navigate("/dashboard/settings"), keywords: ["preferences"] },
    { id: "support", label: "Help & Support", icon: HelpCircle, action: () => navigate("/dashboard/support"), keywords: ["ticket", "help"] },
  ];

  // Quick actions - Deployments
  const deploymentActions: CommandAction[] = [
    { 
      id: "deploy-site", 
      label: "Deploy New Website", 
      icon: Upload, 
      action: () => {
        toast.info("Opening deployment wizard...");
        navigate("/dashboard/hosting");
      },
      keywords: ["launch", "publish", "create"] 
    },
    { 
      id: "deploy-cloud", 
      label: "Create Cloud Instance", 
      icon: Cloud, 
      action: () => {
        toast.info("Opening cloud provisioning...");
        navigate("/dashboard/cloud");
      },
      keywords: ["vps", "server", "vm"] 
    },
    { 
      id: "register-domain", 
      label: "Register Domain", 
      icon: Globe, 
      action: () => {
        toast.info("Opening domain registration...");
        navigate("/dashboard/domains");
      },
      keywords: ["buy", "purchase"] 
    },
    { 
      id: "transfer-domain", 
      label: "Transfer Domain", 
      icon: RefreshCw, 
      action: () => {
        toast.info("Opening domain transfer wizard...");
        navigate("/dashboard/domains");
      },
      keywords: ["migrate", "move"] 
    },
  ];

  // Quick actions - Operations
  const operationActions: CommandAction[] = [
    { 
      id: "bulk-migration", 
      label: "Bulk Migration Wizard", 
      icon: Layers, 
      action: () => {
        toast.info("Opening bulk migration wizard...");
        navigate("/dashboard/aether");
      },
      keywords: ["migrate", "transfer", "move", "panel"] 
    },
    { 
      id: "ai-devops", 
      label: "AI DevOps Agent", 
      icon: Cpu, 
      action: () => {
        toast.info("Opening AI DevOps agent...");
        navigate("/dashboard/aether");
      },
      keywords: ["assistant", "optimize", "predict"] 
    },
    { 
      id: "security-scan", 
      label: "Run Security Scan", 
      icon: Shield, 
      action: () => {
        toast.success("Security scan initiated across all panels");
      },
      keywords: ["audit", "check", "vulnerability"] 
    },
    { 
      id: "create-backup", 
      label: "Create Backup", 
      icon: Download, 
      action: () => {
        toast.success("Backup creation started");
      },
      keywords: ["snapshot", "save"] 
    },
    { 
      id: "clear-cache", 
      label: "Clear All Caches", 
      icon: Trash2, 
      action: () => {
        toast.success("Cache cleared across all CDN nodes");
      },
      keywords: ["purge", "refresh"] 
    },
  ];

  // Admin commands
  const adminCommands: CommandAction[] = [
    { id: "admin-dashboard", label: "Admin Dashboard", icon: BarChart3, action: () => navigate("/admin"), keywords: ["overview", "stats"] },
    { id: "admin-users", label: "Manage Users", icon: Users, action: () => navigate("/admin/users"), keywords: ["accounts"] },
    { id: "admin-roles", label: "Role Management", icon: UserCog, action: () => navigate("/admin/roles"), keywords: ["permissions"] },
    { id: "admin-payments", label: "Payment Settings", icon: Wallet, action: () => navigate("/admin/payments"), keywords: ["stripe", "paystack"] },
    { id: "admin-panels", label: "Panel Settings", icon: Server, action: () => navigate("/admin/panels"), keywords: ["cpanel", "plesk"] },
    { id: "admin-security", label: "Security Settings", icon: Lock, action: () => navigate("/admin/security"), keywords: ["firewall", "ssl"] },
  ];

  // Reseller commands
  const resellerCommands: CommandAction[] = [
    { id: "reseller-dashboard", label: "Reseller Dashboard", icon: BarChart3, action: () => navigate("/reseller"), keywords: ["overview"] },
    { id: "reseller-clients", label: "Manage Clients", icon: Users, action: () => navigate("/reseller/clients"), keywords: ["customers"] },
    { id: "reseller-products", label: "Products", icon: Package, action: () => navigate("/reseller/products"), keywords: ["plans"] },
    { id: "reseller-payouts", label: "Payouts", icon: Wallet, action: () => navigate("/reseller/payouts"), keywords: ["earnings"] },
    { id: "reseller-whitelabel", label: "White Label", icon: Paintbrush, action: () => navigate("/reseller/white-label"), keywords: ["branding"] },
  ];

  // Developer commands
  const developerCommands: CommandAction[] = [
    { 
      id: "api-docs", 
      label: "API Documentation", 
      icon: Terminal, 
      action: () => {
        window.open("https://docs.cheetihost.com/api", "_blank");
      },
      keywords: ["reference", "endpoints"] 
    },
    { 
      id: "github-deploy", 
      label: "Connect GitHub", 
      icon: GitBranch, 
      action: () => {
        toast.info("Opening GitHub integration...");
      },
      keywords: ["git", "repository", "ci/cd"] 
    },
    { 
      id: "view-logs", 
      label: "View System Logs", 
      icon: Activity, 
      action: () => {
        toast.info("Opening log viewer...");
      },
      keywords: ["debug", "errors"] 
    },
    { 
      id: "database-manager", 
      label: "Database Manager", 
      icon: Database, 
      action: () => {
        toast.info("Opening database manager...");
      },
      keywords: ["sql", "mysql", "postgres"] 
    },
  ];

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search commands, navigate, or perform actions..." />
      <CommandList className="max-h-[500px]">
        <CommandEmpty>No results found. Try a different search.</CommandEmpty>
        
        <CommandGroup heading="Navigation">
          {navigationCommands.map((cmd) => (
            <CommandItem key={cmd.id} onSelect={() => runCommand(cmd.action)} keywords={cmd.keywords}>
              <cmd.icon className="mr-2 h-4 w-4" />
              <span>{cmd.label}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Quick Actions - Deploy">
          {deploymentActions.map((cmd) => (
            <CommandItem key={cmd.id} onSelect={() => runCommand(cmd.action)} keywords={cmd.keywords}>
              <cmd.icon className="mr-2 h-4 w-4" />
              <span>{cmd.label}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Quick Actions - Operations">
          {operationActions.map((cmd) => (
            <CommandItem key={cmd.id} onSelect={() => runCommand(cmd.action)} keywords={cmd.keywords}>
              <cmd.icon className="mr-2 h-4 w-4" />
              <span>{cmd.label}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Account">
          {accountCommands.map((cmd) => (
            <CommandItem key={cmd.id} onSelect={() => runCommand(cmd.action)} keywords={cmd.keywords}>
              <cmd.icon className="mr-2 h-4 w-4" />
              <span>{cmd.label}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Developer">
          {developerCommands.map((cmd) => (
            <CommandItem key={cmd.id} onSelect={() => runCommand(cmd.action)} keywords={cmd.keywords}>
              <cmd.icon className="mr-2 h-4 w-4" />
              <span>{cmd.label}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Admin">
          {adminCommands.map((cmd) => (
            <CommandItem key={cmd.id} onSelect={() => runCommand(cmd.action)} keywords={cmd.keywords}>
              <cmd.icon className="mr-2 h-4 w-4" />
              <span>{cmd.label}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Reseller">
          {resellerCommands.map((cmd) => (
            <CommandItem key={cmd.id} onSelect={() => runCommand(cmd.action)} keywords={cmd.keywords}>
              <cmd.icon className="mr-2 h-4 w-4" />
              <span>{cmd.label}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
