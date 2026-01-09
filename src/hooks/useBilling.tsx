import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

// Subscriptions
export interface Subscription {
  id: string;
  user_id: string;
  plan_id: string | null;
  plan_name: string;
  plan_type: string;
  resource_id: string | null;
  resource_type: string | null;
  status: "active" | "cancelled" | "past_due" | "paused" | "trialing" | "incomplete";
  amount: number;
  currency: string;
  interval: "monthly" | "yearly" | "biennial" | "one_time";
  provider: string | null;
  provider_subscription_id: string | null;
  current_period_start: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  cancelled_at: string | null;
  created_at: string;
  updated_at: string;
}

export const useSubscriptions = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["subscriptions", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("subscriptions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Subscription[];
    },
    enabled: !!user,
  });
};

export const useCancelSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from("subscriptions")
        .update({ 
          cancel_at_period_end: true,
          cancelled_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data as Subscription;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
      toast.success("Subscription cancelled. It will remain active until the end of the billing period.");
    },
    onError: (error: Error) => {
      toast.error(`Failed to cancel subscription: ${error.message}`);
    },
  });
};

// Invoices
export interface Invoice {
  id: string;
  user_id: string;
  invoice_number: string | null;
  subscription_id: string | null;
  status: "draft" | "pending" | "paid" | "overdue" | "cancelled" | "refunded";
  subtotal: number;
  tax_amount: number;
  tax_rate: number;
  discount_amount: number;
  total: number;
  currency: string;
  due_date: string | null;
  paid_at: string | null;
  payment_method: string | null;
  notes: string | null;
  line_items: any | null;
  billing_address: any | null;
  pdf_url: string | null;
  created_at: string;
  updated_at: string;
}

export const useInvoices = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["invoices", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("invoices")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Invoice[];
    },
    enabled: !!user,
  });
};

export const useInvoice = (id: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["invoice", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("invoices")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data as Invoice;
    },
    enabled: !!user && !!id,
  });
};

// Transactions
export interface Transaction {
  id: string;
  user_id: string;
  invoice_id: string | null;
  subscription_id: string | null;
  type: "payment" | "refund" | "credit" | "debit" | "payout";
  amount: number;
  currency: string;
  status: "pending" | "completed" | "failed" | "cancelled" | "refunded";
  provider: string | null;
  provider_transaction_id: string | null;
  payment_method: string | null;
  payment_method_details: any | null;
  description: string | null;
  created_at: string;
}

export const useTransactions = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["transactions", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Transaction[];
    },
    enabled: !!user,
  });
};

// Payment Methods
export interface PaymentMethod {
  id: string;
  user_id: string;
  type: "card" | "bank" | "paypal" | "mobile_money" | "crypto";
  provider: string | null;
  provider_payment_method_id: string | null;
  is_default: boolean;
  last_four: string | null;
  brand: string | null;
  exp_month: number | null;
  exp_year: number | null;
  billing_address: any | null;
  created_at: string;
  updated_at: string;
}

export const usePaymentMethods = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["payment-methods", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("payment_methods")
        .select("*")
        .order("is_default", { ascending: false });

      if (error) throw error;
      return data as PaymentMethod[];
    },
    enabled: !!user,
  });
};

export const useSetDefaultPaymentMethod = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (id: string) => {
      // First, unset all as default
      await supabase
        .from("payment_methods")
        .update({ is_default: false })
        .eq("user_id", user!.id);

      // Then set the selected one as default
      const { data, error } = await supabase
        .from("payment_methods")
        .update({ is_default: true })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data as PaymentMethod;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payment-methods"] });
      toast.success("Default payment method updated!");
    },
    onError: (error: Error) => {
      toast.error(`Failed to update payment method: ${error.message}`);
    },
  });
};

export const useDeletePaymentMethod = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("payment_methods")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payment-methods"] });
      toast.success("Payment method removed!");
    },
    onError: (error: Error) => {
      toast.error(`Failed to remove payment method: ${error.message}`);
    },
  });
};

// Billing stats for dashboard
export const useBillingStats = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["billing-stats", user?.id],
    queryFn: async () => {
      const [subscriptionsRes, invoicesRes, transactionsRes] = await Promise.all([
        supabase.from("subscriptions").select("amount, status, interval"),
        supabase.from("invoices").select("total, status, created_at"),
        supabase.from("transactions").select("amount, status, type"),
      ]);

      if (subscriptionsRes.error) throw subscriptionsRes.error;
      if (invoicesRes.error) throw invoicesRes.error;
      if (transactionsRes.error) throw transactionsRes.error;

      const subscriptions = subscriptionsRes.data as Pick<Subscription, "amount" | "status" | "interval">[];
      const invoices = invoicesRes.data as Pick<Invoice, "total" | "status" | "created_at">[];
      const transactions = transactionsRes.data as Pick<Transaction, "amount" | "status" | "type">[];

      // Calculate MRR
      const mrr = subscriptions
        .filter(s => s.status === "active")
        .reduce((sum, s) => {
          if (s.interval === "yearly") return sum + s.amount / 12;
          if (s.interval === "biennial") return sum + s.amount / 24;
          return sum + s.amount;
        }, 0);

      // Calculate total spent
      const totalSpent = transactions
        .filter(t => t.type === "payment" && t.status === "completed")
        .reduce((sum, t) => sum + t.amount, 0);

      // Get upcoming payment (next invoice due)
      const now = new Date();
      const activeSubscriptions = subscriptions.filter(s => s.status === "active");

      return {
        mrr: Math.round(mrr * 100) / 100,
        arr: Math.round(mrr * 12 * 100) / 100,
        totalSpent: Math.round(totalSpent * 100) / 100,
        activePlans: activeSubscriptions.length,
        paidInvoices: invoices.filter(i => i.status === "paid").length,
        pendingInvoices: invoices.filter(i => i.status === "pending").length,
        overdueInvoices: invoices.filter(i => i.status === "overdue").length,
        paymentSuccessRate: transactions.length > 0
          ? Math.round((transactions.filter(t => t.status === "completed").length / transactions.length) * 100)
          : 100,
      };
    },
    enabled: !!user,
  });
};

// Plans
export interface Plan {
  id: string;
  name: string;
  slug: string;
  type: "hosting" | "cloud" | "domain" | "email" | "ssl" | "addon";
  description: string | null;
  features: any | null;
  price_monthly: number;
  price_yearly: number | null;
  price_biennial: number | null;
  currency: string;
  storage_gb: number | null;
  bandwidth_gb: number | null;
  is_active: boolean;
  is_featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export const usePlans = (type?: Plan["type"]) => {
  return useQuery({
    queryKey: ["plans", type],
    queryFn: async () => {
      let query = supabase
        .from("plans")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });

      if (type) {
        query = query.eq("type", type);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Plan[];
    },
  });
};
