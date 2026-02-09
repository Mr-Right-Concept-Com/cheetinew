import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Mail,
  Plus,
  Search,
  Inbox,
  Send,
  Trash2,
  Shield,
  Settings,
  RefreshCw,
  MoreVertical,
  Forward,
  Filter,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useEmailAccounts, useCreateEmailAccount } from "@/hooks/useEmail";

const Email = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [newEmail, setNewEmail] = useState({ username: "", domain: "", password: "", quota: 10 });
  
  const { data: mailboxes, isLoading } = useEmailAccounts();
  const createEmail = useCreateEmailAccount();

  const handleCreateMailbox = async () => {
    try {
      await createEmail.mutateAsync({
        email_address: `${newEmail.username}@${newEmail.domain}`,
        quota_mb: newEmail.quota * 1024,
      });
      toast({
        title: "Mailbox Created",
        description: "Your new email mailbox has been created successfully.",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to create mailbox.",
        variant: "destructive",
      });
    }
  };

  // Calculate stats
  const totalMailboxes = mailboxes?.length || 0;
  const totalMessages = mailboxes?.reduce((sum, m) => sum + (Number(m.used_mb) || 0), 0) || 0;
  const activeMailboxes = mailboxes?.filter(m => m.status === 'active').length || 0;

  // Filter mailboxes based on search
  const filteredMailboxes = mailboxes?.filter(m => 
    m.email_address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // No mock emails - inbox shows real mailbox list instead

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Email Management</h1>
            <p className="text-muted-foreground">
              Manage your professional email accounts and mailboxes
            </p>
          </div>
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
                <DialogDescription>
                  Set up a new professional email address
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Email Address</Label>
                  <div className="flex gap-2">
                    <Input 
                      placeholder="username" 
                      className="flex-1" 
                      value={newEmail.username}
                      onChange={(e) => setNewEmail({ ...newEmail, username: e.target.value })}
                    />
                    <span className="flex items-center text-muted-foreground">@</span>
                    <Input 
                      placeholder="domain.com" 
                      className="flex-1" 
                      value={newEmail.domain}
                      onChange={(e) => setNewEmail({ ...newEmail, domain: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Password</Label>
                  <Input 
                    type="password" 
                    placeholder="Set a secure password"
                    value={newEmail.password}
                    onChange={(e) => setNewEmail({ ...newEmail, password: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Storage Quota</Label>
                  <Input 
                    type="number" 
                    placeholder="10" 
                    value={newEmail.quota}
                    onChange={(e) => setNewEmail({ ...newEmail, quota: parseInt(e.target.value) || 10 })}
                  />
                  <p className="text-xs text-muted-foreground">Storage in GB</p>
                </div>
                <Button 
                  onClick={handleCreateMailbox} 
                  className="w-full"
                  disabled={createEmail.isPending}
                >
                  {createEmail.isPending ? "Creating..." : "Create Mailbox"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <Card className="bg-card/50 backdrop-blur">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  {isLoading ? (
                    <Skeleton className="h-8 w-12" />
                  ) : (
                    <p className="text-2xl font-bold truncate">{activeMailboxes}</p>
                  )}
                  <p className="text-sm text-muted-foreground truncate">Active Mailboxes</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-accent/10">
                  <Inbox className="h-6 w-6 text-accent" />
                </div>
                <div className="min-w-0 flex-1">
                  {isLoading ? (
                    <Skeleton className="h-8 w-16" />
                  ) : (
                    <p className="text-2xl font-bold truncate">{totalMailboxes}</p>
                  )}
                  <p className="text-sm text-muted-foreground truncate">Total Mailboxes</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-2xl font-bold truncate">
                    {mailboxes?.filter(m => m.spam_filter_level === 'high').length || 0}
                  </p>
                  <p className="text-sm text-muted-foreground truncate">High Spam Filter</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-accent/10">
                  <Send className="h-6 w-6 text-accent" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-2xl font-bold truncate">
                    {mailboxes?.filter(m => m.forwarding_enabled).length || 0}
                  </p>
                  <p className="text-sm text-muted-foreground truncate">Forwarding Active</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="mailboxes" className="space-y-6">
          <TabsList>
            <TabsTrigger value="mailboxes">Mailboxes</TabsTrigger>
            <TabsTrigger value="inbox">Inbox</TabsTrigger>
            <TabsTrigger value="forwarding">Forwarding</TabsTrigger>
            <TabsTrigger value="spam">Spam Rules</TabsTrigger>
          </TabsList>

          {/* Mailboxes Tab */}
          <TabsContent value="mailboxes" className="space-y-6">
            <Card className="bg-card/50 backdrop-blur">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <CardTitle>Your Mailboxes</CardTitle>
                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search mailboxes..."
                      className="pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-20 w-full" />
                    ))}
                  </div>
                ) : filteredMailboxes?.length === 0 ? (
                  <div className="text-center py-12">
                    <Mail className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Mailboxes</h3>
                    <p className="text-muted-foreground">Create your first email mailbox to get started.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredMailboxes?.map((mailbox) => (
                      <div
                        key={mailbox.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border border-border hover:border-primary/50 transition-all bg-background/50 gap-4"
                      >
                        <div className="flex items-center gap-4 min-w-0 flex-1">
                          <div className="p-3 rounded-lg bg-primary/10 flex-shrink-0">
                            <Mail className="h-5 w-5 text-primary" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="font-semibold truncate">{mailbox.email_address}</h4>
                            <p className="text-sm text-muted-foreground truncate">
                              {mailbox.used_mb || 0} MB / {mailbox.quota_mb || 10240} MB
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className={`whitespace-nowrap ${
                              mailbox.status === 'active'
                                ? "bg-green-500/10 text-green-500 border-green-500/20"
                                : "bg-gray-500/10 text-gray-500 border-gray-500/20"
                            }`}
                          >
                            {mailbox.status}
                          </Badge>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-popover">
                              <DropdownMenuItem>
                                <Settings className="mr-2 h-4 w-4" />
                                Settings
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Forward className="mr-2 h-4 w-4" />
                                Setup Forwarding
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Filter className="mr-2 h-4 w-4" />
                                Spam Rules
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
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

          {/* Inbox Tab */}
          <TabsContent value="inbox" className="space-y-6">
            <Card className="bg-card/50 backdrop-blur">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Email Overview</CardTitle>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <RefreshCw className="h-4 w-4" />
                    Refresh
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-16 w-full" />)}</div>
                ) : filteredMailboxes && filteredMailboxes.length > 0 ? (
                  <div className="space-y-2">
                    {filteredMailboxes.map((mailbox) => (
                      <div key={mailbox.id} className="flex items-start gap-4 p-4 rounded-lg border border-border bg-background/50 hover:border-primary/50 transition-all cursor-pointer">
                        <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0 mt-1">
                          <Mail className="h-4 w-4 text-primary" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium truncate">{mailbox.email_address}</p>
                          <p className="text-sm text-muted-foreground truncate">
                            {mailbox.used_mb || 0} MB used of {mailbox.quota_mb || 10240} MB
                            {mailbox.forwarding_enabled && " • Forwarding enabled"}
                            {mailbox.autoresponder_enabled && " • Auto-responder on"}
                          </p>
                        </div>
                        <Badge variant="outline" className={`whitespace-nowrap ${
                          mailbox.status === 'active' ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-muted text-muted-foreground"
                        }`}>{mailbox.status}</Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Inbox className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Mailboxes</h3>
                    <p className="text-muted-foreground">Create a mailbox to start managing email.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Forwarding Tab */}
          <TabsContent value="forwarding">
            <Card className="bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle>Email Forwarding</CardTitle>
                <CardDescription>
                  Set up email forwarding rules for your mailboxes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-lg border border-dashed border-border text-center">
                  <Forward className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-muted-foreground">No forwarding rules configured</p>
                  <Button variant="outline" className="mt-4">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Forwarding Rule
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Spam Rules Tab */}
          <TabsContent value="spam">
            <Card className="bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle>Spam Filtering</CardTitle>
                <CardDescription>
                  Configure spam filtering rules and blocked senders
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                  <div>
                    <p className="font-medium">AI-Powered Spam Detection</p>
                    <p className="text-sm text-muted-foreground">
                      Automatically detect and block spam emails
                    </p>
                  </div>
                  <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
                    Enabled
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                  <div>
                    <p className="font-medium">Blocked Senders</p>
                    <p className="text-sm text-muted-foreground">
                      12 senders currently blocked
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Manage
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Email;
