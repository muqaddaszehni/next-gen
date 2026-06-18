// ─────────────────────────────────────────────────────────────────────────────
// App-level constants — identical for every client. Only the *commentary* that
// ties these to a specific family is per-client (see ClientData).
// ─────────────────────────────────────────────────────────────────────────────

import type { Cause, ModuleMeta, RiskProfile } from './types'

// The structure diagram is laid out by these exact node keys; every client's
// structureNodes/structureEdges must conform to this contract.
export const STRUCTURE_KEYS = [
  'family',
  'trust',
  'holding',
  'property',
  'investments',
  'legacy',
  'foundation',
] as const

export const STRUCTURE_EDGE_CONTRACT: Array<[string, string]> = [
  ['family', 'trust'],
  ['trust', 'holding'],
  ['trust', 'foundation'],
  ['holding', 'property'],
  ['holding', 'investments'],
  ['holding', 'legacy'],
]

// ── The five guided modules (structure is the same for every client) ─────────
export const modules: ModuleMeta[] = [
  {
    id: 'story',
    number: '01',
    path: 'story',
    title: 'Your Family’s Story',
    eyebrow: 'Where it began',
    summary:
      'From the very beginning to the family you know today — the people and choices behind the name.',
    minutes: '5 min',
  },
  {
    id: 'structure',
    number: '02',
    path: 'structure',
    title: 'How It’s Structured',
    eyebrow: 'How it holds together',
    summary:
      'Trust, holding company, foundation — the quiet architecture that protects and passes on what was built.',
    minutes: '4 min',
  },
  {
    id: 'investing',
    number: '03',
    path: 'investing',
    title: 'Investing Basics',
    eyebrow: 'Risk & return',
    summary:
      'The single most important trade-off in investing, shown with one slider and plain language.',
    minutes: '4 min',
  },
  {
    id: 'giving',
    number: '04',
    path: 'giving',
    title: 'Giving Back',
    eyebrow: 'Your values',
    summary:
      'Choose and rank the causes that move you, and see how the family Foundation could reflect them.',
    minutes: '3 min',
  },
  {
    id: 'role',
    number: '05',
    path: 'role',
    title: 'Your Role',
    eyebrow: 'What would you do?',
    summary:
      'A few moments that ask not what you own, but how you’ll carry it. There are no wrong answers — only thoughtful ones.',
    minutes: '5 min',
  },
]

// ── Risk/return profiles — numbers and labels are fixed for credibility ──────
export const riskProfiles: RiskProfile[] = [
  {
    id: 0,
    name: 'Capital preservation',
    mix: 'Mostly cash and short-term government bonds',
    expectedReturn: 3,
    typicalDownYear: -2,
    takeaway:
      'Your money is kept very safe and barely moves. It grows slowly — sometimes slower than the cost of living — but you are unlikely to ever see a meaningful loss. This is where you keep money you may need soon.',
  },
  {
    id: 1,
    name: 'Conservative',
    mix: 'Mostly bonds, with a slice of shares',
    expectedReturn: 5,
    typicalDownYear: -6,
    takeaway:
      'A gentle balance tilted toward safety. You accept small ups and downs in exchange for growth that comfortably outpaces inflation over time. Bad years sting a little, but rarely badly.',
  },
  {
    id: 2,
    name: 'Balanced',
    mix: 'Roughly half shares, half bonds',
    expectedReturn: 6.5,
    typicalDownYear: -14,
    takeaway:
      'The classic middle path. Enough growth to build real wealth over decades, enough steadiness to sleep at night. In a bad year you might see your portfolio fall noticeably — but history says it recovers.',
  },
  {
    id: 3,
    name: 'Growth',
    mix: 'Mostly shares, some bonds',
    expectedReturn: 8,
    typicalDownYear: -24,
    takeaway:
      'You are reaching for higher long-term growth and accepting a bumpier ride to get it. Some years will be very good; some will be frightening. This only makes sense for money you won’t touch for many years.',
  },
  {
    id: 4,
    name: 'Aggressive',
    mix: 'Almost entirely shares, including private equity',
    expectedReturn: 9.5,
    typicalDownYear: -38,
    takeaway:
      'Maximum reach for growth, with the widest swings. The long-term reward can be the highest — but you must be able to watch the value fall by a third without selling in a panic. Temperament matters more than the maths here.',
  },
]

// 20-year projection of a starting sum, with an illustrative uncertainty band
// that widens with the square root of time and the profile's risk.
export function projectGrowth(profile: RiskProfile, startingSum: number) {
  const years = 20
  const expected = profile.expectedReturn / 100
  const risk = Math.abs(profile.typicalDownYear) / 100
  const data = []
  for (let y = 0; y <= years; y++) {
    const mid = startingSum * Math.pow(1 + expected, y)
    const band = risk * 0.36 * Math.sqrt(y)
    const low = Math.max(mid * (1 - band), startingSum * 0.5)
    const high = mid * (1 + band)
    data.push({
      year: y,
      low: Math.round(low),
      mid: Math.round(mid),
      high: Math.round(high),
    })
  }
  return data
}

// ── The cause catalogue — fixed names/blurbs; family reflections are per-client
export const causes: Cause[] = [
  { id: 'education', name: 'Education & opportunity', blurb: 'Scholarships and mentoring for first-generation students.' },
  { id: 'ocean', name: 'Marine conservation', blurb: 'Protecting reefs and fisheries.' },
  { id: 'mentalhealth', name: 'Mental health', blurb: 'Support and access to care for young people.' },
  { id: 'climate', name: 'Climate & clean energy', blurb: 'Accelerating the shift to cleaner power.' },
  { id: 'arts', name: 'Arts & culture', blurb: 'Sustaining artists, music and heritage crafts.' },
  { id: 'health', name: 'Healthcare access', blurb: 'Bringing care to communities that lack it.' },
  { id: 'poverty', name: 'Poverty & food security', blurb: 'Meeting urgent needs and building lasting stability.' },
  { id: 'heritage', name: 'Migrant & heritage stories', blurb: 'Preserving the histories of those who arrived with little.' },
]

export const causeById = Object.fromEntries(causes.map((c) => [c.id, c]))
