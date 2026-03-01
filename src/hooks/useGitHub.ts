import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

export interface GitHubConnection {
  id: string;
  user_id: string;
  github_username: string;
  github_user_id: number;
  avatar_url: string | null;
  scopes: string[] | null;
  created_at: string;
}

export interface GitHubRepo {
  id: number;
  full_name: string;
  name: string;
  description: string | null;
  html_url: string;
  clone_url: string;
  default_branch: string;
  language: string | null;
  private: boolean;
  updated_at: string;
  stargazers_count: number;
}

export interface Deployment {
  id: string;
  user_id: string;
  repo_full_name: string;
  repo_url: string;
  branch: string;
  commit_sha: string | null;
  commit_message: string | null;
  status: string;
  deploy_url: string | null;
  build_log: string | null;
  environment: string | null;
  triggered_by: string | null;
  duration_seconds: number | null;
  error_message: string | null;
  created_at: string;
  started_at: string | null;
  completed_at: string | null;
}

export const useGitHubConnection = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["github-connection", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("github_connections")
        .select("*")
        .eq("user_id", user!.id)
        .maybeSingle();

      if (error) throw error;
      return data as GitHubConnection | null;
    },
    enabled: !!user,
  });
};

export const useGitHubRepos = (enabled: boolean) => {
  return useQuery({
    queryKey: ["github-repos"],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke("github-repos", {
        body: null,
        method: "GET",
      });

      if (error) throw error;
      return (data?.repos || []) as GitHubRepo[];
    },
    enabled,
    staleTime: 5 * 60 * 1000,
  });
};

export const useGitHubBranches = (repo: string | null) => {
  return useQuery({
    queryKey: ["github-branches", repo],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke(
        `github-repos?action=branches&repo=${encodeURIComponent(repo!)}`,
        { method: "GET" }
      );

      if (error) throw error;
      return (data?.branches || []) as { name: string; sha: string }[];
    },
    enabled: !!repo,
  });
};

export const useDeployments = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["deployments", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("deployments")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(20);

      if (error) throw error;
      return data as Deployment[];
    },
    enabled: !!user,
    refetchInterval: 10000, // Poll every 10s for status updates
  });
};

export const useConnectGitHub = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (code: string) => {
      const { data, error } = await supabase.functions.invoke(
        "github-oauth?action=callback",
        { body: { code } }
      );

      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["github-connection"] });
      toast.success("GitHub connected successfully!");
    },
    onError: (err: Error) => {
      toast.error(`Failed to connect GitHub: ${err.message}`);
    },
  });
};

export const useDisconnectGitHub = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke(
        "github-oauth?action=disconnect",
        { method: "POST" }
      );

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["github-connection"] });
      queryClient.invalidateQueries({ queryKey: ["github-repos"] });
      toast.success("GitHub disconnected");
    },
  });
};

export const useCreateDeployment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: {
      repo_full_name: string;
      repo_url: string;
      branch: string;
      hosting_account_id?: string;
      environment?: string;
    }) => {
      const { data, error } = await supabase.functions.invoke("github-deploy", {
        body: input,
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deployments"] });
      toast.success("Deployment started!");
    },
    onError: (err: Error) => {
      toast.error(`Deployment failed: ${err.message}`);
    },
  });
};

export const useDeleteDeployment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("deployments").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deployments"] });
      toast.success("Deployment deleted");
    },
  });
};
