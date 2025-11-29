"use client";

import { useState, useEffect, useMemo } from "react";
import { ResponsiveSankey } from "@nivo/sankey";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { RippleCalculation, SankeyData } from "@/types/ripple";
import { generateSankeyData } from "@/lib/calculations";
import { ChevronDown, BarChart3 } from "lucide-react";

// Formater tall med norsk locale og tusenskilletegn
const formatNorwegianNumber = (value: number): string => {
  return new Intl.NumberFormat("nb-NO", {
    maximumFractionDigits: 0,
  }).format(value);
};

// Effekttype-konfigurasjon
const EFFECT_TYPES = [
  { id: "Direkte", color: "#5a9fa6", label: "Direkte effekter" },
  { id: "Indirekte", color: "#7a9e7a", label: "Indirekte (leverandører)" },
  { id: "Induserte", color: "#6b74a8", label: "Induserte (forbruk)" },
] as const;

interface SimulatorSankeyProps {
  calculation: RippleCalculation;
  comparison?: {
    baseline: RippleCalculation;
    scenario: RippleCalculation;
  } | null;
  /** Om kortet er kollapset */
  isCollapsed?: boolean;
  /** Callback for å toggle kollaps */
  onToggleCollapse?: () => void;
}

export function SimulatorSankey({ calculation, comparison, isCollapsed = false, onToggleCollapse }: SimulatorSankeyProps) {
  const [mounted, setMounted] = useState(false);
  const [focusedEffect, setFocusedEffect] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Memoize Sankey data generering
  const filteredData = useMemo(() => {
    const sankeyData = generateSankeyData(calculation);
    return {
      nodes: sankeyData.nodes,
      links: sankeyData.links.filter((link) => link.value > 0),
    } as SankeyData;
  }, [calculation]);

  // Filtrer data basert på fokusert effekt
  const displayData = useMemo(() => {
    if (!focusedEffect) return filteredData;

    // Finn relevante noder og links for den fokuserte effekten
    // SankeyLink har source/target som strings i vår type-definisjon
    const relevantLinks = filteredData.links.filter((link) => {
      return link.source.includes(focusedEffect) || link.target.includes(focusedEffect);
    });

    return {
      nodes: filteredData.nodes,
      links: relevantLinks,
    } as SankeyData;
  }, [filteredData, focusedEffect]);

  return (
    <Card className="h-full animate-slide-up overflow-hidden" style={{ animationDelay: "0.15s" }}>
      {/* Collapsible Header */}
      <button
        type="button"
        onClick={onToggleCollapse}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50/50 transition-colors border-b border-slate-100"
        aria-expanded={!isCollapsed}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-sage-100 flex items-center justify-center">
            <BarChart3 size={16} className="text-sage-600" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-800">Ringvirkninger - Pengestrøm</h3>
            <p className="text-xs text-slate-500">Visualisering av hvordan verdiskaping flyter gjennom økonomien</p>
          </div>
        </div>
        <ChevronDown
          size={18}
          className={`text-slate-400 transition-transform duration-200 ${!isCollapsed ? "rotate-180" : ""}`}
        />
      </button>

      {/* Collapsible Content */}
      <div
        className={`grid transition-all duration-300 ease-in-out ${
          !isCollapsed ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="p-4">
        <div className="h-[550px] w-full">
          {mounted ? (
            <ResponsiveSankey
              data={displayData}
              margin={{ top: 20, right: 200, bottom: 30, left: 20 }}
              align="justify"
              colors={(node) => (node as { color?: string }).color || "#3d838b"}
              nodeOpacity={1}
              nodeHoverOpacity={1}
              nodeHoverOthersOpacity={0.35}
              nodeThickness={20}
              nodeSpacing={28}
              nodeBorderWidth={0}
              nodeBorderRadius={3}
              linkOpacity={focusedEffect ? 0.7 : 0.5}
              linkHoverOpacity={0.85}
              linkHoverOthersOpacity={0.1}
              linkContract={3}
              linkBlendMode="multiply"
              enableLinkGradient={true}
              labelPosition="outside"
              labelOrientation="horizontal"
              labelPadding={20}
              label={(node) => `${node.id}`}
              labelTextColor={{
                from: "color",
                modifiers: [["darker", 1]],
              }}
              animate={true}
              motionConfig="gentle"
              nodeTooltip={({ node }) => (
                <div
                  style={{
                    background: "white",
                    padding: "12px 16px",
                    borderRadius: "8px",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                    border: "1px solid #e2e8f0",
                  }}
                >
                  <strong style={{ color: node.color, fontFamily: "var(--font-outfit)" }}>
                    {node.id}
                  </strong>
                  <br />
                  <span style={{ color: "#64748b", fontSize: "13px" }}>
                    Total: <strong style={{ color: "#1e293b" }}>{formatNorwegianNumber(node.value)} mill NOK</strong>
                  </span>
                </div>
              )}
              linkTooltip={({ link }) => (
                <div
                  style={{
                    background: "white",
                    padding: "12px 16px",
                    borderRadius: "8px",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                    border: "1px solid #e2e8f0",
                  }}
                >
                  <div style={{ fontFamily: "var(--font-outfit)", marginBottom: "4px" }}>
                    <span style={{ color: link.source.color }}>{link.source.id}</span>
                    <span style={{ color: "#94a3b8", margin: "0 8px" }}>→</span>
                    <span style={{ color: link.target.color }}>{link.target.id}</span>
                  </div>
                  <span style={{ color: "#64748b", fontSize: "13px" }}>
                    Verdi: <strong style={{ color: "#1e293b" }}>{formatNorwegianNumber(link.value)} mill NOK</strong>
                  </span>
                </div>
              )}
            />
          ) : (
            <div className="h-full bg-slate-100 rounded-lg animate-pulse" />
          )}
        </div>

        {/* Interaktiv Legend */}
        <div className="mt-4 flex flex-wrap gap-2 justify-center text-xs">
          {EFFECT_TYPES.map(({ id, color, label }) => (
            <button
              key={id}
              onClick={() => setFocusedEffect(focusedEffect === id ? null : id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-200 ${
                focusedEffect === id
                  ? "bg-slate-100 ring-2 ring-slate-300 shadow-sm"
                  : focusedEffect
                    ? "opacity-50 hover:opacity-100"
                    : "hover:bg-slate-50"
              }`}
            >
              <span
                className="w-3 h-3 rounded-full transition-transform duration-200"
                style={{
                  backgroundColor: color,
                  transform: focusedEffect === id ? "scale(1.2)" : "scale(1)",
                }}
              />
              <span className="text-slate-600">{label}</span>
            </button>
          ))}
          {focusedEffect && (
            <button
              onClick={() => setFocusedEffect(null)}
              className="px-3 py-1.5 rounded-full text-slate-500 hover:bg-slate-100 transition-colors"
            >
              Vis alle
            </button>
          )}
        </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
