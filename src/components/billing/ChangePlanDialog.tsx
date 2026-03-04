import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { CheckCircle } from "lucide-react";

interface Props { open: boolean; onOpenChange: (open: boolean) => void; currentPlanName?: string; }

export const ChangePlanDialog = ({ open, onOpenChange, currentPlanName }: Props) => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const { data: plans, isLoading } = useQuery({
    queryKey: ["plans"],
    queryFn: async () => {
      const { data, error } = await supabase.from("plans").select("*").eq("is_active", true).order("sort_order");
      if (error) throw error;
      return data;
    },
    enabled: open,
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader><DialogTitle>Change Plan</DialogTitle><DialogDescription>Select a new plan. Current: {currentPlanName || "None"}</DialogDescription></DialogHeader>
        <div className="space-y-3 py-4 max-h-[400px] overflow-y-auto">
          {isLoading ? [1, 2, 3].map(i => <Skeleton key={i} className="h-20 w-full" />) : plans?.map(plan => (
            <div key={plan.id} onClick={() => setSelectedPlan(plan.id)} className={`p-4 rounded-lg border cursor-pointer transition-all ${selectedPlan === plan.id ? "border-primary bg-primary/5" : "hover:border-primary/50"}`}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold">{plan.name}</h4>
                    {plan.is_featured && <Badge className="bg-primary/10 text-primary border-none text-[10px]">Popular</Badge>}
                    {plan.name === currentPlanName && <Badge variant="outline" className="text-[10px]">Current</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold">${plan.price_monthly}<span className="text-sm font-normal text-muted-foreground">/mo</span></p>
                  {selectedPlan === plan.id && <CheckCircle className="h-5 w-5 text-primary inline" />}
                </div>
              </div>
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button disabled={!selectedPlan} onClick={() => { toast.success("Plan change request submitted!"); onOpenChange(false); }} className="w-full">
            Confirm Plan Change
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
