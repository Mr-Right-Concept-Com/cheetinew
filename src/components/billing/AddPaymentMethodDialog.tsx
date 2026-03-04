import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface Props { open: boolean; onOpenChange: (open: boolean) => void; }

export const AddPaymentMethodDialog = ({ open, onOpenChange }: Props) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ type: "card", brand: "Visa", lastFour: "", expMonth: "", expYear: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!form.lastFour || !form.expMonth || !form.expYear) { toast.error("Please fill all fields"); return; }
    if (form.lastFour.length !== 4 || !/^\d{4}$/.test(form.lastFour)) { toast.error("Last 4 digits must be exactly 4 numbers"); return; }
    setLoading(true);
    try {
      const { error } = await supabase.from("payment_methods").insert({
        user_id: user!.id, type: form.type, brand: form.brand, last_four: form.lastFour,
        exp_month: parseInt(form.expMonth), exp_year: parseInt(form.expYear), is_default: false,
      });
      if (error) throw error;
      queryClient.invalidateQueries({ queryKey: ["payment-methods"] });
      toast.success("Payment method added!");
      onOpenChange(false);
      setForm({ type: "card", brand: "Visa", lastFour: "", expMonth: "", expYear: "" });
    } catch (e: any) { toast.error(e.message); } finally { setLoading(false); }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle>Add Payment Method</DialogTitle><DialogDescription>Add a new card for billing</DialogDescription></DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Card Brand</Label>
            <Select value={form.brand} onValueChange={v => setForm(p => ({ ...p, brand: v }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {["Visa", "Mastercard", "Amex", "Discover"].map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2"><Label>Last 4 Digits</Label><Input maxLength={4} placeholder="1234" value={form.lastFour} onChange={e => setForm(p => ({ ...p, lastFour: e.target.value.replace(/\D/g, "").slice(0, 4) }))} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2"><Label>Exp Month</Label><Input type="number" min={1} max={12} placeholder="MM" value={form.expMonth} onChange={e => setForm(p => ({ ...p, expMonth: e.target.value }))} /></div>
            <div className="space-y-2"><Label>Exp Year</Label><Input type="number" min={2026} max={2040} placeholder="YYYY" value={form.expYear} onChange={e => setForm(p => ({ ...p, expYear: e.target.value }))} /></div>
          </div>
        </div>
        <DialogFooter><Button onClick={handleSubmit} disabled={loading} className="w-full">{loading ? "Adding..." : "Add Payment Method"}</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
