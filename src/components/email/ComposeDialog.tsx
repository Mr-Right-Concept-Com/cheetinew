import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Send, Paperclip } from "lucide-react";
import { toast } from "sonner";

interface ComposeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fromAddress?: string;
}

export function ComposeDialog({ open, onOpenChange, fromAddress }: ComposeDialogProps) {
  const [form, setForm] = useState({
    to: "",
    cc: "",
    subject: "",
    body: "",
  });
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!form.to.trim() || !form.subject.trim()) {
      toast.error("To and Subject fields are required");
      return;
    }
    setSending(true);
    // Simulate sending — in production this would call an edge function
    await new Promise(r => setTimeout(r, 1000));
    setSending(false);
    toast.info(
      "Email sending is handled by your mail provider. Configure SMTP in your hosting panel to send emails.",
      { duration: 5000 }
    );
    setForm({ to: "", cc: "", subject: "", body: "" });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Compose Email</DialogTitle>
          <DialogDescription>
            {fromAddress ? `Sending from ${fromAddress}` : "Create a new email message"}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>To</Label>
            <Input
              placeholder="recipient@example.com"
              value={form.to}
              onChange={(e) => setForm({ ...form, to: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>CC</Label>
            <Input
              placeholder="cc@example.com (optional)"
              value={form.cc}
              onChange={(e) => setForm({ ...form, cc: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Subject</Label>
            <Input
              placeholder="Email subject"
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Message</Label>
            <Textarea
              placeholder="Write your message..."
              rows={6}
              value={form.body}
              onChange={(e) => setForm({ ...form, body: e.target.value })}
            />
          </div>
          <div className="flex items-center justify-between pt-2">
            <Button variant="ghost" size="sm" className="gap-2">
              <Paperclip className="h-4 w-4" />
              Attach
            </Button>
            <Button onClick={handleSend} disabled={sending} className="gap-2">
              <Send className="h-4 w-4" />
              {sending ? "Sending..." : "Send"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
