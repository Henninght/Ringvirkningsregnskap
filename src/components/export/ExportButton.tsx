"use client";

import { useState } from "react";
import { RippleCalculation, ScenarioComparison, Scenario, OrganizationInput } from "@/types/ripple";
import { formatRippleValue } from "@/lib/calculations";
import { Download, FileText, Table, Loader2 } from "lucide-react";

interface ExportButtonProps {
  calculation: RippleCalculation;
  comparison?: ScenarioComparison | null;
  selectedScenario?: Scenario | null;
  input: OrganizationInput;
}

export function ExportButton({
  calculation,
  comparison,
  selectedScenario,
  input,
}: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const generateCSV = () => {
    const { totals, directEffect, indirectEffect, inducedEffect } = calculation;

    const rows = [
      ["Ringvirkningsanalyse - Eksportert " + new Date().toLocaleDateString("nb-NO")],
      [""],
      ["Grunndata"],
      ["Organisasjon", input.name],
      ["Antall ansatte", input.employees.toString()],
      ["Gjennomsnittlig årslønn", input.averageSalary.toString()],
      ["Driftsresultat", input.operatingResult.toString()],
      ["Andel i Norge", (input.localShare * 100).toFixed(0) + "%"],
      [""],
      ["Resultater"],
      ["Metrikk", "Verdi"],
      ["Total verdiskaping", formatRippleValue(totals.valueCreation, "currency")],
      ["Sysselsetting", formatRippleValue(totals.employment, "employment")],
      ["Skattebidrag", formatRippleValue(totals.taxContribution, "currency")],
      ["Multiplikatoreffekt", totals.multiplierEffect.toFixed(2) + "x"],
      [""],
      ["Effektfordeling"],
      ["Direkte effekter", formatRippleValue(directEffect.total, "currency")],
      ["- Lønninger", formatRippleValue(directEffect.wages, "currency")],
      ["- Driftsresultat", formatRippleValue(directEffect.operatingResult, "currency")],
      ["Indirekte effekter", formatRippleValue(indirectEffect.total, "currency")],
      ["- Leverandørverdiskaping", formatRippleValue(indirectEffect.supplierValue, "currency")],
      ["- Sysselsetting hos leverandører", Math.round(indirectEffect.supplierEmployment) + " årsverk"],
      ["Induserte effekter", formatRippleValue(inducedEffect.total, "currency")],
      ["- Forbruksverdiskaping", formatRippleValue(inducedEffect.consumptionValue, "currency")],
      ["- Lokal økonomieffekt", formatRippleValue(inducedEffect.localEconomyEffect, "currency")],
    ];

    if (comparison && selectedScenario) {
      rows.push(
        [""],
        ["Scenario: " + selectedScenario.name],
        ["Endring i verdiskaping", formatRippleValue(comparison.difference.valueCreation, "currency")],
        ["Endring i sysselsetting", Math.round(comparison.difference.employment) + " årsverk"],
        ["Endring i skattebidrag", formatRippleValue(comparison.difference.taxContribution, "currency")],
        ["Prosentvis endring", comparison.difference.percentChange.toFixed(1) + "%"]
      );
    }

    return rows.map(row => row.join(";")).join("\n");
  };

  const generateMarkdown = () => {
    const { totals, directEffect, indirectEffect, inducedEffect } = calculation;
    const date = new Date().toLocaleDateString("nb-NO", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });

    let md = `# Ringvirkningsanalyse

**Generert:** ${date}

## Sammendrag

Denne analysen viser de samfunnsøkonomiske ringvirkningene av ${input.name}s virksomhet.

### Nøkkeltall

| Metrikk | Verdi |
|---------|-------|
| Total verdiskaping | ${formatRippleValue(totals.valueCreation, "currency")} |
| Sysselsettingseffekt | ${formatRippleValue(totals.employment, "employment")} |
| Skattebidrag | ${formatRippleValue(totals.taxContribution, "currency")} |
| Multiplikatoreffekt | ${totals.multiplierEffect.toFixed(2)}x |

## Grunndata

- **Antall ansatte:** ${input.employees.toLocaleString("nb-NO")}
- **Gjennomsnittlig årslønn:** ${input.averageSalary.toLocaleString("nb-NO")} kr
- **Driftsresultat:** ${(input.operatingResult / 1000000).toLocaleString("nb-NO")} mill NOK
- **Andel i Norge:** ${(input.localShare * 100).toFixed(0)}%

## Effektfordeling

### Direkte effekter (${formatRippleValue(directEffect.total, "currency")})
Intern verdiskaping gjennom lønn og driftsresultat.

- Lønninger: ${formatRippleValue(directEffect.wages, "currency")}
- Driftsresultat: ${formatRippleValue(directEffect.operatingResult, "currency")}

### Indirekte effekter (${formatRippleValue(indirectEffect.total, "currency")})
Verdiskaping hos leverandører og samarbeidspartnere.

- Leverandørverdiskaping: ${formatRippleValue(indirectEffect.supplierValue, "currency")}
- Sysselsetting hos leverandører: ${Math.round(indirectEffect.supplierEmployment)} årsverk

### Induserte effekter (${formatRippleValue(inducedEffect.total, "currency")})
Forbrukseffekt i lokalsamfunnet.

- Forbruksverdiskaping: ${formatRippleValue(inducedEffect.consumptionValue, "currency")}
- Lokal økonomieffekt: ${formatRippleValue(inducedEffect.localEconomyEffect, "currency")}
`;

    if (comparison && selectedScenario) {
      md += `
## Scenarioanalyse: ${selectedScenario.name}

${selectedScenario.description}

| Endring | Verdi |
|---------|-------|
| Verdiskaping | ${comparison.difference.valueCreation >= 0 ? "+" : ""}${formatRippleValue(comparison.difference.valueCreation, "currency")} |
| Sysselsetting | ${comparison.difference.employment >= 0 ? "+" : ""}${Math.round(comparison.difference.employment)} årsverk |
| Skattebidrag | ${comparison.difference.taxContribution >= 0 ? "+" : ""}${formatRippleValue(comparison.difference.taxContribution, "currency")} |
| Prosentvis endring | ${comparison.difference.percentChange >= 0 ? "+" : ""}${comparison.difference.percentChange.toFixed(1)}% |
`;
    }

    md += `
---

*Denne rapporten er generert automatisk fra Ringvirkningsregnskap-dashboardet.*
`;

    return md;
  };

  const handleExport = async (format: "csv" | "markdown") => {
    setIsExporting(true);
    setShowMenu(false);

    try {
      const content = format === "csv" ? generateCSV() : generateMarkdown();
      const blob = new Blob([content], {
        type: format === "csv" ? "text/csv;charset=utf-8" : "text/markdown;charset=utf-8"
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `ringvirkningsanalyse-${new Date().toISOString().split("T")[0]}.${format === "csv" ? "csv" : "md"}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        disabled={isExporting}
        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-mint-500 to-teal-500 text-white rounded-xl font-medium text-sm hover:from-mint-600 hover:to-teal-600 transition-all duration-300 shadow-soft disabled:opacity-50"
      >
        {isExporting ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <Download size={16} />
        )}
        <span>Eksporter</span>
      </button>

      {showMenu && (
        <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-elevated border border-slate-100 overflow-hidden z-50 min-w-[180px]">
          <button
            onClick={() => handleExport("csv")}
            className="flex items-center gap-3 w-full px-4 py-3 text-left text-sm text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <Table size={16} className="text-teal-500" />
            <div>
              <div className="font-medium">CSV/Excel</div>
              <div className="text-xs text-slate-400">Tabelformat</div>
            </div>
          </button>
          <button
            onClick={() => handleExport("markdown")}
            className="flex items-center gap-3 w-full px-4 py-3 text-left text-sm text-slate-700 hover:bg-slate-50 transition-colors border-t border-slate-100"
          >
            <FileText size={16} className="text-lavender-400" />
            <div>
              <div className="font-medium">Markdown</div>
              <div className="text-xs text-slate-400">Lesbar rapport</div>
            </div>
          </button>
        </div>
      )}
    </div>
  );
}
