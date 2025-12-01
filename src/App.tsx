import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import AdminSidebar from "./components/AdminSidebar";
import { CheetiAI } from "./components/CheetiAI";
import { CommandPalette } from "./components/CommandPalette";
import { LoadingFallback } from "./components/LoadingFallback";

// Eager load critical routes
import Landing from "./pages/Landing";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";

// Lazy load other routes for better performance
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Pricing = lazy(() => import("./pages/Pricing"));
const Hosting = lazy(() => import("./pages/Hosting"));
const Cloud = lazy(() => import("./pages/Cloud"));
const Domains = lazy(() => import("./pages/Domains"));
const Email = lazy(() => import("./pages/Email"));
const WebsiteBuilder = lazy(() => import("./pages/WebsiteBuilder"));
const Billing = lazy(() => import("./pages/Billing"));
const Settings = lazy(() => import("./pages/Settings"));
const Support = lazy(() => import("./pages/Support"));
const Notifications = lazy(() => import("./pages/Notifications"));
const Security = lazy(() => import("./pages/Security"));
const Unbox = lazy(() => import("./pages/Unbox"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Admin routes
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const UsersManagement = lazy(() => import("./pages/admin/UsersManagement"));
const HostingManagement = lazy(() => import("./pages/admin/HostingManagement"));
const DomainsManagement = lazy(() => import("./pages/admin/DomainsManagement"));
const BillingManagement = lazy(() => import("./pages/admin/BillingManagement"));
const SecurityManagement = lazy(() => import("./pages/admin/SecurityManagement"));
const EmailManagement = lazy(() => import("./pages/admin/EmailManagement"));
const CloudManagement = lazy(() => import("./pages/admin/CloudManagement"));
const SystemSettings = lazy(() => import("./pages/admin/SystemSettings"));

const queryClient = new QueryClient();

const DashboardLayout = ({ children }: { children: React.ReactNode }) => (
  <SidebarProvider>
    <div className="flex min-h-screen w-full">
      <DashboardSidebar />
      <main className="flex-1">
        <Suspense fallback={<LoadingFallback />}>
          {children}
        </Suspense>
      </main>
    </div>
  </SidebarProvider>
);

const AdminLayout = ({ children }: { children: React.ReactNode }) => (
  <SidebarProvider>
    <div className="flex min-h-screen w-full">
      <AdminSidebar />
      <main className="flex-1 overflow-auto bg-background">
        <div className="container mx-auto p-4 md:p-6 lg:p-8">
          <Suspense fallback={<LoadingFallback />}>
            {children}
          </Suspense>
        </div>
      </main>
    </div>
  </SidebarProvider>
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
          
          {/* Auth Routes */}
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/signup" element={<Signup />} />
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
          <Route path="/admin/settings" element={<AdminLayout><SystemSettings /></AdminLayout>} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
