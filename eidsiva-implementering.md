# Eidsiva Verktøy - Implementeringsplan

## Status-emoji
- ⬜ Ikke startet
- 🔄 Pågår
- ✅ Fullført
- ⏸️ Venter

---

# Fase 1: Grunnlag og beregninger ✅

## 1.1 Datamodell
| Oppgave | Status |
|---------|--------|
| Utvid `eidsivaData.ts` med regionale verdier (11 regioner + Oslo) | ✅ |
| Legg til forbrukseffekt-kategorier fra rapporten | ✅ |
| Legg til leverandør-data struktur | ✅ |
| Legg til bærekraft-data (vannkraft, biokraft, OBIO, Heimdall) | ✅ |
| Legg til `KILDER` konstant med kildehenvisninger | ✅ |
| Opprett `SourceTooltip.tsx` komponent | ✅ |

## 1.2 Beregningsfunksjoner
| Oppgave | Status |
|---------|--------|
| Opprett `welfareConversions.ts` - "i andre ord" konverteringer | ✅ |
| Opprett `rippleCalculations.ts` - 3-effekt beregninger | ✅ |
| Opprett `impactConversions.ts` - energi/CO2/utstyr konverteringer | ✅ |

---

# Fase 2: Verktøy 1 - Regionalt Verdikart

**Inspirasjon**: Rapport side 7-8

## 2.1 Kartkomponent
| Oppgave | Status |
|---------|--------|
| Opprett `RegionMap.tsx` - SVG-kart over Innlandet | ⬜ |
| Implementer 11 klikkbare regioner | ⬜ |
| Legg til Oslo-boks | ⬜ |
| Hover-effekter og fargekoding basert på verdi | ⬜ |

## 2.2 Velferdskalkulator
| Oppgave | Status |
|---------|--------|
| Opprett `WelfareCalculator.tsx` | ⬜ |
| Input-felt for total MNOK | ⬜ |
| Vis konverteringer: sykkelvei, barnehager, sykehjem, lærere, sykepleiere, brannkonstabler | ⬜ |
| Animerte tall-overganger | ⬜ |

## 2.3 Side og integrasjon
| Oppgave | Status |
|---------|--------|
| Opprett `/kunde/[tenantId]/verdikart/page.tsx` | ⬜ |
| Input-panel for regionale verdier | ⬜ |
| Koble kart + kalkulator sammen | ⬜ |

---

# Fase 3: Verktøy 2 - Ringvirknings-kalkulator

**Inspirasjon**: Rapport side 5, 9-10

## 3.1 Direkte effekter panel
| Oppgave | Status |
|---------|--------|
| Opprett `DirectEffectsPanel.tsx` | ⬜ |
| Input: Antall ansatte | ⬜ |
| Input: Sum lønnskostnader | ⬜ |
| Input: Investeringer | ⬜ |
| Input: Skatt og utbytte | ⬜ |

## 3.2 Forbrukseffekter tabell
| Oppgave | Status |
|---------|--------|
| Opprett `ConsumptionBreakdown.tsx` | ⬜ |
| Beregn fra ansatt-input: inntekt etter skatt | ⬜ |
| Kategorier: Sparing, Varekjøp (mat, klær, bolig, møbler) | ⬜ |
| Kategorier: Tjenestekjøp (forsikring, helse, tele, restaurant) | ⬜ |
| Kategorier: Kommunale avgifter, Kultur/fritid | ⬜ |
| "Per dag" og "per virketime" nøkkeltall | ⬜ |

## 3.3 Leverandør-effekter
| Oppgave | Status |
|---------|--------|
| Opprett `SupplierImpact.tsx` | ⬜ |
| Input: Totale innkjøp MNOK | ⬜ |
| Input: Antall leverandører | ⬜ |
| Beregn: Ansatte i leverandørbedrifter | ⬜ |
| Beregn: Bedrifter med avhengighetsforhold | ⬜ |

## 3.4 Dynamisk Sankey
| Oppgave | Status |
|---------|--------|
| Oppdater `EidsivaSankey.tsx` til å ta props | ⬜ |
| Koble til input-verdier | ⬜ |
| Real-time oppdatering ved endringer | ⬜ |

## 3.5 Side og integrasjon
| Oppgave | Status |
|---------|--------|
| Opprett `/kunde/[tenantId]/kalkulator/page.tsx` | ⬜ |
| Layout: Input-paneler venstre, Sankey høyre | ⬜ |
| Nøkkeltall-kort øverst | ⬜ |

---

# Fase 4: Verktøy 3 - Samfunnsbidrag-dashboard

**Inspirasjon**: Rapport side 11, 13-14, 17-20

## 4.1 Kritisk infrastruktur
| Oppgave | Status |
|---------|--------|
| Opprett `CriticalInfrastructure.tsx` | ⬜ |
| Input: Antall sykehus + ansatte | ⬜ |
| Input: Antall brannstasjoner + ansatte | ⬜ |
| Input: Antall militærleire + ansatte | ⬜ |
| Input: Antall politistasjoner + ansatte | ⬜ |
| Visuell fremstilling med ikoner | ⬜ |

## 4.2 Idrettsbidrag - Breddeidrett
| Oppgave | Status |
|---------|--------|
| Opprett `GrassrootsSports.tsx` | ⬜ |
| Input: Total støtte MNOK | ⬜ |
| Fordeling på 5 regioner | ⬜ |
| Vis: Antall lag, medlemmer, støtte per medlem | ⬜ |
| Idretts-ikoner: fotball, håndball, ski, ishockey, turn, etc. | ⬜ |

## 4.3 Idrettsbidrag - Toppidrett
| Oppgave | Status |
|---------|--------|
| Opprett `EliteSports.tsx` | ⬜ |
| Input per lag: Skiskytterforbund, Lillehammer Ishockey, HamKam, Vålerenga, Elverum Håndball, Storhamar Håndball | ⬜ |
| Konverter til utstyr: ski, pucker, fotballer, tøysett, håndballer, sko | ⬜ |
| Lag-logoer og bilder | ⬜ |

## 4.4 Bærekraft - Energiproduksjon
| Oppgave | Status |
|---------|--------|
| Opprett `EnergyProduction.tsx` | ⬜ |
| Input: Vannkraft GWh (via Hafslund) | ⬜ |
| Input: Biokraft GWh | ⬜ |
| Konverter til: Husholdninger, innbyggere, CO2-besparelse | ⬜ |
| Konverter til: Elbilladinger, el-tog km, el-buss km | ⬜ |
| Konverter til: Idrettshaller, sykehus, skoler | ⬜ |

## 4.5 Bærekraft - Showcase prosjekter
| Oppgave | Status |
|---------|--------|
| Opprett `SustainabilityShowcase.tsx` | ⬜ |
| Vålerenga/Intility Arena: Solceller m², kWh/år, batteritimer | ⬜ |
| Heimdall-nevroner: Kapasitetsøkning %, nye husstander, TWh | ⬜ |
| OBIO biokull: Tonn produsert, CO2 bundet, flyturer tilsvarende | ⬜ |

## 4.6 Side og integrasjon
| Oppgave | Status |
|---------|--------|
| Opprett `/kunde/[tenantId]/samfunnsbidrag/page.tsx` | ⬜ |
| Tab-navigasjon: Infrastruktur, Idrett, Bærekraft | ⬜ |
| Responsivt layout | ⬜ |

---

# Fase 5: Navigasjon og polish

## 5.1 Sidebar-oppdatering
| Oppgave | Status |
|---------|--------|
| Legg til "Verdikart" lenke for Eidsiva | ⬜ |
| Legg til "Kalkulator" lenke for Eidsiva | ⬜ |
| Legg til "Samfunnsbidrag" lenke for Eidsiva | ⬜ |
| Tenant-spesifikk navigasjon (kun vises for Eidsiva) | ⬜ |

## 5.2 Dashboard-kobling
| Oppgave | Status |
|---------|--------|
| Legg til hurtiglenker på Eidsiva dashboard | ⬜ |
| Preview-kort for hvert verktøy | ⬜ |

## 5.3 Testing og finpuss
| Oppgave | Status |
|---------|--------|
| Test alle input-felt og beregninger | ⬜ |
| Verifiser tall mot rapporten | ⬜ |
| Responsivt design på mobil/tablet | ⬜ |
| Bygg og deploy | ⬜ |

---

# Tekniske detaljer

## Filstruktur
```
src/
├── app/kunde/[tenantId]/
│   ├── verdikart/page.tsx
│   ├── kalkulator/page.tsx
│   └── samfunnsbidrag/page.tsx
│
├── components/eidsiva/
│   ├── RegionMap.tsx
│   ├── WelfareCalculator.tsx
│   ├── DirectEffectsPanel.tsx
│   ├── ConsumptionBreakdown.tsx
│   ├── SupplierImpact.tsx
│   ├── CriticalInfrastructure.tsx
│   ├── GrassrootsSports.tsx
│   ├── EliteSports.tsx
│   ├── EnergyProduction.tsx
│   └── SustainabilityShowcase.tsx
│
└── lib/eidsiva/
    ├── eidsivaData.ts (utvides)
    ├── welfareConversions.ts
    ├── rippleCalculations.ts
    └── impactConversions.ts
```

## Konverteringsfaktorer (fra SSB/rapporten)
```typescript
// Velferd - kostnad per enhet (NOK)
const WELFARE_COSTS = {
  sykkelVeiPerKm: number,      // Fra SSB
  barnehagePlassPerAr: number,
  sykehjemsPlassPerAr: number,
  larerArslonn: number,
  sykepleierArslonn: number,
  brannkonstabelArslonn: number,
};

// Energi - konverteringsfaktorer
const ENERGY_CONVERSIONS = {
  kWhPerHusholdning: 16000,    // Årlig forbruk
  kWhPerElbillading: 16.3,
  co2PerKWh: number,           // kg CO2 spart vs fossil
};

// Utstyr - priser for idrett
const EQUIPMENT_PRICES = {
  skiPar: number,
  ishockeyPuck: number,
  fotball: number,
  handball: number,
  // etc.
};
```

---

# Rapport-referanser

| Verktøy | Rapport-sider | Nøkkeldata |
|---------|---------------|------------|
| Verdikart | 7-8 | 11 regioner, velferdsbidrag |
| Kalkulator | 5, 9-10 | 3-effektmodell, forbrukstabell, leverandører |
| Samfunnsbidrag | 11, 13-14, 17-20 | Beredskap, idrett, bærekraft |
