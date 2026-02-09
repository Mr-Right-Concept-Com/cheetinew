import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import {
  Settings as SettingsIcon,
  User,
  Shield,
  Bell,
  Globe,
  Key,
  Users,
  Smartphone,
  Mail,
  Loader2,
} from "lucide-react";

const Settings = () => {
  const { user, profile, updateProfile } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    company_name: "",
    phone: "",
  });

  // Sync form data when profile loads or changes
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
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
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
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    }
  };

  const getInitials = () => {
    if (profile?.full_name) {
      return profile.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    if (user?.email) {
      return user.email.slice(0, 2).toUpperCase();
    }
    return "U";
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 md:py-8 space-y-6 md:space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Account Settings</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Manage your account preferences and security settings
          </p>
        </div>

        {/* Main Content */}
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
              <CardHeader>
                <CardTitle className="text-lg md:text-xl">Profile Information</CardTitle>
                <CardDescription>Update your personal information and photo</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                  <Avatar className="w-20 h-20 md:w-24 md:h-24">
                    <AvatarImage src={profile?.avatar_url || ""} />
                    <AvatarFallback className="text-xl md:text-2xl bg-gradient-speed text-primary-foreground">
                      {getInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Upload Photo</Button>
                    <Button variant="ghost" size="sm" className="text-destructive">Remove</Button>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="full_name">Full Name</Label>
                    <Input
                      id="full_name"
                      value={formData.full_name}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={user?.email || ""} disabled className="bg-muted" />
                    <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company_name">Company</Label>
                  <Input
                    id="company_name"
                    value={formData.company_name}
                    onChange={handleInputChange}
                    placeholder="Your company name"
                  />
                </div>

                <Button onClick={handleSaveProfile} disabled={isLoading} className="bg-primary">
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <Card className="bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-lg md:text-xl">Password</CardTitle>
                <CardDescription>Change your password to keep your account secure</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input id="currentPassword" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input id="newPassword" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input id="confirmPassword" type="password" />
                </div>
                <Button className="bg-primary">Update Password</Button>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-lg md:text-xl">Two-Factor Authentication</CardTitle>
                <CardDescription>Add an extra layer of security to your account</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 md:space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 md:p-4 rounded-lg border border-border bg-background/50 gap-3">
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Smartphone className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-semibold text-sm md:text-base">Authenticator App</h4>
                      <p className="text-xs md:text-sm text-muted-foreground">
                        Use an app like Google Authenticator
                      </p>
                    </div>
                  </div>
                  <Switch />
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 md:p-4 rounded-lg border border-border bg-background/50 gap-3">
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <Mail className="h-5 w-5 md:h-6 md:w-6 text-accent" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-semibold text-sm md:text-base">Email Verification</h4>
                      <p className="text-xs md:text-sm text-muted-foreground">
                        Receive codes via email
                      </p>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-lg md:text-xl">Active Sessions</CardTitle>
                <CardDescription>Manage devices that are currently logged in</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 md:p-4 rounded-lg border border-border bg-background/50 gap-2">
                  <div className="min-w-0">
                    <h4 className="font-semibold text-sm md:text-base">Current Browser Session</h4>
                    <p className="text-xs md:text-sm text-muted-foreground truncate">Active now</p>
                  </div>
                  <Badge className="bg-primary/10 text-primary border-none whitespace-nowrap">Current</Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card className="bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-lg md:text-xl">Email Notifications</CardTitle>
                <CardDescription>Choose what emails you want to receive</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { title: "Service Updates", desc: "Important updates about your services", checked: true },
                  { title: "Billing Reminders", desc: "Payment due dates and invoices", checked: true },
                  { title: "Marketing Emails", desc: "News, tips, and special offers", checked: false },
                  { title: "Weekly Reports", desc: "Performance summaries and analytics", checked: true },
                ].map((item, i) => (
                  <div key={i} className="flex items-start sm:items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <h4 className="font-semibold text-sm md:text-base">{item.title}</h4>
                      <p className="text-xs md:text-sm text-muted-foreground">
                        {item.desc}
                      </p>
                    </div>
                    <Switch defaultChecked={item.checked} />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-lg md:text-xl">Push Notifications</CardTitle>
                <CardDescription>Manage browser and mobile notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { title: "Downtime Alerts", desc: "Get notified when services go down", checked: true },
                  { title: "Security Alerts", desc: "Login attempts and security events", checked: true },
                ].map((item, i) => (
                  <div key={i} className="flex items-start sm:items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <h4 className="font-semibold text-sm md:text-base">{item.title}</h4>
                      <p className="text-xs md:text-sm text-muted-foreground">
                        {item.desc}
                      </p>
                    </div>
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
                <div>
                  <CardTitle className="text-lg md:text-xl">Team Members</CardTitle>
                  <CardDescription>Invite and manage team members</CardDescription>
                </div>
                <Button className="gap-2 w-full sm:w-auto">
                  <Users className="h-4 w-4" />
                  Invite Member
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 md:p-4 rounded-lg border border-border bg-background/50 gap-3">
                  <div className="flex items-center gap-3 md:gap-4 min-w-0">
                    <Avatar>
                      <AvatarFallback className="bg-gradient-speed text-primary-foreground">
                        {getInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <h4 className="font-semibold text-sm md:text-base truncate">
                        {profile?.full_name || "Account Owner"}
                      </h4>
                      <p className="text-xs md:text-sm text-muted-foreground truncate">{user?.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 md:gap-4 w-full sm:w-auto justify-between sm:justify-end">
                    <Badge className="bg-primary/10 text-primary border-none">Owner</Badge>
                    <Button variant="ghost" size="sm" disabled>Remove</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* API Keys Tab */}
          <TabsContent value="api" className="space-y-6">
            <Card className="bg-card/50 backdrop-blur">
              <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-lg md:text-xl">API Keys</CardTitle>
                  <CardDescription>Manage your API keys for integrations</CardDescription>
                </div>
                <Button className="gap-2 w-full sm:w-auto">
                  <Key className="h-4 w-4" />
                  Generate New Key
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 md:p-4 rounded-lg border border-border bg-background/50 gap-3">
                  <div className="flex items-center gap-3 md:gap-4 min-w-0">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Key className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-semibold text-sm md:text-base">Production API Key</h4>
                      <p className="text-xs md:text-sm text-muted-foreground font-mono truncate">sk_live_••••••••••••4242</p>
                    </div>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <Button variant="outline" size="sm" className="flex-1 sm:flex-none">Copy</Button>
                    <Button variant="ghost" size="sm" className="text-destructive flex-1 sm:flex-none">Revoke</Button>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 md:p-4 rounded-lg border border-border bg-background/50 gap-3">
                  <div className="flex items-center gap-3 md:gap-4 min-w-0">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <Key className="h-5 w-5 md:h-6 md:w-6 text-accent" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-semibold text-sm md:text-base">Development API Key</h4>
                      <p className="text-xs md:text-sm text-muted-foreground font-mono truncate">sk_test_••••••••••••8888</p>
                    </div>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <Button variant="outline" size="sm" className="flex-1 sm:flex-none">Copy</Button>
                    <Button variant="ghost" size="sm" className="text-destructive flex-1 sm:flex-none">Revoke</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;
