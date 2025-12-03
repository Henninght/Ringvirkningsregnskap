"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SourceTooltip } from "@/components/ui/SourceTooltip";
import { KILDER, EIDSIVA_NOKKELTALL } from "@/lib/eidsiva/eidsivaData";
import {
  Home,
  Car,
  Leaf,
  Building2,
  Zap,
  TrendingUp,
  Info,
} from "lucide-react";

// Perspektiv-typer
type Perspective = "hjem" | "transport" | "klima" | "bygninger";

interface PerspectiveConfig {
  id: Perspective;
  label: string;
  icon: React.ReactNode;
  metrics: {
    primary: { value: number; unit: string; label: string };
    secondary: { value: number; unit: string; label: string };
    tertiary: { value: number; unit: string; label: string };
  };
  color: string;
  gradient: string;
}

// Animert tall-komponent
function AnimatedNumber({ value, className }: { value: number; className?: string }) {
  const formatted = useMemo(() => {
    if (value >= 1_000_000_000) {
      return { number: (value / 1_000_000_000).toFixed(1), suffix: "mrd" };
    }
    if (value >= 1_000_000) {
      return { number: (value / 1_000_000).toFixed(1), suffix: "mill" };
    }
    if (value >= 1_000) {
      return { number: Math.round(value / 1_000).toLocaleString("nb-NO"), suffix: "k" };
    }
    return { number: value.toLocaleString("nb-NO"), suffix: "" };
  }, [value]);

  return (
    <motion.span
      key={value}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {formatted.number}
      {formatted.suffix && (
        <span className="text-[0.5em] font-normal ml-1 opacity-70">{formatted.suffix}</span>
      )}
    </motion.span>
  );
}

export function EnergyImpactExplorer() {
  const [scenarioPercent, setScenarioPercent] = useState(100);
  const [activePerspective, setActivePerspective] = useState<Perspective>("hjem");

  const data = EIDSIVA_NOKKELTALL;

  // Beregn skalerte verdier basert på scenario
  const scaleFactor = scenarioPercent / 100;
  const totalProduksjonGWh = (data.vannkraft.produksjonGWh + data.biokraft.produksjonGWh) * scaleFactor;
  const totalProduksjonTWh = totalProduksjonGWh / 1000;

  // Perspektiv-konfigurasjon med skalerte verdier
  const perspectives: PerspectiveConfig[] = useMemo(() => [
    {
      id: "hjem",
      label: "Hjem",
      icon: <Home size={20} />,
      color: "#059669",
      gradient: "from-emerald-500/20 via-emerald-500/5 to-transparent",
      metrics: {
        primary: {
          value: Math.round((data.vannkraftTilsvarer.husholdninger + data.biokraftTilsvarer.husholdninger) * scaleFactor),
          unit: "husholdninger",
          label: "med strøm hele året",
        },
        secondary: {
          value: Math.round((data.vannkraftTilsvarer.innbyggere + data.biokraftTilsvarer.innbyggere) * scaleFactor),
          unit: "innbyggere",
          label: "dekket",
        },
        tertiary: {
          value: Math.round(data.kundedekning.husstanderMedBredbånd * scaleFactor),
          unit: "husstander",
          label: "med bredbånd",
        },
      },
    },
    {
      id: "transport",
      label: "Transport",
      icon: <Car size={20} />,
      color: "#0891b2",
      gradient: "from-cyan-500/20 via-cyan-500/5 to-transparent",
      metrics: {
        primary: {
          value: Math.round(data.vannkraftTilsvarer.elbilladinger * scaleFactor),
          unit: "elbil-ladinger",
          label: "per år",
        },
        secondary: {
          value: Math.round(data.vannkraftTilsvarer.elTogKm * scaleFactor),
          unit: "km",
          label: "med el-tog",
        },
        tertiary: {
          value: Math.round(data.vannkraftTilsvarer.elBussKm * scaleFactor),
          unit: "km",
          label: "med el-buss",
        },
      },
    },
    {
      id: "klima",
      label: "Klima",
      icon: <Leaf size={20} />,
      color: "#16a34a",
      gradient: "from-green-500/20 via-green-500/5 to-transparent",
      metrics: {
        primary: {
          value: Math.round((data.vannkraftTilsvarer.co2BesparelseTonn + data.biokraftTilsvarer.co2BesparelseTonn) * scaleFactor),
          unit: "tonn CO₂",
          label: "spart vs. fossil energi",
        },
        secondary: {
          value: Math.round(data.obio.co2LagretTonn * scaleFactor),
          unit: "tonn CO₂",
          label: "fanget med biokull",
        },
        tertiary: {
          value: Math.round(data.obio.tilsvarerFlyturer * scaleFactor),
          unit: "flyturer",
          label: "Oslo-Trondheim spart",
        },
      },
    },
    {
      id: "bygninger",
      label: "Bygninger",
      icon: <Building2 size={20} />,
      color: "#7c3aed",
      gradient: "from-violet-500/20 via-violet-500/5 to-transparent",
      metrics: {
        primary: {
          value: Math.round(data.vannkraftTilsvarer.idrettshaller * scaleFactor),
          unit: "idrettshaller",
          label: "kan drives",
        },
        secondary: {
          value: Math.round(data.vannkraftTilsvarer.sykehus * scaleFactor),
          unit: "sykehus",
          label: "forsynt med strøm",
        },
        tertiary: {
          value: Math.round(data.vannkraftTilsvarer.grunnskoler * scaleFactor),
          unit: "grunnskoler",
          label: "med full drift",
        },
      },
    },
  ], [scaleFactor, data]);

  const currentPerspective = perspectives.find((p) => p.id === activePerspective)!;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-700/50">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="energy-grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#energy-grid)" />
        </svg>
      </div>

      {/* Gradient overlay based on perspective */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${currentPerspective.gradient} transition-all duration-700`}
      />

      <div className="relative z-10 p-8 lg:p-12">
        {/* Header */}
        <div className="flex items-start justify-between mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <Zap size={20} className="text-amber-400" />
              </div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold text-white/90 tracking-tight">
                  Energiproduksjon
                </h2>
                <SourceTooltip kilde={KILDER.fornybarEnergi} size="md" />
              </div>
            </div>
            <p className="text-sm text-white/50 max-w-md">
              Utforsk hva Eidsivas fornybare energiproduksjon betyr for samfunnet
            </p>
          </div>

          {/* Scenario badge */}
          {scenarioPercent !== 100 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="px-3 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/30"
            >
              <span className="text-xs font-medium text-amber-300">
                Scenario: {scenarioPercent}%
              </span>
            </motion.div>
          )}
        </div>

        {/* Main hero number */}
        <div className="text-center mb-12">
          <motion.div
            key={totalProduksjonTWh}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="mb-3"
          >
            <span
              className="text-8xl lg:text-9xl font-bold tracking-tighter bg-gradient-to-b from-white via-white/90 to-white/60 bg-clip-text text-transparent"
              style={{ fontFamily: "var(--font-outfit)" }}
            >
              {totalProduksjonTWh.toFixed(1)}
            </span>
            <span className="text-3xl lg:text-4xl font-light text-white/50 ml-3">TWh</span>
          </motion.div>
          <p className="text-white/60 text-lg">
            fornybar energi hvert år
          </p>
          <p className="text-white/40 text-sm mt-1">
            {data.vannkraft.andelAvNorge}% av Norges totale kraftproduksjon
          </p>
        </div>

        {/* Scenario slider */}
        <div className="max-w-xl mx-auto mb-12">
          <div className="flex items-center justify-between text-sm text-white/50 mb-3">
            <span>Hva om produksjonen endres?</span>
            <span className="font-mono text-white/70">{scenarioPercent}%</span>
          </div>
          <div className="relative">
            <input
              type="range"
              min={50}
              max={200}
              value={scenarioPercent}
              onChange={(e) => setScenarioPercent(parseInt(e.target.value))}
              className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer
                         [&::-webkit-slider-thumb]:appearance-none
                         [&::-webkit-slider-thumb]:h-5
                         [&::-webkit-slider-thumb]:w-5
                         [&::-webkit-slider-thumb]:rounded-full
                         [&::-webkit-slider-thumb]:bg-white
                         [&::-webkit-slider-thumb]:shadow-lg
                         [&::-webkit-slider-thumb]:shadow-white/25
                         [&::-webkit-slider-thumb]:cursor-pointer
                         [&::-webkit-slider-thumb]:transition-transform
                         [&::-webkit-slider-thumb]:hover:scale-110
                         [&::-moz-range-thumb]:h-5
                         [&::-moz-range-thumb]:w-5
                         [&::-moz-range-thumb]:rounded-full
                         [&::-moz-range-thumb]:bg-white
                         [&::-moz-range-thumb]:border-0
                         [&::-moz-range-thumb]:cursor-pointer"
              style={{
                background: `linear-gradient(to right, ${currentPerspective.color} 0%, ${currentPerspective.color} ${((scenarioPercent - 50) / 150) * 100}%, rgba(255,255,255,0.1) ${((scenarioPercent - 50) / 150) * 100}%, rgba(255,255,255,0.1) 100%)`,
              }}
              aria-label="Scenario-justering"
            />
            <div className="flex justify-between text-xs text-white/30 mt-2">
              <span>50%</span>
              <span>100%</span>
              <span>150%</span>
              <span>200%</span>
            </div>
          </div>
        </div>

        {/* Perspective selector */}
        <div className="mb-8">
          <p className="text-center text-white/50 text-sm mb-4">Se hva det betyr for</p>
          <div className="flex justify-center gap-2 flex-wrap">
            {perspectives.map((perspective) => (
              <button
                key={perspective.id}
                onClick={() => setActivePerspective(perspective.id)}
                className={`
                  flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-300
                  ${activePerspective === perspective.id
                    ? "bg-white text-slate-900 shadow-lg shadow-white/20"
                    : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
                  }
                `}
              >
                <span
                  style={{
                    color: activePerspective === perspective.id ? perspective.color : undefined,
                  }}
                >
                  {perspective.icon}
                </span>
                <span className="font-medium text-sm">{perspective.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Metrics display */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activePerspective}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            {/* Primary metric - larger */}
            <div className="md:col-span-3 bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="text-center">
                <AnimatedNumber
                  value={currentPerspective.metrics.primary.value}
                  className="text-5xl lg:text-6xl font-bold text-white tracking-tight"
                />
                <p className="text-white/60 mt-2">
                  <span className="font-medium text-white/80">
                    {currentPerspective.metrics.primary.unit}
                  </span>{" "}
                  {currentPerspective.metrics.primary.label}
                </p>
              </div>
            </div>

            {/* Secondary metrics */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/10">
              <AnimatedNumber
                value={currentPerspective.metrics.secondary.value}
                className="text-3xl font-bold text-white tracking-tight"
              />
              <p className="text-white/50 text-sm mt-1">
                <span className="text-white/70">{currentPerspective.metrics.secondary.unit}</span>{" "}
                {currentPerspective.metrics.secondary.label}
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/10">
              <AnimatedNumber
                value={currentPerspective.metrics.tertiary.value}
                className="text-3xl font-bold text-white tracking-tight"
              />
              <p className="text-white/50 text-sm mt-1">
                <span className="text-white/70">{currentPerspective.metrics.tertiary.unit}</span>{" "}
                {currentPerspective.metrics.tertiary.label}
              </p>
            </div>

            {/* Energy breakdown */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/10">
              <div className="flex items-center gap-2 text-white/50 text-xs mb-3">
                <Info size={14} />
                <span>Fordeling</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-white/70 text-sm">Vannkraft</span>
                  <span className="text-white font-medium">
                    {((data.vannkraft.produksjonGWh * scaleFactor) / 1000).toFixed(1)} TWh
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/70 text-sm">Biokraft</span>
                  <span className="text-white font-medium">
                    {((data.biokraft.produksjonGWh * scaleFactor) / 1000).toFixed(2)} TWh
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Source reference */}
        <div className="mt-8 pt-6 border-t border-white/10">
          <div className="flex items-center justify-center gap-2 text-white/30 text-xs">
            <span>Kilde: Eidsiva Ringvirkningsregnskap, side 17</span>
            <SourceTooltip kilde={KILDER.fornybarEnergi} size="sm" />
          </div>
        </div>
      </div>
    </div>
  );
}
