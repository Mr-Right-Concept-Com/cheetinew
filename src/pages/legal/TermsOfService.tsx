import { Navigation } from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";

const TermsOfService = () => (
  <div className="min-h-screen bg-gradient-hero">
    <Navigation />
    <div className="pt-32 pb-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <Card className="bg-card/50 backdrop-blur">
          <CardContent className="p-8 md:p-12 prose prose-invert max-w-none">
            <h1 className="text-4xl font-bold mb-6">Terms of Service</h1>
            <p className="text-muted-foreground mb-4">Last updated: February 10, 2026</p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground">By accessing or using CheetiHost services, you agree to be bound by these Terms of Service. If you do not agree, do not use our services.</p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">2. Services</h2>
            <p className="text-muted-foreground">CheetiHost provides web hosting, cloud computing, domain registration, email hosting, and related services. We reserve the right to modify or discontinue services with notice.</p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">3. User Responsibilities</h2>
            <p className="text-muted-foreground">You are responsible for maintaining the security of your account, complying with applicable laws, and ensuring your hosted content does not violate our Acceptable Use Policy.</p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">4. Payment Terms</h2>
            <p className="text-muted-foreground">Services are billed according to the selected plan. Payments are due at the beginning of each billing cycle. Failure to pay may result in service suspension.</p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">5. Service Level Agreement</h2>
            <p className="text-muted-foreground">We guarantee 99.9% uptime for all hosting services. If we fail to meet this guarantee, affected customers are eligible for service credits.</p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">6. Limitation of Liability</h2>
            <p className="text-muted-foreground">CheetiHost shall not be liable for indirect, incidental, or consequential damages. Our total liability shall not exceed the amount paid by you in the preceding 12 months.</p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">7. Contact</h2>
            <p className="text-muted-foreground">For questions about these terms, email legal@cheetihost.com.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
);

export default TermsOfService;
