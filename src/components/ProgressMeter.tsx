import { useProgress } from '../context/ProgressContext'
import { modules } from '../data/family'

// A refined segmented progress meter — one hairline segment per module,
// filling brass as modules are completed.
export function ProgressMeter({
  showLabel = true,
  className = '',
}: {
  showLabel?: boolean
  className?: string
}) {
  const { completedCount, total, isComplete } = useProgress()

  return (
    <div className={className}>
      {showLabel && (
        <div className="mb-2 flex items-baseline justify-between">
          <span className="label-caps text-ink/45">Your progress</span>
          <span className="label-caps tnum text-brass-deep">
            {completedCount} / {total}
          </span>
        </div>
      )}
      <div className="flex gap-1.5">
        {modules.map((m) => (
          <span
            key={m.id}
            className={`h-[3px] flex-1 rounded-full transition-colors duration-700 ease-quiet ${
              isComplete(m.id) ? 'bg-brass' : 'bg-hairline'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
