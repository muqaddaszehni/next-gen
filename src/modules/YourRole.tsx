import { useState } from 'react'
import { scenarios, type ScenarioChoice } from '../data/family'
import { ModuleShell } from '../components/ModuleShell'
import { Action, Arrow, Eyebrow, GoldRule } from '../components/primitives'

const toneMeta: Record<
  ScenarioChoice['tone'],
  { label: string; border: string; chip: string; mark: 'check' | 'dot' | 'alert' }
> = {
  considered: {
    label: 'A considered choice',
    border: 'border-brass/45 bg-parchment',
    chip: 'text-brass-deep',
    mark: 'check',
  },
  mixed: {
    label: 'A fair instinct',
    border: 'border-navy/20 bg-bone',
    chip: 'text-navy/70',
    mark: 'dot',
  },
  unwise: {
    label: 'Worth reconsidering',
    border: 'border-[#9a4a2f]/35 bg-[#9a4a2f]/[0.05]',
    chip: 'text-[#9a4a2f]',
    mark: 'alert',
  },
}

export function YourRole() {
  const [step, setStep] = useState(0)
  const [selections, setSelections] = useState<Record<string, string>>({})

  const sc = scenarios[step]
  const chosenId = selections[sc.id]
  const chosen = sc.choices.find((c) => c.id === chosenId) ?? null
  const answeredAll = scenarios.every((s) => selections[s.id])

  const choose = (choiceId: string) => {
    setSelections((prev) => ({ ...prev, [sc.id]: choiceId }))
  }

  return (
    <ModuleShell
      moduleId="role"
      ready={answeredAll}
      gateHint={`Respond to all three moments to continue · ${
        Object.keys(selections).length
      }/${scenarios.length}`}
      intro={
        <>
          <p>
            Being an heir is far less about what you own than about how you carry it. Here are three
            moments you may genuinely face one day. There are no trick questions and no single right
            answer — only choices that are more, or less, considered.
          </p>
          <p className="text-ink/60">
            Choose what you’d do, read the reflection, and feel free to explore the other options
            too.
          </p>
        </>
      }
    >
      {/* Stepper */}
      <div className="mb-8 flex items-center gap-2">
        {scenarios.map((s, i) => {
          const done = Boolean(selections[s.id])
          const active = i === step
          return (
            <button
              key={s.id}
              onClick={() => setStep(i)}
              className="group flex flex-1 flex-col gap-2"
              aria-label={`Go to scenario ${i + 1}`}
            >
              <span
                className={`h-[3px] w-full rounded-full transition-colors duration-500 ${
                  active ? 'bg-navy' : done ? 'bg-brass' : 'bg-hairline'
                }`}
              />
              <span
                className={`label-caps text-left ${
                  active ? 'text-navy' : done ? 'text-brass-deep' : 'text-ink/35'
                }`}
              >
                {String(i + 1).padStart(2, '0')}
              </span>
            </button>
          )
        })}
      </div>

      <div key={sc.id} className="animate-fade-rise">
        {/* Situation */}
        <div className="border border-hairline bg-parchment/50 p-6 shadow-card sm:p-9">
          <Eyebrow>
            Scenario {String(step + 1).padStart(2, '0')} · {sc.context}
          </Eyebrow>
          <p className="mt-4 max-w-reading font-serif text-[1.5rem] leading-snug text-navy sm:text-[1.8rem]">
            {sc.prompt}
          </p>
          <GoldRule className="mt-6" />
          <p className="label-caps mt-6 text-ink/45">{sc.question}</p>

          {/* Choices */}
          <div className="mt-4 space-y-3">
            {sc.choices.map((c) => {
              const isChosen = c.id === chosenId
              const meta = toneMeta[c.tone]
              return (
                <button
                  key={c.id}
                  onClick={() => choose(c.id)}
                  className={`flex w-full items-start gap-4 border px-5 py-4 text-left transition-all duration-300 ease-quiet ${
                    isChosen
                      ? `${meta.border} shadow-card`
                      : 'border-hairline bg-bone hover:border-navy/40 hover:bg-navy/[0.02]'
                  }`}
                >
                  <span
                    className={`mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full border text-[0.8rem] font-medium uppercase ${
                      isChosen
                        ? `border-current ${meta.chip}`
                        : 'border-hairline text-ink/40'
                    }`}
                  >
                    {c.id}
                  </span>
                  <span className="flex-1 text-[1.02rem] leading-relaxed text-ink/85">{c.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Feedback */}
        {chosen && (
          <div
            key={chosen.id}
            className={`mt-4 animate-fade-rise border p-6 shadow-card sm:p-8 ${toneMeta[chosen.tone].border}`}
          >
            <span className={`label-caps inline-flex items-center gap-2 ${toneMeta[chosen.tone].chip}`}>
              <Mark kind={toneMeta[chosen.tone].mark} /> {toneMeta[chosen.tone].label}
            </span>
            <p className="mt-3 text-[1.05rem] leading-relaxed text-ink/85">{chosen.feedback}</p>

            <div className="mt-6 border-t border-current/15 pt-5">
              <Eyebrow tone="muted">The principle</Eyebrow>
              <p className="mt-2 text-[0.98rem] italic leading-relaxed text-navy/80">{sc.closing}</p>
            </div>
          </div>
        )}

        {/* Scenario navigation */}
        <div className="mt-6 flex items-center justify-between">
          <Action
            variant="ghost"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
          >
            <Arrow dir="left" /> Previous
          </Action>
          {step < scenarios.length - 1 ? (
            <Action variant="secondary" onClick={() => setStep((s) => s + 1)} disabled={!chosen}>
              Next moment <Arrow />
            </Action>
          ) : (
            <span className="label-caps text-brass-deep">
              {answeredAll ? 'All three answered' : 'Answer to finish'}
            </span>
          )}
        </div>
      </div>
    </ModuleShell>
  )
}

function Mark({ kind }: { kind: 'check' | 'dot' | 'alert' }) {
  if (kind === 'dot')
    return <span className="inline-block h-2 w-2 rounded-full bg-current" aria-hidden />
  if (kind === 'alert')
    return (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
        <path d="M7 2v6M7 11v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    )
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
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
