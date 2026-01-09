import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "sonner";
import { useEffect } from "react";

export interface CloudInstance {
  id: string;
  user_id: string;
  name: string;
  hostname: string | null;
  type: string;
  status: "running" | "stopped" | "pending" | "terminated" | "error";
  vcpu: number;
  ram_gb: number;
  disk_gb: number;
  disk_type: string;
  region: string;
  datacenter: string | null;
  ip_address: string | null;
  ipv6_address: string | null;
  private_ip: string | null;
  os: string;
  os_version: string | null;
  ssh_keys: string[] | null;
  monthly_cost: number;
  hourly_cost: number | null;
  cpu_usage: number;
  ram_usage: number;
  disk_usage: number;
  network_in_gb: number;
  network_out_gb: number;
  backups_enabled: boolean;
  monitoring_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateInstanceInput {
  name: string;
  type: string;
  vcpu: number;
  ram_gb: number;
  disk_gb: number;
  disk_type?: string;
  region: string;
  os: string;
  os_version?: string;
  ssh_keys?: string[];
  monthly_cost: number;
  backups_enabled?: boolean;
}

export interface UpdateInstanceInput {
  id: string;
  name?: string;
  backups_enabled?: boolean;
  monitoring_enabled?: boolean;
}

export const useCloudInstances = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Set up realtime subscription
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel("cloud-instances-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "cloud_instances",
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ["cloud-instances"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, queryClient]);

  return useQuery({
    queryKey: ["cloud-instances", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cloud_instances")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as CloudInstance[];
    },
    enabled: !!user,
  });
};

export const useCloudInstance = (id: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["cloud-instance", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cloud_instances")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data as CloudInstance;
    },
    enabled: !!user && !!id,
  });
};

export const useCreateCloudInstance = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (input: CreateInstanceInput) => {
      const { data, error } = await supabase
        .from("cloud_instances")
        .insert({
          user_id: user!.id,
          name: input.name,
          type: input.type,
          vcpu: input.vcpu,
          ram_gb: input.ram_gb,
          disk_gb: input.disk_gb,
          disk_type: input.disk_type || "ssd",
          region: input.region,
          os: input.os,
          os_version: input.os_version,
          ssh_keys: input.ssh_keys,
          monthly_cost: input.monthly_cost,
          backups_enabled: input.backups_enabled ?? false,
          status: "pending",
        })
        .select()
        .single();

      if (error) throw error;
      return data as CloudInstance;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cloud-instances"] });
      toast.success("Cloud instance created successfully!");
    },
    onError: (error: Error) => {
      toast.error(`Failed to create cloud instance: ${error.message}`);
    },
  });
};

export const useUpdateCloudInstance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: UpdateInstanceInput) => {
      const { id, ...updates } = input;
      const { data, error } = await supabase
        .from("cloud_instances")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data as CloudInstance;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["cloud-instances"] });
      queryClient.invalidateQueries({ queryKey: ["cloud-instance", data.id] });
      toast.success("Cloud instance updated successfully!");
    },
    onError: (error: Error) => {
      toast.error(`Failed to update cloud instance: ${error.message}`);
    },
  });
};

export const useDeleteCloudInstance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("cloud_instances")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cloud-instances"] });
      toast.success("Cloud instance deleted successfully!");
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete cloud instance: ${error.message}`);
    },
  });
};

// Instance actions (start/stop/restart)
export const useInstanceActions = () => {
  const queryClient = useQueryClient();

  const startInstance = useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from("cloud_instances")
        .update({ status: "running" })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data as CloudInstance;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cloud-instances"] });
      toast.success("Instance started successfully!");
    },
    onError: (error: Error) => {
      toast.error(`Failed to start instance: ${error.message}`);
    },
  });

  const stopInstance = useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from("cloud_instances")
        .update({ status: "stopped" })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data as CloudInstance;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cloud-instances"] });
      toast.success("Instance stopped successfully!");
    },
    onError: (error: Error) => {
      toast.error(`Failed to stop instance: ${error.message}`);
    },
  });

  const restartInstance = useMutation({
    mutationFn: async (id: string) => {
      // First stop, then start
      await supabase
        .from("cloud_instances")
        .update({ status: "pending" })
        .eq("id", id);

      // Simulate restart delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const { data, error } = await supabase
        .from("cloud_instances")
        .update({ status: "running" })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data as CloudInstance;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cloud-instances"] });
      toast.success("Instance restarted successfully!");
    },
    onError: (error: Error) => {
      toast.error(`Failed to restart instance: ${error.message}`);
    },
  });

  return { startInstance, stopInstance, restartInstance };
};

// Cloud stats for dashboard
export const useCloudStats = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["cloud-stats", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cloud_instances")
        .select("status, vcpu, ram_gb, disk_gb, monthly_cost, cpu_usage, ram_usage");

      if (error) throw error;

      const instances = data as Pick<CloudInstance, "status" | "vcpu" | "ram_gb" | "disk_gb" | "monthly_cost" | "cpu_usage" | "ram_usage">[];

      return {
        total: instances.length,
        running: instances.filter(i => i.status === "running").length,
        stopped: instances.filter(i => i.status === "stopped").length,
        totalVCPUs: instances.reduce((sum, i) => sum + (i.vcpu || 0), 0),
        totalRAM: instances.reduce((sum, i) => sum + (i.ram_gb || 0), 0),
        totalDisk: instances.reduce((sum, i) => sum + (i.disk_gb || 0), 0),
        monthlySpend: instances.reduce((sum, i) => sum + (i.monthly_cost || 0), 0),
        avgCPUUsage: instances.length > 0 
          ? Math.round(instances.reduce((sum, i) => sum + (i.cpu_usage || 0), 0) / instances.length) 
          : 0,
        avgRAMUsage: instances.length > 0 
          ? Math.round(instances.reduce((sum, i) => sum + (i.ram_usage || 0), 0) / instances.length) 
          : 0,
      };
    },
    enabled: !!user,
  });
};
