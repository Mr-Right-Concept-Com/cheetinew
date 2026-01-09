import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

export interface Backup {
  id: string;
  user_id: string;
  hosting_account_id: string | null;
  cloud_instance_id: string | null;
  name: string | null;
  type: "full" | "incremental" | "database" | "files" | "snapshot";
  size_mb: number | null;
  status: "pending" | "in_progress" | "completed" | "failed" | "expired";
  storage_path: string | null;
  storage_provider: string;
  retention_days: number;
  is_automatic: boolean;
  created_at: string;
  expires_at: string | null;
  completed_at: string | null;
}

export interface CreateBackupInput {
  hosting_account_id?: string;
  cloud_instance_id?: string;
  name?: string;
  type: Backup["type"];
  retention_days?: number;
}

export const useBackups = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["backups", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("backups")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Backup[];
    },
    enabled: !!user,
  });
};

export const useBackupsByService = (serviceType: "hosting" | "cloud", serviceId: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["backups", serviceType, serviceId],
    queryFn: async () => {
      const column = serviceType === "hosting" ? "hosting_account_id" : "cloud_instance_id";
      const { data, error } = await supabase
        .from("backups")
        .select("*")
        .eq(column, serviceId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Backup[];
    },
    enabled: !!user && !!serviceId,
  });
};

export const useCreateBackup = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (input: CreateBackupInput) => {
      const { data, error } = await supabase
        .from("backups")
        .insert({
          user_id: user!.id,
          hosting_account_id: input.hosting_account_id,
          cloud_instance_id: input.cloud_instance_id,
          name: input.name,
          type: input.type,
          retention_days: input.retention_days || 30,
          is_automatic: false,
          status: "pending",
        })
        .select()
        .single();

      if (error) throw error;
      return data as Backup;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["backups"] });
      toast.success("Backup started successfully!");
    },
    onError: (error: Error) => {
      toast.error(`Failed to create backup: ${error.message}`);
    },
  });
};

export const useDeleteBackup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("backups")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["backups"] });
      toast.success("Backup deleted successfully!");
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete backup: ${error.message}`);
    },
  });
};

export const useRestoreBackup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      // In a real implementation, this would call an edge function
      // to initiate the restore process
      const { data, error } = await supabase
        .from("backups")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      
      // Simulate restore
      toast.info("Restore process initiated. This may take a few minutes.");
      return data as Backup;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["backups"] });
    },
    onError: (error: Error) => {
      toast.error(`Failed to restore backup: ${error.message}`);
    },
  });
};

// Backup stats for dashboard
export const useBackupStats = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["backup-stats", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("backups")
        .select("status, size_mb, type, is_automatic");

      if (error) throw error;

      const backups = data as Pick<Backup, "status" | "size_mb" | "type" | "is_automatic">[];

      const totalSize = backups.reduce((sum, b) => sum + (b.size_mb || 0), 0);

      return {
        total: backups.length,
        completed: backups.filter(b => b.status === "completed").length,
        failed: backups.filter(b => b.status === "failed").length,
        pending: backups.filter(b => b.status === "pending" || b.status === "in_progress").length,
        automatic: backups.filter(b => b.is_automatic).length,
        manual: backups.filter(b => !b.is_automatic).length,
        totalSizeMB: totalSize,
        totalSizeGB: Math.round(totalSize / 1024 * 100) / 100,
      };
    },
    enabled: !!user,
  });
};
