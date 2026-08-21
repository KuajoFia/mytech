"use client";

import { cn } from "@/lib/utils";
import { ShoppingCart, FileText, CreditCard, CheckCircle2 } from "lucide-react";

type Step = {
  id: number;
  label: string;
  icon: React.ElementType;
};

const STEPS: Step[] = [
  { id: 1, label: "Panier", icon: ShoppingCart },
  { id: 2, label: "Coordonnées", icon: FileText },
  { id: 3, label: "Paiement", icon: CreditCard },
  { id: 4, label: "Confirmation", icon: CheckCircle2 },
];

type CheckoutStepperProps = {
  /** Current step (1-indexed). */
  current: 1 | 2 | 3 | 4;
};

export function CheckoutStepper({ current }: CheckoutStepperProps) {
  return (
    <nav aria-label="Étapes du paiement" className="w-full">
      <ol className="flex items-center justify-between max-w-2xl mx-auto">
        {STEPS.map((step, idx) => {
          const isDone = step.id < current;
          const isCurrent = step.id === current;
          const isLast = idx === STEPS.length - 1;
          const Icon = step.icon;

          return (
            <li key={step.id} className={cn("flex items-center", !isLast && "flex-1")}>
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={cn(
                    "inline-flex items-center justify-center rounded-full transition-all duration-300",
                    "h-9 w-9 md:h-10 md:w-10 border-2",
                    isDone && "bg-brand border-brand text-white",
                    isCurrent && "bg-accent-yellow border-accent-yellow text-black animate-fade-in-scale",
                    !isDone && !isCurrent && "bg-white border-border text-muted-foreground"
                  )}
                  aria-current={isCurrent ? "step" : undefined}
                >
                  <Icon className="h-4 w-4 md:h-5 md:w-5" />
                </div>
                <span
                  className={cn(
                    "text-[10px] md:text-xs font-medium tracking-tight",
                    isCurrent ? "text-brand" : isDone ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {step.label}
                </span>
              </div>

              {!isLast && (
                <div className="flex-1 h-0.5 mx-2 md:mx-3 -mt-5 bg-border relative overflow-hidden">
                  <div
                    className={cn(
                      "absolute inset-0 bg-brand transition-transform duration-500 origin-left",
                      isDone ? "scale-x-100" : "scale-x-0"
                    )}
                  />
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
