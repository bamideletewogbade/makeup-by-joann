import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Mail, User, Info, CheckCircle, Wand2, RefreshCw } from 'lucide-react';

export default function Book() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    event_date: '',
    event_type: 'wedding',
    budget_range: '200_500',
    promo_code: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<{ score: number; tags: string[] } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error("Inquiry failed");
      const data = await response.json();

      if (data.success && data.inquiry) {
        setSubmitted(true);
        setAiFeedback({
          score: data.inquiry.score || 50,
          tags: data.inquiry.ai_tags || []
        });
      }
    } catch (error) {
      console.error("Booking inquiry failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      name: '',
      email: '',
      event_date: '',
      event_type: 'wedding',
      budget_range: '200_500',
      promo_code: '',
      message: ''
    });
    setSubmitted(false);
    setAiFeedback(null);
  };

  return (
    <div className="bg-background text-foreground min-h-screen pt-32 pb-24">
      <div className="w-full px-6">
        
        {/* Header */}
        <div className="text-center mb-12 space-y-4">
          <span className="text-primary uppercase tracking-widest text-xs font-semibold font-mono">
            Booking &amp; Reservation Portal
          </span>
          <h1 className="font-heading text-4xl sm:text-5xl font-medium tracking-tight">
            Initiate a <span className="italic font-serif text-primary">Consultation</span>
          </h1>
          <div className="w-16 h-[1.5px] bg-primary mx-auto my-2"></div>
          <p className="text-xs text-gray-400 font-light max-w-md mx-auto leading-relaxed">
            Submit your production scope, event outline, or bridal timeline. Our AI triage system prioritizes requests based on scope.
          </p>
        </div>

        {/* Content Container */}
        <div className="bg-[#111] border border-white/5 rounded-3xl p-8 shadow-2xl relative overflow-hidden text-left">
          
          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.form
                key="booking-form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono font-bold">Your Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Sarah Adeleke"
                        value={formData.name}
                        onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-[#FAF7F2] focus:outline-none focus:border-primary placeholder:text-zinc-700"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono font-bold">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
                      <input
                        type="email"
                        required
                        placeholder="name@domain.com"
                        value={formData.email}
                        onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-[#FAF7F2] focus:outline-none focus:border-primary placeholder:text-zinc-700"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {/* Event Date */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono font-bold">Event Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
                      <input
                        type="date"
                        required
                        value={formData.event_date}
                        onChange={e => setFormData(prev => ({ ...prev, event_date: e.target.value }))}
                        className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-[#FAF7F2] focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>

                  {/* Event Type */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono font-bold">Event Type</label>
                    <select
                      value={formData.event_type}
                      onChange={e => setFormData(prev => ({ ...prev, event_type: e.target.value }))}
                      className="w-full bg-black/40 border border-white/10 rounded-xl py-3.5 px-4 text-sm text-[#FAF7F2] focus:outline-none focus:border-primary"
                    >
                      <option value="wedding">Wedding / Bridal Glam</option>
                      <option value="film_production">Film &amp; Television Set</option>
                      <option value="editorial_shoot">High-Fashion Editorial</option>
                      <option value="creative_glam">Creative &amp; SFX Character</option>
                      <option value="other">Other Luxury Inquiries</option>
                    </select>
                  </div>

                  {/* Budget Choice */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono font-bold">Estimated Budget Choice</label>
                    <select
                      value={formData.budget_range}
                      onChange={e => setFormData(prev => ({ ...prev, budget_range: e.target.value }))}
                      className="w-full bg-black/40 border border-white/10 rounded-xl py-3.5 px-4 text-sm text-[#FAF7F2] focus:outline-none focus:border-primary"
                    >
                      <option value="under_200">Under $200</option>
                      <option value="200_500">$200 - $500</option>
                      <option value="500_1000">$500 - $1,000</option>
                      <option value="over_1000">$1,000+ (Production scope)</option>
                    </select>
                  </div>
                </div>

                {/* Promo Code */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono font-bold">Artistry Lab Promo Code (Optional)</label>
                  <input
                    type="text"
                    placeholder="Enter code won in Matchmaster game"
                    value={formData.promo_code}
                    onChange={e => setFormData(prev => ({ ...prev, promo_code: e.target.value }))}
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-sm text-[#FAF7F2] focus:outline-none focus:border-primary uppercase placeholder:text-zinc-700"
                  />
                </div>

                {/* Message */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono font-bold">Project Scope &amp; Ideas</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Provide details about theme, look reference, outfit colors, size of production crew, or number of bridal party touchups..."
                    value={formData.message}
                    onChange={e => setFormData(prev => ({ ...prev, message: e.target.value }))}
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-sm text-[#FAF7F2] focus:outline-none focus:border-primary placeholder:text-zinc-700"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-primary hover:bg-primary/95 text-black font-bold rounded-xl text-xs uppercase tracking-widest cursor-pointer transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" /> Submission in progress...
                    </>
                  ) : (
                    <>
                      <Wand2 className="h-4 w-4" /> Submit Inquiry Form
                    </>
                  )}
                </button>
              </motion.form>
            ) : (
              <motion.div
                key="booking-success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="text-center py-10 space-y-6"
              >
                <CheckCircle className="h-16 w-16 text-primary mx-auto animate-bounce" />
                <div className="space-y-2">
                  <h2 className="font-heading text-2xl font-bold">Inquiry Successfully Lodged!</h2>
                  <p className="text-sm text-zinc-400 font-light max-w-md mx-auto leading-relaxed">
                    Thank you for reaching out. Joann's private booking advisor and AI triage queue have evaluated your scope. We will respond within 24 hours.
                  </p>
                </div>

                {/* Display AI priority evaluation stubs */}
                {aiFeedback && (
                  <div className="max-w-md mx-auto p-5 rounded-2xl bg-black/40 border border-white/5 space-y-3 text-left">
                    <span className="text-[9px] uppercase tracking-widest font-mono font-bold text-primary">
                      AI Lead Classification Triage
                    </span>
                    <div className="flex items-center justify-between border-b border-white/5 pb-2">
                      <span className="text-xs text-zinc-400">Triage Priority Score:</span>
                      <span className="text-sm font-mono font-bold text-primary">{aiFeedback.score}/100</span>
                    </div>
                    <div className="space-y-1.5">
                      <span className="text-[9px] text-zinc-500 font-mono block">Categorization Tags:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {aiFeedback.tags.map(tag => (
                          <span key={tag} className="text-[9px] font-mono text-zinc-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded uppercase">
                            {tag.replace('_', ' ')}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <button
                  onClick={handleReset}
                  className="px-6 py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-xs uppercase tracking-widest font-bold rounded-xl transition-all cursor-pointer"
                >
                  Submit Another Request
                </button>
              </motion.div>
            )}
          </AnimatePresence>
          
        </div>

      </div>
    </div>
  );
}
