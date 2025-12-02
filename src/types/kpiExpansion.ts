import type { KildeRef } from "@/components/ui/SourceTooltip";

export interface TilsvarerMetric {
  label: string;
  value: number;
  unit?: string;
  icon?: string; // Lucide icon name
  category?: "people" | "infrastructure" | "environment" | "transport";
}

export interface KpiExpansionData {
  title: string;
  metrics: TilsvarerMetric[];
  kilde?: KildeRef;
}
