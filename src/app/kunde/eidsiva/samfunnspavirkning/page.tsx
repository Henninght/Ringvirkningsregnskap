"use client";

import { motion } from "framer-motion";
import { Sidebar } from "@/components/layout/Sidebar";
import { EnergyImpactExplorer } from "@/components/eidsiva/EnergyImpactExplorer";
import { CriticalInfrastructureShowcase } from "@/components/eidsiva/CriticalInfrastructureShowcase";
import { InnovationShowcase } from "@/components/eidsiva/InnovationShowcase";
import { Globe, Sparkles } from "lucide-react";

export default function SamfunnspavirkningPage() {
  return (
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar tenantId="eidsiva" />

      <main className="flex-1 lg:ml-[72px] min-h-screen">
        {/* Hero header */}
        <div className="relative overflow-hidden">
          {/* Background gradients */}
          <div className="absolute inset-0 bg-gradient-to-br from-petrol-600/20 via-slate-950 to-slate-950" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent" />

          {/* Grid pattern overlay */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `
                linear-gradient(to right, white 1px, transparent 1px),
                linear-gradient(to bottom, white 1px, transparent 1px)
              `,
              backgroundSize: "40px 40px",
            }}
          />

          <div className="relative px-6 lg:px-10 pt-8 pb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-petrol-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-petrol-500/20">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold text-white">
                    Samfunnspåvirkning
                  </h1>
                  <p className="text-slate-400 text-sm">
                    Eidsivas bidrag til samfunnet
                  </p>
                </div>
              </div>

              <p className="text-slate-400 text-base lg:text-lg max-w-2xl leading-relaxed">
                Utforsk hvordan Eidsivas energiproduksjon, infrastruktur og innovasjon
                skaper verdi for samfunnet. Alle tall er basert på faktiske data fra
                ringvirkningsrapporten.
              </p>

              {/* Quick stats */}
              <div className="flex flex-wrap gap-3 mt-6">
                {[
                  { label: "6.7 TWh", desc: "fornybar energi" },
                  { label: "2M+", desc: "innbyggere med strøm" },
                  { label: "74", desc: "vannkraftverk" },
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    className="px-4 py-2 rounded-full bg-slate-800/60 border border-slate-700/50 backdrop-blur-sm"
                  >
                    <span className="text-white font-semibold">{stat.label}</span>
                    <span className="text-slate-400 ml-2 text-sm">{stat.desc}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Main content */}
        <div className="px-6 lg:px-10 pb-12 space-y-8">
          {/* Energy Impact Explorer - Hero section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <EnergyImpactExplorer />
          </motion.div>

          {/* Two-column grid for Infrastructure and Innovation */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <CriticalInfrastructureShowcase />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <InnovationShowcase />
            </motion.div>
          </div>

          {/* Footer note */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex items-center justify-center gap-2 py-8 text-center"
          >
            <Sparkles className="w-4 h-4 text-slate-600" />
            <p className="text-sm text-slate-500">
              Alle tall og beregninger er hentet fra Eidsivas ringvirkningsrapport
            </p>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
