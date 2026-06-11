import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, Check } from 'lucide-react'

const SERVICE_OPTIONS = [
  'Film & Television',
  'Editorial / Commercial',
  'Fashion Show',
  'Bridal',
  'Creative / SFX',
  'Consultation',
  'Other',
]

export default function Contact() {
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    const form = e.currentTarget
    const data = {
      name: (form.elements.namedItem('name') as HTMLInputElement).value,
      email: (form.elements.namedItem('email') as HTMLInputElement).value,
      service: (form.elements.namedItem('service') as HTMLSelectElement).value,
      date: (form.elements.namedItem('date') as HTMLInputElement).value,
      message: (form.elements.namedItem('message') as HTMLTextAreaElement).value,
    }

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (res.ok) {
        setSubmitted(true)
        setTimeout(() => setSubmitted(false), 5000)
      } else {
        setError('Something went wrong. Please try again.')
      }
    } catch {
      setError('Unable to reach the server. Please try again later.')
    }
  }

  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-20 w-full px-[var(--page-gutter)] bg-brand-black text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-3xl mx-auto"
        >
          <p className="text-brand-gold text-sm uppercase tracking-[0.2em] mb-4">
            Get In Touch
          </p>
          <h1 className="font-serif text-4xl md:text-6xl text-white leading-tight">
            Let&apos;s Create{" "}
            <span className="text-brand-gold">Together</span>
          </h1>
          <p className="mt-6 text-lg text-brand-taupe leading-relaxed">
            Whether you&apos;re producing a film, planning a wedding, or
            conceptualizing an editorial — I&apos;d love to hear about your
            project.
          </p>
        </motion.div>
      </section>

      {/* Contact Form */}
      <section className="py-20 px-[var(--page-gutter)]">
        <div className="max-w-2xl mx-auto">
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16"
            >
              <Check size={48} className="mx-auto text-brand-gold" />
              <h3 className="mt-6 font-serif text-2xl text-brand-black">
                Message Sent
              </h3>
              <p className="mt-2 text-brand-taupe">
                Thank you for reaching out. Joann will respond within 24 hours.
              </p>
            </motion.div>
          ) : (
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs uppercase tracking-[0.15em] text-brand-charcoal mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="w-full px-4 py-3 bg-white border border-brand-cream focus:border-brand-gold outline-none transition-colors text-sm"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-[0.15em] text-brand-charcoal mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    className="w-full px-4 py-3 bg-white border border-brand-cream focus:border-brand-gold outline-none transition-colors text-sm"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-[0.15em] text-brand-charcoal mb-2">
                  Service Interested In
                </label>
                <select
                  name="service"
                  className="w-full px-4 py-3 bg-white border border-brand-cream focus:border-brand-gold outline-none transition-colors text-sm text-brand-charcoal"
                >
                  <option value="">Select a service</option>
                  {SERVICE_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-[0.15em] text-brand-charcoal mb-2">
                  Event Date
                </label>
                <input
                  type="date"
                  name="date"
                  className="w-full px-4 py-3 bg-white border border-brand-cream focus:border-brand-gold outline-none transition-colors text-sm"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-[0.15em] text-brand-charcoal mb-2">
                  Tell Me About Your Project
                </label>
                <textarea
                  name="message"
                  rows={5}
                  required
                  className="w-full px-4 py-3 bg-white border border-brand-cream focus:border-brand-gold outline-none transition-colors text-sm resize-none"
                  placeholder="Describe your vision, event details, and any questions you have..."
                />
              </div>

              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}

              <button
                type="submit"
                className="w-full py-4 bg-brand-black text-white text-sm uppercase tracking-[0.15em] hover:bg-brand-charcoal transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <Send size={16} />
                Send Message
              </button>
            </motion.form>
          )}
        </div>
      </section>
    </>
  )
}
