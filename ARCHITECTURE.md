# Next Gen — Architecture & Decisions

Engineering notes for whoever works on this next. User-facing run/usage docs live
in `README.md`; this file covers how it's built, why, and what's left.

## What it is

A front-end-only demo: a guided programme that teaches a young heir about their
family's wealth, structure and responsibilities. Originally a single hardcoded
family (the Tan family); now a **reusable multi-client template** — one deployed
app serving many families, each created via an in-app onboarding flow.

- **Live:** https://muqaddaszehni.github.io/next-gen/
- **Repo:** https://github.com/muqaddaszehni/next-gen (public, GitHub Pages)

## Stack

Vite + React + TypeScript + Tailwind. Recharts (investing chart), @xyflow/react
(structure diagram), react-router-dom (hash routing), @anthropic-ai/sdk
(AI drafting, lazy-loaded). No backend, no database — all state is local.

## Data model (the core idea)

One family's entire content is a single **`ClientData`** object
(`src/data/types.ts`). The app renders whichever client is active.

- **`src/data/types.ts`** — all interfaces incl. `ClientData`.
- **`src/data/app.ts`** — constants identical for every client: the 5 `modules`,
  the `riskProfiles` (numbers/labels kept fixed so finance stays credible),
  `projectGrowth()`, the 8-cause `causes` catalogue, and the structure contract.
- **`src/data/seed-tan.ts`** — the built-in Tan family, a `ClientData` literal.
- **`src/data/clients.ts`** — storage (seed + user clients in `localStorage` key
  `next-gen.clients.v1`), `slugify`, and `validateClientData`.

What is **per-client** vs **app-level**: only the *family-specific commentary*
varies. The risk-profile numbers and the cause catalogue are app-level; the
per-setting `riskFamilyNotes[5]` and per-cause `causeReflections{}` are per-client.
This keeps the finance numbers consistent/credible and shrinks what AI must write.

### The structure-diagram contract (important)

`Structure.tsx` lays out the React Flow diagram by **fixed node keys**:
`family, trust, holding, property, investments, legacy, foundation`
(`STRUCTURE_KEYS` / `STRUCTURE_EDGE_CONTRACT` in `app.ts`). Every client's
`structureNodes` must contain exactly these keys; edges are always set from the
contract in code (not generated). `validateClientData` enforces the keys on import
and after AI generation. **Do not change the keys without updating the diagram
layout and the AI schema together.**

## State / contexts

- **`ClientsContext`** (`src/context/ClientsContext.tsx`) — merges seed + user
  clients; `get/create/remove/isSeed`. Wraps the whole app in `main.tsx`.
- **`ProgressContext`** (`src/context/ProgressContext.tsx`) — per-client progress,
  namespaced key `next-gen.progress.v1.<clientId>`. Provided by the client layout
  only (so progress is isolated and two families never collide).

## Routing

Hash routing (works on static hosting with no server config). Two layouts in
`src/App.tsx`:

- `RootLayout` (`/`): generic header/footer. Children: `ClientPicker` (`/`),
  `AddClient` (`/new`), `Settings` (`/settings`).
- `ClientLayout` (`/c/:clientId`): resolves the active client via
  `useActiveClient()` (`src/lib/nav.ts`), redirects to `/` if unknown, sets
  `document.title`, and wraps the modules in `ProgressProvider`. Children: `Home`
  (index), the five modules, `Completion`.

`clientPath(clientId, sub)` builds client-scoped links; modules read their data
from `useActiveClient()`.

## Onboarding a client (`src/modules/onboard/`)

`AddClient` exposes three tabs:

1. **Draft with AI** (`GenerateWithAI.tsx`) — a brief form → `generateClient()` →
   a review/edit screen → save. Requires an API key (Settings).
2. **Start from the sample** — deep-clones the Tan seed, renames it.
3. **Import JSON** — paste a `ClientData`, validated before saving.

Each client can **Export JSON** (picker row and the AI review screen).

### AI generation (`src/ai/`)

- **`schema.ts`** — JSON Schema for the AI-generated portion of a client
  (everything except app constants and the fixed edges). Structured output, so the
  shape is constrained at the API layer.
- **`generateClient.ts`** — builds the prompt from the brief and calls Claude
  (**`claude-opus-4-8`**, adaptive thinking, `effort: medium`) via
  `client.messages.stream({ output_config: { format: { type:'json_schema', schema }}})`,
  then `finalMessage()` → parse → merge `id` + edges + normalise → `validateClientData`.
  The SDK is **lazy-imported** so it stays out of the initial bundle. API errors are
  mapped to friendly messages (`friendlyApiError`).
- **Key handling** (`src/lib/settings.ts`) — the Anthropic key lives only in
  `localStorage` (`next-gen.anthropic-key`), entered in the Settings panel, sent
  only to Anthropic. Browser calls use `dangerouslyAllowBrowser: true`.

## Design system

Tokens in `tailwind.config.js` (navy `#0E1B2E`, bone `#F7F4EE`, brass `#B0904F`,
hairline `#D8D2C6`) and base styles in `src/index.css` (paper-grain background,
small-caps `.label-caps`, range-slider styling, React Flow overrides). Shared bits
in `src/components/primitives.tsx` (`Eyebrow`, `GoldRule`, `Monogram`, `Action`,
`Arrow`). The aesthetic is "restrained luxury" — Cormorant Garamond + Inter.

## Deployment

GitHub Pages via `.github/workflows/deploy.yml` (build on push to `main`,
`actions/deploy-pages`). `vite.config.ts` sets `base: '/next-gen/'` for production
only (dev stays at `/`). CI uses `npm ci`, so **package-lock.json must stay in sync
with package.json** (a manual package.json edit without `npm install` breaks CI).

## Key decisions & tradeoffs

- **Browser-held API key.** No backend, so AI drafting calls Anthropic directly
  from the browser with a user-supplied key. Visible in devtools on that machine —
  fine for a single-user demo, **not** for a public deployment. Production: move
  generation behind a small proxy.
- **Clients persist in `localStorage`** (per browser, not synced). Export/Import
  JSON moves them. Production: a real datastore.
- **Finance constants are app-level**, not AI-generated, to keep numbers credible.
- **Fixed structure keys** so the diagram never breaks; AI fills the prose only.
- **Lazy SDK** keeps the initial bundle ~840 kB (the SDK adds ~150 kB only when
  drafting). The bundle is large mainly due to Recharts + React Flow; acceptable
  for a demo, could be code-split further if needed.
- **Hash routing** so per-client deep links work on Pages with no SPA-fallback.

## Known limitations / UNVERIFIED

- **A successful AI generation is UNTESTED end-to-end.** No Anthropic key was
  available during development. Verified: the request reaches Anthropic from the
  browser (CORS works — real `401` with `request_id`), the request body
  type-checks against the SDK, and error handling + review/save work. **Not yet
  verified:** that a real key returns valid content accepted by the structured-output
  schema, or the content quality. To finish: add a key in Settings and draft one
  client; check the 7 structure keys validate and all modules render.
- The "manual" onboarding is brief-form + duplicate + import (not a full
  field-by-field editor for all 10 timeline entries etc.). Deep manual edits are
  done via Export → edit JSON → Import.
- Bundle-size warning at build is expected (Recharts/React Flow); harmless.
- Build prints benign `node:fs`/`node:path` externalization warnings from an SDK
  credential code path that is never executed (we pass the key directly).

## How to extend

- **Add a client:** AI draft, duplicate the sample, or hand-author/import a
  `ClientData` JSON (must satisfy `validateClientData`).
- **Add/alter a module:** the 5 modules are app-level (`modules` in `app.ts`) and
  rendered by route in `App.tsx` using `ModuleShell`. Adding one means a new entry,
  route, component, and (if it needs per-client content) new `ClientData` fields +
  schema + validation + the Tan seed.
