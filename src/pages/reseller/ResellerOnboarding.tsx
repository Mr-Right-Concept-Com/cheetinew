import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Building, 
  Palette, 
  Globe, 
  CreditCard, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  Upload,
  Loader2,
  Rocket,
  Shield,
  DollarSign,
  Users
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

interface OnboardingData {
  // Business Info
  businessName: string;
  businessDescription: string;
  website: string;
  // Branding
  primaryColor: string;
  logoUrl: string;
  brandTagline: string;
  // Custom Domain
  customDomain: string;
  useSubdomain: boolean;
  subdomain: string;
  // Payout
  payoutMethod: string;
  paypalEmail: string;
  bankName: string;
  accountNumber: string;
  // Terms
  agreeTerms: boolean;
  agreeCommission: boolean;
}

const ResellerOnboarding = () => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [data, setData] = useState<OnboardingData>({
    businessName: "",
    businessDescription: "",
    website: "",
    primaryColor: "#F8B400",
    logoUrl: "",
    brandTagline: "",
    customDomain: "",
    useSubdomain: true,
    subdomain: "",
    payoutMethod: "paypal",
    paypalEmail: "",
    bankName: "",
    accountNumber: "",
    agreeTerms: false,
    agreeCommission: false,
  });
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const { profile } = useAuth();

  const totalSteps = 5;
  const progress = (step / totalSteps) * 100;

  const updateData = (field: keyof OnboardingData, value: string | boolean) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return data.businessName.length >= 3;
      case 2:
        return data.primaryColor.length > 0;
      case 3:
        return data.useSubdomain ? data.subdomain.length >= 3 : data.customDomain.length >= 5;
      case 4:
        return data.payoutMethod === "paypal" 
          ? data.paypalEmail.includes("@")
          : data.bankName.length > 0 && data.accountNumber.length > 0;
      case 5:
        return data.agreeTerms && data.agreeCommission;
      default:
        return false;
    }
  };

  const handleSubmit = async () => {
    if (!canProceed()) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast({
      title: "Welcome to the Reseller Program! 🎉",
      description: "Your reseller portal is now active. Start adding clients!",
    });
    
    setIsSubmitting(false);
    navigate("/reseller");
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Building className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Business Information</h2>
              <p className="text-muted-foreground">Tell us about your business</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="businessName">Business Name *</Label>
                <Input
                  id="businessName"
                  placeholder="Your Company Name"
                  value={data.businessName}
                  onChange={(e) => updateData("businessName", e.target.value)}
                  className="mt-1.5"
                />
              </div>
              
              <div>
                <Label htmlFor="businessDescription">Business Description</Label>
                <Textarea
                  id="businessDescription"
                  placeholder="Briefly describe your business..."
                  value={data.businessDescription}
                  onChange={(e) => updateData("businessDescription", e.target.value)}
                  className="mt-1.5"
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="website">Website (Optional)</Label>
                <Input
                  id="website"
                  placeholder="https://yourwebsite.com"
                  value={data.website}
                  onChange={(e) => updateData("website", e.target.value)}
                  className="mt-1.5"
                />
              </div>
            </div>
          </div>
        );
        
      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                <Palette className="h-8 w-8 text-accent" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Brand Customization</h2>
              <p className="text-muted-foreground">Customize your white-label portal</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="primaryColor">Primary Brand Color</Label>
                <div className="flex gap-3 mt-1.5">
                  <Input
                    id="primaryColor"
                    type="color"
                    value={data.primaryColor}
                    onChange={(e) => updateData("primaryColor", e.target.value)}
                    className="w-16 h-10 p-1 cursor-pointer"
                  />
                  <Input
                    value={data.primaryColor}
                    onChange={(e) => updateData("primaryColor", e.target.value)}
                    placeholder="#F8B400"
                    className="flex-1"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="logoUrl">Logo URL (Optional)</Label>
                <div className="flex gap-3 mt-1.5">
                  <Input
                    id="logoUrl"
                    placeholder="https://example.com/logo.png"
                    value={data.logoUrl}
                    onChange={(e) => updateData("logoUrl", e.target.value)}
                    className="flex-1"
                  />
                  <Button variant="outline" size="icon">
                    <Upload className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Recommended: 200x60px, PNG or SVG
                </p>
              </div>
              
              <div>
                <Label htmlFor="brandTagline">Brand Tagline</Label>
                <Input
                  id="brandTagline"
                  placeholder="Your hosting, your way"
                  value={data.brandTagline}
                  onChange={(e) => updateData("brandTagline", e.target.value)}
                  className="mt-1.5"
                />
              </div>
              
              {/* Preview */}
              <Card className="border-dashed">
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground mb-3">Preview</p>
                  <div 
                    className="p-4 rounded-lg flex items-center gap-3"
                    style={{ backgroundColor: `${data.primaryColor}20` }}
                  >
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
                      style={{ backgroundColor: data.primaryColor }}
                    >
                      {data.businessName.charAt(0) || "B"}
                    </div>
                    <div>
                      <p className="font-semibold" style={{ color: data.primaryColor }}>
                        {data.businessName || "Your Business"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {data.brandTagline || "Your tagline here"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );
        
      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto mb-4">
                <Globe className="h-8 w-8 text-blue-500" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Custom Domain</h2>
              <p className="text-muted-foreground">Set up your reseller portal URL</p>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 border rounded-lg">
                <Checkbox
                  id="useSubdomain"
                  checked={data.useSubdomain}
                  onCheckedChange={(checked) => updateData("useSubdomain", checked as boolean)}
                />
                <div className="flex-1">
                  <Label htmlFor="useSubdomain" className="cursor-pointer">Use CheetiHost subdomain (Free)</Label>
                  <p className="text-xs text-muted-foreground">yourname.cheetihost.com</p>
                </div>
                <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                  Free
                </Badge>
              </div>
              
              {data.useSubdomain ? (
                <div>
                  <Label htmlFor="subdomain">Subdomain</Label>
                  <div className="flex items-center gap-2 mt-1.5">
                    <Input
                      id="subdomain"
                      placeholder="yourcompany"
                      value={data.subdomain}
                      onChange={(e) => updateData("subdomain", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                    />
                    <span className="text-muted-foreground whitespace-nowrap">.cheetihost.com</span>
                  </div>
                </div>
              ) : (
                <div>
                  <Label htmlFor="customDomain">Custom Domain</Label>
                  <Input
                    id="customDomain"
                    placeholder="hosting.yourdomain.com"
                    value={data.customDomain}
                    onChange={(e) => updateData("customDomain", e.target.value)}
                    className="mt-1.5"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    You'll need to add a CNAME record pointing to reseller.cheetihost.com
                  </p>
                </div>
              )}
            </div>
          </div>
        );
        
      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                <CreditCard className="h-8 w-8 text-green-500" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Payout Settings</h2>
              <p className="text-muted-foreground">How would you like to receive commissions?</p>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Card 
                  className={`cursor-pointer transition-colors ${data.payoutMethod === "paypal" ? "border-primary bg-primary/5" : "hover:border-primary/50"}`}
                  onClick={() => updateData("payoutMethod", "paypal")}
                >
                  <CardContent className="p-4 text-center">
                    <DollarSign className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                    <p className="font-medium">PayPal</p>
                    <p className="text-xs text-muted-foreground">Instant transfers</p>
                  </CardContent>
                </Card>
                
                <Card 
                  className={`cursor-pointer transition-colors ${data.payoutMethod === "bank" ? "border-primary bg-primary/5" : "hover:border-primary/50"}`}
                  onClick={() => updateData("payoutMethod", "bank")}
                >
                  <CardContent className="p-4 text-center">
                    <Building className="h-8 w-8 mx-auto mb-2 text-green-500" />
                    <p className="font-medium">Bank Transfer</p>
                    <p className="text-xs text-muted-foreground">2-3 business days</p>
                  </CardContent>
                </Card>
              </div>
              
              {data.payoutMethod === "paypal" ? (
                <div>
                  <Label htmlFor="paypalEmail">PayPal Email</Label>
                  <Input
                    id="paypalEmail"
                    type="email"
                    placeholder="your@email.com"
                    value={data.paypalEmail}
                    onChange={(e) => updateData("paypalEmail", e.target.value)}
                    className="mt-1.5"
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="bankName">Bank Name</Label>
                    <Input
                      id="bankName"
                      placeholder="Bank of America"
                      value={data.bankName}
                      onChange={(e) => updateData("bankName", e.target.value)}
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label htmlFor="accountNumber">Account Number</Label>
                    <Input
                      id="accountNumber"
                      placeholder="XXXX-XXXX-XXXX"
                      value={data.accountNumber}
                      onChange={(e) => updateData("accountNumber", e.target.value)}
                      className="mt-1.5"
                    />
                  </div>
                </div>
              )}
              
              <Card className="bg-muted/50">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Secure Payments</p>
                      <p className="text-xs text-muted-foreground">
                        Your payment information is encrypted and securely stored. Payouts are processed on the 1st and 15th of each month.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );
        
      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Rocket className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Ready to Launch!</h2>
              <p className="text-muted-foreground">Review and confirm your settings</p>
            </div>
            
            {/* Summary */}
            <div className="space-y-4">
              <Card>
                <CardContent className="p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Business Name</span>
                    <span className="font-medium">{data.businessName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Portal URL</span>
                    <span className="font-medium">
                      {data.useSubdomain 
                        ? `${data.subdomain}.cheetihost.com` 
                        : data.customDomain}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Payout Method</span>
                    <span className="font-medium capitalize">{data.payoutMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Commission Rate</span>
                    <span className="font-medium text-green-500">25%</span>
                  </div>
                </CardContent>
              </Card>
              
              {/* Benefits */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 border rounded-lg">
                  <DollarSign className="h-6 w-6 mx-auto mb-1 text-primary" />
                  <p className="text-2xl font-bold">25%</p>
                  <p className="text-xs text-muted-foreground">Commission</p>
                </div>
                <div className="text-center p-3 border rounded-lg">
                  <Users className="h-6 w-6 mx-auto mb-1 text-accent" />
                  <p className="text-2xl font-bold">∞</p>
                  <p className="text-xs text-muted-foreground">Clients</p>
                </div>
                <div className="text-center p-3 border rounded-lg">
                  <Globe className="h-6 w-6 mx-auto mb-1 text-blue-500" />
                  <p className="text-2xl font-bold">24/7</p>
                  <p className="text-xs text-muted-foreground">Support</p>
                </div>
              </div>
              
              {/* Terms */}
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 border rounded-lg">
                  <Checkbox
                    id="agreeTerms"
                    checked={data.agreeTerms}
                    onCheckedChange={(checked) => updateData("agreeTerms", checked as boolean)}
                  />
                  <Label htmlFor="agreeTerms" className="cursor-pointer text-sm leading-relaxed">
                    I agree to the Reseller Terms of Service and Privacy Policy
                  </Label>
                </div>
                
                <div className="flex items-start gap-3 p-3 border rounded-lg">
                  <Checkbox
                    id="agreeCommission"
                    checked={data.agreeCommission}
                    onCheckedChange={(checked) => updateData("agreeCommission", checked as boolean)}
                  />
                  <Label htmlFor="agreeCommission" className="cursor-pointer text-sm leading-relaxed">
                    I understand that I will earn 25% commission on all sales and payouts are processed bi-monthly
                  </Label>
                </div>
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center pb-2">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
              Reseller Program
            </Badge>
          </div>
          <CardTitle className="text-lg">Step {step} of {totalSteps}</CardTitle>
          <Progress value={progress} className="mt-4" />
        </CardHeader>
        
        <CardContent className="pt-6">
          {renderStep()}
          
          <div className="flex justify-between mt-8 pt-6 border-t">
            <Button
              variant="outline"
              onClick={() => setStep(s => s - 1)}
              disabled={step === 1}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            
            {step < totalSteps ? (
              <Button
                onClick={() => setStep(s => s + 1)}
                disabled={!canProceed()}
                className="gap-2"
              >
                Continue
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!canProceed() || isSubmitting}
                className="gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Setting up...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    Complete Setup
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResellerOnboarding;