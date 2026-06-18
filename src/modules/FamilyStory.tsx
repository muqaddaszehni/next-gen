import { useState } from 'react'
import { ModuleShell } from '../components/ModuleShell'
import { Eyebrow } from '../components/primitives'
import { StoryIcon } from '../components/StoryIcons'
import { useActiveClient } from '../lib/nav'

const REQUIRED = 4

export function FamilyStory() {
  const client = useActiveClient()
  // First chapter open by default; track which chapters have been explored.
  const [open, setOpen] = useState<Set<number>>(() => new Set([0]))

  const timeline = client?.timeline ?? []

  const toggle = (i: number) => {
    setOpen((prev) => {
      const next = new Set(prev)
      if (next.has(i)) next.delete(i)
      else next.add(i)
      return next
    })
  }

  const lastOpened = open.has(timeline.length - 1)
  const ready = open.size >= REQUIRED && lastOpened

  return (
    <ModuleShell
      moduleId="story"
      ready={ready}
      gateHint={
        lastOpened
          ? `Open a few more chapters to continue · ${open.size}/${REQUIRED}`
          : 'Read on to the final chapter to continue'
      }
      intro={
        <>
          <p>
            Every fortune is really a story about people — their choices, their nerve, and the
            things they refused to do. Here is yours, in ten chapters.
          </p>
          <p className="text-ink/60">
            Tap any chapter to open it. Read on to where the story reaches you.
          </p>
        </>
      }
    >
      <div className="relative">
        {/* The vertical spine of the timeline. */}
        <span
          className="absolute left-[19px] top-2 bottom-2 w-px bg-gradient-to-b from-brass/50 via-hairline to-brass/20 sm:left-[27px]"
          aria-hidden
        />

        <ol className="space-y-3">
          {timeline.map((entry, i) => {
            const isOpen = open.has(i)
            const explored = open.has(i)
            return (
              <li key={entry.year} className="relative">
                {/* Marker dot on the spine */}
                <span
                  className={`absolute left-[12px] top-7 z-10 grid h-4 w-4 place-items-center rounded-full border transition-colors duration-500 sm:left-[20px] ${
                    explored
                      ? 'border-brass bg-brass'
                      : 'border-hairline bg-bone'
                  }`}
                  aria-hidden
                >
                  {explored && <span className="h-1.5 w-1.5 rounded-full bg-bone" />}
                </span>

                <div className="pl-12 sm:pl-20">
                  <button
                    onClick={() => toggle(i)}
                    aria-expanded={isOpen}
                    className={`group flex w-full items-start gap-4 border bg-parchment/60 px-5 py-5 text-left transition-all duration-300 ease-quiet hover:border-brass/40 hover:shadow-card sm:px-7 sm:py-6 ${
                      isOpen ? 'border-brass/35 shadow-card' : 'border-hairline'
                    }`}
                  >
                    <span
                      className={`mt-0.5 hidden h-11 w-11 shrink-0 text-brass-deep transition-colors sm:block ${
                        isOpen ? 'opacity-100' : 'opacity-70'
                      }`}
                    >
                      <StoryIcon index={i} className="h-full w-full" />
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                        <span className="font-serif text-3xl text-navy tnum sm:text-4xl">
                          {entry.year}
                        </span>
                        <Eyebrow>{entry.era}</Eyebrow>
                      </span>
                      <span className="mt-2 block font-serif text-xl leading-snug text-navy sm:text-2xl">
                        {entry.title}
                      </span>
                      {!isOpen && (
                        <span className="mt-2 block text-[0.9rem] italic text-brass-deep">
                          “{entry.marker}”
                        </span>
                      )}
                    </span>

                    <span
                      className={`mt-1 shrink-0 text-navy/40 transition-transform duration-300 ${
                        isOpen ? 'rotate-45 text-brass-deep' : 'group-hover:text-navy'
                      }`}
                      aria-hidden
                    >
                      <Plus />
                    </span>
                  </button>

                  {/* Revealed chapter body */}
                  <div
                    className={`grid transition-all duration-500 ease-quiet ${
                      isOpen ? 'mt-0 grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="border border-t-0 border-brass/25 bg-bone px-5 py-6 sm:px-7 sm:py-7">
                        <Eyebrow tone="muted">{entry.person} · {entry.generation}</Eyebrow>
                        <p className="mt-3 max-w-reading text-[1.04rem] leading-relaxed text-ink/85">
                          {entry.body}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            )
          })}
        </ol>
      </div>
    </ModuleShell>
  )
}

function Plus() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  )
}
