# Architecture Notes

This document describes runtime behavior and system responsibilities.

## Request Flow
1. Incoming request hits `proxy.ts`.
2. If path is API/system/Next/public -> pass through.
3. If path is known static upstream asset prefix -> rewrite to `config.SOURCE_WEBSITE`.
4. Otherwise proxy injects `x-url` header and lets local Next page render transformed content.

## Page Rendering

- `app/page.tsx` and `app/[...path]/page.tsx` read `x-url` from request headers.
- Both delegate rendering to `PageRenderer`.
- Catch-all route guards against invalid path state and direct `/api` page rendering via `notFound()`.

`PageRenderer` flow:
1. Fetch CMS payload (`fetchCmsData`).
2. Check upstream availability (`fetchHeartbeat` -> `/api/ab-heartbeat`).
3. Render:
    - healthy upstream: `PageContent` + `PriceObserver`
    - unhealthy upstream: `PartnersWebsiteDown`


## API + Service Pipeline
- `PUT /api/ab-content`:
- validates/sanitizes path.
- blocks restricted/admin/dot-like paths.
- normalizes homepage link rules from CMS settings.
- delegates to `partnersPageService.fetch`.

- `PartnersPageService`:
- checks file cache first.
- returns cached data immediately when available.
- triggers non-blocking refresh via in-flight service.

- `ContentService`:
- parses upstream HTML with `jsdom`.
- rewrites contact links and selected URLs.
- extracts head links/scripts with filtering rules.
- composes metadata and header snippets.
- removes source header/footer and applies page transformations.

- `PUT /api/ab-styles`:
- only accepts global style bundle paths (`style.bundle.css`).
- warms style cache asynchronously.

- `GET /api/ab-cms`:
- returns CMS content/contact.
- refreshes CMS when instrumentation query is present.

## Data Sources
- Upstream website: `config.SOURCE_WEBSITE` (currently `https://velvet-pro.ru`).
- DatoCMS GraphQL: fetched in `src/lib/api/dato-cms.ts` via `DATO_CMS_API_TOKEN`.

## Reliability Patterns
- Global singletons in `src/services/api/*` avoid duplicate in-memory state.
- CMS fetch failures fall back to current/default data.
- heartbeat route checks upstream health without crashing render path.
