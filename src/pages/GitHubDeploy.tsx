import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import {
  Github,
  GitBranch,
  Rocket,
  Settings,
  Globe,
  Server,
  Zap,
  Check,
  Loader2,
  ExternalLink,
  RefreshCw,
  Play,
  AlertCircle,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  Terminal,
  Link as LinkIcon,
} from "lucide-react";
import { toast } from "sonner";

interface GitHubRepo {
  id: string;
  name: string;
  fullName: string;
  branch: string;
  lastCommit: string;
  lastCommitMessage: string;
  url: string;
}

interface Deployment {
  id: string;
  repoName: string;
  branch: string;
  commit: string;
  status: 'pending' | 'building' | 'deploying' | 'live' | 'failed';
  startedAt: string;
  completedAt?: string;
  url?: string;
  buildTime?: number;
  logs?: string[];
}

// Mock data for demo
const mockRepos: GitHubRepo[] = [
  {
    id: '1',
    name: 'my-nextjs-app',
    fullName: 'vibecoder/my-nextjs-app',
    branch: 'main',
    lastCommit: 'abc1234',
    lastCommitMessage: 'feat: add user authentication',
    url: 'https://github.com/vibecoder/my-nextjs-app',
  },
  {
    id: '2',
    name: 'react-dashboard',
    fullName: 'vibecoder/react-dashboard',
    branch: 'main',
    lastCommit: 'def5678',
    lastCommitMessage: 'fix: responsive layout issues',
    url: 'https://github.com/vibecoder/react-dashboard',
  },
  {
    id: '3',
    name: 'landing-page',
    fullName: 'vibecoder/landing-page',
    branch: 'production',
    lastCommit: 'ghi9012',
    lastCommitMessage: 'update: pricing section',
    url: 'https://github.com/vibecoder/landing-page',
  },
];

const mockDeployments: Deployment[] = [
  {
    id: '1',
    repoName: 'my-nextjs-app',
    branch: 'main',
    commit: 'abc1234',
    status: 'live',
    startedAt: '2024-02-04T10:30:00Z',
    completedAt: '2024-02-04T10:32:15Z',
    url: 'https://my-nextjs-app.cheetihost.com',
    buildTime: 135,
  },
  {
    id: '2',
    repoName: 'react-dashboard',
    branch: 'main',
    commit: 'def5678',
    status: 'building',
    startedAt: '2024-02-04T11:00:00Z',
  },
];

export function GitHubDeploy() {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(true); // Demo: connected
  const [repos, setRepos] = useState<GitHubRepo[]>(mockRepos);
  const [deployments, setDeployments] = useState<Deployment[]>(mockDeployments);
  const [selectedRepo, setSelectedRepo] = useState<GitHubRepo | null>(null);
  const [isDeploying, setIsDeploying] = useState(false);
  const [showNewProjectDialog, setShowNewProjectDialog] = useState(false);
  const [newProjectUrl, setNewProjectUrl] = useState('');
  const [deployConfig, setDeployConfig] = useState({
    branch: 'main',
    buildCommand: 'npm run build',
    outputDir: 'dist',
    nodeVersion: '20',
    envVars: [] as { key: string; value: string }[],
  });

  const handleConnectGitHub = async () => {
    setIsConnecting(true);
    // Simulate OAuth flow
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsConnecting(false);
    setIsConnected(true);
    toast.success("GitHub connected successfully!");
  };

  const handleDeploy = async (repo: GitHubRepo) => {
    setIsDeploying(true);
    setSelectedRepo(repo);

    // Create new deployment
    const newDeployment: Deployment = {
      id: Date.now().toString(),
      repoName: repo.name,
      branch: deployConfig.branch,
      commit: repo.lastCommit,
      status: 'pending',
      startedAt: new Date().toISOString(),
      logs: ['🚀 Starting deployment...'],
    };

    setDeployments(prev => [newDeployment, ...prev]);

    // Simulate build process
    const updateStatus = (status: Deployment['status'], logs: string[], url?: string) => {
      setDeployments(prev => prev.map(d => 
        d.id === newDeployment.id 
          ? { 
              ...d, 
              status, 
              logs: [...(d.logs || []), ...logs],
              url,
              completedAt: status === 'live' || status === 'failed' ? new Date().toISOString() : undefined,
              buildTime: status === 'live' ? Math.floor(Math.random() * 120) + 60 : undefined,
            }
          : d
      ));
    };

    await new Promise(resolve => setTimeout(resolve, 1500));
    updateStatus('building', ['📦 Installing dependencies...', '📦 npm install']);

    await new Promise(resolve => setTimeout(resolve, 2000));
    updateStatus('building', ['🔨 Building project...', `🔨 ${deployConfig.buildCommand}`]);

    await new Promise(resolve => setTimeout(resolve, 2000));
    updateStatus('deploying', ['🌐 Deploying to edge network...', '🌐 Configuring SSL...']);

    await new Promise(resolve => setTimeout(resolve, 1500));
    updateStatus('live', ['✅ Deployment complete!'], `https://${repo.name}.cheetihost.com`);

    setIsDeploying(false);
    toast.success(`${repo.name} deployed successfully!`);
  };

  const handleImportRepo = async () => {
    if (!newProjectUrl) return;

    // Extract repo name from URL
    const repoName = newProjectUrl.split('/').pop()?.replace('.git', '') || 'new-project';
    
    const newRepo: GitHubRepo = {
      id: Date.now().toString(),
      name: repoName,
      fullName: newProjectUrl.replace('https://github.com/', '').replace('.git', ''),
      branch: 'main',
      lastCommit: 'initial',
      lastCommitMessage: 'Initial commit',
      url: newProjectUrl,
    };

    setRepos(prev => [newRepo, ...prev]);
    setShowNewProjectDialog(false);
    setNewProjectUrl('');
    toast.success(`Repository ${repoName} imported!`);
  };

  const getStatusIcon = (status: Deployment['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-muted-foreground" />;
      case 'building':
        return <Loader2 className="h-4 w-4 text-accent animate-spin" />;
      case 'deploying':
        return <Rocket className="h-4 w-4 text-primary animate-pulse" />;
      case 'live':
        return <CheckCircle2 className="h-4 w-4 text-primary" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-destructive" />;
    }
  };

  const getStatusBadge = (status: Deployment['status']) => {
    const variants: Record<string, string> = {
      pending: 'bg-muted text-muted-foreground',
      building: 'bg-accent/20 text-accent',
      deploying: 'bg-primary/20 text-primary',
      live: 'bg-primary/20 text-primary',
      failed: 'bg-destructive/20 text-destructive',
    };

    return (
      <Badge variant="outline" className={`${variants[status]} border-none`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  if (!isConnected) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Deploy from GitHub</h1>
          <p className="text-muted-foreground">
            Connect your GitHub account to deploy projects instantly - better than Vercel & Netlify
          </p>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-8 text-center">
            <div className="p-4 rounded-full bg-muted/50 w-fit mx-auto mb-6">
              <Github className="h-12 w-12" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Connect GitHub</h2>
            <p className="text-muted-foreground mb-6">
              Deploy your projects directly from GitHub with zero configuration. 
              Automatic builds, instant previews, and global edge deployment.
            </p>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="p-4 rounded-lg bg-muted/30">
                <Zap className="h-6 w-6 text-primary mx-auto mb-2" />
                <p className="text-sm font-medium">Instant Deploys</p>
                <p className="text-xs text-muted-foreground">Push to deploy</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/30">
                <Globe className="h-6 w-6 text-accent mx-auto mb-2" />
                <p className="text-sm font-medium">Edge Network</p>
                <p className="text-xs text-muted-foreground">Global CDN</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/30">
                <Server className="h-6 w-6 text-primary mx-auto mb-2" />
                <p className="text-sm font-medium">Auto SSL</p>
                <p className="text-xs text-muted-foreground">Free HTTPS</p>
              </div>
            </div>

            <Button 
              size="lg" 
              className="gap-2"
              onClick={handleConnectGitHub}
              disabled={isConnecting}
            >
              {isConnecting ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Github className="h-5 w-5" />
              )}
              {isConnecting ? 'Connecting...' : 'Connect GitHub Account'}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">GitHub Deploy</h1>
          <p className="text-muted-foreground">
            Deploy your projects with a single click - 20x better than Vercel
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={showNewProjectDialog} onOpenChange={setShowNewProjectDialog}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Github className="h-4 w-4" />
                Import Project
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Import from GitHub</DialogTitle>
                <DialogDescription>
                  Paste your GitHub repository URL to import and deploy
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Repository URL</Label>
                  <Input
                    placeholder="https://github.com/username/repo"
                    value={newProjectUrl}
                    onChange={(e) => setNewProjectUrl(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowNewProjectDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleImportRepo} disabled={!newProjectUrl}>
                  Import & Deploy
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Rocket className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{deployments.filter(d => d.status === 'live').length}</p>
                <p className="text-xs text-muted-foreground">Live Deploys</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-accent/10">
                <Github className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">{repos.length}</p>
                <p className="text-xs text-muted-foreground">Repositories</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Zap className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">~90s</p>
                <p className="text-xs text-muted-foreground">Avg Build Time</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-accent/10">
                <Globe className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">99.9%</p>
                <p className="text-xs text-muted-foreground">Uptime</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="projects" className="space-y-6">
        <TabsList>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="deployments">Deployments</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Projects Tab */}
        <TabsContent value="projects" className="space-y-4">
          {repos.map((repo) => (
            <Card key={repo.id} className="hover:border-primary/50 transition-colors">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-muted">
                      <Github className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{repo.name}</h3>
                        <Badge variant="outline" className="text-xs">
                          <GitBranch className="h-3 w-3 mr-1" />
                          {repo.branch}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{repo.fullName}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {repo.lastCommit.slice(0, 7)} - {repo.lastCommitMessage}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <a href={repo.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                    <Button 
                      size="sm" 
                      className="gap-2"
                      onClick={() => handleDeploy(repo)}
                      disabled={isDeploying}
                    >
                      {isDeploying && selectedRepo?.id === repo.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Rocket className="h-4 w-4" />
                      )}
                      Deploy
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Deployments Tab */}
        <TabsContent value="deployments" className="space-y-4">
          {deployments.map((deployment) => (
            <Card key={deployment.id}>
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    {getStatusIcon(deployment.status)}
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{deployment.repoName}</h3>
                        {getStatusBadge(deployment.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {deployment.branch} • {deployment.commit.slice(0, 7)}
                      </p>
                      {deployment.buildTime && (
                        <p className="text-xs text-muted-foreground">
                          Built in {deployment.buildTime}s
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {deployment.url && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={deployment.url} target="_blank" rel="noopener noreferrer" className="gap-2">
                          <Eye className="h-4 w-4" />
                          Visit
                        </a>
                      </Button>
                    )}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Terminal className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Build Logs - {deployment.repoName}</DialogTitle>
                        </DialogHeader>
                        <div className="bg-muted rounded-lg p-4 font-mono text-sm max-h-96 overflow-auto">
                          {(deployment.logs || ['No logs available']).map((log, i) => (
                            <div key={i} className="py-0.5">{log}</div>
                          ))}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>

                {(deployment.status === 'building' || deployment.status === 'deploying') && (
                  <div className="mt-4">
                    <Progress 
                      value={deployment.status === 'building' ? 50 : 80} 
                      className="h-2"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {deployment.status === 'building' ? 'Building project...' : 'Deploying to edge...'}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Build Configuration</CardTitle>
              <CardDescription>Default settings for new deployments</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Build Command</Label>
                  <Input 
                    value={deployConfig.buildCommand}
                    onChange={(e) => setDeployConfig(prev => ({ ...prev, buildCommand: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Output Directory</Label>
                  <Input 
                    value={deployConfig.outputDir}
                    onChange={(e) => setDeployConfig(prev => ({ ...prev, outputDir: e.target.value }))}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Node.js Version</Label>
                <Select 
                  value={deployConfig.nodeVersion}
                  onValueChange={(v) => setDeployConfig(prev => ({ ...prev, nodeVersion: v }))}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="18">Node.js 18 LTS</SelectItem>
                    <SelectItem value="20">Node.js 20 LTS</SelectItem>
                    <SelectItem value="21">Node.js 21</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>GitHub Connection</CardTitle>
              <CardDescription>Manage your GitHub integration</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/30">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Github className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">GitHub Connected</p>
                    <p className="text-sm text-muted-foreground">@vibecoder</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-primary/10 text-primary border-none">
                    <Check className="h-3 w-3 mr-1" />
                    Connected
                  </Badge>
                  <Button variant="ghost" size="sm">
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default GitHubDeploy;
