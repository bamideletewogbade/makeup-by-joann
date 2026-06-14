import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Header from './components/Header'
import Footer from './components/Footer'
import AmbientGlow from './components/AmbientGlow'
import ScrollProgress from './components/ScrollProgress'
import Home from './pages/Home'
import Services from './pages/Services'
import Portfolio from './pages/Portfolio'
import About from './pages/About'
import Book from './pages/Book'
import Contact from './pages/Contact'
import StyleQuiz from './pages/StyleQuiz'
import VirtualTryOn from './pages/VirtualTryOn'
import CreativeLab from './pages/CreativeLab'
import Blog from './pages/Blog'
import Admin from './pages/Admin'

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.25, ease: 'easeIn' } },
}

function AnimatedPage({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {children}
    </motion.div>
  )
}

export default function App() {
  const navigate = useNavigate()
  const location = useLocation()
  const isAdmin = location.pathname === '/admin'
  const onNavigate = (tab: string) => navigate(`/${tab}`)

  return (
    <div className="min-h-screen flex flex-col">
      {!isAdmin && (
        <>
          <Header />
          <ScrollProgress />
        </>
      )}
      {/* Ambient background glow that works on mobile */}
      <AmbientGlow mobileOnly zIndex={-1} />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<AnimatedPage><Home onNavigate={onNavigate} /></AnimatedPage>} />
            <Route path="/about" element={<AnimatedPage><About /></AnimatedPage>} />
            <Route path="/book" element={<AnimatedPage><Book /></AnimatedPage>} />
            <Route path="/services" element={<AnimatedPage><Services onNavigate={onNavigate} /></AnimatedPage>} />
            <Route path="/portfolio" element={<AnimatedPage><Portfolio /></AnimatedPage>} />
            <Route path="/contact" element={<AnimatedPage><Contact /></AnimatedPage>} />
            <Route path="/style-quiz" element={<AnimatedPage><StyleQuiz /></AnimatedPage>} />
            <Route path="/creative-lab" element={<AnimatedPage><CreativeLab /></AnimatedPage>} />
            <Route path="/virtual-try-on" element={<AnimatedPage><VirtualTryOn /></AnimatedPage>} />
            <Route path="/blog" element={<AnimatedPage><Blog /></AnimatedPage>} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </AnimatePresence>
      </main>
      {!isAdmin && <Footer />}
    </div>
  )
}
