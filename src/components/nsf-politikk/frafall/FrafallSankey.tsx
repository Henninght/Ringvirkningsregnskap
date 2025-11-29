"use client";

import { useState, useEffect, useMemo } from "react";
import { ResponsiveSankey } from "@nivo/sankey";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { FrafallBeregning, FRAFALL_KATEGORI_LABELS, FRAFALL_KATEGORI_FARGER } from "@/types/frafall";
import { genererFrafallSankeyData, formaterFrafallVerdi } from "@/lib/frafallCalculations";
import { GitBranch } from "lucide-react";

interface FrafallSankeyProps {
  beregning: FrafallBeregning;
}

export function FrafallSankey({ beregning }: FrafallSankeyProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const sankeyData = useMemo(() => {
    return genererFrafallSankeyData(beregning);
  }, [beregning]);

  // Sjekk om det er data å vise
  const hasData = sankeyData.links.some((link) => link.value > 0);

  return (
    <Card className="animate-slide-up">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GitBranch size={18} className="text-petrol-500" />
          Hvor går sykepleierne?
        </CardTitle>
        <p className="text-sm text-slate-500 mt-1">
          Fordeling av {formaterFrafallVerdi(beregning.aarligFrafall, "antall")} som slutter årlig
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-[280px] w-full">
          {mounted && hasData ? (
            <ResponsiveSankey
              data={sankeyData}
              margin={{ top: 20, right: 160, bottom: 20, left: 20 }}
              align="justify"
              colors={(node) => (node as { color?: string }).color || "#3d838b"}
              nodeOpacity={1}
              nodeHoverOpacity={1}
              nodeHoverOthersOpacity={0.35}
              nodeThickness={20}
              nodeSpacing={28}
              nodeBorderWidth={0}
              nodeBorderRadius={4}
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
                    Antall: <strong style={{ color: "#1e293b" }}>{node.value} sykepleiere</strong>
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
                    Antall: <strong style={{ color: "#1e293b" }}>{link.value} sykepleiere</strong>
                  </span>
                </div>
              )}
            />
          ) : mounted ? (
            <div className="h-full flex items-center justify-center text-slate-400">
              <p>Ingen frafall med nåværende innstillinger</p>
            </div>
          ) : (
            <div className="h-full bg-slate-100 rounded-lg animate-pulse" />
          )}
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap gap-3 justify-center text-xs">
          {Object.entries(FRAFALL_KATEGORI_LABELS).map(([key, label]) => (
            <div key={key} className="flex items-center gap-1.5">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: FRAFALL_KATEGORI_FARGER[key as keyof typeof FRAFALL_KATEGORI_FARGER] }}
              />
              <span className="text-slate-600">{label}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
