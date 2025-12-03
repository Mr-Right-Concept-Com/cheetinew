import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  Server, 
  Globe, 
  DollarSign, 
  Settings,
  LogOut,
  Shield,
  Mail,
  Cloud,
  Home
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

const AdminSidebar = () => {
  const location = useLocation();
  const { open } = useSidebar();
  const { logout } = useAuth();
  
  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
    { icon: Users, label: "Users", path: "/admin/users" },
    { icon: Server, label: "Hosting", path: "/admin/hosting" },
    { icon: Cloud, label: "Cloud", path: "/admin/cloud" },
    { icon: Globe, label: "Domains", path: "/admin/domains" },
    { icon: Mail, label: "Email", path: "/admin/email" },
    { icon: Shield, label: "Security", path: "/admin/security" },
    { icon: DollarSign, label: "Billing", path: "/admin/billing" },
    { icon: Settings, label: "Settings", path: "/admin/settings" },
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
          {open && <span className="font-bold text-lg truncate">CheetiHost Admin</span>}
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
          <SidebarGroupLabel>Management</SidebarGroupLabel>
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

export default AdminSidebar;
