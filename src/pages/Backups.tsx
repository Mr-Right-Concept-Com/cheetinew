import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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

const Backups = () => {
  const { toast } = useToast();
  const [autoBackup, setAutoBackup] = useState(true);
  const [backupFrequency, setBackupFrequency] = useState("daily");

  const backups = [
    {
      id: 1,
      name: "myapp.com",
      type: "Full Backup",
      size: "2.4 GB",
      date: "2024-12-02 10:30",
      status: "completed",
      retention: "30 days",
    },
    {
      id: 2,
      name: "portfolio.dev",
      type: "Incremental",
      size: "450 MB",
      date: "2024-12-02 08:15",
      status: "completed",
      retention: "30 days",
    },
    {
      id: 3,
      name: "blog.io",
      type: "Full Backup",
      size: "1.8 GB",
      date: "2024-12-01 22:00",
      status: "completed",
      retention: "30 days",
    },
    {
      id: 4,
      name: "production-api",
      type: "Snapshot",
      size: "8.2 GB",
      date: "2024-12-01 18:45",
      status: "completed",
      retention: "7 days",
    },
    {
      id: 5,
      name: "staging-server",
      type: "Incremental",
      size: "320 MB",
      date: "2024-12-01 12:00",
      status: "failed",
      retention: "7 days",
    },
  ];

  const storageUsage = {
    used: 45.2,
    total: 100,
    percentage: 45,
  };

  const handleBackupNow = () => {
    toast({
      title: "Backup Started",
      description: "Creating a new backup. This may take a few minutes.",
    });
  };

  const handleRestore = (backupId: number) => {
    toast({
      title: "Restore Initiated",
      description: "Restore process has been started. You will be notified when complete.",
    });
  };

  const handleDownload = (backupId: number) => {
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
          <Button onClick={handleBackupNow} className="bg-gradient-speed text-primary-foreground shadow-glow gap-2">
            <Database className="h-4 w-4" />
            Backup Now
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
                  <p className="text-2xl font-bold truncate">24</p>
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
                  <p className="text-2xl font-bold truncate">2h ago</p>
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
                  <p className="text-2xl font-bold truncate">{storageUsage.used} GB</p>
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
                  <p className="text-2xl font-bold truncate">99.9%</p>
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
              {storageUsage.used} GB of {storageUsage.total} GB used
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={storageUsage.percentage} className="h-3" />
            <p className="text-sm text-muted-foreground mt-2">
              {storageUsage.total - storageUsage.used} GB remaining
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
              <div className="space-y-4">
                {backups.map((backup) => (
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
                          <h4 className="font-semibold truncate">{backup.name}</h4>
                          <Badge variant="outline" className="text-xs whitespace-nowrap">
                            {backup.type}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
                          <span>{backup.date}</span>
                          <span>•</span>
                          <span>{backup.size}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge
                        variant="outline"
                        className={`whitespace-nowrap ${
                          backup.status === "completed"
                            ? "bg-green-500/10 text-green-500 border-green-500/20"
                            : "bg-red-500/10 text-red-500 border-red-500/20"
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
                      >
                        <Upload className="h-4 w-4" />
                        <span className="hidden sm:inline">Restore</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Backups;
