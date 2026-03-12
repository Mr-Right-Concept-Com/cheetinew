import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MessageSquare, MapPin, Phone } from "lucide-react";
import { toast } from "sonner";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill in all required fields");
      return;
    }
    setSending(true);
    await new Promise(r => setTimeout(r, 1000));
    setSending(false);
    toast.success("Message sent! We'll get back to you within 24 hours.");
    setForm({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 pt-24 pb-16 max-w-5xl space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold">Contact <span className="text-primary">Us</span></h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <Card>
              <CardHeader><CardTitle>Send a Message</CardTitle></CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Name *</Label>
                      <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Your name" />
                    </div>
                    <div className="space-y-2">
                      <Label>Email *</Label>
                      <Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Subject</Label>
                    <Input value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} placeholder="How can we help?" />
                  </div>
                  <div className="space-y-2">
                    <Label>Message *</Label>
                    <Textarea rows={5} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder="Tell us more..." />
                  </div>
                  <Button type="submit" disabled={sending} className="w-full">
                    {sending ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            {[
              { icon: Mail, title: "Email", detail: "support@cheetihost.com", desc: "We respond within 24 hours" },
              { icon: MessageSquare, title: "Live Chat", detail: "Available 24/7", desc: "Chat with our AI assistant" },
              { icon: Phone, title: "Phone", detail: "+1 (800) CHEETI", desc: "Mon-Fri 9am-6pm EST" },
              { icon: MapPin, title: "Office", detail: "Nairobi, Kenya", desc: "Global headquarters" },
            ].map((item, i) => (
              <Card key={i}>
                <CardContent className="p-4 flex items-start gap-3">
                  <item.icon className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-sm">{item.title}</p>
                    <p className="text-sm text-foreground">{item.detail}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
