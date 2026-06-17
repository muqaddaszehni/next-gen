import { useMemo, useState } from 'react'
import {
  ReactFlow,
  Handle,
  Position,
  type Edge,
  type Node,
  type NodeProps,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { structureEdges, structureNodes, type StructureNodeData } from '../data/family'
import { ModuleShell } from '../components/ModuleShell'
import { Eyebrow, GoldRule } from '../components/primitives'

// ── Layout (canvas coordinates; React Flow fitView frames it) ───────────────
const layout: Record<string, { x: number; y: number; w: number; accent: NodeAccent }> = {
  family: { x: 340, y: 0, w: 230, accent: 'navy' },
  trust: { x: 340, y: 150, w: 230, accent: 'brass' },
  holding: { x: 150, y: 310, w: 230, accent: 'plain' },
  foundation: { x: 560, y: 310, w: 230, accent: 'brass' },
  property: { x: -40, y: 480, w: 185, accent: 'soft' },
  investments: { x: 185, y: 480, w: 185, accent: 'soft' },
  legacy: { x: 410, y: 480, w: 185, accent: 'soft' },
}

type NodeAccent = 'navy' | 'brass' | 'plain' | 'soft'

const REQUIRED_KEYS = ['trust', 'foundation']

export function Structure() {
  const [selected, setSelected] = useState<string | null>(null)
  const [viewed, setViewed] = useState<Set<string>>(() => new Set())

  const reveal = (key: string) => {
    setSelected(key)
    setViewed((prev) => (prev.has(key) ? prev : new Set(prev).add(key)))
  }

  const ready =
    REQUIRED_KEYS.every((k) => viewed.has(k)) && viewed.size >= 4

  const viewedSig = [...viewed].sort().join(',')

  const nodes = useMemo<Node[]>(
    () =>
      Object.values(structureNodes).map((d) => {
        const l = layout[d.key]
        return {
          id: d.key,
          type: 'structure',
          position: { x: l.x, y: l.y },
          data: {
            ...d,
            accent: l.accent,
            isSelected: selected === d.key,
            viewed: viewed.has(d.key),
          },
          style: { width: l.w },
          draggable: false,
          selectable: true,
        }
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selected, viewedSig],
  )

  const edges = useMemo<Edge[]>(
    () =>
      structureEdges.map(([source, target]) => ({
        id: `${source}-${target}`,
        source,
        target,
        type: 'smoothstep',
        animated: false,
      })),
    [],
  )

  const detail: StructureNodeData | null = selected ? structureNodes[selected] : null

  return (
    <ModuleShell
      moduleId="structure"
      ready={ready}
      gateHint={
        viewed.size === 0
          ? 'Tap a box in the diagram to learn what it does'
          : `Reveal the Trust and the Foundation to continue · ${
              REQUIRED_KEYS.filter((k) => viewed.has(k)).length
            }/2`
      }
      intro={
        <>
          <p>
            People imagine great wealth as a pile of money. In truth it’s an arrangement — a quiet
            architecture of containers, each with a job, built so that what your family made can be
            protected and passed on intact.
          </p>
          <p className="text-ink/60">
            Tap any box to see what it does in plain language. Be sure to open{' '}
            <span className="text-brass-deep">the Trust</span> and{' '}
            <span className="text-brass-deep">the Foundation</span> — the two ideas most worth
            knowing.
          </p>
        </>
      }
    >
      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        {/* ── The diagram ─────────────────────────────────────────── */}
        <div className="relative h-[440px] overflow-hidden border border-hairline bg-parchment/50 shadow-card sm:h-[520px]">
          <div className="pointer-events-none absolute left-4 top-4 z-10">
            <Eyebrow tone="muted">The Tan family structure</Eyebrow>
          </div>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onNodeClick={(_, node) => reveal(node.id)}
            fitView
            fitViewOptions={{ padding: 0.16 }}
            minZoom={0.4}
            maxZoom={1.3}
            nodesDraggable={false}
            nodesConnectable={false}
            elementsSelectable
            panOnDrag
            panOnScroll={false}
            zoomOnScroll={false}
            zoomOnDoubleClick={false}
            preventScrolling={false}
            proOptions={{ hideAttribution: true }}
          />
        </div>

        {/* ── The reveal panel ────────────────────────────────────── */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="min-h-[440px] border border-hairline bg-bone p-7 shadow-card sm:min-h-[520px] sm:p-8">
            {detail ? (
              <div key={detail.key} className="animate-fade-rise">
                <div className="flex items-center justify-between">
                  <Eyebrow>{detail.kind}</Eyebrow>
                  {detail.figure && (
                    <span className="font-serif text-lg text-brass-deep">{detail.figure}</span>
                  )}
                </div>
                <h3 className="mt-3 font-serif text-3xl leading-tight text-navy">{detail.title}</h3>
                <GoldRule className="mt-4" />

                <p className="label-caps mt-6 text-ink/40">What is this?</p>
                <p className="mt-2 text-[1.02rem] leading-relaxed text-ink/85">{detail.what}</p>

                <p className="label-caps mt-6 text-ink/40">For the Tans</p>
                <p className="mt-2 text-[1.02rem] leading-relaxed text-ink/75">{detail.detail}</p>
              </div>
            ) : (
              <div className="flex h-full min-h-[380px] flex-col items-center justify-center text-center sm:min-h-[440px]">
                <span className="grid h-14 w-14 place-items-center rounded-full border border-brass/40 text-brass-deep">
                  <TapGlyph />
                </span>
                <p className="mt-5 max-w-xs font-serif text-xl leading-snug text-navy">
                  Tap any part of the diagram to see what it does.
                </p>
                <p className="mt-3 max-w-xs text-sm text-ink/50">
                  Start with the Trust at the centre — it’s the keystone of everything here.
                </p>
              </div>
            )}
          </div>

          {/* Quick reveals for the two key concepts */}
          <div className="mt-4 flex flex-wrap gap-2">
            {(['trust', 'foundation'] as const).map((k) => (
              <button
                key={k}
                onClick={() => reveal(k)}
                className={`label-caps inline-flex items-center gap-2 border px-4 py-2.5 transition-colors duration-300 ${
                  viewed.has(k)
                    ? 'border-brass/40 bg-brass/5 text-brass-deep'
                    : 'border-navy/20 text-navy/70 hover:border-navy/50 hover:text-navy'
                }`}
              >
                {viewed.has(k) && <MiniCheck />}
                What is a {k === 'trust' ? 'trust' : 'foundation'}?
              </button>
            ))}
          </div>
        </aside>
      </div>
    </ModuleShell>
  )
}

// ── Custom node ─────────────────────────────────────────────────────────────
function StructureNode({ data }: NodeProps) {
  const d = data as unknown as StructureNodeData & {
    accent: NodeAccent
    isSelected: boolean
    viewed: boolean
  }

  const base =
    'group relative h-full border px-4 py-3.5 text-left transition-all duration-300 ease-quiet'
  const accent =
    d.accent === 'navy'
      ? 'bg-navy text-bone border-navy'
      : d.accent === 'brass'
        ? 'bg-parchment border-brass/50'
        : d.accent === 'soft'
          ? 'bg-bone border-hairline'
          : 'bg-parchment/80 border-hairline'

  const ring = d.isSelected
    ? 'shadow-lift -translate-y-0.5 ring-1 ring-brass'
    : 'shadow-card hover:-translate-y-0.5 hover:border-brass/50'

  const isDark = d.accent === 'navy'
  const kindColor = isDark ? 'text-brass' : 'text-brass-deep'
  const titleColor = isDark ? 'text-bone' : 'text-navy'
  const shortColor = isDark ? 'text-bone/70' : 'text-ink/55'

  return (
    <div className={`${base} ${accent} ${ring}`}>
      <Handle type="target" position={Position.Top} />
      <div className="flex items-start justify-between gap-2">
        <span className={`label-caps ${kindColor}`}>{d.kind}</span>
        {d.viewed && (
          <span className={isDark ? 'text-brass' : 'text-brass-deep'}>
            <MiniCheck />
          </span>
        )}
      </div>
      <p className={`mt-1.5 font-serif text-[1.18rem] leading-tight ${titleColor}`}>{d.title}</p>
      <p className={`mt-1 text-[0.74rem] leading-snug ${shortColor}`}>{d.short}</p>
      <Handle type="source" position={Position.Bottom} />
    </div>
  )
}

const nodeTypes = { structure: StructureNode }

function MiniCheck() {
  return (
    <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden>
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

function TapGlyph() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M9 11V6a2 2 0 0 1 4 0v6m0-2a2 2 0 0 1 4 0v2m0-1a2 2 0 0 1 4 0v4a6 6 0 0 1-6 6h-2a6 6 0 0 1-5-2.7L5 16c-.8-1.2.9-2.6 2-1.6l1 1"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
