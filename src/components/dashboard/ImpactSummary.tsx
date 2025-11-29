"use client";

import { useMemo } from "react";
import { RippleCalculation } from "@/types/ripple";
import { formatRippleValue } from "@/lib/calculations";
import {
  Briefcase,
  GraduationCap,
  Home,
  ShoppingBag,
  Stethoscope,
  Building,
  Coins,
  Users
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ImpactItem {
  icon: typeof Briefcase;
  label: string;
  value: string;
  subtext: string;
  color: string;
}

interface ImpactSummaryProps {
  calculation: RippleCalculation;
  className?: string;
}

/**
 * Visual "Impact Summary" that translates dry numbers into
 * relatable societal impacts - key for the "preparedness" narrative.
 */
export function ImpactSummary({ calculation, className }: ImpactSummaryProps) {
  const { totals, directEffect, indirectEffect, inducedEffect } = calculation;

  // Translate calculations to human-scale impacts
  const impacts: ImpactItem[] = useMemo(() => {
    // Estimate based on average household income of ~600k
    const householdsSupported = Math.round(directEffect.wages / 600000);

    // Estimate based on average teacher salary of ~550k
    const teacherEquivalent = Math.round(totals.taxContribution / 550000 * 0.3);

    // Estimate local business impact
    const localShopsSupported = Math.round(inducedEffect.localEconomyEffect / 2000000);

    // Healthcare services funded by taxes
    const nurseEquivalent = Math.round(totals.taxContribution / 650000 * 0.4);

    return [
      {
        icon: Home,
        label: "Familier stottet",
        value: householdsSupported.toLocaleString("nb-NO"),
        subtext: "husholdninger med inntekt",
        color: "text-mint-600 bg-mint-100",
      },
      {
        icon: Users,
        label: "Arbeidsplasser",
        value: Math.round(totals.employment).toLocaleString("nb-NO"),
        subtext: "årsverk totalt i økonomien",
        color: "text-teal-600 bg-teal-100",
      },
      {
        icon: Stethoscope,
        label: "Helsepersonell",
        value: nurseEquivalent.toLocaleString("nb-NO"),
        subtext: "sykepleierårsverk finansiert",
        color: "text-coral-500 bg-coral-100",
      },
      {
        icon: GraduationCap,
        label: "Utdanning",
        value: teacherEquivalent.toLocaleString("nb-NO"),
        subtext: "lærerstillinger finansiert",
        color: "text-lavender-500 bg-lavender-100",
      },
      {
        icon: ShoppingBag,
        label: "Lokale bedrifter",
        value: localShopsSupported.toLocaleString("nb-NO"),
        subtext: "lokale virksomheter stottet",
        color: "text-amber-600 bg-amber-100",
      },
      {
        icon: Coins,
        label: "Skattebidrag",
        value: formatRippleValue(totals.taxContribution, "currency"),
        subtext: "til fellesskapet",
        color: "text-blue-600 bg-blue-100",
      },
    ];
  }, [calculation]);

  return (
    <div className={cn("p-6 bg-gradient-to-br from-slate-50 to-white rounded-2xl border border-slate-100", className)}>
      <div className="flex items-center gap-2 mb-4">
        <Building size={18} className="text-mint-500" />
        <h3
          className="text-lg font-semibold text-slate-800"
          style={{ fontFamily: "var(--font-outfit)" }}
        >
          Samfunnsvirkning
        </h3>
      </div>

      <p className="text-sm text-slate-500 mb-6">
        Sa mye bidrar organisasjonen til det norske samfunnet
      </p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {impacts.map((impact, index) => {
          const Icon = impact.icon;
          return (
            <div
              key={impact.label}
              className="group p-4 bg-white rounded-xl border border-slate-100 hover:border-slate-200 hover:shadow-soft transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center mb-3",
                impact.color
              )}>
                <Icon size={20} />
              </div>
              <div
                className="text-2xl font-bold text-slate-800 mb-1"
                style={{ fontFamily: "var(--font-outfit)" }}
              >
                {impact.value}
              </div>
              <div className="text-sm font-medium text-slate-700">{impact.label}</div>
              <div className="text-xs text-slate-400 mt-0.5">{impact.subtext}</div>
            </div>
          );
        })}
      </div>

      {/* Narrative summary */}
      <div className="mt-6 p-4 bg-mint-50/50 rounded-xl border border-mint-100">
        <p className="text-sm text-slate-700 leading-relaxed">
          <strong className="text-mint-700">Oppsummert:</strong> For hver krone i direkte
          verdiskaping, genererer organisasjonen totalt{" "}
          <span className="font-semibold text-mint-700">
            {totals.multiplierEffect.toFixed(2)} kroner
          </span>{" "}
          i ringvirkninger. Dette tilsvarer stotte til over{" "}
          <span className="font-semibold">{Math.round(directEffect.wages / 600000)}</span>{" "}
          familier og bidrag til finansiering av viktige offentlige tjenester som helse og utdanning.
        </p>
      </div>
    </div>
  );
}
