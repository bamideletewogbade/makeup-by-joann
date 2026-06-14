import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Check, MessageCircle, ArrowRight, Sparkles } from 'lucide-react';
import CursorGlow from '../components/CursorGlow';

const SERVICES = [
  'Film & Television',
  'Editorial / Commercial',
  'Fashion Show',
  'Bridal',
  'Creative / SFX',
  'Consultation',
  'Other',
];

interface ChatMessage {
  type: 'bot' | 'user';
  text: string;
  field?: string;
}

export default function Contact() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: '',
    date: '',
    message: '',
  });
  const [currentInput, setCurrentInput] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  const chatHistory: ChatMessage[] = [
    { type: 'bot', text: "Hi there! I'm Joann's booking assistant. I'd love to hear about your project! What's your name?" },
  ];

  if (formData.name) {
    chatHistory.push({ type: 'user', text: formData.name });
    chatHistory.push({ type: 'bot', text: `Lovely to meet you, ${formData.name}! What's the best email to reach you at?` });
  }
  if (formData.email) {
    chatHistory.push({ type: 'user', text: formData.email });
    chatHistory.push({ type: 'bot', text: "Perfect! Which service are you interested in?" });
  }
  if (formData.service) {
    chatHistory.push({ type: 'user', text: formData.service });
    chatHistory.push({ type: 'bot', text: `Great choice! Do you have an event date in mind?` });
  }
  if (formData.date) {
    chatHistory.push({ type: 'user', text: formData.date });
    chatHistory.push({ type: 'bot', text: "Wonderful! Lastly, tell me a bit about your vision — what are you looking for?" });
  }

  const handleSend = () => {
    if (!currentInput.trim()) return;
    const value = currentInput.trim();

    switch (step) {
      case 0:
        setFormData(p => ({ ...p, name: value }));
        setStep(1);
        break;
      case 1:
        setFormData(p => ({ ...p, email: value }));
        setStep(2);
        break;
      case 3:
        setFormData(p => ({ ...p, date: value }));
        setStep(4);
        break;
    }
    setCurrentInput('');
  };

  const selectService = (service: string) => {
    setFormData(p => ({ ...p, service }));
    setStep(3);
  };

  const handleSubmit = async () => {
    if (!formData.message.trim()) return;
    setSending(true);
    setError(null);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setSubmitted(true);
      } else {
        setError('Something went wrong. Please try again.');
      }
    } catch {
      setError('Unable to reach the server. Please try again later.');
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (step === 4 && formData.message) {
        handleSubmit();
      } else {
        handleSend();
      }
    }
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
            <Check className="h-10 w-10 text-primary" />
          </div>
          <div className="space-y-3">
            <h2 className="font-heading text-3xl font-bold tracking-tight">Message Sent! ✨</h2>
            <p className="text-sm text-zinc-400 font-light leading-relaxed max-w-sm mx-auto">
              Thank you, {formData.name}! Joann typically responds within 24 hours.
              In the meantime, feel free to reach out on WhatsApp for a quicker reply.
            </p>
          </div>
          <a
            href="https://wa.me/2349130888823?text=Hi%20Joann!%20I%20just%20sent%20a%20message%20through%20your%20website."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#25D366] hover:bg-[#20BD5A] text-white text-xs uppercase tracking-widest font-bold rounded-xl transition-all"
          >
            <MessageCircle className="h-4 w-4" /> Chat on WhatsApp
          </a>
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
            Let's Talk
          </span>
          <h1 className="font-heading text-4xl sm:text-5xl font-medium tracking-tight">
            Start a <span className="italic font-serif text-primary">Conversation</span>
          </h1>
          <div className="w-16 h-[1.5px] bg-primary mx-auto my-2" />
          <p className="text-xs text-zinc-400 font-light max-w-lg mx-auto leading-relaxed">
            Just type your answers below — it's like chatting with a friend who happens to be a world-class makeup artist.
          </p>
        </div>

        {/* Chat Card */}
        <div className="bg-[#0F0F0F] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
          {/* Chat Header */}
          <div className="bg-[#1A1A1A] border-b border-white/5 px-6 py-4 flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-[#1A1A1A]" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">Beauty By Joann</h3>
              <p className="text-[10px] text-zinc-500">Online • Typically replies instantly</p>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="px-6 py-6 space-y-4 max-h-[420px] overflow-y-auto">
            {chatHistory.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    msg.type === 'user'
                      ? 'bg-primary text-black rounded-br-md'
                      : 'bg-white/5 text-gray-200 rounded-bl-md'
                  }`}
                >
                  {msg.text}
                </div>
              </motion.div>
            ))}

            {/* Service Selection */}
            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-wrap gap-2"
              >
                {SERVICES.map(s => (
                  <button
                    key={s}
                    onClick={() => selectService(s)}
                    className="px-4 py-2 bg-white/5 hover:bg-primary hover:text-black border border-white/10 hover:border-primary text-xs rounded-xl transition-all cursor-pointer font-medium"
                  >
                    {s}
                  </button>
                ))}
              </motion.div>
            )}

            {/* Message input area (step 4) */}
            {step === 4 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3"
              >
                <div className="bg-white/5 px-4 py-3 rounded-2xl rounded-bl-md text-sm leading-relaxed text-gray-200">
                  Tell me about your vision! What are you planning? Any colors, themes, or inspirations?
                </div>
                <textarea
                  rows={3}
                  placeholder="Type your message here..."
                  value={formData.message}
                  onChange={e => setFormData(p => ({ ...p, message: e.target.value }))}
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-sm text-[#FAF7F2] focus:outline-none focus:border-primary placeholder:text-zinc-700 resize-none"
                />
                {error && (
                  <p className="text-red-400 text-xs text-center">{error}</p>
                )}
                <button
                  onClick={handleSubmit}
                  disabled={!formData.message.trim() || sending}
                  className="w-full py-3 bg-primary hover:bg-primary/95 disabled:bg-zinc-800 disabled:text-zinc-600 text-black text-xs uppercase tracking-widest font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
                >
                  {sending ? (
                    'Sending...'
                  ) : (
                    <><Send className="h-3.5 w-3.5" /> Send Message</>
                  )}
                </button>
              </motion.div>
            )}
          </div>

          {/* Input Area (steps 0, 1, 3) */}
          {step !== 2 && step !== 4 && (
            <div className="border-t border-white/5 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <input
                    type={step === 1 ? "email" : "text"}
                    placeholder={
                      step === 0 ? "Type your name..." :
                      step === 1 ? "Type your email..." :
                      step === 3 ? "Event date (e.g. December 2026)..." :
                      "Type your message..."
                    }
                    value={currentInput}
                    onChange={e => setCurrentInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-4 pr-10 text-sm text-[#FAF7F2] focus:outline-none focus:border-primary placeholder:text-zinc-700 transition-colors"
                    autoFocus
                  />
                </div>
                <button
                  onClick={handleSend}
                  disabled={!currentInput.trim()}
                  className="w-10 h-10 rounded-xl bg-primary hover:bg-primary/95 disabled:bg-zinc-800 disabled:text-zinc-600 text-black flex items-center justify-center transition-all cursor-pointer disabled:cursor-not-allowed shrink-0"
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* WhatsApp CTA */}
        <div className="mt-8 text-center">
          <div className="bg-[#0F0F0F] border border-white/10 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#25D366]/20 flex items-center justify-center">
                <MessageCircle className="h-6 w-6 text-[#25D366]" />
              </div>
              <div className="text-left">
                <h3 className="text-sm font-semibold text-foreground">Prefer WhatsApp?</h3>
                <p className="text-[10px] text-zinc-500">Get a response in minutes, not hours</p>
              </div>
            </div>
            <a
              href="https://wa.me/2349130888823?text=Hi%20Joann!%20I'd%20love%20to%20chat%20about%20your%20makeup%20services."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#25D366] hover:bg-[#20BD5A] text-white text-xs uppercase tracking-widest font-bold rounded-xl transition-all w-full justify-center shadow-lg"
            >
              <MessageCircle className="h-4 w-4" /> Chat with us on WhatsApp
            </a>
            <p className="text-[9px] text-zinc-600 font-light">
              Tap to start a conversation. We typically respond within minutes.
            </p>
          </div>
        </div>

        {/* Direct contact info */}
        <div className="mt-6 text-center text-[10px] text-zinc-600 font-light space-y-1">
          <p>Or email us directly at <a href="mailto:hello@beautybyjoann.com" className="text-primary hover:underline">hello@beautybyjoann.com</a></p>
        </div>
      </div>
    </div>
  );
}
