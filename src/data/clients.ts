// ─────────────────────────────────────────────────────────────────────────────
// Client storage: built-in seed(s) + user-created clients in localStorage.
// ─────────────────────────────────────────────────────────────────────────────

import { STRUCTURE_KEYS, causes } from './app'
import { tanClient } from './seed-tan'
import type { ClientData } from './types'

const STORAGE_KEY = 'next-gen.clients.v1'

export const seedClients: ClientData[] = [tanClient]
export const seedIds = new Set(seedClients.map((c) => c.id))

export function slugify(name: string): string {
  return (
    name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 32) || 'client'
  )
}

export function loadUserClients(): ClientData[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.filter((c) => validateClientData(c).ok) : []
  } catch {
    return []
  }
}

export function saveUserClients(clients: ClientData[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(clients))
  } catch {
    /* storage unavailable */
  }
}

export interface ValidationResult {
  ok: boolean
  errors: string[]
}

// Validates that an arbitrary object is a usable ClientData. The strict part is
// the structure-diagram contract: exactly the seven keys, in the node map.
export function validateClientData(c: unknown): ValidationResult {
  const errors: string[] = []
  const data = c as Partial<ClientData> | null

  if (!data || typeof data !== 'object') return { ok: false, errors: ['Not an object.'] }

  if (!data.id || typeof data.id !== 'string') errors.push('Missing id.')
  if (!data.branding?.familyName) errors.push('Missing branding.familyName.')
  if (!data.heir?.name) errors.push('Missing heir.name.')
  if (!Array.isArray(data.timeline) || data.timeline.length === 0)
    errors.push('timeline must be a non-empty array.')
  if (!Array.isArray(data.scenarios) || data.scenarios.length === 0)
    errors.push('scenarios must be a non-empty array.')

  // Structure-diagram contract.
  const nodes = data.structureNodes
  if (!nodes || typeof nodes !== 'object') {
    errors.push('Missing structureNodes.')
  } else {
    for (const k of STRUCTURE_KEYS) {
      if (!nodes[k]) errors.push(`structureNodes missing required key "${k}".`)
    }
  }
  if (!Array.isArray(data.structureEdges) || data.structureEdges.length === 0)
    errors.push('Missing structureEdges.')

  // Per-cause reflections and per-setting notes (warn, don't hard-fail UI).
  if (!data.causeReflections) errors.push('Missing causeReflections.')
  else {
    for (const cause of causes) {
      if (!data.causeReflections[cause.id])
        errors.push(`causeReflections missing "${cause.id}".`)
    }
  }
  if (!Array.isArray(data.riskFamilyNotes) || data.riskFamilyNotes.length < 5)
    errors.push('riskFamilyNotes must have 5 entries.')

  if (!data.completion?.narrative) errors.push('Missing completion.narrative.')
  if (!data.investing?.startingSum) errors.push('Missing investing.startingSum.')

  return { ok: errors.length === 0, errors }
}
