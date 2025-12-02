"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bike,
  Baby,
  Heart,
  GraduationCap,
  Stethoscope,
  Flame,
  Calculator,
  Sparkles,
  Info,
} from "lucide-react";
import {
  convertToWelfare,
  calculatePerTimeUnit,
  DEFAULT_WELFARE_COSTS,
  type WelfareConversion,
} from "@/lib/eidsiva/welfareConversions";
import { KILDER } from "@/lib/eidsiva/eidsivaData";
import { SourceTooltip } from "@/components/ui/SourceTooltip";

// =============================================================================
// IKON-MAPPING
// =============================================================================

const WELFARE_ICONS: Record<string, React.ReactNode> = {
  sykkelvei: <Bike size={24} />,
  barnehage: <Baby size={24} />,
  sykehjem: <Heart size={24} />,
  laerer: <GraduationCap size={24} />,
  sykepleier: <Stethoscope size={24} />,
  brannkonstabel: <Flame size={24} />,
};

const WELFARE_COLORS: Record<string, string> = {
  sykkelvei: "from-emerald-500 to-emerald-600",
  barnehage: "from-pink-500 to-pink-600",
  sykehjem: "from-rose-500 to-rose-600",
  laerer: "from-amber-500 to-amber-600",
  sykepleier: "from-petrol-500 to-petrol-600",
  brannkonstabel: "from-orange-500 to-orange-600",
};

const WELFARE_BG: Record<string, string> = {
  sykkelvei: "bg-emerald-50 border-emerald-200",
  barnehage: "bg-pink-50 border-pink-200",
  sykehjem: "bg-rose-50 border-rose-200",
  laerer: "bg-amber-50 border-amber-200",
  sykepleier: "bg-petrol-50 border-petrol-200",
  brannkonstabel: "bg-orange-50 border-orange-200",
};

// =============================================================================
// ANIMERT TALL-KOMPONENT
// =============================================================================

function AnimatedNumber({ value, duration = 1000 }: { value: number; duration?: number }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setDisplayValue(Math.floor(easeOutQuart * value));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [value, duration]);

  return (
    <span>
      {new Intl.NumberFormat("nb-NO").format(displayValue)}
    </span>
  );
}

// =============================================================================
// VELFERDSKORTET
// =============================================================================

interface WelfareCardProps {
  conversion: WelfareConversion;
  index: number;
  isHighlighted?: boolean;
}

function WelfareCard({ conversion, index, isHighlighted }: WelfareCardProps) {
  const icon = WELFARE_ICONS[conversion.id] || <Calculator size={24} />;
  const gradientClass = WELFARE_COLORS[conversion.id] || "from-slate-500 to-slate-600";
  const bgClass = WELFARE_BG[conversion.id] || "bg-slate-50 border-slate-200";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.4,
        delay: index * 0.08,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className={`
        relative overflow-hidden rounded-xl border p-4 transition-all duration-300
        ${bgClass}
        ${isHighlighted ? "ring-2 ring-petrol-400 ring-offset-2" : ""}
        hover:shadow-lg hover:-translate-y-0.5
      `}
    >
      {/* Dekorativ gradient-linje */}
      <div
        className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${gradientClass}`}
      />

      <div className="flex items-start gap-3">
        {/* Ikon */}
        <div
          className={`
            w-12 h-12 rounded-xl bg-gradient-to-br ${gradientClass}
            flex items-center justify-center text-white shadow-lg
            flex-shrink-0
          `}
        >
          {icon}
        </div>

        {/* Innhold */}
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2">
            <span
              className="text-2xl font-bold text-slate-800"
              style={{ fontFamily: "var(--font-outfit)" }}
            >
              <AnimatedNumber value={conversion.verdi} />
            </span>
            <span className="text-sm text-slate-500">{conversion.enhet}</span>
          </div>
          <div className="text-sm font-medium text-slate-700 mt-0.5">
            {conversion.navn}
          </div>
          <div className="text-xs text-slate-400 mt-1">
            {conversion.beskrivelse}
          </div>
        </div>
      </div>

      {/* Sparkle-effekt for høye verdier */}
      {conversion.verdi > 100 && (
        <motion.div
          className="absolute top-3 right-3 text-amber-400"
          animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
        >
          <Sparkles size={16} />
        </motion.div>
      )}
    </motion.div>
  );
}

// =============================================================================
// HOVEDKOMPONENT
// =============================================================================

interface WelfareCalculatorProps {
  initialValue?: number;
  onValueChange?: (value: number) => void;
  showInput?: boolean;
  className?: string;
}

export function WelfareCalculator({
  initialValue = 0,
  onValueChange,
  showInput = true,
  className = "",
}: WelfareCalculatorProps) {
  const [inputValue, setInputValue] = useState<string>(
    initialValue > 0 ? initialValue.toString() : ""
  );
  const [highlightedCard, setHighlightedCard] = useState<string | null>(null);

  // Parse input til tall (MNOK -> NOK)
  const valueInNOK = useMemo(() => {
    const parsed = parseFloat(inputValue.replace(/\s/g, "").replace(",", "."));
    return isNaN(parsed) ? 0 : parsed * 1_000_000; // MNOK til NOK
  }, [inputValue]);

  // Beregn konverteringer
  const conversions = useMemo(() => {
    return convertToWelfare(valueInNOK);
  }, [valueInNOK]);

  // Beregn per tidsenhet
  const timeUnits = useMemo(() => {
    return calculatePerTimeUnit(valueInNOK);
  }, [valueInNOK]);

  // Oppdater forelder ved endring
  useEffect(() => {
    const mnok = parseFloat(inputValue.replace(/\s/g, "").replace(",", "."));
    if (!isNaN(mnok)) {
      onValueChange?.(mnok);
    }
  }, [inputValue, onValueChange]);

  // Preset-knapper for rask input
  const presets = [100, 500, 1000, 2000];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sage-400 to-sage-600 flex items-center justify-center shadow-lg">
            <Calculator size={20} className="text-white" />
          </div>
          <div>
            <h3
              className="text-lg font-semibold text-slate-800"
              style={{ fontFamily: "var(--font-outfit)" }}
            >
              Velferdskalkulator
            </h3>
            <p className="text-xs text-slate-500">
              Se hva verdiskapingen tilsvarer i offentlige tjenester
            </p>
          </div>
        </div>
        <SourceTooltip kilde={KILDER.velferdsbidrag} />
      </div>

      {/* Input-seksjon */}
      {showInput && (
        <div className="space-y-3">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">
              Total verdiskaping
            </span>
            <div className="relative mt-1">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => {
                  // Tillat tall, komma, punktum og mellomrom
                  const value = e.target.value.replace(/[^0-9,.\s]/g, "");
                  setInputValue(value);
                }}
                placeholder="0"
                className="
                  w-full px-4 py-3 pr-20 text-2xl font-bold text-slate-800
                  bg-white border-2 border-slate-200 rounded-xl
                  focus:border-petrol-400 focus:ring-4 focus:ring-petrol-100
                  transition-all duration-200 outline-none
                "
                style={{ fontFamily: "var(--font-outfit)" }}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-lg font-medium text-slate-400">
                MNOK
              </span>
            </div>
          </label>

          {/* Preset-knapper */}
          <div className="flex gap-2 flex-wrap">
            {presets.map((preset) => (
              <button
                key={preset}
                onClick={() => setInputValue(preset.toString())}
                className={`
                  px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-200
                  ${
                    inputValue === preset.toString()
                      ? "bg-petrol-500 text-white shadow-md"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }
                `}
              >
                {preset} MNOK
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Konverteringer */}
      <AnimatePresence mode="wait">
        {valueInNOK > 0 ? (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            {/* Tidsenhet-kort */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-petrol-500 to-petrol-600 rounded-xl p-4 text-white shadow-lg"
            >
              <div className="flex items-center gap-2 mb-3">
                <Info size={16} className="text-petrol-200" />
                <span className="text-sm font-medium text-petrol-100">
                  Med andre ord...
                </span>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div
                    className="text-2xl font-bold"
                    style={{ fontFamily: "var(--font-outfit)" }}
                  >
                    {new Intl.NumberFormat("nb-NO").format(timeUnits.perDag)}
                  </div>
                  <div className="text-xs text-petrol-200">NOK per dag</div>
                </div>
                <div>
                  <div
                    className="text-2xl font-bold"
                    style={{ fontFamily: "var(--font-outfit)" }}
                  >
                    {new Intl.NumberFormat("nb-NO").format(timeUnits.perVirketime)}
                  </div>
                  <div className="text-xs text-petrol-200">NOK per virketime</div>
                </div>
                <div>
                  <div
                    className="text-2xl font-bold"
                    style={{ fontFamily: "var(--font-outfit)" }}
                  >
                    {new Intl.NumberFormat("nb-NO").format(timeUnits.perManed)}
                  </div>
                  <div className="text-xs text-petrol-200">NOK per måned</div>
                </div>
              </div>
            </motion.div>

            {/* Velferdskonverteringer grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {conversions.map((conversion, index) => (
                <WelfareCard
                  key={conversion.id}
                  conversion={conversion}
                  index={index}
                  isHighlighted={highlightedCard === conversion.id}
                />
              ))}
            </div>

            {/* Kostnadsfaktorer info */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-xs text-slate-400 text-center pt-2 border-t border-slate-200"
            >
              <span className="font-medium">Basert på SSB-statistikk:</span> Sykkelvei{" "}
              {(DEFAULT_WELFARE_COSTS.sykkelVeiPerKm / 1_000_000).toFixed(0)} MNOK/km •
              Barnehage {(DEFAULT_WELFARE_COSTS.barnehagePlassPerAr / 1000).toFixed(0)}k/plass •
              Lærer {(DEFAULT_WELFARE_COSTS.larerArslonn / 1000).toFixed(0)}k/årsverk
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-12"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-100 flex items-center justify-center">
              <Calculator size={32} className="text-slate-300" />
            </div>
            <p className="text-slate-500">
              Skriv inn et beløp for å se hva det tilsvarer
            </p>
            <p className="text-xs text-slate-400 mt-2">
              F.eks. {presets[1]} MNOK i verdiskaping
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
