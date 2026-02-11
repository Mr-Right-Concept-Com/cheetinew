import { Navigation } from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";

const CookiePolicy = () => (
  <div className="min-h-screen bg-gradient-hero">
    <Navigation />
    <div className="pt-32 pb-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <Card className="bg-card/50 backdrop-blur">
          <CardContent className="p-8 md:p-12 prose prose-invert max-w-none">
            <h1 className="text-4xl font-bold mb-6">Cookie Policy</h1>
            <p className="text-muted-foreground mb-4">Last updated: February 10, 2026</p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">1. What Are Cookies</h2>
            <p className="text-muted-foreground">Cookies are small text files stored on your device when you visit our website. They help us provide a better user experience.</p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">2. Essential Cookies</h2>
            <p className="text-muted-foreground">These cookies are required for the website to function. They include authentication tokens and session identifiers.</p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">3. Analytics Cookies</h2>
            <p className="text-muted-foreground">We use analytics cookies to understand how visitors interact with our website, helping us improve our services.</p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">4. Managing Cookies</h2>
            <p className="text-muted-foreground">You can control cookies through your browser settings. Disabling certain cookies may limit your ability to use some features.</p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">5. Contact</h2>
            <p className="text-muted-foreground">For questions about our cookie practices, email privacy@cheetihost.com.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
);

export default CookiePolicy;
