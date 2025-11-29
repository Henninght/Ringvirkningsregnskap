# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Dashboard for visualizing socioeconomic ripple effects ("ringvirkninger") for the Norwegian Nurses' Organisation (NSF). Translates economic data into compelling stories about societal value, focusing on **preparedness** rather than profitability.

## Tech Stack

- Next.js 14 (App Router) + TypeScript + TailwindCSS
- Firebase (Firestore, Auth, Storage)
- Claude API for AI features
- Nivo (Sankey diagrams), React-Leaflet (maps), Recharts

## Commands

```bash
npm run dev                  # Development server
npm run build                # Production build
npm run firebase:emulators   # Local Firebase emulators
```

## Architecture

```
/app              - Next.js pages and API routes
/components       - React components
/lib              - Business logic, Firebase, calculations
/types            - TypeScript types
```

## Domain Logic

### Ripple Effect Calculations

Three levels of economic impact:
1. **Direct** - Internal value creation (wages + operating result)
2. **Indirect** - Supplier purchases create jobs elsewhere
3. **Induced** - Employee consumption in local economy

Formulas (configurable via admin panel):
- Value creation = Wages + Operating result
- Indirect effect = Direct × multiplier (default: 0.5)
- Induced effect = Direct × multiplier (default: 0.3)

### NSF-Specific Metrics

- Coverage ratio = Nurses / (Population / 1000)
- Agency premium = Agency cost / Equivalent permanent cost

## Conventions

- Norwegian in UI text, English in code
- Components: PascalCase (`SankeyDiagram.tsx`)
- Utilities: camelCase (`calculations.ts`)
- API routes: kebab-case (`/api/ripple-effect`)

## Key Principle

All calculation parameters (multipliers, tax rates, formulas) must be configurable via admin UI - never hardcoded. The `RippleConfig` type defines adjustable settings.
