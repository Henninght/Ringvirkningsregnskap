/**
 * Ringvirkningsberegninger for Eidsiva
 *
 * Beregner direkte, indirekte og forbrukseffekter
 * Kilde: Rapport side 5, 9-10
 */

import { KILDER, FORBRUKSKATEGORIER } from "./eidsivaData";
import type { KildeRef } from "@/components/ui/SourceTooltip";

// =============================================================================
// TYPER
// =============================================================================

export interface DirektEffektInput {
  antallAnsatte: number;
  sumLonnskostnader: number;    // NOK
  investeringer: number;         // NOK
  skattOgUtbytte: number;        // NOK
}

export interface LeverandorInput {
  totaleInnkjop: number;         // NOK
  antallLeverandorer: number;
  innlandsandel: number;         // Prosent (0-100)
}

export interface ForbruksKategori {
  id: string;
  navn: string;
  belop: number;
  andel: number;
}

export interface RingvirkningsResultat {
  direkte: {
    total: number;
    lonninger: number;
    investeringer: number;
    skatt: number;
  };
  indirekte: {
    total: number;
    leverandorVerdiskaping: number;
    anslattAnsatteHosLeverandorer: number;
    bedrifterMedAvhengighet: number;
  };
  forbruk: {
    total: number;
    kategorier: ForbruksKategori[];
    perDag: number;
    perVirketime: number;
  };
  totalVerdiskaping: number;
  multiplikator: number;
}

// =============================================================================
// MULTIPLIKATORER (konfigurerbare)
// =============================================================================

export interface Multiplikatorer {
  indirekte: number;  // Leverandør-effekt
  forbruk: number;    // Forbrukseffekt
  verdiskapingPerAnsattLeverandor: number;  // NOK per ansatt
  avhengighetsterskel: number;  // Prosent av omsetning for å regnes som avhengig
}

export const DEFAULT_MULTIPLIKATORER: Multiplikatorer = {
  indirekte: 0.5,     // 50% av direkte effekter
  forbruk: 0.3,       // 30% av direkte effekter
  verdiskapingPerAnsattLeverandor: 800_000,  // NOK
  avhengighetsterskel: 20,  // 20% av omsetning
};

// =============================================================================
// BEREGNINGSFUNKSJONER
// =============================================================================

/**
 * Beregn direkte effekter
 */
export function calculateDirektEffekt(input: DirektEffektInput): RingvirkningsResultat["direkte"] {
  const total = input.sumLonnskostnader + input.investeringer + input.skattOgUtbytte;

  return {
    total,
    lonninger: input.sumLonnskostnader,
    investeringer: input.investeringer,
    skatt: input.skattOgUtbytte,
  };
}

/**
 * Beregn indirekte effekter (leverandører)
 */
export function calculateIndirektEffekt(
  leverandorInput: LeverandorInput,
  multiplikatorer: Multiplikatorer = DEFAULT_MULTIPLIKATORER
): RingvirkningsResultat["indirekte"] {
  const innlandsInnkjop = leverandorInput.totaleInnkjop * (leverandorInput.innlandsandel / 100);
  const leverandorVerdiskaping = innlandsInnkjop * multiplikatorer.indirekte;

  // Anslå antall ansatte hos leverandører basert på verdiskaping
  const anslattAnsatte = Math.round(
    leverandorVerdiskaping / multiplikatorer.verdiskapingPerAnsattLeverandor
  );

  // Anslå bedrifter med avhengighetsforhold (ca 5% av leverandører typisk)
  const bedrifterMedAvhengighet = Math.round(leverandorInput.antallLeverandorer * 0.05);

  return {
    total: leverandorVerdiskaping,
    leverandorVerdiskaping,
    anslattAnsatteHosLeverandorer: anslattAnsatte,
    bedrifterMedAvhengighet,
  };
}

/**
 * Beregn forbrukseffekter fra ansatte
 */
export function calculateForbruksEffekt(
  direktEffekt: DirektEffektInput,
  skattesats: number = 0.35  // Gjennomsnittlig skattesats
): RingvirkningsResultat["forbruk"] {
  // Netto inntekt etter skatt
  const nettoInntekt = direktEffekt.sumLonnskostnader * (1 - skattesats);

  // Fordel på kategorier
  const kategorier: ForbruksKategori[] = FORBRUKSKATEGORIER.kategorier.map((kat) => ({
    id: kat.id,
    navn: kat.navn,
    belop: Math.round(nettoInntekt * kat.andel),
    andel: kat.andel,
  }));

  // Total forbrukseffekt (lokal andel, ca 70% antas brukt lokalt)
  const lokalAndel = 0.7;
  const total = nettoInntekt * lokalAndel;

  // Per tidsenhet
  const virketimer = 1750;
  const dager = 365;

  return {
    total,
    kategorier,
    perDag: Math.round(total / dager),
    perVirketime: Math.round(total / virketimer),
  };
}

/**
 * Hovedfunksjon: Beregn alle ringvirkninger
 */
export function calculateRingvirkninger(
  direktInput: DirektEffektInput,
  leverandorInput: LeverandorInput,
  multiplikatorer: Multiplikatorer = DEFAULT_MULTIPLIKATORER
): RingvirkningsResultat {
  const direkte = calculateDirektEffekt(direktInput);
  const indirekte = calculateIndirektEffekt(leverandorInput, multiplikatorer);
  const forbruk = calculateForbruksEffekt(direktInput);

  const totalVerdiskaping = direkte.total + indirekte.total + forbruk.total;
  const multiplikator = totalVerdiskaping / direkte.total;

  return {
    direkte,
    indirekte,
    forbruk,
    totalVerdiskaping,
    multiplikator,
  };
}

/**
 * Generer data for Sankey-diagram basert på beregninger
 */
export function generateSankeyFromCalculations(resultat: RingvirkningsResultat) {
  const total = resultat.totalVerdiskaping;

  // Normaliser til prosenter
  const direkteProsent = Math.round((resultat.direkte.total / total) * 100);
  const indirekteProsent = Math.round((resultat.indirekte.total / total) * 100);
  const forbrukProsent = Math.round((resultat.forbruk.total / total) * 100);

  return {
    nodes: [
      { id: "Eidsiva Energi", nodeColor: "#1C1C1E" },
      { id: "Direkte effekter", nodeColor: "#3B82F6" },
      { id: "Indirekte effekter", nodeColor: "#8B5CF6" },
      { id: "Forbrukseffekter", nodeColor: "#EC4899" },
      { id: "Lokalsamfunn", nodeColor: "#10B981" },
      { id: "Leverandører", nodeColor: "#F59E0B" },
      { id: "Offentlig sektor", nodeColor: "#6366F1" },
    ],
    links: [
      { source: "Eidsiva Energi", target: "Direkte effekter", value: direkteProsent },
      { source: "Eidsiva Energi", target: "Indirekte effekter", value: indirekteProsent },
      { source: "Eidsiva Energi", target: "Forbrukseffekter", value: forbrukProsent },
      { source: "Direkte effekter", target: "Offentlig sektor", value: Math.round(direkteProsent * 0.4) },
      { source: "Direkte effekter", target: "Lokalsamfunn", value: Math.round(direkteProsent * 0.6) },
      { source: "Indirekte effekter", target: "Leverandører", value: indirekteProsent },
      { source: "Forbrukseffekter", target: "Lokalsamfunn", value: forbrukProsent },
    ],
  };
}

/**
 * Hent kilder for ringvirkningsberegninger
 */
export function getRippleKilder(): { direkte: KildeRef; indirekte: KildeRef; forbruk: KildeRef } {
  return {
    direkte: { side: 5, seksjon: "Direkte effekter" },
    indirekte: KILDER.leverandorer,
    forbruk: KILDER.forbrukseffekter,
  };
}

// =============================================================================
// EKSPORT
// =============================================================================

export const rippleCalculations = {
  calculateAll: calculateRingvirkninger,
  direkte: calculateDirektEffekt,
  indirekte: calculateIndirektEffekt,
  forbruk: calculateForbruksEffekt,
  toSankey: generateSankeyFromCalculations,
  defaultMultiplikatorer: DEFAULT_MULTIPLIKATORER,
  kilder: getRippleKilder,
};
