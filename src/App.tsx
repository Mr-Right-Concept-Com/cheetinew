import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import AdminSidebar from "./components/AdminSidebar";
import ResellerSidebar from "./components/ResellerSidebar";
import { CheetiAI } from "./components/CheetiAI";
import { CommandPalette } from "./components/CommandPalette";
import { LoadingFallback } from "./components/LoadingFallback";
import { AuthProvider } from "./hooks/useAuth";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { UserHeader } from "./components/UserHeader";

// Eager load critical routes
import Landing from "./pages/Landing";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";

// Lazy load other routes
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
const Backups = lazy(() => import("./pages/Backups"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Admin routes
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const UsersManagement = lazy(() => import("./pages/admin/UsersManagement"));
const RoleManagement = lazy(() => import("./pages/admin/RoleManagement"));
const HostingManagement = lazy(() => import("./pages/admin/HostingManagement"));
const DomainsManagement = lazy(() => import("./pages/admin/DomainsManagement"));
const BillingManagement = lazy(() => import("./pages/admin/BillingManagement"));
const SecurityManagement = lazy(() => import("./pages/admin/SecurityManagement"));
const EmailManagement = lazy(() => import("./pages/admin/EmailManagement"));
const CloudManagement = lazy(() => import("./pages/admin/CloudManagement"));
const SystemSettings = lazy(() => import("./pages/admin/SystemSettings"));

// Reseller routes
const ResellerDashboard = lazy(() => import("./pages/reseller/ResellerDashboard"));
const ResellerOnboarding = lazy(() => import("./pages/reseller/ResellerOnboarding"));
const ResellerClients = lazy(() => import("./pages/reseller/ResellerClients"));
const ResellerProducts = lazy(() => import("./pages/reseller/ResellerProducts"));
const ResellerBilling = lazy(() => import("./pages/reseller/ResellerBilling"));
const ResellerPayouts = lazy(() => import("./pages/reseller/ResellerPayouts"));
const ResellerWhiteLabel = lazy(() => import("./pages/reseller/ResellerWhiteLabel"));

const queryClient = new QueryClient();

const DashboardLayout = ({ children }: { children: React.ReactNode }) => (
  <SidebarProvider>
    <div className="flex min-h-screen w-full">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <UserHeader />
        <main className="flex-1 overflow-auto">
          <Suspense fallback={<LoadingFallback />}>{children}</Suspense>
        </main>
      </div>
    </div>
  </SidebarProvider>
);

const AdminLayout = ({ children }: { children: React.ReactNode }) => (
  <SidebarProvider>
    <div className="flex min-h-screen w-full">
      <AdminSidebar />
      <main className="flex-1 overflow-auto bg-background">
        <div className="container mx-auto p-4 md:p-6 lg:p-8">
          <Suspense fallback={<LoadingFallback />}>{children}</Suspense>
        </div>
      </main>
    </div>
  </SidebarProvider>
);

const ResellerLayout = ({ children }: { children: React.ReactNode }) => (
  <SidebarProvider>
    <div className="flex min-h-screen w-full">
      <ResellerSidebar />
      <main className="flex-1 overflow-auto bg-background">
        <div className="container mx-auto p-4 md:p-6 lg:p-8">
          <Suspense fallback={<LoadingFallback />}>{children}</Suspense>
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
        <AuthProvider>
          <CommandPalette />
          <CheetiAI />
          <Routes>
            <Route path="/" element={<Suspense fallback={<LoadingFallback />}><Landing /></Suspense>} />
            <Route path="/pricing" element={<Suspense fallback={<LoadingFallback />}><Pricing /></Suspense>} />
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/signup" element={<Signup />} />

            {/* Protected Dashboard Routes */}
            <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout><Dashboard /></DashboardLayout></ProtectedRoute>} />
            <Route path="/dashboard/hosting" element={<ProtectedRoute><DashboardLayout><Hosting /></DashboardLayout></ProtectedRoute>} />
            <Route path="/dashboard/cloud" element={<ProtectedRoute><DashboardLayout><Cloud /></DashboardLayout></ProtectedRoute>} />
            <Route path="/dashboard/domains" element={<ProtectedRoute><DashboardLayout><Domains /></DashboardLayout></ProtectedRoute>} />
            <Route path="/dashboard/email" element={<ProtectedRoute><DashboardLayout><Email /></DashboardLayout></ProtectedRoute>} />
            <Route path="/dashboard/builder" element={<ProtectedRoute><DashboardLayout><WebsiteBuilder /></DashboardLayout></ProtectedRoute>} />
            <Route path="/dashboard/billing" element={<ProtectedRoute><DashboardLayout><Billing /></DashboardLayout></ProtectedRoute>} />
            <Route path="/dashboard/notifications" element={<ProtectedRoute><DashboardLayout><Notifications /></DashboardLayout></ProtectedRoute>} />
            <Route path="/dashboard/settings" element={<ProtectedRoute><DashboardLayout><Settings /></DashboardLayout></ProtectedRoute>} />
            <Route path="/dashboard/support" element={<ProtectedRoute><DashboardLayout><Support /></DashboardLayout></ProtectedRoute>} />
            <Route path="/dashboard/security" element={<ProtectedRoute><DashboardLayout><Security /></DashboardLayout></ProtectedRoute>} />
            <Route path="/dashboard/unbox" element={<ProtectedRoute><DashboardLayout><Unbox /></DashboardLayout></ProtectedRoute>} />
            <Route path="/dashboard/backups" element={<ProtectedRoute><DashboardLayout><Backups /></DashboardLayout></ProtectedRoute>} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<ProtectedRoute requireAdmin><AdminLayout><AdminDashboard /></AdminLayout></ProtectedRoute>} />
            <Route path="/admin/users" element={<ProtectedRoute requireAdmin><AdminLayout><UsersManagement /></AdminLayout></ProtectedRoute>} />
            <Route path="/admin/roles" element={<ProtectedRoute requireAdmin><AdminLayout><RoleManagement /></AdminLayout></ProtectedRoute>} />
            <Route path="/admin/hosting" element={<ProtectedRoute requireAdmin><AdminLayout><HostingManagement /></AdminLayout></ProtectedRoute>} />
            <Route path="/admin/domains" element={<ProtectedRoute requireAdmin><AdminLayout><DomainsManagement /></AdminLayout></ProtectedRoute>} />
            <Route path="/admin/billing" element={<ProtectedRoute requireAdmin><AdminLayout><BillingManagement /></AdminLayout></ProtectedRoute>} />
            <Route path="/admin/security" element={<ProtectedRoute requireAdmin><AdminLayout><SecurityManagement /></AdminLayout></ProtectedRoute>} />
            <Route path="/admin/email" element={<ProtectedRoute requireAdmin><AdminLayout><EmailManagement /></AdminLayout></ProtectedRoute>} />
            <Route path="/admin/cloud" element={<ProtectedRoute requireAdmin><AdminLayout><CloudManagement /></AdminLayout></ProtectedRoute>} />
            <Route path="/admin/settings" element={<ProtectedRoute requireAdmin><AdminLayout><SystemSettings /></AdminLayout></ProtectedRoute>} />
            
            {/* Reseller Routes */}
            <Route path="/reseller/onboarding" element={<ProtectedRoute><Suspense fallback={<LoadingFallback />}><ResellerOnboarding /></Suspense></ProtectedRoute>} />
            <Route path="/reseller" element={<ProtectedRoute requireReseller><ResellerLayout><ResellerDashboard /></ResellerLayout></ProtectedRoute>} />
            <Route path="/reseller/clients" element={<ProtectedRoute requireReseller><ResellerLayout><ResellerClients /></ResellerLayout></ProtectedRoute>} />
            <Route path="/reseller/products" element={<ProtectedRoute requireReseller><ResellerLayout><ResellerProducts /></ResellerLayout></ProtectedRoute>} />
            <Route path="/reseller/billing" element={<ProtectedRoute requireReseller><ResellerLayout><ResellerBilling /></ResellerLayout></ProtectedRoute>} />
            <Route path="/reseller/payouts" element={<ProtectedRoute requireReseller><ResellerLayout><ResellerPayouts /></ResellerLayout></ProtectedRoute>} />
            <Route path="/reseller/white-label" element={<ProtectedRoute requireReseller><ResellerLayout><ResellerWhiteLabel /></ResellerLayout></ProtectedRoute>} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
