"use client";

import { useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { SourceTooltip } from "@/components/ui/SourceTooltip";
import { InfoTooltip } from "@/components/ui/InfoTooltip";
import { KILDER, FORBRUKSKATEGORIER } from "@/lib/eidsiva/eidsivaData";
import { motion, AnimatePresence } from "framer-motion";
import {
  PiggyBank,
  UtensilsCrossed,
  Shirt,
  Home,
  Sofa,
  Shield,
  HeartPulse,
  Smartphone,
  UtensilsCrossed as Restaurant,
  ShoppingBag,
  Building2,
  Sparkles,
  Clock,
  CalendarDays,
} from "lucide-react";

// Ikon-mapping for kategorier
const KATEGORI_IKONER: Record<string, React.ReactNode> = {
  sparing: <PiggyBank size={16} />,
  mat: <UtensilsCrossed size={16} />,
  klaer: <Shirt size={16} />,
  bolig: <Home size={16} />,
  mobler: <Sofa size={16} />,
  forsikring: <Shield size={16} />,
  helse: <HeartPulse size={16} />,
  tele: <Smartphone size={16} />,
  restaurant: <Restaurant size={16} />,
  andre: <ShoppingBag size={16} />,
  kommunalt: <Building2 size={16} />,
  kultur: <Sparkles size={16} />,
};

// Farger for kategorier
const KATEGORI_FARGER: Record<string, string> = {
  sparing: "#10B981",      // Grønn
  mat: "#F59E0B",          // Gul
  klaer: "#EC4899",        // Rosa
  bolig: "#3B82F6",        // Blå
  mobler: "#8B5CF6",       // Lilla
  forsikring: "#14B8A6",   // Teal
  helse: "#EF4444",        // Rød
  tele: "#6366F1",         // Indigo
  restaurant: "#F97316",   // Oransje
  andre: "#64748B",        // Grå
  kommunalt: "#0EA5E9",    // Lyseblå
  kultur: "#A855F7",       // Fiolett
};

// Formatering
const formatNOK = (value: number): string => {
  if (value >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(1)} mrd`;
  }
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(0)} mill`;
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(0)}k`;
  }
  return new Intl.NumberFormat("nb-NO").format(Math.round(value));
};

interface ConsumptionBreakdownProps {
  sumLonnskostnader: number;
  antallAnsatte: number;
  skattesats?: number;  // Default 35%
  className?: string;
}

interface KategoriData {
  id: string;
  navn: string;
  belop: number;
  andel: number;
  ikon: React.ReactNode;
  farge: string;
}

export function ConsumptionBreakdown({
  sumLonnskostnader,
  antallAnsatte,
  skattesats = 0.35,
  className = "",
}: ConsumptionBreakdownProps) {
  // Beregn netto inntekt og kategorier
  const data = useMemo(() => {
    const nettoInntekt = sumLonnskostnader * (1 - skattesats);
    const lokalAndel = 0.7; // 70% brukes lokalt
    const totalForbruk = nettoInntekt * lokalAndel;

    // Beregn per kategori
    const kategorier: KategoriData[] = FORBRUKSKATEGORIER.kategorier.map((kat) => ({
      id: kat.id,
      navn: kat.navn,
      belop: nettoInntekt * kat.andel,
      andel: kat.andel,
      ikon: KATEGORI_IKONER[kat.id] || <ShoppingBag size={16} />,
      farge: KATEGORI_FARGER[kat.id] || "#64748B",
    }));

    // Sorter etter beløp (størst først)
    kategorier.sort((a, b) => b.belop - a.belop);

    // Beregn nøkkeltall
    const dagerPerAr = 365;
    const virketimerPerAr = 1750;
    const perDag = totalForbruk / dagerPerAr;
    const perVirketime = totalForbruk / virketimerPerAr;
    const perAnsatt = antallAnsatte > 0 ? totalForbruk / antallAnsatte : 0;

    return {
      nettoInntekt,
      totalForbruk,
      kategorier,
      perDag,
      perVirketime,
      perAnsatt,
    };
  }, [sumLonnskostnader, antallAnsatte, skattesats]);

  // Finn største kategori for prosentberegning
  const maxBelop = Math.max(...data.kategorier.map((k) => k.belop));

  return (
    <Card className={className}>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <CardTitle size="md">Forbrukseffekter</CardTitle>
          <SourceTooltip kilde={KILDER.forbrukseffekter} size="md" />
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Hvordan ansattes inntekt bidrar til lokal økonomisk vekst
        </p>
      </CardHeader>
      <CardContent>
        {/* Nøkkeltall-kort */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-gradient-to-br from-petrol-50 to-petrol-100/50 rounded-lg p-3 text-center">
            <div className="flex items-center justify-center gap-1 text-petrol-600 mb-1">
              <CalendarDays size={14} />
              <span className="text-xs font-medium">Per dag</span>
            </div>
            <p className="text-lg font-bold text-petrol-700">
              {formatNOK(data.perDag)}
            </p>
          </div>
          <div className="bg-gradient-to-br from-sage-50 to-sage-100/50 rounded-lg p-3 text-center">
            <div className="flex items-center justify-center gap-1 text-sage-600 mb-1">
              <Clock size={14} />
              <span className="text-xs font-medium">Per virketime</span>
            </div>
            <p className="text-lg font-bold text-sage-700">
              {formatNOK(data.perVirketime)}
            </p>
          </div>
          <div className="bg-gradient-to-br from-slate-50 to-slate-100/50 rounded-lg p-3 text-center">
            <div className="flex items-center justify-center gap-1 text-slate-600 mb-1">
              <span className="text-xs font-medium">Per ansatt/år</span>
            </div>
            <p className="text-lg font-bold text-slate-700">
              {formatNOK(data.perAnsatt)}
            </p>
          </div>
        </div>

        {/* Kategorier */}
        <div className="space-y-2.5">
          <AnimatePresence mode="popLayout">
            {data.kategorier.map((kat, index) => (
              <motion.div
                key={kat.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: index * 0.03 }}
                className="group"
              >
                <div className="flex items-center gap-3">
                  {/* Ikon */}
                  <div
                    className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${kat.farge}15`, color: kat.farge }}
                  >
                    {kat.ikon}
                  </div>

                  {/* Label og beløp */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-slate-700 truncate">
                        {kat.navn}
                      </span>
                      <span className="text-sm font-medium text-slate-900 ml-2">
                        {formatNOK(kat.belop)}
                      </span>
                    </div>

                    {/* Progress bar */}
                    <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div
                        className="absolute inset-y-0 left-0 rounded-full"
                        style={{ backgroundColor: kat.farge }}
                        initial={{ width: 0 }}
                        animate={{ width: `${(kat.belop / maxBelop) * 100}%` }}
                        transition={{ duration: 0.5, delay: index * 0.03 }}
                      />
                    </div>
                  </div>

                  {/* Prosentandel */}
                  <span className="text-xs text-slate-400 w-10 text-right">
                    {(kat.andel * 100).toFixed(0)}%
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Total lokal forbruk */}
        <div className="mt-6 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-700">
                Total lokal forbrukseffekt
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                70% av netto inntekt brukes i lokalsamfunnet
              </p>
            </div>
            <p className="text-xl font-bold text-petrol-700">
              {formatNOK(data.totalForbruk)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
