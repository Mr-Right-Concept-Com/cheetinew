
-- GitHub connections table (stores OAuth tokens per user)
CREATE TABLE public.github_connections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  github_user_id BIGINT NOT NULL,
  github_username TEXT NOT NULL,
  avatar_url TEXT,
  access_token_encrypted TEXT NOT NULL,
  scopes TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE public.github_connections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own GitHub connection"
  ON public.github_connections FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own GitHub connection"
  ON public.github_connections FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own GitHub connection"
  ON public.github_connections FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own GitHub connection"
  ON public.github_connections FOR DELETE
  USING (auth.uid() = user_id);

-- Deployments table
CREATE TABLE public.deployments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  github_connection_id UUID REFERENCES public.github_connections(id) ON DELETE SET NULL,
  hosting_account_id UUID REFERENCES public.hosting_accounts(id) ON DELETE SET NULL,
  repo_full_name TEXT NOT NULL,
  repo_url TEXT NOT NULL,
  branch TEXT NOT NULL DEFAULT 'main',
  commit_sha TEXT,
  commit_message TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  deploy_url TEXT,
  build_log TEXT,
  duration_seconds INTEGER,
  environment TEXT DEFAULT 'production',
  triggered_by TEXT DEFAULT 'manual',
  error_message TEXT,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.deployments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own deployments"
  ON public.deployments FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own deployments"
  ON public.deployments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own deployments"
  ON public.deployments FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own deployments"
  ON public.deployments FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all deployments"
  ON public.deployments FOR ALL
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage all GitHub connections"
  ON public.github_connections FOR ALL
  USING (has_role(auth.uid(), 'admin'));

-- Triggers for updated_at
CREATE TRIGGER update_github_connections_updated_at
  BEFORE UPDATE ON public.github_connections
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_deployments_updated_at
  BEFORE UPDATE ON public.deployments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Index for faster deployment queries
CREATE INDEX idx_deployments_user_id ON public.deployments(user_id);
CREATE INDEX idx_deployments_status ON public.deployments(status);
CREATE INDEX idx_deployments_repo ON public.deployments(repo_full_name);
