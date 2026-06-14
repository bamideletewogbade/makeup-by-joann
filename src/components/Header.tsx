import { useState, useEffect, useRef } from 'react'
import { Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import CursorGlow from './CursorGlow'

const NAV_ITEMS = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Blog', href: '/blog' },
  { label: 'Creative Lab', href: '/creative-lab' },
  { label: 'Contact', href: '/contact' },
]

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const navRef = useRef<HTMLDivElement>(null)
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
      <nav
        ref={navRef}
        className="relative max-w-7xl mx-auto px-[var(--page-gutter)] py-4 flex items-center justify-between overflow-hidden"
      >
        {/* Nav glow effect - using CursorGlow for composited performance */}
        <CursorGlow
          color="rgba(212, 163, 115, 0.06)"
          size={600}
          opacity={1}
          zIndex={0}
        />

        <Link
          to="/"
          className={`relative font-serif text-xl md:text-2xl tracking-wide transition-all duration-300 hover:tracking-wider z-10 ${
            isScrolled ? 'text-brand-black' : 'text-white'
          }`}
        >
          Beauty By <span className="text-brand-gold">Joann</span>
        </Link>

        {/* Desktop Nav Items */}
        <div className="hidden md:flex items-center gap-1 z-10">
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.href
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`relative px-4 py-2 text-sm uppercase tracking-[0.15em] transition-all duration-300 rounded-lg group/link ${
                  isActive
                    ? 'text-brand-gold'
                    : isScrolled
                      ? 'text-brand-charcoal hover:text-brand-gold'
                      : 'text-white/80 hover:text-white'
                }`}
              >
                {/* Active indicator glow with spring animation */}
                {isActive && (
                  <motion.span
                    layoutId="navGlow"
                    className="absolute inset-0 bg-brand-gold/10 rounded-lg border border-brand-gold/20"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                {/* Hover glow */}
                <span className="absolute inset-0 rounded-lg opacity-0 group-hover/link:opacity-100 transition-opacity duration-300 bg-white/5" />
                {/* Underline that animates on hover */}
                <span
                  className={`absolute bottom-1 left-4 right-4 h-[1.5px] bg-brand-gold transition-all duration-300 ${
                    isActive ? 'scale-x-100' : 'scale-x-0 group-hover/link:scale-x-100'
                  }`}
                />
                <span className="relative z-10">{item.label}</span>
              </Link>
            )
          })}
        </div>

        {/* Desktop Book Now */}
        <div className="hidden md:block z-10">
          <Link
            to="/book"
            className={`relative px-6 py-2.5 text-sm uppercase tracking-[0.15em] transition-all duration-300 active:scale-[0.96] overflow-hidden group/btn ${
              isScrolled
                ? 'text-white bg-brand-black hover:bg-brand-charcoal'
                : 'text-brand-black bg-primary hover:bg-primary/90'
            }`}
          >
            {/* Button shine effect */}
            <span className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg]" />
            Book Now
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={`md:hidden p-2 transition-all duration-300 hover:scale-110 active:scale-95 z-10 ${
            isScrolled ? 'text-brand-black' : 'text-white'
          }`}
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
        >
          <motion.div
            animate={{ rotate: isMenuOpen ? 90 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.div>
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
            <div className="px-[var(--page-gutter)] py-6 flex flex-col gap-2">
              {NAV_ITEMS.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    to={item.href}
                    className={`block px-4 py-3 text-lg uppercase tracking-[0.15em] transition-all duration-200 rounded-xl ${
                      location.pathname === item.href
                        ? 'text-brand-gold bg-brand-gold/5 border border-brand-gold/15'
                        : 'text-brand-charcoal hover:text-brand-gold hover:bg-white/50'
                    }`}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="mt-3"
              >
                <Link
                  to="/book"
                  className="block px-6 py-3.5 text-center text-sm uppercase tracking-[0.15em] text-white bg-brand-black hover:bg-brand-charcoal transition-all rounded-xl"
                >
                  Book Now
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
