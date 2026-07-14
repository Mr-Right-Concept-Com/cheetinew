import { ReactNode } from "react";
import { cn } from "@/lib/utils";

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

interface ActivityRowProps {
  icon: ReactNode;
  title: string;
  subtitle?: string;
  amount?: ReactNode;
  meta?: string;
  tone?: Tone;
  onClick?: () => void;
  className?: string;
}

export function ActivityRow({
  icon,
  title,
  subtitle,
  amount,
  meta,
  tone = "cash",
  onClick,
  className,
}: ActivityRowProps) {
  const Wrapper = onClick ? "button" : "div";
  return (
    <Wrapper
      onClick={onClick}
      className={cn(
        "w-full text-left flex items-center gap-3 md:gap-4 py-3 md:py-4 px-3 md:px-4 rounded-2xl hover:bg-muted/60 transition-colors monzo-tap",
        className,
      )}
    >
      <div className={cn("flex-shrink-0 w-11 h-11 md:w-12 md:h-12 rounded-full flex items-center justify-center", toneMap[tone])}>
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-sm md:text-base truncate">{title}</p>
        {subtitle && <p className="text-xs md:text-sm text-muted-foreground truncate">{subtitle}</p>}
      </div>
      <div className="text-right flex-shrink-0">
        {amount && <p className="balance font-bold text-sm md:text-base">{amount}</p>}
        {meta && <p className="text-xs text-muted-foreground mt-0.5">{meta}</p>}
      </div>
    </Wrapper>
  );
}
