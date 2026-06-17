import { Link, useNavigate } from 'react-router-dom'
import { heir, modules } from '../data/family'
import { useProgress } from '../context/ProgressContext'
import { Action, Arrow, Eyebrow, GoldRule, Monogram } from '../components/primitives'

export function Completion() {
  const navigate = useNavigate()
  const { isComplete, completedCount, total, allComplete, reset, nextModulePath } = useProgress()

  return (
    <div className="mx-auto max-w-page px-5 pt-12 sm:px-8 sm:pt-20">
      {/* ── Seal / header ───────────────────────────────────────────── */}
      <section className="mx-auto max-w-reading text-center animate-fade-rise">
        <div className="flex justify-center">
          <div className="relative grid h-24 w-24 place-items-center rounded-full border border-brass/40">
            <span className="absolute inset-1.5 rounded-full border border-brass/25" aria-hidden />
            <Monogram className="h-14 w-14 text-[2rem]" />
          </div>
        </div>

        <Eyebrow className="mt-8 inline-block">
          {allComplete ? 'Your journey, complete' : 'Your journey so far'}
        </Eyebrow>
        <h1 className="mt-5 font-serif text-[2.8rem] leading-[1.05] text-navy sm:text-[3.8rem]">
          {allComplete ? (
            <>
              Well done,
              <br />
              <span className="italic text-brass-deep">{heir.name}</span>.
            </>
          ) : (
            <>You’re {completedCount} of {total} of the way there.</>
          )}
        </h1>
        <GoldRule className="mx-auto mt-7" />

        {allComplete ? (
          <p className="mt-7 text-[1.12rem] leading-relaxed text-ink/80">
            You began with a trunk coming off a boat in 1958, and you’ve arrived at your own name in
            the family story. You’ve seen how the wealth is held and protected, felt the trade-off at
            the heart of investing, named the causes that move you, and thought through what you’d
            actually do. None of this asks you to be anyone but yourself — only to carry what you’ve
            inherited with the same care it was built with.
          </p>
        ) : (
          <p className="mt-7 text-[1.08rem] leading-relaxed text-ink/75">
            Take your time — the modules will keep your place. Pick up wherever you left off whenever
            you’re ready.
          </p>
        )}

        {!allComplete && nextModulePath && (
          <Action onClick={() => navigate(nextModulePath)} variant="primary" className="mt-8">
            Continue your journey <Arrow />
          </Action>
        )}
      </section>

      {/* ── Recap of the five modules ───────────────────────────────── */}
      <section className="mx-auto mt-16 max-w-reading animate-fade-rise animate-delay-2">
        <div className="flex items-end justify-between border-b border-hairline pb-3">
          <Eyebrow tone="navy">What you’ve covered</Eyebrow>
          <Eyebrow tone="muted">{completedCount} / {total}</Eyebrow>
        </div>
        <ul>
          {modules.map((m) => {
            const done = isComplete(m.id)
            return (
              <li key={m.id}>
                <Link
                  to={m.path}
                  className="group flex items-center gap-4 border-b border-hairline py-5 transition-colors hover:bg-navy/[0.02]"
                >
                  <span
                    className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border ${
                      done ? 'border-brass bg-brass text-bone' : 'border-hairline text-ink/30'
                    }`}
                  >
                    {done ? <Check /> : <span className="text-[0.72rem] tnum">{m.number}</span>}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-serif text-xl text-navy">{m.title}</p>
                    <p className="text-[0.85rem] text-ink/50">{m.eyebrow}</p>
                  </div>
                  <span className="label-caps text-ink/35 transition-all group-hover:translate-x-1 group-hover:text-navy">
                    Revisit
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      </section>

      {/* ── Closing / next steps ────────────────────────────────────── */}
      {allComplete && (
        <section className="mx-auto mt-14 max-w-reading animate-fade-in">
          <div className="border border-brass/30 bg-navy p-8 text-center text-bone shadow-lift sm:p-12">
            <Eyebrow tone="brass">A note to carry with you</Eyebrow>
            <p className="mx-auto mt-5 max-w-xl font-serif text-[1.7rem] leading-snug text-bone sm:text-[2rem]">
              “Wealth is not what you have. It’s what you choose to do with it, and who you become
              while holding it.”
            </p>
            <p className="label-caps mt-6 text-bone/50">The Tan family, to the next generation</p>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Action onClick={() => navigate('/')} variant="secondary">
              <Arrow dir="left" /> Back to all modules
            </Action>
            <Action
              onClick={() => {
                reset()
                navigate('/')
              }}
              variant="ghost"
            >
              Start over
            </Action>
          </div>
        </section>
      )}
    </div>
  )
}

function Check() {
  return (
    <svg width="15" height="15" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path
        d="M2.5 7.5l3 3 6-7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
