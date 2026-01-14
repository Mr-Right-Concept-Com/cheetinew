import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Database,
  Download,
  Upload,
  Clock,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Settings,
  Calendar,
  HardDrive,
  Shield,
  Zap,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useBackups, useCreateBackup, useRestoreBackup } from "@/hooks/useBackups";
import { format } from "date-fns";

const Backups = () => {
  const { toast } = useToast();
  const [autoBackup, setAutoBackup] = useState(true);
  const [backupFrequency, setBackupFrequency] = useState("daily");
  
  const { data: backups, isLoading } = useBackups();
  const createBackup = useCreateBackup();
  const restoreBackup = useRestoreBackup();

  // Calculate stats
  const totalBackups = backups?.length || 0;
  const completedBackups = backups?.filter(b => b.status === 'completed').length || 0;
  const totalStorageMB = backups?.reduce((sum, b) => sum + (b.size_mb || 0), 0) || 0;
  const storageGB = (totalStorageMB / 1024).toFixed(1);

  const handleBackupNow = async () => {
    try {
      await createBackup.mutateAsync({
        type: 'full',
        name: `Manual Backup - ${new Date().toLocaleDateString()}`,
      });
      toast({
        title: "Backup Started",
        description: "Creating a new backup. This may take a few minutes.",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to start backup.",
        variant: "destructive",
      });
    }
  };

  const handleRestore = async (backupId: string) => {
    try {
      await restoreBackup.mutateAsync(backupId);
      toast({
        title: "Restore Initiated",
        description: "Restore process has been started. You will be notified when complete.",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to start restore.",
        variant: "destructive",
      });
    }
  };

  const handleDownload = (backupId: string) => {
    toast({
      title: "Download Started",
      description: "Your backup is being prepared for download.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Backups & Snapshots</h1>
            <p className="text-muted-foreground">
              Protect your data with automated backups and instant recovery
            </p>
          </div>
          <Button 
            onClick={handleBackupNow} 
            className="bg-gradient-speed text-primary-foreground shadow-glow gap-2"
            disabled={createBackup.isPending}
          >
            <Database className="h-4 w-4" />
            {createBackup.isPending ? "Creating..." : "Backup Now"}
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <Card className="bg-card/50 backdrop-blur">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Database className="h-6 w-6 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  {isLoading ? (
                    <Skeleton className="h-8 w-12" />
                  ) : (
                    <p className="text-2xl font-bold truncate">{totalBackups}</p>
                  )}
                  <p className="text-sm text-muted-foreground truncate">Total Backups</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-accent/10">
                  <Clock className="h-6 w-6 text-accent" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-2xl font-bold truncate">
                    {backups?.[0]?.created_at 
                      ? format(new Date(backups[0].created_at), 'h:mma')
                      : 'N/A'
                    }
                  </p>
                  <p className="text-sm text-muted-foreground truncate">Last Backup</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <HardDrive className="h-6 w-6 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  {isLoading ? (
                    <Skeleton className="h-8 w-16" />
                  ) : (
                    <p className="text-2xl font-bold truncate">{storageGB} GB</p>
                  )}
                  <p className="text-sm text-muted-foreground truncate">Storage Used</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-accent/10">
                  <Shield className="h-6 w-6 text-accent" />
                </div>
                <div className="min-w-0 flex-1">
                  {isLoading ? (
                    <Skeleton className="h-8 w-16" />
                  ) : (
                    <p className="text-2xl font-bold truncate">
                      {totalBackups > 0 ? Math.round((completedBackups / totalBackups) * 100) : 100}%
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground truncate">Recovery Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Storage Progress */}
        <Card className="bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-lg">Backup Storage</CardTitle>
            <CardDescription>
              {storageGB} GB of 100 GB used
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={parseFloat(storageGB)} className="h-3" />
            <p className="text-sm text-muted-foreground mt-2">
              {(100 - parseFloat(storageGB)).toFixed(1)} GB remaining
            </p>
          </CardContent>
        </Card>

        {/* Settings & Recent Backups */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Backup Settings */}
          <Card className="bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Backup Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Automatic Backups</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable scheduled backups
                  </p>
                </div>
                <Switch
                  checked={autoBackup}
                  onCheckedChange={setAutoBackup}
                />
              </div>

              <div className="space-y-2">
                <Label>Backup Frequency</Label>
                <Select value={backupFrequency} onValueChange={setBackupFrequency}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hourly">Hourly</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Retention Period</Label>
                <Select defaultValue="30">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">7 Days</SelectItem>
                    <SelectItem value="14">14 Days</SelectItem>
                    <SelectItem value="30">30 Days</SelectItem>
                    <SelectItem value="90">90 Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button variant="outline" className="w-full gap-2">
                <Zap className="h-4 w-4" />
                Save Settings
              </Button>
            </CardContent>
          </Card>

          {/* Recent Backups */}
          <Card className="bg-card/50 backdrop-blur lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Recent Backups
                </CardTitle>
                <Button variant="ghost" size="sm" className="gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Refresh
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-20 w-full" />
                  ))}
                </div>
              ) : backups?.length === 0 ? (
                <div className="text-center py-12">
                  <Database className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Backups Yet</h3>
                  <p className="text-muted-foreground">Create your first backup to get started.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {backups?.map((backup) => (
                    <div
                      key={backup.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border border-border hover:border-primary/50 transition-all bg-background/50 gap-4"
                    >
                      <div className="flex items-center gap-4 min-w-0 flex-1">
                        <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
                          <Database className="h-5 w-5 text-primary" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-semibold truncate">{backup.name || 'Backup'}</h4>
                            <Badge variant="outline" className="text-xs whitespace-nowrap">
                              {backup.type}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
                            <span>
                              {backup.created_at 
                                ? format(new Date(backup.created_at), 'MMM d, yyyy h:mm a')
                                : 'N/A'
                              }
                            </span>
                            <span>•</span>
                            <span>{backup.size_mb ? `${(backup.size_mb / 1024).toFixed(2)} GB` : 'N/A'}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge
                          variant="outline"
                          className={`whitespace-nowrap ${
                            backup.status === "completed"
                              ? "bg-green-500/10 text-green-500 border-green-500/20"
                              : backup.status === "failed"
                              ? "bg-red-500/10 text-red-500 border-red-500/20"
                              : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                          }`}
                        >
                          {backup.status === "completed" ? (
                            <CheckCircle className="h-3 w-3 mr-1" />
                          ) : (
                            <AlertCircle className="h-3 w-3 mr-1" />
                          )}
                          {backup.status}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDownload(backup.id)}
                          className="gap-1"
                        >
                          <Download className="h-4 w-4" />
                          <span className="hidden sm:inline">Download</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRestore(backup.id)}
                          className="gap-1"
                          disabled={restoreBackup.isPending}
                        >
                          <Upload className="h-4 w-4" />
                          <span className="hidden sm:inline">Restore</span>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Backups;
