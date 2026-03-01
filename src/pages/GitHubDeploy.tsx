import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Github,
  Rocket,
  Globe,
  GitBranch,
  RefreshCw,
  ExternalLink,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  Search,
  Star,
  Lock,
  Trash2,
  ScrollText,
  Unplug,
} from "lucide-react";
import {
  useGitHubConnection,
  useGitHubRepos,
  useDeployments,
  useConnectGitHub,
  useDisconnectGitHub,
  useCreateDeployment,
  useDeleteDeployment,
  useGitHubBranches,
  type Deployment,
} from "@/hooks/useGitHub";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

const statusConfig: Record<string, { icon: React.ReactNode; color: string; label: string }> = {
  pending: { icon: <Clock className="h-3 w-3" />, color: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20", label: "Pending" },
  building: { icon: <Loader2 className="h-3 w-3 animate-spin" />, color: "bg-blue-500/10 text-blue-500 border-blue-500/20", label: "Building" },
  completed: { icon: <CheckCircle className="h-3 w-3" />, color: "bg-green-500/10 text-green-500 border-green-500/20", label: "Live" },
  failed: { icon: <XCircle className="h-3 w-3" />, color: "bg-destructive/10 text-destructive border-destructive/20", label: "Failed" },
};

export function GitHubDeploy() {
  const { user } = useAuth();
  const { data: connection, isLoading: connLoading } = useGitHubConnection();
  const { data: repos, isLoading: reposLoading, refetch: refetchRepos } = useGitHubRepos(!!connection);
  const { data: deployments, isLoading: deploymentsLoading } = useDeployments();
  const connectGitHub = useConnectGitHub();
  const disconnectGitHub = useDisconnectGitHub();
  const createDeployment = useCreateDeployment();
  const deleteDeployment = useDeleteDeployment();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRepo, setSelectedRepo] = useState<string | null>(null);
  const [selectedBranch, setSelectedBranch] = useState("main");
  const [showLogs, setShowLogs] = useState<Deployment | null>(null);

  const { data: branches } = useGitHubBranches(selectedRepo);

  // Handle OAuth callback
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    if (code && user) {
      connectGitHub.mutate(code);
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, [user]);

  const handleConnect = async () => {
    const { data, error } = await supabase.functions.invoke("github-oauth?action=authorize", {
      method: "GET",
    });

    if (data?.url) {
      // For demo: since we may not have real GitHub OAuth credentials,
      // show a simulated connection dialog
      window.open(data.url, "_blank", "width=600,height=700");
    }
  };

  const handleDeploy = () => {
    if (!selectedRepo) return;
    const repo = repos?.find((r) => r.full_name === selectedRepo);
    if (!repo) return;

    createDeployment.mutate({
      repo_full_name: repo.full_name,
      repo_url: repo.html_url,
      branch: selectedBranch,
    });
  };

  const filteredRepos = repos?.filter(
    (r) =>
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.full_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (connLoading) {
    return (
      <div className="space-y-6 p-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Deploy from GitHub</h1>
          <p className="text-muted-foreground">
            Connect your GitHub account to deploy projects instantly
          </p>
        </div>
        {connection && (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-card/50">
              <img
                src={connection.avatar_url || ""}
                alt={connection.github_username}
                className="h-6 w-6 rounded-full"
              />
              <span className="text-sm font-medium">{connection.github_username}</span>
              <Badge variant="outline" className="text-xs bg-green-500/10 text-green-500 border-green-500/20">
                Connected
              </Badge>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => disconnectGitHub.mutate()}
              className="gap-1 text-destructive"
              disabled={disconnectGitHub.isPending}
            >
              <Unplug className="h-4 w-4" />
              Disconnect
            </Button>
          </div>
        )}
      </div>

      {!connection ? (
        /* Connect GitHub CTA */
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-8 md:p-12 text-center space-y-6">
            <div className="p-6 rounded-full bg-primary/10 w-fit mx-auto">
              <Github className="h-16 w-16 text-primary" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">Connect Your GitHub Account</h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                Import your repositories and deploy with a single click. Push-to-deploy, instant previews,
                and global edge distribution.
              </p>
            </div>
            <Button
              size="lg"
              onClick={handleConnect}
              disabled={connectGitHub.isPending}
              className="gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/90"
            >
              <Github className="h-5 w-5" />
              {connectGitHub.isPending ? "Connecting..." : "Connect GitHub"}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Repo List */}
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Your Repositories</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => refetchRepos()} className="gap-1">
                    <RefreshCw className="h-4 w-4" />
                    Refresh
                  </Button>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search repositories..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </CardHeader>
              <CardContent className="space-y-2 max-h-[500px] overflow-y-auto">
                {reposLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))
                ) : filteredRepos?.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Github className="h-10 w-10 mx-auto mb-2 opacity-50" />
                    <p>No repositories found</p>
                  </div>
                ) : (
                  filteredRepos?.map((repo) => (
                    <div
                      key={repo.id}
                      onClick={() => {
                        setSelectedRepo(repo.full_name);
                        setSelectedBranch(repo.default_branch);
                      }}
                      className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
                        selectedRepo === repo.full_name
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm truncate">{repo.full_name}</p>
                          {repo.private && <Lock className="h-3 w-3 text-muted-foreground shrink-0" />}
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                          {repo.language && (
                            <span className="flex items-center gap-1">
                              <span className="h-2 w-2 rounded-full bg-primary" />
                              {repo.language}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Star className="h-3 w-3" />
                            {repo.stargazers_count}
                          </span>
                          <span className="flex items-center gap-1">
                            <GitBranch className="h-3 w-3" />
                            {repo.default_branch}
                          </span>
                        </div>
                      </div>
                      {selectedRepo === repo.full_name && (
                        <Badge className="shrink-0">Selected</Badge>
                      )}
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          {/* Deploy Panel */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Rocket className="h-5 w-5" />
                  Deploy
                </CardTitle>
                <CardDescription>
                  {selectedRepo ? `Deploy ${selectedRepo}` : "Select a repository to deploy"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedRepo && (
                  <>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Branch</label>
                      <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {branches?.map((b) => (
                            <SelectItem key={b.name} value={b.name}>
                              {b.name}
                            </SelectItem>
                          )) || (
                            <SelectItem value={selectedBranch}>{selectedBranch}</SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Environment</label>
                      <Select defaultValue="production">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="production">Production</SelectItem>
                          <SelectItem value="staging">Staging</SelectItem>
                          <SelectItem value="preview">Preview</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}
                <Button
                  className="w-full gap-2 bg-gradient-speed text-primary-foreground shadow-glow"
                  disabled={!selectedRepo || createDeployment.isPending}
                  onClick={handleDeploy}
                >
                  <Rocket className="h-4 w-4" />
                  {createDeployment.isPending ? "Deploying..." : "Deploy Now"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Deployment History */}
      {connection && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Deployment History</CardTitle>
          </CardHeader>
          <CardContent>
            {deploymentsLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : deployments?.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Rocket className="h-10 w-10 mx-auto mb-2 opacity-50" />
                <p>No deployments yet. Select a repo and deploy!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {deployments?.map((d) => {
                  const cfg = statusConfig[d.status] || statusConfig.pending;
                  return (
                    <div
                      key={d.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border border-border hover:border-primary/30 transition-all gap-3"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-medium text-sm">{d.repo_full_name}</p>
                          <Badge variant="outline" className={cfg.color}>
                            {cfg.icon}
                            <span className="ml-1">{cfg.label}</span>
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground flex-wrap">
                          <span className="flex items-center gap-1">
                            <GitBranch className="h-3 w-3" />
                            {d.branch}
                          </span>
                          {d.commit_sha && <span className="font-mono">{d.commit_sha}</span>}
                          <span>{format(new Date(d.created_at), "MMM d, h:mm a")}</span>
                          {d.duration_seconds && <span>{d.duration_seconds}s</span>}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {d.deploy_url && (
                          <Button variant="outline" size="sm" className="gap-1" asChild>
                            <a href={d.deploy_url} target="_blank" rel="noopener noreferrer">
                              <Globe className="h-3 w-3" />
                              Visit
                            </a>
                          </Button>
                        )}
                        <Button variant="ghost" size="sm" onClick={() => setShowLogs(d)} className="gap-1">
                          <ScrollText className="h-3 w-3" />
                          Logs
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={() => deleteDeployment.mutate(d.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Build Logs Dialog */}
      <Dialog open={!!showLogs} onOpenChange={() => setShowLogs(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Build Logs</DialogTitle>
            <DialogDescription>
              {showLogs?.repo_full_name} · {showLogs?.branch} · {showLogs?.commit_sha || "N/A"}
            </DialogDescription>
          </DialogHeader>
          <div className="bg-secondary rounded-lg p-4 max-h-96 overflow-auto">
            <pre className="text-xs text-secondary-foreground font-mono whitespace-pre-wrap">
              {showLogs?.build_log || "No build logs available yet."}
            </pre>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default GitHubDeploy;
