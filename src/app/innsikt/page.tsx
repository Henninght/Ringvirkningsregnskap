"use client";

import { useState, useMemo } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { PreparednessCard } from "@/components/dashboard/PreparednessCard";
import { ComparisonWidget } from "@/components/dashboard/ComparisonWidget";
import { StoryGenerator } from "@/components/storytelling/StoryGenerator";
import { ImpactSummary } from "@/components/dashboard/ImpactSummary";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import {
  calculateTotalRipple,
  calculateNsfMetrics,
} from "@/lib/calculations";
import {
  DEFAULT_RIPPLE_CONFIG,
  OrganizationInput,
} from "@/types/ripple";
import {
  Lightbulb,
  ArrowLeft,
  TrendingUp,
  Shield,
  Users,
  Target,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";

// Standard NSF organisasjonsdata for analyse
const NSF_INPUT: OrganizationInput = {
  name: "Norsk Sykepleierforbund",
  employees: 4500,
  averageSalary: 620000,
  operatingResult: 120000000,
  localShare: 0.98,
  agencyShare: 0.15,
  fullTimeEquivalent: 0.75,
  turnoverRate: 0.12,
};

// Anbefalinger basert pa data
interface Recommendation {
  id: string;
  priority: "hoy" | "medium" | "lav";
  category: "beredskap" | "okonomi" | "ansatte";
  title: string;
  description: string;
  impact: string;
  action: string;
}

const RECOMMENDATIONS: Recommendation[] = [
  {
    id: "1",
    priority: "hoy",
    category: "beredskap",
    title: "Styrk dekningsgrad i Nord-Norge",
    description: "Flere kommuner i Nord-Norge har dekningsgrad under 13 per 1000, noe som utgjor en beredskapsrisiko.",
    impact: "Okt beredskap ved krisesituasjoner, bedre pasientutfall",
    action: "Iverksett rekrutteringskampanje rettet mot helsearbeidere i sor",
  },
  {
    id: "2",
    priority: "hoy",
    category: "okonomi",
    title: "Reduser vikarbruk med 20%",
    description: "Vikarpremien pa 45% representerer betydelige merkostnader som kunne gatt til fast bemanning.",
    impact: "Estimert besparelse: 80-120 mill NOK arlig",
    action: "Forbedre arbeidsvilkar og karrieremuligheter for a beholde fast ansatte",
  },
  {
    id: "3",
    priority: "medium",
    category: "ansatte",
    title: "Fokuser pa turnover i mellomstore kommuner",
    description: "Kommuner med 30-80 000 innbyggere har hoyest turnover blant sykepleiere.",
    impact: "Lavere opplaringskostnader, bedre kontinuitet i omsorg",
    action: "Tilby mentorordninger og fleksible arbeidsordninger",
  },
  {
    id: "4",
    priority: "lav",
    category: "okonomi",
    title: "Optimalisere leverandorkjede",
    description: "Indirekte ringvirkninger kan okes ved a prioritere lokale leverandorer.",
    impact: "10-15% okning i lokal verdiskaping",
    action: "Kartlegg og prioriter leverandorer med norsk produksjon",
  },
];

export default function InsightsPage() {
  const [activeCategory, setActiveCategory] = useState<"alle" | "beredskap" | "okonomi" | "ansatte">("alle");

  // Beregn ringvirkninger for NSF
  const calculation = useMemo(() => {
    return calculateTotalRipple(NSF_INPUT, DEFAULT_RIPPLE_CONFIG);
  }, []);

  // Beregn NSF-metrikker (mock-verdier for demonstrasjon)
  const nsfMetrics = useMemo(() => {
    return calculateNsfMetrics(35000, 2800000, 180000000, 125000000);
  }, []);

  const filteredRecommendations = activeCategory === "alle"
    ? RECOMMENDATIONS
    : RECOMMENDATIONS.filter(r => r.category === activeCategory);

  const priorityColors = {
    hoy: { bg: "bg-red-50", border: "border-red-200", text: "text-red-700", badge: "bg-red-100 text-red-700" },
    medium: { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700", badge: "bg-amber-100 text-amber-700" },
    lav: { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-700", badge: "bg-blue-100 text-blue-700" },
  };

  const categoryIcons = {
    beredskap: Shield,
    okonomi: TrendingUp,
    ansatte: Users,
  };

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
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-lavender-400 to-lavender-500 flex items-center justify-center">
                    <Lightbulb size={20} className="text-white" />
                  </div>
                  <div>
                    <h1
                      className="text-xl font-semibold text-slate-800"
                      style={{ fontFamily: "var(--font-outfit)" }}
                    >
                      Innsikt og analyse
                    </h1>
                    <p className="text-sm text-slate-500">
                      Handlingsrettede anbefalinger og storytelling
                    </p>
                  </div>
                </div>
              </div>

              {/* Key metrics */}
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <div className="text-xs text-slate-400 uppercase tracking-wider">Dekningsgrad</div>
                  <div className="text-lg font-bold text-mint-600" style={{ fontFamily: "var(--font-outfit)" }}>
                    {nsfMetrics.nursesPerThousand} per 1000
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-400 uppercase tracking-wider">Vikarpremie</div>
                  <div className="text-lg font-bold text-coral-500" style={{ fontFamily: "var(--font-outfit)" }}>
                    +{nsfMetrics.agencyPremiumPercent}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-12 gap-6">
            {/* Left column - Metrics and Comparison */}
            <div className="col-span-4 space-y-6">
              <PreparednessCard />
              <ComparisonWidget />
            </div>

            {/* Middle column - Recommendations */}
            <div className="col-span-4 space-y-6">
              <Card className="animate-slide-up">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Target size={18} className="text-teal-500" />
                      Anbefalinger
                    </CardTitle>
                    <div className="flex gap-1">
                      {(["alle", "beredskap", "okonomi", "ansatte"] as const).map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setActiveCategory(cat)}
                          className={`px-2.5 py-1 text-xs rounded-full transition-colors ${
                            activeCategory === cat
                              ? "bg-teal-500 text-white"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          }`}
                        >
                          {cat === "alle" ? "Alle" : cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {filteredRecommendations.map((rec, index) => {
                      const colors = priorityColors[rec.priority];
                      const CategoryIcon = categoryIcons[rec.category];

                      return (
                        <div
                          key={rec.id}
                          className={`p-4 rounded-xl border ${colors.bg} ${colors.border} animate-fade-in`}
                          style={{ animationDelay: `${index * 0.05}s` }}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <CategoryIcon size={14} className={colors.text} />
                              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${colors.badge}`}>
                                {rec.priority === "hoy" ? "Hoy" : rec.priority === "medium" ? "Medium" : "Lav"} prioritet
                              </span>
                            </div>
                          </div>
                          <h4 className="font-medium text-slate-800 text-sm mb-1">{rec.title}</h4>
                          <p className="text-xs text-slate-600 mb-3">{rec.description}</p>
                          <div className="space-y-1.5">
                            <div className="flex items-start gap-2">
                              <TrendingUp size={12} className="text-mint-500 mt-0.5 flex-shrink-0" />
                              <span className="text-xs text-slate-600">
                                <strong>Effekt:</strong> {rec.impact}
                              </span>
                            </div>
                            <div className="flex items-start gap-2">
                              <AlertCircle size={12} className="text-lavender-400 mt-0.5 flex-shrink-0" />
                              <span className="text-xs text-slate-600">
                                <strong>Tiltak:</strong> {rec.action}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right column - Storytelling and Impact */}
            <div className="col-span-4 space-y-6">
              <StoryGenerator
                calculation={calculation}
                organizationName="Norsk Sykepleierforbund"
              />

              <ImpactSummary calculation={calculation} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
