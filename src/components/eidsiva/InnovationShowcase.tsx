"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Cpu,
  Leaf,
  Sun,
  Zap,
  Home,
  Plane,
  TreePine,
  Battery,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SourceTooltip } from "@/components/ui/SourceTooltip";
import { KILDER, EIDSIVA_NOKKELTALL } from "@/lib/eidsiva/eidsivaData";

const INNOVATION_PROJECTS = [
  {
    id: "heimdall",
    navn: "Heimdall Power",
    subtitle: "Smart nettdrift",
    icon: Cpu,
    color: "from-violet-500 to-purple-600",
    bgGradient: "bg-gradient-to-br from-violet-500/10 to-purple-600/5",
    borderColor: "border-violet-500/30",
    kilde: KILDER.heimdall,
    description:
      "Smarte sensorer på kraftlinjer gir sanntidsdata om kapasitet og temperatur.",
    mainStat: {
      value: `+${EIDSIVA_NOKKELTALL.heimdall.kapasitetsokningMal}%`,
      label: "mer kapasitet",
      subtext: "fra eksisterende nett",
    },
    equivalents: [
      {
        icon: Home,
        value: EIDSIVA_NOKKELTALL.heimdall.nyeHusstander.toLocaleString("nb-NO"),
        label: "nye husholdninger",
        description: "kan få strøm uten nye kraftlinjer",
      },
      {
        icon: Zap,
        value: EIDSIVA_NOKKELTALL.heimdall.potensielKapasitetTWh.toFixed(1),
        label: "TWh økt kapasitet",
        description: "potensial i nettverket",
      },
    ],
    highlight: "Smartere bruk av eksisterende infrastruktur",
  },
  {
    id: "obio",
    navn: "OBIO Biokull",
    subtitle: "Karbonfangst",
    icon: Leaf,
    color: "from-emerald-500 to-green-600",
    bgGradient: "bg-gradient-to-br from-emerald-500/10 to-green-600/5",
    borderColor: "border-emerald-500/30",
    kilde: KILDER.obio,
    description:
      "Biokull fra grantrær lagrer karbon i jorda i opptil 1000 år.",
    mainStat: {
      value: EIDSIVA_NOKKELTALL.obio.co2LagretTonn.toLocaleString("nb-NO"),
      label: "tonn CO₂",
      subtext: "fanget årlig",
    },
    equivalents: [
      {
        icon: Plane,
        value: EIDSIVA_NOKKELTALL.obio.tilsvarerFlyturer.toLocaleString("nb-NO"),
        label: "flyturer",
        description: "Oslo–Trondheim spart",
      },
      {
        icon: TreePine,
        value: EIDSIVA_NOKKELTALL.obio.arligProduksjonTonn.toString(),
        label: "tonn biokull/år",
        description: "produsert årlig",
      },
    ],
    highlight: `Eidsiva eier ${EIDSIVA_NOKKELTALL.obio.eierskap}% via Eidsiva Bioenergi`,
  },
  {
    id: "valerenga",
    navn: "Vålerenga Arena",
    subtitle: "Bærekraftig idrett",
    icon: Sun,
    color: "from-amber-500 to-orange-600",
    bgGradient: "bg-gradient-to-br from-amber-500/10 to-orange-600/5",
    borderColor: "border-amber-500/30",
    kilde: KILDER.valerenga,
    description:
      "Enga for målene – Norges mest bærekraftige fotballarena.",
    mainStat: {
      value: EIDSIVA_NOKKELTALL.valerenga.solcellerM2.toLocaleString("nb-NO"),
      label: "m² solceller",
      subtext: "på Intility Arena",
    },
    equivalents: [
      {
        icon: Zap,
        value: (EIDSIVA_NOKKELTALL.valerenga.solcellerProduksjonKWh / 1000).toLocaleString("nb-NO"),
        label: "MWh/år",
        description: "solstrømproduksjon",
      },
      {
        icon: Battery,
        value: EIDSIVA_NOKKELTALL.valerenga.batteriBackupTimer.toString(),
        label: "timer backup",
        description: "batterikapasitet",
      },
    ],
    highlight: `Dekker ${EIDSIVA_NOKKELTALL.valerenga.solcellerDekning}% av arenaens strømforbruk`,
  },
] as const;

export function InnovationShowcase() {
  const [expandedId, setExpandedId] = useState<string | null>("heimdall");

  return (
    <section className="relative">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 via-slate-900/80 to-slate-900/50 rounded-2xl" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-violet-500/5 via-transparent to-transparent rounded-2xl" />

      <div className="relative p-6 lg:p-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-white">
                Innovasjon for fremtiden
              </h2>
            </div>
            <p className="text-slate-400 text-sm max-w-lg">
              Eidsiva investerer i teknologi som former fremtidens energisystem.
              Fra smarte sensorer til karbonfangst og fornybar idrett.
            </p>
          </div>
        </div>

        {/* Project cards */}
        <div className="space-y-4">
          {INNOVATION_PROJECTS.map((project, index) => {
            const Icon = project.icon;
            const isExpanded = expandedId === project.id;

            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  "relative overflow-hidden rounded-xl border transition-all duration-300",
                  project.borderColor,
                  isExpanded ? project.bgGradient : "bg-slate-800/40 hover:bg-slate-800/60"
                )}
              >
                {/* Main content */}
                <div
                  className="p-5 cursor-pointer"
                  onClick={() => setExpandedId(isExpanded ? null : project.id)}
                >
                  <div className="flex items-start justify-between">
                    {/* Left side - Icon and info */}
                    <div className="flex items-start gap-4 flex-1">
                      <div
                        className={cn(
                          "w-14 h-14 rounded-xl flex items-center justify-center bg-gradient-to-br shrink-0",
                          project.color
                        )}
                      >
                        <Icon className="w-7 h-7 text-white" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-white">
                            {project.navn}
                          </h3>
                          <span className="text-xs text-slate-500 px-2 py-0.5 rounded-full bg-slate-700/50">
                            {project.subtitle}
                          </span>
                          <SourceTooltip kilde={project.kilde} />
                        </div>
                        <p className="text-sm text-slate-400 line-clamp-2">
                          {project.description}
                        </p>
                      </div>
                    </div>

                    {/* Right side - Main stat */}
                    <div className="text-right pl-4 shrink-0">
                      <div
                        className={cn(
                          "text-2xl font-bold bg-gradient-to-r bg-clip-text text-transparent",
                          project.color
                        )}
                      >
                        {project.mainStat.value}
                      </div>
                      <div className="text-xs text-slate-400">
                        {project.mainStat.label}
                      </div>
                      <div className="text-xs text-slate-500">
                        {project.mainStat.subtext}
                      </div>
                    </div>
                  </div>

                  {/* Expand indicator */}
                  <div className="flex items-center justify-center mt-3">
                    <motion.div
                      animate={{ rotate: isExpanded ? 90 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-slate-500"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </motion.div>
                  </div>
                </div>

                {/* Expanded content */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 pt-0">
                        <div className="h-px bg-slate-700/50 mb-4" />

                        {/* Equivalents grid */}
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          {project.equivalents.map((eq, i) => {
                            const EqIcon = eq.icon;
                            return (
                              <div
                                key={i}
                                className="p-4 rounded-lg bg-slate-800/60 border border-slate-700/50"
                              >
                                <div className="flex items-center gap-2 mb-2">
                                  <EqIcon className="w-4 h-4 text-slate-400" />
                                  <span className="text-xs text-slate-500 uppercase tracking-wide">
                                    {eq.label}
                                  </span>
                                </div>
                                <div
                                  className={cn(
                                    "text-xl font-bold bg-gradient-to-r bg-clip-text text-transparent mb-1",
                                    project.color
                                  )}
                                >
                                  {eq.value}
                                </div>
                                <div className="text-xs text-slate-400">
                                  {eq.description}
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Highlight */}
                        <div className="flex items-center gap-2 p-3 rounded-lg bg-slate-900/60 border border-slate-700/30">
                          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                          <span className="text-sm text-slate-300">
                            {project.highlight}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* FN Goals connection */}
        <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-blue-500/10 via-emerald-500/10 to-amber-500/10 border border-slate-700/30">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
              <span className="text-sm">🎯</span>
            </div>
            <span className="text-sm font-medium text-white">FNs bærekraftsmål</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { nr: 7, navn: "Ren energi" },
              { nr: 9, navn: "Innovasjon" },
              { nr: 11, navn: "Bærekraftige byer" },
              { nr: 13, navn: "Klimahandling" },
            ].map((mal) => (
              <span
                key={mal.nr}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800/60 border border-slate-700/50 text-xs"
              >
                <span className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center text-white text-[10px] font-bold">
                  {mal.nr}
                </span>
                <span className="text-slate-300">{mal.navn}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
