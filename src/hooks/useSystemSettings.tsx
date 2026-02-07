import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Json } from "@/integrations/supabase/types";

export interface SystemSetting {
  id: string;
  key: string;
  value: Json;
  category: string | null;
  description: string | null;
  is_public: boolean | null;
  updated_by: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export const useSystemSettings = (category?: string) => {
  return useQuery({
    queryKey: ["system-settings", category],
    queryFn: async () => {
      let query = supabase.from("system_settings").select("*");
      if (category) {
        query = query.eq("category", category);
      }
      const { data, error } = await query.order("key");
      if (error) throw error;
      return data as SystemSetting[];
    },
  });
};

export const useSystemSetting = (key: string) => {
  return useQuery({
    queryKey: ["system-setting", key],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("system_settings")
        .select("*")
        .eq("key", key)
        .maybeSingle();
      if (error) throw error;
      return data as SystemSetting | null;
    },
  });
};

export const useUpsertSystemSetting = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      key,
      value,
      category,
      description,
      is_public,
    }: {
      key: string;
      value: Json;
      category?: string;
      description?: string;
      is_public?: boolean;
    }) => {
      // Check if setting exists
      const { data: existing } = await supabase
        .from("system_settings")
        .select("id")
        .eq("key", key)
        .maybeSingle();

      if (existing) {
        const { error } = await supabase
          .from("system_settings")
          .update({ value, updated_by: (await supabase.auth.getUser()).data.user?.id })
          .eq("key", key);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("system_settings").insert({
          key,
          value,
          category: category || "general",
          description,
          is_public: is_public ?? false,
          updated_by: (await supabase.auth.getUser()).data.user?.id,
        });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["system-settings"] });
      queryClient.invalidateQueries({ queryKey: ["system-setting"] });
    },
    onError: (error: Error) => {
      toast.error(`Failed to save setting: ${error.message}`);
    },
  });
};

export const useSaveSettingsGroup = () => {
  const upsert = useUpsertSystemSetting();

  return useMutation({
    mutationFn: async (
      settings: { key: string; value: Json; category?: string; description?: string }[]
    ) => {
      for (const setting of settings) {
        await upsert.mutateAsync(setting);
      }
    },
    onSuccess: () => {
      toast.success("Settings saved successfully!");
    },
    onError: (error: Error) => {
      toast.error(`Failed to save settings: ${error.message}`);
    },
  });
};

/** Helper to extract a typed value from settings array */
export function getSettingValue<T = string>(
  settings: SystemSetting[] | undefined,
  key: string,
  defaultValue: T
): T {
  const setting = settings?.find((s) => s.key === key);
  if (!setting?.value) return defaultValue;
  // value is stored as Json, could be string, number, boolean, object
  if (typeof setting.value === "object" && setting.value !== null && "value" in (setting.value as Record<string, unknown>)) {
    return (setting.value as Record<string, unknown>).value as T;
  }
  return setting.value as T;
}
