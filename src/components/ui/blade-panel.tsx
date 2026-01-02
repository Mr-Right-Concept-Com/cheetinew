import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

// Blade Panel System - Monzo-inspired sliding panels for quick actions

export type BladeSize = "sm" | "md" | "lg" | "xl" | "full";

interface BladeConfig {
  id: string;
  title: string;
  description?: string;
  content: ReactNode;
  size?: BladeSize;
  onClose?: () => void;
}

interface BladeContextType {
  openBlade: (config: BladeConfig) => void;
  closeBlade: (id?: string) => void;
  closeAllBlades: () => void;
  blades: BladeConfig[];
}

const BladeContext = createContext<BladeContextType | undefined>(undefined);

export function useBlades() {
  const context = useContext(BladeContext);
  if (!context) {
    throw new Error("useBlades must be used within a BladeProvider");
  }
  return context;
}

interface BladeProviderProps {
  children: ReactNode;
}

export function BladeProvider({ children }: BladeProviderProps) {
  const [blades, setBlades] = useState<BladeConfig[]>([]);

  const openBlade = (config: BladeConfig) => {
    setBlades((prev) => {
      // Replace if same ID exists, otherwise add
      const existing = prev.findIndex((b) => b.id === config.id);
      if (existing >= 0) {
        const newBlades = [...prev];
        newBlades[existing] = config;
        return newBlades;
      }
      return [...prev, config];
    });
  };

  const closeBlade = (id?: string) => {
    setBlades((prev) => {
      if (id) {
        const blade = prev.find((b) => b.id === id);
        blade?.onClose?.();
        return prev.filter((b) => b.id !== id);
      }
      // Close the last one
      if (prev.length > 0) {
        prev[prev.length - 1].onClose?.();
        return prev.slice(0, -1);
      }
      return prev;
    });
  };

  const closeAllBlades = () => {
    blades.forEach((b) => b.onClose?.());
    setBlades([]);
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && blades.length > 0) {
        closeBlade();
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [blades]);

  return (
    <BladeContext.Provider value={{ openBlade, closeBlade, closeAllBlades, blades }}>
      {children}
      <BladeStack blades={blades} onClose={closeBlade} />
    </BladeContext.Provider>
  );
}

interface BladeStackProps {
  blades: BladeConfig[];
  onClose: (id: string) => void;
}

function BladeStack({ blades, onClose }: BladeStackProps) {
  const getSizeClass = (size: BladeSize = "md"): string => {
    const sizes: Record<BladeSize, string> = {
      sm: "sm:max-w-sm",
      md: "sm:max-w-md",
      lg: "sm:max-w-lg",
      xl: "sm:max-w-xl",
      full: "sm:max-w-full",
    };
    return sizes[size];
  };

  return (
    <>
      {blades.map((blade, index) => (
        <Sheet key={blade.id} open={true} onOpenChange={() => onClose(blade.id)}>
          <SheetContent
            className={cn(
              "flex flex-col bg-card border-border overflow-y-auto",
              getSizeClass(blade.size),
              // Stack effect - each blade is slightly offset
              index > 0 && "shadow-2xl"
            )}
            style={{
              zIndex: 50 + index,
              // Slight scale effect for stacked blades
              transform: index < blades.length - 1 ? `scale(${0.98 - index * 0.02})` : undefined,
            }}
          >
            <SheetHeader className="flex-shrink-0">
              <div className="flex items-center justify-between">
                <SheetTitle className="text-xl font-bold">{blade.title}</SheetTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onClose(blade.id)}
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              {blade.description && (
                <SheetDescription>{blade.description}</SheetDescription>
              )}
            </SheetHeader>
            <div className="flex-1 overflow-y-auto mt-4">{blade.content}</div>
          </SheetContent>
        </Sheet>
      ))}
    </>
  );
}

// Pre-built blade templates
export function QuickActionBlade({ 
  title, 
  children 
}: { 
  title: string; 
  children: ReactNode 
}) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      {children}
    </div>
  );
}

export function FormBlade({ 
  children, 
  onSubmit 
}: { 
  children: ReactNode; 
  onSubmit?: () => void 
}) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit?.();
      }}
      className="space-y-4"
    >
      {children}
    </form>
  );
}
