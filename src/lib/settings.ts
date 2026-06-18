// The Anthropic API key lives only in this browser's localStorage. It is never
// committed and never leaves the machine except in the direct call to Anthropic.
const KEY = 'next-gen.anthropic-key'

export function getApiKey(): string {
  try {
    return localStorage.getItem(KEY) ?? ''
  } catch {
    return ''
  }
}

export function setApiKey(value: string) {
  try {
    if (value) localStorage.setItem(KEY, value)
    else localStorage.removeItem(KEY)
  } catch {
    /* storage unavailable */
  }
}

export function hasApiKey(): boolean {
  return getApiKey().trim().length > 0
}
