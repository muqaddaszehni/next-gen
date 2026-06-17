// Minimal brass line-art motifs for the family-story timeline.
// One per chapter, drawn at 1px to match the hairline aesthetic.

const paths: Record<string, JSX.Element> = {
  boat: (
    <>
      <path d="M4 22h24l-3 6H7l-3-6Z" />
      <path d="M16 6v14M16 6l8 4-8 3" />
    </>
  ),
  shop: (
    <>
      <path d="M5 13h22v15H5z" />
      <path d="M4 7h24l2 6H2l2-6Z" />
      <path d="M13 28v-7h6v7" />
    </>
  ),
  factory: (
    <>
      <path d="M4 28V14l7 4v-4l7 4V10h10v18H4Z" />
      <path d="M22 14v0M22 20v0M16 20v0M10 20v0" />
    </>
  ),
  tower: (
    <>
      <path d="M9 28V6h14v22" />
      <path d="M13 11h2M19 11h2M13 16h2M19 16h2M13 21h2M19 21h2" />
      <path d="M4 28h24" />
    </>
  ),
  umbrella: (
    <>
      <path d="M16 6c8 0 12 6 12 9H4c0-3 4-9 12-9Z" />
      <path d="M16 15v9a3 3 0 0 0 5 0" />
    </>
  ),
  shield: (
    <>
      <path d="M16 4l11 4v8c0 7-5 11-11 13C10 27 5 23 5 16V8l11-4Z" />
      <path d="M11 16l4 4 7-8" />
    </>
  ),
  diversify: (
    <>
      <path d="M16 16V5M16 16l9 5M16 16l-9 5" />
      <circle cx="16" cy="5" r="2.4" />
      <circle cx="25" cy="22" r="2.4" />
      <circle cx="7" cy="22" r="2.4" />
    </>
  ),
  lock: (
    <>
      <path d="M7 14h18v14H7z" />
      <path d="M11 14v-4a5 5 0 0 1 10 0v4" />
      <path d="M16 20v3" />
    </>
  ),
  wave: (
    <>
      <path d="M4 13c3-3 6-3 9 0M19 13c3-3 6-3 9 0" />
      <path d="M4 20c3-3 6-3 9 0s6 3 9 0 3-3 6 0" />
      <path d="M16 4v5" />
    </>
  ),
  star: (
    <>
      <path d="M16 4l3.2 8.2L28 13l-6.4 5.4L23.6 28 16 23l-7.6 5 2-9.6L4 13l8.8-.8L16 4Z" />
    </>
  ),
}

const order = ['boat', 'shop', 'factory', 'tower', 'umbrella', 'shield', 'diversify', 'lock', 'wave', 'star']

export function StoryIcon({ index, className = '' }: { index: number; className?: string }) {
  const key = order[index % order.length]
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.1"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {paths[key]}
    </svg>
  )
}
