# Next Gen

A warm, guided introduction that helps a young heir understand their own family's
wealth, structure and responsibilities — designed in the spirit of a private bank's
printed annual report rather than a fintech app.

This is a **front-end demo**. There is no backend, no login and no database: every
figure, name and event is local, fictional sample data for the **Tan family** and the
heir **Sophie Tan, 22**.

---

## Run it

Requires Node 18+ (developed on Node 22).

```bash
npm install
npm run dev
```

Then open the printed local URL (default **http://localhost:5173**).

That's the whole setup — install and start.

### Other commands

```bash
npm run build     # type-check + production build into dist/
npm run preview   # serve the production build locally
```

---

## What's inside

A personalised landing screen, five guided modules, and a completion screen:

1. **Your Family's Story** — an illustrated, expandable timeline of how the wealth was
   built, chapter by chapter.
2. **How It's Structured** — a friendly diagram of the trust, holding company and
   foundation, with tap-to-reveal explanations of what each one actually does.
3. **Investing Basics** — an interactive risk/return slider with a projected-growth
   chart and plain-language takeaways at every setting.
4. **Giving Back** — a values exercise: tap to pick and rank the causes that matter to
   you, then see how the family Foundation could reflect them.
5. **Your Role** — three "what would you do?" scenarios, each with thoughtful feedback
   on every choice.

Progress is tracked across modules (and persists in your browser via `localStorage`,
so a refresh won't lose your place). The completion screen offers **Start over** to
reset.

---

## Design language

"Restrained luxury" — the feel of a private bank's annual report.

- **Palette:** midnight navy, ivory/bone, brass/gold accent, charcoal, hairline borders.
- **Type:** Cormorant Garamond (serif headings) + Inter (body), via Google Fonts.
- Hairline rules, letter-spaced small-caps labels, generous whitespace, subtle motion.
- Responsive — optimised for an iPhone and a MacBook.

---

## Tech

- **Vite + React + TypeScript**
- **Tailwind CSS** for styling (theme tokens in `tailwind.config.js`)
- **Recharts** for the investing projection chart
- **@xyflow/react** (React Flow) for the structure diagram
- **react-router-dom** (hash routing, so it runs from anywhere with no server config)

### Project structure

```
src/
  data/family.ts            All fictional Tan-family content & helpers
  context/ProgressContext   Progress tracking (localStorage-backed)
  components/                Layout, design-system primitives, ModuleShell
  modules/                  Home, the five modules, and Completion
```

---

*Illustrative demo — fictional data. Names, figures and events are invented for
demonstration and do not represent any real person, family or institution.*
