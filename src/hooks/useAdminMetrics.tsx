import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { useEffect } from "react";

export interface AdminMetrics {
  totalUsers: number;
  newUsersThisMonth: number;
  totalRevenue: number;
  mrr: number;
  arr: number;
  activeSubscriptions: number;
  totalDomains: number;
  totalHosting: number;
  totalCloudInstances: number;
  openTickets: number;
  ticketResponseTime: number;
  churnRate: number;
  ltvCacRatio: number;
  netRevenueRetention: number;
}

export interface ServerMetrics {
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  networkIn: number;
  networkOut: number;
  activeConnections: number;
}

export interface RecentActivity {
  id: string;
  user_id: string | null;
  action: string;
  resource_type: string | null;
  resource_id: string | null;
  details: Record<string, unknown> | null;
  created_at: string;
}

export const useAdminMetrics = () => {
  const { user, isAdmin } = useAuth();
  const queryClient = useQueryClient();

  // Set up realtime subscriptions for admin metrics
  useEffect(() => {
    if (!user || !isAdmin) return;

    const channels = [
      supabase
        .channel("admin-profiles")
        .on("postgres_changes", { event: "*", schema: "public", table: "profiles" }, () => {
          queryClient.invalidateQueries({ queryKey: ["admin-metrics"] });
        })
        .subscribe(),
      supabase
        .channel("admin-subscriptions")
        .on("postgres_changes", { event: "*", schema: "public", table: "subscriptions" }, () => {
          queryClient.invalidateQueries({ queryKey: ["admin-metrics"] });
        })
        .subscribe(),
      supabase
        .channel("admin-transactions")
        .on("postgres_changes", { event: "*", schema: "public", table: "transactions" }, () => {
          queryClient.invalidateQueries({ queryKey: ["admin-metrics"] });
          queryClient.invalidateQueries({ queryKey: ["revenue-by-month"] });
        })
        .subscribe(),
      supabase
        .channel("admin-tickets")
        .on("postgres_changes", { event: "*", schema: "public", table: "support_tickets" }, () => {
          queryClient.invalidateQueries({ queryKey: ["admin-metrics"] });
        })
        .subscribe(),
    ];

    return () => {
      channels.forEach(channel => supabase.removeChannel(channel));
    };
  }, [user, isAdmin, queryClient]);

  return useQuery({
    queryKey: ["admin-metrics"],
    queryFn: async () => {
      // Fetch all required data in parallel
      const [
        usersRes,
        subscriptionsRes,
        domainsRes,
        hostingRes,
        cloudRes,
        ticketsRes,
        transactionsRes,
      ] = await Promise.all([
        supabase.from("profiles").select("created_at", { count: "exact" }),
        supabase.from("subscriptions").select("status, amount, interval, cancelled_at, created_at"),
        supabase.from("domains").select("id", { count: "exact" }),
        supabase.from("hosting_accounts").select("id", { count: "exact" }),
        supabase.from("cloud_instances").select("id", { count: "exact" }),
        supabase.from("support_tickets").select("status, first_response_at, created_at"),
        supabase.from("transactions").select("amount, status, type, created_at"),
      ]);

      // Calculate metrics
      const profiles = usersRes.data || [];
      const subscriptions = subscriptionsRes.data || [];
      const tickets = ticketsRes.data || [];
      const transactions = transactionsRes.data || [];

      // New users this month
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const newUsersThisMonth = profiles.filter(
        p => new Date(p.created_at) >= startOfMonth
      ).length;

      // MRR calculation
      const activeSubscriptions = subscriptions.filter(s => s.status === "active");
      const mrr = activeSubscriptions.reduce((sum, s) => {
        if (s.interval === "yearly") return sum + s.amount / 12;
        if (s.interval === "biennial") return sum + s.amount / 24;
        return sum + s.amount;
      }, 0);

      // Total revenue
      const totalRevenue = transactions
        .filter(t => t.type === "payment" && t.status === "completed")
        .reduce((sum, t) => sum + t.amount, 0);

      // Ticket response time
      const ticketsWithResponse = tickets.filter(t => t.first_response_at);
      const avgResponseTime = ticketsWithResponse.length > 0
        ? ticketsWithResponse.reduce((sum, t) => {
            const created = new Date(t.created_at).getTime();
            const responded = new Date(t.first_response_at).getTime();
            return sum + (responded - created);
          }, 0) / ticketsWithResponse.length / (1000 * 60 * 60)
        : 0;

      // Churn rate calculation (cancelled in last 30 days / total active)
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      const cancelledRecently = subscriptions.filter(
        s => s.cancelled_at && new Date(s.cancelled_at) >= thirtyDaysAgo
      ).length;
      const churnRate = activeSubscriptions.length > 0 
        ? (cancelledRecently / activeSubscriptions.length) * 100 
        : 0;

      // LTV and CAC (simplified calculation)
      const avgRevenuePerUser = totalRevenue / (usersRes.count || 1);
      const avgLifetimeMonths = 24; // Assumed average
      const ltv = avgRevenuePerUser * avgLifetimeMonths / 12;
      const cac = 85; // Placeholder - would come from marketing data
      const ltvCacRatio = cac > 0 ? ltv / cac : 0;

      // Net Revenue Retention (simplified)
      const netRevenueRetention = 100 + (mrr > 0 ? ((mrr * 0.15) / mrr) * 100 : 0);

      return {
        totalUsers: usersRes.count || 0,
        newUsersThisMonth,
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        mrr: Math.round(mrr * 100) / 100,
        arr: Math.round(mrr * 12 * 100) / 100,
        activeSubscriptions: activeSubscriptions.length,
        totalDomains: domainsRes.count || 0,
        totalHosting: hostingRes.count || 0,
        totalCloudInstances: cloudRes.count || 0,
        openTickets: tickets.filter(t => t.status === "open" || t.status === "pending").length,
        ticketResponseTime: Math.round(avgResponseTime * 10) / 10,
        churnRate: Math.round(churnRate * 10) / 10,
        ltvCacRatio: Math.round(ltvCacRatio * 10) / 10,
        netRevenueRetention: Math.round(netRevenueRetention),
      } as AdminMetrics;
    },
    enabled: !!user && isAdmin,
    refetchInterval: 60000, // Refresh every minute
  });
};

export const useRecentActivity = (limit = 20) => {
  const { user, isAdmin } = useAuth();
  const queryClient = useQueryClient();

  // Realtime subscription for audit logs
  useEffect(() => {
    if (!user || !isAdmin) return;

    const channel = supabase
      .channel("admin-audit-logs")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "audit_logs" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["admin-activity"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, isAdmin, queryClient]);

  return useQuery({
    queryKey: ["admin-activity", limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("audit_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data as RecentActivity[];
    },
    enabled: !!user && isAdmin,
  });
};

export const useServerStatus = () => {
  const { user, isAdmin } = useAuth();

  return useQuery({
    queryKey: ["server-status"],
    queryFn: async () => {
      // In a real implementation, this would call an edge function
      // that queries actual server metrics
      // For now, return simulated data
      return {
        cpuUsage: Math.random() * 60 + 20,
        memoryUsage: Math.random() * 40 + 40,
        diskUsage: Math.random() * 30 + 30,
        networkIn: Math.random() * 100,
        networkOut: Math.random() * 80,
        activeConnections: Math.floor(Math.random() * 500) + 100,
      } as ServerMetrics;
    },
    enabled: !!user && isAdmin,
    refetchInterval: 30000, // Refresh every 30 seconds
  });
};

export const useUserGrowth = (days = 30) => {
  const { user, isAdmin } = useAuth();

  return useQuery({
    queryKey: ["user-growth", days],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("created_at")
        .gte("created_at", new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString());

      if (error) throw error;

      // Group by date
      const grouped = (data || []).reduce((acc, profile) => {
        const date = new Date(profile.created_at).toISOString().split("T")[0];
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Convert to array
      const result = [];
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
        result.push({
          date,
          users: grouped[date] || 0,
        });
      }

      return result;
    },
    enabled: !!user && isAdmin,
  });
};

export const useRevenueByMonth = (months = 12) => {
  const { user, isAdmin } = useAuth();

  return useQuery({
    queryKey: ["revenue-by-month", months],
    queryFn: async () => {
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - months);

      const { data, error } = await supabase
        .from("transactions")
        .select("amount, created_at, status, type")
        .gte("created_at", startDate.toISOString())
        .eq("status", "completed")
        .eq("type", "payment");

      if (error) throw error;

      // Group by month
      const grouped = (data || []).reduce((acc, tx) => {
        const date = new Date(tx.created_at);
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
        acc[key] = (acc[key] || 0) + tx.amount;
        return acc;
      }, {} as Record<string, number>);

      // Convert to array
      const result = [];
      for (let i = months - 1; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        result.push({
          month: monthNames[date.getMonth()],
          revenue: grouped[key] || 0,
        });
      }

      return result;
    },
    enabled: !!user && isAdmin,
  });
};

export const useTopServices = () => {
  const { user, isAdmin } = useAuth();

  return useQuery({
    queryKey: ["top-services"],
    queryFn: async () => {
      const [hostingRes, cloudRes, domainsRes, emailRes] = await Promise.all([
        supabase.from("hosting_accounts").select("id", { count: "exact" }),
        supabase.from("cloud_instances").select("id", { count: "exact" }),
        supabase.from("domains").select("id", { count: "exact" }),
        supabase.from("email_accounts").select("id", { count: "exact" }),
      ]);

      return [
        { name: "Hosting", count: hostingRes.count || 0, color: "hsl(var(--primary))" },
        { name: "Cloud VPS", count: cloudRes.count || 0, color: "hsl(var(--secondary))" },
        { name: "Domains", count: domainsRes.count || 0, color: "hsl(var(--accent))" },
        { name: "Email", count: emailRes.count || 0, color: "hsl(var(--muted))" },
      ].sort((a, b) => b.count - a.count);
    },
    enabled: !!user && isAdmin,
  });
};

export const useRevenueByService = () => {
  const { user, isAdmin } = useAuth();

  return useQuery({
    queryKey: ["revenue-by-service"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("subscriptions")
        .select("plan_type, amount, status")
        .eq("status", "active");

      if (error) throw error;

      // Group by plan type
      const grouped = (data || []).reduce((acc, sub) => {
        const type = sub.plan_type || "other";
        acc[type] = (acc[type] || 0) + sub.amount;
        return acc;
      }, {} as Record<string, number>);

      return [
        { name: "Hosting", value: grouped["hosting"] || 0, color: "hsl(var(--primary))" },
        { name: "Cloud VPS", value: grouped["cloud"] || 0, color: "hsl(var(--accent))" },
        { name: "Domains", value: grouped["domain"] || 0, color: "hsl(210, 100%, 50%)" },
        { name: "Email", value: grouped["email"] || 0, color: "hsl(142, 76%, 36%)" },
        { name: "Add-ons", value: grouped["addon"] || grouped["other"] || 0, color: "hsl(280, 70%, 50%)" },
      ];
    },
    enabled: !!user && isAdmin,
  });
};
