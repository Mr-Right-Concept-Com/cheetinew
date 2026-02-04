import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { useEffect } from "react";
import { toast } from "sonner";

// Types for reseller data
export interface ResellerClient {
  id: string;
  name: string;
  email: string;
  company?: string;
  phone?: string;
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

export interface ResellerPayout {
  id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'paid' | 'failed';
  payoutMethod: string;
  periodStart: string;
  periodEnd: string;
  processedAt?: string;
  createdAt: string;
}

export interface ResellerProduct {
  id: string;
  name: string;
  type: string;
  basePrice: number;
  resellerPrice: number;
  markupPercentage: number;
  isActive: boolean;
  description?: string;
}

export const useResellerData = () => {
  const { user, isReseller, isAdmin } = useAuth();
  const queryClient = useQueryClient();

  // Fetch reseller metrics from real data
  const { data: metrics, isLoading: metricsLoading } = useQuery({
    queryKey: ["reseller-metrics", user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error("No user");

      // Get clients count and revenue
      const { data: clients, error: clientsError } = await supabase
        .from("reseller_clients")
        .select("id, total_revenue, services_count, status")
        .eq("reseller_id", user.id);

      if (clientsError) throw clientsError;

      // Get commissions
      const { data: commissions, error: commError } = await supabase
        .from("reseller_commissions")
        .select("amount, status")
        .eq("reseller_id", user.id);

      if (commError) throw commError;

      // Get pending payouts
      const { data: payouts, error: payoutError } = await supabase
        .from("reseller_payouts")
        .select("amount, status")
        .eq("reseller_id", user.id)
        .eq("status", "pending");

      if (payoutError) throw payoutError;

      const totalRevenue = clients?.reduce((sum, c) => sum + (c.total_revenue || 0), 0) || 0;
      const totalClients = clients?.length || 0;
      const activeClients = clients?.filter(c => c.status === 'active').length || 0;
      const activeServices = clients?.reduce((sum, c) => sum + (c.services_count || 0), 0) || 0;
      const commissionEarned = commissions?.reduce((sum, c) => sum + (c.amount || 0), 0) || 0;
      const pendingPayouts = payouts?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0;
      const conversionRate = totalClients > 0 ? (activeClients / totalClients) * 100 : 0;

      return {
        totalRevenue,
        totalClients,
        activeServices,
        commissionEarned,
        pendingPayouts,
        conversionRate: Math.round(conversionRate * 10) / 10,
      };
    },
    enabled: !!user && (isReseller || isAdmin),
  });

  // Fetch revenue data for charts (last 12 months)
  const { data: revenueData, isLoading: revenueLoading } = useQuery({
    queryKey: ["reseller-revenue", user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error("No user");

      const { data: commissions, error } = await supabase
        .from("reseller_commissions")
        .select("amount, created_at")
        .eq("reseller_id", user.id)
        .gte("created_at", new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString())
        .order("created_at", { ascending: true });

      if (error) throw error;

      // Group by month
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const monthlyData: Record<string, { revenue: number; count: number }> = {};

      months.forEach(m => {
        monthlyData[m] = { revenue: 0, count: 0 };
      });

      commissions?.forEach(c => {
        const date = new Date(c.created_at);
        const month = months[date.getMonth()];
        monthlyData[month].revenue += c.amount || 0;
        monthlyData[month].count += 1;
      });

      return months.map(month => ({
        month,
        revenue: monthlyData[month].revenue,
        clients: monthlyData[month].count,
      }));
    },
    enabled: !!user && (isReseller || isAdmin),
  });

  // Fetch product breakdown
  const { data: productBreakdown, isLoading: productsLoading } = useQuery({
    queryKey: ["reseller-products-breakdown", user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error("No user");

      const { data: products, error } = await supabase
        .from("reseller_products")
        .select("id, name, type, reseller_price")
        .eq("reseller_id", user.id)
        .eq("is_active", true);

      if (error) throw error;

      // Group by type
      const breakdown: Record<string, { sales: number; revenue: number }> = {
        hosting: { sales: 0, revenue: 0 },
        cloud: { sales: 0, revenue: 0 },
        domain: { sales: 0, revenue: 0 },
        email: { sales: 0, revenue: 0 },
      };

      products?.forEach(p => {
        if (breakdown[p.type]) {
          breakdown[p.type].sales += 1;
          breakdown[p.type].revenue += p.reseller_price || 0;
        }
      });

      return [
        { name: "Hosting", sales: breakdown.hosting.sales, revenue: breakdown.hosting.revenue },
        { name: "Cloud VPS", sales: breakdown.cloud.sales, revenue: breakdown.cloud.revenue },
        { name: "Domains", sales: breakdown.domain.sales, revenue: breakdown.domain.revenue },
        { name: "Email", sales: breakdown.email.sales, revenue: breakdown.email.revenue },
      ];
    },
    enabled: !!user && (isReseller || isAdmin),
  });

  // Fetch clients
  const { data: clients, isLoading: clientsLoading } = useQuery({
    queryKey: ["reseller-clients", user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error("No user");

      const { data, error } = await supabase
        .from("reseller_clients")
        .select("*")
        .eq("reseller_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      return data.map(c => ({
        id: c.id,
        name: c.name,
        email: c.email,
        company: c.company,
        phone: c.phone,
        services: c.services_count || 0,
        revenue: c.total_revenue || 0,
        status: (c.status || 'pending') as "active" | "pending" | "suspended",
        joinDate: c.created_at?.split('T')[0] || '',
      }));
    },
    enabled: !!user && (isReseller || isAdmin),
  });

  // Real-time subscriptions
  useEffect(() => {
    if (!user?.id) return;

    const channels = [
      supabase
        .channel("reseller-clients-changes")
        .on("postgres_changes", { event: "*", schema: "public", table: "reseller_clients", filter: `reseller_id=eq.${user.id}` }, () => {
          queryClient.invalidateQueries({ queryKey: ["reseller-clients", user.id] });
          queryClient.invalidateQueries({ queryKey: ["reseller-metrics", user.id] });
        })
        .subscribe(),
      supabase
        .channel("reseller-commissions-changes")
        .on("postgres_changes", { event: "*", schema: "public", table: "reseller_commissions", filter: `reseller_id=eq.${user.id}` }, () => {
          queryClient.invalidateQueries({ queryKey: ["reseller-metrics", user.id] });
          queryClient.invalidateQueries({ queryKey: ["reseller-revenue", user.id] });
        })
        .subscribe(),
      supabase
        .channel("reseller-payouts-changes")
        .on("postgres_changes", { event: "*", schema: "public", table: "reseller_payouts", filter: `reseller_id=eq.${user.id}` }, () => {
          queryClient.invalidateQueries({ queryKey: ["reseller-metrics", user.id] });
          queryClient.invalidateQueries({ queryKey: ["reseller-payouts", user.id] });
        })
        .subscribe(),
    ];

    return () => {
      channels.forEach(ch => supabase.removeChannel(ch));
    };
  }, [user?.id, queryClient]);

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
      if (!user?.id) throw new Error("No user");

      const { data, error } = await supabase
        .from("reseller_clients")
        .select("*")
        .eq("reseller_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      return data.map(c => ({
        id: c.id,
        name: c.name,
        email: c.email,
        company: c.company,
        phone: c.phone,
        services: c.services_count || 0,
        revenue: c.total_revenue || 0,
        status: (c.status || 'pending') as "active" | "pending" | "suspended",
        joinDate: c.created_at?.split('T')[0] || '',
      }));
    },
    enabled: !!user && (isReseller || isAdmin),
  });
};

export const useCreateResellerClient = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (client: { name: string; email: string; company?: string; phone?: string }) => {
      if (!user?.id) throw new Error("No user");

      const { data, error } = await supabase
        .from("reseller_clients")
        .insert({
          reseller_id: user.id,
          name: client.name,
          email: client.email,
          company: client.company,
          phone: client.phone,
          status: "pending",
          services_count: 0,
          total_revenue: 0,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reseller-clients"] });
      queryClient.invalidateQueries({ queryKey: ["reseller-metrics"] });
      toast.success("Client added successfully");
    },
    onError: (error) => {
      toast.error(`Failed to add client: ${error.message}`);
    },
  });
};

export const useResellerPayouts = () => {
  const { user, isReseller, isAdmin } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["reseller-payouts", user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error("No user");

      const { data, error } = await supabase
        .from("reseller_payouts")
        .select("*")
        .eq("reseller_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      return data.map(p => ({
        id: p.id,
        amount: p.amount,
        currency: p.currency || 'USD',
        status: p.status as ResellerPayout['status'],
        payoutMethod: p.payout_method || 'bank_transfer',
        periodStart: p.period_start || '',
        periodEnd: p.period_end || '',
        processedAt: p.processed_at,
        createdAt: p.created_at || '',
      }));
    },
    enabled: !!user && (isReseller || isAdmin),
  });

  // Real-time subscription
  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel("reseller-payouts-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "reseller_payouts", filter: `reseller_id=eq.${user.id}` }, () => {
        queryClient.invalidateQueries({ queryKey: ["reseller-payouts", user.id] });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, queryClient]);

  return query;
};

export const useResellerProducts = () => {
  const { user, isReseller, isAdmin } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["reseller-products", user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error("No user");

      const { data, error } = await supabase
        .from("reseller_products")
        .select("*")
        .eq("reseller_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      return data.map(p => ({
        id: p.id,
        name: p.name,
        type: p.type,
        basePrice: p.base_price,
        resellerPrice: p.reseller_price,
        markupPercentage: p.markup_percentage || 0,
        isActive: p.is_active ?? true,
        description: p.description,
      }));
    },
    enabled: !!user && (isReseller || isAdmin),
  });

  // Real-time subscription
  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel("reseller-products-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "reseller_products", filter: `reseller_id=eq.${user.id}` }, () => {
        queryClient.invalidateQueries({ queryKey: ["reseller-products", user.id] });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, queryClient]);

  return query;
};
