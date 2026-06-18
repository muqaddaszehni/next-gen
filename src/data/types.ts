// ─────────────────────────────────────────────────────────────────────────────
// Shared types for Next Gen. A single client's entire content is a ClientData
// object; the app renders whichever one is active (chosen by URL).
// ─────────────────────────────────────────────────────────────────────────────

export interface Heir {
  name: string
  fullName: string
  age: number
  generation: string
  city: string
  welcome: string
}

export interface Family {
  founder: string
  founderShort: string
  secondGen: string
  thirdGen: string
  name: string
}

export interface TimelineEntry {
  year: string
  era: string
  title: string
  person: string
  generation: string
  body: string
  marker: string
}

export interface StructureNodeData {
  key: string
  title: string
  kind: string
  short: string
  what: string
  detail: string
  figure?: string
}

// App-level constant shape (numbers/labels are fixed; the family commentary is
// supplied per-client via ClientData.riskFamilyNotes).
export interface RiskProfile {
  id: number
  name: string
  mix: string
  expectedReturn: number
  typicalDownYear: number
  takeaway: string
}

// App-level constant catalogue; the per-family reflection lives in
// ClientData.causeReflections, keyed by cause id.
export interface Cause {
  id: string
  name: string
  blurb: string
}

export interface ScenarioChoice {
  id: string
  label: string
  tone: 'considered' | 'mixed' | 'unwise'
  feedback: string
}

export interface Scenario {
  id: string
  context: string
  prompt: string
  question: string
  choices: ScenarioChoice[]
  closing: string
}

export interface ModuleMeta {
  id: string
  number: string
  path: string // sub-path under /c/:clientId (e.g. "story")
  title: string
  eyebrow: string
  summary: string
  minutes: string
}

export interface Branding {
  familyName: string // "Tan"
  monogram: string // "T"
  city: string // "Hong Kong"
  established: string // "1958"
  currency: string // "HK$"
  // Two cause ids the foundation already funds (used in Giving Back).
  currentPillars: [string, string]
}

// The complete, self-contained content for one client.
export interface ClientData {
  id: string // slug, e.g. "tan"
  branding: Branding
  heir: Heir
  family: Family
  timeline: TimelineEntry[]
  // Must use exactly the STRUCTURE_KEYS below — the diagram layout depends on it.
  structureNodes: Record<string, StructureNodeData>
  structureEdges: Array<[string, string]>
  // Per-family commentary, one per riskProfile (indexed 0..4).
  riskFamilyNotes: string[]
  // Per-family reflection, keyed by cause id.
  causeReflections: Record<string, string>
  scenarios: Scenario[]
  completion: {
    narrative: string
    quote: string
    quoteAttribution: string
  }
  investing: {
    startingSum: number // illustrative sum for the projection chart
  }
}
