import { useState } from 'react'
import { causeById, causes } from '../data/app'
import { ModuleShell } from '../components/ModuleShell'
import { Eyebrow, GoldRule } from '../components/primitives'
import { useActiveClient } from '../lib/nav'

const MAX_PICKS = 3

export function GivingBack() {
  const client = useActiveClient()
  // Ordered list of chosen cause ids — order is the ranking.
  const [picks, setPicks] = useState<string[]>([])

  const causeReflections = client?.causeReflections ?? {}
  const currentPillars = new Set(client?.branding.currentPillars ?? [])
  const familyName = client?.branding.familyName ?? 'family'

  const toggle = (id: string) => {
    setPicks((prev) => {
      if (prev.includes(id)) return prev.filter((p) => p !== id)
      if (prev.length >= MAX_PICKS) return prev
      return [...prev, id]
    })
  }

  const move = (i: number, dir: -1 | 1) => {
    setPicks((prev) => {
      const j = i + dir
      if (j < 0 || j >= prev.length) return prev
      const next = [...prev]
      ;[next[i], next[j]] = [next[j], next[i]]
      return next
    })
  }

  const ready = picks.length === MAX_PICKS
  const pillarNames = [...currentPillars].map((id) => causeById[id]?.name?.toLowerCase() ?? id)

  return (
    <ModuleShell
      moduleId="giving"
      ready={ready}
      gateHint={`Choose and rank your top three causes · ${picks.length}/${MAX_PICKS}`}
      intro={
        <>
          <p>
            Your family has always believed that wealth carries a duty to give. But giving means most
            when it’s guided by what <span className="text-navy">you</span> actually care about —
            not what’s expected.
          </p>
          <p className="text-ink/60">
            Tap to choose the three causes that move you most, then order them. We’ll show how the
            family Foundation could reflect your values.
          </p>
        </>
      }
    >
      {/* ── Cause grid ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {causes.map((c) => {
          const rank = picks.indexOf(c.id)
          const isPicked = rank >= 0
          const isFull = picks.length >= MAX_PICKS
          const disabled = !isPicked && isFull
          return (
            <button
              key={c.id}
              onClick={() => toggle(c.id)}
              aria-pressed={isPicked}
              className={`group relative flex flex-col border p-4 text-left transition-all duration-300 ease-quiet sm:p-5 ${
                isPicked
                  ? 'border-brass bg-parchment shadow-card -translate-y-0.5'
                  : disabled
                    ? 'border-hairline bg-bone opacity-45'
                    : 'border-hairline bg-bone hover:border-brass/50 hover:-translate-y-0.5 hover:shadow-card'
              }`}
            >
              <span
                className={`absolute right-3 top-3 grid h-6 w-6 place-items-center rounded-full border text-[0.72rem] font-medium transition-all duration-300 tnum ${
                  isPicked
                    ? 'border-brass bg-brass text-bone'
                    : 'border-hairline text-transparent group-hover:border-brass/50'
                }`}
              >
                {isPicked ? rank + 1 : ''}
              </span>
              <h3 className="max-w-[85%] font-serif text-[1.18rem] leading-tight text-navy">{c.name}</h3>
              <p className="mt-2 text-[0.8rem] leading-snug text-ink/55">{c.blurb}</p>
            </button>
          )
        })}
      </div>

      {/* ── Ranked picks + suggestion ───────────────────────────────── */}
      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        {/* Ranking */}
        <div className="border border-hairline bg-parchment/50 p-6 shadow-card sm:p-7">
          <Eyebrow tone="navy">Your values, in order</Eyebrow>
          <GoldRule className="mt-4" />
          {picks.length === 0 ? (
            <p className="mt-6 text-[0.98rem] italic leading-relaxed text-ink/45">
              Nothing chosen yet. Tap up to three causes above, then use the arrows to rank them from
              most to least important.
            </p>
          ) : (
            <ol className="mt-5 space-y-3">
              {picks.map((id, i) => (
                <li key={id} className="flex items-center gap-4 border border-hairline bg-bone px-4 py-3.5">
                  <span className="font-serif text-3xl text-brass-deep tnum">{i + 1}</span>
                  <div className="min-w-0 flex-1">
                    <p className="font-serif text-lg leading-tight text-navy">{causeById[id].name}</p>
                    <p className="truncate text-[0.78rem] text-ink/50">{causeById[id].blurb}</p>
                  </div>
                  <div className="flex flex-col">
                    <ReorderButton dir="up" disabled={i === 0} onClick={() => move(i, -1)} />
                    <ReorderButton dir="down" disabled={i === picks.length - 1} onClick={() => move(i, 1)} />
                  </div>
                  <button
                    onClick={() => toggle(id)}
                    aria-label={`Remove ${causeById[id].name}`}
                    className="ml-1 text-ink/30 transition-colors hover:text-[#9a4a2f]"
                  >
                    <Cross />
                  </button>
                </li>
              ))}
            </ol>
          )}
        </div>

        {/* Suggestion */}
        <div className="border border-brass/30 bg-navy p-6 text-bone shadow-card sm:p-8">
          <Eyebrow tone="brass">If this were the Foundation’s compass</Eyebrow>
          {picks.length === 0 ? (
            <p className="mt-5 text-[1rem] leading-relaxed text-bone/55">
              Your suggestion will appear here once you’ve chosen what matters to you.
            </p>
          ) : (
            <div className="mt-5 animate-fade-rise" key={picks.join('-')}>
              <p className="font-serif text-2xl leading-snug text-bone">
                {causeById[picks[0]].name} sits at the heart of it.
              </p>
              <p className="mt-3 text-[0.98rem] leading-relaxed text-bone/75">
                {causeReflections[picks[0]]}
              </p>
              <div className="my-6 h-px w-full bg-bone/15" />
              <p className="text-[0.98rem] leading-relaxed text-bone/85">
                {buildSuggestion(picks, currentPillars)}
              </p>
            </div>
          )}
        </div>
      </div>

      <p className="mt-6 text-[0.72rem] leading-relaxed text-ink/40">
        The {familyName} Family Foundation today focuses on {pillarNames[0]} and {pillarNames[1]}. This
        exercise is a reflection, not a decision — a way to notice where your own values point.
      </p>
    </ModuleShell>
  )
}

// Synthesises a one-paragraph suggestion from the ranked picks.
function buildSuggestion(picks: string[], currentPillars: Set<string>): string {
  const names = picks.map((id) => causeById[id].name)
  const continued = picks.filter((id) => currentPillars.has(id)).map((id) => causeById[id].name)
  const fresh = picks.filter((id) => !currentPillars.has(id)).map((id) => causeById[id].name)

  const list = (arr: string[]) =>
    arr.length <= 1 ? (arr[0] ?? '') : `${arr.slice(0, -1).join(', ')} and ${arr[arr.length - 1]}`

  if (fresh.length === 0) {
    return `Every cause you chose — ${list(names)} — is already part of the Foundation’s work. Your instinct is one of continuity: rather than reinvent, you’d deepen what came before, perhaps committing more, for longer, with greater focus.`
  }
  if (continued.length === 0) {
    return `You’d steer the Foundation somewhere genuinely new. None of your causes — ${list(
      names,
    )} — are where it stands today. A thoughtful next chapter might keep its existing pledges while opening a dedicated fund for ${list(
      fresh,
    )}, signalling that the next generation has its own conscience.`
  }
  return `Your choices both honour the Foundation’s roots in ${list(
    continued,
  )} and point it somewhere new through ${list(
    fresh,
  )}. A balanced next chapter might protect what already works while opening one fresh initiative around ${fresh[0]} — continuity and renewal, side by side.`
}

function ReorderButton({ dir, disabled, onClick }: { dir: 'up' | 'down'; disabled: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={dir === 'up' ? 'Move up' : 'Move down'}
      className="grid h-6 w-6 place-items-center text-navy/55 transition-colors hover:text-navy disabled:opacity-20 disabled:hover:text-navy/55"
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
        <path
          d={dir === 'up' ? 'M3 9l4-4 4 4' : 'M3 5l4 4 4-4'}
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  )
}

function Cross() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  )
}
