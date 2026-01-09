import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

export interface EmailAccount {
  id: string;
  user_id: string;
  domain_id: string | null;
  hosting_account_id: string | null;
  email_address: string;
  display_name: string | null;
  quota_mb: number;
  used_mb: number;
  status: "active" | "suspended" | "disabled";
  forwarding_enabled: boolean;
  forwarding_address: string | null;
  autoresponder_enabled: boolean;
  autoresponder_subject: string | null;
  autoresponder_message: string | null;
  spam_filter_level: string;
  created_at: string;
  updated_at: string;
}

export interface CreateEmailAccountInput {
  email_address: string;
  display_name?: string;
  domain_id?: string;
  hosting_account_id?: string;
  quota_mb?: number;
  password?: string;
}

export interface UpdateEmailAccountInput {
  id: string;
  display_name?: string;
  quota_mb?: number;
  forwarding_enabled?: boolean;
  forwarding_address?: string;
  autoresponder_enabled?: boolean;
  autoresponder_subject?: string;
  autoresponder_message?: string;
  spam_filter_level?: string;
}

export const useEmailAccounts = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["email-accounts", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("email_accounts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as EmailAccount[];
    },
    enabled: !!user,
  });
};

export const useEmailAccount = (id: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["email-account", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("email_accounts")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data as EmailAccount;
    },
    enabled: !!user && !!id,
  });
};

export const useCreateEmailAccount = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (input: CreateEmailAccountInput) => {
      const { data, error } = await supabase
        .from("email_accounts")
        .insert({
          user_id: user!.id,
          email_address: input.email_address,
          display_name: input.display_name,
          domain_id: input.domain_id,
          hosting_account_id: input.hosting_account_id,
          quota_mb: input.quota_mb || 1000,
          status: "active",
        })
        .select()
        .single();

      if (error) throw error;
      return data as EmailAccount;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["email-accounts"] });
      toast.success("Email account created successfully!");
    },
    onError: (error: Error) => {
      toast.error(`Failed to create email account: ${error.message}`);
    },
  });
};

export const useUpdateEmailAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: UpdateEmailAccountInput) => {
      const { id, ...updates } = input;
      const { data, error } = await supabase
        .from("email_accounts")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data as EmailAccount;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["email-accounts"] });
      queryClient.invalidateQueries({ queryKey: ["email-account", data.id] });
      toast.success("Email account updated successfully!");
    },
    onError: (error: Error) => {
      toast.error(`Failed to update email account: ${error.message}`);
    },
  });
};

export const useDeleteEmailAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("email_accounts")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["email-accounts"] });
      toast.success("Email account deleted successfully!");
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete email account: ${error.message}`);
    },
  });
};

// Email stats for dashboard
export const useEmailStats = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["email-stats", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("email_accounts")
        .select("status, quota_mb, used_mb");

      if (error) throw error;

      const accounts = data as Pick<EmailAccount, "status" | "quota_mb" | "used_mb">[];

      const totalQuota = accounts.reduce((sum, a) => sum + (a.quota_mb || 0), 0);
      const usedQuota = accounts.reduce((sum, a) => sum + (a.used_mb || 0), 0);

      return {
        total: accounts.length,
        active: accounts.filter(a => a.status === "active").length,
        suspended: accounts.filter(a => a.status === "suspended").length,
        totalQuotaMB: totalQuota,
        usedQuotaMB: usedQuota,
        quotaPercentage: totalQuota > 0 ? Math.round((usedQuota / totalQuota) * 100) : 0,
      };
    },
    enabled: !!user,
  });
};
