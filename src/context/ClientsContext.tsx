import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  loadUserClients,
  saveUserClients,
  seedClients,
  seedIds,
} from '../data/clients'
import type { ClientData } from '../data/types'

interface ClientsState {
  clients: ClientData[] // seeds first, then user clients
  userClients: ClientData[]
  get: (id: string) => ClientData | undefined
  create: (client: ClientData) => void
  remove: (id: string) => void
  isSeed: (id: string) => boolean
}

const ClientsContext = createContext<ClientsState | null>(null)

export function ClientsProvider({ children }: { children: ReactNode }) {
  const [userClients, setUserClients] = useState<ClientData[]>(loadUserClients)

  useEffect(() => {
    saveUserClients(userClients)
  }, [userClients])

  const create = useCallback((client: ClientData) => {
    setUserClients((prev) => {
      const without = prev.filter((c) => c.id !== client.id)
      return [...without, client]
    })
  }, [])

  const remove = useCallback((id: string) => {
    if (seedIds.has(id)) return // seeds can't be deleted
    setUserClients((prev) => prev.filter((c) => c.id !== id))
  }, [])

  const value = useMemo<ClientsState>(() => {
    const clients = [...seedClients, ...userClients]
    return {
      clients,
      userClients,
      get: (id) => clients.find((c) => c.id === id),
      create,
      remove,
      isSeed: (id) => seedIds.has(id),
    }
  }, [userClients, create, remove])

  return <ClientsContext.Provider value={value}>{children}</ClientsContext.Provider>
}

export function useClients(): ClientsState {
  const ctx = useContext(ClientsContext)
  if (!ctx) throw new Error('useClients must be used within ClientsProvider')
  return ctx
}
