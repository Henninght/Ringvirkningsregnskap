"use client";

import { useState, useEffect, useMemo } from "react";
import { ResponsiveSankey } from "@nivo/sankey";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { SourceTooltip } from "@/components/ui/SourceTooltip";
import { InfoTooltip } from "@/components/ui/InfoTooltip";
import { KILDER } from "@/lib/eidsiva/eidsivaData";
import { EIDSIVA_DESCRIPTIONS } from "@/lib/eidsiva/eidsivaDescriptions";
import { EIDSIVA_COLORS } from "@/types/eidsiva";

// Formater tall med norsk locale og tusenskilletegn
const formatNorwegianNumber = (value: number): string => {
  return new Intl.NumberFormat("nb-NO", {
    maximumFractionDigits: 0,
  }).format(value);
};

// Eidsiva-farger for Sankey-diagram
const SANKEY_COLORS = {
  // Kilde
  eidsiva: EIDSIVA_COLORS.primary,

  // Hovedringvirkninger (3-effektmodellen)
  direkte: EIDSIVA_COLORS.hoved.direkte,
  indirekte: EIDSIVA_COLORS.hoved.indirekte,
  forbruk: EIDSIVA_COLORS.hoved.forbruk,

  // Ringvirkningskategorier
  okonomiske: EIDSIVA_COLORS.okonomiske,
  sosiale: EIDSIVA_COLORS.sosiale,
  baerekraftige: EIDSIVA_COLORS.baerekraftige,

  // Destinasjoner - Økonomiske
  innlandet: EIDSIVA_COLORS.regioner.innlandet,
  oslo: EIDSIVA_COLORS.regioner.oslo,
  offentligVelferd: "#10B981",
  leverandorer: "#F59E0B",

  // Destinasjoner - Sosiale
  breddeidrett: "#F97316",
  toppidrett: "#EF4444",
  lokalsamfunn: "#A855F7",

  // Destinasjoner - Bærekraft
  fornybar: "#22C55E",
  klima: "#06B6D4",
};

// Sankey data for Eidsiva ringvirkningsregnskap
// Struktur: Eidsiva → 3 effekttyper → 3 ringvirkningskategorier → destinasjoner
const createEidsivaSankeyData = () => ({
  nodes: [
    // Kilde (venstre)
    { id: "Eidsiva Energi", nodeColor: SANKEY_COLORS.eidsiva },

    // Hovedringvirkninger - 3 effekttyper (nivå 1)
    { id: "Direkte effekter", nodeColor: SANKEY_COLORS.direkte },
    { id: "Indirekte effekter", nodeColor: SANKEY_COLORS.indirekte },
    { id: "Forbrukseffekter", nodeColor: SANKEY_COLORS.forbruk },

    // Ringvirkningskategorier (nivå 2)
    { id: "Økonomiske", nodeColor: SANKEY_COLORS.okonomiske },
    { id: "Sosiale", nodeColor: SANKEY_COLORS.sosiale },
    { id: "Bærekraftige", nodeColor: SANKEY_COLORS.baerekraftige },

    // Destinasjoner - Økonomiske (nivå 3)
    { id: "Innlandet", nodeColor: SANKEY_COLORS.innlandet },
    { id: "Oslo", nodeColor: SANKEY_COLORS.oslo },
    { id: "Offentlig velferd", nodeColor: SANKEY_COLORS.offentligVelferd },
    { id: "Leverandører", nodeColor: SANKEY_COLORS.leverandorer },

    // Destinasjoner - Sosiale (nivå 3)
    { id: "Breddeidrett", nodeColor: SANKEY_COLORS.breddeidrett },
    { id: "Toppidrett", nodeColor: SANKEY_COLORS.toppidrett },
    { id: "Lokalsamfunn", nodeColor: SANKEY_COLORS.lokalsamfunn },

    // Destinasjoner - Bærekraft (nivå 3)
    { id: "Fornybar energi", nodeColor: SANKEY_COLORS.fornybar },
    { id: "Klimatiltak", nodeColor: SANKEY_COLORS.klima },
  ],
  links: [
    // Fra Eidsiva til hovedeffekter
    // Basert på typisk fordeling: Direkte 50%, Indirekte 30%, Forbruk 20%
    { source: "Eidsiva Energi", target: "Direkte effekter", value: 50 },
    { source: "Eidsiva Energi", target: "Indirekte effekter", value: 30 },
    { source: "Eidsiva Energi", target: "Forbrukseffekter", value: 20 },

    // Fra Direkte effekter til kategorier
    { source: "Direkte effekter", target: "Økonomiske", value: 35 },
    { source: "Direkte effekter", target: "Bærekraftige", value: 15 },

    // Fra Indirekte effekter til kategorier
    { source: "Indirekte effekter", target: "Økonomiske", value: 25 },
    { source: "Indirekte effekter", target: "Sosiale", value: 5 },

    // Fra Forbrukseffekter til kategorier
    { source: "Forbrukseffekter", target: "Økonomiske", value: 10 },
    { source: "Forbrukseffekter", target: "Sosiale", value: 10 },

    // Fra Økonomiske til destinasjoner
    { source: "Økonomiske", target: "Innlandet", value: 35 },
    { source: "Økonomiske", target: "Oslo", value: 10 },
    { source: "Økonomiske", target: "Offentlig velferd", value: 15 },
    { source: "Økonomiske", target: "Leverandører", value: 10 },

    // Fra Sosiale til destinasjoner
    { source: "Sosiale", target: "Breddeidrett", value: 5 },
    { source: "Sosiale", target: "Toppidrett", value: 5 },
    { source: "Sosiale", target: "Lokalsamfunn", value: 5 },

    // Fra Bærekraftige til destinasjoner
    { source: "Bærekraftige", target: "Fornybar energi", value: 10 },
    { source: "Bærekraftige", target: "Klimatiltak", value: 5 },
  ],
});

export interface SankeyDynamicValues {
  direkteTotal: number;
  indirektTotal: number;
  forbrukTotal: number;
}

interface EidsivaSankeyProps {
  className?: string;
  /** Dynamiske verdier fra kalkulator - hvis ikke gitt brukes statiske verdier */
  dynamicValues?: SankeyDynamicValues;
  /** Kompakt modus for mindre høyde */
  compact?: boolean;
  /** Skjul header/kort-wrapper */
  standalone?: boolean;
}

// Generer Sankey-data fra dynamiske verdier
const createDynamicSankeyData = (values: SankeyDynamicValues) => {
  const total = values.direkteTotal + values.indirektTotal + values.forbrukTotal;
  if (total === 0) return createEidsivaSankeyData();

  // Normaliser til prosenter
  const direkteProsent = Math.round((values.direkteTotal / total) * 100);
  const indirekteProsent = Math.round((values.indirektTotal / total) * 100);
  const forbrukProsent = Math.round((values.forbrukTotal / total) * 100);

  return {
    nodes: [
      { id: "Eidsiva Energi", nodeColor: SANKEY_COLORS.eidsiva },
      { id: "Direkte effekter", nodeColor: SANKEY_COLORS.direkte },
      { id: "Indirekte effekter", nodeColor: SANKEY_COLORS.indirekte },
      { id: "Forbrukseffekter", nodeColor: SANKEY_COLORS.forbruk },
      { id: "Økonomiske", nodeColor: SANKEY_COLORS.okonomiske },
      { id: "Sosiale", nodeColor: SANKEY_COLORS.sosiale },
      { id: "Bærekraftige", nodeColor: SANKEY_COLORS.baerekraftige },
      { id: "Innlandet", nodeColor: SANKEY_COLORS.innlandet },
      { id: "Oslo", nodeColor: SANKEY_COLORS.oslo },
      { id: "Offentlig velferd", nodeColor: SANKEY_COLORS.offentligVelferd },
      { id: "Leverandører", nodeColor: SANKEY_COLORS.leverandorer },
      { id: "Breddeidrett", nodeColor: SANKEY_COLORS.breddeidrett },
      { id: "Toppidrett", nodeColor: SANKEY_COLORS.toppidrett },
      { id: "Lokalsamfunn", nodeColor: SANKEY_COLORS.lokalsamfunn },
      { id: "Fornybar energi", nodeColor: SANKEY_COLORS.fornybar },
      { id: "Klimatiltak", nodeColor: SANKEY_COLORS.klima },
    ],
    links: [
      // Fra Eidsiva til hovedeffekter - dynamiske prosenter
      { source: "Eidsiva Energi", target: "Direkte effekter", value: direkteProsent },
      { source: "Eidsiva Energi", target: "Indirekte effekter", value: indirekteProsent },
      { source: "Eidsiva Energi", target: "Forbrukseffekter", value: forbrukProsent },

      // Fra Direkte effekter til kategorier
      { source: "Direkte effekter", target: "Økonomiske", value: Math.round(direkteProsent * 0.7) },
      { source: "Direkte effekter", target: "Bærekraftige", value: Math.round(direkteProsent * 0.3) },

      // Fra Indirekte effekter til kategorier
      { source: "Indirekte effekter", target: "Økonomiske", value: Math.round(indirekteProsent * 0.85) },
      { source: "Indirekte effekter", target: "Sosiale", value: Math.round(indirekteProsent * 0.15) },

      // Fra Forbrukseffekter til kategorier
      { source: "Forbrukseffekter", target: "Økonomiske", value: Math.round(forbrukProsent * 0.5) },
      { source: "Forbrukseffekter", target: "Sosiale", value: Math.round(forbrukProsent * 0.5) },

      // Fra Økonomiske til destinasjoner
      { source: "Økonomiske", target: "Innlandet", value: Math.round((direkteProsent * 0.7 + indirekteProsent * 0.85 + forbrukProsent * 0.5) * 0.5) },
      { source: "Økonomiske", target: "Oslo", value: Math.round((direkteProsent * 0.7 + indirekteProsent * 0.85 + forbrukProsent * 0.5) * 0.15) },
      { source: "Økonomiske", target: "Offentlig velferd", value: Math.round((direkteProsent * 0.7 + indirekteProsent * 0.85 + forbrukProsent * 0.5) * 0.2) },
      { source: "Økonomiske", target: "Leverandører", value: Math.round((direkteProsent * 0.7 + indirekteProsent * 0.85 + forbrukProsent * 0.5) * 0.15) },

      // Fra Sosiale til destinasjoner
      { source: "Sosiale", target: "Breddeidrett", value: Math.round((indirekteProsent * 0.15 + forbrukProsent * 0.5) * 0.33) },
      { source: "Sosiale", target: "Toppidrett", value: Math.round((indirekteProsent * 0.15 + forbrukProsent * 0.5) * 0.33) },
      { source: "Sosiale", target: "Lokalsamfunn", value: Math.round((indirekteProsent * 0.15 + forbrukProsent * 0.5) * 0.34) },

      // Fra Bærekraftige til destinasjoner
      { source: "Bærekraftige", target: "Fornybar energi", value: Math.round(direkteProsent * 0.3 * 0.65) },
      { source: "Bærekraftige", target: "Klimatiltak", value: Math.round(direkteProsent * 0.3 * 0.35) },
    ],
  };
};

export function EidsivaSankey({
  className = "",
  dynamicValues,
  compact = false,
  standalone = false,
}: EidsivaSankeyProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Bruk dynamiske verdier hvis gitt, ellers statiske
  const sankeyData = useMemo(() => {
    if (dynamicValues) {
      return createDynamicSankeyData(dynamicValues);
    }
    return createEidsivaSankeyData();
  }, [dynamicValues]);

  // Beregn total verdi for prosentberegninger
  const totalValue = useMemo(
    () =>
      sankeyData.links
        .filter((l) => l.source === "Eidsiva Energi")
        .reduce((sum, l) => sum + l.value, 0),
    [sankeyData]
  );

  const sankeyChart = (
    <div
      className={`w-full ${compact ? "h-[320px]" : "h-[450px]"}`}
      role="img"
      aria-label="Sankey-diagram som viser Eidsivas ringvirkninger fra verdiskaping gjennom direkte, indirekte og forbrukseffekter til økonomiske, sosiale og bærekraftige destinasjoner"
    >
      {mounted ? (
        <ResponsiveSankey
          data={sankeyData}
          margin={{ top: 20, right: compact ? 140 : 180, bottom: 20, left: 20 }}
          align="justify"
          colors={(node) =>
            (node as { nodeColor?: string }).nodeColor || SANKEY_COLORS.eidsiva
          }
          nodeOpacity={1}
          nodeHoverOpacity={1}
          nodeHoverOthersOpacity={0.35}
          nodeThickness={compact ? 16 : 20}
          nodeSpacing={compact ? 18 : 24}
          nodeBorderWidth={0}
          nodeBorderRadius={4}
          linkOpacity={0.5}
          linkHoverOpacity={0.8}
          linkHoverOthersOpacity={0.15}
          linkContract={3}
          linkBlendMode="normal"
          enableLinkGradient={true}
          labelPosition="outside"
          labelOrientation="horizontal"
          labelPadding={compact ? 12 : 16}
          labelTextColor={{
            from: "color",
            modifiers: [["darker", 1.5]],
          }}
          animate={true}
          motionConfig="gentle"
          nodeTooltip={({ node }) => {
            const percentage = ((node.value / totalValue) * 100).toFixed(1);

            const nodeDescriptions: Record<string, string> = {
              "Direkte effekter": EIDSIVA_DESCRIPTIONS.direkteEffekt,
              "Indirekte effekter": EIDSIVA_DESCRIPTIONS.indirektEffekt,
              "Forbrukseffekter": EIDSIVA_DESCRIPTIONS.forbrukseffekt,
              "Økonomiske": EIDSIVA_DESCRIPTIONS.okonomiske,
              "Sosiale": EIDSIVA_DESCRIPTIONS.sosiale,
              "Bærekraftige": EIDSIVA_DESCRIPTIONS.baerekraftige,
              "Offentlig velferd": EIDSIVA_DESCRIPTIONS.offentligVelferd,
              "Leverandører": EIDSIVA_DESCRIPTIONS.leverandorer,
            };

            const description = nodeDescriptions[node.id];

            return (
              <div
                style={{
                  background: "white",
                  padding: "12px 16px",
                  borderRadius: "8px",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                  border: "1px solid #e2e8f0",
                  maxWidth: "280px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "8px",
                  }}
                >
                  <span
                    style={{
                      width: "12px",
                      height: "12px",
                      borderRadius: "50%",
                      backgroundColor: node.color,
                    }}
                  />
                  <strong style={{ color: "#1e293b", fontFamily: "var(--font-outfit)" }}>
                    {node.id}
                  </strong>
                </div>
                {description && (
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#64748b",
                      marginBottom: "8px",
                      lineHeight: "1.4",
                    }}
                  >
                    {description}
                  </div>
                )}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px",
                    fontSize: "13px",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", gap: "16px" }}>
                    <span style={{ color: "#64748b" }}>Andel:</span>
                    <strong style={{ color: "#1e293b" }}>{percentage} %</strong>
                  </div>
                </div>
              </div>
            );
          }}
          linkTooltip={({ link }) => {
            const percentage = ((link.value / totalValue) * 100).toFixed(1);
            return (
              <div
                style={{
                  background: "white",
                  padding: "12px 16px",
                  borderRadius: "8px",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                  border: "1px solid #e2e8f0",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "8px",
                    fontFamily: "var(--font-outfit)",
                  }}
                >
                  <span style={{ color: link.source.color, fontWeight: 500 }}>
                    {link.source.id}
                  </span>
                  <span style={{ color: "#94a3b8" }}>→</span>
                  <span style={{ color: link.target.color, fontWeight: 500 }}>
                    {link.target.id}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px",
                    fontSize: "13px",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", gap: "16px" }}>
                    <span style={{ color: "#64748b" }}>Andel av total:</span>
                    <strong style={{ color: "#1e293b" }}>{percentage} %</strong>
                  </div>
                </div>
              </div>
            );
          }}
        />
      ) : (
        <div className="h-full bg-slate-100 rounded-lg animate-pulse" />
      )}
    </div>
  );

  // Standalone mode - bare diagrammet uten kort-wrapper
  if (standalone) {
    return <div className={className}>{sankeyChart}</div>;
  }

  return (
    <Card className={`col-span-2 animate-slide-up ${className}`} style={{ animationDelay: "0.1s" }}>
      <CardHeader>
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle size="lg">Ringvirkninger - Verdiskaping</CardTitle>
              <SourceTooltip kilde={KILDER.ringvirkninger} size="md" />
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Hvordan Eidsivas verdiskaping flyter til lokalsamfunn, næringsliv og miljø
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs flex-wrap">
            <div className="flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: SANKEY_COLORS.okonomiske }}
              />
              <span className="text-slate-500">Økonomiske</span>
              <InfoTooltip description={EIDSIVA_DESCRIPTIONS.okonomiske} size="sm" />
            </div>
            <div className="flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: SANKEY_COLORS.sosiale }}
              />
              <span className="text-slate-500">Sosiale</span>
              <InfoTooltip description={EIDSIVA_DESCRIPTIONS.sosiale} size="sm" />
            </div>
            <div className="flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: SANKEY_COLORS.baerekraftige }}
              />
              <span className="text-slate-500">Bærekraftige</span>
              <InfoTooltip description={EIDSIVA_DESCRIPTIONS.baerekraftige} size="sm" />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {sankeyChart}
      </CardContent>
    </Card>
  );
}
