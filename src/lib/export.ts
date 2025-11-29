import { RippleCalculation, OrganizationInput, RippleConfig, Scenario } from "@/types/ripple";
import { formatRippleValue } from "./calculations";

interface ExportData {
  timestamp: string;
  input: OrganizationInput;
  config: RippleConfig;
  scenario: Scenario | null;
  results: RippleCalculation;
}

/**
 * Export calculation results as JSON file
 */
export function exportAsJSON(data: ExportData, filename?: string): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  downloadBlob(blob, filename || `ringvirkninger-${formatDateForFilename()}.json`);
}

/**
 * Export calculation results as CSV file
 */
export function exportAsCSV(data: ExportData, filename?: string): void {
  const { input, results, scenario } = data;

  const rows = [
    ["Ringvirkningsberegning", formatDateForFilename()],
    [],
    ["Grunndata"],
    ["Organisasjon", input.name],
    ["Antall ansatte", input.employees.toString()],
    ["Gjennomsnittlig årslønn", input.averageSalary.toString()],
    ["Driftsresultat", input.operatingResult.toString()],
    ["Andel i Norge", `${(input.localShare * 100).toFixed(0)}%`],
    [],
    ["Scenario", scenario?.name || "Ingen"],
    [],
    ["Direkte effekter"],
    ["Lønnskostnader", formatRippleValue(results.directEffect.wages, "currency")],
    ["Driftsresultat", formatRippleValue(results.directEffect.operatingResult, "currency")],
    ["Total direkte", formatRippleValue(results.directEffect.total, "currency")],
    [],
    ["Indirekte effekter"],
    ["Leverandørverdiskaping", formatRippleValue(results.indirectEffect.supplierValue, "currency")],
    ["Sysselsetting hos leverandører", `${Math.round(results.indirectEffect.supplierEmployment)} årsverk`],
    ["Total indirekte", formatRippleValue(results.indirectEffect.total, "currency")],
    [],
    ["Induserte effekter"],
    ["Forbruksverdiskaping", formatRippleValue(results.inducedEffect.consumptionValue, "currency")],
    ["Lokal økonomieffekt", formatRippleValue(results.inducedEffect.localEconomyEffect, "currency")],
    ["Total induserte", formatRippleValue(results.inducedEffect.total, "currency")],
    [],
    ["Totaler"],
    ["Total verdiskaping", formatRippleValue(results.totals.valueCreation, "currency")],
    ["Total sysselsetting", formatRippleValue(results.totals.employment, "employment")],
    ["Totalt skattebidrag", formatRippleValue(results.totals.taxContribution, "currency")],
    ["Multiplikatoreffekt", `${results.totals.multiplierEffect.toFixed(2)}x`],
  ];

  const csvContent = rows.map(row => row.join(";")).join("\n");
  const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8" }); // BOM for Excel
  downloadBlob(blob, filename || `ringvirkninger-${formatDateForFilename()}.csv`);
}

/**
 * Export summary as formatted text for copying
 */
export function generateSummaryText(data: ExportData): string {
  const { input, results, scenario } = data;

  const lines = [
    "RINGVIRKNINGSBEREGNING",
    "=" .repeat(40),
    "",
    `Organisasjon: ${input.name}`,
    `Dato: ${new Date().toLocaleDateString("nb-NO")}`,
    scenario ? `Scenario: ${scenario.name}` : "",
    "",
    "GRUNNDATA",
    "-".repeat(20),
    `Antall ansatte: ${input.employees.toLocaleString("nb-NO")}`,
    `Gjennomsnittlig årslønn: ${formatRippleValue(input.averageSalary, "currency")}`,
    `Driftsresultat: ${formatRippleValue(input.operatingResult, "currency")}`,
    "",
    "RESULTATER",
    "-".repeat(20),
    `Total verdiskaping: ${formatRippleValue(results.totals.valueCreation, "currency")}`,
    `  - Direkte: ${formatRippleValue(results.directEffect.total, "currency")}`,
    `  - Indirekte: ${formatRippleValue(results.indirectEffect.total, "currency")}`,
    `  - Induserte: ${formatRippleValue(results.inducedEffect.total, "currency")}`,
    "",
    `Total sysselsetting: ${formatRippleValue(results.totals.employment, "employment")}`,
    `Totalt skattebidrag: ${formatRippleValue(results.totals.taxContribution, "currency")}`,
    `Multiplikatoreffekt: ${results.totals.multiplierEffect.toFixed(2)}x`,
    "",
    "=" .repeat(40),
  ].filter(Boolean);

  return lines.join("\n");
}

/**
 * Copy summary text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for older browsers
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-9999px";
    document.body.appendChild(textArea);
    textArea.select();
    const success = document.execCommand("copy");
    document.body.removeChild(textArea);
    return success;
  }
}

/**
 * Helper to download a blob as a file
 */
function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Format current date for filename
 */
function formatDateForFilename(): string {
  return new Date().toISOString().split("T")[0];
}

/**
 * Print-friendly export using DOM manipulation
 */
export function printResults(data: ExportData): void {
  const summaryText = generateSummaryText(data);

  const printWindow = window.open("", "_blank");
  if (!printWindow) return;

  // Create the document structure using DOM methods
  const doc = printWindow.document;

  // Create and append style element
  const style = doc.createElement("style");
  style.textContent = `
    body {
      font-family: 'Inter', system-ui, sans-serif;
      line-height: 1.6;
      max-width: 800px;
      margin: 40px auto;
      padding: 0 20px;
      color: #1e293b;
    }
    pre {
      white-space: pre-wrap;
      font-family: monospace;
    }
    @media print {
      body { margin: 20px; }
    }
  `;
  doc.head.appendChild(style);

  // Create and append title
  const title = doc.createElement("title");
  title.textContent = `Ringvirkningsberegning - ${new Date().toLocaleDateString("nb-NO")}`;
  doc.head.appendChild(title);

  // Create and append pre element with content
  const pre = doc.createElement("pre");
  pre.textContent = summaryText;
  doc.body.appendChild(pre);

  printWindow.focus();
  setTimeout(() => {
    printWindow.print();
  }, 250);
}
