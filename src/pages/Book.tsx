import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Mail, User, CheckCircle, Wand2, Heart, Camera, Palette, Theater, Film, ChevronLeft, ChevronRight, DollarSign, MessageCircle } from 'lucide-react';
import CursorGlow from '../components/CursorGlow';

const EVENT_TYPES = [
  { id: 'wedding', label: 'Wedding / Bridal', icon: Heart, desc: 'Bridal glam, traditional, or bridal party' },
  { id: 'film_production', label: 'Film & TV', icon: Film, desc: 'Camera-ready for productions and sets' },
  { id: 'editorial_shoot', label: 'Editorial', icon: Camera, desc: 'Magazine shoots and fashion editorials' },
  { id: 'creative_glam', label: 'Creative / SFX', icon: Palette, desc: 'Avant-garde, character, and special effects' },
  { id: 'fashion_show', label: 'Fashion Show', icon: Theater, desc: 'Runway prep and backstage coordination' },
  { id: 'other', label: 'Other', icon: Calendar, desc: 'Something else? Tell us about it' },
];

const BUDGETS = [
  { id: 'under_200', label: 'Under $200', desc: 'Quick glam or touch-up' },
  { id: '200_500', label: '$200 - $500', desc: 'Standard bridal or editorial' },
  { id: '500_1000', label: '$500 - $1,000', desc: 'Full production or bridal party' },
  { id: 'over_1000', label: '$1,000+', desc: 'Multi-day or large production' },
];

const STEPS = [
  { num: 1, label: 'Event Type' },
  { num: 2, label: 'Your Details' },
  { num: 3, label: 'Date & Budget' },
  { num: 4, label: 'Your Vision' },
];

export default function Book() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    event_type: '',
    name: '',
    email: '',
    event_date: '',
    budget_range: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<{ score: number; tags: string[] } | null>(null);

  const update = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const canProceed = () => {
    switch (step) {
      case 1: return !!formData.event_type;
      case 2: return !!formData.name && !!formData.email;
      case 3: return !!formData.event_date && !!formData.budget_range;
      case 4: return !!formData.message;
      default: return false;
    }
  };

  const handleSubmit = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          event_type: formData.event_type || 'other',
        }),
      });
      if (!response.ok) throw new Error("Inquiry failed");
      const data = await response.json();
      if (data.success && data.inquiry) {
        setSubmitted(true);
        setAiFeedback({
          score: data.inquiry.score || 50,
          tags: data.inquiry.ai_tags || [],
        });
      }
    } catch (error) {
      console.error("Booking inquiry failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ event_type: '', name: '', email: '', event_date: '', budget_range: '', message: '' });
    setStep(1);
    setSubmitted(false);
    setAiFeedback(null);
  };

  if (submitted) {
    return (
      <div className="bg-background text-foreground min-h-screen pt-32 pb-24 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg mx-auto px-6 text-center space-y-8"
        >
          <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
            <CheckCircle className="h-10 w-10 text-primary" />
          </div>
          <div className="space-y-3">
            <h2 className="font-heading text-3xl font-bold tracking-tight">You're Booked! 🎉</h2>
            <p className="text-sm text-zinc-400 font-light leading-relaxed max-w-sm mx-auto">
              Thank you, {formData.name}! Joann's team will review your request and respond within 24 hours.
            </p>
          </div>
          {aiFeedback && (
            <div className="p-5 rounded-2xl bg-[#111] border border-white/5 space-y-3 text-left">
              <span className="text-[9px] uppercase tracking-widest font-mono font-bold text-primary">
                AI Triage Summary
              </span>
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <span className="text-xs text-zinc-400">Priority Score:</span>
                <span className="text-sm font-mono font-bold text-primary">{aiFeedback.score}/100</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {aiFeedback.tags.map(tag => (
                  <span key={tag} className="text-[9px] font-mono text-zinc-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded uppercase">
                    {tag.replace('_', ' ')}
                  </span>
                ))}
              </div>
            </div>
          )}
          <button
            onClick={resetForm}
            className="px-6 py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-xs uppercase tracking-widest font-bold rounded-xl transition-all cursor-pointer"
          >
            Submit Another Request
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-background text-foreground min-h-screen pt-32 pb-24 relative overflow-hidden">
      <CursorGlow color="rgba(212, 163, 115, 0.1)" size={500} opacity={0.7} zIndex={0} particles />
      <div className="w-full px-6 max-w-3xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-10 space-y-4">
          <span className="text-primary uppercase tracking-widest text-xs font-semibold font-mono">
            Book a Consultation
          </span>
          <h1 className="font-heading text-4xl sm:text-5xl font-medium tracking-tight">
            Let's Create Your <span className="italic font-serif text-primary">Perfect Look</span>
          </h1>
          <div className="w-16 h-[1.5px] bg-primary mx-auto my-2" />
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {STEPS.map((s, i) => (
            <div key={s.num} className="flex items-center gap-2">
              <div className={`flex items-center gap-2 ${
                step === s.num
                  ? 'text-primary'
                  : step > s.num
                    ? 'text-green-400'
                    : 'text-zinc-600'
              }`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                  step === s.num
                    ? 'bg-primary text-black'
                    : step > s.num
                      ? 'bg-green-400/20 text-green-400 border border-green-400/30'
                      : 'bg-white/5 text-zinc-500 border border-white/10'
                }`}>
                  {step > s.num ? <CheckCircle className="h-4 w-4" /> : s.num}
                </div>
                <span className={`text-[10px] uppercase tracking-widest font-semibold hidden sm:block ${
                  step === s.num ? 'text-primary' : 'text-zinc-600'
                }`}>
                  {s.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`w-8 h-[1px] ${
                  step > s.num ? 'bg-green-400/50' : 'bg-white/10'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Card */}
        <div className="bg-[#0F0F0F] border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="text-center space-y-2">
                  <h2 className="font-heading text-xl font-semibold">What type of event?</h2>
                  <p className="text-xs text-zinc-400 font-light">Choose the category that best describes your needs</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {EVENT_TYPES.map(etype => {
                    const Icon = etype.icon;
                    const isSelected = formData.event_type === etype.id;
                    return (
                      <button
                        key={etype.id}
                        onClick={() => update('event_type', etype.id)}
                        className={`text-left p-5 rounded-2xl border transition-all duration-200 cursor-pointer ${
                          isSelected
                            ? 'bg-primary/10 border-primary shadow-md shadow-primary/10'
                            : 'bg-[#111] border-white/10 hover:border-white/25'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${
                          isSelected ? 'bg-primary text-black' : 'bg-white/5 text-zinc-400'
                        }`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <h3 className={`text-sm font-semibold mb-1 ${
                          isSelected ? 'text-primary' : 'text-foreground'
                        }`}>
                          {etype.label}
                        </h3>
                        <p className="text-[10px] text-zinc-500 font-light">{etype.desc}</p>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="text-center space-y-2">
                  <h2 className="font-heading text-xl font-semibold">Great choice! Now, who are we working with?</h2>
                  <p className="text-xs text-zinc-400 font-light">So Joann knows how to reach you</p>
                </div>
                <div className="space-y-4 max-w-md mx-auto">
                  <div className="space-y-2">
                    <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono font-bold flex items-center gap-2">
                      <User className="h-3 w-3" /> Your Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sarah Adeleke"
                      value={formData.name}
                      onChange={e => update('name', e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl py-3.5 px-4 text-sm text-[#FAF7F2] focus:outline-none focus:border-primary placeholder:text-zinc-700 transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono font-bold flex items-center gap-2">
                      <Mail className="h-3 w-3" /> Email Address
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="name@domain.com"
                      value={formData.email}
                      onChange={e => update('email', e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl py-3.5 px-4 text-sm text-[#FAF7F2] focus:outline-none focus:border-primary placeholder:text-zinc-700 transition-colors"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="text-center space-y-2">
                  <h2 className="font-heading text-xl font-semibold">When's the big day?</h2>
                  <p className="text-xs text-zinc-400 font-light">And what budget range are we working with?</p>
                </div>
                <div className="max-w-md mx-auto space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono font-bold flex items-center gap-2">
                      <Calendar className="h-3 w-3" /> Event Date
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.event_date}
                      onChange={e => update('event_date', e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl py-3.5 px-4 text-sm text-[#FAF7F2] focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono font-bold flex items-center gap-2">
                      <DollarSign className="h-3 w-3" /> Budget Range
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {BUDGETS.map(b => {
                        const isSelected = formData.budget_range === b.id;
                        return (
                          <button
                            key={b.id}
                            onClick={() => update('budget_range', b.id)}
                            className={`text-left p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
                              isSelected
                                ? 'bg-primary/10 border-primary'
                                : 'bg-[#111] border-white/10 hover:border-white/25'
                            }`}
                          >
                            <h3 className={`text-sm font-semibold ${
                              isSelected ? 'text-primary' : 'text-foreground'
                            }`}>
                              {b.label}
                            </h3>
                            <p className="text-[9px] text-zinc-500 font-light mt-0.5">{b.desc}</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="text-center space-y-2">
                  <h2 className="font-heading text-xl font-semibold">Almost there! Tell us your vision ✨</h2>
                  <p className="text-xs text-zinc-400 font-light">Share your ideas, inspirations, and any special requests</p>
                </div>
                <div className="max-w-md mx-auto space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono font-bold">Your Vision</label>
                    <textarea
                      required
                      rows={5}
                      placeholder="Describe your event, the looks you're envisioning, outfit colors, number of people, or any reference images you'd like to share..."
                      value={formData.message}
                      onChange={e => update('message', e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl py-3.5 px-4 text-sm text-[#FAF7F2] focus:outline-none focus:border-primary placeholder:text-zinc-700 resize-none transition-colors"
                    />
                  </div>
                  {/* Summary */}
                  <div className="p-4 rounded-xl bg-black/30 border border-white/5 space-y-2">
                    <span className="text-[9px] uppercase tracking-widest font-mono font-bold text-primary">Quick Summary</span>
                    <div className="text-[11px] text-zinc-400 space-y-1">
                      <p><span className="text-zinc-500">Event:</span> {EVENT_TYPES.find(e => e.id === formData.event_type)?.label || formData.event_type}</p>
                      <p><span className="text-zinc-500">Name:</span> {formData.name}</p>
                      <p><span className="text-zinc-500">Date:</span> {formData.event_date}</p>
                      <p><span className="text-zinc-500">Budget:</span> {BUDGETS.find(b => b.id === formData.budget_range)?.label || formData.budget_range}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/5">
            <button
              onClick={() => setStep(s => Math.max(1, s - 1))}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-xs uppercase tracking-widest font-semibold rounded-xl transition-all cursor-pointer ${
                step === 1
                  ? 'opacity-0 pointer-events-none'
                  : 'bg-white/5 border border-white/10 hover:bg-white/10 text-zinc-300'
              }`}
            >
              <ChevronLeft className="h-3.5 w-3.5" /> Back
            </button>

            <span className="text-[10px] text-zinc-600 font-mono">Step {step} of 4</span>

            {step < 4 ? (
              <button
                onClick={() => setStep(s => s + 1)}
                disabled={!canProceed()}
                className="flex items-center gap-1.5 px-5 py-2.5 bg-primary hover:bg-primary/95 disabled:bg-zinc-800 disabled:text-zinc-600 text-black text-xs uppercase tracking-widest font-bold rounded-xl transition-all cursor-pointer disabled:cursor-not-allowed"
              >
                Continue <ChevronRight className="h-3.5 w-3.5" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!canProceed() || loading}
                className="flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary/95 disabled:bg-zinc-800 disabled:text-zinc-600 text-black text-xs uppercase tracking-widest font-bold rounded-xl transition-all cursor-pointer disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>Sending...</>
                ) : (
                  <><Wand2 className="h-3.5 w-3.5" /> Submit Request</>
                )}
              </button>
            )}
          </div>
        </div>

        {/* WhatsApp CTA */}
        <div className="mt-8 text-center">
          <p className="text-[10px] text-zinc-500 font-light mb-3">Prefer to chat?</p>
          <a
            href="https://wa.me/233501234567?text=Hi%20Joann!%20I'd%20like%20to%20book%20a%20consultation."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-3 bg-[#25D366] hover:bg-[#20BD5A] text-white text-xs uppercase tracking-widest font-bold rounded-xl transition-all"
          >
            <MessageCircle className="h-4 w-4" /> Chat with us on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
