import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";

type Tone = "gold" | "blue" | "cool" | "hot" | "cash" | "lilac" | "coral";

const toneMap: Record<Tone, string> = {
  gold: "bg-surface-gold text-surface-gold-foreground",
  blue: "bg-surface-blue text-surface-blue-foreground",
  cool: "bg-surface-cool text-surface-cool-foreground",
  hot: "bg-surface-hot text-surface-hot-foreground",
  cash: "bg-surface-cash text-surface-cash-foreground",
  lilac: "bg-surface-lilac text-surface-lilac-foreground",
  coral: "bg-surface-coral text-surface-coral-foreground",
};

interface BalanceCardProps {
  label: string;
  value: ReactNode;
  hint?: string;
  tone?: Tone;
  icon?: ReactNode;
  trend?: { direction: "up" | "down" | "flat"; label: string };
  onClick?: () => void;
  className?: string;
}

export function BalanceCard({
  label,
  value,
  hint,
  tone = "cash",
  icon,
  trend,
  onClick,
  className,
}: BalanceCardProps) {
  const Wrapper = onClick ? "button" : "div";
  return (
    <Wrapper
      onClick={onClick}
      className={cn(
        "rounded-3xl p-5 md:p-6 text-left w-full transition-all shadow-float hover:shadow-pot hover:-translate-y-0.5 monzo-tap",
        toneMap[tone],
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-medium uppercase tracking-wider opacity-70">{label}</p>
        {icon && <div className="opacity-80">{icon}</div>}
      </div>
      <p className="balance mt-3 text-3xl md:text-4xl lg:text-5xl font-black leading-none">{value}</p>
      <div className="mt-3 flex items-center gap-2 min-h-[1.25rem]">
        {trend && (
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold",
              trend.direction === "up" && "bg-success/15 text-success",
              trend.direction === "down" && "bg-destructive/15 text-destructive",
              trend.direction === "flat" && "bg-muted-foreground/15 text-muted-foreground",
            )}
          >
            {trend.direction === "up" && <ArrowUpRight className="h-3 w-3" />}
            {trend.direction === "down" && <ArrowDownRight className="h-3 w-3" />}
            {trend.direction === "flat" && <Minus className="h-3 w-3" />}
            {trend.label}
          </span>
        )}
        {hint && <p className="text-xs opacity-70">{hint}</p>}
      </div>
    </Wrapper>
  );
}
