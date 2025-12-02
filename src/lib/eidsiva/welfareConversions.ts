/**
 * Velferdsbidrag-konverteringer
 *
 * Konverterer NOK til konkrete velferdsenheter ("Med andre ord...")
 * Kilde: Rapport side 8, SSB-statistikk
 */

import { KILDER } from "./eidsivaData";
import type { KildeRef } from "@/components/ui/SourceTooltip";

// =============================================================================
// KOSTNADER PER ENHET (SSB-basert, konfigurerbare)
// =============================================================================

export interface WelfareCosts {
  sykkelVeiPerKm: number;
  barnehagePlassPerAr: number;
  sykehjemsPlassPerAr: number;
  larerArslonn: number;
  sykepleierArslonn: number;
  brannkonstabelArslonn: number;
}

/**
 * Standard kostnadsfaktorer basert på SSB-statistikk
 * Disse kan justeres via admin-panel
 */
export const DEFAULT_WELFARE_COSTS: WelfareCosts = {
  sykkelVeiPerKm: 15_000_000,       // 15 MNOK per km sykkelvei (SSB)
  barnehagePlassPerAr: 150_000,     // Ca 150k per barn per år
  sykehjemsPlassPerAr: 1_200_000,   // Ca 1.2 MNOK per plass per år
  larerArslonn: 650_000,            // Gjennomsnittlig årslønn lærer
  sykepleierArslonn: 600_000,       // Gjennomsnittlig årslønn sykepleier
  brannkonstabelArslonn: 550_000,   // Gjennomsnittlig årslønn brannkonstabel
};

// =============================================================================
// KONVERTERINGSFUNKSJONER
// =============================================================================

export interface WelfareConversion {
  id: string;
  navn: string;
  ikon: string;
  enhet: string;
  verdi: number;
  beskrivelse: string;
}

/**
 * Konverterer et NOK-beløp til velferdsenheter
 *
 * @param belop - Beløp i NOK
 * @param costs - Kostnadsfaktorer (bruker default hvis ikke oppgitt)
 * @returns Liste over konverteringer
 */
export function convertToWelfare(
  belop: number,
  costs: WelfareCosts = DEFAULT_WELFARE_COSTS
): WelfareConversion[] {
  return [
    {
      id: "sykkelvei",
      navn: "Kilometer sykkelvei",
      ikon: "Bike",
      enhet: "km",
      verdi: Math.floor(belop / costs.sykkelVeiPerKm),
      beskrivelse: "Kilometer med ny sykkelvei",
    },
    {
      id: "barnehage",
      navn: "Barnehageplasser",
      ikon: "Baby",
      enhet: "plasser",
      verdi: Math.floor(belop / costs.barnehagePlassPerAr),
      beskrivelse: "Barnehageplasser finansiert i ett år",
    },
    {
      id: "sykehjem",
      navn: "Sykehjemsplasser",
      ikon: "Heart",
      enhet: "plasser",
      verdi: Math.floor(belop / costs.sykehjemsPlassPerAr),
      beskrivelse: "Sykehjemsplasser finansiert i ett år",
    },
    {
      id: "laerer",
      navn: "Lærere",
      ikon: "GraduationCap",
      enhet: "årsverk",
      verdi: Math.floor(belop / costs.larerArslonn),
      beskrivelse: "Lærerårsverk finansiert",
    },
    {
      id: "sykepleier",
      navn: "Sykepleiere",
      ikon: "Stethoscope",
      enhet: "årsverk",
      verdi: Math.floor(belop / costs.sykepleierArslonn),
      beskrivelse: "Sykepleierårsverk finansiert",
    },
    {
      id: "brannkonstabel",
      navn: "Brannkonstabler",
      ikon: "Flame",
      enhet: "årsverk",
      verdi: Math.floor(belop / costs.brannkonstabelArslonn),
      beskrivelse: "Brannkonstabelårsverk finansiert",
    },
  ];
}

/**
 * Beregner bidrag per tidsenhet
 */
export function calculatePerTimeUnit(arligBelop: number) {
  const virketimer = 1750; // Ca 1750 virketimer per år
  const dager = 365;

  return {
    perVirketime: Math.round(arligBelop / virketimer),
    perDag: Math.round(arligBelop / dager),
    perManed: Math.round(arligBelop / 12),
    kilde: KILDER.velferdsbidrag,
  };
}

/**
 * Formater stort tall med tusenskilletegn og enhet
 */
export function formatWelfareNumber(value: number, enhet: string): string {
  const formatted = new Intl.NumberFormat("nb-NO").format(value);
  return `${formatted} ${enhet}`;
}

/**
 * Hent kilde for velferdskonverteringer
 */
export function getWelfareKilde(): KildeRef {
  return KILDER.velferdsbidrag;
}

// =============================================================================
// EKSPORT AV ALLE FUNKSJONER
// =============================================================================

export const welfareConversions = {
  convert: convertToWelfare,
  perTime: calculatePerTimeUnit,
  format: formatWelfareNumber,
  defaultCosts: DEFAULT_WELFARE_COSTS,
  kilde: KILDER.velferdsbidrag,
};
