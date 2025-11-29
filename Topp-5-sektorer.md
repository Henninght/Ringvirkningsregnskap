# Topp 5 Sektorer - Template-spesifikasjoner for Ringvirkningsregnskap

## Sammendrag

Dette dokumentet beskriver hvordan ringvirkningsapplikasjonen kan tilpasses de fem viktigste sektorene i Norge, basert på BNP-bidrag og sysselsetting. Målet er å beholde en konsistent brukeropplevelse på tvers av sektorer, men tilpasse KPIer, beregninger og visualiseringer til hver sektors unike karakteristikker.

---

## De 5 Prioriterte Sektorene

| # | Sektor | BNP-bidrag | Sysselsetting | Kilde |
|---|--------|-----------|---------------|-------|
| 1 | **Helse og omsorg** | ~12% av fastlands-BNP | 1 av 5 jobber (~640 000) | [SSB](https://www.ssb.no/nasjonalregnskap-og-konjunkturer/faktaside/norsk-naeringsliv) |
| 2 | **Olje og gass** | 25% av total BNP | ~185 000 (direkte/indirekte) | [SSB](https://www.ssb.no/energi-og-industri/faktaside/olje-og-energi) |
| 3 | **Varehandel** | 3. største næring | 377 400 (13% av total) | [NHO Service og Handel](https://www.nhosh.no/tall-og-fakta/tall-og-trender/tall-og-trender-2024/handel24/) |
| 4 | **Bygg og anlegg** | ~6% av fastlands-BNP | ~250 000 | [BNL](https://www.bnl.no/tall-og-fakta/) |
| 5 | **Sjømat (fiskeri/oppdrett)** | 175 mrd eksportverdi | ~30 000 direkte | [Norges sjømatråd](https://www.seafood.no/markedsinnsikt/nokkeltall/) |

---

## 1. Helse og Omsorg (Nåværende NSF-template)

### Sektorbeskrivelse
Norges største sektor målt i sysselsetting. Fokus på **beredskap og samfunnsverdi** fremfor profitt.

### Bransje-spesifikke KPIer

| KPI | Beskrivelse | Formel/Kilde |
|-----|-------------|--------------|
| **Dekningsgrad** | Sykepleiere per 1000 innbyggere | `ansatte / (befolkning / 1000)` |
| **Vikarpremie** | Merkostnad ved vikarbruk vs. fast ansatte | `(vikarkostnad - fastansattkostnad) / fastansattkostnad` |
| **Sykefravær** | Prosent av arbeidstid tapt til fravær | 8,2% bransjegjennomsnitt ([SSB](https://www.ssb.no/arbeid-og-lonn/statistikk/sykefravaer)) |
| **Stillingsbrøk** | Andel heltid vs. deltid | Viktig for reell kapasitet |
| **Turnover** | Årlig utskifting av personell | Koster ~150% av årslønn å erstatte |

### Ringvirkningsmultiplikatorer (forslag)
- **Indirekte**: 0.40-0.50 (moderat leverandørkjede)
- **Indusert**: 0.35-0.45 (høy sysselsetting, moderat lønn)

### Spesifikke visualiseringer
- Kommunekart med dekningsgrad
- Aldersfordeling av personell
- Sammenligning mot nasjonale normer

### Regnskapsposter å fremheve
- Lønnskostnader (dominerende)
- Vikarkostnader
- Opplæringskostnader
- Pensjonskostnader

---

## 2. Olje og Gass

### Sektorbeskrivelse
Norges økonomisk viktigste næring, men med avtagende fremtid. Fokus på **verdiskaping, energiomstilling og HMS**.

### Bransje-spesifikke KPIer

| KPI | Beskrivelse | Formel/Kilde |
|-----|-------------|--------------|
| **Verdiskaping per ansatt** | Produktivitetsmål | `bruttoprodukt / ansatte` (høyest i Norge) |
| **HMS-indikator** | Skader per million arbeidstimer | Lovpålagt rapportering |
| **CO₂-utslipp** | Tonn CO₂-ekvivalenter | 11,0 mill. tonn i 2024 ([Miljødirektoratet](https://www.miljodirektoratet.no/ansvarsomrader/klima/)) |
| **Utslippsintensitet** | CO₂ per produsert enhet | `utslipp / fat oljeekvivalenter` |
| **Norsk leverandørandel** | Andel innkjøp fra norske leverandører | Viktig for ringvirkninger |
| **Reserve Replacement Ratio** | Erstatning av utvunnede ressurser | Langsiktig bærekraft |

### Ringvirkningsmultiplikatorer (forslag)
- **Indirekte**: 0.70-0.90 (omfattende leverandørkjede)
- **Indusert**: 0.25-0.35 (høye lønninger, men færre ansatte)

### Spesifikke visualiseringer
- Geografisk fordeling offshore/onshore
- Leverandørkjede-diagram (Tier 1, 2, 3)
- Utslipps-tidslinje og fremskrivning
- Omstillingsindikator (grønne investeringer)

### Regnskapsposter å fremheve
- Driftsresultat (ofte svært høyt)
- Investeringer (CAPEX)
- Leverandørkostnader
- Skatter og avgifter til staten
- Miljøavsetninger

---

## 3. Varehandel

### Sektorbeskrivelse
Norges nest største arbeidsgiver. Fokus på **sysselsetting, lokaløkonomi og forbrukerverdi**.

### Bransje-spesifikke KPIer

| KPI | Beskrivelse | Formel/Kilde |
|-----|-------------|--------------|
| **Omsetning per ansatt** | Produktivitetsmål | `omsetning / ansatte` |
| **Driftsmargin** | Lønnsomhet | 3-5% typisk for bransjen |
| **Omsetning per m²** | Butikkeffektivitet | `omsetning / butikkareal` |
| **Netthandelsandel** | Digital vs. fysisk | Vokser 13.9% årlig ([SSB](https://www.ssb.no/varehandel-og-tjenesteyting/varehandel/statistikk/omsetning-i-varehandel)) |
| **Varesvinn** | Tap av varer | Prosent av omsetning |
| **Kundefrekvens** | Antall kunder per tidsenhet | Indikator for lokaløkonomi |

### Ringvirkningsmultiplikatorer (forslag)
- **Indirekte**: 0.30-0.45 (mye import, kortere verdikjeder)
- **Indusert**: 0.40-0.50 (mange ansatte, moderat lønn)

### Spesifikke visualiseringer
- Omsetning per region/kommune
- Sesongvariasjon (jul, påske, etc.)
- Sammenligning fysisk vs. netthandel
- Bransjemiks (dagligvare, klær, elektronikk)

### Regnskapsposter å fremheve
- Varekostnad
- Lønnskostnader
- Husleie/lokalkostnader
- Markedsføringskostnader
- Svinn og ukurans

---

## 4. Bygg og Anlegg

### Sektorbeskrivelse
Kritisk for infrastruktur og boligbygging. Fokus på **lokal sysselsetting, produktivitet og prosjektøkonomi**.

### Bransje-spesifikke KPIer

| KPI | Beskrivelse | Formel/Kilde |
|-----|-------------|--------------|
| **Produktivitet** | Verdiskaping per timeverk | Falt 13% siden 2000 ([SSB](https://www.ssb.no/bygg-bolig-og-eiendom/artikler-og-publikasjoner/produktivitsfall-i-bygg-og-anlegg)) |
| **Driftsmargin** | Lønnsomhet | 3,3% gjennomsnitt (lavt) |
| **Ordrebok/Ordrereserve** | Fremtidig arbeidsmengde | Måneder med sikret arbeid |
| **Lærlingsandel** | Andel lærlinger av totalt ansatte | Bransjekrav |
| **HMS-score** | Skader og avvik | Viktig i høyrisikobransje |
| **Andel utenlandsk arbeidskraft** | Importert arbeidskraft | Påvirker lokale ringvirkninger |

### Ringvirkningsmultiplikatorer (forslag)
- **Indirekte**: 0.55-0.70 (materialleverandører, underentreprenører)
- **Indusert**: 0.35-0.45 (høy sysselsetting, varierende lønn)

### Spesifikke visualiseringer
- Prosjektkart (geografisk fordeling)
- Verdikjede-diagram (byggherre → hovedentreprenør → UE)
- Produktivitetsutvikling over tid
- Segmentfordeling (bolig, næring, anlegg, rehabilitering)

### Regnskapsposter å fremheve
- Materialkostnader
- Underentreprenørkostnader
- Lønnskostnader
- Garantiavsetninger
- Prosjektspesifikke kostnader

---

## 5. Sjømat (Fiskeri og Oppdrett)

### Sektorbeskrivelse
Norges nest største eksportnæring. Fokus på **eksportverdi, bærekraft og kystsamfunn**.

### Bransje-spesifikke KPIer

| KPI | Beskrivelse | Formel/Kilde |
|-----|-------------|--------------|
| **Eksportverdi** | Verdi av eksportert sjømat | 175,4 mrd NOK i 2024 ([Sjømatrådet](https://www.seafood.no/aktuelt/nyheter/2024-ble-tidenes-beste-ar-for-norsk-sjomateksport/)) |
| **Produksjonskost per kg** | Effektivitet | Varierer 40-70 kr/kg laks |
| **Dødelighet (fisk)** | Tap i produksjon | Prosent per generasjon |
| **Bærekraftsindeks** | Miljøpåvirkning | Fôrfaktor, rømming, lus |
| **Kvoteutnyttelse** | Fangst vs. tildelt kvote | Prosent |
| **Lokalandel innkjøp** | Norske vs. utenlandske leverandører | Påvirker ringvirkninger |

### Ringvirkningsmultiplikatorer (forslag)
- **Indirekte**: 0.60-0.80 (teknologi, fôr, serviceleverandører)
- **Indusert**: 0.30-0.40 (færre ansatte, men viktig for kystsamfunn)

### Spesifikke visualiseringer
- Kystsamfunns-kart med lokaliteter
- Eksportmarkeder (land)
- Verdikjede fra smolt til marked
- Prisutvikling lakseindeks

### Regnskapsposter å fremheve
- Fôrkostnader (største kostnadspost)
- Smolt/yngelkostnader
- Slakte- og foredlingskostnader
- Transportkostnader
- Konsesjonsavgifter og grunnrenteskatt

---

## Felles UI-struktur for alle Templates

### Dashboard-layout (identisk på tvers)
```
┌─────────────────────────────────────────────────────────────┐
│  HEADER: Organisasjonsnavn + Sektor-ikon + Periode          │
├─────────────┬───────────────────────────────┬───────────────┤
│             │                               │               │
│  SIDEBAR    │    HOVEDINNHOLD               │   INSIGHTS    │
│  - Nav      │    - KPI-kort (4 stk)         │   - AI-story  │
│  - Filter   │    - Sankey-diagram           │   - Nøkkel-   │
│  - Sektor-  │    - Sektor-spesifikk viz     │     funn      │
│    velger   │    - Tabell/detaljer          │   - Trend     │
│             │                               │               │
├─────────────┴───────────────────────────────┴───────────────┤
│  FOOTER: Kilder + Sist oppdatert + Eksport                  │
└─────────────────────────────────────────────────────────────┘
```

### Dynamiske elementer per sektor

| Element | Tilpasning |
|---------|------------|
| **Fargeskjema** | Sektor-assosiert farge (helse=blå, olje=gul, etc.) |
| **KPI-kort** | 4 mest relevante KPIer per sektor |
| **Sankey-kategorier** | Tilpassede noder for verdikjeden |
| **Kart-visning** | Geografisk relevans (offshore, kommuner, kyst) |
| **Prompt-templates** | AI-genererte historier tilpasset sektoren |

---

## Implementasjonsplan

### Fase 1: Infrastruktur (estimat: 1-2 sprinter)
- [ ] Opprette `SectorConfig` type med alle sektorspesifikke innstillinger
- [ ] Utvide `RippleConfig` med sektorspesifikke multiplikatorer
- [ ] Bygge sektorvelger-komponent i sidebar
- [ ] Opprette sektor-spesifikke fargeskjemaer

### Fase 2: Helse-template refinement (baseline)
- [ ] Ferdigstille alle helse-KPIer som allerede er planlagt
- [ ] Dokumentere som "referanse-template"

### Fase 3: Bygg og anlegg (andre prioritet)
- [ ] Stor sektor med dokumentert ringvirkningsanalyse-metodikk
- [ ] God tilgang til offentlige nøkkeltall
- [ ] Lavere kompleksitet enn olje/gass

### Fase 4: Varehandel
- [ ] Mange SMBer som målgruppe
- [ ] Enklere verdikjede å visualisere

### Fase 5: Sjømat
- [ ] Viktig for distriktene
- [ ] God datatilgang via Fiskeridirektoratet

### Fase 6: Olje og gass
- [ ] Mest kompleks (offshore, leverandørkjede, utslipp)
- [ ] Krever spesialiserte datakilder

---

## Datakilder per Sektor

| Sektor | Primærkilder |
|--------|--------------|
| **Helse** | SSB, Helsedirektoratet, KS, NAV |
| **Olje/gass** | SSB, Norsk Petroleum, Miljødirektoratet |
| **Varehandel** | SSB, Virke, NHO Service og Handel |
| **Bygg/anlegg** | SSB, BNL, Prognosesenteret |
| **Sjømat** | Norges sjømatråd, Fiskeridirektoratet, SSB |

---

## Tekniske Endringer i Kodebasen

### Nye typer (`/types/sector.ts`)
```typescript
type SectorType = 'health' | 'oil_gas' | 'retail' | 'construction' | 'seafood';

interface SectorConfig {
  id: SectorType;
  name: string;
  color: string;
  icon: string;
  kpis: SectorKPI[];
  multipliers: {
    indirect: { min: number; max: number; default: number };
    induced: { min: number; max: number; default: number };
  };
  sankeyCategories: SankeyCategory[];
  mapType: 'municipality' | 'offshore' | 'coastal';
  promptTemplates: Record<StoryType, string>;
}
```

### Utvidelse av eksisterende komponenter
- `SankeyDiagram`: Dynamiske noder basert på sektor
- `MunicipalityMap`: Støtte for offshore-visning og kystlinje
- `KPICard`: Sektorspesifikke ikoner og formater
- `ScenarioSimulator`: Sektorspesifikke scenarioer

---

## Konklusjon

Ved å implementere disse fem sektor-templates kan ringvirkningsapplikasjonen:

1. **Skalere** til et bredere marked utover NSF/helse
2. **Beholde konsistens** i brukeropplevelse og navigasjon
3. **Tilby verdi** gjennom sektorspesifikke innsikter
4. **Differensiere** fra generiske økonomiske verktøy

Neste steg er å starte med infrastruktur for sektorhåndtering, deretter iterativt bygge ut hver sektor med utgangspunkt i helse-templaten som allerede er påbegynt.

---

## Kilder

- [SSB - Norsk næringsliv](https://www.ssb.no/nasjonalregnskap-og-konjunkturer/faktaside/norsk-naeringsliv)
- [SSB - Olje og energi](https://www.ssb.no/energi-og-industri/faktaside/olje-og-energi)
- [Wikipedia - Næringslivet i Norge](https://no.wikipedia.org/wiki/N%C3%A6ringslivet_i_Norge)
- [SNL - Næringsliv i Norge](https://snl.no/n%C3%A6ringsliv_i_Norge)
- [NHO Service og Handel - Tall og Trender 2024](https://www.nhosh.no/tall-og-fakta/tall-og-trender/tall-og-trender-2024/handel24/)
- [BNL - Tall og fakta](https://www.bnl.no/tall-og-fakta/)
- [Norges sjømatråd - Nøkkeltall](https://www.seafood.no/markedsinnsikt/nokkeltall/)
- [SSB - Sykefravær](https://www.ssb.no/arbeid-og-lonn/statistikk/sykefravaer)
- [Miljødirektoratet - Utslipp](https://www.miljodirektoratet.no/ansvarsomrader/klima/klimagasser-utslippstall-regnskap/)
- [TØI - Ringvirkningsanalyser](https://www.toi.no/regional-utvikling-og-reiseliv/ringvirkningsanalyser/)
- [Vista Analyse - VISTA VIRKNING](https://vista-analyse.no/no/tjenester/modeller-og-databaser/vista-analyses-ringvirkningsmodell/)