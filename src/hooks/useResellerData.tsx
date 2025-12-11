import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

// Types for reseller data
export interface ResellerClient {
  id: string;
  name: string;
  email: string;
  services: number;
  revenue: number;
  status: "active" | "pending" | "suspended";
  joinDate: string;
}

export interface ResellerMetrics {
  totalRevenue: number;
  totalClients: number;
  activeServices: number;
  commissionEarned: number;
  pendingPayouts: number;
  conversionRate: number;
}

export interface RevenueDataPoint {
  month: string;
  revenue: number;
  clients: number;
}

export interface ProductSale {
  name: string;
  sales: number;
  revenue: number;
}

// Demo data generator
const generateDemoData = () => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
  const revenueData: RevenueDataPoint[] = months.map((month, i) => ({
    month,
    revenue: 2000 + Math.floor(Math.random() * 8000) + (i * 500),
    clients: 10 + Math.floor(Math.random() * 20) + (i * 3),
  }));

  const productBreakdown: ProductSale[] = [
    { name: "Hosting", sales: 45, revenue: 4500 },
    { name: "Cloud VPS", sales: 22, revenue: 3300 },
    { name: "Domains", sales: 67, revenue: 1340 },
    { name: "Email", sales: 34, revenue: 680 },
  ];

  const clients: ResellerClient[] = [
    { id: "1", name: "TechStart Inc.", email: "contact@techstart.com", services: 5, revenue: 299, status: "active", joinDate: "2024-12-09" },
    { id: "2", name: "Green Farms Co.", email: "info@greenfarms.com", services: 3, revenue: 149, status: "active", joinDate: "2024-12-04" },
    { id: "3", name: "Urban Design Studio", email: "hello@urbandesign.com", services: 7, revenue: 449, status: "active", joinDate: "2024-12-01" },
    { id: "4", name: "Alpha Consulting", email: "team@alphaconsulting.com", services: 2, revenue: 79, status: "pending", joinDate: "2024-11-28" },
    { id: "5", name: "Nova Digital", email: "support@novadigital.io", services: 4, revenue: 199, status: "active", joinDate: "2024-11-25" },
  ];

  const metrics: ResellerMetrics = {
    totalRevenue: revenueData.reduce((sum, d) => sum + d.revenue, 0),
    totalClients: clients.length,
    activeServices: clients.reduce((sum, c) => sum + c.services, 0),
    commissionEarned: Math.floor(revenueData.reduce((sum, d) => sum + d.revenue, 0) * 0.25),
    pendingPayouts: 850,
    conversionRate: 32.5,
  };

  return { revenueData, productBreakdown, clients, metrics };
};

export const useResellerData = () => {
  const { user, isReseller, isAdmin } = useAuth();

  // Fetch reseller metrics
  const { data: metrics, isLoading: metricsLoading } = useQuery({
    queryKey: ["reseller-metrics", user?.id],
    queryFn: async () => {
      // In production, this would fetch from Supabase
      // For now, return demo data
      const demoData = generateDemoData();
      return demoData.metrics;
    },
    enabled: !!user && (isReseller || isAdmin),
  });

  // Fetch revenue data for charts
  const { data: revenueData, isLoading: revenueLoading } = useQuery({
    queryKey: ["reseller-revenue", user?.id],
    queryFn: async () => {
      const demoData = generateDemoData();
      return demoData.revenueData;
    },
    enabled: !!user && (isReseller || isAdmin),
  });

  // Fetch product breakdown
  const { data: productBreakdown, isLoading: productsLoading } = useQuery({
    queryKey: ["reseller-products", user?.id],
    queryFn: async () => {
      const demoData = generateDemoData();
      return demoData.productBreakdown;
    },
    enabled: !!user && (isReseller || isAdmin),
  });

  // Fetch clients
  const { data: clients, isLoading: clientsLoading } = useQuery({
    queryKey: ["reseller-clients", user?.id],
    queryFn: async () => {
      const demoData = generateDemoData();
      return demoData.clients;
    },
    enabled: !!user && (isReseller || isAdmin),
  });

  return {
    metrics: metrics || {
      totalRevenue: 0,
      totalClients: 0,
      activeServices: 0,
      commissionEarned: 0,
      pendingPayouts: 0,
      conversionRate: 0,
    },
    revenueData: revenueData || [],
    productBreakdown: productBreakdown || [],
    clients: clients || [],
    isLoading: metricsLoading || revenueLoading || productsLoading || clientsLoading,
  };
};

export const useResellerClients = () => {
  const { user, isReseller, isAdmin } = useAuth();

  return useQuery({
    queryKey: ["reseller-clients-full", user?.id],
    queryFn: async () => {
      const demoData = generateDemoData();
      return demoData.clients;
    },
    enabled: !!user && (isReseller || isAdmin),
  });
};