import {
  RippleConfig,
  RippleCalculation,
  OrganizationInput,
  SankeyData,
  DEFAULT_RIPPLE_CONFIG,
  Scenario,
  ScenarioComparison,
} from "@/types/ripple";

import {
  YearlyImpact,
  MultiYearComparison,
  TimeSeriesPoint,
  InterventionScenario,
} from "@/types/policyScenario";

/**
 * Beregn direkte effekter (lønn + driftsresultat)
 * NSF-tilpasset: Vikarandel reduserer lokal verdiskaping,
 * deltid og turnover reduserer effektivitet
 */
export function calculateDirectEffect(
  input: OrganizationInput,
  config: RippleConfig = DEFAULT_RIPPLE_CONFIG
): RippleCalculation["directEffect"] {
  const { employees, averageSalary, operatingResult, localShare, agencyShare, fullTimeEquivalent, turnoverRate } = input;

  // Fast ansatte - full lokal verdiskaping
  const permanentEmployees = employees * (1 - agencyShare);
  const permanentWages = permanentEmployees * averageSalary * localShare * fullTimeEquivalent;

  // Vikarer - verdiskaping lekker ut (kun ~30% forblir lokalt)
  // Vikarer koster 2.5x, men mesteparten går til byrå
  const agencyEmployees = employees * agencyShare;
  const agencyCost = agencyEmployees * averageSalary * 2.5;
  const agencyLocalValue = agencyCost * 0.3 * localShare; // Kun 30% til lokal økonomi

  // Turnover-kostnad reduserer netto verdiskaping
  // Rekrutteringskost = 1.5x årslønn per som slutter
  const turnoverCost = employees * turnoverRate * averageSalary * 1.5 * 0.3; // 30% av kost er tapt verdi

  const wages = permanentWages + agencyLocalValue - turnoverCost;
  const adjustedOperatingResult = operatingResult * localShare * fullTimeEquivalent;

  return {
    wages: Math.max(0, wages),
    operatingResult: adjustedOperatingResult,
    total: Math.max(0, wages) + adjustedOperatingResult,
  };
}

/**
 * Beregn indirekte effekter (leverandørkjede)
 */
export function calculateIndirectEffect(
  directTotal: number,
  config: RippleConfig = DEFAULT_RIPPLE_CONFIG
): RippleCalculation["indirectEffect"] {
  const supplierValue = directTotal * config.indirectMultiplier;
  const supplierEmployment = (supplierValue / 1000000) * config.employmentMultiplier;

  return {
    supplierValue,
    supplierEmployment,
    total: supplierValue,
  };
}

/**
 * Beregn induserte effekter (forbrukseffekt)
 */
export function calculateInducedEffect(
  directTotal: number,
  config: RippleConfig = DEFAULT_RIPPLE_CONFIG
): RippleCalculation["inducedEffect"] {
  const consumptionValue = directTotal * config.inducedMultiplier;
  const localEconomyEffect = consumptionValue * config.localRetentionRate;

  return {
    consumptionValue,
    localEconomyEffect,
    total: consumptionValue,
  };
}

/**
 * Beregn totalt skattebidrag
 */
export function calculateTaxContribution(
  wages: number,
  operatingResult: number,
  indirectTotal: number,
  inducedTotal: number,
  config: RippleConfig = DEFAULT_RIPPLE_CONFIG
): number {
  // Skatt fra lønn (arbeidsgiveravgift + inntektsskatt)
  const wageTax = wages * config.taxRates.incomeTax;

  // Selskapsskatt fra driftsresultat
  const corporateTax = Math.max(0, operatingResult) * config.taxRates.corporateTax;

  // MVA fra forbruk (induserte effekter)
  const vatContribution = inducedTotal * config.taxRates.vatRate * 0.4; // 40% av forbruk er MVA-pliktig

  // Skatt fra leverandørkjede (indirekte)
  const supplierTax = indirectTotal * config.taxRates.incomeTax * 0.5;

  return wageTax + corporateTax + vatContribution + supplierTax;
}

/**
 * Beregn total sysselsetting
 */
export function calculateTotalEmployment(
  directEmployees: number,
  indirectSupplierEmployment: number,
  inducedTotal: number,
  config: RippleConfig = DEFAULT_RIPPLE_CONFIG
): number {
  // Direkte ansatte
  const direct = directEmployees;

  // Indirekte (leverandører)
  const indirect = indirectSupplierEmployment;

  // Indusert sysselsetting fra forbruk
  const induced = (inducedTotal / 1000000) * config.employmentMultiplier * 0.5;

  return direct + indirect + induced;
}

/**
 * Komplett ringvirkningsberegning
 */
export function calculateTotalRipple(
  input: OrganizationInput,
  config: RippleConfig = DEFAULT_RIPPLE_CONFIG
): RippleCalculation {
  // Direkte effekter
  const directEffect = calculateDirectEffect(input, config);

  // Indirekte effekter
  const indirectEffect = calculateIndirectEffect(directEffect.total, config);

  // Induserte effekter
  const inducedEffect = calculateInducedEffect(directEffect.total, config);

  // Total verdiskaping
  const valueCreation = directEffect.total + indirectEffect.total + inducedEffect.total;

  // Total sysselsetting
  const employment = calculateTotalEmployment(
    input.employees,
    indirectEffect.supplierEmployment,
    inducedEffect.total,
    config
  );

  // Skattebidrag
  const taxContribution = calculateTaxContribution(
    directEffect.wages,
    directEffect.operatingResult,
    indirectEffect.total,
    inducedEffect.total,
    config
  );

  // Multiplikatoreffekt
  const multiplierEffect = directEffect.total > 0
    ? valueCreation / directEffect.total
    : 0;

  return {
    directEffect,
    indirectEffect,
    inducedEffect,
    totals: {
      valueCreation,
      employment,
      taxContribution,
      totalRippleEffect: valueCreation,
      multiplierEffect,
    },
  };
}

/**
 * Appliser scenario på input
 * NSF-tilpasset: Støtter endringer i vikarandel, heltidsandel og turnover
 */
export function applyScenario(
  baseInput: OrganizationInput,
  scenario: Scenario
): OrganizationInput {
  const modified = { ...baseInput };

  if (scenario.changes.employeeChange !== undefined) {
    // Håndter både absolutt og prosentvis endring
    if (scenario.type === "downsizing" && scenario.changes.employeeChange < 0) {
      // Prosentvis nedbemanning
      const reduction = Math.abs(scenario.changes.employeeChange) / 100;
      modified.employees = Math.round(baseInput.employees * (1 - reduction));
    } else {
      // Absolutt endring
      modified.employees = baseInput.employees + scenario.changes.employeeChange;
    }
  }

  if (scenario.changes.salaryChangePercent !== undefined) {
    const change = scenario.changes.salaryChangePercent / 100;
    modified.averageSalary = baseInput.averageSalary * (1 + change);
  }

  if (scenario.changes.operatingResultChange !== undefined) {
    modified.operatingResult = baseInput.operatingResult + scenario.changes.operatingResultChange;
  }

  // NSF-spesifikke endringer
  if (scenario.changes.agencyShareChange !== undefined) {
    modified.agencyShare = Math.max(0, Math.min(0.5, baseInput.agencyShare + scenario.changes.agencyShareChange));
  }

  if (scenario.changes.fullTimeEquivalentChange !== undefined) {
    modified.fullTimeEquivalent = Math.max(0.5, Math.min(1.0, baseInput.fullTimeEquivalent + scenario.changes.fullTimeEquivalentChange));
  }

  if (scenario.changes.turnoverRateChange !== undefined) {
    modified.turnoverRate = Math.max(0.05, Math.min(0.25, baseInput.turnoverRate + scenario.changes.turnoverRateChange));
  }

  return modified;
}

/**
 * Sammenlign baseline med scenario
 */
export function compareScenarios(
  baseInput: OrganizationInput,
  scenario: Scenario,
  config: RippleConfig = DEFAULT_RIPPLE_CONFIG
): ScenarioComparison {
  const baseline = calculateTotalRipple(baseInput, config);
  const scenarioInput = applyScenario(baseInput, scenario);
  const scenarioResult = calculateTotalRipple(scenarioInput, config);

  const valueCreationDiff = scenarioResult.totals.valueCreation - baseline.totals.valueCreation;
  const employmentDiff = scenarioResult.totals.employment - baseline.totals.employment;
  const taxDiff = scenarioResult.totals.taxContribution - baseline.totals.taxContribution;

  return {
    baseline,
    scenario: scenarioResult,
    difference: {
      valueCreation: valueCreationDiff,
      employment: employmentDiff,
      taxContribution: taxDiff,
      percentChange: baseline.totals.valueCreation > 0
        ? (valueCreationDiff / baseline.totals.valueCreation) * 100
        : 0,
    },
  };
}

/**
 * Generer Sankey-data fra beregning
 * NSF Professional Color Scheme
 */
export function generateSankeyData(calculation: RippleCalculation): SankeyData {
  const { directEffect, indirectEffect, inducedEffect, totals } = calculation;

  // Skaler til millioner
  const toMillions = (val: number) => Math.round(val / 1000000);

  const directMill = toMillions(directEffect.total);
  const indirectMill = toMillions(indirectEffect.total);
  const inducedMill = toMillions(inducedEffect.total);

  // Fordeling fra direkte effekter
  const wagesPct = directEffect.wages / directEffect.total;
  const operatingPct = 1 - wagesPct;

  return {
    nodes: [
      { id: "Verdiskaping", color: "#3d838b" },         // petrol-500
      { id: "Direkte effekter", color: "#5a9fa6" },     // petrol-400
      { id: "Indirekte effekter", color: "#e2b86e" },   // sand-400 (amber/warm)
      { id: "Induserte effekter", color: "#a855f7" },   // lavender-500 (purple)
      { id: "Lønninger", color: "#3d838b" },            // petrol-500
      { id: "Leverandører", color: "#d9a04a" },         // sand-500 (amber)
      { id: "Skatter", color: "#6c757d" },              // slate-500 (neutral)
      { id: "Lokalsamfunn", color: "#c084fc" },         // lavender-400
      { id: "Helse & omsorg", color: "#d8b4fe" },       // lavender-300
      { id: "Investeringer", color: "#336b73" },        // petrol-600
    ],
    links: [
      // Fra Verdiskaping til effekttyper
      { source: "Verdiskaping", target: "Direkte effekter", value: directMill },
      { source: "Verdiskaping", target: "Indirekte effekter", value: indirectMill },
      { source: "Verdiskaping", target: "Induserte effekter", value: inducedMill },

      // Fra Direkte effekter
      { source: "Direkte effekter", target: "Lønninger", value: Math.round(directMill * wagesPct * 0.6) },
      { source: "Direkte effekter", target: "Skatter", value: Math.round(directMill * 0.25) },
      { source: "Direkte effekter", target: "Investeringer", value: Math.round(directMill * operatingPct * 0.5) },

      // Fra Indirekte effekter
      { source: "Indirekte effekter", target: "Leverandører", value: Math.round(indirectMill * 0.6) },
      { source: "Indirekte effekter", target: "Skatter", value: Math.round(indirectMill * 0.25) },
      { source: "Indirekte effekter", target: "Lokalsamfunn", value: Math.round(indirectMill * 0.15) },

      // Fra Induserte effekter
      { source: "Induserte effekter", target: "Lokalsamfunn", value: Math.round(inducedMill * 0.5) },
      { source: "Induserte effekter", target: "Helse & omsorg", value: Math.round(inducedMill * 0.3) },
      { source: "Induserte effekter", target: "Skatter", value: Math.round(inducedMill * 0.2) },
    ],
  };
}

/**
 * NSF-spesifikke metrikker
 */
export function calculateNsfMetrics(
  nurses: number,
  population: number,
  agencyCost: number,
  equivalentPermanentCost: number
) {
  // Dekningsgrad: sykepleiere per 1000 innbyggere
  const coverageRatio = (nurses / population) * 1000;

  // Vikarpremie: merkostnad for vikarbruk
  const agencyPremium = equivalentPermanentCost > 0
    ? ((agencyCost - equivalentPermanentCost) / equivalentPermanentCost) * 100
    : 0;

  return {
    coverageRatio,
    agencyPremium,
    nursesPerThousand: coverageRatio.toFixed(1),
    agencyPremiumPercent: agencyPremium.toFixed(0),
  };
}

/**
 * Formater tall til lesbar norsk format
 */
export function formatRippleValue(value: number, type: "currency" | "employment" | "percent"): string {
  const formatter = new Intl.NumberFormat("nb-NO", {
    minimumFractionDigits: type === "percent" ? 1 : 0,
    maximumFractionDigits: type === "percent" ? 1 : 0,
  });

  if (type === "currency") {
    if (value >= 1000000000) {
      return `${formatter.format(value / 1000000000)} mrd`;
    } else if (value >= 1000000) {
      return `${formatter.format(value / 1000000)} mill`;
    } else if (value >= 1000) {
      return `${formatter.format(value / 1000)} tusen`;
    }
    return formatter.format(value);
  }

  if (type === "employment") {
    return `${formatter.format(Math.round(value))} årsverk`;
  }

  if (type === "percent") {
    return `${value >= 0 ? "+" : ""}${formatter.format(value)}%`;
  }

  return formatter.format(value);
}

// ============================================
// POLICY SCENARIO BEREGNINGER
// ============================================

/**
 * Beregn økonomisk kostnad av sykepleiermangel
 * Tar høyde for vikarkostnader og tapt produktivitet
 */
export function calculateShortageEconomicCost(
  shortage: number,
  options: {
    vikarCoverageRate?: number; // Andel som dekkes av vikarer (default 0.30)
    vikarPremium?: number; // Vikarkost vs fast (default 2.5)
    averageSalary?: number; // Gjennomsnittlig årslønn (default 582000)
    productivityLossFactor?: number; // Produktivitetstap per udekket stilling (default 1.0)
  } = {}
): { vikarCost: number; lostProductivity: number; total: number } {
  const {
    vikarCoverageRate = 0.30,
    vikarPremium = 2.5,
    averageSalary = 582000,
    productivityLossFactor = 1.0,
  } = options;

  // Vikarkostnad for de som dekkes
  const vikarCoveredPositions = shortage * vikarCoverageRate;
  const vikarCost = vikarCoveredPositions * averageSalary * vikarPremium;

  // Tapt produktivitet for udekkede stillinger
  const uncoveredPositions = shortage * (1 - vikarCoverageRate);
  const lostProductivity = uncoveredPositions * averageSalary * productivityLossFactor;

  return {
    vikarCost,
    lostProductivity,
    total: vikarCost + lostProductivity,
  };
}

/**
 * Beregn årlig effekt for hvert år i en projeksjon
 */
export function calculateYearlyImpacts(
  projection: TimeSeriesPoint[],
  options: {
    vikarCoverageRate?: number;
    vikarPremium?: number;
    averageSalary?: number;
  } = {}
): YearlyImpact[] {
  return projection.map((point) => {
    const costs = calculateShortageEconomicCost(point.value, options);

    return {
      year: point.year,
      shortage: point.value,
      economicCost: costs.total,
      vikarCost: costs.vikarCost,
      lostProductivity: costs.lostProductivity,
      isProjected: point.isProjected,
    };
  });
}

/**
 * Beregn effekt med intervensjon (tiltak)
 * Reduserer mangelen gradvis over tid basert på forventet effekt
 */
export function calculateYearlyImpactsWithIntervention(
  projection: TimeSeriesPoint[],
  intervention: InterventionScenario,
  options: {
    vikarCoverageRate?: number;
    vikarPremium?: number;
    averageSalary?: number;
    interventionStartYear?: number;
    rampUpYears?: number; // Hvor mange år før full effekt
  } = {}
): YearlyImpact[] {
  const {
    vikarCoverageRate = 0.30,
    vikarPremium = 2.5,
    averageSalary = 582000,
    interventionStartYear = new Date().getFullYear(),
    rampUpYears = 5,
  } = options;

  const targetReduction = intervention.expectedImpact.percentReduction / 100;

  return projection.map((point) => {
    let adjustedShortage = point.value;

    // Beregn gradvis effekt av intervensjon
    if (point.year >= interventionStartYear) {
      const yearsActive = point.year - interventionStartYear;
      const effectProgress = Math.min(1, yearsActive / rampUpYears);
      const currentReduction = targetReduction * effectProgress;
      adjustedShortage = Math.max(0, point.value * (1 + currentReduction));
    }

    const costs = calculateShortageEconomicCost(adjustedShortage, {
      vikarCoverageRate,
      vikarPremium,
      averageSalary,
    });

    return {
      year: point.year,
      shortage: Math.round(adjustedShortage),
      economicCost: costs.total,
      vikarCost: costs.vikarCost,
      lostProductivity: costs.lostProductivity,
      isProjected: point.isProjected,
    };
  });
}

/**
 * Sammenlign baseline med intervensjon over tid
 */
export function calculateMultiYearComparison(
  projection: TimeSeriesPoint[],
  intervention: InterventionScenario,
  options: {
    vikarCoverageRate?: number;
    vikarPremium?: number;
    averageSalary?: number;
    interventionStartYear?: number;
    rampUpYears?: number;
  } = {}
): MultiYearComparison {
  const baseline = calculateYearlyImpacts(projection, options);
  const withIntervention = calculateYearlyImpactsWithIntervention(
    projection,
    intervention,
    options
  );

  // Beregn totale kostnader
  const baselineTotal = baseline.reduce((sum, y) => sum + y.economicCost, 0);
  const interventionTotal = withIntervention.reduce(
    (sum, y) => sum + y.economicCost,
    0
  );

  const totalSaved = baselineTotal - interventionTotal;
  const percentReduction =
    baselineTotal > 0 ? (totalSaved / baselineTotal) * 100 : 0;

  return {
    baseline,
    withIntervention,
    totalSaved,
    percentReduction,
    yearsAnalyzed: projection.length,
  };
}

/**
 * Beregn kumulativ effekt med nåverdi (diskontert)
 */
export function calculateCumulativeImpact(
  yearlyImpacts: YearlyImpact[],
  discountRate: number = 0.03 // 3% diskonteringsrente
): { totalCost: number; presentValue: number } {
  let totalCost = 0;
  let presentValue = 0;
  const baseYear = yearlyImpacts[0]?.year || new Date().getFullYear();

  yearlyImpacts.forEach((impact) => {
    totalCost += impact.economicCost;
    const yearsFromBase = impact.year - baseYear;
    presentValue += impact.economicCost / Math.pow(1 + discountRate, yearsFromBase);
  });

  return { totalCost, presentValue };
}

/**
 * Generer sammendrag for policy-scenario
 */
export function generatePolicyScenarioSummary(
  comparison: MultiYearComparison,
  interventionName: string
): {
  baselineTotalCost: number;
  interventionTotalCost: number;
  totalSaved: number;
  percentSaved: number;
  averageYearlySaving: number;
  finalYearShortageReduction: number;
} {
  const baselineTotalCost = comparison.baseline.reduce(
    (sum, y) => sum + y.economicCost,
    0
  );
  const interventionTotalCost = comparison.withIntervention.reduce(
    (sum, y) => sum + y.economicCost,
    0
  );

  const lastBaseline = comparison.baseline[comparison.baseline.length - 1];
  const lastIntervention =
    comparison.withIntervention[comparison.withIntervention.length - 1];

  return {
    baselineTotalCost,
    interventionTotalCost,
    totalSaved: comparison.totalSaved,
    percentSaved: comparison.percentReduction,
    averageYearlySaving: comparison.totalSaved / comparison.yearsAnalyzed,
    finalYearShortageReduction: lastBaseline
      ? lastBaseline.shortage - (lastIntervention?.shortage || 0)
      : 0,
  };
}
