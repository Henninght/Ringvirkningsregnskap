"use client";

import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { RegionMap, type Region } from "@/components/eidsiva/RegionMap";
import { SourceTooltip } from "@/components/ui/SourceTooltip";
import { KILDER, EIDSIVA_REGIONER } from "@/lib/eidsiva/eidsivaData";
import {
  convertToWelfare,
  calculatePerTimeUnit,
} from "@/lib/eidsiva/welfareConversions";
import {
  MapPin,
  Sliders,
  BarChart3,
  RefreshCcw,
  X,
  ChevronDown,
  Bike,
  Baby,
  Heart,
  GraduationCap,
  Stethoscope,
  Flame,
  TrendingUp,
  Building2,
  Mountain,
} from "lucide-react";

// =============================================================================
// TABS
// =============================================================================

type TabId = "innlandet" | "oslo";

interface Tab {
  id: TabId;
  label: string;
  icon: React.ReactNode;
}

// =============================================================================
// EKSEMPEL-DATA
// =============================================================================

const EXAMPLE_REGION_VALUES: Record<string, number> = {
  "nord-gudbrandsdal": 85,
  "midt-gudbrandsdal": 250,
  "nord-osterdal": 95,
  valdres: 75,
  lillehammer: 280,
  "sor-osterdal": 150,
  gjovik: 220,
  hamar: 450,
  kongsvinger: 180,
  gran: 90,
  oslo: 320,
};

// =============================================================================
// IKON-MAPPING FOR VELFERD
// =============================================================================

const WELFARE_ICONS: Record<string, React.ReactNode> = {
  sykkelvei: <Bike size={20} />,
  barnehage: <Baby size={20} />,
  sykehjem: <Heart size={20} />,
  laerer: <GraduationCap size={20} />,
  sykepleier: <Stethoscope size={20} />,
  brannkonstabel: <Flame size={20} />,
};

const WELFARE_COLORS: Record<string, string> = {
  sykkelvei: "text-emerald-600 bg-emerald-50",
  barnehage: "text-pink-600 bg-pink-50",
  sykehjem: "text-rose-600 bg-rose-50",
  laerer: "text-amber-600 bg-amber-50",
  sykepleier: "text-petrol-600 bg-petrol-50",
  brannkonstabel: "text-orange-600 bg-orange-50",
};

// =============================================================================
// INNLANDET REGIONER (ekskluderer Oslo)
// =============================================================================

const INNLANDET_ONLY_REGIONER = EIDSIVA_REGIONER.filter(r => r.id !== "oslo");

// =============================================================================
// KOLLAPSBAR REGION INPUT PANEL (KUN INNLANDET)
// =============================================================================

interface RegionInputPanelProps {
  regionData: Record<string, number>;
  onRegionDataChange: (data: Record<string, number>) => void;
  selectedRegionId: string | null;
}

function RegionInputPanel({
  regionData,
  onRegionDataChange,
  selectedRegionId,
}: RegionInputPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleInputChange = (regionId: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    onRegionDataChange({
      ...regionData,
      [regionId]: numValue,
    });
  };

  // Kun Innlandet-regioner
  const innlandetTotal = INNLANDET_ONLY_REGIONER.reduce(
    (sum, r) => sum + (regionData[r.id] || 0),
    0
  );
  const regionsWithData = INNLANDET_ONLY_REGIONER.filter(
    (r) => (regionData[r.id] || 0) > 0
  ).length;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header - alltid synlig */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-petrol-50 flex items-center justify-center">
            <Sliders size={18} className="text-petrol-600" />
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-slate-800">Regionverdier</h3>
            <p className="text-xs text-slate-500">
              {regionsWithData} av 10 regioner • {innlandetTotal.toLocaleString("nb-NO")} MNOK
            </p>
          </div>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={20} className="text-slate-400" />
        </motion.div>
      </button>

      {/* Expanded content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="border-t border-slate-100">
              {/* Grid med region-inputs - kun Innlandet */}
              <div className="p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {INNLANDET_ONLY_REGIONER.map((region) => {
                  const isSelected = selectedRegionId === region.id;
                  const value = regionData[region.id] || 0;
                  return (
                    <div
                      key={region.id}
                      className={`
                        p-3 rounded-xl border-2 transition-all
                        ${isSelected
                          ? "bg-petrol-50 border-petrol-300"
                          : value > 0
                            ? "bg-slate-50 border-slate-200"
                            : "bg-white border-slate-100"
                        }
                      `}
                    >
                      <label className="block">
                        <span className="text-xs font-medium text-slate-600 block mb-1.5 truncate">
                          {region.navn}
                        </span>
                        <div className="relative">
                          <input
                            type="number"
                            value={regionData[region.id] || ""}
                            onChange={(e) => handleInputChange(region.id, e.target.value)}
                            placeholder="0"
                            className="w-full px-2 py-1.5 text-sm font-medium text-right rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-petrol-300 focus:border-petrol-300"
                          />
                        </div>
                      </label>
                    </div>
                  );
                })}
              </div>

              {/* Actions */}
              <div className="px-4 pb-4 flex gap-2">
                <button
                  onClick={() => onRegionDataChange(EXAMPLE_REGION_VALUES)}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-petrol-700 bg-petrol-50 rounded-lg hover:bg-petrol-100 transition-colors"
                >
                  <RefreshCcw size={14} />
                  Last eksempeldata
                </button>
                <button
                  onClick={() => onRegionDataChange({})}
                  className="px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Nullstill
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// =============================================================================
// OSLO INPUT PANEL
// =============================================================================

interface OsloInputPanelProps {
  value: number;
  onChange: (value: number) => void;
}

function OsloInputPanel({ value, onChange }: OsloInputPanelProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center">
          <Building2 size={24} className="text-amber-600" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-slate-800">Oslo-regionen</h3>
          <p className="text-xs text-slate-500">Verdiskaping i hovedstadsområdet</p>
        </div>
        <div className="w-40">
          <div className="relative">
            <input
              type="number"
              value={value || ""}
              onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
              placeholder="0"
              className="w-full px-3 py-2 text-lg font-bold text-right rounded-xl border-2 border-amber-200 bg-amber-50 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-300"
              style={{ fontFamily: "var(--font-outfit)" }}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-amber-600 pointer-events-none font-medium">
              MNOK
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// KOMPAKT VELFERDSVISNING
// =============================================================================

interface WelfareSummaryProps {
  valueMNOK: number;
  regionName?: string;
}

function WelfareSummary({ valueMNOK, regionName }: WelfareSummaryProps) {
  const valueInNOK = valueMNOK * 1_000_000;
  const conversions = convertToWelfare(valueInNOK);
  const timeUnits = calculatePerTimeUnit(valueInNOK);

  if (valueMNOK === 0) {
    return (
      <div className="text-center py-8 text-slate-400">
        <p>Ingen data å vise</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-500 uppercase tracking-wide">
            {regionName ? "Valgt region" : "Alle regioner"}
          </p>
          <h3
            className="text-xl font-bold text-slate-800"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            {regionName || "Samlet verdiskaping"}
          </h3>
        </div>
        <div className="text-right">
          <p
            className="text-3xl font-bold text-petrol-600"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            {valueMNOK >= 1000
              ? `${(valueMNOK / 1000).toFixed(1)} mrd`
              : `${valueMNOK.toLocaleString("nb-NO")} MNOK`}
          </p>
        </div>
      </div>

      {/* Per tidsenhet - horisontal */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-slate-800 text-white rounded-xl p-3 text-center">
          <p
            className="text-lg font-bold"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            {(timeUnits.perDag / 1000).toFixed(0)}k
          </p>
          <p className="text-xs text-slate-300">NOK/dag</p>
        </div>
        <div className="bg-slate-700 text-white rounded-xl p-3 text-center">
          <p
            className="text-lg font-bold"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            {(timeUnits.perVirketime / 1000).toFixed(0)}k
          </p>
          <p className="text-xs text-slate-300">NOK/virketime</p>
        </div>
        <div className="bg-slate-600 text-white rounded-xl p-3 text-center">
          <p
            className="text-lg font-bold"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            {(timeUnits.perManed / 1_000_000).toFixed(0)}M
          </p>
          <p className="text-xs text-slate-300">NOK/måned</p>
        </div>
      </div>

      {/* Velferdskonverteringer - 2x3 grid */}
      <div>
        <p className="text-xs text-slate-500 uppercase tracking-wide mb-3">
          Tilsvarer i offentlige tjenester
        </p>
        <div className="grid grid-cols-2 gap-3">
          {conversions.map((conv) => (
            <div
              key={conv.id}
              className={`flex items-center gap-3 p-3 rounded-xl ${WELFARE_COLORS[conv.id]}`}
            >
              <div className="flex-shrink-0">{WELFARE_ICONS[conv.id]}</div>
              <div className="min-w-0">
                <p
                  className="text-xl font-bold leading-tight"
                  style={{ fontFamily: "var(--font-outfit)" }}
                >
                  {conv.verdi.toLocaleString("nb-NO")}
                </p>
                <p className="text-xs opacity-80 truncate">{conv.navn}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Kilde */}
      <p className="text-xs text-slate-400 text-center pt-2 border-t border-slate-100">
        Basert på SSB-statistikk og rapportens beregningsmodell
      </p>
    </div>
  );
}

// =============================================================================
// HOVEDSIDE
// =============================================================================

const TABS: Tab[] = [
  { id: "innlandet", label: "Innlandet", icon: <Mountain size={18} /> },
  { id: "oslo", label: "Oslo", icon: <Building2 size={18} /> },
];

export default function VerdikartPage() {
  const [regionData, setRegionData] = useState<Record<string, number>>(
    EXAMPLE_REGION_VALUES
  );
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>("innlandet");

  // Beregn verdier
  const innlandetValue = useMemo(
    () => INNLANDET_ONLY_REGIONER.reduce((sum, r) => sum + (regionData[r.id] || 0), 0),
    [regionData]
  );

  const osloValue = useMemo(() => regionData["oslo"] || 0, [regionData]);

  const totalValue = innlandetValue + osloValue;

  // Verdi for velferdskalkulator basert på aktiv tab og valgt region
  const displayValue = useMemo(() => {
    if (selectedRegion) {
      return regionData[selectedRegion.id] || 0;
    }
    return activeTab === "innlandet" ? innlandetValue : osloValue;
  }, [regionData, selectedRegion, activeTab, innlandetValue, osloValue]);

  const displayName = useMemo(() => {
    if (selectedRegion) {
      return selectedRegion.navn;
    }
    return activeTab === "innlandet" ? "Innlandet samlet" : "Oslo";
  }, [selectedRegion, activeTab]);

  // Topp-region kun for Innlandet
  const topRegion = useMemo(() => {
    const entries = INNLANDET_ONLY_REGIONER
      .map((r) => ({ id: r.id, navn: r.navn, value: regionData[r.id] || 0 }))
      .filter((r) => r.value > 0);
    if (entries.length === 0) return null;
    const sorted = entries.sort((a, b) => b.value - a.value);
    return sorted[0];
  }, [regionData]);

  const handleRegionSelect = useCallback((region: Region | null) => {
    setSelectedRegion(region);
    // Bytt til riktig tab basert på valgt region
    if (region) {
      setActiveTab(region.id === "oslo" ? "oslo" : "innlandet");
    }
  }, []);

  const handleOsloValueChange = useCallback((value: number) => {
    setRegionData((prev) => ({ ...prev, oslo: value }));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <Sidebar tenantId="eidsiva" />

      {/* Main Content */}
      <main className="flex-1 ml-[72px] p-6 lg:p-8">
        {/* Header */}
        <header className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1
                className="text-2xl font-bold text-slate-800 mb-1 tracking-tight"
                style={{ fontFamily: "var(--font-outfit)" }}
              >
                Regionalt Verdikart
              </h1>
              <p className="text-sm text-slate-500">
                Eidsiva Energis verdiskaping fordelt på Innlandet og Oslo
              </p>
            </div>
            <SourceTooltip kilde={KILDER.regionaltKart} size="md" />
          </div>
        </header>

        {/* Tab-navigasjon */}
        <div className="flex items-center gap-2 mb-6">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setSelectedRegion(null);
              }}
              className={`
                flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all
                ${activeTab === tab.id
                  ? tab.id === "oslo"
                    ? "bg-amber-500 text-white shadow-lg"
                    : "bg-petrol-500 text-white shadow-lg"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                }
              `}
            >
              {tab.icon}
              <span>{tab.label}</span>
              <span
                className={`
                  text-xs px-2 py-0.5 rounded-full ml-1
                  ${activeTab === tab.id
                    ? "bg-white/20 text-white"
                    : "bg-slate-100 text-slate-500"
                  }
                `}
              >
                {tab.id === "oslo"
                  ? `${osloValue.toLocaleString("nb-NO")} MNOK`
                  : `${innlandetValue.toLocaleString("nb-NO")} MNOK`
                }
              </span>
            </button>
          ))}

          {/* Total indikator */}
          <div className="ml-auto flex items-center gap-3 px-4 py-2 bg-slate-100 rounded-xl">
            <span className="text-sm text-slate-500">Totalt:</span>
            <span
              className="text-lg font-bold text-slate-800"
              style={{ fontFamily: "var(--font-outfit)" }}
            >
              {totalValue >= 1000
                ? `${(totalValue / 1000).toFixed(1)} mrd`
                : `${totalValue.toLocaleString("nb-NO")} MNOK`
              }
            </span>
          </div>
        </div>

        {/* Tab-innhold */}
        <AnimatePresence mode="wait">
          {activeTab === "innlandet" ? (
            <motion.div
              key="innlandet"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
            >
              {/* Innlandet region-input */}
              <div className="mb-6">
                <RegionInputPanel
                  regionData={regionData}
                  onRegionDataChange={setRegionData}
                  selectedRegionId={selectedRegion?.id || null}
                />
              </div>

              {/* Statistikk for Innlandet */}
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm"
                >
                  <div className="flex items-center gap-2 text-slate-500 mb-2">
                    <Mountain size={16} />
                    <span className="text-sm">Innlandet totalt</span>
                  </div>
                  <p
                    className="text-2xl font-bold text-petrol-600"
                    style={{ fontFamily: "var(--font-outfit)" }}
                  >
                    {innlandetValue.toLocaleString("nb-NO")}
                  </p>
                  <p className="text-xs text-slate-400">MNOK</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 }}
                  className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm"
                >
                  <div className="flex items-center gap-2 text-slate-500 mb-2">
                    <TrendingUp size={16} />
                    <span className="text-sm">Høyest bidrag</span>
                  </div>
                  <p
                    className="text-lg font-bold text-sage-600 truncate"
                    style={{ fontFamily: "var(--font-outfit)" }}
                  >
                    {topRegion?.navn || "-"}
                  </p>
                  <p className="text-xs text-slate-400">
                    {topRegion ? `${topRegion.value.toLocaleString("nb-NO")} MNOK` : "-"}
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm"
                >
                  <div className="flex items-center gap-2 text-slate-500 mb-2">
                    <BarChart3 size={16} />
                    <span className="text-sm">Regioner med data</span>
                  </div>
                  <p
                    className="text-2xl font-bold text-slate-700"
                    style={{ fontFamily: "var(--font-outfit)" }}
                  >
                    {INNLANDET_ONLY_REGIONER.filter((r) => (regionData[r.id] || 0) > 0).length}
                  </p>
                  <p className="text-xs text-slate-400">av 10 regioner</p>
                </motion.div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="oslo"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {/* Oslo input */}
              <div className="mb-6">
                <OsloInputPanel
                  value={osloValue}
                  onChange={handleOsloValueChange}
                />
              </div>

              {/* Oslo statistikk */}
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl p-5 border border-amber-200 shadow-sm"
                >
                  <div className="flex items-center gap-2 text-amber-600 mb-2">
                    <Building2 size={16} />
                    <span className="text-sm">Oslo verdiskaping</span>
                  </div>
                  <p
                    className="text-2xl font-bold text-amber-600"
                    style={{ fontFamily: "var(--font-outfit)" }}
                  >
                    {osloValue.toLocaleString("nb-NO")}
                  </p>
                  <p className="text-xs text-slate-400">MNOK</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 }}
                  className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm"
                >
                  <div className="flex items-center gap-2 text-slate-500 mb-2">
                    <TrendingUp size={16} />
                    <span className="text-sm">Andel av total</span>
                  </div>
                  <p
                    className="text-2xl font-bold text-slate-700"
                    style={{ fontFamily: "var(--font-outfit)" }}
                  >
                    {totalValue > 0 ? ((osloValue / totalValue) * 100).toFixed(1) : 0}%
                  </p>
                  <p className="text-xs text-slate-400">av samlet verdiskaping</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm"
                >
                  <div className="flex items-center gap-2 text-slate-500 mb-2">
                    <MapPin size={16} />
                    <span className="text-sm">Hovedstadsregionen</span>
                  </div>
                  <p
                    className="text-lg font-bold text-slate-700"
                    style={{ fontFamily: "var(--font-outfit)" }}
                  >
                    Over 1 million
                  </p>
                  <p className="text-xs text-slate-400">innbyggere forsynt</p>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hovedinnhold - 2 kolonner */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Venstre: Kart (3/5) */}
          <div className="lg:col-span-3">
            <Card className="h-full">
              <CardContent className="p-6">
                <RegionMap
                  regionData={regionData}
                  selectedRegionId={selectedRegion?.id || null}
                  onRegionSelect={handleRegionSelect}
                  showValues={true}
                />

                {/* Valgt region info under kartet */}
                <AnimatePresence>
                  {selectedRegion && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 overflow-hidden"
                    >
                      <div className="flex items-center justify-between p-4 bg-petrol-50 rounded-xl border border-petrol-200">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full bg-petrol-500" />
                          <div>
                            <p className="font-semibold text-slate-800">
                              {selectedRegion.navn}
                            </p>
                            <p className="text-sm text-slate-500">
                              {selectedRegion.id === "oslo"
                                ? "Hovedstadsregionen"
                                : "Innlandet fylke"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p
                              className="text-xl font-bold text-petrol-600"
                              style={{ fontFamily: "var(--font-outfit)" }}
                            >
                              {(regionData[selectedRegion.id] || 0).toLocaleString("nb-NO")} MNOK
                            </p>
                            <p className="text-xs text-slate-500">
                              {((regionData[selectedRegion.id] || 0) / totalValue * 100).toFixed(1)}% av total
                            </p>
                          </div>
                          <button
                            onClick={() => setSelectedRegion(null)}
                            className="p-2 rounded-lg hover:bg-petrol-100 transition-colors"
                          >
                            <X size={16} className="text-petrol-600" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </div>

          {/* Høyre: Velferdskalkulator (2/5) */}
          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <div className="w-8 h-8 rounded-lg bg-sage-100 flex items-center justify-center">
                    <BarChart3 size={16} className="text-sage-600" />
                  </div>
                  I andre ord...
                </CardTitle>
              </CardHeader>
              <CardContent>
                <WelfareSummary
                  valueMNOK={displayValue}
                  regionName={displayName}
                />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Info-footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 p-4 bg-white rounded-xl border border-slate-200 flex items-start gap-3"
        >
          <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
            <MapPin size={16} className="text-amber-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-700 mb-1">
              Om verdikartet
            </p>
            <p className="text-xs text-slate-500 leading-relaxed">
              Klikk på en region i kartet for å se hva verdiskapingen tilsvarer i velferdstermer.
              Bruk "Rediger verdier" for å justere regionale tall. Beregningene inkluderer
              direkte, indirekte og forbruksindusterte effekter.
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
