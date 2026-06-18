import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useClients } from '../../context/ClientsContext'
import { slugify, validateClientData } from '../../data/clients'
import { tanClient } from '../../data/seed-tan'
import { clientPath } from '../../lib/nav'
import type { ClientData } from '../../data/types'
import { Action, Arrow, Eyebrow, GoldRule } from '../../components/primitives'
import { GenerateWithAI } from './GenerateWithAI'

export function AddClient() {
  const navigate = useNavigate()
  const { clients, create } = useClients()

  const [tab, setTab] = useState<'ai' | 'duplicate' | 'import'>('ai')

  // Ensure the chosen id doesn't collide with an existing client.
  const uniqueId = (base: string) => {
    let id = slugify(base)
    let n = 2
    const taken = new Set(clients.map((c) => c.id))
    while (taken.has(id)) id = `${slugify(base)}-${n++}`
    return id
  }

  return (
    <div className="mx-auto max-w-page px-5 pt-10 sm:px-8 sm:pt-16">
      <header className="max-w-reading animate-fade-rise">
        <Eyebrow>New client</Eyebrow>
        <h1 className="mt-5 font-serif text-[2.6rem] leading-[1.05] text-navy sm:text-[3.2rem]">
          Create a programme
        </h1>
        <GoldRule className="mt-6" />
        <p className="mt-6 text-[1.06rem] leading-relaxed text-ink/80">
          Draft a tailored programme with AI from a short brief, start from the sample family, or
          import a programme prepared as JSON.
        </p>
      </header>

      <div className="mt-10 flex flex-wrap gap-2">
        <TabButton active={tab === 'ai'} onClick={() => setTab('ai')}>
          Draft with AI
        </TabButton>
        <TabButton active={tab === 'duplicate'} onClick={() => setTab('duplicate')}>
          Start from the sample
        </TabButton>
        <TabButton active={tab === 'import'} onClick={() => setTab('import')}>
          Import JSON
        </TabButton>
      </div>

      <div className="mt-6">
        {tab === 'ai' ? (
          <GenerateWithAI />
        ) : tab === 'duplicate' ? (
          <DuplicateForm
            onCreate={(familyName, heirName) => {
              const id = uniqueId(familyName)
              const clone: ClientData = JSON.parse(JSON.stringify(tanClient))
              clone.id = id
              clone.branding.familyName = familyName
              clone.branding.monogram = familyName.trim().charAt(0).toUpperCase() || 'N'
              clone.heir.name = heirName.split(' ')[0] || heirName
              clone.heir.fullName = heirName
              create(clone)
              navigate(clientPath(id))
            }}
          />
        ) : (
          <ImportForm
            onImport={(data) => {
              const id = uniqueId(data.id || data.branding?.familyName || 'client')
              const toSave = { ...data, id }
              create(toSave)
              navigate(clientPath(id))
            }}
          />
        )}
      </div>

      <button
        onClick={() => navigate('/')}
        className="group mt-12 inline-flex items-center gap-2"
      >
        <span className="text-navy/50 transition-colors group-hover:text-navy">
          <Arrow dir="left" />
        </span>
        <span className="label-caps text-ink/40">Back to all clients</span>
      </button>
    </div>
  )
}

function DuplicateForm({ onCreate }: { onCreate: (familyName: string, heirName: string) => void }) {
  const [familyName, setFamilyName] = useState('')
  const [heirName, setHeirName] = useState('')
  const ready = familyName.trim().length > 0 && heirName.trim().length > 0

  return (
    <div className="max-w-reading border border-hairline bg-parchment/50 p-7 shadow-card sm:p-8">
      <p className="text-[0.95rem] leading-relaxed text-ink/70">
        This copies the sample programme’s structure and story as a starting point, renamed to your
        client. You can refine the content later (full editing arrives with the guided builder).
      </p>
      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <Field label="Family surname" value={familyName} onChange={setFamilyName} placeholder="e.g. Lee" />
        <Field label="Heir’s full name" value={heirName} onChange={setHeirName} placeholder="e.g. Daniel Lee" />
      </div>
      <Action onClick={() => onCreate(familyName.trim(), heirName.trim())} disabled={!ready} className="mt-7">
        Create programme <Arrow />
      </Action>
    </div>
  )
}

function ImportForm({ onImport }: { onImport: (data: ClientData) => void }) {
  const [text, setText] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handle = () => {
    let parsed: unknown
    try {
      parsed = JSON.parse(text)
    } catch {
      setError('That isn’t valid JSON.')
      return
    }
    const result = validateClientData(parsed)
    if (!result.ok) {
      setError(result.errors.slice(0, 4).join(' '))
      return
    }
    setError(null)
    onImport(parsed as ClientData)
  }

  return (
    <div className="max-w-reading border border-hairline bg-parchment/50 p-7 shadow-card sm:p-8">
      <p className="text-[0.95rem] leading-relaxed text-ink/70">
        Paste a complete programme in JSON (the same shape you can export from any client). It’s
        validated before saving — including the seven required structure boxes.
      </p>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={12}
        placeholder='{ "id": "...", "branding": { ... }, "heir": { ... }, ... }'
        className="mt-5 w-full resize-y border border-hairline bg-bone p-4 font-mono text-[0.8rem] leading-relaxed text-ink/85 focus:border-brass/50"
        spellCheck={false}
      />
      {error && <p className="mt-3 text-[0.85rem] text-[#9a4a2f]">{error}</p>}
      <Action onClick={handle} disabled={text.trim().length === 0} className="mt-5">
        Validate &amp; create <Arrow />
      </Action>
    </div>
  )
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="label-caps text-ink/45">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="border border-hairline bg-bone px-4 py-3 text-[1rem] text-ink/90 focus:border-brass/50"
      />
    </label>
  )
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={`label-caps border px-4 py-2.5 transition-colors duration-300 ${
        active
          ? 'border-brass/40 bg-brass/5 text-brass-deep'
          : 'border-navy/20 text-navy/70 hover:border-navy/50 hover:text-navy'
      }`}
    >
      {children}
    </button>
  )
}
