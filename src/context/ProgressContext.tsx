import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { modules } from '../data/app'

const keyFor = (clientId: string) => `next-gen.progress.v1.${clientId}`

interface ProgressState {
  completed: Record<string, boolean>
  markComplete: (id: string) => void
  reset: () => void
  isComplete: (id: string) => boolean
  completedCount: number
  total: number
  ratio: number
  allComplete: boolean
  nextModuleId: string | null
}

const ProgressContext = createContext<ProgressState | null>(null)

function load(clientId: string): Record<string, boolean> {
  try {
    const raw = localStorage.getItem(keyFor(clientId))
    if (!raw) return {}
    const parsed = JSON.parse(raw)
    return typeof parsed === 'object' && parsed ? parsed : {}
  } catch {
    return {}
  }
}

// Progress is namespaced per client, so two clients never collide.
export function ProgressProvider({
  clientId,
  children,
}: {
  clientId: string
  children: ReactNode
}) {
  const [completed, setCompleted] = useState<Record<string, boolean>>(() => load(clientId))

  // Re-read when switching client.
  useEffect(() => {
    setCompleted(load(clientId))
  }, [clientId])

  useEffect(() => {
    try {
      localStorage.setItem(keyFor(clientId), JSON.stringify(completed))
    } catch {
      /* storage unavailable */
    }
  }, [clientId, completed])

  const markComplete = useCallback((id: string) => {
    setCompleted((prev) => (prev[id] ? prev : { ...prev, [id]: true }))
  }, [])

  const reset = useCallback(() => setCompleted({}), [])

  const value = useMemo<ProgressState>(() => {
    const completedCount = modules.filter((m) => completed[m.id]).length
    const total = modules.length
    const firstUnfinished = modules.find((m) => !completed[m.id])
    return {
      completed,
      markComplete,
      reset,
      isComplete: (id: string) => Boolean(completed[id]),
      completedCount,
      total,
      ratio: total ? completedCount / total : 0,
      allComplete: completedCount === total,
      nextModuleId: firstUnfinished ? firstUnfinished.id : null,
    }
  }, [completed, markComplete, reset])

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>
}

export function useProgress(): ProgressState {
  const ctx = useContext(ProgressContext)
  if (!ctx) throw new Error('useProgress must be used within ProgressProvider')
  return ctx
}
