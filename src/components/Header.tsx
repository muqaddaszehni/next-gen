import { Link, useLocation } from 'react-router-dom'
import { useProgress } from '../context/ProgressContext'
import { Monogram } from './primitives'

export function Header() {
  const location = useLocation()
  const { completedCount, total } = useProgress()
  const onHome = location.pathname === '/'

  return (
    <header className="sticky top-0 z-30 border-b border-hairline bg-bone/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-page items-center justify-between px-5 py-4 sm:px-8">
        <Link to="/" className="group flex items-center gap-3">
          <Monogram className="h-9 w-9 text-[1.4rem] transition-colors group-hover:border-brass" />
          <span className="flex flex-col leading-none">
            <span className="font-serif text-[1.35rem] text-navy">Next Gen</span>
            <span className="label-caps mt-1 text-ink/40">The Tan Family</span>
          </span>
        </Link>

        <div className="flex items-center gap-5">
          <div className="hidden items-center gap-2.5 sm:flex">
            <span className="label-caps text-ink/40">Progress</span>
            <span className="label-caps tnum text-brass-deep">
              {completedCount} / {total}
            </span>
          </div>
          {!onHome && (
            <Link
              to="/"
              className="label-caps text-navy/70 transition-colors hover:text-navy"
            >
              All modules
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
