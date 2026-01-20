import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "sonner";
import { useEffect } from "react";

export interface HostingAccount {
  id: string;
  user_id: string;
  domain_id: string | null;
  name: string;
  plan: string;
  plan_type: "shared" | "vps" | "dedicated" | "wordpress" | "reseller";
  status: "active" | "pending" | "suspended" | "terminated";
  storage_limit_gb: number;
  storage_used_gb: number;
  bandwidth_limit_gb: number;
  bandwidth_used_gb: number;
  databases_limit: number;
  databases_used: number;
  email_accounts_limit: number;
  email_accounts_used: number;
  region: string;
  ip_address: string | null;
  panel_type: string | null;
  panel_account_id: string | null;
  ssl_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateHostingInput {
  name: string;
  plan: string;
  plan_type?: HostingAccount["plan_type"];
  domain_id?: string;
  region?: string;
  storage_limit_gb?: number;
  bandwidth_limit_gb?: number;
}

export interface UpdateHostingInput {
  id: string;
  name?: string;
  plan?: string;
  ssl_enabled?: boolean;
}

export const useHostingAccounts = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Set up realtime subscription
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel("hosting-accounts-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "hosting_accounts",
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ["hosting-accounts"] });
          queryClient.invalidateQueries({ queryKey: ["hosting-stats"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, queryClient]);

  return useQuery({
    queryKey: ["hosting-accounts", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("hosting_accounts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as HostingAccount[];
    },
    enabled: !!user,
  });
};

export const useHostingAccount = (id: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["hosting-account", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("hosting_accounts")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data as HostingAccount;
    },
    enabled: !!user && !!id,
  });
};

export const useCreateHostingAccount = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (input: CreateHostingInput) => {
      const { data, error } = await supabase
        .from("hosting_accounts")
        .insert({
          user_id: user!.id,
          name: input.name,
          plan: input.plan,
          plan_type: input.plan_type || "shared",
          domain_id: input.domain_id,
          region: input.region || "us-east-1",
          storage_limit_gb: input.storage_limit_gb || 10,
          bandwidth_limit_gb: input.bandwidth_limit_gb || 100,
          status: "pending",
        })
        .select()
        .single();

      if (error) throw error;
      return data as HostingAccount;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hosting-accounts"] });
      toast.success("Hosting account created successfully!");
    },
    onError: (error: Error) => {
      toast.error(`Failed to create hosting account: ${error.message}`);
    },
  });
};

export const useUpdateHostingAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: UpdateHostingInput) => {
      const { id, ...updates } = input;
      const { data, error } = await supabase
        .from("hosting_accounts")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data as HostingAccount;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["hosting-accounts"] });
      queryClient.invalidateQueries({ queryKey: ["hosting-account", data.id] });
      toast.success("Hosting account updated successfully!");
    },
    onError: (error: Error) => {
      toast.error(`Failed to update hosting account: ${error.message}`);
    },
  });
};

export const useDeleteHostingAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("hosting_accounts")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hosting-accounts"] });
      toast.success("Hosting account deleted successfully!");
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete hosting account: ${error.message}`);
    },
  });
};

// Hosting stats for dashboard
export const useHostingStats = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["hosting-stats", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("hosting_accounts")
        .select("status, storage_used_gb, storage_limit_gb, bandwidth_used_gb, bandwidth_limit_gb");

      if (error) throw error;

      const accounts = data as Pick<HostingAccount, "status" | "storage_used_gb" | "storage_limit_gb" | "bandwidth_used_gb" | "bandwidth_limit_gb">[];

      const totalStorage = accounts.reduce((sum, a) => sum + (a.storage_limit_gb || 0), 0);
      const usedStorage = accounts.reduce((sum, a) => sum + (a.storage_used_gb || 0), 0);
      const totalBandwidth = accounts.reduce((sum, a) => sum + (a.bandwidth_limit_gb || 0), 0);
      const usedBandwidth = accounts.reduce((sum, a) => sum + (a.bandwidth_used_gb || 0), 0);

      return {
        total: accounts.length,
        active: accounts.filter(a => a.status === "active").length,
        suspended: accounts.filter(a => a.status === "suspended").length,
        totalStorageGB: totalStorage,
        usedStorageGB: usedStorage,
        storagePercentage: totalStorage > 0 ? Math.round((usedStorage / totalStorage) * 100) : 0,
        totalBandwidthGB: totalBandwidth,
        usedBandwidthGB: usedBandwidth,
        bandwidthPercentage: totalBandwidth > 0 ? Math.round((usedBandwidth / totalBandwidth) * 100) : 0,
      };
    },
    enabled: !!user,
  });
};
