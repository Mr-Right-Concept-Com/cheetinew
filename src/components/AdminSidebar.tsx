import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
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
  Cloud
} from "lucide-react";

const AdminSidebar = () => {
  const location = useLocation();
  
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

  return (
    <div className="w-64 bg-card border-r border-border min-h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-speed flex items-center justify-center">
            <span className="text-lg font-bold">C</span>
          </div>
          <span className="font-bold text-lg truncate">CheetiHost Admin</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link key={item.path} to={item.path}>
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className="w-full justify-start gap-3"
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">{item.label}</span>
              </Button>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-border">
        <Button variant="ghost" className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10">
          <LogOut className="h-4 w-4 flex-shrink-0" />
          <span className="truncate">Logout</span>
        </Button>
      </div>
    </div>
  );
};

export default AdminSidebar;
