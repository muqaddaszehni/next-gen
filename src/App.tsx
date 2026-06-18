import { useEffect } from 'react'
import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { AppHeader, ClientHeader } from './components/Header'
import { Footer } from './components/Footer'
import { ProgressProvider } from './context/ProgressContext'
import { useActiveClient } from './lib/nav'
import { ClientPicker } from './modules/ClientPicker'
import { AddClient } from './modules/onboard/AddClient'
import { Settings } from './modules/Settings'
import { Home } from './modules/Home'
import { FamilyStory } from './modules/FamilyStory'
import { Structure } from './modules/Structure'
import { InvestingBasics } from './modules/InvestingBasics'
import { GivingBack } from './modules/GivingBack'
import { YourRole } from './modules/YourRole'
import { Completion } from './modules/Completion'

// Layout for the picker / onboarding screens (no active client).
function RootLayout() {
  useEffect(() => {
    document.title = 'Next Gen · Family programmes'
  }, [])
  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader />
      <main className="flex-1 pb-4">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

// Layout for a specific client's modules — provides namespaced progress + brand.
function ClientLayout() {
  const client = useActiveClient()

  useEffect(() => {
    if (client) document.title = `Next Gen · The ${client.branding.familyName} Family`
  }, [client])

  if (!client) return <Navigate to="/" replace />

  return (
    <ProgressProvider clientId={client.id}>
      <div className="flex min-h-screen flex-col">
        <ClientHeader client={client} />
        <main className="flex-1 pb-4">
          <Outlet />
        </main>
        <Footer familyName={client.branding.familyName} />
      </div>
    </ProgressProvider>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<RootLayout />}>
        <Route index element={<ClientPicker />} />
        <Route path="new" element={<AddClient />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      <Route path="/c/:clientId" element={<ClientLayout />}>
        <Route index element={<Home />} />
        <Route path="story" element={<FamilyStory />} />
        <Route path="structure" element={<Structure />} />
        <Route path="investing" element={<InvestingBasics />} />
        <Route path="giving" element={<GivingBack />} />
        <Route path="role" element={<YourRole />} />
        <Route path="complete" element={<Completion />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
