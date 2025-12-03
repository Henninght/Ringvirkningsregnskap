/**
 * Beskrivelser fra Eidsiva Ringvirkningsregnskap-rapporten
 * Brukes til InfoTooltips i dashbordet
 */

export const EIDSIVA_DESCRIPTIONS = {
  // Side 5 - Ringvirkninger
  ringvirkninger: "Tre effektnivåer: direkte, indirekte og forbrukseffekter. (s.5)",

  // Side 5 - Tre effekttyper
  direkteEffekt: "Lønn, investeringer, drift, skatt og utbytte. (s.5)",
  indirektEffekt: "Verdiskaping hos leverandører. (s.5)",
  forbrukseffekt: "Ansattes forbruk i lokalsamfunnet. (s.5)",

  // Side 5 - Ringvirkningskategorier
  okonomiske: "Bidrag til lokalsamfunn og næringsliv. (s.7-10)",
  sosiale: "Støtte til idrett, foreninger og lokalsamfunn. (s.13-15)",
  baerekraftige: "Fornybar energi og klimatiltak. (s.17-20)",

  // Side 8 - Velferd
  offentligVelferd: "Skatter og avgifter til norsk velferd. (s.8)",

  // Side 7 - Regionalt
  verditilforsel: "Eierutbytte og direktebidrag til kommunene. (s.7)",

  // Side 17 - Fornybar energi
  vannkraft: "6,2 mrd kWh fra 74 vannkraftverk via Hafslund Kraft. (s.17)",
  biokraft: "485 mill kWh fra 16 varmesentraler, 98% fornybart. (s.17)",

  // Side 9 - Lokal vekst
  lokalVekst: "Ansattes forbruk styrker lokalt næringsliv. (s.9)",

  // Side 10 - Leverandører
  leverandorer: "Innkjøp skaper aktivitet i norsk næringsliv. (s.10)",

  // Side 11 - Kritisk infrastruktur
  kritiskInfrastruktur: "Strøm til sykehus, brannstasjoner og beredskap. (s.11)",
} as const;

export type EidsivaDescriptionKey = keyof typeof EIDSIVA_DESCRIPTIONS;
