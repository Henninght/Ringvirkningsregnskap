# Eidsiva Verktøy - Implementeringsplan

## Status-emoji
- ⬜ Ikke startet
- 🔄 Pågår
- ✅ Fullført
- ⏸️ Venter

---

# Kildehenvisninger - Obligatorisk for alle komponenter

## Krav
Alle tall, beregninger og visualiseringer SKAL ha sporbare kildehenvisninger til rapporten.

### Implementeringskrav
1. **Alle visualiseringer** SKAL ha `SourceTooltip` i header/tittel
2. **Alle beregningsfunksjoner** SKAL eksportere sin kilde via `getKilde()` eller `kilde` property
3. **Alle datakonstanter** SKAL ha `kilde: KILDER.xxx` property

### Tilgjengelige kilder (`KILDER` i eidsivaData.ts)
| Kilde | Side | Seksjon | Fase |
|-------|------|---------|------|
| `ringvirkninger` | 5 | Ringvirkninger og multiplikatoreffekter | 2 |
| `regionaltKart` | 7 | Verditilførsel til lokalsamfunn | 2 |
| `velferdsbidrag` | 8 | Bidrag til offentlig velferd | 2 |
| `ssbVelferd` | 8 | SSB-baserte velferdskostnader | 2 |
| `forbrukseffekter` | 9 | Lokal økonomisk vekst | 3 |
| `leverandorer` | 10 | Bidrag til norsk næringsliv | 3 |
| `kritiskInfrastruktur` | 11 | Samfunnskritiske virksomheter | 4 |
| `breddeidrett` | 13 | Breddeidrett og foreninger | 4 |
| `toppidrett` | 14 | Toppidrett sponsorater | 4 |
| `elviaFondet` | 15 | Elvia-fondet | 4 |
| `fornybarEnergi` | 17 | Fornybar energiproduksjon | 4 |
| `valerenga` | 18 | Enga for målene | 4 |
| `heimdall` | 19 | Heimdall-nevroner | 4 |
| `obio` | 20 | Karbonfangst med biokull | 4 |

## Sjekkliste per komponent

### Fase 2 - Verdikart
| Komponent | SourceTooltip | Kilde brukt | Status |
|-----------|---------------|-------------|--------|
| `RegionMap.tsx` | ✅ | `regionaltKart` | ✅ |
| `WelfareCalculator.tsx` | ✅ | `velferdsbidrag` | ✅ |
| `EidsivaSankey.tsx` | ✅ | `ringvirkninger` | ✅ |
| Verdikart page header | ✅ | `regionaltKart` | ✅ |

### Fase 3 - Ringvirkningskalkulator
| Komponent | SourceTooltip | Kilde | Status |
|-----------|---------------|-------|--------|
| `DirectEffectsPanel.tsx` | ⬜ | `ringvirkninger` | ⬜ |
| `ConsumptionBreakdown.tsx` | ⬜ | `forbrukseffekter` | ⬜ |
| `SupplierImpact.tsx` | ⬜ | `leverandorer` | ⬜ |
| Sankey (dynamisk) | ✅ | `ringvirkninger` | ✅ |

### Fase 4 - Samfunnsbidrag
| Komponent | SourceTooltip | Kilde | Status |
|-----------|---------------|-------|--------|
| `CriticalInfrastructure.tsx` | ⬜ | `kritiskInfrastruktur` | ⬜ |
| `GrassrootsSports.tsx` | ⬜ | `breddeidrett` | ⬜ |
| `EliteSports.tsx` | ⬜ | `toppidrett` | ⬜ |
| `EnergyProduction.tsx` | ⬜ | `fornybarEnergi` | ⬜ |
| `SustainabilityShowcase.tsx` | ⬜ | `valerenga`, `heimdall`, `obio` | ⬜ |

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

# Fase 2: Verktøy 1 - Regionalt Verdikart ✅

**Inspirasjon**: Rapport side 7-8

## 2.1 Kartkomponent
| Oppgave | Status |
|---------|--------|
| Opprett `RegionMap.tsx` - SVG-kart over Innlandet | ✅ |
| Implementer 11 klikkbare regioner | ✅ |
| Legg til Oslo-boks | ✅ |
| Hover-effekter og fargekoding basert på verdi | ✅ |

## 2.2 Velferdskalkulator
| Oppgave | Status |
|---------|--------|
| Opprett `WelfareCalculator.tsx` | ✅ |
| Input-felt for total MNOK | ✅ |
| Vis konverteringer: sykkelvei, barnehager, sykehjem, lærere, sykepleiere, brannkonstabler | ✅ |
| Animerte tall-overganger | ✅ |

## 2.3 Side og integrasjon
| Oppgave | Status |
|---------|--------|
| Opprett `/kunde/eidsiva/verdikart/page.tsx` | ✅ |
| Input-panel for regionale verdier | ✅ |
| Koble kart + kalkulator sammen | ✅ |

---

# Fase 3: Verktøy 2 - Ringvirknings-kalkulator

**Inspirasjon**: Rapport side 5, 9-10

## 3.1 Direkte effekter panel
| Oppgave | Status |
|---------|--------|
| Opprett `DirectEffectsPanel.tsx` | ⬜ |
| **Legg til SourceTooltip med `KILDER.ringvirkninger`** | ⬜ |
| Input: Antall ansatte | ⬜ |
| Input: Sum lønnskostnader | ⬜ |
| Input: Investeringer | ⬜ |
| Input: Skatt og utbytte | ⬜ |

## 3.2 Forbrukseffekter tabell
| Oppgave | Status |
|---------|--------|
| Opprett `ConsumptionBreakdown.tsx` | ⬜ |
| **Legg til SourceTooltip med `KILDER.forbrukseffekter`** | ⬜ |
| Beregn fra ansatt-input: inntekt etter skatt | ⬜ |
| Kategorier: Sparing, Varekjøp (mat, klær, bolig, møbler) | ⬜ |
| Kategorier: Tjenestekjøp (forsikring, helse, tele, restaurant) | ⬜ |
| Kategorier: Kommunale avgifter, Kultur/fritid | ⬜ |
| "Per dag" og "per virketime" nøkkeltall | ⬜ |

## 3.3 Leverandør-effekter
| Oppgave | Status |
|---------|--------|
| Opprett `SupplierImpact.tsx` | ⬜ |
| **Legg til SourceTooltip med `KILDER.leverandorer`** | ⬜ |
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
| **Legg til SourceTooltip med `KILDER.kritiskInfrastruktur`** | ⬜ |
| Input: Antall sykehus + ansatte | ⬜ |
| Input: Antall brannstasjoner + ansatte | ⬜ |
| Input: Antall militærleire + ansatte | ⬜ |
| Input: Antall politistasjoner + ansatte | ⬜ |
| Visuell fremstilling med ikoner | ⬜ |

## 4.2 Idrettsbidrag - Breddeidrett
| Oppgave | Status |
|---------|--------|
| Opprett `GrassrootsSports.tsx` | ⬜ |
| **Legg til SourceTooltip med `KILDER.breddeidrett`** | ⬜ |
| Input: Total støtte MNOK | ⬜ |
| Fordeling på 5 regioner | ⬜ |
| Vis: Antall lag, medlemmer, støtte per medlem | ⬜ |
| Idretts-ikoner: fotball, håndball, ski, ishockey, turn, etc. | ⬜ |

## 4.3 Idrettsbidrag - Toppidrett
| Oppgave | Status |
|---------|--------|
| Opprett `EliteSports.tsx` | ⬜ |
| **Legg til SourceTooltip med `KILDER.toppidrett`** | ⬜ |
| Input per lag: Skiskytterforbund, Lillehammer Ishockey, HamKam, Vålerenga, Elverum Håndball, Storhamar Håndball | ⬜ |
| Konverter til utstyr: ski, pucker, fotballer, tøysett, håndballer, sko | ⬜ |
| Lag-logoer og bilder | ⬜ |

## 4.4 Bærekraft - Energiproduksjon
| Oppgave | Status |
|---------|--------|
| Opprett `EnergyProduction.tsx` | ⬜ |
| **Legg til SourceTooltip med `KILDER.fornybarEnergi`** | ⬜ |
| Input: Vannkraft GWh (via Hafslund) | ⬜ |
| Input: Biokraft GWh | ⬜ |
| Konverter til: Husholdninger, innbyggere, CO2-besparelse | ⬜ |
| Konverter til: Elbilladinger, el-tog km, el-buss km | ⬜ |
| Konverter til: Idrettshaller, sykehus, skoler | ⬜ |

## 4.5 Bærekraft - Showcase prosjekter
| Oppgave | Status |
|---------|--------|
| Opprett `SustainabilityShowcase.tsx` | ⬜ |
| **Legg til SourceTooltip per prosjekt: `valerenga`, `heimdall`, `obio`** | ⬜ |
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
| Legg til "Verdikart" lenke for Eidsiva | ✅ |
| Legg til "Kalkulator" lenke for Eidsiva | ⬜ |
| Legg til "Samfunnsbidrag" lenke for Eidsiva | ⬜ |
| Tenant-spesifikk navigasjon (kun vises for Eidsiva) | ✅ |

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

---

# Forbedringer: Innlandet Regional Map (Design & UX)

**Dato**: 2025-12-02
**Status**: ⬜ Ikke startet
**Estimert tid**: ~3 timer

## Bakgrunn
Bruker-feedback på det regionale verdikartet (verdikart/page.tsx):
1. Oslo-knappen på Innlandet-kartet er forvirrende (fjern fra kart, behold Oslo-fanen)
2. "Hull" i midten av Innlandet-kartet (mangler geografisk kontekst)
3. Kartet føles "alene" uten designelementer rundt
4. Vanskelig å klikke på regionene (små klikk-områder)

## Løsning
Fem koordinerte forbedringer som gjør kartet mer polert, geografisk autentisk, og brukervennlig.

---

## Step 1: Fjern Oslo-knappen fra Innlandet-kartet ⬜

**Mål**: Oslo vises kun når relevant (Oslo-fanen), ikke som forvirrende knapp på Innlandet-kartet.

### Endringer i `src/components/eidsiva/RegionMap.tsx`:

1. **Legg til prop** (linje ~130):
   ```typescript
   interface RegionMapProps {
     // ... eksisterende props
     showOslo?: boolean; // default: true for bakoverkompatibilitet
   }
   ```

2. **Betinget rendering av Oslo** (linje ~368):
   ```typescript
   {showOslo && (
     <g transform="translate(275, 300)">
       {/* Oslo rectangle, icon, label - linjer 368-442 */}
     </g>
   )}
   ```

3. **Oppdater total-beregning** (linje ~184):
   ```typescript
   const totalValue = regionsWithData.reduce((sum, r) => sum + r.verdi, 0)
     + (showOslo ? osloWithData.verdi : 0);
   ```

4. **Oppdater header subtitle** (linje ~205):
   ```typescript
   <p className="text-xs text-slate-400">
     {showOslo ? "Innlandet + Oslo" : "Innlandet"}
   </p>
   ```

### Endringer i `src/app/kunde/eidsiva/verdikart/page.tsx`:

5. **Send showOslo prop** (linje ~690):
   ```typescript
   <RegionMap
     regionData={regionData}
     selectedRegionId={selectedRegion?.id || null}
     onRegionSelect={handleRegionSelect}
     showValues={true}
     showOslo={false}  // ← NY LINJE
   />
   ```

**Testing**:
- [ ] Oslo-knappen skjult når Innlandet-fanen er aktiv
- [ ] Total-beregning ekskluderer Oslo når `showOslo={false}`
- [ ] Oslo-fanen fungerer fortsatt normalt

---

## Step 2: Legg til Mjøsa-innsjø illustrasjon ⬜

**Mål**: Fyll det visuelle "hullet" i kartet med en subtil Mjøsa-illustrasjon.

### I `src/components/eidsiva/RegionMap.tsx`:

**Posisjon**: Etter Innlandet-regioner (etter linje ~315), før labels (før linje ~317)

```typescript
{/* Mjøsa innsjø - dekorativt element i midten */}
<g className="mjosa-lake" opacity="0.6" aria-hidden="true">
  {/* Hovedform - langstrakt nord-sør */}
  <path
    d="M130 170 Q 125 185, 130 200 Q 135 220, 140 235 Q 142 245, 138 250 Q 132 240, 128 230 Q 120 210, 125 190 Q 128 180, 130 170 Z"
    fill="hsl(187, 45%, 88%)"
    stroke="hsl(187, 45%, 80%)"
    strokeWidth="0.5"
    className="pointer-events-none"
  />

  {/* Subtile bølger for tekstur */}
  <path
    d="M130 200 Q 135 202, 138 200 M130 215 Q 135 217, 138 215"
    stroke="hsl(187, 45%, 82%)"
    strokeWidth="0.3"
    fill="none"
    opacity="0.5"
    className="pointer-events-none"
  />
</g>
```

**Design**:
- Farge: Lys petrol-blå (`hsl(187, 45%, 88%)`)
- Opacity: 60% for subtilitet
- Plassering: Mellom Hamar, Lillehammer, og Gjøvik (~sentrum av kartet)
- `pointer-events-none` sikrer at den ikke blokkerer klikk

**Testing**:
- [ ] Mjøsa synlig i midten av kartet
- [ ] Fargen harmonerer med eksisterende petrol-fargepalett
- [ ] Blokkerer ikke interaksjon med regioner
- [ ] Subtil nok til å ikke dominere kartet

---

## Step 3: Legg til geografiske bakgrunnselementer ⬜

**Mål**: Fjell-silhuetter og elver gir geografisk kontekst uten å forstyrre.

### I `src/components/eidsiva/RegionMap.tsx`:

**Posisjon**: Før regions-gruppe (etter linje ~274, før linje ~276)

```typescript
{/* Geografisk bakgrunn - fjell og elver */}
<g className="geographic-background" opacity="0.3">
  {/* Nord-fjell - bak Nord-Gudbrandsdal og Nord-Østerdal */}
  <path
    d="M80 0 L90 15 L100 8 L115 20 L125 5 L140 15 L155 2 L170 18 L180 5 L195 15 L210 8 L225 20 L240 10 L255 20 L255 25 L80 25 Z"
    fill="hsl(187, 15%, 92%)"
    className="pointer-events-none"
  />

  {/* Vest-fjell - bak Valdres */}
  <path
    d="M0 100 L10 115 L15 105 L25 125 L30 110 L35 130 L40 140 L40 200 L0 200 Z"
    fill="hsl(187, 15%, 92%)"
    className="pointer-events-none"
  />

  {/* Gudbrandsdalslågen - elv nord til sør */}
  <path
    d="M120 30 Q 115 60, 110 90 Q 108 120, 115 150 Q 120 170, 130 185"
    stroke="hsl(187, 35%, 82%)"
    strokeWidth="1.5"
    fill="none"
    opacity="0.25"
    className="pointer-events-none"
  />

  {/* Glomma - elv gjennom Østerdal */}
  <path
    d="M200 40 Q 205 80, 210 120 Q 215 160, 218 200 Q 215 230, 210 260"
    stroke="hsl(187, 35%, 82%)"
    strokeWidth="1.2"
    fill="none"
    opacity="0.25"
    className="pointer-events-none"
  />
</g>
```

**Design**:
- Fjell: Veldig lys grå (`hsl(187, 15%, 92%)`), 30% opacity
- Elver: Lys petrol-blå streker, 25% opacity
- Alle elementer `pointer-events-none`
- Plassert i bakgrunnen, bak regioner

**Responsiv** (valgfritt):
```typescript
{/* Enkel versjon for mobil */}
<g className="geographic-background md:hidden" opacity="0.2">
  {/* Forenklede fjell-former */}
</g>

{/* Detaljert versjon for desktop */}
<g className="geographic-background hidden md:block" opacity="0.3">
  {/* Komplette fjell og elver */}
</g>
```

**Testing**:
- [ ] Fjell og elver synlige men subtile
- [ ] Ikke forstyrrer regionenes synlighet
- [ ] Gir geografisk kontekst
- [ ] Fungerer på både mobil og desktop

---

## Step 4: Forbedre visuell ramme ⬜

**Mål**: Polert ramme rundt kartet med indre border og hjørnedetaljer.

### I `src/components/eidsiva/RegionMap.tsx`:

**Erstatt wrapper div** (linje ~222):

```typescript
<div className="relative bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-4 border-2 border-petrol-200 shadow-lg overflow-hidden">
  {/* Indre dekorativ border */}
  <div className="absolute inset-[6px] border border-petrol-100/50 rounded-xl pointer-events-none" />

  {/* Hjørnedetaljer - små petrol-prikker */}
  <div className="absolute top-3 left-3 w-2 h-2 rounded-full bg-petrol-500/20" />
  <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-petrol-500/20" />
  <div className="absolute bottom-3 left-3 w-2 h-2 rounded-full bg-petrol-500/20" />
  <div className="absolute bottom-3 right-3 w-2 h-2 rounded-full bg-petrol-500/20" />

  {/* Eksisterende bakgrunnsmønster */}
  <div className="absolute inset-0 opacity-[0.03]" style={{...}} />

  {/* SVG-innhold */}
  <svg viewBox="0 0 340 380" className="w-full h-auto max-h-[500px]" ...>
    {/* ... */}
  </svg>
</div>
```

**Endringer**:
- `border-slate-200/50` → `border-2 border-petrol-200` (tydeligere, petrol-farget)
- Legg til `shadow-lg` (mer dybde)
- Indre border 6px fra kant (`inset-[6px]`)
- Fire hjørne-aksenter (2x2px petrol-prikker)

**Responsivt**:
```typescript
className="border-[1px] md:border-2"  // Tynnere border på mobil
```

**Testing**:
- [ ] Border synlig og polert
- [ ] Indre border gir lagdelt effekt
- [ ] Hjørnedetaljer synlige men subtile
- [ ] Fungerer på alle skjermstørrelser

---

## Step 5: Forbedre region-klikkbarhet ⬜

**Mål**: Gjør regioner mye lettere å klikke med usynlige utvidede hit-areas.

### I `src/components/eidsiva/RegionMap.tsx`:

**Erstatt region-rendering** (rundt linje ~283):

```typescript
<g key={region.id} className="region-group">
  {/* USYNLIG UTVIDET HIT AREA - lettere å klikke */}
  <path
    d={region.path}
    fill="transparent"
    stroke="transparent"
    strokeWidth="12"
    className="cursor-pointer"
    onMouseEnter={() => setHoveredRegion(region.id)}
    onMouseLeave={() => setHoveredRegion(null)}
    onClick={() => handleRegionClick(region)}
    aria-label={`Velg ${region.navn}`}
  />

  {/* SYNLIG REGION - forbedret hover */}
  <motion.path
    d={region.path}
    fill={fillColor}
    stroke={isSelected ? "var(--petrol-600)" : "white"}
    strokeWidth={isSelected ? 3 : isHovered ? 2.5 : 1.5}
    className="cursor-pointer transition-all duration-100 pointer-events-none"
    style={{
      filter: isSelected || isHovered ? "url(#glow)" : undefined,
    }}
    animate={{
      scale: isHovered && !isSelected ? 1.03 : 1,
    }}
    transition={{ duration: 0.1 }}
  />

  {/* Tomt mønster for regioner uten data */}
  {region.verdi === 0 && (
    <path
      d={region.path}
      fill="url(#emptyPattern)"
      className="pointer-events-none"
    />
  )}
</g>
```

**Forbedringer**:
1. **Usynlig hit area**: 12px stroke-width transparent path som fanger klikk
2. **Tykkere hover stroke**: 1.5 → 2.5px ved hover
3. **Glow på hover**: Ikke bare ved select, også hover
4. **Raskere animasjon**: 0.15s → 0.1s (mer responsiv)
5. **Større scale**: 1.02 → 1.03 (tydeligere feedback)
6. **ARIA-label**: Bedre tilgjengelighet for skjermlesere

**Keyboard support** (valgfritt):
```typescript
<path
  // ... other props
  tabIndex={0}
  role="button"
  onKeyPress={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleRegionClick(region);
    }
  }}
/>
```

**Testing**:
- [ ] Hver region lett å klikke (test alle 10 regioner)
- [ ] Hover-feedback tydelig og rask
- [ ] Ingen forsinkelse i interaksjon
- [ ] Fungerer på touch-enheter (mobil/tablet)
- [ ] Tastaturnavigasjon fungerer (Tab + Enter)

---

## Visuell Designspesifikasjon

### Farger
| Element | Farge | Opacity |
|---------|-------|---------|
| Mjøsa innsjø | `hsl(187, 45%, 88%)` | 60% |
| Fjell-silhuetter | `hsl(187, 15%, 92%)` | 30% |
| Elver | `hsl(187, 35%, 82%)` | 25% |
| Ramme (ytre) | `border-petrol-200` | 100% |
| Ramme (indre) | `border-petrol-100/50` | 50% |
| Hjørnedetaljer | `bg-petrol-500/20` | 20% |

### Lag-rekkefølge (bunn til topp)
1. Bakgrunnsmønster (eksisterende kryss-mønster)
2. Geografiske elementer (fjell, elver)
3. Mjøsa innsjø
4. Innlandet-regioner (usynlige hit areas + synlige paths)
5. Region-labels (ved hover)
6. Kompass

### Animasjoner
- Hover scale: `1.00 → 1.03` (duration: 0.1s)
- Stroke-width: `1.5 → 2.5` (ved hover)
- Glow filter: Fade inn 0.1s

---

## Testing-sjekkliste

### Funksjonalitet
- [ ] Oslo skjult på Innlandet-fanen, synlig på Oslo-fanen
- [ ] Mjøsa posisjonert riktig i midten
- [ ] Geografiske elementer synlige men subtile
- [ ] Ramme polert med alle detaljer
- [ ] Alle 10 regioner lett klikkbare

### Interaksjon
- [ ] Hover-states responsive (<100ms delay)
- [ ] Klikk fungerer på første forsøk (hver region)
- [ ] Touch fungerer på mobil/tablet
- [ ] Keyboard-navigasjon (Tab, Enter)

### Visuelt
- [ ] Farger harmonerer med eksisterende petrol/sage palett
- [ ] Ingen elementer overlapper utilsiktet
- [ ] Mjøsa og geografiske elementer ikke for dominerende
- [ ] Ramme gir profesjonelt, polert inntrykk

### Responsivt
- [ ] Mobil (<768px): Enklere fjell, tynnere border
- [ ] Tablet (768-1024px): Full detalj
- [ ] Desktop (>1024px): Full detalj

### Tilgjengelighet
- [ ] ARIA-labels på regioner
- [ ] Skjermleser annonserer regionnavn
- [ ] Farge-kontrast møter WCAG AA (4.5:1)
- [ ] Tastaturnavigasjon fungerer komplett

### Ytelse
- [ ] Ingen merkbar forsinkelse ved hover
- [ ] SVG renderer smooth (<60fps)
- [ ] Ingen layout shift ved lasting

---

## Rollback-strategi

Hver forbedring kan rulles tilbake uavhengig:

1. **Oslo-fjerning**: Sett `showOslo={true}` i page.tsx
2. **Mjøsa**: Slett `<g className="mjosa-lake">` gruppe
3. **Geografiske elementer**: Slett `<g className="geographic-background">` gruppe
4. **Ramme**: Reverter wrapper div classes til original
5. **Klikkbarhet**: Fjern usynlig hit area layer, reverter hover-states

---

## Estimert tid

| Steg | Tid |
|------|-----|
| 1. Oslo-fjerning | 15 min |
| 2. Mjøsa-illustrasjon | 30 min |
| 3. Geografiske elementer | 45 min |
| 4. Visuell ramme | 20 min |
| 5. Klikkbarhet | 45 min |
| Testing & finpuss | 30 min |
| **Total** | **~3 timer** |

---

## Notater

- Alle endringer er Eidsiva-spesifikke (ingen NSF-påvirkning)
- Opprettholder eksisterende funksjonalitet (tabs, valg, data)
- Forbedrer UX uten breaking changes
- Design følger petrol/sage fargepalett
- Tilgjengelighet forbedret (ARIA, keyboard)
- Kan implementeres trinnvis (hver step uavhengig)
