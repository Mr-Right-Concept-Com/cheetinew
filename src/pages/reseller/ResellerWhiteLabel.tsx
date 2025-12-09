import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Palette, Globe, Mail, Image, Type, Eye, Save, Upload, ExternalLink } from "lucide-react";

const ResellerWhiteLabel = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    brandName: "YourHosting",
    tagline: "Premium hosting solutions for everyone",
    primaryColor: "#F8B400",
    secondaryColor: "#1E1E1E",
    customDomain: "yourhosting.com",
    supportEmail: "support@yourhosting.com",
    logoUrl: "",
    faviconUrl: "",
    customCss: "",
    hideCheetiHost: true,
    customFooter: "© 2024 YourHosting. All rights reserved.",
    welcomeMessage: "Welcome to YourHosting! We're excited to have you on board.",
    termsUrl: "https://yourhosting.com/terms",
    privacyUrl: "https://yourhosting.com/privacy",
  });

  const handleSave = () => {
    toast({ title: "Settings Saved", description: "Your white-label settings have been updated successfully." });
  };

  const updateSetting = (key: string, value: string | boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">White-Label Settings</h1>
          <p className="text-muted-foreground">Customize your brand experience for your clients</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <Eye className="h-4 w-4" />
            Preview
          </Button>
          <Button className="gap-2" onClick={handleSave}>
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </div>

      <Tabs defaultValue="branding" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="branding" className="gap-2">
            <Palette className="h-4 w-4" />
            <span className="hidden sm:inline">Branding</span>
          </TabsTrigger>
          <TabsTrigger value="domain" className="gap-2">
            <Globe className="h-4 w-4" />
            <span className="hidden sm:inline">Domain</span>
          </TabsTrigger>
          <TabsTrigger value="emails" className="gap-2">
            <Mail className="h-4 w-4" />
            <span className="hidden sm:inline">Emails</span>
          </TabsTrigger>
          <TabsTrigger value="advanced" className="gap-2">
            <Type className="h-4 w-4" />
            <span className="hidden sm:inline">Advanced</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="branding" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Brand Identity</CardTitle>
              <CardDescription>Configure your brand name, logo, and colors</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Brand Name</Label>
                  <Input value={settings.brandName} onChange={(e) => updateSetting("brandName", e.target.value)} placeholder="Your Company Name" />
                </div>
                <div className="space-y-2">
                  <Label>Tagline</Label>
                  <Input value={settings.tagline} onChange={(e) => updateSetting("tagline", e.target.value)} placeholder="Your catchy tagline" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Primary Color</Label>
                  <div className="flex gap-2">
                    <Input type="color" value={settings.primaryColor} onChange={(e) => updateSetting("primaryColor", e.target.value)} className="w-16 h-10 p-1 cursor-pointer" />
                    <Input value={settings.primaryColor} onChange={(e) => updateSetting("primaryColor", e.target.value)} className="flex-1" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Secondary Color</Label>
                  <div className="flex gap-2">
                    <Input type="color" value={settings.secondaryColor} onChange={(e) => updateSetting("secondaryColor", e.target.value)} className="w-16 h-10 p-1 cursor-pointer" />
                    <Input value={settings.secondaryColor} onChange={(e) => updateSetting("secondaryColor", e.target.value)} className="flex-1" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Logo</Label>
                  <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
                    <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
                    <p className="text-xs text-muted-foreground mt-1">PNG, JPG, SVG up to 2MB</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Favicon</Label>
                  <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
                    <Image className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">Click to upload favicon</p>
                    <p className="text-xs text-muted-foreground mt-1">ICO, PNG 32x32 or 16x16</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">Hide CheetiHost Branding</p>
                  <p className="text-sm text-muted-foreground">Remove all CheetiHost references from client-facing pages</p>
                </div>
                <Switch checked={settings.hideCheetiHost} onCheckedChange={(checked) => updateSetting("hideCheetiHost", checked)} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="domain" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Custom Domain</CardTitle>
              <CardDescription>Use your own domain for the client portal</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Custom Domain</Label>
                <div className="flex gap-2">
                  <Input value={settings.customDomain} onChange={(e) => updateSetting("customDomain", e.target.value)} placeholder="panel.yourdomain.com" />
                  <Button variant="outline">Verify</Button>
                </div>
                <p className="text-sm text-muted-foreground">Point your domain's CNAME record to: reseller.cheetihost.com</p>
              </div>

              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-medium mb-2">DNS Configuration</h4>
                <div className="font-mono text-sm space-y-1">
                  <p><span className="text-muted-foreground">Type:</span> CNAME</p>
                  <p><span className="text-muted-foreground">Name:</span> panel</p>
                  <p><span className="text-muted-foreground">Value:</span> reseller.cheetihost.com</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Terms of Service URL</Label>
                  <Input value={settings.termsUrl} onChange={(e) => updateSetting("termsUrl", e.target.value)} placeholder="https://yourdomain.com/terms" />
                </div>
                <div className="space-y-2">
                  <Label>Privacy Policy URL</Label>
                  <Input value={settings.privacyUrl} onChange={(e) => updateSetting("privacyUrl", e.target.value)} placeholder="https://yourdomain.com/privacy" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="emails" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Email Settings</CardTitle>
              <CardDescription>Customize emails sent to your clients</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Support Email</Label>
                <Input type="email" value={settings.supportEmail} onChange={(e) => updateSetting("supportEmail", e.target.value)} placeholder="support@yourdomain.com" />
              </div>

              <div className="space-y-2">
                <Label>Welcome Message</Label>
                <Textarea value={settings.welcomeMessage} onChange={(e) => updateSetting("welcomeMessage", e.target.value)} placeholder="Welcome message for new clients..." rows={4} />
              </div>

              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-medium mb-2">Email Templates</h4>
                <p className="text-sm text-muted-foreground mb-4">Customize the emails your clients receive</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  <Button variant="outline" size="sm">Welcome</Button>
                  <Button variant="outline" size="sm">Invoice</Button>
                  <Button variant="outline" size="sm">Password Reset</Button>
                  <Button variant="outline" size="sm">Service Alert</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Customization</CardTitle>
              <CardDescription>Add custom CSS and footer content</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Custom Footer Text</Label>
                <Input value={settings.customFooter} onChange={(e) => updateSetting("customFooter", e.target.value)} placeholder="© 2024 Your Company. All rights reserved." />
              </div>

              <div className="space-y-2">
                <Label>Custom CSS</Label>
                <Textarea value={settings.customCss} onChange={(e) => updateSetting("customCss", e.target.value)} placeholder=".custom-class { color: red; }" rows={8} className="font-mono text-sm" />
                <p className="text-sm text-muted-foreground">Add custom CSS to further customize the look and feel</p>
              </div>

              <div className="p-4 border border-amber-500/50 bg-amber-500/10 rounded-lg">
                <h4 className="font-medium text-amber-500 mb-2">⚠️ Advanced Feature</h4>
                <p className="text-sm text-muted-foreground">Custom CSS changes are applied globally. Invalid CSS may break the layout. Use with caution.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ResellerWhiteLabel;