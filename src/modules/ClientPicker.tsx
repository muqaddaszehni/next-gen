import { Link, useNavigate } from 'react-router-dom'
import { useClients } from '../context/ClientsContext'
import { clientPath } from '../lib/nav'
import type { ClientData } from '../data/types'
import { Action, Arrow, Eyebrow, GoldRule, Monogram } from '../components/primitives'

function exportClient(c: ClientData) {
  const blob = new Blob([JSON.stringify(c, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `next-gen-${c.id}.json`
  a.click()
  URL.revokeObjectURL(url)
}

export function ClientPicker() {
  const navigate = useNavigate()
  const { clients, isSeed, remove } = useClients()

  return (
    <div className="mx-auto max-w-page px-5 sm:px-8">
      {/* Hero */}
      <section className="grid items-end gap-10 pt-12 sm:pt-20 lg:grid-cols-[1.4fr_1fr]">
        <div className="animate-fade-rise">
          <Eyebrow>A private programme · Next generation</Eyebrow>
          <h1 className="mt-6 font-serif text-[3rem] leading-[1.03] text-navy sm:text-[4.2rem]">
            Your family
            <br />
            <span className="italic text-brass-deep">programmes</span>.
          </h1>
          <GoldRule className="mt-8" />
          <p className="mt-8 max-w-reading text-[1.08rem] leading-relaxed text-ink/80">
            Each programme is a warm, guided introduction that helps a young heir understand their
            own family’s wealth, structure and responsibilities. Open one to continue, or create a
            new one for a client.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-5">
            <Action onClick={() => navigate('/new')} variant="primary">
              Create a new client <Arrow />
            </Action>
            <Link to="/settings" className="label-caps text-navy/70 transition-colors hover:text-navy">
              AI settings
            </Link>
          </div>
        </div>

        <aside className="hidden animate-fade-rise animate-delay-2 lg:block">
          <div className="relative border border-hairline bg-parchment/80 p-8 shadow-card">
            <div className="pointer-events-none absolute inset-3 border border-brass/20" aria-hidden />
            <div className="relative">
              <Eyebrow tone="muted">For the private banker</Eyebrow>
              <p className="mt-4 font-serif text-[1.6rem] leading-snug text-navy">
                One programme, tailored to each family you serve.
              </p>
              <p className="mt-4 text-[0.92rem] leading-relaxed text-ink/60">
                Draft a new heir’s journey in minutes — by hand, by import, or with AI assistance —
                then hand them a link of their own.
              </p>
            </div>
          </div>
        </aside>
      </section>

      {/* Client list */}
      <section className="mt-16 sm:mt-24">
        <div className="flex items-end justify-between border-b border-hairline pb-4">
          <Eyebrow tone="navy">Clients</Eyebrow>
          <Eyebrow tone="muted">
            {clients.length} {clients.length === 1 ? 'family' : 'families'}
          </Eyebrow>
        </div>

        <ul>
          {clients.map((c, i) => (
            <li key={c.id}>
              <div
                className="group grid grid-cols-[auto_1fr_auto] items-center gap-5 border-b border-hairline py-6 transition-colors duration-300 hover:bg-navy/[0.02] sm:gap-8"
                style={{ animationDelay: `${0.08 + i * 0.05}s` }}
              >
                <Monogram letter={c.branding.monogram} className="h-12 w-12 text-[1.8rem]" />

                <Link to={clientPath(c.id)} className="min-w-0">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <h3 className="font-serif text-2xl text-navy sm:text-[1.7rem]">
                      The {c.branding.familyName} Family
                    </h3>
                    <Eyebrow tone="muted">
                      {c.branding.city} · est. {c.branding.established}
                    </Eyebrow>
                  </div>
                  <p className="mt-1 text-[0.95rem] text-ink/65">
                    For {c.heir.fullName}, {c.heir.age} · {c.heir.generation.toLowerCase()}
                  </p>
                </Link>

                <div className="flex items-center gap-4">
                  <button
                    onClick={() => exportClient(c)}
                    className="label-caps hidden text-ink/35 transition-colors hover:text-navy sm:inline"
                  >
                    Export
                  </button>
                  {isSeed(c.id) ? (
                    <span className="label-caps hidden text-ink/35 sm:inline">Sample</span>
                  ) : (
                    <button
                      onClick={() => {
                        if (confirm(`Remove the ${c.branding.familyName} family programme?`)) remove(c.id)
                      }}
                      className="label-caps hidden text-ink/35 transition-colors hover:text-[#9a4a2f] sm:inline"
                    >
                      Remove
                    </button>
                  )}
                  <Link
                    to={clientPath(c.id)}
                    className="inline-flex items-center gap-2 text-navy/50 transition-all duration-300 hover:translate-x-1 hover:text-navy"
                    aria-label={`Open the ${c.branding.familyName} programme`}
                  >
                    <span className="label-caps hidden sm:inline">Open</span>
                    <Arrow />
                  </Link>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
