import type { KildeRef } from "@/components/ui/SourceTooltip";

export interface TilsvarerMetric {
  label: string;
  value: number | string;
  unit?: string;
  icon?: string; // Lucide icon name
  category?: string;
  kilde?: KildeRef; // Per-metric source reference
}

export interface KpiExpansionData {
  title: string;
  metrics: TilsvarerMetric[];
  kilde?: KildeRef; // Fallback source for the entire section
}
