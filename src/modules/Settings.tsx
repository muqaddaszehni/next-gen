import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getApiKey, setApiKey } from '../lib/settings'
import { Action, Arrow, Eyebrow, GoldRule } from '../components/primitives'

export function Settings() {
  const navigate = useNavigate()
  const [value, setValue] = useState(getApiKey())
  const [show, setShow] = useState(false)
  const [saved, setSaved] = useState(false)

  const save = () => {
    setApiKey(value.trim())
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="mx-auto max-w-page px-5 pt-10 sm:px-8 sm:pt-16">
      <header className="max-w-reading animate-fade-rise">
        <Eyebrow>Settings</Eyebrow>
        <h1 className="mt-5 font-serif text-[2.6rem] leading-[1.05] text-navy sm:text-[3.2rem]">
          AI drafting
        </h1>
        <GoldRule className="mt-6" />
        <p className="mt-6 text-[1.06rem] leading-relaxed text-ink/80">
          To draft a new programme with AI, add an Anthropic API key. It’s stored only in this
          browser and is sent directly to Anthropic when you generate — it is never uploaded
          anywhere else or saved to the project.
        </p>
      </header>

      <div className="mt-8 max-w-reading border border-hairline bg-parchment/50 p-7 shadow-card sm:p-8">
        <label className="flex flex-col gap-2">
          <span className="label-caps text-ink/45">Anthropic API key</span>
          <div className="flex gap-2">
            <input
              type={show ? 'text' : 'password'}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="sk-ant-..."
              spellCheck={false}
              autoComplete="off"
              className="flex-1 border border-hairline bg-bone px-4 py-3 font-mono text-[0.85rem] text-ink/90 focus:border-brass/50"
            />
            <button
              onClick={() => setShow((s) => !s)}
              className="label-caps border border-navy/20 px-3 text-navy/70 transition-colors hover:border-navy/50"
            >
              {show ? 'Hide' : 'Show'}
            </button>
          </div>
        </label>

        <div className="mt-6 flex items-center gap-4">
          <Action onClick={save} disabled={value.trim().length === 0}>
            Save key
          </Action>
          {getApiKey() && (
            <button
              onClick={() => {
                setApiKey('')
                setValue('')
              }}
              className="label-caps text-ink/40 transition-colors hover:text-[#9a4a2f]"
            >
              Remove saved key
            </button>
          )}
          {saved && <span className="label-caps text-brass-deep">Saved</span>}
        </div>

        <p className="mt-6 border-t border-hairline pt-5 text-[0.78rem] leading-relaxed text-ink/45">
          Note: a key held in the browser is visible to anyone with developer tools on this machine.
          That’s acceptable for a private demo on your own device, but for a shared deployment the
          generation should run behind a small server instead. Manual creation and JSON import work
          without any key.
        </p>
      </div>

      <button onClick={() => navigate('/new')} className="group mt-12 inline-flex items-center gap-2">
        <span className="text-navy/50 transition-colors group-hover:text-navy">
          <Arrow dir="left" />
        </span>
        <span className="label-caps text-ink/40">Back to create a client</span>
      </button>
    </div>
  )
}
