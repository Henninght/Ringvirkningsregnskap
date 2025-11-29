"use client";

import { useState, useEffect, useMemo } from "react";
import { ResponsiveSankey } from "@nivo/sankey";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";

// Formater tall med norsk locale og tusenskilletegn
const formatNorwegianNumber = (value: number): string => {
  return new Intl.NumberFormat("nb-NO", {
    maximumFractionDigits: 0,
  }).format(value);
};

// Sankey data for ringvirkningsregnskap
// Viser pengestrøm fra organisasjon til samfunnet
// NSF Professional Color Scheme
const sankeyData = {
  nodes: [
    // Kilde (venstre) - Primary petrol
    { id: "Verdiskaping", color: "#3d838b" },

    // Mellomliggende (midt) - Effect types
    { id: "Direkte effekter", color: "#5a9fa6" },
    { id: "Indirekte effekter", color: "#7a9e7a" },
    { id: "Induserte effekter", color: "#6b74a8" },

    // Destinasjoner (hoyre) - Outcomes
    { id: "Lønninger", color: "#5c825c" },
    { id: "Leverandører", color: "#8bbfc3" },
    { id: "Skatter", color: "#d9a04a" },
    { id: "Lokalsamfunn", color: "#a3bda3" },
    { id: "Helse & omsorg", color: "#8b94bf" },
    { id: "Investeringer", color: "#336b73" },
  ],
  links: [
    // Fra Verdiskaping til mellomliggende
    { source: "Verdiskaping", target: "Direkte effekter", value: 500 },
    { source: "Verdiskaping", target: "Indirekte effekter", value: 250 },
    { source: "Verdiskaping", target: "Induserte effekter", value: 150 },

    // Fra Direkte effekter til destinasjoner
    { source: "Direkte effekter", target: "Lønninger", value: 280 },
    { source: "Direkte effekter", target: "Skatter", value: 120 },
    { source: "Direkte effekter", target: "Investeringer", value: 100 },

    // Fra Indirekte effekter til destinasjoner
    { source: "Indirekte effekter", target: "Leverandører", value: 150 },
    { source: "Indirekte effekter", target: "Skatter", value: 60 },
    { source: "Indirekte effekter", target: "Lokalsamfunn", value: 40 },

    // Fra Induserte effekter til destinasjoner
    { source: "Induserte effekter", target: "Lokalsamfunn", value: 80 },
    { source: "Induserte effekter", target: "Helse & omsorg", value: 50 },
    { source: "Induserte effekter", target: "Skatter", value: 20 },
  ],
};

export function SankeyDiagram() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Memoize Sankey data for bedre ytelse
  const memoizedData = useMemo(() => sankeyData, []);

  return (
    <Card className="col-span-2 animate-slide-up" style={{ animationDelay: "0.1s" }}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle size="lg">Ringvirkninger - Pengestrøm</CardTitle>
            <p className="text-xs text-slate-500 mt-1">
              Visualisering av hvordan verdiskaping flyter gjennom økonomien
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#5a9fa6]" />
              <span className="text-slate-500">Direkte</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#7a9e7a]" />
              <span className="text-slate-500">Indirekte</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#6b74a8]" />
              <span className="text-slate-500">Induserte</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full">
          {mounted ? (
            <ResponsiveSankey
              data={memoizedData}
              margin={{ top: 20, right: 160, bottom: 20, left: 20 }}
              align="justify"
              colors={(node) => (node as { color?: string }).color || "#3d838b"}
              nodeOpacity={1}
              nodeHoverOpacity={1}
              nodeHoverOthersOpacity={0.35}
              nodeThickness={18}
              nodeSpacing={24}
              nodeBorderWidth={0}
              nodeBorderRadius={3}
              linkOpacity={0.5}
              linkHoverOpacity={0.8}
              linkHoverOthersOpacity={0.1}
              linkContract={3}
              linkBlendMode="multiply"
              enableLinkGradient={true}
              labelPosition="outside"
              labelOrientation="horizontal"
              labelPadding={16}
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
      </CardContent>
    </Card>
  );
}
