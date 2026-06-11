import { Link } from 'react-router-dom'
import { Mail, MapPin, Camera } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-brand-black text-brand-cream">
      <div className="max-w-7xl mx-auto px-[var(--page-gutter)] py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {/* Brand */}
          <div>
            <Link to="/" className="font-serif text-2xl text-white">
              Beauty By <span className="text-brand-gold">Joann</span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-brand-taupe max-w-xs">
              Professional makeup artistry for film, television, editorial,
              fashion, and bridal. Every look crafted for the camera.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs uppercase tracking-[0.2em] text-brand-gold mb-4">
              Navigate
            </h3>
            <ul className="space-y-3">
              {[
                { label: 'Services', href: '/services' },
                { label: 'Portfolio', href: '/portfolio' },
                { label: 'Contact', href: '/contact' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-brand-cream/70 hover:text-brand-gold transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xs uppercase tracking-[0.2em] text-brand-gold mb-4">
              Connect
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:hello@beautybyjoann.com"
                  className="flex items-center gap-2 text-sm text-brand-cream/70 hover:text-brand-gold transition-colors duration-300"
                >
                  <Mail size={14} />
                  hello@beautybyjoann.com
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center gap-2 text-sm text-brand-cream/70 hover:text-brand-gold transition-colors duration-300"
                >
                  <Camera size={14} />
                  @beautybyjoann
                </a>
              </li>
              <li>
                <span className="flex items-center gap-2 text-sm text-brand-cream/70">
                  <MapPin size={14} />
                  Based in Nigeria
                </span>
              </li>
              <li className="pt-2 mt-2 border-t border-brand-charcoal/30">
                <Link
                  to="/admin"
                  className="flex items-center gap-2 text-xs text-brand-taupe/50 hover:text-brand-gold transition-colors duration-300"
                >
                  Admin Panel
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-brand-charcoal/50 text-center text-xs text-brand-taupe">
          &copy; {currentYear} Beauty By Joann. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
