import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Server,
  Cloud,
  Globe,
  Mail,
  Layout,
  CreditCard,
  Bell,
  Settings,
  HelpCircle,
  ChevronRight,
  Zap,
  Shield,
  Package,
  Database,
  ShieldCheck,
  Github,
  Rocket,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import mascotCheeti from "@/assets/mascot-cheeti.png";

const mainMenuItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Aether", url: "/dashboard/aether", icon: Zap },
  { title: "Deploy", url: "/dashboard/deploy", icon: Rocket },
  { title: "Hosting", url: "/dashboard/hosting", icon: Server },
  { title: "CheetiCloud", url: "/dashboard/cloud", icon: Cloud },
  { title: "Domains", url: "/dashboard/domains", icon: Globe },
  { title: "Email", url: "/dashboard/email", icon: Mail },
  { title: "Website Builder", url: "/dashboard/builder", icon: Layout },
  { title: "Security Center", url: "/dashboard/security", icon: Shield },
  { title: "Backups", url: "/dashboard/backups", icon: Database },
  { title: "Unbox", url: "/dashboard/unbox", icon: Package },
];

const accountItems = [
  { title: "Billing", url: "/dashboard/billing", icon: CreditCard },
  { title: "Notifications", url: "/dashboard/notifications", icon: Bell },
  { title: "Settings", url: "/dashboard/settings", icon: Settings },
];

const supportItems = [
  { title: "Help Center", url: "/dashboard/support", icon: HelpCircle },
];

export function DashboardSidebar() {
  const { isAdmin } = useAuth();

  return (
    <Sidebar className="border-r border-border/40 bg-card/30 backdrop-blur-xl">
      <SidebarHeader className="border-b border-border/40 p-4">
        <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="w-10 h-10 rounded-full bg-gradient-speed flex items-center justify-center shadow-glow">
            <img src={mascotCheeti} alt="Cheeti" className="w-8 h-8 object-contain" />
          </div>
          <div>
            <h3 className="font-bold text-lg">CheetiHost</h3>
            <p className="text-xs text-muted-foreground">Dashboard</p>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-3 py-4">
        {isAdmin && (
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild className="hover:bg-accent/10">
                    <NavLink
                      to="/admin"
                      className={({ isActive }) =>
                        cn(
                          "flex items-center gap-3 px-3 py-2 rounded-lg transition-all",
                          isActive
                            ? "bg-accent/10 text-accent font-medium shadow-sm"
                            : "text-muted-foreground hover:text-foreground"
                        )
                      }
                    >
                      <ShieldCheck className="h-5 w-5 flex-shrink-0" />
                      <span className="truncate">Admin Panel</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
            Services
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="hover:bg-primary/10">
                    <NavLink
                      to={item.url}
                      end={item.url === "/dashboard"}
                      className={({ isActive }) =>
                        cn(
                          "flex items-center gap-3 px-3 py-2 rounded-lg transition-all",
                          isActive
                            ? "bg-primary/10 text-primary font-medium shadow-sm"
                            : "text-muted-foreground hover:text-foreground"
                        )
                      }
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      <span className="truncate">{item.title}</span>
                      <ChevronRight className="h-4 w-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-6">
          <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
            Account
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {accountItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="hover:bg-accent/10">
                    <NavLink
                      to={item.url}
                      className={({ isActive }) =>
                        cn(
                          "flex items-center gap-3 px-3 py-2 rounded-lg transition-all",
                          isActive
                            ? "bg-accent/10 text-accent font-medium shadow-sm"
                            : "text-muted-foreground hover:text-foreground"
                        )
                      }
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      <span className="truncate">{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-6">
          <SidebarGroupContent>
            <SidebarMenu>
              {supportItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="hover:bg-muted">
                    <NavLink
                      to={item.url}
                      className={({ isActive }) =>
                        cn(
                          "flex items-center gap-3 px-3 py-2 rounded-lg transition-all",
                          isActive
                            ? "bg-muted text-foreground font-medium"
                            : "text-muted-foreground hover:text-foreground"
                        )
                      }
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      <span className="truncate">{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border/40 p-4">
        <Link to="/pricing">
          <Button
            className="w-full bg-gradient-speed text-primary-foreground shadow-glow hover:shadow-elegant transition-all gap-2"
            size="sm"
          >
            <Zap className="h-4 w-4" />
            Upgrade Plan
          </Button>
        </Link>
      </SidebarFooter>
    </Sidebar>
  );
}
