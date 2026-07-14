import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

type Tone = "gold" | "blue" | "cool" | "hot" | "cash" | "lilac" | "coral";

const toneMap: Record<Tone, { bg: string; ring: string }> = {
  gold: { bg: "bg-surface-gold text-surface-gold-foreground", ring: "stroke-[hsl(var(--cheeti-gold))]" },
  blue: { bg: "bg-surface-blue text-surface-blue-foreground", ring: "stroke-[hsl(var(--digital-blue))]" },
  cool: { bg: "bg-surface-cool text-surface-cool-foreground", ring: "stroke-[hsl(var(--success))]" },
  hot: { bg: "bg-surface-hot text-surface-hot-foreground", ring: "stroke-[hsl(var(--destructive))]" },
  cash: { bg: "bg-surface-cash text-surface-cash-foreground", ring: "stroke-foreground" },
  lilac: { bg: "bg-surface-lilac text-surface-lilac-foreground", ring: "stroke-[hsl(262_83%_58%)]" },
  coral: { bg: "bg-surface-coral text-surface-coral-foreground", ring: "stroke-[hsl(14_100%_62%)]" },
};

interface PotCardProps {
  title: string;
  subtitle?: string;
  icon: ReactNode;
  tone?: Tone;
  progress?: number; // 0-100
  progressLabel?: string;
  onClick?: () => void;
  action?: ReactNode;
  className?: string;
}

export function PotCard({
  title,
  subtitle,
  icon,
  tone = "gold",
  progress,
  progressLabel,
  onClick,
  action,
  className,
}: PotCardProps) {
  const t = toneMap[tone];
  const Wrapper = onClick ? "button" : "div";
  const size = 64;
  const stroke = 6;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = progress !== undefined ? c - (Math.min(100, Math.max(0, progress)) / 100) * c : c;

  return (
    <Wrapper
      onClick={onClick}
      className={cn(
        "group w-full text-left rounded-3xl p-5 md:p-6 shadow-float hover:shadow-pot hover:-translate-y-0.5 transition-all monzo-tap",
        t.bg,
        className,
      )}
    >
      <div className="flex items-center gap-4">
        {progress !== undefined ? (
          <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
            <svg width={size} height={size} className="-rotate-90">
              <circle cx={size / 2} cy={size / 2} r={r} strokeWidth={stroke} className="stroke-current opacity-20 fill-none" />
              <circle
                cx={size / 2}
                cy={size / 2}
                r={r}
                strokeWidth={stroke}
                strokeLinecap="round"
                className={cn("fill-none transition-all duration-700", t.ring)}
                strokeDasharray={c}
                strokeDashoffset={offset}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">{icon}</div>
          </div>
        ) : (
          <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-background/40 flex items-center justify-center">
            {icon}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="text-base md:text-lg font-bold leading-tight truncate">{title}</p>
          {subtitle && <p className="text-sm opacity-70 truncate mt-0.5">{subtitle}</p>}
          {progressLabel && <p className="balance text-xs font-semibold mt-1 opacity-80">{progressLabel}</p>}
        </div>
        {action ?? <ChevronRight className="h-5 w-5 opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all flex-shrink-0" />}
      </div>
    </Wrapper>
  );
}
