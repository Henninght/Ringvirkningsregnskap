// Konfigurerbare parametere for ringvirkningsberegninger
export interface RippleConfig {
  // Multiplikatorer
  indirectMultiplier: number; // Standard: 0.5 (50% av direkte)
  inducedMultiplier: number; // Standard: 0.3 (30% av direkte)
  localRetentionRate: number; // Andel som forblir lokalt: 0.7 (70%)

  // Skattesatser
  taxRates: {
    incomeTax: number; // Arbeidsgiveravgift + skatt: 0.35
    corporateTax: number; // Selskapsskatt: 0.22
    vatRate: number; // MVA-sats: 0.25
  };

  // Sysselsettingsparametere
  employmentMultiplier: number; // Årsverk per million: 0.8
  averageSalary: number; // Gjennomsnittlig årslønn
}

// Grunndata for beregning
export interface OrganizationInput {
  name: string;
  employees: number;
  averageSalary: number; // Gjennomsnittlig årslønn i NOK
  operatingResult: number; // Driftsresultat i NOK
  localShare: number; // Andel av aktivitet i Norge (0-1)

  // NSF-spesifikke felter for differensiert effektberegning
  agencyShare: number; // Vikarandel (0-0.5) - påvirker lokal verdiskaping
  fullTimeEquivalent: number; // Gjennomsnittlig stillingsprosent (0.5-1.0)
  turnoverRate: number; // Årlig turnover/frafall (0.05-0.25)
}

// Resultat fra ringvirkningsberegning
export interface RippleCalculation {
  // Direkte effekter
  directEffect: {
    wages: number; // Totale lønnskostnader
    operatingResult: number; // Driftsresultat
    total: number; // Sum direkte
  };

  // Indirekte effekter (leverandørkjede)
  indirectEffect: {
    supplierValue: number; // Verdiskaping hos leverandører
    supplierEmployment: number; // Sysselsetting hos leverandører
    total: number;
  };

  // Induserte effekter (forbrukseffekt)
  inducedEffect: {
    consumptionValue: number; // Verdiskaping fra forbruk
    localEconomyEffect: number; // Effekt på lokaløkonomi
    total: number;
  };

  // Totale ringvirkninger
  totals: {
    valueCreation: number; // Total verdiskaping
    employment: number; // Total sysselsetting (årsverk)
    taxContribution: number; // Totalt skattebidrag
    totalRippleEffect: number; // Samlet ringvirkningseffekt
    multiplierEffect: number; // Multiplikatoreffekt (total/direkte)
  };
}

// Scenariodata for simulator
export interface Scenario {
  id: string;
  name: string;
  description: string;
  type: "hiring" | "salary" | "downsizing" | "custom" | "nsf-policy";
  changes: {
    employeeChange?: number; // Endring i antall ansatte
    salaryChangePercent?: number; // Prosentvis lønnsendring
    operatingResultChange?: number; // Endring i driftsresultat
    // NSF-spesifikke endringer
    agencyShareChange?: number; // Endring i vikarandel (absolutt, f.eks. -0.05)
    fullTimeEquivalentChange?: number; // Endring i heltidsandel (absolutt)
    turnoverRateChange?: number; // Endring i turnover (absolutt)
  };
}

// Sammenligning mellom baseline og scenario
export interface ScenarioComparison {
  baseline: RippleCalculation;
  scenario: RippleCalculation;
  difference: {
    valueCreation: number;
    employment: number;
    taxContribution: number;
    percentChange: number;
  };
}

// Sankey-diagram data format
export interface SankeyNode {
  id: string;
  color: string;
}

export interface SankeyLink {
  source: string;
  target: string;
  value: number;
}

export interface SankeyData {
  nodes: SankeyNode[];
  links: SankeyLink[];
}

// Kommunedata for kart
export interface Municipality {
  id: string; // Kommunenummer
  name: string;
  county: string; // Fylke
  population: number;
  employees: number; // Antall ansatte i kommunen
  nurses?: number; // Antall sykepleiere (NSF-spesifikt)
  coverageRatio?: number; // Dekningsgrad (sykepleiere per 1000 innb.)
  coordinates: {
    lat: number;
    lng: number;
  };
}

// Aggregert regional data
export interface RegionalData {
  municipalities: Municipality[];
  totalEmployees: number;
  averageCoverage: number;
  heatmapData: {
    municipalityId: string;
    intensity: number; // 0-1 for fargeskala
  }[];
}

// Standard konfigurasjon
export const DEFAULT_RIPPLE_CONFIG: RippleConfig = {
  indirectMultiplier: 0.5,
  inducedMultiplier: 0.3,
  localRetentionRate: 0.7,
  taxRates: {
    incomeTax: 0.35,
    corporateTax: 0.22,
    vatRate: 0.25,
  },
  employmentMultiplier: 0.8,
  averageSalary: 650000,
};

// Forhåndsdefinerte scenarier - generiske (beholdt for bakoverkompatibilitet)
export const PRESET_SCENARIOS: Scenario[] = [
  {
    id: "hire-10",
    name: "Ansett 10 flere",
    description: "Hva skjer om vi ansetter 10 flere medarbeidere?",
    type: "hiring",
    changes: { employeeChange: 10 },
  },
  {
    id: "hire-50",
    name: "Ansett 50 flere",
    description: "Hva skjer om vi ansetter 50 flere medarbeidere?",
    type: "hiring",
    changes: { employeeChange: 50 },
  },
  {
    id: "salary-5",
    name: "5% lønnsøkning",
    description: "Hva skjer om lønnsnivået øker med 5%?",
    type: "salary",
    changes: { salaryChangePercent: 5 },
  },
  {
    id: "salary-10",
    name: "10% lønnsøkning",
    description: "Hva skjer om lønnsnivået øker med 10%?",
    type: "salary",
    changes: { salaryChangePercent: 10 },
  },
  {
    id: "downsize-10",
    name: "Nedbemanning 10%",
    description: "Hva er konsekvensen av å redusere med 10%?",
    type: "downsizing",
    changes: { employeeChange: -10 },
  },
];

// NSF-spesifikke scenarier basert på Sykepleierløftet og NSFs politiske agenda
export const NSF_SCENARIOS: Scenario[] = [
  {
    id: "sykepleierløftet",
    name: "Implementer Sykepleierløftet",
    description: "Effekten av alle 8 krav: Bedre lønn, redusert vikarbruk, økt heltidsandel",
    type: "nsf-policy",
    changes: {
      salaryChangePercent: 12, // Til 650k for spesialsykepleiere
      agencyShareChange: -0.15, // Halvere vikarbruk
      fullTimeEquivalentChange: 0.15, // Fra 75% til 90% heltid
      turnoverRateChange: -0.05, // Bedre vilkår = lavere turnover
    },
  },
  {
    id: "reduser-vikarer",
    name: "Erstatt vikarer med fast ansatte",
    description: "Hva sparer vi ved å redusere vikarandelen med 10 prosentpoeng?",
    type: "nsf-policy",
    changes: {
      agencyShareChange: -0.10, // Fra f.eks. 20% til 10%
    },
  },
  {
    id: "heltidskultur",
    name: "Full heltidskultur",
    description: "Øk gjennomsnittlig stillingsprosent fra 75% til 95%",
    type: "nsf-policy",
    changes: {
      fullTimeEquivalentChange: 0.20,
      turnoverRateChange: -0.03, // Heltid = mer stabilitet
    },
  },
  {
    id: "stopp-turnover",
    name: "Halvere turnover",
    description: "Effekten av å redusere frafall fra 12% til 6% årlig",
    type: "nsf-policy",
    changes: {
      turnoverRateChange: -0.06,
    },
  },
  {
    id: "status-quo-forverring",
    name: "Status quo (forverring)",
    description: "Hva skjer om vikarbruk og turnover fortsetter å øke?",
    type: "nsf-policy",
    changes: {
      agencyShareChange: 0.05, // Mer vikarbruk
      turnoverRateChange: 0.03, // Høyere frafall
      fullTimeEquivalentChange: -0.05, // Mer deltid
    },
  },
  {
    id: "mobiliser-17000",
    name: "Mobiliser de 17.000",
    description: "Få 50% av sykepleiere utenfor direkte pasientarbeid tilbake",
    type: "nsf-policy",
    changes: {
      employeeChange: 8500, // Halvparten av 17.000
      agencyShareChange: -0.10, // Mindre behov for vikarer
      salaryChangePercent: 8, // Krav: Bedre lønn for å komme tilbake
    },
  },
];
