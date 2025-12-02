"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Zap,
  Network,
  Heart,
  Droplets,
  Flame,
  Leaf,
  Users,
  Wifi,
  Hospital,
  Shield,
  FireExtinguisher,
  GraduationCap,
  Home,
  Car,
  ArrowRight,
  ChevronDown,
} from "lucide-react";
import { AnimatedCounter, AnimatedDecimal } from "@/components/ui/AnimatedCounter";
import { SourceTooltip, type KildeRef } from "@/components/ui/SourceTooltip";
import { EIDSIVA_NOKKELTALL, KILDER } from "@/lib/eidsiva/eidsivaData";

// =============================================================================
// SHARED TYPES & STYLES
// =============================================================================

type KpiVariant = "petrol" | "sage" | "indigo";

const variantConfig: Record<
  KpiVariant,
  {
    bg: string;
    border: string;
    accent: string;
    iconBg: string;
    progressBg: string;
    progressFill: string;
    badgeBg: string;
    badgeText: string;
  }
> = {
  petrol: {
    bg: "bg-gradient-to-br from-white via-white to-petrol-50/50",
    border: "border-petrol-100",
    accent: "bg-petrol-500",
    iconBg: "bg-petrol-100 text-petrol-600",
    progressBg: "bg-petrol-100",
    progressFill: "bg-petrol-500",
    badgeBg: "bg-petrol-100",
    badgeText: "text-petrol-700",
  },
  sage: {
    bg: "bg-gradient-to-br from-white via-white to-sage-50/50",
    border: "border-sage-100",
    accent: "bg-sage-500",
    iconBg: "bg-sage-100 text-sage-600",
    progressBg: "bg-sage-100",
    progressFill: "bg-sage-500",
    badgeBg: "bg-sage-100",
    badgeText: "text-sage-700",
  },
  indigo: {
    bg: "bg-gradient-to-br from-white via-white to-indigo-50/50",
    border: "border-indigo-100",
    accent: "bg-indigo-500",
    iconBg: "bg-indigo-100 text-indigo-600",
    progressBg: "bg-indigo-100",
    progressFill: "bg-indigo-500",
    badgeBg: "bg-indigo-100",
    badgeText: "text-indigo-700",
  },
};

// =============================================================================
// KORT 1: FORNYBAR PRODUKSJON
// =============================================================================

interface ProduksjonsKortProps {
  expandable?: boolean;
  isExpanded?: boolean;
  onExpandToggle?: () => void;
  delay?: number;
}

export function ProduksjonsKort({
  expandable = true,
  isExpanded = false,
  onExpandToggle,
  delay = 0,
}: ProduksjonsKortProps) {
  const config = variantConfig.petrol;
  const { vannkraft, biokraft } = EIDSIVA_NOKKELTALL;

  const totalProduksjon = vannkraft.produksjonGWh + biokraft.produksjonGWh;
  const totalTWh = totalProduksjon / 1000;
  const nasjonalAndel = vannkraft.andelAvNorge; // 4%

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className={cn(
        "relative p-5 rounded-xl border shadow-card group",
        config.bg,
        config.border
      )}
    >
      {/* Accent bar */}
      <div className={cn("absolute top-0 left-0 right-0 h-0.5 rounded-t-xl", config.accent)} />

      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-slate-600">Fornybar produksjon</p>
            <SourceTooltip kilde={KILDER.fornybarEnergi} />
          </div>
        </div>
        <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center", config.iconBg)}>
          <Zap size={18} />
        </div>
      </div>

      {/* Main value with animated counter */}
      <div className="mb-4">
        <div className="flex items-baseline gap-1">
          <AnimatedDecimal
            value={totalTWh}
            decimals={1}
            suffix=" TWh"
            className="text-3xl font-bold text-petrol-700 tracking-tight"
            duration={1.5}
          />
        </div>
        <p className="text-xs text-slate-500 mt-1">fornybar energi per år</p>
      </div>

      {/* National scale bar - HOVEDFORBEDRING */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="text-slate-500">Andel av Norges kraftproduksjon</span>
          <span className="font-semibold text-petrol-700">{nasjonalAndel}%</span>
        </div>
        <div className={cn("h-2 rounded-full overflow-hidden", config.progressBg)}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${nasjonalAndel}%` }}
            transition={{ delay: delay + 0.5, duration: 1, ease: "easeOut" }}
            className={cn("h-full rounded-full", config.progressFill)}
          />
        </div>
        <p className="text-[10px] text-slate-400 mt-1">
          Norges totale kraftproduksjon: ~170 TWh
        </p>
      </div>

      {/* Renewable badge + Asset icons - ERSTATTER FEIL CHANGE INDICATOR */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Renewable badge */}
          <div className={cn("flex items-center gap-1.5 px-2.5 py-1 rounded-full", config.badgeBg)}>
            <Leaf size={12} className="text-green-600" />
            <span className={cn("text-xs font-semibold", config.badgeText)}>
              {biokraft.fornybartBrensel}% fornybart
            </span>
          </div>
        </div>

        {/* Asset breakdown */}
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <Droplets size={12} className="text-blue-500" />
            {vannkraft.antallKraftverk}
          </span>
          <span className="text-slate-300">+</span>
          <span className="flex items-center gap-1">
            <Flame size={12} className="text-orange-500" />
            {biokraft.antallVarmesentraler}
          </span>
          <span className="text-slate-400">= {vannkraft.antallKraftverk + biokraft.antallVarmesentraler} anlegg</span>
        </div>
      </div>

      {/* Expand button */}
      {expandable && (
        <button
          onClick={onExpandToggle}
          className={cn(
            "absolute bottom-2 right-2 p-1.5 rounded-md transition-all",
            isExpanded
              ? "text-petrol-600 opacity-100"
              : "text-slate-300 hover:text-slate-500 opacity-0 group-hover:opacity-100"
          )}
          aria-label={isExpanded ? "Skjul detaljer" : "Se detaljer"}
        >
          <ChevronDown
            size={14}
            className={cn("transition-transform duration-300", isExpanded && "rotate-180")}
          />
        </button>
      )}
    </motion.div>
  );
}

// =============================================================================
// KORT 2: NETT & INFRASTRUKTUR
// =============================================================================

interface InfrastrukturKortProps {
  expandable?: boolean;
  isExpanded?: boolean;
  onExpandToggle?: () => void;
  delay?: number;
}

export function InfrastrukturKort({
  expandable = true,
  isExpanded = false,
  onExpandToggle,
  delay = 0,
}: InfrastrukturKortProps) {
  const config = variantConfig.sage;
  const { kundedekning, kritiskInfrastruktur } = EIDSIVA_NOKKELTALL;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className={cn(
        "relative p-5 rounded-xl border shadow-card group",
        config.bg,
        config.border
      )}
    >
      {/* Accent bar */}
      <div className={cn("absolute top-0 left-0 right-0 h-0.5 rounded-t-xl", config.accent)} />

      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-slate-600">Nett & infrastruktur</p>
            <SourceTooltip kilde={KILDER.nettLeveranse} />
          </div>
        </div>
        <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center", config.iconBg)}>
          <Network size={18} />
        </div>
      </div>

      {/* Dual-track display - HOVEDFORBEDRING */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Strøm */}
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <Zap size={14} className="text-yellow-500" />
            <span className="text-xs text-slate-500">Strøm</span>
          </div>
          <AnimatedCounter
            value={kundedekning.innbyggereMedStrom}
            className="text-2xl font-bold text-sage-700 tracking-tight"
            duration={1.5}
          />
          <p className="text-[10px] text-slate-400">mennesker via Elvia</p>
        </div>

        {/* Bredbånd */}
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <Wifi size={14} className="text-blue-500" />
            <span className="text-xs text-slate-500">Bredbånd</span>
          </div>
          <AnimatedCounter
            value={kundedekning.husstanderMedBredbånd}
            className="text-2xl font-bold text-sage-700 tracking-tight"
            duration={1.5}
          />
          <p className="text-[10px] text-slate-400">husstander</p>
        </div>
      </div>

      {/* Geographic coverage */}
      <div className="mb-4">
        <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1.5">
          <span>Geografisk dekning</span>
        </div>
        <div className="flex gap-1 h-2 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "30%" }}
            transition={{ delay: delay + 0.5, duration: 0.8 }}
            className="bg-amber-400 rounded-l-full"
            title="Oslo-området"
          />
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "70%" }}
            transition={{ delay: delay + 0.7, duration: 0.8 }}
            className="bg-sage-500 rounded-r-full"
            title="Innlandet"
          />
        </div>
        <div className="flex justify-between text-[10px] text-slate-400 mt-1">
          <span>Oslo</span>
          <span>Innlandet</span>
        </div>
      </div>

      {/* Critical infrastructure badges */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <span className="text-[10px] text-slate-400 mr-1">Kritisk:</span>
          <div className="flex items-center gap-1">
            {kritiskInfrastruktur.sykehus && (
              <div className={cn("p-1 rounded", config.badgeBg)} title="Sykehus">
                <Hospital size={12} className={config.badgeText} />
              </div>
            )}
            {kritiskInfrastruktur.militaerleire && (
              <div className={cn("p-1 rounded", config.badgeBg)} title="Militærleire">
                <Shield size={12} className={config.badgeText} />
              </div>
            )}
            {kritiskInfrastruktur.brannstasjoner && (
              <div className={cn("p-1 rounded", config.badgeBg)} title="Brannstasjoner">
                <FireExtinguisher size={12} className={config.badgeText} />
              </div>
            )}
          </div>
        </div>

        <SourceTooltip kilde={KILDER.kritiskInfrastruktur} size="sm" />
      </div>

      {/* Expand button */}
      {expandable && (
        <button
          onClick={onExpandToggle}
          className={cn(
            "absolute bottom-2 right-2 p-1.5 rounded-md transition-all",
            isExpanded
              ? "text-sage-600 opacity-100"
              : "text-slate-300 hover:text-slate-500 opacity-0 group-hover:opacity-100"
          )}
          aria-label={isExpanded ? "Skjul detaljer" : "Se detaljer"}
        >
          <ChevronDown
            size={14}
            className={cn("transition-transform duration-300", isExpanded && "rotate-180")}
          />
        </button>
      )}
    </motion.div>
  );
}

// =============================================================================
// KORT 3: SAMFUNNSVERDI
// =============================================================================

interface SamfunnsverdiKortProps {
  expandable?: boolean;
  isExpanded?: boolean;
  onExpandToggle?: () => void;
  delay?: number;
}

// Rotating comparison items
const tilsvarerItems = [
  {
    icon: Hospital,
    value: EIDSIVA_NOKKELTALL.vannkraftTilsvarer.sykehus,
    label: "sykehus i drift",
    kilde: KILDER.velferdsbidrag,
  },
  {
    icon: GraduationCap,
    value: EIDSIVA_NOKKELTALL.vannkraftTilsvarer.grunnskoler,
    label: "grunnskoler",
    kilde: KILDER.velferdsbidrag,
  },
  {
    icon: Car,
    value: EIDSIVA_NOKKELTALL.vannkraftTilsvarer.elbilladinger,
    label: "elbil-ladinger/år",
    kilde: KILDER.fornybarEnergi,
  },
];

export function SamfunnsverdiKort({
  expandable = true,
  isExpanded = false,
  onExpandToggle,
  delay = 0,
}: SamfunnsverdiKortProps) {
  const config = variantConfig.indigo;
  const { vannkraftTilsvarer, biokraftTilsvarer } = EIDSIVA_NOKKELTALL;

  const totalHusholdninger = vannkraftTilsvarer.husholdninger + biokraftTilsvarer.husholdninger;
  const totalCO2 = vannkraftTilsvarer.co2BesparelseTonn + biokraftTilsvarer.co2BesparelseTonn;

  // Rotating "tilsvarer" state
  const [currentTilsvarer, setCurrentTilsvarer] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTilsvarer((prev) => (prev + 1) % tilsvarerItems.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const current = tilsvarerItems[currentTilsvarer];
  const CurrentIcon = current.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className={cn(
        "relative p-5 rounded-xl border shadow-card group",
        config.bg,
        config.border
      )}
    >
      {/* Accent bar */}
      <div className={cn("absolute top-0 left-0 right-0 h-0.5 rounded-t-xl", config.accent)} />

      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-slate-600">Samfunnsverdi</p>
            <SourceTooltip kilde={KILDER.velferdsbidrag} />
          </div>
        </div>
        <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center", config.iconBg)}>
          <Heart size={18} />
        </div>
      </div>

      {/* Main value - Households */}
      <div className="mb-4">
        <div className="flex items-center gap-2">
          <Home size={16} className="text-indigo-500" />
          <AnimatedCounter
            value={totalHusholdninger}
            className="text-3xl font-bold text-indigo-700 tracking-tight"
            duration={1.5}
          />
        </div>
        <p className="text-xs text-slate-500 mt-1">husholdninger forsynt med energi</p>
      </div>

      {/* Rotating "tilsvarer" comparison - HOVEDFORBEDRING */}
      <div className="mb-4">
        <p className="text-[10px] text-slate-400 uppercase tracking-wide mb-2">Tilsvarer</p>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTilsvarer}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className={cn("flex items-center gap-3 p-2.5 rounded-lg", config.badgeBg)}
          >
            <CurrentIcon size={20} className={config.badgeText} />
            <div>
              <span className={cn("text-lg font-bold", config.badgeText)}>
                {new Intl.NumberFormat("nb-NO").format(current.value)}
              </span>
              <span className="text-xs text-slate-500 ml-1.5">{current.label}</span>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Dots indicator */}
        <div className="flex justify-center gap-1.5 mt-2">
          {tilsvarerItems.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentTilsvarer(i)}
              className={cn(
                "w-1.5 h-1.5 rounded-full transition-colors",
                i === currentTilsvarer ? config.progressFill : "bg-slate-200"
              )}
              aria-label={`Vis ${tilsvarerItems[i].label}`}
            />
          ))}
        </div>
      </div>

      {/* CO2 impact */}
      <div className="flex items-center justify-between">
        <div className={cn("flex items-center gap-2 px-2.5 py-1 rounded-full", "bg-green-100")}>
          <Leaf size={12} className="text-green-600" />
          <span className="text-xs font-medium text-green-700">
            {new Intl.NumberFormat("nb-NO", { notation: "compact" }).format(totalCO2)} tonn CO2 spart
          </span>
        </div>

        <SourceTooltip kilde={KILDER.fornybarEnergi} size="sm" />
      </div>

      {/* Expand button */}
      {expandable && (
        <button
          onClick={onExpandToggle}
          className={cn(
            "absolute bottom-2 right-2 p-1.5 rounded-md transition-all",
            isExpanded
              ? "text-indigo-600 opacity-100"
              : "text-slate-300 hover:text-slate-500 opacity-0 group-hover:opacity-100"
          )}
          aria-label={isExpanded ? "Skjul detaljer" : "Se detaljer"}
        >
          <ChevronDown
            size={14}
            className={cn("transition-transform duration-300", isExpanded && "rotate-180")}
          />
        </button>
      )}
    </motion.div>
  );
}

// =============================================================================
// VALUE CHAIN ARROWS
// =============================================================================

export function ValueChainArrow() {
  return (
    <div className="hidden md:flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="text-slate-300"
      >
        <ArrowRight size={24} />
      </motion.div>
    </div>
  );
}
