import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import ElectionTimeline from './pages/ElectionTimeline'
import HowToVote from './pages/HowToVote'
import Assistant from './pages/Assistant'
import Quiz from './pages/Quiz'
import Glossary from './pages/Glossary'
import Dashboard from './pages/Dashboard'

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/timeline" element={<ElectionTimeline />} />
            <Route path="/how-to-vote" element={<HowToVote />} />
            <Route path="/assistant" element={<Assistant />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/glossary" element={<Glossary />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App
