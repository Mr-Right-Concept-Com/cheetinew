import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Mail, Lock, User, AlertCircle, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { usePageMeta } from "@/hooks/usePageMeta";
import { signupSchema } from "@/lib/validations";
import logoFull from "@/assets/logo-full.png";

const getPasswordStrength = (pw: string) => {
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score;
};

const Signup = () => {
  usePageMeta("Create Account", "Sign up for a free CheetiHost account");
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signup, user, isLoading: authLoading } = useAuth();
  const [formData, setFormData] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  useEffect(() => { if (user && !authLoading) navigate("/dashboard"); }, [user, authLoading, navigate]);

  const pwStrength = getPasswordStrength(formData.password);
  const pwLabel = ["", "Weak", "Fair", "Good", "Strong", "Very Strong"][pwStrength] || "";
  const pwColor = pwStrength <= 1 ? "bg-destructive" : pwStrength <= 2 ? "bg-yellow-500" : "bg-green-500";

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    const result = signupSchema.safeParse({ ...formData, agreedToTerms });
    if (!result.success) {
      const errs: Record<string, string> = {};
      result.error.issues.forEach(i => { errs[i.path[0] as string] = i.message; });
      setFieldErrors(errs);
      return;
    }

    setIsLoading(true);
    const { error: signupError } = await signup(formData.email, formData.password, formData.name);
    if (signupError) {
      setError(signupError.message?.includes("already registered") ? "This email is already registered. Please sign in instead." : signupError.message || "Failed to create account.");
      setIsLoading(false);
      return;
    }
    toast({ title: "Account Created!", description: "Please check your email to verify your account." });
    setIsLoading(false);
  };

  if (authLoading) {
    return <div className="min-h-screen bg-gradient-hero flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div></div>;
  }

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-card/80 backdrop-blur">
        <CardHeader className="space-y-1 text-center">
          <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 mx-auto"><ArrowLeft className="h-4 w-4" />Back to Home</Link>
          <div className="flex justify-center mb-4"><img src={logoFull} alt="CheetiHost" className="h-12" /></div>
          <CardTitle className="text-2xl font-bold">Create Your Account</CardTitle>
          <CardDescription>Start your hosting journey with CheetiHost</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && <Alert variant="destructive"><AlertCircle className="h-4 w-4" /><AlertDescription>{error}</AlertDescription></Alert>}
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative"><User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input id="name" placeholder="John Doe" className="pl-10" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} disabled={isLoading} /></div>
              {fieldErrors.name && <p className="text-xs text-destructive">{fieldErrors.name}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input id="email" type="email" placeholder="you@example.com" className="pl-10" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} disabled={isLoading} /></div>
              {fieldErrors.email && <p className="text-xs text-destructive">{fieldErrors.email}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input id="password" type="password" placeholder="••••••••" className="pl-10" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} disabled={isLoading} /></div>
              {formData.password && (
                <div className="space-y-1">
                  <div className="flex items-center gap-2"><Progress value={pwStrength * 20} className={`h-1.5 flex-1 [&>div]:${pwColor}`} /><span className="text-xs text-muted-foreground">{pwLabel}</span></div>
                </div>
              )}
              {fieldErrors.password && <p className="text-xs text-destructive">{fieldErrors.password}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input id="confirmPassword" type="password" placeholder="••••••••" className="pl-10" value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} disabled={isLoading} /></div>
              {fieldErrors.confirmPassword && <p className="text-xs text-destructive">{fieldErrors.confirmPassword}</p>}
            </div>
            <div className="flex items-start space-x-2">
              <Checkbox id="terms" checked={agreedToTerms} onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)} />
              <label htmlFor="terms" className="text-sm leading-none">I agree to the{" "}<Link to="/terms" className="text-primary hover:underline">Terms of Service</Link>{" "}and{" "}<Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link></label>
            </div>
            {fieldErrors.agreedToTerms && <p className="text-xs text-destructive">{fieldErrors.agreedToTerms}</p>}
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isLoading}>{isLoading ? "Creating account..." : "Create Account"}</Button>
          </form>
          <div className="relative"><div className="absolute inset-0 flex items-center"><Separator /></div><div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">Already have an account?</span></div></div>
          <div className="text-center text-sm">Already have an account?{" "}<Link to="/auth/login" className="text-primary hover:underline font-semibold">Sign in</Link></div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Signup;
