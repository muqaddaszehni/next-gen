import type Anthropic from '@anthropic-ai/sdk'
import { STRUCTURE_EDGE_CONTRACT, causes } from '../data/app'
import { slugify, validateClientData } from '../data/clients'
import type { ClientData } from '../data/types'
import { getApiKey } from '../lib/settings'
import { generatedClientSchema } from './schema'

export interface Brief {
  familyName: string
  heirName: string
  heirAge: string
  generationLabel: string // e.g. "Fourth generation"
  city: string
  currency: string
  origin: string // where/when/how it began (free text)
  industries: string // how the wealth was built (free text)
  foundationFocus: string[] // up to 2 cause ids
  tone: string // optional extra guidance
}

const causeList = causes.map((c) => `${c.id} (${c.name})`).join(', ')

function systemPrompt(): string {
  return [
    'You write the content for "Next Gen" — a warm, editorial yet premium app that teaches a young heir (early twenties) about their own family\'s wealth, structure and responsibilities. The voice is that of a discreet Swiss private bank: calm, human, never childish, never salesy, plain-language but dignified.',
    '',
    'You will be given a short brief about a (fictional) family and asked to produce the complete content as a single JSON object matching the provided schema. Everything must be internally consistent — names, dates, places and figures should agree across the timeline, structure, scenarios and completion.',
    '',
    'Requirements:',
    '- timeline: exactly 10 chapters in chronological order, from the founding generation to the present-day heir. The final chapter is addressed to the heir ("your turn begins"). Each body is 2–4 sentences, specific and human. marker is a short 3–5 word pull-quote.',
    '- structureNodes: use EXACTLY these seven keys — family, trust, holding, property, investments, legacy, foundation. "family" = the beneficiaries (the heir & relatives); "trust" = the protective container holding everything; "holding" = the holding company owning the operating assets; "property"/"investments"/"legacy" = three operating assets under the holding company (tailor "legacy" to the original family business); "foundation" = the charitable arm. Each node\'s "what" explains the concept in plain language; "detail" ties it to this specific family; "figure" is a short label like a year or a phrase.',
    '- causeReflections: one short, family-specific sentence for EACH of these cause ids: ' + causeList + '. Each should connect the cause to this family\'s story or values.',
    '- branding.currentPillars: the two cause ids the family\'s foundation already supports (must be two of the ids above), reflected in the foundation node and reflections.',
    '- riskFamilyNotes: exactly 5 short notes, ordered from safest to most aggressive (capital preservation → conservative → balanced → growth → aggressive), each tying that investing posture to the family\'s temperament or history.',
    '- scenarios: exactly 3 "what would you do?" moments the heir might genuinely face (e.g. a foundation grant request from a friend, a question about the family\'s wealth, a too-good investment pitch). Each has 3 choices with ids "a","b","c"; exactly one tone "considered", one "mixed", one "unwise" (in any order). feedback is thoughtful and non-judgemental. closing states the underlying principle.',
    '- heir.welcome: 2–3 warm sentences addressed directly to the heir by feel, not by name.',
    '- completion.narrative: a reflective paragraph tying the journey together; completion.quote: a short, wise family maxim; quoteAttribution like "The <Surname> family, to the next generation".',
    '- investing.startingSum: a round illustrative figure appropriate to the currency (e.g. 5000000).',
    '- branding.monogram: a single uppercase letter (the surname initial).',
    '',
    'Write all prose in British English. Keep it tasteful and concrete. Output only the JSON.',
  ].join('\n')
}

function userPrompt(b: Brief): string {
  const focus = b.foundationFocus.length
    ? b.foundationFocus.join(', ')
    : '(choose two that fit the family)'
  return [
    `Family surname: ${b.familyName}`,
    `Heir: ${b.heirName}, age ${b.heirAge}, ${b.generationLabel}`,
    `Home city / base: ${b.city}`,
    `Currency: ${b.currency}`,
    `Where & how it began: ${b.origin}`,
    `How the wealth was built (industries, generations): ${b.industries}`,
    `Foundation currently focuses on (cause ids): ${focus}`,
    b.tone ? `Tone / extra notes: ${b.tone}` : '',
    '',
    'Produce the complete JSON content for this family.',
  ]
    .filter(Boolean)
    .join('\n')
}

// Map raw SDK/API errors to something a non-technical user can act on.
function friendlyApiError(e: unknown): string {
  const status = (e as { status?: number })?.status
  if (status === 401) return 'That API key was rejected. Check it in Settings.'
  if (status === 403) return 'This API key isn’t permitted to use this model.'
  if (status === 429) return 'Rate limit reached. Wait a moment and try again.'
  if (status && status >= 500) return 'Anthropic had a temporary problem. Please try again.'
  const msg = e instanceof Error ? e.message : String(e)
  // A network/CORS failure has no status.
  if (!status && /fetch|network/i.test(msg)) return 'Couldn’t reach Anthropic. Check your connection.'
  return msg
}

export async function generateClient(brief: Brief, existingIds: Set<string>): Promise<ClientData> {
  const apiKey = getApiKey()
  if (!apiKey) throw new Error('No API key set. Add one in Settings first.')

  // Lazy-load the SDK so it stays out of the initial bundle.
  const { default: AnthropicClient } = await import('@anthropic-ai/sdk')
  const client = new AnthropicClient({ apiKey, dangerouslyAllowBrowser: true })

  // Stream to avoid HTTP timeouts on the large structured object.
  let message
  try {
    const stream = client.messages.stream({
      model: 'claude-opus-4-8',
      max_tokens: 16000,
      thinking: { type: 'adaptive' },
      output_config: {
        effort: 'medium',
        format: { type: 'json_schema', schema: generatedClientSchema },
      },
      system: systemPrompt(),
      messages: [{ role: 'user', content: userPrompt(brief) }],
    } as Anthropic.MessageStreamParams)
    message = await stream.finalMessage()
  } catch (e) {
    throw new Error(friendlyApiError(e))
  }

  if (message.stop_reason === 'refusal') {
    throw new Error('The request was declined. Try rephrasing the brief.')
  }

  const textBlock = message.content.find((b) => b.type === 'text')
  const raw = textBlock && 'text' in textBlock ? textBlock.text : ''
  if (!raw) throw new Error('The model returned no content. Please try again.')

  let generated: Record<string, unknown>
  try {
    generated = JSON.parse(raw)
  } catch {
    throw new Error('The model’s response was not valid JSON. Please try again.')
  }

  // Assemble the full ClientData: generated fields + fixed contract + unique id.
  let id = slugify(brief.familyName)
  let n = 2
  while (existingIds.has(id)) id = `${slugify(brief.familyName)}-${n++}`

  const data = {
    id,
    ...(generated as object),
    structureEdges: STRUCTURE_EDGE_CONTRACT,
  } as ClientData

  // Light normalisation.
  if (data.branding) {
    data.branding.monogram = (data.branding.monogram || data.branding.familyName?.[0] || 'N')
      .charAt(0)
      .toUpperCase()
    if (!Array.isArray(data.branding.currentPillars) || data.branding.currentPillars.length < 2) {
      data.branding.currentPillars = ['education', 'ocean']
    }
    data.branding.currentPillars = data.branding.currentPillars.slice(0, 2) as [string, string]
  }

  const result = validateClientData(data)
  if (!result.ok) {
    throw new Error('Generated content was incomplete: ' + result.errors.slice(0, 3).join(' '))
  }

  return data
}
