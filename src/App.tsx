import { Navigate, Route, Routes } from 'react-router-dom'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { Home } from './modules/Home'
import { FamilyStory } from './modules/FamilyStory'
import { Structure } from './modules/Structure'
import { InvestingBasics } from './modules/InvestingBasics'
import { GivingBack } from './modules/GivingBack'
import { YourRole } from './modules/YourRole'
import { Completion } from './modules/Completion'

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 pb-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/story" element={<FamilyStory />} />
          <Route path="/structure" element={<Structure />} />
          <Route path="/investing" element={<InvestingBasics />} />
          <Route path="/giving" element={<GivingBack />} />
          <Route path="/role" element={<YourRole />} />
          <Route path="/complete" element={<Completion />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
