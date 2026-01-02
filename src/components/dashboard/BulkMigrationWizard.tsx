import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Server,
  Cloud,
  Globe,
  Database,
  ArrowRight,
  Loader2,
  CheckCircle,
  AlertCircle,
  Package,
  FileCode,
  Mail,
  Shield,
  Zap,
} from "lucide-react";

// Bulk Migration Wizard - Multi-panel migration with AI assistance

interface MigrationSource {
  id: string;
  name: string;
  type: 'cpanel' | 'plesk' | 'hostinger' | 'spaceship' | 'other';
  connected: boolean;
  resources: {
    websites: number;
    domains: number;
    emails: number;
    databases: number;
  };
}

interface MigrationTarget {
  id: string;
  name: string;
  type: string;
}

interface MigrationItem {
  id: string;
  name: string;
  type: 'website' | 'domain' | 'email' | 'database';
  size?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  progress?: number;
  source: string;
}

interface BulkMigrationWizardProps {
  sources?: MigrationSource[];
  onStartMigration?: (items: MigrationItem[]) => void;
}

const defaultSources: MigrationSource[] = [
  {
    id: 'cpanel-1',
    name: 'cPanel Production',
    type: 'cpanel',
    connected: true,
    resources: { websites: 15, domains: 20, emails: 45, databases: 12 },
  },
  {
    id: 'hostinger-1',
    name: 'Hostinger Account',
    type: 'hostinger',
    connected: true,
    resources: { websites: 8, domains: 10, emails: 25, databases: 6 },
  },
  {
    id: 'plesk-1',
    name: 'Plesk Server',
    type: 'plesk',
    connected: false,
    resources: { websites: 0, domains: 0, emails: 0, databases: 0 },
  },
];

export function BulkMigrationWizard({ 
  sources = defaultSources,
  onStartMigration 
}: BulkMigrationWizardProps) {
  const [step, setStep] = useState(1);
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [selectedItems, setSelectedItems] = useState<MigrationItem[]>([]);
  const [isMigrating, setIsMigrating] = useState(false);
  const [migrationProgress, setMigrationProgress] = useState(0);

  const totalResources = sources
    .filter(s => selectedSources.includes(s.id))
    .reduce(
      (acc, s) => ({
        websites: acc.websites + s.resources.websites,
        domains: acc.domains + s.resources.domains,
        emails: acc.emails + s.resources.emails,
        databases: acc.databases + s.resources.databases,
      }),
      { websites: 0, domains: 0, emails: 0, databases: 0 }
    );

  const toggleSource = (id: string) => {
    setSelectedSources(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const handleStartMigration = () => {
    setIsMigrating(true);
    // Simulate migration progress
    const interval = setInterval(() => {
      setMigrationProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.random() * 10;
      });
    }, 500);
  };

  const getTypeIcon = (type: string) => {
    const icons: Record<string, typeof Server> = {
      cpanel: Server,
      plesk: Server,
      hostinger: Cloud,
      spaceship: Globe,
      website: FileCode,
      domain: Globe,
      email: Mail,
      database: Database,
    };
    return icons[type] || Package;
  };

  return (
    <Card className="bg-card/50 backdrop-blur">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            Bulk Migration Wizard
          </CardTitle>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                  step >= s
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {step > s ? <CheckCircle className="h-4 w-4" /> : s}
              </div>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Step 1: Select Sources */}
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Select Migration Sources</h3>
            <p className="text-muted-foreground">
              Choose the panels and accounts you want to migrate from
            </p>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {sources.map((source) => {
                const Icon = getTypeIcon(source.type);
                const isSelected = selectedSources.includes(source.id);

                return (
                  <Card
                    key={source.id}
                    className={`cursor-pointer transition-all ${
                      isSelected
                        ? 'border-primary ring-2 ring-primary/20'
                        : 'hover:border-primary/50'
                    } ${!source.connected ? 'opacity-50' : ''}`}
                    onClick={() => source.connected && toggleSource(source.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-primary/10">
                            <Icon className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-semibold">{source.name}</h4>
                            <p className="text-xs text-muted-foreground capitalize">
                              {source.type}
                            </p>
                          </div>
                        </div>
                        <Badge variant={source.connected ? 'default' : 'secondary'}>
                          {source.connected ? 'Connected' : 'Connect'}
                        </Badge>
                      </div>
                      {source.connected && (
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="flex items-center gap-1">
                            <FileCode className="h-3 w-3 text-muted-foreground" />
                            {source.resources.websites} sites
                          </div>
                          <div className="flex items-center gap-1">
                            <Globe className="h-3 w-3 text-muted-foreground" />
                            {source.resources.domains} domains
                          </div>
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3 text-muted-foreground" />
                            {source.resources.emails} emails
                          </div>
                          <div className="flex items-center gap-1">
                            <Database className="h-3 w-3 text-muted-foreground" />
                            {source.resources.databases} DBs
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="flex justify-end">
              <Button
                onClick={() => setStep(2)}
                disabled={selectedSources.length === 0}
                className="gap-2"
              >
                Continue <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Select Resources */}
        {step === 2 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Select Resources to Migrate</h3>
            <p className="text-muted-foreground">
              Review and select which resources to include in the migration
            </p>

            <Tabs defaultValue="websites" className="w-full">
              <TabsList className="grid grid-cols-4 w-full max-w-md">
                <TabsTrigger value="websites" className="gap-1">
                  <FileCode className="h-3 w-3" />
                  Sites ({totalResources.websites})
                </TabsTrigger>
                <TabsTrigger value="domains" className="gap-1">
                  <Globe className="h-3 w-3" />
                  Domains ({totalResources.domains})
                </TabsTrigger>
                <TabsTrigger value="emails" className="gap-1">
                  <Mail className="h-3 w-3" />
                  Emails ({totalResources.emails})
                </TabsTrigger>
                <TabsTrigger value="databases" className="gap-1">
                  <Database className="h-3 w-3" />
                  DBs ({totalResources.databases})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="websites" className="mt-4">
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {Array.from({ length: totalResources.websites }).map((_, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 rounded-lg border border-border bg-background/50 hover:border-primary/50"
                    >
                      <div className="flex items-center gap-3">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <FileCode className="h-4 w-4 text-primary" />
                        <span>example-site-{i + 1}.com</span>
                      </div>
                      <Badge variant="outline">2.4 GB</Badge>
                    </div>
                  ))}
                </div>
              </TabsContent>

              {/* Similar content for other tabs */}
              <TabsContent value="domains" className="mt-4">
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {Array.from({ length: totalResources.domains }).map((_, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 rounded-lg border border-border bg-background/50"
                    >
                      <div className="flex items-center gap-3">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <Globe className="h-4 w-4 text-primary" />
                        <span>domain-{i + 1}.com</span>
                      </div>
                      <Badge variant="outline">Active</Badge>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="emails" className="mt-4">
                <p className="text-muted-foreground text-center py-4">
                  {totalResources.emails} email accounts selected
                </p>
              </TabsContent>

              <TabsContent value="databases" className="mt-4">
                <p className="text-muted-foreground text-center py-4">
                  {totalResources.databases} databases selected
                </p>
              </TabsContent>
            </Tabs>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button onClick={() => setStep(3)} className="gap-2">
                Continue <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Configure Options */}
        {step === 3 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Migration Configuration</h3>
            <p className="text-muted-foreground">
              Configure how resources should be migrated
            </p>

            <div className="space-y-4">
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-primary" />
                    <div>
                      <h4 className="font-semibold">Auto-configure SSL</h4>
                      <p className="text-sm text-muted-foreground">
                        Automatically provision SSL certificates
                      </p>
                    </div>
                  </div>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Zap className="h-5 w-5 text-primary" />
                    <div>
                      <h4 className="font-semibold">Zero-Downtime Migration</h4>
                      <p className="text-sm text-muted-foreground">
                        Keep sites live during migration
                      </p>
                    </div>
                  </div>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Database className="h-5 w-5 text-primary" />
                    <div>
                      <h4 className="font-semibold">Preserve Database Collation</h4>
                      <p className="text-sm text-muted-foreground">
                        Keep original database character settings
                      </p>
                    </div>
                  </div>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
              </Card>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(2)}>
                Back
              </Button>
              <Button onClick={() => setStep(4)} className="gap-2">
                Review Migration <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: Execute Migration */}
        {step === 4 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">
              {isMigrating ? 'Migration in Progress' : 'Ready to Migrate'}
            </h3>

            {!isMigrating ? (
              <>
                <div className="grid grid-cols-4 gap-4 text-center">
                  <Card className="p-4">
                    <p className="text-3xl font-bold text-primary">
                      {totalResources.websites}
                    </p>
                    <p className="text-sm text-muted-foreground">Websites</p>
                  </Card>
                  <Card className="p-4">
                    <p className="text-3xl font-bold text-primary">
                      {totalResources.domains}
                    </p>
                    <p className="text-sm text-muted-foreground">Domains</p>
                  </Card>
                  <Card className="p-4">
                    <p className="text-3xl font-bold text-primary">
                      {totalResources.emails}
                    </p>
                    <p className="text-sm text-muted-foreground">Emails</p>
                  </Card>
                  <Card className="p-4">
                    <p className="text-3xl font-bold text-primary">
                      {totalResources.databases}
                    </p>
                    <p className="text-sm text-muted-foreground">Databases</p>
                  </Card>
                </div>

                <Card className="p-4 bg-primary/5 border-primary/20">
                  <div className="flex items-center gap-3">
                    <Zap className="h-5 w-5 text-primary" />
                    <div>
                      <h4 className="font-semibold">AI Migration Assistant</h4>
                      <p className="text-sm text-muted-foreground">
                        Our AI will optimize the migration process, handle conflicts,
                        and ensure zero-downtime transfer.
                      </p>
                    </div>
                  </div>
                </Card>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setStep(3)}>
                    Back
                  </Button>
                  <Button onClick={handleStartMigration} className="gap-2">
                    Start Migration <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </>
            ) : (
              <div className="space-y-6 py-8">
                <div className="text-center">
                  <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto mb-4" />
                  <h4 className="text-xl font-semibold mb-2">
                    Migrating Resources...
                  </h4>
                  <p className="text-muted-foreground">
                    {migrationProgress < 100
                      ? 'AI is optimizing the migration process'
                      : 'Migration complete!'}
                  </p>
                </div>

                <Progress value={migrationProgress} className="h-3" />

                <div className="text-center text-sm text-muted-foreground">
                  {Math.round(migrationProgress)}% Complete
                </div>

                {migrationProgress >= 100 && (
                  <div className="flex justify-center">
                    <Button className="gap-2">
                      <CheckCircle className="h-4 w-4" />
                      View Migration Report
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
