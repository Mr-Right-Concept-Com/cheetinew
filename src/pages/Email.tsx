import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import {
  Mail, Plus, Search, Inbox, Send, Trash2, Shield, Settings,
  RefreshCw, MoreVertical, Forward, Filter, Pencil,
} from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { useEmailAccounts, useCreateEmailAccount, useUpdateEmailAccount, useDeleteEmailAccount } from "@/hooks/useEmail";
import { ComposeDialog } from "@/components/email/ComposeDialog";

const Email = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("mailboxes");
  const [newEmail, setNewEmail] = useState({ username: "", domain: "", password: "", quota: 10 });
  const [composeOpen, setComposeOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [settingsTarget, setSettingsTarget] = useState<string | null>(null);

  const { data: mailboxes, isLoading } = useEmailAccounts();
  const createEmail = useCreateEmailAccount();
  const updateEmail = useUpdateEmailAccount();
  const deleteEmail = useDeleteEmailAccount();

  const handleCreateMailbox = async () => {
    if (!newEmail.username || !newEmail.domain) {
      toast.error("Username and domain are required");
      return;
    }
    try {
      await createEmail.mutateAsync({
        email_address: `${newEmail.username}@${newEmail.domain}`,
        quota_mb: newEmail.quota * 1024,
      });
      toast.success("Mailbox created successfully!");
      setNewEmail({ username: "", domain: "", password: "", quota: 10 });
    } catch {
      toast.error("Failed to create mailbox");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteEmail.mutateAsync(deleteTarget);
      toast.success("Mailbox deleted");
    } catch {
      toast.error("Failed to delete mailbox");
    }
    setDeleteTarget(null);
  };

  const handleToggleForwarding = async (id: string, enabled: boolean, address: string) => {
    try {
      await updateEmail.mutateAsync({ id, forwarding_enabled: enabled, forwarding_address: address });
      toast.success(enabled ? "Forwarding enabled" : "Forwarding disabled");
    } catch {
      toast.error("Failed to update forwarding");
    }
  };

  const handleToggleAutoresponder = async (id: string, enabled: boolean, subject: string, message: string) => {
    try {
      await updateEmail.mutateAsync({ id, autoresponder_enabled: enabled, autoresponder_subject: subject, autoresponder_message: message });
      toast.success(enabled ? "Autoresponder enabled" : "Autoresponder disabled");
    } catch {
      toast.error("Failed to update autoresponder");
    }
  };

  const handleSpamLevel = async (id: string, level: string) => {
    try {
      await updateEmail.mutateAsync({ id, spam_filter_level: level });
      toast.success(`Spam filter set to ${level}`);
    } catch {
      toast.error("Failed to update spam filter");
    }
  };

  const filteredMailboxes = mailboxes?.filter(m =>
    m.email_address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeMailboxes = mailboxes?.filter(m => m.status === "active").length || 0;
  const settingsMailbox = mailboxes?.find(m => m.id === settingsTarget);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 md:py-8 space-y-6 md:space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Email Management</h1>
            <p className="text-muted-foreground">Manage your professional email accounts</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2" onClick={() => setComposeOpen(true)}>
              <Pencil className="h-4 w-4" />
              Compose
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-gradient-speed text-primary-foreground shadow-glow gap-2">
                  <Plus className="h-4 w-4" />
                  Create Mailbox
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Mailbox</DialogTitle>
                  <DialogDescription>Set up a new professional email address</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Email Address</Label>
                    <div className="flex gap-2">
                      <Input placeholder="username" className="flex-1" value={newEmail.username}
                        onChange={(e) => setNewEmail({ ...newEmail, username: e.target.value })} />
                      <span className="flex items-center text-muted-foreground">@</span>
                      <Input placeholder="domain.com" className="flex-1" value={newEmail.domain}
                        onChange={(e) => setNewEmail({ ...newEmail, domain: e.target.value })} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Password</Label>
                    <Input type="password" placeholder="Set a secure password" value={newEmail.password}
                      onChange={(e) => setNewEmail({ ...newEmail, password: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Storage Quota (GB)</Label>
                    <Input type="number" value={newEmail.quota}
                      onChange={(e) => setNewEmail({ ...newEmail, quota: parseInt(e.target.value) || 10 })} />
                  </div>
                  <Button onClick={handleCreateMailbox} className="w-full" disabled={createEmail.isPending}>
                    {createEmail.isPending ? "Creating..." : "Create Mailbox"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Active Mailboxes", value: activeMailboxes, icon: Mail, bg: "bg-primary/10", color: "text-primary" },
            { label: "Total Mailboxes", value: mailboxes?.length || 0, icon: Inbox, bg: "bg-accent/10", color: "text-accent" },
            { label: "High Spam Filter", value: mailboxes?.filter(m => m.spam_filter_level === "high").length || 0, icon: Shield, bg: "bg-primary/10", color: "text-primary" },
            { label: "Forwarding Active", value: mailboxes?.filter(m => m.forwarding_enabled).length || 0, icon: Send, bg: "bg-accent/10", color: "text-accent" },
          ].map((stat, i) => (
            <Card key={i} className="bg-card/50 backdrop-blur">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center gap-3">
                  <div className={`p-2 md:p-3 rounded-lg ${stat.bg}`}>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    {isLoading ? <Skeleton className="h-8 w-12" /> : <p className="text-xl md:text-2xl font-bold">{stat.value}</p>}
                    <p className="text-xs text-muted-foreground truncate">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-5 w-full max-w-xl">
            <TabsTrigger value="mailboxes">Mailboxes</TabsTrigger>
            <TabsTrigger value="inbox">Overview</TabsTrigger>
            <TabsTrigger value="forwarding">Forwarding</TabsTrigger>
            <TabsTrigger value="autoresponder">Autoresponder</TabsTrigger>
            <TabsTrigger value="spam">Spam</TabsTrigger>
          </TabsList>

          {/* Mailboxes Tab */}
          <TabsContent value="mailboxes" className="space-y-6">
            <Card className="bg-card/50 backdrop-blur">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <CardTitle>Your Mailboxes</CardTitle>
                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search mailboxes..." className="pl-10" value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)} />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">{[1, 2, 3].map(i => <Skeleton key={i} className="h-20 w-full" />)}</div>
                ) : filteredMailboxes?.length === 0 ? (
                  <div className="text-center py-12">
                    <Mail className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Mailboxes</h3>
                    <p className="text-muted-foreground">Create your first email mailbox to get started.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredMailboxes?.map((mailbox) => (
                      <div key={mailbox.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border border-border hover:border-primary/50 transition-all bg-background/50 gap-3">
                        <div className="flex items-center gap-4 min-w-0 flex-1">
                          <div className="p-3 rounded-lg bg-primary/10 flex-shrink-0">
                            <Mail className="h-5 w-5 text-primary" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="font-semibold truncate">{mailbox.email_address}</h4>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span>{mailbox.used_mb || 0} MB / {mailbox.quota_mb || 10240} MB</span>
                            </div>
                            <Progress value={((mailbox.used_mb || 0) / (mailbox.quota_mb || 10240)) * 100} className="h-1 mt-1" />
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={
                            mailbox.status === "active" ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-muted text-muted-foreground"
                          }>{mailbox.status}</Badge>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-popover">
                              <DropdownMenuItem onClick={() => setSettingsTarget(mailbox.id)}>
                                <Settings className="mr-2 h-4 w-4" />Settings
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => setActiveTab("forwarding")}>
                                <Forward className="mr-2 h-4 w-4" />Forwarding
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => setActiveTab("spam")}>
                                <Filter className="mr-2 h-4 w-4" />Spam Rules
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive" onClick={() => setDeleteTarget(mailbox.id)}>
                                <Trash2 className="mr-2 h-4 w-4" />Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Overview / Inbox Tab */}
          <TabsContent value="inbox" className="space-y-6">
            <Card className="bg-card/50 backdrop-blur border-accent/20">
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">
                  📧 Full webmail access is available through your hosting panel (cPanel, Plesk, etc.) or your configured mail client (Outlook, Thunderbird, Gmail).
                </p>
              </CardContent>
            </Card>
            <Card className="bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle>Mailbox Overview</CardTitle>
                <CardDescription>Storage and status summary for all accounts</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-3">{[1, 2].map(i => <Skeleton key={i} className="h-16 w-full" />)}</div>
                ) : mailboxes && mailboxes.length > 0 ? (
                  <div className="space-y-4">
                    {mailboxes.map((m) => {
                      const pct = ((m.used_mb || 0) / (m.quota_mb || 10240)) * 100;
                      return (
                        <div key={m.id} className="p-4 rounded-lg border border-border bg-background/50 space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Mail className="h-4 w-4 text-primary" />
                              <span className="font-medium text-sm">{m.email_address}</span>
                            </div>
                            <Badge variant="outline" className={m.status === "active" ? "bg-green-500/10 text-green-500 border-green-500/20" : ""}>{m.status}</Badge>
                          </div>
                          <Progress value={pct} className="h-2" />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>{m.used_mb || 0} MB used</span>
                            <span>{m.quota_mb || 10240} MB total</span>
                          </div>
                          <div className="flex gap-4 text-xs text-muted-foreground">
                            {m.forwarding_enabled && <span>📤 Forwarding to {m.forwarding_address}</span>}
                            {m.autoresponder_enabled && <span>🤖 Autoresponder active</span>}
                            <span>🛡️ Spam: {m.spam_filter_level}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Inbox className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No mailboxes. Create one to get started.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Forwarding Tab */}
          <TabsContent value="forwarding" className="space-y-6">
            <Card className="bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle>Email Forwarding</CardTitle>
                <CardDescription>Forward incoming emails to another address</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-3">{[1, 2].map(i => <Skeleton key={i} className="h-20 w-full" />)}</div>
                ) : mailboxes && mailboxes.length > 0 ? (
                  <div className="space-y-4">
                    {mailboxes.map((m) => (
                      <ForwardingRow key={m.id} mailbox={m} onToggle={handleToggleForwarding} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Forward className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-muted-foreground">Create a mailbox first to set up forwarding</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Autoresponder Tab */}
          <TabsContent value="autoresponder" className="space-y-6">
            <Card className="bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle>Auto-Responder</CardTitle>
                <CardDescription>Set up automatic replies when you're away</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-3">{[1, 2].map(i => <Skeleton key={i} className="h-24 w-full" />)}</div>
                ) : mailboxes && mailboxes.length > 0 ? (
                  <div className="space-y-6">
                    {mailboxes.map((m) => (
                      <AutoresponderRow key={m.id} mailbox={m} onSave={handleToggleAutoresponder} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <RefreshCw className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-muted-foreground">Create a mailbox first</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Spam Tab */}
          <TabsContent value="spam" className="space-y-6">
            <Card className="bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle>Spam Filtering</CardTitle>
                <CardDescription>Configure spam filter levels per mailbox</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-3">{[1, 2].map(i => <Skeleton key={i} className="h-20 w-full" />)}</div>
                ) : mailboxes && mailboxes.length > 0 ? (
                  <div className="space-y-6">
                    {mailboxes.map((m) => (
                      <div key={m.id} className="p-4 rounded-lg border border-border bg-background/50 space-y-3">
                        <div className="flex items-center gap-3">
                          <Shield className="h-4 w-4 text-primary" />
                          <span className="font-medium text-sm">{m.email_address}</span>
                        </div>
                        <RadioGroup
                          value={m.spam_filter_level || "medium"}
                          onValueChange={(val) => handleSpamLevel(m.id, val)}
                          className="grid grid-cols-2 md:grid-cols-4 gap-2"
                        >
                          {["low", "medium", "high", "custom"].map(level => (
                            <div key={level} className="flex items-center space-x-2">
                              <RadioGroupItem value={level} id={`${m.id}-${level}`} />
                              <Label htmlFor={`${m.id}-${level}`} className="capitalize text-sm cursor-pointer">{level}</Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Shield className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-muted-foreground">No mailboxes to configure</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Compose Dialog */}
      <ComposeDialog open={composeOpen} onOpenChange={setComposeOpen}
        fromAddress={mailboxes?.[0]?.email_address} />

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Mailbox</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the mailbox and all associated data. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              {deleteEmail.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Settings Dialog */}
      <Dialog open={!!settingsTarget} onOpenChange={(open) => !open && setSettingsTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mailbox Settings</DialogTitle>
            <DialogDescription>{settingsMailbox?.email_address}</DialogDescription>
          </DialogHeader>
          {settingsMailbox && (
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label>Display Name</Label>
                <Input defaultValue={settingsMailbox.display_name || ""} id="settings-display-name" />
              </div>
              <div className="space-y-2">
                <Label>Quota (MB)</Label>
                <Input type="number" defaultValue={settingsMailbox.quota_mb || 10240} id="settings-quota" />
              </div>
              <Button onClick={async () => {
                const name = (document.getElementById("settings-display-name") as HTMLInputElement)?.value;
                const quota = parseInt((document.getElementById("settings-quota") as HTMLInputElement)?.value) || 10240;
                try {
                  await updateEmail.mutateAsync({ id: settingsMailbox.id, display_name: name, quota_mb: quota });
                  toast.success("Settings updated");
                  setSettingsTarget(null);
                } catch { toast.error("Failed to update"); }
              }} disabled={updateEmail.isPending} className="w-full">
                {updateEmail.isPending ? "Saving..." : "Save Settings"}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Sub-component for forwarding row
function ForwardingRow({ mailbox, onToggle }: { mailbox: any; onToggle: (id: string, enabled: boolean, addr: string) => void }) {
  const [address, setAddress] = useState(mailbox.forwarding_address || "");
  return (
    <div className="p-4 rounded-lg border border-border bg-background/50 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Forward className="h-4 w-4 text-primary" />
          <span className="font-medium text-sm">{mailbox.email_address}</span>
        </div>
        <Switch
          checked={mailbox.forwarding_enabled || false}
          onCheckedChange={(checked) => onToggle(mailbox.id, checked, address)}
        />
      </div>
      <div className="flex gap-2">
        <Input
          placeholder="Forward to: user@example.com"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="flex-1"
        />
        <Button size="sm" variant="outline" onClick={() => onToggle(mailbox.id, true, address)}
          disabled={!address.trim()}>
          Save
        </Button>
      </div>
    </div>
  );
}

// Sub-component for autoresponder row
function AutoresponderRow({ mailbox, onSave }: { mailbox: any; onSave: (id: string, enabled: boolean, subject: string, message: string) => void }) {
  const [subject, setSubject] = useState(mailbox.autoresponder_subject || "");
  const [message, setMessage] = useState(mailbox.autoresponder_message || "");
  return (
    <div className="p-4 rounded-lg border border-border bg-background/50 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <RefreshCw className="h-4 w-4 text-primary" />
          <span className="font-medium text-sm">{mailbox.email_address}</span>
        </div>
        <Switch
          checked={mailbox.autoresponder_enabled || false}
          onCheckedChange={(checked) => onSave(mailbox.id, checked, subject, message)}
        />
      </div>
      <div className="space-y-2">
        <Input placeholder="Auto-reply subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
        <Textarea placeholder="Auto-reply message..." rows={3} value={message} onChange={(e) => setMessage(e.target.value)} />
        <Button size="sm" variant="outline" onClick={() => onSave(mailbox.id, true, subject, message)}>
          Save Autoresponder
        </Button>
      </div>
    </div>
  );
}

export default Email;
