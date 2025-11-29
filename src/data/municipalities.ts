import { Municipality } from "@/types/ripple";

// Mock-data for norske kommuner med sykepleierdata
// I produksjon vil dette komme fra Firebase/API
export const municipalityData: Municipality[] = [
  // Oslo og Viken
  {
    id: "0301",
    name: "Oslo",
    county: "Oslo",
    population: 709037,
    employees: 450,
    nurses: 8500,
    coverageRatio: 12.0,
    coordinates: { lat: 59.9139, lng: 10.7522 },
  },
  {
    id: "3001",
    name: "Halden",
    county: "Viken",
    population: 31573,
    employees: 25,
    nurses: 380,
    coverageRatio: 12.0,
    coordinates: { lat: 59.1244, lng: 11.3875 },
  },
  {
    id: "3002",
    name: "Moss",
    county: "Viken",
    population: 50290,
    employees: 35,
    nurses: 620,
    coverageRatio: 12.3,
    coordinates: { lat: 59.4340, lng: 10.6589 },
  },
  {
    id: "3003",
    name: "Sarpsborg",
    county: "Viken",
    population: 57372,
    employees: 40,
    nurses: 680,
    coverageRatio: 11.9,
    coordinates: { lat: 59.2833, lng: 11.1097 },
  },
  {
    id: "3004",
    name: "Fredrikstad",
    county: "Viken",
    population: 83193,
    employees: 55,
    nurses: 1020,
    coverageRatio: 12.3,
    coordinates: { lat: 59.2181, lng: 10.9298 },
  },
  {
    id: "3005",
    name: "Drammen",
    county: "Viken",
    population: 101859,
    employees: 70,
    nurses: 1280,
    coverageRatio: 12.6,
    coordinates: { lat: 59.7439, lng: 10.2045 },
  },
  {
    id: "3024",
    name: "Bærum",
    county: "Viken",
    population: 128895,
    employees: 85,
    nurses: 1650,
    coverageRatio: 12.8,
    coordinates: { lat: 59.8945, lng: 10.5245 },
  },
  {
    id: "3025",
    name: "Asker",
    county: "Viken",
    population: 94830,
    employees: 65,
    nurses: 1200,
    coverageRatio: 12.7,
    coordinates: { lat: 59.8333, lng: 10.4333 },
  },
  {
    id: "3030",
    name: "Lillestrøm",
    county: "Viken",
    population: 88278,
    employees: 60,
    nurses: 1100,
    coverageRatio: 12.5,
    coordinates: { lat: 59.9561, lng: 11.0494 },
  },

  // Innlandet
  {
    id: "3401",
    name: "Kongsvinger",
    county: "Innlandet",
    population: 17925,
    employees: 15,
    nurses: 220,
    coverageRatio: 12.3,
    coordinates: { lat: 60.1903, lng: 12.0036 },
  },
  {
    id: "3403",
    name: "Hamar",
    county: "Innlandet",
    population: 32062,
    employees: 25,
    nurses: 420,
    coverageRatio: 13.1,
    coordinates: { lat: 60.7945, lng: 11.0680 },
  },
  {
    id: "3405",
    name: "Lillehammer",
    county: "Innlandet",
    population: 28467,
    employees: 22,
    nurses: 380,
    coverageRatio: 13.3,
    coordinates: { lat: 61.1153, lng: 10.4662 },
  },
  {
    id: "3407",
    name: "Gjøvik",
    county: "Innlandet",
    population: 30560,
    employees: 24,
    nurses: 400,
    coverageRatio: 13.1,
    coordinates: { lat: 60.7957, lng: 10.6916 },
  },

  // Vestfold og Telemark
  {
    id: "3803",
    name: "Tønsberg",
    county: "Vestfold og Telemark",
    population: 57086,
    employees: 40,
    nurses: 720,
    coverageRatio: 12.6,
    coordinates: { lat: 59.2676, lng: 10.4076 },
  },
  {
    id: "3804",
    name: "Sandefjord",
    county: "Vestfold og Telemark",
    population: 66507,
    employees: 45,
    nurses: 840,
    coverageRatio: 12.6,
    coordinates: { lat: 59.1314, lng: 10.2167 },
  },
  {
    id: "3805",
    name: "Larvik",
    county: "Vestfold og Telemark",
    population: 47465,
    employees: 32,
    nurses: 580,
    coverageRatio: 12.2,
    coordinates: { lat: 59.0530, lng: 10.0272 },
  },
  {
    id: "3806",
    name: "Porsgrunn",
    county: "Vestfold og Telemark",
    population: 36624,
    employees: 28,
    nurses: 460,
    coverageRatio: 12.6,
    coordinates: { lat: 59.1406, lng: 9.6560 },
  },
  {
    id: "3807",
    name: "Skien",
    county: "Vestfold og Telemark",
    population: 55513,
    employees: 38,
    nurses: 700,
    coverageRatio: 12.6,
    coordinates: { lat: 59.2097, lng: 9.6089 },
  },

  // Agder
  {
    id: "4201",
    name: "Risør",
    county: "Agder",
    population: 6890,
    employees: 8,
    nurses: 85,
    coverageRatio: 12.3,
    coordinates: { lat: 58.7230, lng: 9.2282 },
  },
  {
    id: "4203",
    name: "Arendal",
    county: "Agder",
    population: 45509,
    employees: 32,
    nurses: 580,
    coverageRatio: 12.7,
    coordinates: { lat: 58.4611, lng: 8.7723 },
  },
  {
    id: "4204",
    name: "Kristiansand",
    county: "Agder",
    population: 112538,
    employees: 75,
    nurses: 1450,
    coverageRatio: 12.9,
    coordinates: { lat: 58.1599, lng: 8.0182 },
  },

  // Rogaland
  {
    id: "1101",
    name: "Eigersund",
    county: "Rogaland",
    population: 14953,
    employees: 12,
    nurses: 185,
    coverageRatio: 12.4,
    coordinates: { lat: 58.4531, lng: 6.0000 },
  },
  {
    id: "1103",
    name: "Stavanger",
    county: "Rogaland",
    population: 144147,
    employees: 95,
    nurses: 1850,
    coverageRatio: 12.8,
    coordinates: { lat: 58.9700, lng: 5.7331 },
  },
  {
    id: "1106",
    name: "Haugesund",
    county: "Rogaland",
    population: 37444,
    employees: 28,
    nurses: 480,
    coverageRatio: 12.8,
    coordinates: { lat: 59.4138, lng: 5.2680 },
  },
  {
    id: "1108",
    name: "Sandnes",
    county: "Rogaland",
    population: 80970,
    employees: 55,
    nurses: 1020,
    coverageRatio: 12.6,
    coordinates: { lat: 58.8510, lng: 5.7352 },
  },

  // Vestland
  {
    id: "4601",
    name: "Bergen",
    county: "Vestland",
    population: 286930,
    employees: 190,
    nurses: 3700,
    coverageRatio: 12.9,
    coordinates: { lat: 60.3913, lng: 5.3221 },
  },
  {
    id: "4602",
    name: "Kinn",
    county: "Vestland",
    population: 17169,
    employees: 14,
    nurses: 215,
    coverageRatio: 12.5,
    coordinates: { lat: 61.5997, lng: 5.0320 },
  },
  {
    id: "4612",
    name: "Askøy",
    county: "Vestland",
    population: 29888,
    employees: 22,
    nurses: 370,
    coverageRatio: 12.4,
    coordinates: { lat: 60.4711, lng: 5.1728 },
  },
  {
    id: "4617",
    name: "Ålesund",
    county: "Møre og Romsdal",
    population: 66258,
    employees: 45,
    nurses: 850,
    coverageRatio: 12.8,
    coordinates: { lat: 62.4722, lng: 6.1495 },
  },

  // Trøndelag
  {
    id: "5001",
    name: "Trondheim",
    county: "Trøndelag",
    population: 210496,
    employees: 140,
    nurses: 2750,
    coverageRatio: 13.1,
    coordinates: { lat: 63.4305, lng: 10.3951 },
  },
  {
    id: "5006",
    name: "Steinkjer",
    county: "Trøndelag",
    population: 24357,
    employees: 18,
    nurses: 320,
    coverageRatio: 13.1,
    coordinates: { lat: 64.0150, lng: 11.4953 },
  },
  {
    id: "5014",
    name: "Namsos",
    county: "Trøndelag",
    population: 15027,
    employees: 12,
    nurses: 200,
    coverageRatio: 13.3,
    coordinates: { lat: 64.4668, lng: 11.4953 },
  },
  {
    id: "5028",
    name: "Orkland",
    county: "Trøndelag",
    population: 18558,
    employees: 14,
    nurses: 240,
    coverageRatio: 12.9,
    coordinates: { lat: 63.3000, lng: 9.8500 },
  },

  // Nordland
  {
    id: "1804",
    name: "Bodø",
    county: "Nordland",
    population: 52803,
    employees: 38,
    nurses: 720,
    coverageRatio: 13.6,
    coordinates: { lat: 67.2804, lng: 14.4049 },
  },
  {
    id: "1806",
    name: "Narvik",
    county: "Nordland",
    population: 21790,
    employees: 16,
    nurses: 300,
    coverageRatio: 13.8,
    coordinates: { lat: 68.4385, lng: 17.4272 },
  },
  {
    id: "1820",
    name: "Alstahaug",
    county: "Nordland",
    population: 7400,
    employees: 6,
    nurses: 100,
    coverageRatio: 13.5,
    coordinates: { lat: 65.8667, lng: 12.4833 },
  },
  {
    id: "1833",
    name: "Rana",
    county: "Nordland",
    population: 26277,
    employees: 20,
    nurses: 360,
    coverageRatio: 13.7,
    coordinates: { lat: 66.3167, lng: 14.1500 },
  },

  // Troms og Finnmark
  {
    id: "5401",
    name: "Tromsø",
    county: "Troms og Finnmark",
    population: 77544,
    employees: 55,
    nurses: 1100,
    coverageRatio: 14.2,
    coordinates: { lat: 69.6489, lng: 18.9551 },
  },
  {
    id: "5402",
    name: "Harstad",
    county: "Troms og Finnmark",
    population: 24703,
    employees: 18,
    nurses: 350,
    coverageRatio: 14.2,
    coordinates: { lat: 68.7983, lng: 16.5417 },
  },
  {
    id: "5403",
    name: "Alta",
    county: "Troms og Finnmark",
    population: 21065,
    employees: 16,
    nurses: 300,
    coverageRatio: 14.2,
    coordinates: { lat: 69.9689, lng: 23.2716 },
  },
  {
    id: "5404",
    name: "Vardø",
    county: "Troms og Finnmark",
    population: 2025,
    employees: 3,
    nurses: 30,
    coverageRatio: 14.8,
    coordinates: { lat: 70.3705, lng: 31.1131 },
  },
  {
    id: "5405",
    name: "Hammerfest",
    county: "Troms og Finnmark",
    population: 11388,
    employees: 9,
    nurses: 165,
    coverageRatio: 14.5,
    coordinates: { lat: 70.6634, lng: 23.6821 },
  },
  {
    id: "5406",
    name: "Kirkenes (Sør-Varanger)",
    county: "Troms og Finnmark",
    population: 10158,
    employees: 8,
    nurses: 150,
    coverageRatio: 14.8,
    coordinates: { lat: 69.7274, lng: 30.0454 },
  },
];

// Hjelpefunksjoner for kommunedata
export function getMunicipalityById(id: string): Municipality | undefined {
  return municipalityData.find((m) => m.id === id);
}

export function getMunicipalitiesByCounty(county: string): Municipality[] {
  return municipalityData.filter((m) => m.county === county);
}

export function getCounties(): string[] {
  return Array.from(new Set(municipalityData.map((m) => m.county)));
}

export function getTotalEmployees(): number {
  return municipalityData.reduce((sum, m) => sum + m.employees, 0);
}

export function getTotalNurses(): number {
  return municipalityData.reduce((sum, m) => sum + (m.nurses || 0), 0);
}

export function getAverageCoverage(): number {
  const withCoverage = municipalityData.filter((m) => m.coverageRatio);
  if (withCoverage.length === 0) return 0;
  return (
    withCoverage.reduce((sum, m) => sum + (m.coverageRatio || 0), 0) /
    withCoverage.length
  );
}

// Beregn intensitet for varmekart (0-1)
export function calculateHeatmapIntensity(
  municipality: Municipality,
  metric: "employees" | "nurses" | "coverage"
): number {
  const allValues = municipalityData.map((m) => {
    switch (metric) {
      case "employees":
        return m.employees;
      case "nurses":
        return m.nurses || 0;
      case "coverage":
        return m.coverageRatio || 0;
    }
  });

  const max = Math.max(...allValues);
  const min = Math.min(...allValues);

  if (max === min) return 0.5;

  const value =
    metric === "employees"
      ? municipality.employees
      : metric === "nurses"
      ? municipality.nurses || 0
      : municipality.coverageRatio || 0;

  return (value - min) / (max - min);
}

// Fargeskala for varmekart - NSF Petrol palette
export function getHeatmapColor(intensity: number): string {
  // Fra lys petrol til mork petrol
  const colors = [
    "#f0f7f7", // 0.0 - veldig lys
    "#daeaeb", // 0.2
    "#b8d8da", // 0.4
    "#8bbfc3", // 0.6
    "#5a9fa6", // 0.8
    "#3d838b", // 1.0 - mork petrol
  ];

  const index = Math.min(Math.floor(intensity * (colors.length - 1)), colors.length - 1);
  return colors[index];
}
