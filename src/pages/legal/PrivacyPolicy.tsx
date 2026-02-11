import { Navigation } from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";

const PrivacyPolicy = () => (
  <div className="min-h-screen bg-gradient-hero">
    <Navigation />
    <div className="pt-32 pb-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <Card className="bg-card/50 backdrop-blur">
          <CardContent className="p-8 md:p-12 prose prose-invert max-w-none">
            <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>
            <p className="text-muted-foreground mb-4">Last updated: February 10, 2026</p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">1. Information We Collect</h2>
            <p className="text-muted-foreground">We collect information you provide directly, such as your name, email address, billing information, and any content you upload to our hosting services. We also collect usage data automatically through cookies and similar technologies.</p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">2. How We Use Your Information</h2>
            <p className="text-muted-foreground">We use collected information to provide, maintain, and improve our hosting services, process payments, send service notifications, and comply with legal obligations.</p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">3. Data Security</h2>
            <p className="text-muted-foreground">We implement industry-standard security measures including encryption at rest and in transit, regular security audits, and access controls to protect your data.</p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">4. Data Retention</h2>
            <p className="text-muted-foreground">We retain your data for as long as your account is active. Upon account deletion, we remove personal data within 30 days, except where required by law.</p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">5. Your Rights</h2>
            <p className="text-muted-foreground">You have the right to access, correct, delete, or export your personal data. Contact us at privacy@cheetihost.com to exercise these rights.</p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">6. Contact Us</h2>
            <p className="text-muted-foreground">For privacy-related inquiries, email privacy@cheetihost.com.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
);

export default PrivacyPolicy;
