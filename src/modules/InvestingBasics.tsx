import { useMemo, useState } from 'react'
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { projectGrowth, riskProfiles } from '../data/family'
import { ModuleShell } from '../components/ModuleShell'
import { Eyebrow, GoldRule } from '../components/primitives'

const STARTING_SUM = 5_000_000
const REQUIRED_VISITS = 3

const fmtAxis = (v: number) => `${(v / 1_000_000).toFixed(1)}M`
const fmtMoney = (v: number) =>
  `HK$${(v / 1_000_000).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}M`

export function InvestingBasics() {
  const [index, setIndex] = useState(2) // start at "Balanced"
  const [visited, setVisited] = useState<Set<number>>(() => new Set([2]))

  const profile = riskProfiles[index]

  const handleChange = (v: number) => {
    setIndex(v)
    setVisited((prev) => (prev.has(v) ? prev : new Set(prev).add(v)))
  }

  const data = useMemo(() => {
    return projectGrowth(profile, STARTING_SUM).map((d) => ({
      ...d,
      range: d.high - d.low,
    }))
  }, [profile])

  const finalMid = data[data.length - 1].mid
  const finalLow = data[data.length - 1].low
  const finalHigh = data[data.length - 1].high

  const ready = visited.size >= REQUIRED_VISITS

  return (
    <ModuleShell
      moduleId="investing"
      ready={ready}
      gateHint={`Move the slider to explore other settings · ${visited.size}/${REQUIRED_VISITS}`}
      intro={
        <>
          <p>
            Almost everything in investing comes down to a single trade-off:{' '}
            <span className="text-navy">safety versus growth</span>. You cannot have the most of
            both at once. Money kept perfectly safe grows slowly; money reaching for high growth must
            be able to fall hard along the way.
          </p>
          <p className="text-ink/60">
            Move the slider to feel the trade-off for yourself. Watch how the likely outcome — and
            its uncertainty — change at each setting.
          </p>
        </>
      }
    >
      <div className="border border-hairline bg-parchment/50 p-6 shadow-card sm:p-9">
        {/* ── Slider ──────────────────────────────────────────────── */}
        <div className="mb-2 flex items-baseline justify-between">
          <Eyebrow tone="muted">Safer</Eyebrow>
          <Eyebrow tone="muted">More growth</Eyebrow>
        </div>
        <input
          type="range"
          min={0}
          max={riskProfiles.length - 1}
          step={1}
          value={index}
          onChange={(e) => handleChange(Number(e.target.value))}
          className="w-full"
          aria-label="Risk and return setting"
        />
        <div className="mt-3 grid grid-cols-5 gap-1">
          {riskProfiles.map((p) => (
            <button
              key={p.id}
              onClick={() => handleChange(p.id)}
              className={`label-caps truncate px-1 py-1 text-center text-[0.58rem] transition-colors sm:text-[0.62rem] ${
                p.id === index
                  ? 'text-brass-deep'
                  : visited.has(p.id)
                    ? 'text-ink/45'
                    : 'text-ink/30 hover:text-ink/60'
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>

        <GoldRule className="mx-auto mt-8" />

        {/* ── Selected profile headline ───────────────────────────── */}
        <div className="mt-8 text-center">
          <Eyebrow>Setting {String(index + 1).padStart(2, '0')} · {profile.mix}</Eyebrow>
          <h3 className="mt-3 font-serif text-4xl text-navy sm:text-5xl">{profile.name}</h3>
        </div>

        {/* ── Key figures ─────────────────────────────────────────── */}
        <div className="mt-8 grid grid-cols-1 gap-px overflow-hidden border border-hairline bg-hairline sm:grid-cols-3">
          <Stat
            label="Expected return / year"
            value={`${profile.expectedReturn.toFixed(1)}%`}
            tone="brass"
          />
          <Stat
            label="In a typical bad year"
            value={`${profile.typicalDownYear}%`}
            tone="warn"
          />
          <Stat
            label="HK$5M after 20 years*"
            value={fmtMoney(finalMid)}
            tone="navy"
          />
        </div>

        {/* ── Projection chart ────────────────────────────────────── */}
        <div className="mt-8">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <Eyebrow tone="muted">An illustrative HK$5,000,000, invested for 20 years</Eyebrow>
            <span className="text-[0.78rem] text-ink/45">
              Likely range: {fmtMoney(finalLow)} – {fmtMoney(finalHigh)}
            </span>
          </div>
          <div className="h-[280px] w-full sm:h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={data} margin={{ top: 8, right: 8, bottom: 4, left: 4 }}>
                <defs>
                  <linearGradient id="band" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#B0904F" stopOpacity={0.28} />
                    <stop offset="100%" stopColor="#B0904F" stopOpacity={0.08} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#D8D2C6" strokeDasharray="0" vertical={false} />
                <XAxis
                  dataKey="year"
                  ticks={[0, 5, 10, 15, 20]}
                  tickFormatter={(y) => `Yr ${y}`}
                  tick={{ fill: '#1C1C1C', fillOpacity: 0.5, fontSize: 11 }}
                  axisLine={{ stroke: '#D8D2C6' }}
                  tickLine={false}
                  dy={6}
                />
                <YAxis
                  tickFormatter={fmtAxis}
                  tick={{ fill: '#1C1C1C', fillOpacity: 0.5, fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  width={52}
                />
                <Tooltip content={<ChartTooltip />} cursor={{ stroke: '#0E1B2E', strokeOpacity: 0.2 }} />
                {/* invisible base, then the band on top of it */}
                <Area
                  dataKey="low"
                  stackId="band"
                  stroke="none"
                  fill="transparent"
                  isAnimationActive={false}
                  activeDot={false}
                />
                <Area
                  dataKey="range"
                  stackId="band"
                  stroke="none"
                  fill="url(#band)"
                  isAnimationActive={false}
                  activeDot={false}
                />
                <Line
                  dataKey="mid"
                  stroke="#0E1B2E"
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={false}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-1 text-center text-[0.72rem] text-ink/40">
            Navy line: the expected path. Shaded band: the range of likely outcomes.
          </p>
        </div>

        {/* ── Takeaways ───────────────────────────────────────────── */}
        <div className="mt-8 grid gap-4 sm:grid-cols-[1.4fr_1fr]">
          <div key={`take-${index}`} className="animate-fade-rise border border-hairline bg-bone p-6">
            <Eyebrow>In plain language</Eyebrow>
            <p className="mt-3 text-[1.04rem] leading-relaxed text-ink/85">{profile.takeaway}</p>
          </div>
          <div
            key={`fam-${index}`}
            className="animate-fade-rise border border-brass/30 bg-parchment/70 p-6"
          >
            <Eyebrow>The Tan view</Eyebrow>
            <p className="mt-3 text-[0.98rem] italic leading-relaxed text-navy/85">
              {profile.family}
            </p>
          </div>
        </div>

        <p className="mt-6 text-[0.72rem] leading-relaxed text-ink/40">
          *Illustrative only. Figures are simplified projections to convey the trade-off between risk
          and return — not a forecast, advice, or a representation of any real portfolio.
        </p>
      </div>
    </ModuleShell>
  )
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string
  value: string
  tone: 'brass' | 'warn' | 'navy'
}) {
  const color =
    tone === 'brass' ? 'text-brass-deep' : tone === 'warn' ? 'text-[#9a4a2f]' : 'text-navy'
  return (
    <div className="bg-bone px-5 py-6 text-center">
      <p className={`font-serif text-3xl tnum sm:text-4xl ${color}`}>{value}</p>
      <p className="label-caps mt-2 text-ink/45">{label}</p>
    </div>
  )
}

function ChartTooltip({ active, payload }: { active?: boolean; payload?: any[] }) {
  if (!active || !payload || !payload.length) return null
  const row = payload[0].payload as { year: number; low: number; mid: number; high: number }
  return (
    <div className="border border-hairline bg-bone px-4 py-3 shadow-lift">
      <p className="label-caps text-ink/45">After {row.year} years</p>
      <p className="mt-1 font-serif text-xl text-navy tnum">{fmtMoney(row.mid)}</p>
      <p className="mt-0.5 text-[0.72rem] text-ink/50 tnum">
        Range {fmtMoney(row.low)} – {fmtMoney(row.high)}
      </p>
    </div>
  )
}
