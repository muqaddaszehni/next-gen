# Next Gen

A warm, guided programme that helps a young heir understand their own family's
wealth, structure and responsibilities — designed in the spirit of a private
bank's printed annual report rather than a fintech app.

This is a **front-end demo**. There is no backend and no database: every client's
content is local. A built-in sample family (the fictional **Tan family**, heir
**Sophie Tan, 22**) ships in the repo; new clients you create are saved in your
browser.

---

## Run it

Requires Node 18+ (developed on Node 22).

```bash
npm install
npm run dev
```

Then open the printed local URL (default **http://localhost:5173**).

That's the whole setup — install and start. No API key is required to run the app
or to open, create (from the sample), or import clients.

### Other commands

```bash
npm run build     # type-check + production build into dist/
npm run preview   # serve the production build locally
```

---

## What's inside

**A client picker** (the home screen) lists every family programme. Open one, or
create a new client. Each client lives at its own URL (`/#/c/<id>/…`), so progress
is tracked separately per family.

Each programme has a personalised landing plus **five guided modules** and a gentle
completion screen:

1. **Your Family's Story** — an illustrated, expandable timeline of how the wealth
   was built.
2. **How It's Structured** — a friendly diagram of the trust, holding company and
   foundation, with tap-to-reveal explanations.
3. **Investing Basics** — an interactive risk/return slider with a projected-growth
   chart and plain-language takeaways.
4. **Giving Back** — tap to pick and rank the causes that matter, then see how the
   family Foundation could reflect them.
5. **Your Role** — "what would you do?" scenarios with thoughtful feedback.

Progress persists in `localStorage` per client; the completion screen offers
**Start over**.

---

## Onboarding a new client

From the picker, **Create a new client** offers three ways:

- **Draft with AI** — type a short brief (surname, origin, how the wealth was built,
  heir, foundation focus). Claude drafts the whole programme — story, structure,
  investing notes, causes, scenarios — which you **review and edit before saving**.
  Requires an Anthropic API key (see below).
- **Start from the sample** — copy the Tan programme's structure and rename it to a
  new family. No key needed.
- **Import JSON** — paste a programme exported from any client. Validated before
  saving (including the seven required structure boxes). No key needed.

Every client can be **Exported** to JSON from the picker, so programmes can be
backed up or moved between machines.

### AI drafting & the API key

AI drafting calls Claude (**claude-opus-4-8**) directly from your browser using an
Anthropic API key you paste into **Settings**. The key is stored only in this
browser's `localStorage`, is sent only to Anthropic, and is never committed.

> **Demo-only tradeoff.** A key held in the browser is visible to anyone with
> developer tools on that machine — fine for a private demo on your own device, not
> for a public deployment. For production, move generation behind a small server
> proxy and store clients in a real database. The manual and import paths need no
> key.

---

## Design language

"Restrained luxury" — the feel of a private bank's annual report.

- **Palette:** midnight navy, ivory/bone, brass/gold accent, charcoal, hairline borders.
- **Type:** Cormorant Garamond (serif headings) + Inter (body), via Google Fonts.
- Hairline rules, letter-spaced small-caps labels, generous whitespace, subtle motion.
- Responsive — optimised for an iPhone and a MacBook.

---

## Tech

- **Vite + React + TypeScript**, **Tailwind CSS**
- **Recharts** (investing chart), **@xyflow/react** (structure diagram)
- **react-router-dom** (hash routing — runs from anywhere with no server config)
- **@anthropic-ai/sdk** — lazy-loaded; only fetched when you draft with AI

### Project structure

```
src/
  data/types.ts        Shared types incl. ClientData (one family = one object)
  data/app.ts          App-level constants (modules, risk profiles, cause catalogue)
  data/seed-tan.ts     The built-in Tan family sample
  data/clients.ts      Client storage + validation
  context/             ClientsContext (clients) + ProgressContext (per-client progress)
  lib/                 nav helper (active client / paths), settings (API key)
  ai/                  generateClient + JSON schema for AI drafting
  components/          Layout, design-system primitives, ModuleShell
  modules/             ClientPicker, the five modules, Completion, Settings, onboard/
```

A new client is just a `ClientData` object. Hand-authoring one (or editing an
exported JSON) is fully supported; the AI path simply drafts one for you.

---

*Illustrative demo — fictional data. Names, figures and events shown here are
invented for demonstration and do not represent any real person, family or
institution.*
