/**
 * PolicyScenario - Kobler reelle fremtidsprognoser til ringvirkningssimulering
 * Brukes for å vise økonomiske konsekvenser av handling vs. ikke-handling
 */

import { Scenario } from "./ripple";
import { Kilde } from "./kilde";

/**
 * Kildereferanse med spesifikk henvisning
 */
export interface KildeRef {
  kildeId: string; // Refererer til NSF_KILDER
  spesifikk?: string; // F.eks. "Tabell 3, side 12"
  sitat?: string; // Direkte sitat fra kilden
}

/**
 * Tidsserie-datapunkt for projeksjoner
 */
export interface TimeSeriesPoint {
  year: number;
  value: number;
  isProjected: boolean; // true = fremskriving, false = historisk data
  kildeRef?: KildeRef;
}

/**
 * Projeksjonsdata - tidsserie med fremskrivninger
 */
export interface ProjectionData {
  id: string;
  type: "shortage" | "cost" | "employment" | "quality";
  metric: string; // F.eks. "Antall manglende sykepleiere"
  unit: string; // F.eks. "sykepleiere", "mrd kr", "årsverk"

  // Tidsserie
  dataPoints: TimeSeriesPoint[];

  // Hovedprojeksjon
  targetYear: number;
  targetValue: number;

  // Kildekobling
  primarySource: KildeRef;
  confidence: "high" | "medium" | "low";
}

/**
 * Tiltak/intervensjon som kan påvirke projeksjonen
 */
export interface InterventionScenario {
  id: string;
  name: string;
  description: string;

  // Kobling til eksisterende Scenario-type fra ripple.ts
  scenarioChanges: Scenario["changes"];

  // Forventet påvirkning på projeksjonen
  expectedImpact: {
    metricReduction: number; // F.eks. -15000 (halverer mangelen)
    percentReduction: number; // F.eks. -50
    economicSaving: number; // kr spart totalt
    timeToEffect: string; // F.eks. "5-10 år"
  };

  // Hvilke tiltak kreves
  policyActions: PolicyAction[];

  // Kilder for forventninger
  sources: KildeRef[];
}

/**
 * Politisk handling som må til for å realisere tiltaket
 */
export interface PolicyAction {
  action: string; // F.eks. "650 000 kr grunnlønn for spesialsykepleiere"
  responsible:
    | "Regjeringen"
    | "Stortinget"
    | "Tariffpartene"
    | "Kommunene"
    | "Helseforetak"
    | "Utdanningsinstitusjoner";
  estimatedCost?: number; // Forventet kostnad i kr
  kildeRef?: KildeRef;
}

/**
 * Narrativ-mal for generering av tekst
 */
export interface NarrativeTemplate {
  format: "headline" | "elevator_pitch" | "fact_sheet" | "social_media";
  template: string; // Med {{placeholders}} for verdier
}

/**
 * Kategori for policy-scenarioer
 */
export type PolicyCategory =
  | "workforce_shortage" // Sykepleiermangel
  | "agency_costs" // Vikarkostnader
  | "turnover" // Frafall/turnover
  | "mobilization" // Mobilisering av sykepleiere
  | "preparedness"; // Beredskap

/**
 * Hovedinterface: PolicyScenario
 * Kobler projeksjoner, tiltak og kilder sammen
 */
export interface PolicyScenario {
  id: string;
  slug: string; // URL-vennlig: "sykepleiermangel-2040"

  // Narrativ framing
  title: string; // "Hva koster sykepleiermangelen?"
  subtitle: string; // "30 000 manglende sykepleiere i 2040"
  hook: string; // Fengslende åpning for lobbyarbeid

  // Data
  projection: ProjectionData;
  baselineDescription: string; // Beskrivelse av status quo

  // Tiltak som kan sammenlignes
  interventions: InterventionScenario[];

  // Kildekobling (kritisk!)
  sources: {
    primary: KildeRef;
    supporting: KildeRef[];
  };

  // Narrativ-maler
  narrativeTemplates: NarrativeTemplate[];

  // Metadata
  category: PolicyCategory;
  priority: "critical" | "important" | "supporting";

  // Når ble scenariet sist oppdatert
  lastUpdated: string; // ISO dato
}

/**
 * Beregnet årlig effekt
 */
export interface YearlyImpact {
  year: number;
  shortage: number;
  economicCost: number;
  vikarCost: number;
  lostProductivity: number;
  isProjected: boolean;
}

/**
 * Sammenligning mellom baseline og intervensjon over tid
 */
export interface MultiYearComparison {
  baseline: YearlyImpact[];
  withIntervention: YearlyImpact[];
  totalSaved: number;
  percentReduction: number;
  yearsAnalyzed: number;
}

/**
 * Resultat av policy-scenarioberegning
 */
export interface PolicyScenarioResult {
  scenario: PolicyScenario;
  selectedIntervention: InterventionScenario | null;
  comparison: MultiYearComparison;
  generatedNarratives: {
    format: NarrativeTemplate["format"];
    text: string;
  }[];
  sourcesUsed: Kilde[];
}
