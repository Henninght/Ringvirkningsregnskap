"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import * as LucideIcons from "lucide-react";
import type { TilsvarerMetric } from "@/types/kpiExpansion";

type KpiVariant = "petrol" | "sage" | "indigo" | "sand";

interface TilsvarerMetricProps {
  metric: TilsvarerMetric;
  variant: KpiVariant;
  index: number;
}

export function TilsvarerMetric({ metric, variant, index }: TilsvarerMetricProps) {
  // Dynamically get the icon component
  const Icon = metric.icon
    ? (LucideIcons[metric.icon as keyof typeof LucideIcons] as any)
    : LucideIcons.Circle;

  // Format the metric value with Norwegian locale
  const formatValue = (value: number) => {
    if (value >= 1000000) {
      // For very large numbers, show abbreviated with full in tooltip
      return {
        display: new Intl.NumberFormat("nb-NO", {
          notation: "compact",
          compactDisplay: "short",
        }).format(value),
        full: new Intl.NumberFormat("nb-NO").format(value),
      };
    }
    const formatted = new Intl.NumberFormat("nb-NO").format(value);
    return { display: formatted, full: formatted };
  };

  const { display, full } = formatValue(metric.value);
  const showTooltip = display !== full;

  const variantClasses = {
    petrol: "bg-petrol-50 border-petrol-200",
    sage: "bg-sage-50 border-sage-200",
    indigo: "bg-indigo-50 border-indigo-200",
    sand: "bg-sand-50 border-sand-200",
  };

  const iconBgClasses = {
    petrol: "bg-petrol-100 text-petrol-600",
    sage: "bg-sage-100 text-sage-600",
    indigo: "bg-indigo-100 text-indigo-600",
    sand: "bg-sand-100 text-sand-600",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className={cn(
        "rounded-lg p-4 border transition-shadow hover:shadow-md",
        variantClasses[variant]
      )}
      title={showTooltip ? full : undefined}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
            iconBgClasses[variant]
          )}
        >
          {Icon && <Icon size={20} />}
        </div>
        <div className="min-w-0 flex-1">
          <div
            className="text-2xl font-bold text-slate-800 tracking-tight"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            {display}
          </div>
          <div className="text-sm text-slate-600 mt-0.5">{metric.label}</div>
          {metric.unit && (
            <div className="text-xs text-slate-400 mt-0.5">{metric.unit}</div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
