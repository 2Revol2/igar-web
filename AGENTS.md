## Igar Web Agent Guide

This file is for execution rules. Architecture and product context live in `context/`.

### 1. Read Before Editing

1. Read `context/project-overview.md` for intent and boundaries.
2. Read `context/architecture.md` for request/data flow and service responsibilities.
3. Ignore `cache/` entirely.

### 2. Repository Map (Quick)

- `app/`: App Router pages and API routes.
- `proxy.ts`: request gatekeeper (pass-through vs upstream rewrite vs local render).
- `src/services/api/`: server-side fetch, cache, transform, and in-flight orchestration.
- `src/lib/`: API clients and shared client/server utilities.
- `src/helpers/`: sanitization and path/link helpers.
- `public/ab-market/`: static assets exposed directly by Next.js.

### 3. Non-Negotiable Implementation Rules

- Preserve singleton construction pattern in `src/services/api/*`.
- Keep SSR-safe behavior; do not introduce browser globals outside client components/hooks.
- Do not change `config.SOURCE_WEBSITE` unless explicitly asked.

### 4. Change Discipline

- Keep edits scoped to the requested behavior.
- Prefer existing patterns over new abstractions.
- When changing route/service behavior, update related tests (`*.spec.ts`) in the same area.

