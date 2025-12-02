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

## Critical Safety Rules

### Multi-Tenant Isolation
**NEVER delete, modify, or remove files belonging to other tenants when working on a specific tenant.**

When working on tenant X:
- Only modify files in `src/lib/X/`, `src/components/X/`, and tenant-specific pages
- Shared files in `src/app/kunde/[tenantId]/` serve ALL tenants - changes here affect everyone
- If unsure whether a file is shared, ASK before deleting
- When removing tenant-specific features, verify the file path contains the tenant name

Tenant-specific directories:
- `src/lib/nsf/` - NSF only
- `src/lib/eidsiva/` - Eidsiva only
- `src/components/eidsiva/` - Eidsiva only

Shared directories (affects ALL tenants):
- `src/app/kunde/[tenantId]/` - Shared pages
- `src/components/dashboard/` - Shared components
- `src/components/layout/` - Shared layout
