import { Link, useNavigate } from 'react-router-dom'
import { heir, modules } from '../data/family'
import { useProgress } from '../context/ProgressContext'
import { Action, Arrow, Eyebrow, GoldRule, Monogram } from '../components/primitives'
import { ProgressMeter } from '../components/ProgressMeter'

export function Home() {
  const navigate = useNavigate()
  const { isComplete, completedCount, total, allComplete, nextModulePath } = useProgress()
  const started = completedCount > 0
  const ctaPath = nextModulePath ?? '/complete'

  return (
    <div className="mx-auto max-w-page px-5 sm:px-8">
      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section className="grid items-center gap-12 pt-12 sm:pt-20 lg:grid-cols-[1.35fr_1fr] lg:gap-16">
        <div className="animate-fade-rise">
          <Eyebrow>A private programme · {heir.generation}</Eyebrow>
          <h1 className="mt-6 font-serif text-[3.2rem] leading-[1.02] text-navy sm:text-[4.6rem]">
            Welcome,
            <br />
            <span className="italic text-brass-deep">{heir.name}</span>.
          </h1>
          <GoldRule className="mt-8" />
          <p className="mt-8 max-w-reading text-[1.12rem] leading-relaxed text-ink/80">
            {heir.welcome}
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Action onClick={() => navigate(ctaPath)} variant="primary">
              {allComplete ? 'Revisit your completion' : started ? 'Continue your journey' : 'Begin your journey'}
              <Arrow />
            </Action>
            {started && !allComplete && (
              <span className="label-caps text-ink/45">
                {completedCount} of {total} modules complete
              </span>
            )}
          </div>
        </div>

        {/* A quiet "frontispiece" card — the family's facts at a glance. */}
        <aside className="animate-fade-rise animate-delay-2">
          <div className="relative border border-hairline bg-parchment/80 p-8 shadow-card sm:p-10">
            <div className="pointer-events-none absolute inset-3 border border-brass/20" aria-hidden />
            <div className="relative flex flex-col items-center text-center">
              <Monogram className="h-16 w-16 text-[2.4rem]" />
              <p className="mt-5 font-serif text-2xl text-navy">The Tan Family</p>
              <p className="label-caps mt-2 text-ink/40">Hong Kong · est. 1958</p>
              <div className="mt-7 w-full space-y-0 text-left">
                <FactRow label="Founded by" value="Tan Lim-Sheng" />
                <FactRow label="Generations" value="Four" />
                <FactRow label="Held within" value="The Tan Family Trust" />
                <FactRow label="Your guide" value="Five short modules" last />
              </div>
            </div>
          </div>
        </aside>
      </section>

      {/* ── Progress ──────────────────────────────────────────────── */}
      <section className="mt-20 sm:mt-28">
        <ProgressMeter className="max-w-reading" />
      </section>

      {/* ── Module index (a printed contents page) ────────────────── */}
      <section className="mt-12">
        <div className="flex items-end justify-between border-b border-hairline pb-4">
          <Eyebrow tone="navy">The modules</Eyebrow>
          <Eyebrow tone="muted">Contents</Eyebrow>
        </div>

        <ul>
          {modules.map((m, i) => {
            const done = isComplete(m.id)
            return (
              <li key={m.id}>
                <Link
                  to={m.path}
                  className="group grid grid-cols-[auto_1fr_auto] items-center gap-5 border-b border-hairline py-7 transition-colors duration-300 hover:bg-navy/[0.02] sm:gap-8 sm:py-8"
                  style={{ animationDelay: `${0.1 + i * 0.06}s` }}
                >
                  <span className="font-serif text-3xl text-brass/70 tnum transition-colors group-hover:text-brass-deep sm:text-4xl">
                    {m.number}
                  </span>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <h3 className="font-serif text-2xl text-navy sm:text-[1.7rem]">{m.title}</h3>
                      <Eyebrow tone="muted" className="hidden sm:inline">
                        {m.eyebrow}
                      </Eyebrow>
                    </div>
                    <p className="mt-1.5 max-w-2xl text-[0.97rem] leading-relaxed text-ink/65">
                      {m.summary}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-2 text-right">
                    <StatusPill done={done} />
                    <span className="label-caps hidden text-ink/35 sm:block">{m.minutes}</span>
                    <span className="mt-1 text-navy/40 transition-all duration-300 group-hover:translate-x-1 group-hover:text-navy">
                      <Arrow />
                    </span>
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>
      </section>

      {allComplete && (
        <section className="mt-12 animate-fade-in">
          <div className="border border-brass/30 bg-parchment/70 p-8 text-center shadow-card sm:p-10">
            <Eyebrow>Journey complete</Eyebrow>
            <p className="mx-auto mt-4 max-w-xl font-serif text-2xl leading-snug text-navy">
              You’ve completed every module. Your reflection is waiting.
            </p>
            <Action onClick={() => navigate('/complete')} variant="secondary" className="mt-6">
              View your completion
              <Arrow />
            </Action>
          </div>
        </section>
      )}
    </div>
  )
}

function FactRow({
  label,
  value,
  last = false,
}: {
  label: string
  value: string
  last?: boolean
}) {
  return (
    <div
      className={`flex items-baseline justify-between gap-4 py-2.5 ${
        last ? '' : 'border-b border-hairline/70'
      }`}
    >
      <span className="label-caps text-ink/40">{label}</span>
      <span className="font-serif text-[1.05rem] text-navy">{value}</span>
    </div>
  )
}

function StatusPill({ done }: { done: boolean }) {
  return (
    <span
      className={`label-caps inline-flex items-center gap-1.5 ${
        done ? 'text-brass-deep' : 'text-ink/35'
      }`}
    >
      <span
        className={`inline-block h-1.5 w-1.5 rounded-full ${
          done ? 'bg-brass' : 'bg-hairline ring-1 ring-ink/15'
        }`}
      />
      {done ? 'Complete' : 'Not started'}
    </span>
  )
}
