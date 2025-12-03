"use client";

import { useState, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { DirectEffectsPanel } from "@/components/eidsiva/DirectEffectsPanel";
import { ConsumptionBreakdown } from "@/components/eidsiva/ConsumptionBreakdown";
import { SupplierImpact } from "@/components/eidsiva/SupplierImpact";
import { EidsivaSankey } from "@/components/eidsiva/EidsivaSankey";
import { SourceTooltip } from "@/components/ui/SourceTooltip";
import { InfoTooltip } from "@/components/ui/InfoTooltip";
import { KILDER } from "@/lib/eidsiva/eidsivaData";
import { EIDSIVA_DESCRIPTIONS } from "@/lib/eidsiva/eidsivaDescriptions";
import {
  calculateRingvirkninger,
  type DirektEffektInput,
  type LeverandorInput,
} from "@/lib/eidsiva/rippleCalculations";
import {
  Calculator,
  TrendingUp,
  Users,
  Coins,
  ArrowRight,
  Sparkles,
} from "lucide-react";

// Formatering
const formatNOK = (value: number): string => {
  if (value >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(1)} mrd`;
  }
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(0)} mill`;
  }
  return new Intl.NumberFormat("nb-NO").format(Math.round(value));
};

// KPI-kort komponent
interface KpiCardProps {
  label: string;
  value: string;
  subtext?: string;
  icon: React.ReactNode;
  color: "petrol" | "sage" | "amber" | "slate";
  delay?: number;
}

function KpiCard({ label, value, subtext, icon, color, delay = 0 }: KpiCardProps) {
  const colorClasses = {
    petrol: "from-petrol-50 to-petrol-100/50 text-petrol-600",
    sage: "from-sage-50 to-sage-100/50 text-sage-600",
    amber: "from-amber-50 to-amber-100/50 text-amber-600",
    slate: "from-slate-50 to-slate-100/50 text-slate-600",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`bg-gradient-to-br ${colorClasses[color]} rounded-xl p-4`}
    >
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-sm font-medium">{label}</span>
      </div>
      <p className="text-2xl font-bold text-slate-800">{value}</p>
      {subtext && <p className="text-xs text-slate-500 mt-1">{subtext}</p>}
    </motion.div>
  );
}

export default function EidsivaKalkulatorPage() {
  // State for inputs
  const [direktInput, setDirektInput] = useState<DirektEffektInput>({
    antallAnsatte: 1200,
    sumLonnskostnader: 1_200_000_000,
    investeringer: 800_000_000,
    skattOgUtbytte: 500_000_000,
  });

  const [leverandorInput, setLeverandorInput] = useState<LeverandorInput>({
    totaleInnkjop: 2_500_000_000,
    antallLeverandorer: 850,
    innlandsandel: 85,
  });

  // Beregn ringvirkninger
  const resultat = useMemo(() => {
    return calculateRingvirkninger(direktInput, leverandorInput);
  }, [direktInput, leverandorInput]);

  // Dynamiske verdier for Sankey
  const sankeyValues = useMemo(() => ({
    direkteTotal: resultat.direkte.total,
    indirektTotal: resultat.indirekte.total,
    forbrukTotal: resultat.forbruk.total,
  }), [resultat]);

  // Callbacks for input changes
  const handleDirektChange = useCallback((input: DirektEffektInput) => {
    setDirektInput(input);
  }, []);

  const handleLeverandorChange = useCallback((input: LeverandorInput) => {
    setLeverandorInput(input);
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar tenantId="eidsiva" />

      <main className="flex-1 lg:ml-72 p-4 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-petrol-100 flex items-center justify-center">
              <Calculator size={24} className="text-petrol-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-slate-900">
                  Ringvirkningskalkulator
                </h1>
                <SourceTooltip kilde={KILDER.ringvirkninger} size="md" />
              </div>
              <p className="text-slate-500">
                Beregn direkte, indirekte og forbrukseffekter i sanntid
              </p>
            </div>
          </div>
        </div>

        {/* KPI-kort */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <KpiCard
            label="Total verdiskaping"
            value={formatNOK(resultat.totalVerdiskaping)}
            subtext="Samlet effekt"
            icon={<TrendingUp size={18} />}
            color="petrol"
            delay={0}
          />
          <KpiCard
            label="Multiplikator"
            value={`${resultat.multiplikator.toFixed(2)}x`}
            subtext="Ringvirkningseffekt"
            icon={<Sparkles size={18} />}
            color="sage"
            delay={0.05}
          />
          <KpiCard
            label="Ansatte hos leverandører"
            value={resultat.indirekte.anslattAnsatteHosLeverandorer.toLocaleString("nb-NO")}
            subtext="Estimert sysselsetting"
            icon={<Users size={18} />}
            color="amber"
            delay={0.1}
          />
          <KpiCard
            label="Lokal forbrukseffekt"
            value={formatNOK(resultat.forbruk.total)}
            subtext={`${formatNOK(resultat.forbruk.perDag)} per dag`}
            icon={<Coins size={18} />}
            color="slate"
            delay={0.15}
          />
        </div>

        {/* Hovedinnhold - to kolonner */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* Venstre kolonne - Input-paneler */}
          <div className="xl:col-span-5 space-y-6">
            <DirectEffectsPanel
              onChange={handleDirektChange}
              initialValues={direktInput}
            />

            <SupplierImpact
              onChange={handleLeverandorChange}
              initialValues={leverandorInput}
            />
          </div>

          {/* Høyre kolonne - Visualiseringer */}
          <div className="xl:col-span-7 space-y-6">
            {/* Sankey-diagram */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CardTitle size="lg">Verdiskaping - Live</CardTitle>
                  <SourceTooltip kilde={KILDER.ringvirkninger} size="md" />
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Sankey-diagrammet oppdateres automatisk basert på dine input
                </p>
              </CardHeader>
              <CardContent>
                <EidsivaSankey
                  dynamicValues={sankeyValues}
                  compact
                  standalone
                />
              </CardContent>
            </Card>

            {/* Forbrukseffekter */}
            <ConsumptionBreakdown
              sumLonnskostnader={direktInput.sumLonnskostnader}
              antallAnsatte={direktInput.antallAnsatte}
            />
          </div>
        </div>

        {/* Forklaring */}
        <div className="mt-8 p-6 bg-white rounded-2xl border border-slate-200">
          <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <InfoTooltip description={EIDSIVA_DESCRIPTIONS.ringvirkninger} size="md" />
            Slik beregnes ringvirkningene
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 font-bold">1</span>
              </div>
              <div>
                <p className="font-medium text-slate-700">Direkte effekter</p>
                <p className="text-sm text-slate-500">
                  Lønninger + investeringer + skatt/utbytte = intern verdiskaping
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                <span className="text-purple-600 font-bold">2</span>
              </div>
              <div>
                <p className="font-medium text-slate-700">Indirekte effekter</p>
                <p className="text-sm text-slate-500">
                  Innkjøp fra leverandører skaper arbeidsplasser i verdikjeden
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-pink-100 flex items-center justify-center flex-shrink-0">
                <span className="text-pink-600 font-bold">3</span>
              </div>
              <div>
                <p className="font-medium text-slate-700">Forbrukseffekter</p>
                <p className="text-sm text-slate-500">
                  Ansattes forbruk i lokalsamfunnet stimulerer lokal økonomi
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
