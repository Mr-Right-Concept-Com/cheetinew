import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "sonner";
import { useEffect } from "react";

export interface Domain {
  id: string;
  user_id: string;
  name: string;
  tld: string | null;
  status: "active" | "pending" | "expired" | "transferred" | "suspended";
  registrar: string | null;
  registration_date: string | null;
  expiry_date: string | null;
  auto_renew: boolean;
  privacy_enabled: boolean;
  nameservers: string[] | null;
  transfer_lock: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateDomainInput {
  name: string;
  tld?: string;
  registrar?: string;
  expiry_date?: string;
  auto_renew?: boolean;
  privacy_enabled?: boolean;
  nameservers?: string[];
}

export interface UpdateDomainInput {
  id: string;
  auto_renew?: boolean;
  privacy_enabled?: boolean;
  nameservers?: string[];
  transfer_lock?: boolean;
}

export const useDomains = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Set up realtime subscription
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel("domains-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "domains",
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ["domains"] });
          queryClient.invalidateQueries({ queryKey: ["domain-stats"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, queryClient]);

  return useQuery({
    queryKey: ["domains", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("domains")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Domain[];
    },
    enabled: !!user,
  });
};

export const useDomain = (id: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["domain", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("domains")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data as Domain;
    },
    enabled: !!user && !!id,
  });
};

export const useCreateDomain = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (input: CreateDomainInput) => {
      const { data, error } = await supabase
        .from("domains")
        .insert({
          user_id: user!.id,
          name: input.name,
          tld: input.tld,
          registrar: input.registrar,
          expiry_date: input.expiry_date,
          auto_renew: input.auto_renew ?? true,
          privacy_enabled: input.privacy_enabled ?? false,
          nameservers: input.nameservers,
          status: "pending",
        })
        .select()
        .single();

      if (error) throw error;
      return data as Domain;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["domains"] });
      toast.success("Domain registered successfully!");
    },
    onError: (error: Error) => {
      toast.error(`Failed to register domain: ${error.message}`);
    },
  });
};

export const useUpdateDomain = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: UpdateDomainInput) => {
      const { id, ...updates } = input;
      const { data, error } = await supabase
        .from("domains")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data as Domain;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["domains"] });
      queryClient.invalidateQueries({ queryKey: ["domain", data.id] });
      toast.success("Domain updated successfully!");
    },
    onError: (error: Error) => {
      toast.error(`Failed to update domain: ${error.message}`);
    },
  });
};

export const useDeleteDomain = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("domains")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["domains"] });
      toast.success("Domain deleted successfully!");
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete domain: ${error.message}`);
    },
  });
};

// DNS Records
export interface DNSRecord {
  id: string;
  domain_id: string;
  type: "A" | "AAAA" | "CNAME" | "MX" | "TXT" | "NS" | "SRV" | "CAA" | "PTR";
  name: string;
  value: string;
  ttl: number;
  priority: number | null;
  is_system: boolean;
  created_at: string;
  updated_at: string;
}

export const useDNSRecords = (domainId: string) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Set up realtime subscription for DNS records
  useEffect(() => {
    if (!user || !domainId) return;

    const channel = supabase
      .channel(`dns-records-${domainId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "dns_records",
          filter: `domain_id=eq.${domainId}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ["dns-records", domainId] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, domainId, queryClient]);

  return useQuery({
    queryKey: ["dns-records", domainId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("dns_records")
        .select("*")
        .eq("domain_id", domainId)
        .order("type", { ascending: true });

      if (error) throw error;
      return data as DNSRecord[];
    },
    enabled: !!user && !!domainId,
  });
};

export const useCreateDNSRecord = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: Omit<DNSRecord, "id" | "created_at" | "updated_at" | "is_system">) => {
      const { data, error } = await supabase
        .from("dns_records")
        .insert(input)
        .select()
        .single();

      if (error) throw error;
      return data as DNSRecord;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["dns-records", data.domain_id] });
      toast.success("DNS record created successfully!");
    },
    onError: (error: Error) => {
      toast.error(`Failed to create DNS record: ${error.message}`);
    },
  });
};

export const useDeleteDNSRecord = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, domainId }: { id: string; domainId: string }) => {
      const { error } = await supabase
        .from("dns_records")
        .delete()
        .eq("id", id);

      if (error) throw error;
      return domainId;
    },
    onSuccess: (domainId) => {
      queryClient.invalidateQueries({ queryKey: ["dns-records", domainId] });
      toast.success("DNS record deleted successfully!");
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete DNS record: ${error.message}`);
    },
  });
};

// Domain stats for dashboard
export const useDomainStats = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["domain-stats", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("domains")
        .select("status, expiry_date");

      if (error) throw error;

      const domains = data as Pick<Domain, "status" | "expiry_date">[];
      const now = new Date();
      const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

      return {
        total: domains.length,
        active: domains.filter(d => d.status === "active").length,
        expiringSoon: domains.filter(d => {
          if (!d.expiry_date) return false;
          const expiry = new Date(d.expiry_date);
          return expiry > now && expiry <= thirtyDaysFromNow;
        }).length,
        expired: domains.filter(d => d.status === "expired").length,
      };
    },
    enabled: !!user,
  });
};
