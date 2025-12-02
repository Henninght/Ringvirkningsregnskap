"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, TrendingUp, Building2 } from "lucide-react";
import { SourceTooltip } from "@/components/ui/SourceTooltip";
import { KILDER } from "@/lib/eidsiva/eidsivaData";

// =============================================================================
// REGIONSDATA MED SVG-PATHS FOR INNLANDET
// =============================================================================

export interface Region {
  id: string;
  navn: string;
  verdi: number; // MNOK
  path: string;
  labelX: number;
  labelY: number;
}

const INNLANDET_REGIONS: Region[] = [
  {
    id: "nord-gudbrandsdal",
    navn: "Nord-Gudbrandsdal",
    verdi: 0,
    path: "M80 20 L140 15 L160 50 L150 90 L120 100 L85 85 L70 50 Z",
    labelX: 115,
    labelY: 55,
  },
  {
    id: "midt-gudbrandsdal",
    navn: "Midt-Gudbrandsdal",
    verdi: 0,
    path: "M85 85 L120 100 L150 90 L155 130 L130 150 L95 145 L75 115 Z",
    labelX: 115,
    labelY: 118,
  },
  {
    id: "nord-osterdal",
    navn: "Nord-Østerdal",
    verdi: 0,
    path: "M160 50 L220 30 L250 60 L245 120 L210 140 L175 120 L155 130 L150 90 Z",
    labelX: 200,
    labelY: 85,
  },
  {
    id: "valdres",
    navn: "Valdres",
    verdi: 0,
    path: "M30 100 L75 115 L95 145 L90 190 L55 200 L25 170 L20 130 Z",
    labelX: 58,
    labelY: 155,
  },
  {
    id: "lillehammer",
    navn: "Lillehammer-regionen",
    verdi: 0,
    path: "M95 145 L130 150 L155 130 L175 155 L165 195 L125 200 L95 185 L90 190 Z",
    labelX: 130,
    labelY: 172,
  },
  {
    id: "sor-osterdal",
    navn: "Sør-Østerdal",
    verdi: 0,
    path: "M175 120 L210 140 L245 120 L260 160 L250 210 L210 230 L175 210 L165 195 L175 155 Z",
    labelX: 212,
    labelY: 170,
  },
  {
    id: "gjovik",
    navn: "Gjøvikregionen",
    verdi: 0,
    path: "M55 200 L90 190 L95 185 L125 200 L120 240 L85 260 L50 245 L45 215 Z",
    labelX: 85,
    labelY: 225,
  },
  {
    id: "hamar",
    navn: "Hamarregionen",
    verdi: 0,
    path: "M125 200 L165 195 L175 210 L190 250 L160 275 L125 265 L120 240 Z",
    labelX: 150,
    labelY: 235,
  },
  {
    id: "kongsvinger",
    navn: "Kongsvinger-regionen",
    verdi: 0,
    path: "M190 250 L175 210 L210 230 L250 210 L270 240 L265 285 L230 300 L195 290 Z",
    labelX: 225,
    labelY: 260,
  },
  {
    id: "gran",
    navn: "Gran",
    verdi: 0,
    path: "M85 260 L120 240 L125 265 L160 275 L150 310 L110 320 L75 300 L70 275 Z",
    labelX: 115,
    labelY: 290,
  },
];

// Oslo er utenfor Innlandet - vises som egen boks
const OSLO_REGION: Region = {
  id: "oslo",
  navn: "Oslo",
  verdi: 0,
  path: "", // Bruker rektangel i stedet
  labelX: 0,
  labelY: 0,
};

// =============================================================================
// FORMATERING
// =============================================================================

const formatMNOK = (value: number): string => {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)} mrd`;
  }
  return `${value.toFixed(0)} MNOK`;
};

// =============================================================================
// KOMPONENTER
// =============================================================================

interface RegionMapProps {
  regionData?: Record<string, number>; // ID -> MNOK
  onRegionSelect?: (region: Region | null) => void;
  selectedRegionId?: string | null;
  showValues?: boolean;
}

export function RegionMap({
  regionData = {},
  onRegionSelect,
  selectedRegionId,
  showValues = true,
}: RegionMapProps) {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);

  // Merge regionsdata med faktiske verdier
  const regionsWithData = INNLANDET_REGIONS.map((region) => ({
    ...region,
    verdi: regionData[region.id] ?? region.verdi,
  }));

  const osloWithData = {
    ...OSLO_REGION,
    verdi: regionData["oslo"] ?? 0,
  };

  // Finn maks verdi for fargeskala
  const maxValue = Math.max(
    ...regionsWithData.map((r) => r.verdi),
    osloWithData.verdi,
    1
  );

  // Beregn farge basert på verdi
  const getRegionColor = useCallback(
    (value: number, isHovered: boolean, isSelected: boolean): string => {
      if (isSelected) return "var(--petrol-500)";
      if (isHovered) return "var(--petrol-400)";

      const intensity = Math.min(value / maxValue, 1);
      const lightness = 95 - intensity * 40; // Fra 95% (lys) til 55% (mørk)
      return `hsl(187, 35%, ${lightness}%)`;
    },
    [maxValue]
  );

  const handleRegionClick = useCallback(
    (region: Region) => {
      onRegionSelect?.(selectedRegionId === region.id ? null : region);
    },
    [onRegionSelect, selectedRegionId]
  );

  // Total verdi for alle regioner
  const totalValue =
    regionsWithData.reduce((sum, r) => sum + r.verdi, 0) + osloWithData.verdi;

  return (
    <div className="relative w-full">
      {/* Header med total */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-petrol-500/10 flex items-center justify-center">
            <MapPin size={16} className="text-petrol-500" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3
                className="text-sm font-semibold text-slate-700"
                style={{ fontFamily: "var(--font-outfit)" }}
              >
                Regionalt verdikart
              </h3>
              <SourceTooltip kilde={KILDER.regionaltKart} />
            </div>
            <p className="text-xs text-slate-400">Innlandet + Oslo</p>
          </div>
        </div>
        {showValues && totalValue > 0 && (
          <div className="text-right">
            <div
              className="text-lg font-bold text-petrol-600"
              style={{ fontFamily: "var(--font-outfit)" }}
            >
              {formatMNOK(totalValue)}
            </div>
            <div className="text-xs text-slate-400">Total verdiskaping</div>
          </div>
        )}
      </div>

      {/* SVG Kart */}
      <div className="relative bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-4 border border-slate-200/50 overflow-hidden">
        {/* Bakgrunnsmønster */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <svg
          viewBox="0 0 340 380"
          className="w-full h-auto max-h-[500px]"
          style={{ filter: "drop-shadow(0 4px 6px rgba(0, 0, 0, 0.05))" }}
        >
          {/* Definisjoner for gradienter og effekter */}
          <defs>
            {/* Glow-effekt for valgt region */}
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Gradient for energi-effekt */}
            <linearGradient
              id="energyGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="var(--petrol-400)" />
              <stop offset="100%" stopColor="var(--petrol-600)" />
            </linearGradient>

            {/* Pattern for tomme regioner */}
            <pattern
              id="emptyPattern"
              patternUnits="userSpaceOnUse"
              width="10"
              height="10"
            >
              <path
                d="M0 10 L10 0"
                stroke="currentColor"
                strokeWidth="0.5"
                opacity="0.1"
              />
            </pattern>
          </defs>

          {/* Innlandet regioner */}
          <g className="innlandet-regions">
            {regionsWithData.map((region) => {
              const isHovered = hoveredRegion === region.id;
              const isSelected = selectedRegionId === region.id;
              const fillColor = getRegionColor(region.verdi, isHovered, isSelected);

              return (
                <g key={region.id}>
                  {/* Region path */}
                  <motion.path
                    d={region.path}
                    fill={fillColor}
                    stroke={isSelected ? "var(--petrol-600)" : "white"}
                    strokeWidth={isSelected ? 2.5 : 1.5}
                    className="cursor-pointer transition-colors duration-200"
                    style={{
                      filter: isSelected ? "url(#glow)" : undefined,
                    }}
                    initial={false}
                    animate={{
                      scale: isHovered && !isSelected ? 1.02 : 1,
                    }}
                    transition={{ duration: 0.15 }}
                    onMouseEnter={() => setHoveredRegion(region.id)}
                    onMouseLeave={() => setHoveredRegion(null)}
                    onClick={() => handleRegionClick(region)}
                  />

                  {/* Tomme regioner får mønster */}
                  {region.verdi === 0 && (
                    <path
                      d={region.path}
                      fill="url(#emptyPattern)"
                      pointerEvents="none"
                    />
                  )}
                </g>
              );
            })}
          </g>

          {/* Region labels - vises ved hover */}
          <AnimatePresence>
            {hoveredRegion && (
              <motion.g
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.15 }}
              >
                {regionsWithData
                  .filter((r) => r.id === hoveredRegion)
                  .map((region) => (
                    <g key={`label-${region.id}`}>
                      {/* Bakgrunn for label */}
                      <rect
                        x={region.labelX - 45}
                        y={region.labelY - 22}
                        width="90"
                        height={region.verdi > 0 ? "32" : "22"}
                        rx="6"
                        fill="rgba(30, 41, 59, 0.95)"
                        className="shadow-lg"
                      />
                      {/* Region navn */}
                      <text
                        x={region.labelX}
                        y={region.labelY - 8}
                        textAnchor="middle"
                        className="text-[9px] font-medium fill-white"
                        style={{ fontFamily: "var(--font-outfit)" }}
                      >
                        {region.navn}
                      </text>
                      {/* Verdi */}
                      {region.verdi > 0 && (
                        <text
                          x={region.labelX}
                          y={region.labelY + 5}
                          textAnchor="middle"
                          className="text-[8px] fill-petrol-300"
                        >
                          {formatMNOK(region.verdi)}
                        </text>
                      )}
                    </g>
                  ))}
              </motion.g>
            )}
          </AnimatePresence>

          {/* Oslo boks - separat fra Innlandet */}
          <g transform="translate(275, 300)">
            {/* Forbindelseslinje */}
            <path
              d="M-40 -10 Q -20 10, 0 20"
              stroke="var(--slate-300)"
              strokeWidth="1"
              strokeDasharray="4 2"
              fill="none"
            />

            {/* Oslo rektangel */}
            <motion.rect
              x="0"
              y="20"
              width="55"
              height="45"
              rx="8"
              fill={getRegionColor(
                osloWithData.verdi,
                hoveredRegion === "oslo",
                selectedRegionId === "oslo"
              )}
              stroke={
                selectedRegionId === "oslo" ? "var(--petrol-600)" : "white"
              }
              strokeWidth={selectedRegionId === "oslo" ? 2.5 : 1.5}
              className="cursor-pointer"
              style={{
                filter: selectedRegionId === "oslo" ? "url(#glow)" : undefined,
              }}
              animate={{
                scale:
                  hoveredRegion === "oslo" && selectedRegionId !== "oslo"
                    ? 1.05
                    : 1,
              }}
              transition={{ duration: 0.15 }}
              onMouseEnter={() => setHoveredRegion("oslo")}
              onMouseLeave={() => setHoveredRegion(null)}
              onClick={() => handleRegionClick(osloWithData)}
            />

            {/* Oslo ikon */}
            <Building2
              x="18"
              y="32"
              size={20}
              className={`pointer-events-none ${
                selectedRegionId === "oslo" ? "text-white" : "text-slate-500"
              }`}
            />

            {/* Oslo label */}
            <text
              x="27"
              y="72"
              textAnchor="middle"
              className="text-[10px] font-medium fill-slate-600"
              style={{ fontFamily: "var(--font-outfit)" }}
            >
              Oslo
            </text>

            {/* Verdi under Oslo */}
            {osloWithData.verdi > 0 && (
              <text
                x="27"
                y="84"
                textAnchor="middle"
                className="text-[8px] fill-petrol-500"
              >
                {formatMNOK(osloWithData.verdi)}
              </text>
            )}
          </g>

          {/* Kompass */}
          <g transform="translate(20, 340)">
            <circle
              cx="15"
              cy="15"
              r="14"
              fill="white"
              stroke="var(--slate-200)"
            />
            <text
              x="15"
              y="12"
              textAnchor="middle"
              className="text-[10px] font-bold fill-petrol-600"
            >
              N
            </text>
            <path
              d="M15 18 L12 25 L15 22 L18 25 Z"
              fill="var(--slate-400)"
            />
          </g>
        </svg>

        {/* Fargeforklaring */}
        <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-slate-200/50">
          <div className="flex items-center gap-2">
            <div className="flex">
              {[95, 80, 65, 55].map((lightness, i) => (
                <div
                  key={i}
                  className="w-5 h-3 first:rounded-l last:rounded-r"
                  style={{ backgroundColor: `hsl(187, 35%, ${lightness}%)` }}
                />
              ))}
            </div>
            <span className="text-xs text-slate-500">
              Lav → Høy verdiskaping
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-petrol-500" />
            <span className="text-xs text-slate-500">Valgt region</span>
          </div>
        </div>
      </div>

      {/* Valgt region detaljer */}
      <AnimatePresence>
        {selectedRegionId && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mt-4 p-4 bg-petrol-50 rounded-xl border border-petrol-200"
          >
            {(() => {
              const selected =
                selectedRegionId === "oslo"
                  ? osloWithData
                  : regionsWithData.find((r) => r.id === selectedRegionId);
              if (!selected) return null;

              return (
                <div className="flex items-center justify-between">
                  <div>
                    <h4
                      className="font-semibold text-slate-800"
                      style={{ fontFamily: "var(--font-outfit)" }}
                    >
                      {selected.navn}
                    </h4>
                    <p className="text-sm text-slate-500">
                      {selected.id === "oslo"
                        ? "Hovedstadsregionen"
                        : "Innlandet fylke"}
                    </p>
                  </div>
                  <div className="text-right">
                    {selected.verdi > 0 ? (
                      <>
                        <div
                          className="text-2xl font-bold text-petrol-600"
                          style={{ fontFamily: "var(--font-outfit)" }}
                        >
                          {formatMNOK(selected.verdi)}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-sage-600">
                          <TrendingUp size={12} />
                          <span>
                            {((selected.verdi / totalValue) * 100).toFixed(1)}%
                            av total
                          </span>
                        </div>
                      </>
                    ) : (
                      <div className="text-sm text-slate-400 italic">
                        Ingen data registrert
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Eksporter regionsliste for bruk i andre komponenter
export { INNLANDET_REGIONS, OSLO_REGION };
