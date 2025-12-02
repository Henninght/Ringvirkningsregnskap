"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { Sidebar } from "@/components/layout/Sidebar";
import { NsfPolitikkTab, NSF_TABS } from "@/types/nsf";
import { cn } from "@/lib/utils";
import {
  ViewModeProvider,
  useViewMode,
} from "@/contexts/ViewModeContext";
import {
  Scale,
  ArrowLeft,
  Calculator,
  Users,
  GitBranch,
  UserPlus,
  FileText,
  TrendingUp,
  UserMinus,
  SlidersHorizontal,
  Sparkles,
  Telescope,
} from "lucide-react";
import { RingvirkningerTab } from "@/components/nsf-politikk/ringvirkninger/RingvirkningerTab";
import { FremtidsscenarioTab } from "@/components/nsf-politikk/fremtidsscenario/FremtidsscenarioTab";
import { GettingStartedGuide } from "@/components/simulator/GettingStartedGuide";
import { VikarkalkulatorTab } from "@/components/nsf-politikk/vikarkalkulator/VikarkalkulatorTab";
import { BemanningseffektTab } from "@/components/nsf-politikk/bemanningseffekt/BemanningseffektTab";
import { OppgavedelingTab } from "@/components/nsf-politikk/oppgavedeling/OppgavedelingTab";
import { MobiliseringTab } from "@/components/nsf-politikk/mobilisering/MobiliseringTab";
import { FrafallTab } from "@/components/nsf-politikk/frafall/FrafallTab";
import { ArgumenterTab } from "@/components/nsf-politikk/argumenter/ArgumenterTab";

// Loading komponent
function TabLoading() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-petrol-500"></div>
    </div>
  );
}

const TAB_ICONS: Record<NsfPolitikkTab, typeof Calculator> = {
  ringvirkninger: TrendingUp,
  fremtidsscenario: Telescope,
  vikarkalkulator: Calculator,
  bemanningseffekt: Users,
  oppgavedeling: GitBranch,
  mobilisering: UserPlus,
  frafall: UserMinus,
  argumenter: FileText,
};

// ViewMode toggle component
function ViewModeToggle() {
  const { mode, setMode } = useViewMode();

  return (
    <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
      <button
        onClick={() => setMode("simple")}
        className={cn(
          "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all",
          mode === "simple"
            ? "bg-white text-petrol-600 shadow-sm"
            : "text-slate-500 hover:text-slate-700"
        )}
      >
        <Sparkles size={14} />
        Enkel
      </button>
      <button
        onClick={() => setMode("advanced")}
        className={cn(
          "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all",
          mode === "advanced"
            ? "bg-white text-petrol-600 shadow-sm"
            : "text-slate-500 hover:text-slate-700"
        )}
      >
        <SlidersHorizontal size={14} />
        Avansert
      </button>
    </div>
  );
}

function NsfPolitikkContent() {
  const [activeTab, setActiveTab] = useState<NsfPolitikkTab>("ringvirkninger");

  const renderTabContent = () => {
    switch (activeTab) {
      case "ringvirkninger":
        return <RingvirkningerTab />;
      case "fremtidsscenario":
        return <FremtidsscenarioTab />;
      case "vikarkalkulator":
        return <VikarkalkulatorTab />;
      case "bemanningseffekt":
        return <BemanningseffektTab />;
      case "oppgavedeling":
        return <OppgavedelingTab />;
      case "mobilisering":
        return <MobiliseringTab />;
      case "frafall":
        return <FrafallTab />;
      case "argumenter":
        return <ArgumenterTab />;
      default:
        return <RingvirkningerTab />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar tenantId="nsf" />

      <main className="ml-[72px] min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-200">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link
                  href="/kunde/nsf"
                  className="flex items-center gap-2 text-slate-500 hover:text-slate-700 transition-colors"
                >
                  <ArrowLeft size={18} />
                  <span className="text-sm">Dashboard</span>
                </Link>
                <div className="h-6 w-px bg-slate-200" />
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-petrol-400 to-petrol-600 flex items-center justify-center">
                    <Scale size={20} className="text-white" />
                  </div>
                  <div>
                    <h1
                      className="text-xl font-semibold text-slate-800"
                      style={{ fontFamily: "var(--font-outfit)" }}
                    >
                      NSF Politikkverktøy
                    </h1>
                    <p className="text-sm text-slate-500">
                      Bygg argumenter med kildehenvisninger
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <GettingStartedGuide />
                <ViewModeToggle />
              </div>
            </div>
          </div>

          {/* Tab navigation */}
          <div className="px-6 pb-0">
            <nav className="flex gap-1 overflow-x-auto" aria-label="Faner">
              {NSF_TABS.map((tab) => {
                const Icon = TAB_ICONS[tab.id];
                const isActive = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-t-lg transition-all whitespace-nowrap",
                      isActive
                        ? "bg-slate-50 text-petrol-600 border-t-2 border-x border-petrol-500 border-slate-200 -mb-px"
                        : "text-slate-500 hover:text-slate-700 hover:bg-slate-100"
                    )}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <Icon size={16} />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </header>

        {/* Tab content */}
        <div className="p-6">
          <Suspense fallback={<TabLoading />}>
            {renderTabContent()}
          </Suspense>
        </div>
      </main>
    </div>
  );
}

export default function NsfPolitikkPage() {
  return (
    <ViewModeProvider>
      <NsfPolitikkContent />
    </ViewModeProvider>
  );
}
