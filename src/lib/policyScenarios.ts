/**
 * Policy-scenarioer med kildehenvisninger
 * Kobler reelle fremtidsprognoser til ringvirkningssimulering
 */

import {
  PolicyScenario,
  PolicyCategory,
  InterventionScenario,
  TimeSeriesPoint,
} from "@/types/policyScenario";

// ============================================
// SCENARIO 1: SYKEPLEIERMANGEL 2040
// ============================================

const SHORTAGE_2040_PROJECTION: TimeSeriesPoint[] = [
  {
    year: 2024,
    value: 4300,
    isProjected: false,
    kildeRef: {
      kildeId: "nsf-rekruttering",
      spesifikk: "NSFs estimat basert på NAV-tall",
    },
  },
  {
    year: 2025,
    value: 5500,
    isProjected: true,
    kildeRef: {
      kildeId: "nav-mangel-2025",
      spesifikk: "Ekstrapolert fra NAV Bedriftsundersokelse",
    },
  },
  {
    year: 2030,
    value: 15000,
    isProjected: true,
    kildeRef: {
      kildeId: "ssb-fremskriving-2035",
      spesifikk: "Interpolert mellom 2025 og 2035",
    },
  },
  {
    year: 2035,
    value: 28000,
    isProjected: true,
    kildeRef: {
      kildeId: "ssb-fremskriving-2035",
      spesifikk: "SSB Rapport 2019/12, Tabell 4.1",
    },
  },
  {
    year: 2040,
    value: 30000,
    isProjected: true,
    kildeRef: {
      kildeId: "ssb-fremskriving-2040",
      spesifikk: "Fremskriving basert på SSB 2035-tall",
    },
  },
];

const SYKEPLEIERLOEFTET_INTERVENTION: InterventionScenario = {
  id: "sykepleierloeftet-full",
  name: "Sykepleierloeftet (alle 8 krav)",
  description:
    "Full implementering av NSFs 8 krav: Bedre lonn, bemanningsnormer, heltidskultur, redusert vikarbruk",
  scenarioChanges: {
    salaryChangePercent: 12,
    agencyShareChange: -0.15,
    fullTimeEquivalentChange: 0.15,
    turnoverRateChange: -0.05,
  },
  expectedImpact: {
    metricReduction: -15000,
    percentReduction: -50,
    economicSaving: 75000000000, // 75 mrd
    timeToEffect: "5-10 år",
  },
  policyActions: [
    {
      action: "650 000 kr grunnlønn for spesialsykepleiere med 10 års ansiennitet",
      responsible: "Tariffpartene",
      kildeRef: { kildeId: "nsf-sykepleierloftet", spesifikk: "Krav 1" },
    },
    {
      action: "Bemanningsnormer i kommunehelsetjenesten",
      responsible: "Stortinget",
      kildeRef: { kildeId: "nsf-sykepleierloftet", spesifikk: "Krav 3" },
    },
    {
      action: "Full lønn under videreutdanning",
      responsible: "Helseforetak",
      kildeRef: { kildeId: "nsf-sykepleierloftet", spesifikk: "Krav 2" },
    },
    {
      action: "Økt finansiering av sykepleierutdanning",
      responsible: "Regjeringen",
      kildeRef: { kildeId: "nsf-sykepleierloftet", spesifikk: "Krav 8" },
    },
  ],
  sources: [
    { kildeId: "nsf-sykepleierloftet" },
    { kildeId: "ssb-fremskriving-2035" },
  ],
};

const DELVIS_TILTAK_INTERVENTION: InterventionScenario = {
  id: "delvis-tiltak",
  name: "Delvis tiltak",
  description: "Kun lønnsløft uten strukturelle endringer",
  scenarioChanges: {
    salaryChangePercent: 8,
  },
  expectedImpact: {
    metricReduction: -8000,
    percentReduction: -27,
    economicSaving: 40000000000, // 40 mrd
    timeToEffect: "5-10 år",
  },
  policyActions: [
    {
      action: "Lønnsløft for sykepleiere",
      responsible: "Tariffpartene",
    },
  ],
  sources: [{ kildeId: "nsf-lonn-2025" }],
};

export const SHORTAGE_2040_SCENARIO: PolicyScenario = {
  id: "shortage-2040",
  slug: "sykepleiermangel-2040",

  title: "Hva koster sykepleiermangelen?",
  subtitle: "30 000 manglende sykepleiere innen 2040",
  hook: "Uten handling vil Norge mangle 30 000 sykepleiere om 15 år. Den økonomiske kostnaden overstiger 100 milliarder kroner.",

  projection: {
    id: "shortage-projection-2040",
    type: "shortage",
    metric: "Antall manglende sykepleiere",
    unit: "sykepleiere",
    dataPoints: SHORTAGE_2040_PROJECTION,
    targetYear: 2040,
    targetValue: 30000,
    primarySource: {
      kildeId: "ssb-fremskriving-2035",
      spesifikk: "SSB Rapport 2019/12: Arbeidsmarkedet for helsepersonell fram mot 2035",
      sitat:
        "Beregningene viser en underdekning på 28 000 sykepleiere i 2035",
    },
    confidence: "high",
  },

  baselineDescription:
    "Fortsetter dagens utvikling med høy turnover, stor vikarbruk og lav heltidsandel",

  interventions: [SYKEPLEIERLOEFTET_INTERVENTION, DELVIS_TILTAK_INTERVENTION],

  sources: {
    primary: {
      kildeId: "ssb-fremskriving-2035",
      spesifikk: "SSB Rapport 2019/12",
    },
    supporting: [
      { kildeId: "nav-mangel-2025" },
      { kildeId: "nsf-rekruttering" },
      { kildeId: "nsf-sykepleierloftet" },
      { kildeId: "nou-2023-4", spesifikk: "Kapittel 6" },
    ],
  },

  narrativeTemplates: [
    {
      format: "headline",
      template:
        "Sykepleiermangel: {{targetValue}} faerre hender koster {{totalCost}} milliarder",
    },
    {
      format: "elevator_pitch",
      template:
        "Innen {{targetYear}} vil Norge mangle {{targetValue}} sykepleiere. Uten handling taper samfunnet over {{baselineCost}} milliarder kroner i tapt verdiskaping og okte vikarkostnader. Med Sykepleierloeftet kan vi halvere mangelen og spare {{savings}} milliarder.",
    },
    {
      format: "fact_sheet",
      template: `FAKTAARK: Sykepleiermangelen

SITUASJONEN I DAG:
- {{currentShortage}} ubesatte sykepleierstillinger (NAV 2025)
- 4 milliarder kr årlig til vikarbyråer
- 16% av sykepleiere jobber utenfor direkte pasientarbeid

PROGNOSE UTEN HANDLING:
- {{targetYear}}: {{targetValue}} manglende sykepleiere
- Økonomisk tap: {{baselineCost}} mrd kr (2024-{{targetYear}})

MED SYKEPLEIERLOEFTET:
- Mangel reduseres til {{reducedShortage}}
- Besparelse: {{savings}} mrd kr
- 8 konkrete tiltak implementeres

KILDER:
{{sources}}`,
    },
    {
      format: "social_media",
      template:
        "Norge vil mangle {{targetValue}} sykepleiere i {{targetYear}}. Kostnaden? Over {{totalCost}} milliarder kr. Løsningen finnes. #Sykepleierløftet #helsepolitikk",
    },
  ],

  category: "workforce_shortage",
  priority: "critical",
  lastUpdated: "2025-11-28",
};

// ============================================
// SCENARIO 2: VIKARKOSTNADSKRISEN
// ============================================

const AGENCY_COST_PROJECTION: TimeSeriesPoint[] = [
  {
    year: 2012,
    value: 622000000,
    isProjected: false,
    kildeRef: {
      kildeId: "nsf-vikar-36mrd",
      spesifikk: "Baseline-år for sammenligning",
    },
  },
  {
    year: 2021,
    value: 1760000000,
    isProjected: false,
    kildeRef: {
      kildeId: "nsf-vikar-36mrd",
      spesifikk: "Kommunenes vikarutgifter før økning",
    },
  },
  {
    year: 2022,
    value: 2630000000,
    isProjected: false,
    kildeRef: {
      kildeId: "nsf-vikar-36mrd",
      spesifikk: "49.7% økning fra 2021",
    },
  },
  {
    year: 2023,
    value: 4000000000,
    isProjected: false,
    kildeRef: {
      kildeId: "nsf-vikar-firedoblet",
      spesifikk: "Total: kommuner (3 mrd) + helseforetak (956 mill)",
    },
  },
  {
    year: 2025,
    value: 5000000000,
    isProjected: true,
    kildeRef: {
      kildeId: "nsf-vikar-firedoblet",
      spesifikk: "Estimert basert på trend",
    },
  },
  {
    year: 2030,
    value: 8000000000,
    isProjected: true,
    kildeRef: {
      kildeId: "nsf-vikar-firedoblet",
      spesifikk: "Fremskriving ved fortsatt vekst",
    },
  },
];

const ERSTATT_VIKARER_INTERVENTION: InterventionScenario = {
  id: "erstatt-vikarer",
  name: "Erstatt vikarer med faste stillinger",
  description:
    "Halvere vikarandelen ved å ansette fast. Koster mer i lønn, men sparer 2.5x på vikarkostnader.",
  scenarioChanges: {
    agencyShareChange: -0.10,
    employeeChange: 2000, // Netto nye faste stillinger
  },
  expectedImpact: {
    metricReduction: -2000000000, // 2 mrd mindre til vikar
    percentReduction: -50,
    economicSaving: 15000000000, // 15 mrd over 10 år
    timeToEffect: "2-3 år",
  },
  policyActions: [
    {
      action: "Overføre vikarbudsjett til faste stillinger",
      responsible: "Kommunene",
    },
    {
      action: "Overføre vikarbudsjett til faste stillinger",
      responsible: "Helseforetak",
    },
    {
      action: "Bemanningsnormer som sikrer tilstrekkelig grunnbemanning",
      responsible: "Stortinget",
      kildeRef: { kildeId: "nsf-sykepleierloftet", spesifikk: "Krav 3" },
    },
  ],
  sources: [
    { kildeId: "nsf-vikar-firedoblet" },
    { kildeId: "nsf-lav-bemanning" },
  ],
};

const BEGRENS_VIKARBYRA_INTERVENTION: InterventionScenario = {
  id: "begrens-vikarbyra",
  name: "Reguler vikarbyråer",
  description: "Innfør pristak og begrensninger på vikarbyråbruk",
  scenarioChanges: {
    agencyShareChange: -0.05,
  },
  expectedImpact: {
    metricReduction: -1000000000, // 1 mrd mindre
    percentReduction: -25,
    economicSaving: 8000000000, // 8 mrd over 10 år
    timeToEffect: "1-2 år",
  },
  policyActions: [
    {
      action: "Innføre pristak på vikarbyråtjenester",
      responsible: "Regjeringen",
    },
    {
      action: "Begrense bruk av vikarbyråer til akutte behov",
      responsible: "Helseforetak",
    },
  ],
  sources: [{ kildeId: "nsf-vikar-firedoblet" }],
};

export const AGENCY_CRISIS_SCENARIO: PolicyScenario = {
  id: "agency-crisis",
  slug: "vikarkostnad-4-milliarder",

  title: "4 milliarder til vikarbyråer",
  subtitle: "Penger som kunne gått til faste stillinger",
  hook: "Norge bruker 4 milliarder kroner årlig på sykepleiervikarer. Det er 2.5 ganger dyrere enn fast ansettelse - og pengene lekker ut av helsetjenesten.",

  projection: {
    id: "agency-cost-projection",
    type: "cost",
    metric: "Arlige vikarkostnader",
    unit: "kr",
    dataPoints: AGENCY_COST_PROJECTION,
    targetYear: 2030,
    targetValue: 8000000000,
    primarySource: {
      kildeId: "nsf-vikar-firedoblet",
      spesifikk: "NSF analyse av KS og helseforetaksdata",
      sitat:
        "Vikarbruken har firedoblet seg siden 2012. I 2023 brukte kommunene alene 3 milliarder kroner.",
    },
    confidence: "high",
  },

  baselineDescription:
    "Fortsatt vekst i vikarbruk pga. sykepleiermangel og høy turnover",

  interventions: [ERSTATT_VIKARER_INTERVENTION, BEGRENS_VIKARBYRA_INTERVENTION],

  sources: {
    primary: {
      kildeId: "nsf-vikar-firedoblet",
    },
    supporting: [
      { kildeId: "nsf-vikar-36mrd" },
      { kildeId: "nsf-lav-bemanning" },
      {
        kildeId: "nsf-sykepleierloftet",
        spesifikk: "Krav om bemanningsnormer",
      },
    ],
  },

  narrativeTemplates: [
    {
      format: "headline",
      template:
        "{{currentCost}} milliarder til vikarbyråer - kunne ansatt {{permanentEquivalent}} faste sykepleiere",
    },
    {
      format: "elevator_pitch",
      template:
        "I 2023 brukte norsk helsetjeneste 4 milliarder kroner på sykepleiervikarer. En vikar koster 2.5 ganger så mye som en fast ansatt - og mesteparten av pengene går til byråene, ikke til lokalsamfunnet. Ved å erstatte halvparten av vikarene med faste stillinger kan vi spare {{savings}} milliarder over 10 år.",
    },
    {
      format: "fact_sheet",
      template: `FAKTAARK: Vikarkostnadskrisen

KOSTNADSUTVIKLING:
- 2012: 622 mill kr (baseline)
- 2023: 4 000 mill kr (5x økning!)
- 2030: {{projectedCost}} mill kr (estimat)

HVORFOR ER VIKARER DYRERE?
- Vikarbyrå tar 2.5x timepris vs fast ansatt
- Kun 30% av vikarlønn blir i lokalsamfunnet
- Ingen kontinuitet = dårligere kvalitet

LØSNING - ERSTATT MED FASTE:
- 4 mrd vikar = kunne ansatt ~4700 faste sykepleiere
- Besparelse: {{savings}} mrd over 10 år
- Bedre kvalitet, lavere turnover

KILDER:
{{sources}}`,
    },
    {
      format: "social_media",
      template:
        "4 MILLIARDER til vikarbyråer i år. 2.5x dyrere enn fast ansatte. Løsningen er enkel: Ansett folk fast. #heltid #sykepleier",
    },
  ],

  category: "agency_costs",
  priority: "critical",
  lastUpdated: "2025-11-28",
};

// ============================================
// EKSPORTER
// ============================================

export const POLICY_SCENARIOS: PolicyScenario[] = [
  SHORTAGE_2040_SCENARIO,
  AGENCY_CRISIS_SCENARIO,
];

/**
 * Hent scenario basert på ID eller slug
 */
export function getPolicyScenarioById(
  idOrSlug: string
): PolicyScenario | undefined {
  return POLICY_SCENARIOS.find(
    (s) => s.id === idOrSlug || s.slug === idOrSlug
  );
}

/**
 * Hent alle scenarier i en kategori
 */
export function getPolicyScenariosByCategory(
  category: PolicyCategory
): PolicyScenario[] {
  return POLICY_SCENARIOS.filter((s) => s.category === category);
}

/**
 * Hent kritiske scenarier (for fremheving i UI)
 */
export function getCriticalPolicyScenarios(): PolicyScenario[] {
  return POLICY_SCENARIOS.filter((s) => s.priority === "critical");
}
