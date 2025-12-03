"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  Flame,
  Shield,
  BadgeCheck,
  Zap,
  AlertTriangle,
  Users,
  Heart,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SourceTooltip } from "@/components/ui/SourceTooltip";
import { KILDER, EIDSIVA_NOKKELTALL } from "@/lib/eidsiva/eidsivaData";

// Kritisk infrastruktur med storytelling-fokus
const INFRASTRUCTURE_CATEGORIES = [
  {
    id: "sykehus",
    navn: "Sykehus",
    icon: Building2,
    color: "from-red-500 to-rose-600",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/20",
    iconBg: "bg-red-500/20",
    description: "Livreddende behandling og intensivavdelinger",
    impact: "Hvert sekund teller på intensivavdelingen. Pusteutstyr, overvåking og operasjonsutstyr – alt er avhengig av stabil strøm.",
    stats: [
      { label: "Sykehus forsynt", value: "191", suffix: "" },
      { label: "Årlig strøm til sykehus", value: "6.2", suffix: "TWh kapasitet" },
    ],
  },
  {
    id: "brannstasjoner",
    navn: "Brannstasjoner",
    icon: Flame,
    color: "from-orange-500 to-amber-600",
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-500/20",
    iconBg: "bg-orange-500/20",
    description: "Beredskap og rask utrykning 24/7",
    impact: "Garasjeporter, kommunikasjon og ladning av utstyr. Uten strøm stopper beredskapen.",
    stats: [
      { label: "Regioner dekket", value: "2", suffix: "" },
      { label: "Innbyggere beskyttet", value: "2M+", suffix: "" },
    ],
  },
  {
    id: "militaerleire",
    navn: "Militærleire",
    icon: Shield,
    color: "from-emerald-500 to-green-600",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/20",
    iconBg: "bg-emerald-500/20",
    description: "Nasjonal sikkerhet og forsvar",
    impact: "Kommunikasjonssystemer, overvåking og beredskap. Militær infrastruktur krever uavbrutt strømforsyning.",
    stats: [
      { label: "Geografisk dekning", value: "Innlandet", suffix: "& Oslo" },
      { label: "Infrastrukturtype", value: "Kritisk", suffix: "" },
    ],
  },
  {
    id: "politistasjoner",
    navn: "Politistasjoner",
    icon: BadgeCheck,
    color: "from-blue-500 to-indigo-600",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
    iconBg: "bg-blue-500/20",
    description: "Trygghet og lov og orden",
    impact: "Nødnummer, arrestlokaler og etterforskningssystemer. Samfunnets trygghet avhenger av pålitelig strøm.",
    stats: [
      { label: "Nødtjenester", value: "24/7", suffix: "" },
      { label: "Kommunikasjon", value: "Kritisk", suffix: "" },
    ],
  },
] as const;

export function CriticalInfrastructureShowcase() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <section className="relative">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 via-slate-900/80 to-slate-900/50 rounded-2xl" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-500/5 via-transparent to-transparent rounded-2xl" />

      <div className="relative p-6 lg:p-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-white">
                Kritisk infrastruktur
              </h2>
            </div>
            <p className="text-slate-400 text-sm max-w-lg">
              Eidsiva forsyner samfunnskritiske virksomheter med strøm.
              Når det gjelder liv, helse og nasjonal sikkerhet, er stabil strøm ikke et valg – det er en nødvendighet.
            </p>
          </div>
          <SourceTooltip kilde={KILDER.kritiskInfrastruktur} />
        </div>

        {/* Stats banner */}
        <div className="flex items-center gap-6 mb-8 p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-petrol-400" />
            <div>
              <div className="text-lg font-semibold text-white">
                {EIDSIVA_NOKKELTALL.kundedekning.innbyggereMedStrom.toLocaleString("nb-NO")}+
              </div>
              <div className="text-xs text-slate-400">mennesker med strøm</div>
            </div>
          </div>
          <div className="w-px h-10 bg-slate-700" />
          <div className="flex items-center gap-3">
            <Heart className="w-5 h-5 text-red-400" />
            <div>
              <div className="text-lg font-semibold text-white">
                24/7
              </div>
              <div className="text-xs text-slate-400">beredskapsleveranse</div>
            </div>
          </div>
          <div className="w-px h-10 bg-slate-700" />
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-emerald-400" />
            <div>
              <div className="text-lg font-semibold text-white">
                {EIDSIVA_NOKKELTALL.eierskap.geografiskDekning.join(" & ")}
              </div>
              <div className="text-xs text-slate-400">geografisk dekning</div>
            </div>
          </div>
        </div>

        {/* Infrastructure grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {INFRASTRUCTURE_CATEGORIES.map((category, index) => {
            const Icon = category.icon;
            const isHovered = hoveredId === category.id;
            const isSelected = selectedId === category.id;
            const isActive = isHovered || isSelected;

            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative"
                onMouseEnter={() => setHoveredId(category.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => setSelectedId(isSelected ? null : category.id)}
              >
                <div
                  className={cn(
                    "relative overflow-hidden rounded-xl border transition-all duration-300 cursor-pointer",
                    category.borderColor,
                    isActive
                      ? "bg-slate-800/80 border-opacity-50"
                      : "bg-slate-800/40 hover:bg-slate-800/60"
                  )}
                >
                  {/* Gradient overlay on hover */}
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className={cn(
                          "absolute inset-0 bg-gradient-to-br opacity-10",
                          category.color
                        )}
                      />
                    )}
                  </AnimatePresence>

                  <div className="relative p-5">
                    {/* Top row */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300",
                            category.iconBg,
                            isActive && "scale-110"
                          )}
                        >
                          <Icon
                            className={cn(
                              "w-6 h-6 transition-colors duration-300",
                              isActive ? "text-white" : "text-slate-300"
                            )}
                          />
                        </div>
                        <div>
                          <h3 className="font-semibold text-white">
                            {category.navn}
                          </h3>
                          <p className="text-sm text-slate-400">
                            {category.description}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Impact message - shown on hover/click */}
                    <AnimatePresence mode="wait">
                      {isActive ? (
                        <motion.div
                          key="impact"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="flex items-start gap-2 p-3 rounded-lg bg-slate-900/60 border border-slate-700/50 mb-4">
                            <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                            <p className="text-sm text-slate-300 leading-relaxed">
                              {category.impact}
                            </p>
                          </div>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="placeholder"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="h-4 mb-4"
                        />
                      )}
                    </AnimatePresence>

                    {/* Stats */}
                    <div className="flex gap-4">
                      {category.stats.map((stat, i) => (
                        <div key={i} className="flex-1">
                          <div className="text-xs text-slate-500 mb-1">
                            {stat.label}
                          </div>
                          <div className="flex items-baseline gap-1">
                            <span
                              className={cn(
                                "text-lg font-semibold bg-gradient-to-r bg-clip-text text-transparent",
                                category.color
                              )}
                            >
                              {stat.value}
                            </span>
                            {stat.suffix && (
                              <span className="text-xs text-slate-400">
                                {stat.suffix}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Click hint */}
                  <div
                    className={cn(
                      "absolute bottom-2 right-3 text-xs transition-opacity duration-300",
                      isHovered && !isSelected
                        ? "opacity-100 text-slate-500"
                        : "opacity-0"
                    )}
                  >
                    Klikk for mer info
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom note */}
        <div className="mt-6 p-4 rounded-xl bg-slate-800/30 border border-slate-700/30">
          <p className="text-xs text-slate-500 text-center">
            Eidsiva via Elvia-nettet sikrer normalfunksjon for landets kjernevirksomheter
            innen liv, helse, trygghet og nasjonal sikkerhet.{" "}
            <span className="text-slate-400">Kilde: Ringvirkningsrapporten s. 11</span>
          </p>
        </div>
      </div>
    </section>
  );
}
