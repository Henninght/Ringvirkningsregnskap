"use client";

import { TilsvarerMetric as TilsvarerMetricComponent } from "./TilsvarerMetric";
import type { TilsvarerMetric } from "@/types/kpiExpansion";

type KpiVariant = "petrol" | "sage" | "indigo" | "sand";

interface TilsvarerGridProps {
  metrics: TilsvarerMetric[];
  variant: KpiVariant;
  title?: string;
}

export function TilsvarerGrid({ metrics, variant, title }: TilsvarerGridProps) {
  return (
    <div className="space-y-4">
      {title && (
        <h4 className="text-base font-semibold text-slate-700">{title}</h4>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.map((metric, index) => (
          <TilsvarerMetricComponent
            key={metric.label}
            metric={metric}
            variant={variant}
            index={index}
          />
        ))}
      </div>
    </div>
  );
}
