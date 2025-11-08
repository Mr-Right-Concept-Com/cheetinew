import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
} from "lucide-react";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        
        <CommandGroup heading="Navigation">
          <CommandItem onSelect={() => runCommand(() => navigate("/dashboard"))}>
            <Home className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate("/dashboard/hosting"))}>
            <Server className="mr-2 h-4 w-4" />
            <span>Hosting</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate("/dashboard/cloud"))}>
            <Cloud className="mr-2 h-4 w-4" />
            <span>CheetiCloud</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate("/dashboard/domains"))}>
            <Globe className="mr-2 h-4 w-4" />
            <span>Domains</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate("/dashboard/email"))}>
            <Mail className="mr-2 h-4 w-4" />
            <span>Email</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate("/dashboard/website-builder"))}>
            <Paintbrush className="mr-2 h-4 w-4" />
            <span>Website Builder</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate("/dashboard/security"))}>
            <Shield className="mr-2 h-4 w-4" />
            <span>Security Center</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate("/dashboard/unbox"))}>
            <Package className="mr-2 h-4 w-4" />
            <span>Unbox</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Account">
          <CommandItem onSelect={() => runCommand(() => navigate("/dashboard/billing"))}>
            <CreditCard className="mr-2 h-4 w-4" />
            <span>Billing</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate("/dashboard/notifications"))}>
            <Bell className="mr-2 h-4 w-4" />
            <span>Notifications</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate("/dashboard/settings"))}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate("/dashboard/support"))}>
            <HelpCircle className="mr-2 h-4 w-4" />
            <span>Help & Support</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Quick Actions">
          <CommandItem>
            <Zap className="mr-2 h-4 w-4" />
            <span>Deploy New Website</span>
          </CommandItem>
          <CommandItem>
            <Globe className="mr-2 h-4 w-4" />
            <span>Register Domain</span>
          </CommandItem>
          <CommandItem>
            <Cloud className="mr-2 h-4 w-4" />
            <span>Create VM Instance</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
