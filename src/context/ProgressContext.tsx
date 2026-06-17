import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { modules } from '../data/family'

const STORAGE_KEY = 'next-gen.progress.v1'

interface ProgressState {
  completed: Record<string, boolean>
  markComplete: (id: string) => void
  reset: () => void
  isComplete: (id: string) => boolean
  completedCount: number
  total: number
  ratio: number
  allComplete: boolean
  nextModulePath: string | null
}

const ProgressContext = createContext<ProgressState | null>(null)

function load(): Record<string, boolean> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw)
    return typeof parsed === 'object' && parsed ? parsed : {}
  } catch {
    return {}
  }
}

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [completed, setCompleted] = useState<Record<string, boolean>>(load)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(completed))
    } catch {
      /* storage unavailable — progress simply won't persist */
    }
  }, [completed])

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
      nextModulePath: firstUnfinished ? firstUnfinished.path : null,
    }
  }, [completed, markComplete, reset])

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>
}

export function useProgress(): ProgressState {
  const ctx = useContext(ProgressContext)
  if (!ctx) throw new Error('useProgress must be used within ProgressProvider')
  return ctx
}
