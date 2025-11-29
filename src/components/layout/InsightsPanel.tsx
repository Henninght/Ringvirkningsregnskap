"use client";

import { Insight } from "@/types";
import { insightsData } from "@/data/mockData";
import { Sparkles, ChevronRight, Lightbulb, TrendingUp } from "lucide-react";

export function InsightsPanel() {
  return (
    <aside className="w-[320px] min-h-screen bg-white border-l border-slate-150 flex flex-col">
      {/* Header */}
      <div className="p-5 border-b border-slate-100">
        <div className="flex items-center gap-2.5 mb-1.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
            <Sparkles size={16} className="text-indigo-600" />
          </div>
          <h2
            className="text-base font-semibold text-slate-800"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            Analyse og innsikt
          </h2>
        </div>
        <p className="text-xs text-slate-500 ml-10">
          AI-generert analyse basert pa dine data
        </p>
      </div>

      {/* Insights */}
      <div className="flex-1 p-4 space-y-3 overflow-y-auto">
        {insightsData.map((insight, index) => (
          <InsightCard
            key={insight.id}
            insight={insight}
            index={index}
            delay={index * 0.08}
          />
        ))}
      </div>

      {/* CTA Button */}
      <div className="p-4 border-t border-slate-100">
        <button className="w-full py-2.5 px-4 bg-gradient-to-r from-petrol-600 to-petrol-500 text-white rounded-lg font-medium text-sm hover:from-petrol-500 hover:to-petrol-400 transition-all duration-200 flex items-center justify-center gap-2 group shadow-soft">
          <span>Mer analyse</span>
          <ChevronRight
            size={15}
            className="transition-transform group-hover:translate-x-0.5"
          />
        </button>
      </div>
    </aside>
  );
}

interface InsightCardProps {
  insight: Insight;
  index: number;
  delay?: number;
}

const insightIcons = [
  <Lightbulb key="lightbulb" size={14} />,
  <TrendingUp key="trending" size={14} />,
];

function InsightCard({ insight, index, delay = 0 }: InsightCardProps) {
  const iconColors = [
    "bg-sand-100 text-sand-600",
    "bg-sage-100 text-sage-600",
  ];

  return (
    <div
      className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 animate-fade-in hover:border-slate-200 transition-colors cursor-pointer group"
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="flex items-start gap-3">
        <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${iconColors[index % 2]}`}>
          {insightIcons[index % 2]}
        </div>
        <div className="flex-1 min-w-0">
          <h3
            className="font-medium text-slate-800 text-sm mb-1 group-hover:text-petrol-700 transition-colors"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            {insight.title}
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
            {insight.content}
          </p>
        </div>
      </div>
    </div>
  );
}
