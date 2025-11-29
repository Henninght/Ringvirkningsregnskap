"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { MunicipalityMap } from "@/components/map/MunicipalityMap";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Municipality } from "@/types/ripple";
import {
  municipalityData,
  getCounties,
  getTotalNurses,
  getAverageCoverage,
} from "@/data/municipalities";
import { ArrowLeft, Map, TrendingUp, Users, Activity, Building2 } from "lucide-react";
import Link from "next/link";

export default function MapPage() {
  const [selectedMunicipality, setSelectedMunicipality] = useState<Municipality | null>(null);

  // Statistikk
  const totalNurses = getTotalNurses();
  const avgCoverage = getAverageCoverage();
  const counties = getCounties();
  const totalMunicipalities = municipalityData.length;

  // Top 5 kommuner etter antall sykepleiere
  const topMunicipalities = [...municipalityData]
    .sort((a, b) => (b.nurses || 0) - (a.nurses || 0))
    .slice(0, 5);

  // Kommuner med lavest dekningsgrad
  const lowCoverage = [...municipalityData]
    .filter((m) => m.coverageRatio)
    .sort((a, b) => (a.coverageRatio || 0) - (b.coverageRatio || 0))
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />

      <main className="ml-[72px] min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-sm border-b border-slate-200">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link
                  href="/"
                  className="flex items-center gap-2 text-slate-500 hover:text-slate-700 transition-colors"
                >
                  <ArrowLeft size={18} />
                  <span className="text-sm">Dashboard</span>
                </Link>
                <div className="h-6 w-px bg-slate-200" />
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 to-mint-500 flex items-center justify-center">
                    <Map size={20} className="text-white" />
                  </div>
                  <div>
                    <h1
                      className="text-xl font-semibold text-slate-800"
                      style={{ fontFamily: "var(--font-outfit)" }}
                    >
                      Kommunekart
                    </h1>
                    <p className="text-sm text-slate-500">
                      Geografisk oversikt over sykepleierdekning
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick stats */}
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <div className="text-xs text-slate-400 uppercase tracking-wider">Kommuner</div>
                  <div className="text-lg font-bold text-slate-700" style={{ fontFamily: "var(--font-outfit)" }}>
                    {totalMunicipalities}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-400 uppercase tracking-wider">Sykepleiere</div>
                  <div className="text-lg font-bold text-mint-600" style={{ fontFamily: "var(--font-outfit)" }}>
                    {totalNurses.toLocaleString("nb-NO")}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-400 uppercase tracking-wider">Snitt dekning</div>
                  <div className="text-lg font-bold text-teal-600" style={{ fontFamily: "var(--font-outfit)" }}>
                    {avgCoverage.toFixed(1)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-12 gap-6">
            {/* Map - takes most space */}
            <div className="col-span-8">
              <MunicipalityMap onMunicipalityClick={setSelectedMunicipality} />
            </div>

            {/* Sidebar with stats */}
            <div className="col-span-4 space-y-4">
              {/* Top kommuner */}
              <Card className="animate-slide-up">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <TrendingUp size={16} className="text-mint-500" />
                    Flest sykepleiere
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {topMunicipalities.map((m, index) => (
                      <div
                        key={m.id}
                        className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-full bg-mint-100 text-mint-600 text-xs font-semibold flex items-center justify-center">
                            {index + 1}
                          </span>
                          <div>
                            <div className="font-medium text-slate-800 text-sm">{m.name}</div>
                            <div className="text-xs text-slate-400">{m.county}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-mint-600">
                            {m.nurses?.toLocaleString("nb-NO")}
                          </div>
                          <div className="text-xs text-slate-400">sykepleiere</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Lavest dekningsgrad */}
              <Card className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Activity size={16} className="text-coral-500" />
                    Lavest dekningsgrad
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {lowCoverage.map((m, index) => (
                      <div
                        key={m.id}
                        className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-full bg-coral-100 text-coral-500 text-xs font-semibold flex items-center justify-center">
                            {index + 1}
                          </span>
                          <div>
                            <div className="font-medium text-slate-800 text-sm">{m.name}</div>
                            <div className="text-xs text-slate-400">{m.county}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-coral-500">
                            {m.coverageRatio?.toFixed(1)}
                          </div>
                          <div className="text-xs text-slate-400">per 1000</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Fylkesoversikt */}
              <Card className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Building2 size={16} className="text-lavender-400" />
                    Fylkesoversikt
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {counties.map((county) => {
                      const countyMunicipalities = municipalityData.filter(
                        (m) => m.county === county
                      );
                      const countyNurses = countyMunicipalities.reduce(
                        (sum, m) => sum + (m.nurses || 0),
                        0
                      );
                      const countyAvgCoverage =
                        countyMunicipalities.reduce(
                          (sum, m) => sum + (m.coverageRatio || 0),
                          0
                        ) / countyMunicipalities.length;

                      return (
                        <div
                          key={county}
                          className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-slate-50 transition-colors"
                        >
                          <div>
                            <div className="font-medium text-slate-700 text-sm">{county}</div>
                            <div className="text-xs text-slate-400">
                              {countyMunicipalities.length} kommuner
                            </div>
                          </div>
                          <div className="text-right text-sm">
                            <span className="font-semibold text-mint-600">
                              {countyNurses.toLocaleString("nb-NO")}
                            </span>
                            <span className="text-slate-400 ml-2">
                              ({countyAvgCoverage.toFixed(1)})
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
