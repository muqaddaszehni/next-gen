import { useParams } from 'react-router-dom'
import { useClients } from '../context/ClientsContext'
import type { ClientData } from '../data/types'

// Resolve the active client from the :clientId route param.
export function useActiveClient(): ClientData | undefined {
  const { clientId } = useParams<{ clientId: string }>()
  const { get } = useClients()
  return clientId ? get(clientId) : undefined
}

// Build a client-scoped hash route. sub is a module path like "story" ("" = home).
export function clientPath(clientId: string, sub = ''): string {
  return sub ? `/c/${clientId}/${sub}` : `/c/${clientId}`
}
