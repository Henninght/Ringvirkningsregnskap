"use client";

import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, ArrowRight } from "lucide-react";
import { ReactNode } from "react";

type KpiVariant = "petrol" | "sage" | "indigo" | "sand";

interface KpiCardProps {
  title: string;
  value: string;
  change: number;
  variant: KpiVariant;
  icon?: ReactNode;
  subtitle?: string;
  className?: string;
  delay?: number;
  changeLabel?: string; // Custom label instead of "%"
}

const variantConfig: Record<
  KpiVariant,
  {
    bg: string;
    border: string;
    accent: string;
    iconBg: string;
    valueColor: string;
  }
> = {
  petrol: {
    bg: "bg-gradient-to-br from-white via-white to-petrol-50/50",
    border: "border-petrol-100",
    accent: "bg-petrol-500",
    iconBg: "bg-petrol-100 text-petrol-600",
    valueColor: "text-petrol-700",
  },
  sage: {
    bg: "bg-gradient-to-br from-white via-white to-sage-50/50",
    border: "border-sage-100",
    accent: "bg-sage-500",
    iconBg: "bg-sage-100 text-sage-600",
    valueColor: "text-sage-700",
  },
  indigo: {
    bg: "bg-gradient-to-br from-white via-white to-indigo-50/50",
    border: "border-indigo-100",
    accent: "bg-indigo-500",
    iconBg: "bg-indigo-100 text-indigo-600",
    valueColor: "text-indigo-700",
  },
  sand: {
    bg: "bg-gradient-to-br from-white via-white to-sand-50/50",
    border: "border-sand-100",
    accent: "bg-sand-500",
    iconBg: "bg-sand-100 text-sand-700",
    valueColor: "text-sand-700",
  },
};

export function KpiCard({
  title,
  value,
  change,
  variant,
  icon,
  subtitle,
  className,
  delay = 0,
  changeLabel,
}: KpiCardProps) {
  const config = variantConfig[variant];
  const isPositive = change >= 0;

  return (
    <div
      className={cn(
        "relative p-5 rounded-xl border shadow-card card-hover animate-slide-up overflow-hidden group",
        config.bg,
        config.border,
        className
      )}
      style={{ animationDelay: `${delay}s` }}
    >
      {/* Subtle accent bar at top */}
      <div className={cn("absolute top-0 left-0 right-0 h-0.5", config.accent)} />

      {/* Header with icon */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-600 truncate">{title}</p>
          {subtitle && (
            <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>
          )}
        </div>
        {icon && (
          <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ml-3", config.iconBg)}>
            {icon}
          </div>
        )}
      </div>

      {/* Value */}
      <div className="flex items-baseline gap-2 mb-3">
        <span
          className={cn("text-2xl font-bold tracking-tight", config.valueColor)}
          style={{ fontFamily: "var(--font-outfit)" }}
        >
          {value}
        </span>
      </div>

      {/* Change indicator and action */}
      <div className="flex items-center justify-between">
        <div
          className={cn(
            "inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium",
            isPositive
              ? "bg-success-50 text-success-700"
              : "bg-sand-50 text-sand-700"
          )}
        >
          {isPositive ? (
            <TrendingUp size={12} strokeWidth={2.5} />
          ) : (
            <TrendingDown size={12} strokeWidth={2.5} />
          )}
          <span>{isPositive ? "+" : ""}{change}{changeLabel ? ` ${changeLabel}` : "%"}</span>
        </div>

        <button
          className="p-1.5 rounded-md text-slate-300 group-hover:text-slate-500 hover:bg-slate-100 transition-all opacity-0 group-hover:opacity-100"
          aria-label="Se detaljer"
        >
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}
