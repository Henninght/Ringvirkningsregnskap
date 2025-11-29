"use client";

import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface HeroStatProps {
  /** Tittel over hovedverdien */
  title: string;
  /** Hovedverdien som vises stort */
  value: string;
  /** Beskrivelse under hovedverdien */
  description?: string;
  /** Sekundær verdi ved siden av hovedverdien */
  secondaryValue?: string;
  /** Beskrivelse av sekundær verdi */
  secondaryDescription?: string;
  /** Ikon som vises ved siden av tittelen */
  icon?: ReactNode;
  /** Fargeskjema */
  variant?: "petrol" | "coral" | "mint" | "sand" | "slate";
  /** Ekstra CSS-klasser */
  className?: string;
}

const variantConfig = {
  petrol: {
    bg: "bg-gradient-to-br from-petrol-50 to-petrol-100/50",
    border: "border-petrol-200",
    title: "text-petrol-700",
    value: "text-petrol-600",
    icon: "text-petrol-500",
  },
  coral: {
    bg: "bg-gradient-to-br from-coral-50 to-coral-100/50",
    border: "border-coral-200",
    title: "text-coral-700",
    value: "text-coral-600",
    icon: "text-coral-500",
  },
  mint: {
    bg: "bg-gradient-to-br from-mint-50 to-mint-100/50",
    border: "border-mint-200",
    title: "text-mint-700",
    value: "text-mint-600",
    icon: "text-mint-500",
  },
  sand: {
    bg: "bg-gradient-to-br from-sand-50 to-sand-100/50",
    border: "border-sand-200",
    title: "text-sand-700",
    value: "text-sand-600",
    icon: "text-sand-500",
  },
  slate: {
    bg: "bg-gradient-to-br from-slate-50 to-slate-100/50",
    border: "border-slate-200",
    title: "text-slate-700",
    value: "text-slate-800",
    icon: "text-slate-500",
  },
};

export function HeroStat({
  title,
  value,
  description,
  secondaryValue,
  secondaryDescription,
  icon,
  variant = "petrol",
  className,
}: HeroStatProps) {
  const colors = variantConfig[variant];

  return (
    <div
      className={cn(
        "rounded-xl border p-6 mb-6 animate-slide-up",
        colors.bg,
        colors.border,
        className
      )}
    >
      {/* Tittel-rad */}
      <div className={cn("flex items-center gap-2 mb-3", colors.title)}>
        {icon && <span className={colors.icon}>{icon}</span>}
        <span className="text-sm font-medium uppercase tracking-wide">
          {title}
        </span>
      </div>

      {/* Verdier */}
      <div className="flex items-baseline justify-between flex-wrap gap-4">
        {/* Hovedverdi */}
        <div>
          <div
            className={cn("text-4xl font-bold", colors.value)}
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            {value}
          </div>
          {description && (
            <div className="text-sm text-slate-500 mt-1">{description}</div>
          )}
        </div>

        {/* Sekundær verdi */}
        {secondaryValue && (
          <div className="text-right">
            <div
              className={cn("text-2xl font-semibold", colors.value)}
              style={{ fontFamily: "var(--font-outfit)" }}
            >
              {secondaryValue}
            </div>
            {secondaryDescription && (
              <div className="text-sm text-slate-500 mt-1">
                {secondaryDescription}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
