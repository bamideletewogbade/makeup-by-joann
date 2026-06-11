import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'

const NAV_ITEMS = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Creative Lab', href: '/creative-lab' },
  { label: 'Contact', href: '/contact' },
]

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsMenuOpen(false)
  }, [location])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-brand-warm-white/95 backdrop-blur-md shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-[var(--page-gutter)] py-4 flex items-center justify-between">
        <Link
          to="/"
          className={`font-serif text-xl md:text-2xl tracking-wide transition-colors duration-300 ${
            isScrolled ? 'text-brand-black' : 'text-white'
          }`}
        >
          Beauty By <span className="text-brand-gold">Joann</span>
        </Link>

        {/* Desktop Nav Items - centered */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.href
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`relative text-sm uppercase tracking-[0.15em] transition-colors duration-300 after:absolute after:bottom-0 after:left-0 after:h-[1px] after:bg-brand-gold after:transition-all after:duration-300 hover:after:w-full ${
                  isActive
                    ? 'text-brand-gold after:w-full'
                    : isScrolled
                      ? 'text-brand-charcoal hover:text-brand-gold after:w-0'
                      : 'text-white/80 hover:text-white after:w-0'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </div>

        {/* Desktop Book Now - far right */}
        <div className="hidden md:block">
          <Link
            to="/book"
            className={`px-6 py-2.5 text-sm uppercase tracking-[0.15em] transition-all duration-300 active:scale-[0.96] ${
              isScrolled
                ? 'text-white bg-brand-black hover:bg-brand-charcoal'
                : 'text-brand-black bg-primary hover:bg-primary/90'
            }`}
          >
            Book Now
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={`md:hidden p-2 transition-colors duration-300 ${
            isScrolled ? 'text-brand-black' : 'text-white'
          }`}
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden bg-brand-warm-white/98 backdrop-blur-md border-t border-brand-cream"
          >
            <div className="px-[var(--page-gutter)] py-6 flex flex-col gap-4">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`text-lg uppercase tracking-[0.15em] transition-colors ${
                    location.pathname === item.href
                      ? 'text-brand-gold'
                      : 'text-brand-charcoal hover:text-brand-gold'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                to="/book"
                className="mt-2 px-6 py-3 text-center text-sm uppercase tracking-[0.15em] text-white bg-brand-black hover:bg-brand-charcoal transition-all"
              >
                Book Now
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
