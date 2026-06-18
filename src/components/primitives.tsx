import type { ReactNode } from 'react'

// A letter-spaced, small-caps eyebrow label — the spine of the annual-report look.
export function Eyebrow({
  children,
  className = '',
  tone = 'brass',
}: {
  children: ReactNode
  className?: string
  tone?: 'brass' | 'navy' | 'muted'
}) {
  const color =
    tone === 'brass' ? 'text-brass-deep' : tone === 'navy' ? 'text-navy' : 'text-ink/45'
  return <span className={`label-caps ${color} ${className}`}>{children}</span>
}

// A short brass rule, used as a refined section divider.
export function GoldRule({ className = '' }: { className?: string }) {
  return <span className={`block h-px w-12 bg-brass/70 ${className}`} aria-hidden />
}

// A full-width hairline rule.
export function Hairline({ className = '' }: { className?: string }) {
  return <hr className={`border-0 border-t border-hairline ${className}`} />
}

// A family monogram — a quiet serif initial inside a hairline lozenge.
export function Monogram({ letter = 'N', className = '' }: { letter?: string; className?: string }) {
  return (
    <span
      className={`inline-grid place-items-center rounded-full border border-brass/60 text-brass-deep ${className}`}
      aria-hidden
    >
      <span className="font-serif leading-none" style={{ fontSize: '0.62em', marginTop: '0.04em' }}>
        {letter}
      </span>
    </span>
  )
}

// A standard primary / secondary / ghost action used across modules.
export function Action({
  children,
  onClick,
  variant = 'primary',
  type = 'button',
  disabled = false,
  className = '',
}: {
  children: ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'ghost'
  type?: 'button' | 'submit'
  disabled?: boolean
  className?: string
}) {
  const base =
    'inline-flex items-center justify-center gap-2 px-6 py-3 text-[0.82rem] tracking-wide font-medium transition-all duration-300 ease-quiet disabled:opacity-40 disabled:cursor-not-allowed'
  const styles =
    variant === 'primary'
      ? 'bg-navy text-bone hover:bg-navy-soft shadow-card'
      : variant === 'secondary'
        ? 'border border-navy/25 text-navy hover:border-navy/60 hover:bg-navy/[0.03]'
        : 'text-navy/70 hover:text-navy'
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${styles} ${className}`}
    >
      {children}
    </button>
  )
}

// A thin arrow glyph used in actions and links.
export function Arrow({ dir = 'right' }: { dir?: 'right' | 'left' }) {
  return (
    <svg
      width="18"
      height="10"
      viewBox="0 0 18 10"
      fill="none"
      aria-hidden
      className={dir === 'left' ? 'rotate-180' : ''}
    >
      <path
        d="M1 5h15M12 1l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
