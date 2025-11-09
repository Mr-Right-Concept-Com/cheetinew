import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import AdminSidebar from "./components/AdminSidebar";
import { CheetiAI } from "./components/CheetiAI";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Pricing from "./pages/Pricing";
import Hosting from "./pages/Hosting";
import Cloud from "./pages/Cloud";
import Domains from "./pages/Domains";
import Email from "./pages/Email";
import WebsiteBuilder from "./pages/WebsiteBuilder";
import Billing from "./pages/Billing";
import Settings from "./pages/Settings";
import Support from "./pages/Support";
import Notifications from "./pages/Notifications";
import Security from "./pages/Security";
import Unbox from "./pages/Unbox";
import { CommandPalette } from "./components/CommandPalette";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UsersManagement from "./pages/admin/UsersManagement";
import HostingManagement from "./pages/admin/HostingManagement";
import DomainsManagement from "./pages/admin/DomainsManagement";
import BillingManagement from "./pages/admin/BillingManagement";
import SecurityManagement from "./pages/admin/SecurityManagement";
import EmailManagement from "./pages/admin/EmailManagement";
import CloudManagement from "./pages/admin/CloudManagement";

const queryClient = new QueryClient();

const DashboardLayout = ({ children }: { children: React.ReactNode }) => (
  <SidebarProvider>
    <div className="flex min-h-screen w-full">
      <DashboardSidebar />
      <main className="flex-1">{children}</main>
    </div>
  </SidebarProvider>
);

const AdminLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="flex min-h-screen w-full">
    <AdminSidebar />
    <main className="flex-1 overflow-auto bg-background">
      <div className="container mx-auto p-4 md:p-6">
        {children}
      </div>
    </main>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <CommandPalette />
        <CheetiAI />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/dashboard" element={<DashboardLayout><Dashboard /></DashboardLayout>} />
          <Route path="/dashboard/hosting" element={<DashboardLayout><Hosting /></DashboardLayout>} />
          <Route path="/dashboard/cloud" element={<DashboardLayout><Cloud /></DashboardLayout>} />
          <Route path="/dashboard/domains" element={<DashboardLayout><Domains /></DashboardLayout>} />
          <Route path="/dashboard/email" element={<DashboardLayout><Email /></DashboardLayout>} />
          <Route path="/dashboard/builder" element={<DashboardLayout><WebsiteBuilder /></DashboardLayout>} />
          <Route path="/dashboard/billing" element={<DashboardLayout><Billing /></DashboardLayout>} />
          <Route path="/dashboard/notifications" element={<DashboardLayout><Notifications /></DashboardLayout>} />
          <Route path="/dashboard/settings" element={<DashboardLayout><Settings /></DashboardLayout>} />
          <Route path="/dashboard/support" element={<DashboardLayout><Support /></DashboardLayout>} />
          <Route path="/dashboard/security" element={<DashboardLayout><Security /></DashboardLayout>} />
          <Route path="/dashboard/unbox" element={<DashboardLayout><Unbox /></DashboardLayout>} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
          <Route path="/admin/users" element={<AdminLayout><UsersManagement /></AdminLayout>} />
          <Route path="/admin/hosting" element={<AdminLayout><HostingManagement /></AdminLayout>} />
          <Route path="/admin/domains" element={<AdminLayout><DomainsManagement /></AdminLayout>} />
          <Route path="/admin/billing" element={<AdminLayout><BillingManagement /></AdminLayout>} />
          <Route path="/admin/security" element={<AdminLayout><SecurityManagement /></AdminLayout>} />
          <Route path="/admin/email" element={<AdminLayout><EmailManagement /></AdminLayout>} />
          <Route path="/admin/cloud" element={<AdminLayout><CloudManagement /></AdminLayout>} />
          <Route path="/admin/settings" element={<AdminLayout><Settings /></AdminLayout>} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
