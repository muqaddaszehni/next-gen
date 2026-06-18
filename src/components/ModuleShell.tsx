import { useEffect, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { modules } from '../data/app'
import { useProgress } from '../context/ProgressContext'
import { clientPath, useActiveClient } from '../lib/nav'
import { Action, Arrow, Eyebrow, GoldRule } from './primitives'

export function ModuleShell({
  moduleId,
  intro,
  children,
  ready,
  gateHint = 'Try the interaction above to continue.',
}: {
  moduleId: string
  intro: ReactNode
  children: ReactNode
  ready: boolean
  gateHint?: string
}) {
  const navigate = useNavigate()
  const client = useActiveClient()
  const { markComplete, isComplete } = useProgress()

  const index = modules.findIndex((m) => m.id === moduleId)
  const meta = modules[index]
  const prev = index > 0 ? modules[index - 1] : null
  const next = index < modules.length - 1 ? modules[index + 1] : null
  const done = isComplete(moduleId)
  const cid = client?.id ?? ''

  // Scroll to top when the module changes.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [moduleId])

  // Engaging with the module's interactive element completes it.
  useEffect(() => {
    if (ready) markComplete(moduleId)
  }, [ready, moduleId, markComplete])

  const handleContinue = () => {
    markComplete(moduleId)
    navigate(next ? clientPath(cid, next.path) : clientPath(cid, 'complete'))
  }

  return (
    <article className="mx-auto max-w-page px-5 pt-10 sm:px-8 sm:pt-16">
      {/* ── Module header ───────────────────────────────────────────── */}
      <header className="max-w-reading animate-fade-rise">
        <div className="flex items-center gap-3">
          <Eyebrow>Module {meta.number}</Eyebrow>
          <span className="h-px w-6 bg-hairline" />
          <Eyebrow tone="muted">of {modules.length}</Eyebrow>
          {done && (
            <span className="label-caps ml-1 inline-flex items-center gap-1 text-brass-deep">
              <Check /> Complete
            </span>
          )}
        </div>
        <h1 className="mt-5 font-serif text-[2.6rem] leading-[1.05] text-navy sm:text-[3.4rem]">
          {meta.title}
        </h1>
        <GoldRule className="mt-6" />
        <div className="mt-6 space-y-4 text-[1.06rem] leading-relaxed text-ink/80">{intro}</div>
      </header>

      {/* ── Interactive content ─────────────────────────────────────── */}
      <div className="mt-12 animate-fade-rise animate-delay-2 sm:mt-16">{children}</div>

      {/* ── Footer navigation ───────────────────────────────────────── */}
      <nav className="mt-16 flex flex-col gap-6 border-t border-hairline pt-8 sm:mt-20 sm:flex-row sm:items-center sm:justify-between">
        <div>
          {prev ? (
            <button
              onClick={() => navigate(clientPath(cid, prev.path))}
              className="group inline-flex items-center gap-2 text-left"
            >
              <span className="text-navy/50 transition-colors group-hover:text-navy">
                <Arrow dir="left" />
              </span>
              <span className="flex flex-col">
                <span className="label-caps text-ink/40">Previous</span>
                <span className="font-serif text-lg text-navy">{prev.title}</span>
              </span>
            </button>
          ) : (
            <button
              onClick={() => navigate(clientPath(cid))}
              className="group inline-flex items-center gap-2"
            >
              <span className="text-navy/50 transition-colors group-hover:text-navy">
                <Arrow dir="left" />
              </span>
              <span className="flex flex-col">
                <span className="label-caps text-ink/40">Back to</span>
                <span className="font-serif text-lg text-navy">All modules</span>
              </span>
            </button>
          )}
        </div>

        <div className="flex flex-col items-start gap-2 sm:items-end">
          {!ready && <span className="label-caps text-ink/40">{gateHint}</span>}
          <Action onClick={handleContinue} disabled={!ready} variant="primary">
            {next ? `Continue · ${next.title}` : 'See your completion'}
            <Arrow />
          </Action>
        </div>
      </nav>
    </article>
  )
}

function Check() {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path
        d="M2.5 7.5l3 3 6-7"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
