import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Services from './pages/Services'
import Portfolio from './pages/Portfolio'
import About from './pages/About'
import Book from './pages/Book'
import Contact from './pages/Contact'
import StyleQuiz from './pages/StyleQuiz'
import VirtualTryOn from './pages/VirtualTryOn'
import CreativeLab from './pages/CreativeLab'
import Admin from './pages/Admin'

export default function App() {
  const navigate = useNavigate()
  const location = useLocation()
  const isAdmin = location.pathname === '/admin'
  const onNavigate = (tab: string) => navigate(`/${tab}`)

  return (
    <div className="min-h-screen flex flex-col">
      {!isAdmin && <Header />}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home onNavigate={onNavigate} />} />
          <Route path="/about" element={<About />} />
          <Route path="/book" element={<Book />} />
          <Route path="/services" element={<Services onNavigate={onNavigate} />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/style-quiz" element={<StyleQuiz />} />
          <Route path="/creative-lab" element={<CreativeLab />} />
          <Route path="/style-quiz" element={<StyleQuiz />} />
          <Route path="/virtual-try-on" element={<VirtualTryOn />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
      {!isAdmin && <Footer />}
    </div>
  )
}
