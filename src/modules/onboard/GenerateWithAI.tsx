import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useClients } from '../../context/ClientsContext'
import { causes } from '../../data/app'
import { slugify } from '../../data/clients'
import { generateClient, type Brief } from '../../ai/generateClient'
import { hasApiKey } from '../../lib/settings'
import { clientPath } from '../../lib/nav'
import type { ClientData } from '../../data/types'
import { Action, Arrow, Eyebrow } from '../../components/primitives'

type Stage = 'brief' | 'generating' | 'review'

const GENERATIONS = ['Second generation', 'Third generation', 'Fourth generation', 'Fifth generation']

export function GenerateWithAI() {
  const navigate = useNavigate()
  const { clients, create } = useClients()
  const keyed = hasApiKey()

  const [stage, setStage] = useState<Stage>('brief')
  const [error, setError] = useState<string | null>(null)
  const [draft, setDraft] = useState<ClientData | null>(null)

  const [brief, setBrief] = useState<Brief>({
    familyName: '',
    heirName: '',
    heirAge: '22',
    generationLabel: 'Fourth generation',
    city: '',
    currency: 'CHF',
    origin: '',
    industries: '',
    foundationFocus: [],
    tone: '',
  })

  const set = <K extends keyof Brief>(k: K, v: Brief[K]) => setBrief((b) => ({ ...b, [k]: v }))

  const toggleFocus = (id: string) =>
    setBrief((b) => {
      const has = b.foundationFocus.includes(id)
      if (has) return { ...b, foundationFocus: b.foundationFocus.filter((x) => x !== id) }
      if (b.foundationFocus.length >= 2) return b
      return { ...b, foundationFocus: [...b.foundationFocus, id] }
    })

  const ready =
    brief.familyName.trim() &&
    brief.heirName.trim() &&
    brief.city.trim() &&
    brief.origin.trim() &&
    brief.industries.trim()

  const generate = async () => {
    setError(null)
    setStage('generating')
    try {
      const existing = new Set(clients.map((c) => c.id))
      const data = await generateClient(brief, existing)
      setDraft(data)
      setStage('review')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.')
      setStage('brief')
    }
  }

  if (!keyed) {
    return (
      <div className="max-w-reading border border-hairline bg-parchment/50 p-7 shadow-card sm:p-8">
        <Eyebrow tone="muted">API key required</Eyebrow>
        <p className="mt-3 text-[1rem] leading-relaxed text-ink/75">
          AI drafting needs an Anthropic API key, stored only in this browser. Add one, then come
          back — or use “Start from the sample” / “Import JSON”, which need no key.
        </p>
        <Link
          to="/settings"
          className="mt-5 inline-flex items-center gap-2 text-navy link-underline"
        >
          <span className="label-caps">Open Settings</span>
          <Arrow />
        </Link>
      </div>
    )
  }

  if (stage === 'generating') {
    return (
      <div className="max-w-reading border border-hairline bg-parchment/50 p-10 text-center shadow-card">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-hairline border-t-brass" />
        <p className="mt-6 font-serif text-2xl text-navy">Drafting the {brief.familyName} programme…</p>
        <p className="mt-2 text-[0.9rem] text-ink/55">
          Writing the family story, structure, scenarios and more. This takes around half a minute.
        </p>
      </div>
    )
  }

  if (stage === 'review' && draft) {
    return <Review draft={draft} setDraft={setDraft} onSave={(d) => { create(d); navigate(clientPath(d.id)) }} onRestart={() => setStage('brief')} />
  }

  // ── Brief form ──────────────────────────────────────────────────────────
  return (
    <div className="max-w-reading border border-hairline bg-parchment/50 p-7 shadow-card sm:p-8">
      <p className="text-[0.95rem] leading-relaxed text-ink/70">
        Sketch the family in a few lines. The AI drafts the full programme — story, structure,
        investing notes, causes, scenarios — which you can review before saving.
      </p>

      {error && (
        <p className="mt-4 border border-[#9a4a2f]/30 bg-[#9a4a2f]/[0.05] px-4 py-3 text-[0.85rem] text-[#9a4a2f]">
          {error}
        </p>
      )}

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <Field label="Family surname" value={brief.familyName} onChange={(v) => set('familyName', v)} placeholder="e.g. Brunner" />
        <Field label="Heir’s full name" value={brief.heirName} onChange={(v) => set('heirName', v)} placeholder="e.g. Clara Brunner" />
        <Field label="Heir’s age" value={brief.heirAge} onChange={(v) => set('heirAge', v)} placeholder="22" />
        <Select label="Generation" value={brief.generationLabel} onChange={(v) => set('generationLabel', v)} options={GENERATIONS} />
        <Field label="Home city / base" value={brief.city} onChange={(v) => set('city', v)} placeholder="e.g. Zürich" />
        <Field label="Currency symbol" value={brief.currency} onChange={(v) => set('currency', v)} placeholder="CHF" />
      </div>

      <div className="mt-5 grid gap-5">
        <Area label="Where & how it began" value={brief.origin} onChange={(v) => set('origin', v)} placeholder="The founder, the place, the year, the first venture — a few lines." />
        <Area label="How the wealth was built" value={brief.industries} onChange={(v) => set('industries', v)} placeholder="Industries and turning points across the generations." />
      </div>

      <div className="mt-6">
        <span className="label-caps text-ink/45">Foundation currently supports (pick up to two)</span>
        <div className="mt-3 flex flex-wrap gap-2">
          {causes.map((c) => {
            const on = brief.foundationFocus.includes(c.id)
            return (
              <button
                key={c.id}
                onClick={() => toggleFocus(c.id)}
                className={`label-caps border px-3 py-2 transition-colors duration-300 ${
                  on ? 'border-brass bg-brass/10 text-brass-deep' : 'border-hairline text-ink/55 hover:border-brass/40'
                }`}
              >
                {c.name}
              </button>
            )
          })}
        </div>
      </div>

      <div className="mt-5">
        <Area label="Tone or extra notes (optional)" value={brief.tone} onChange={(v) => set('tone', v)} placeholder="Anything to emphasise — values, a motto, a cautionary tale." rows={2} />
      </div>

      <Action onClick={generate} disabled={!ready} className="mt-7">
        Draft with AI <Arrow />
      </Action>
      <p className="mt-3 text-[0.75rem] text-ink/40">
        Uses your saved Anthropic key · ~30 seconds · you review before anything is saved.
      </p>
    </div>
  )
}

// ── Review / edit ───────────────────────────────────────────────────────────
function Review({
  draft,
  setDraft,
  onSave,
  onRestart,
}: {
  draft: ClientData
  setDraft: (d: ClientData) => void
  onSave: (d: ClientData) => void
  onRestart: () => void
}) {
  const update = (patch: Partial<ClientData>) => setDraft({ ...draft, ...patch })

  const save = () => {
    // Re-derive id + monogram from the (possibly edited) surname.
    const id = slugify(draft.branding.familyName)
    onSave({
      ...draft,
      id,
      branding: {
        ...draft.branding,
        monogram: draft.branding.familyName.charAt(0).toUpperCase() || draft.branding.monogram,
      },
    })
  }

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(draft, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `next-gen-${draft.id}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="max-w-reading">
      <div className="border border-brass/30 bg-parchment/60 p-7 shadow-card sm:p-8">
        <Eyebrow>Draft ready · review before saving</Eyebrow>
        <h2 className="mt-3 font-serif text-3xl text-navy">The {draft.branding.familyName} Family</h2>
        <p className="mt-1 text-[0.95rem] text-ink/60">
          For {draft.heir.fullName}, {draft.heir.age} · {draft.heir.generation} · {draft.branding.city}
        </p>

        <div className="mt-6 grid gap-5">
          <EditField label="Family surname" value={draft.branding.familyName} onChange={(v) => update({ branding: { ...draft.branding, familyName: v } })} />
          <EditField label="Heir’s full name" value={draft.heir.fullName} onChange={(v) => update({ heir: { ...draft.heir, fullName: v, name: v.split(' ')[0] || v } })} />
          <EditArea label="Welcome message" value={draft.heir.welcome} onChange={(v) => update({ heir: { ...draft.heir, welcome: v } })} />
        </div>
      </div>

      {/* A glance at what was generated */}
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Glance title={`${draft.timeline.length} story chapters`}>
          {draft.timeline.slice(0, 4).map((t) => (
            <li key={t.year} className="text-[0.85rem] text-ink/65">
              <span className="tnum text-brass-deep">{t.year}</span> — {t.title}
            </li>
          ))}
          <li className="text-[0.8rem] italic text-ink/40">…and {draft.timeline.length - 4} more</li>
        </Glance>
        <Glance title={`${draft.scenarios.length} role scenarios`}>
          {draft.scenarios.map((s) => (
            <li key={s.id} className="text-[0.85rem] text-ink/65">
              {s.context}
            </li>
          ))}
        </Glance>
      </div>

      <div className="mt-7 flex flex-wrap items-center gap-4">
        <Action onClick={save} variant="primary">
          Save &amp; open <Arrow />
        </Action>
        <button onClick={exportJson} className="label-caps text-navy/70 transition-colors hover:text-navy">
          Export JSON
        </button>
        <button onClick={onRestart} className="label-caps text-ink/40 transition-colors hover:text-ink/70">
          Discard &amp; start over
        </button>
      </div>
    </div>
  )
}

function Glance({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border border-hairline bg-bone p-5">
      <Eyebrow tone="muted">{title}</Eyebrow>
      <ul className="mt-3 space-y-1.5">{children}</ul>
    </div>
  )
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <label className="flex flex-col gap-2">
      <span className="label-caps text-ink/45">{label}</span>
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="border border-hairline bg-bone px-4 py-3 text-[1rem] text-ink/90 focus:border-brass/50" />
    </label>
  )
}

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <label className="flex flex-col gap-2">
      <span className="label-caps text-ink/45">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="border border-hairline bg-bone px-4 py-3 text-[1rem] text-ink/90 focus:border-brass/50">
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  )
}

function Area({ label, value, onChange, placeholder, rows = 3 }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; rows?: number }) {
  return (
    <label className="flex flex-col gap-2">
      <span className="label-caps text-ink/45">{label}</span>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={rows} className="resize-y border border-hairline bg-bone px-4 py-3 text-[0.95rem] leading-relaxed text-ink/90 focus:border-brass/50" />
    </label>
  )
}

function EditField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return <Field label={label} value={value} onChange={onChange} />
}
function EditArea({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return <Area label={label} value={value} onChange={onChange} rows={4} />
}
