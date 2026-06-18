// JSON schema for the AI-generated portion of a client (everything except the
// app-level constants and the fixed structure edges, which are merged in code).

import { causes } from '../data/app'

const CAUSE_IDS = causes.map((c) => c.id)

const str = { type: 'string' } as const

const structureNode = {
  type: 'object',
  additionalProperties: false,
  properties: {
    key: str,
    title: str,
    kind: str, // short small-caps label, e.g. "The holding company"
    short: str, // one line shown in the diagram box
    what: str, // plain-language "what is this?"
    detail: str, // a family-specific second paragraph
    figure: str, // a short pull-figure, e.g. "Est. 2012"
  },
  required: ['key', 'title', 'kind', 'short', 'what', 'detail', 'figure'],
} as const

const causeReflectionProps = Object.fromEntries(CAUSE_IDS.map((id) => [id, str]))

export const generatedClientSchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    branding: {
      type: 'object',
      additionalProperties: false,
      properties: {
        familyName: str,
        monogram: str, // single uppercase letter
        city: str,
        established: str, // a year, as a string
        currency: str, // e.g. "HK$", "$", "£", "CHF"
        currentPillars: {
          type: 'array',
          items: { type: 'string', enum: CAUSE_IDS },
        },
      },
      required: ['familyName', 'monogram', 'city', 'established', 'currency', 'currentPillars'],
    },
    heir: {
      type: 'object',
      additionalProperties: false,
      properties: {
        name: str, // first name
        fullName: str,
        age: { type: 'integer' },
        generation: str, // e.g. "Fourth generation"
        city: str,
        welcome: str, // 2-3 warm sentences addressed to the heir
      },
      required: ['name', 'fullName', 'age', 'generation', 'city', 'welcome'],
    },
    family: {
      type: 'object',
      additionalProperties: false,
      properties: {
        founder: str,
        founderShort: str,
        secondGen: str,
        thirdGen: str,
        name: str, // surname
      },
      required: ['founder', 'founderShort', 'secondGen', 'thirdGen', 'name'],
    },
    timeline: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          year: str,
          era: str, // short phrase, e.g. "The arrival"
          title: str,
          person: str,
          generation: str,
          body: str, // a rich paragraph
          marker: str, // a short pull-quote
        },
        required: ['year', 'era', 'title', 'person', 'generation', 'body', 'marker'],
      },
    },
    structureNodes: {
      type: 'object',
      additionalProperties: false,
      properties: {
        family: structureNode,
        trust: structureNode,
        holding: structureNode,
        property: structureNode,
        investments: structureNode,
        legacy: structureNode,
        foundation: structureNode,
      },
      required: ['family', 'trust', 'holding', 'property', 'investments', 'legacy', 'foundation'],
    },
    causeReflections: {
      type: 'object',
      additionalProperties: false,
      properties: causeReflectionProps,
      required: CAUSE_IDS,
    },
    riskFamilyNotes: {
      type: 'array',
      items: str, // exactly five, one per risk setting from safest to most aggressive
    },
    scenarios: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          id: str,
          context: str,
          prompt: str,
          question: str,
          choices: {
            type: 'array',
            items: {
              type: 'object',
              additionalProperties: false,
              properties: {
                id: str, // "a" | "b" | "c"
                label: str,
                tone: { type: 'string', enum: ['considered', 'mixed', 'unwise'] },
                feedback: str,
              },
              required: ['id', 'label', 'tone', 'feedback'],
            },
          },
          closing: str,
        },
        required: ['id', 'context', 'prompt', 'question', 'choices', 'closing'],
      },
    },
    completion: {
      type: 'object',
      additionalProperties: false,
      properties: {
        narrative: str,
        quote: str,
        quoteAttribution: str,
      },
      required: ['narrative', 'quote', 'quoteAttribution'],
    },
    investing: {
      type: 'object',
      additionalProperties: false,
      properties: {
        startingSum: { type: 'integer' }, // illustrative round figure, e.g. 5000000
      },
      required: ['startingSum'],
    },
  },
  required: [
    'branding',
    'heir',
    'family',
    'timeline',
    'structureNodes',
    'causeReflections',
    'riskFamilyNotes',
    'scenarios',
    'completion',
    'investing',
  ],
} as const
