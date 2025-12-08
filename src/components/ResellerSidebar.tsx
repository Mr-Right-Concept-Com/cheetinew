import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  DollarSign, 
  Settings,
  LogOut,
  Palette,
  FileText,
  Home,
  HelpCircle,
  Wallet,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/useAuth";
import mascotCheeti from "@/assets/mascot-cheeti.png";

const ResellerSidebar = () => {
  const location = useLocation();
  const { open } = useSidebar();
  const { logout } = useAuth();
  
  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/reseller" },
    { icon: Users, label: "Clients", path: "/reseller/clients" },
    { icon: Package, label: "Products", path: "/reseller/products" },
    { icon: DollarSign, label: "Billing", path: "/reseller/billing" },
    { icon: Wallet, label: "Payouts", path: "/reseller/payouts" },
    { icon: Palette, label: "White-Label", path: "/reseller/white-label" },
    { icon: FileText, label: "Reports", path: "/reseller/reports" },
    { icon: Settings, label: "Settings", path: "/reseller/settings" },
    { icon: HelpCircle, label: "Support", path: "/reseller/support" },
  ];

  const handleLogout = async () => {
    await logout();
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <Link to="/" className="flex items-center gap-2 px-2 py-4">
          <div className="w-8 h-8 rounded-lg bg-gradient-speed flex items-center justify-center flex-shrink-0 shadow-glow">
            <img src={mascotCheeti} alt="Cheeti" className="w-6 h-6 object-contain" />
          </div>
          {open && <span className="font-bold text-lg truncate">Reseller Portal</span>}
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Quick Links</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/dashboard">
                    <Home className="h-4 w-4" />
                    <span>User Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Reseller</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link to={item.path}>
                        <Icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={handleLogout}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default ResellerSidebar;
