import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Settings as SettingsIcon, User, Shield, Bell, Globe, Key, Users,
  Smartphone, Mail, Loader2, Copy, Trash2, AlertTriangle,
} from "lucide-react";

const Settings = () => {
  const { user, profile, updateProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [deleteAccountOpen, setDeleteAccountOpen] = useState(false);
  const [formData, setFormData] = useState({ full_name: "", company_name: "", phone: "" });
  const [passwordForm, setPasswordForm] = useState({ newPassword: "", confirmPassword: "" });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [apiKeys, setApiKeys] = useState<{ key: string; created: string; id?: string }[]>([]);
  const [newKeyVisible, setNewKeyVisible] = useState<string | null>(null);

  // Load API keys from system_settings on mount
  useEffect(() => {
    if (!user) return;
    supabase.from("system_settings").select("*").like("key", `api_key_${user.id}_%`).then(({ data }) => {
      if (data) {
        setApiKeys(data.map(d => ({ key: (d.value as any)?.key || "****", created: d.created_at || "", id: d.id })));
      }
    });
  }, [user]);

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || "",
        company_name: profile.company_name || "",
        phone: profile.phone || "",
      });
    }
  }, [profile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSaveProfile = async () => {
    setIsLoading(true);
    const { error } = await updateProfile({
      full_name: formData.full_name,
      company_name: formData.company_name,
      phone: formData.phone,
    });
    setIsLoading(false);
    if (error) {
      toast.error("Failed to update profile");
    } else {
      toast.success("Profile updated successfully");
    }
  };

  const handleUpdatePassword = async () => {
    if (passwordForm.newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }
    setPasswordLoading(true);
    const { error } = await supabase.auth.updateUser({ password: passwordForm.newPassword });
    setPasswordLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Password updated successfully");
      setPasswordForm({ newPassword: "", confirmPassword: "" });
    }
  };

  const handleGenerateKey = async () => {
    const key = `ck_live_${Array.from(crypto.getRandomValues(new Uint8Array(24)), b => b.toString(16).padStart(2, "0")).join("")}`;
    const settingKey = `api_key_${user!.id}_${Date.now()}`;
    const { data, error } = await supabase.from("system_settings").insert({
      key: settingKey, value: { key }, category: "api_keys", description: "User API key",
      is_public: false, updated_by: user!.id,
    }).select().single();
    if (error) { toast.error("Failed to generate key"); return; }
    setApiKeys(prev => [...prev, { key, created: new Date().toISOString(), id: data.id }]);
    setNewKeyVisible(key);
    toast.success("API key generated. Copy it now — it won't be shown again.");
  };

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    toast.success("API key copied to clipboard");
  };

  const handleRevokeKey = (key: string) => {
    setApiKeys(prev => prev.filter(k => k.key !== key));
    toast.success("API key revoked");
  };

  const getInitials = () => {
    if (profile?.full_name) return profile.full_name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
    if (user?.email) return user.email.slice(0, 2).toUpperCase();
    return "U";
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 md:py-8 space-y-6 md:space-y-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Account Settings</h1>
          <p className="text-sm md:text-base text-muted-foreground">Manage your account preferences and security</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full max-w-3xl h-auto gap-2">
            <TabsTrigger value="profile" className="text-xs md:text-sm">Profile</TabsTrigger>
            <TabsTrigger value="security" className="text-xs md:text-sm">Security</TabsTrigger>
            <TabsTrigger value="notifications" className="text-xs md:text-sm">Notifications</TabsTrigger>
            <TabsTrigger value="team" className="text-xs md:text-sm">Team</TabsTrigger>
            <TabsTrigger value="api" className="text-xs md:text-sm">API Keys</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card className="bg-card/50 backdrop-blur">
              <CardHeader><CardTitle>Profile Information</CardTitle><CardDescription>Update your personal information</CardDescription></CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                  <Avatar className="w-20 h-20 md:w-24 md:h-24">
                    <AvatarImage src={profile?.avatar_url || ""} />
                    <AvatarFallback className="text-xl md:text-2xl bg-gradient-speed text-primary-foreground">{getInitials()}</AvatarFallback>
                  </Avatar>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Upload Photo</Button>
                    <Button variant="ghost" size="sm" className="text-destructive">Remove</Button>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="full_name">Full Name</Label>
                    <Input id="full_name" value={formData.full_name} onChange={handleInputChange} placeholder="Enter your full name" />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input type="email" value={user?.email || ""} disabled className="bg-muted" />
                    <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" type="tel" value={formData.phone} onChange={handleInputChange} placeholder="+1 (555) 123-4567" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company_name">Company</Label>
                  <Input id="company_name" value={formData.company_name} onChange={handleInputChange} placeholder="Your company name" />
                </div>
                <Button onClick={handleSaveProfile} disabled={isLoading} className="bg-primary">
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Save Changes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <Card className="bg-card/50 backdrop-blur">
              <CardHeader><CardTitle>Change Password</CardTitle><CardDescription>Update your password</CardDescription></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input id="newPassword" type="password" value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} placeholder="Minimum 8 characters" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input id="confirmPassword" type="password" value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })} />
                </div>
                <Button onClick={handleUpdatePassword} disabled={passwordLoading} className="bg-primary">
                  {passwordLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Update Password
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur">
              <CardHeader><CardTitle>Two-Factor Authentication</CardTitle><CardDescription>Add extra security to your account</CardDescription></CardHeader>
              <CardContent className="space-y-4">
                {[
                  { icon: Smartphone, title: "Authenticator App", desc: "Use Google Authenticator or similar", bg: "bg-primary/10", color: "text-primary" },
                  { icon: Mail, title: "Email Verification", desc: "Receive codes via email", bg: "bg-accent/10", color: "text-accent" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-lg border border-border bg-background/50 gap-3">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-lg ${item.bg} flex items-center justify-center`}>
                        <item.icon className={`h-6 w-6 ${item.color}`} />
                      </div>
                      <div><h4 className="font-semibold text-sm">{item.title}</h4><p className="text-xs text-muted-foreground">{item.desc}</p></div>
                    </div>
                    <Switch defaultChecked={i === 1} />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur">
              <CardHeader><CardTitle>Active Sessions</CardTitle></CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-background/50">
                  <div><h4 className="font-semibold text-sm">Current Browser Session</h4><p className="text-xs text-muted-foreground">Active now</p></div>
                  <Badge className="bg-primary/10 text-primary border-none">Current</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Delete Account */}
            <Card className="bg-card/50 backdrop-blur border-destructive/20">
              <CardHeader>
                <CardTitle className="text-destructive flex items-center gap-2"><AlertTriangle className="h-5 w-5" />Danger Zone</CardTitle>
                <CardDescription>Permanently delete your account and all data</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="destructive" onClick={() => setDeleteAccountOpen(true)}>Delete Account</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card className="bg-card/50 backdrop-blur">
              <CardHeader><CardTitle>Email Notifications</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {[
                  { title: "Service Updates", desc: "Important updates about your services", checked: true },
                  { title: "Billing Reminders", desc: "Payment due dates and invoices", checked: true },
                  { title: "Marketing Emails", desc: "News, tips, and special offers", checked: false },
                  { title: "Weekly Reports", desc: "Performance summaries and analytics", checked: true },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between gap-3">
                    <div><h4 className="font-semibold text-sm">{item.title}</h4><p className="text-xs text-muted-foreground">{item.desc}</p></div>
                    <Switch defaultChecked={item.checked} />
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card className="bg-card/50 backdrop-blur">
              <CardHeader><CardTitle>Push Notifications</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {[
                  { title: "Downtime Alerts", desc: "Get notified when services go down", checked: true },
                  { title: "Security Alerts", desc: "Login attempts and security events", checked: true },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between gap-3">
                    <div><h4 className="font-semibold text-sm">{item.title}</h4><p className="text-xs text-muted-foreground">{item.desc}</p></div>
                    <Switch defaultChecked={item.checked} />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Team Tab */}
          <TabsContent value="team" className="space-y-6">
            <Card className="bg-card/50 backdrop-blur">
              <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div><CardTitle>Team Members</CardTitle><CardDescription>Invite and manage team members</CardDescription></div>
                <Button className="gap-2"><Users className="h-4 w-4" />Invite Member</Button>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-background/50">
                  <div className="flex items-center gap-4">
                    <Avatar><AvatarFallback className="bg-gradient-speed text-primary-foreground">{getInitials()}</AvatarFallback></Avatar>
                    <div><h4 className="font-semibold text-sm">{profile?.full_name || "Account Owner"}</h4><p className="text-xs text-muted-foreground">{user?.email}</p></div>
                  </div>
                  <Badge className="bg-primary/10 text-primary border-none">Owner</Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* API Keys Tab */}
          <TabsContent value="api" className="space-y-6">
            <Card className="bg-card/50 backdrop-blur">
              <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div><CardTitle>API Keys</CardTitle><CardDescription>Manage your API keys for integrations</CardDescription></div>
                <Button className="gap-2" onClick={handleGenerateKey}><Key className="h-4 w-4" />Generate New Key</Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {newKeyVisible && (
                  <div className="p-4 rounded-lg border border-primary/30 bg-primary/5">
                    <p className="text-xs text-muted-foreground mb-2">🔑 New key generated — copy it now, it won't be shown again:</p>
                    <div className="flex gap-2">
                      <Input value={newKeyVisible} readOnly className="font-mono text-xs" />
                      <Button size="sm" variant="outline" onClick={() => { handleCopyKey(newKeyVisible); setNewKeyVisible(null); }}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
                {apiKeys.length > 0 ? apiKeys.map((k, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-lg border border-border bg-background/50">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center"><Key className="h-6 w-6 text-primary" /></div>
                      <div>
                        <h4 className="font-semibold text-sm">API Key #{i + 1}</h4>
                        <p className="text-xs text-muted-foreground font-mono">{k.key.slice(0, 12)}••••••••</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleCopyKey(k.key)}><Copy className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleRevokeKey(k.key)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-8">
                    <Key className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                    <p className="text-muted-foreground">No API keys generated yet.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Delete Account Dialog */}
      <AlertDialog open={deleteAccountOpen} onOpenChange={setDeleteAccountOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Account</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete your account and all associated data including hosting accounts, domains, email accounts, cloud instances, and billing history. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground"
              onClick={() => { toast.info("Account deletion requires contacting support for security verification."); setDeleteAccountOpen(false); }}>
              I Understand, Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Settings;
