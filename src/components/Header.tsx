import { Link } from 'react-router-dom'
import { useProgress } from '../context/ProgressContext'
import { clientPath } from '../lib/nav'
import type { ClientData } from '../data/types'
import { Monogram } from './primitives'

// Header for client-facing screens — shows the family brand and overall progress.
export function ClientHeader({ client }: { client: ClientData }) {
  return (
    <Shell
      to={clientPath(client.id)}
      monogram={client.branding.monogram}
      subtitle={`The ${client.branding.familyName} Family`}
      right={
        <div className="flex items-center gap-5">
          <HeaderProgress />
          <Link to="/" className="label-caps text-navy/70 transition-colors hover:text-navy">
            All clients
          </Link>
        </div>
      }
    />
  )
}

// Header for the picker / onboarding screens — no active client, no progress.
export function AppHeader() {
  return (
    <Shell
      to="/"
      monogram="·"
      subtitle="Family programmes"
      right={
        <Link to="/" className="label-caps text-navy/70 transition-colors hover:text-navy">
          All clients
        </Link>
      }
    />
  )
}

function Shell({
  to,
  monogram,
  subtitle,
  right,
}: {
  to: string
  monogram: string
  subtitle: string
  right: React.ReactNode
}) {
  return (
    <header className="sticky top-0 z-30 border-b border-hairline bg-bone/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-page items-center justify-between px-5 py-4 sm:px-8">
        <Link to={to} className="group flex items-center gap-3">
          <Monogram letter={monogram} className="h-9 w-9 text-[1.4rem] transition-colors group-hover:border-brass" />
          <span className="flex flex-col leading-none">
            <span className="font-serif text-[1.35rem] text-navy">Next Gen</span>
            <span className="label-caps mt-1 text-ink/40">{subtitle}</span>
          </span>
        </Link>
        {right}
      </div>
    </header>
  )
}

function HeaderProgress() {
  const { completedCount, total } = useProgress()
  return (
    <div className="hidden items-center gap-2.5 sm:flex">
      <span className="label-caps text-ink/40">Progress</span>
      <span className="label-caps tnum text-brass-deep">
        {completedCount} / {total}
      </span>
    </div>
  )
}
