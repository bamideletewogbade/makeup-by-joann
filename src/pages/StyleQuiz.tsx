import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, RefreshCw, Wand2, Info, Check, HelpCircle } from 'lucide-react';

const QUESTIONS = [
  {
    id: 'occasion',
    label: 'What special event are we celebrating?',
    options: [
      { value: 'wedding', label: 'Wedding / Bridal Glam', desc: 'Regal, emotional, long-lasting focus' },
      { value: 'film_production', label: 'Film & television set', desc: '8K screen-ready continuity, matte control' },
      { value: 'editorial_shoot', label: 'High fashion runway/shoot', desc: 'Avant-garde, bold campaigns, campaign theme' },
      { value: 'gala', label: 'Red carpet gala', desc: 'Specular highlights, dramatic evening setup' }
    ]
  },
  {
    id: 'vibe',
    label: 'Select your preferred stylistic vibe:',
    options: [
      { value: 'regal_traditional', label: 'Regal Traditional Glam', desc: 'Rich bronze contouring, metallic eye accents' },
      { value: 'luminous_dewy', label: 'Luminous Dewy Specular', desc: 'Glass-smooth hydration, highSpecular highlights' },
      { value: 'velvet_matte', label: 'Velvet Matte Drama', desc: 'Sharp borders, velvet crimson lips, matte eyes' },
      { value: 'natural_portraiture', label: 'Natural Glow Portraiture', desc: 'Feather-stroked brows, satin nude lip highlights' }
    ]
  },
  {
    id: 'skin_tone',
    label: 'What is your general skin undertone?',
    options: [
      { value: 'fair_cool', label: 'Fair to light with cool undertones', desc: 'Rosy, pink, or bluish vein cues' },
      { value: 'olive_warm', label: 'Medium to olive with warm undertones', desc: 'Golden, peach, or olive warm cues' },
      { value: 'rich_gold', label: 'Rich brown with warm gold undertones', desc: 'Warm caramel, bronze, and copper cues' },
      { value: 'deep_cool', label: 'Deep ebony with cool/neutral undertones', desc: 'Espresso, neutral grey, or silver cues' }
    ]
  },
  {
    id: 'eye_focus',
    label: 'Which facial focal area do you prioritize?',
    options: [
      { value: 'eye_liner', label: 'Bold graphic liners & lids', desc: 'Vibrant emeralds, coppers, or sharp wings' },
      { value: 'satin_lips', label: 'Satin contour lips combo', desc: 'High-precision liner, glossy center definition' },
      { value: 'specular_cheeks', label: 'High-specular cheek highlight', desc: 'Peptide glow specular highlight reflections' },
      { value: 'lashes', label: 'Dramatic lash architecture', desc: 'Premium mink flares and customized length' }
    ]
  }
];

interface Recommendation {
  style_name: string;
  description: string;
  product_tips: string[];
  color_palette: string[];
}

export default function StyleQuiz() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Recommendation | null>(null);

  const handleSelect = (questionId: string, optionValue: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionValue }));
    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Last step completed, submit
      submitQuiz({ ...answers, [questionId]: optionValue });
    }
  };

  const submitQuiz = async (finalAnswers: Record<string, string>) => {
    setLoading(true);
    try {
      const response = await fetch('/api/style-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalAnswers)
      });
      if (!response.ok) throw new Error("Quiz submission failed");
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error(error);
      // Fallback
      setResult({
        style_name: "Signature Golden Hour Glow",
        description: "A gorgeous, luminous look featuring flawless radiant skin, warm bronze sculpt contours, and a polished chocolate-rose lip combo.",
        product_tips: [
          "Prep skin with a hydrating primer and body glow on collarbones.",
          "Use metallic champagne liner on the inner corners of the eyes.",
          "Lock in with an ultra-fine setting mist for absolute longevity under direct photography."
        ],
        color_palette: ["#D4A373", "#FAF7F2", "#8B5A2B", "#C18A64"]
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setAnswers({});
    setResult(null);
  };

  const currentQuestion = QUESTIONS[currentStep];

  return (
    <div className="bg-background text-foreground min-h-screen pt-32 pb-24">
      <div className="w-full px-6">
        
        {/* Title */}
        <div className="text-center mb-12 space-y-4">
          <span className="text-primary uppercase tracking-widest text-xs font-semibold font-mono flex items-center justify-center gap-1.5">
            <Sparkles className="h-4 w-4 animate-pulse text-primary" /> AI Aesthetic Signature
          </span>
          <h1 className="font-heading text-4xl sm:text-5xl font-medium tracking-tight">
            Undertone &amp; Style <span className="italic font-serif text-primary">Quiz</span>
          </h1>
          <div className="w-16 h-[1.5px] bg-primary mx-auto my-2"></div>
          <p className="text-xs text-gray-400 font-light max-w-md mx-auto leading-relaxed">
            Answer 4 questions regarding your outfit structure, undertones, and event style. Gemini will formulate a custom signature beauty palette.
          </p>
        </div>

        {/* Dynamic Card Container */}
        <div className="bg-[#111] border border-white/5 rounded-[2.5rem] p-8 sm:p-10 shadow-2xl relative overflow-hidden min-h-[420px] flex flex-col justify-between">
          
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="quiz-loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center space-y-4 py-20"
              >
                <RefreshCw className="h-10 w-10 text-primary animate-spin" />
                <h3 className="font-heading text-xl font-medium">Formulating Color Swatches...</h3>
                <p className="text-xs text-zinc-500 font-light max-w-xs text-center">
                  Our LLM advisor is reviewing color contrasts and aligning your selections to professional product combinations.
                </p>
              </motion.div>
            ) : result ? (
              <motion.div
                key="quiz-result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-8 text-left"
              >
                {/* Result Title */}
                <div className="space-y-2">
                  <span className="text-[9px] uppercase tracking-widest bg-primary/20 text-primary border border-primary/20 px-2.5 py-0.5 rounded-full font-bold">
                    Aesthetic Match Achieved
                  </span>
                  <h2 className="font-heading text-3xl font-bold text-[#FAF7F2]">
                    {result.style_name}
                  </h2>
                  <p className="text-xs sm:text-sm text-zinc-400 font-light leading-relaxed">
                    {result.description}
                  </p>
                </div>

                {/* Color Palette Swatches */}
                <div className="space-y-3">
                  <h4 className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono font-bold">Recommended Color Palette</h4>
                  <div className="grid grid-cols-4 gap-4">
                    {result.color_palette.map((hex, i) => (
                      <div key={i} className="flex flex-col items-center space-y-2 bg-black/40 border border-white/5 p-3 rounded-2xl">
                        <div
                          className="w-12 h-12 rounded-full shadow-inner border border-white/10"
                          style={{ backgroundColor: hex, boxShadow: `0 0 10px ${hex}40` }}
                        />
                        <span className="text-[10px] font-mono text-zinc-400 select-all uppercase">
                          {hex}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Product Tips */}
                <div className="space-y-3.5">
                  <h4 className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono font-bold">MUA Application &amp; Skincare Tips</h4>
                  <div className="space-y-2">
                    {result.product_tips.map((tip, i) => (
                      <div key={i} className="flex items-start gap-3 bg-white/5 border border-white/5 p-4 rounded-xl">
                        <span className="w-5 h-5 rounded-full bg-primary/20 text-primary text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        <p className="text-xs text-gray-300 font-light leading-relaxed">
                          {tip}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Reset & Book */}
                <div className="border-t border-white/5 pt-6 flex flex-wrap gap-4">
                  <button
                    onClick={handleRestart}
                    className="px-6 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 text-xs uppercase tracking-widest font-bold rounded-xl transition-all cursor-pointer"
                  >
                    Restart Quiz
                  </button>
                  <button
                    onClick={() => navigate('/book')}
                    className="px-6 py-3.5 bg-primary hover:bg-primary/95 text-black font-bold text-xs uppercase tracking-widest rounded-xl transition-all flex items-center gap-1.5 shadow-lg cursor-pointer"
                  >
                    Book This Aesthetic Look <ArrowRight className="h-4 w-4" />
                  </button>
                </div>

              </motion.div>
            ) : (
              <motion.div
                key={`quiz-step-${currentStep}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="flex-1 flex flex-col justify-between text-left space-y-6"
              >
                {/* Step counter */}
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <span className="text-[10px] text-primary uppercase tracking-widest font-mono font-bold">
                    Question {currentStep + 1} of {QUESTIONS.length}
                  </span>
                  <div className="flex gap-1">
                    {QUESTIONS.map((_, i) => (
                      <div
                        key={i}
                        className={`h-1.5 rounded-full transition-all ${
                          i === currentStep ? 'w-6 bg-primary' : 'w-1.5 bg-white/20'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Question Label */}
                <h3 className="font-heading text-xl sm:text-2xl text-[#FAF7F2] tracking-tight leading-snug">
                  {currentQuestion.label}
                </h3>

                {/* Options list */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {currentQuestion.options.map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => handleSelect(currentQuestion.id, opt.value)}
                      className="group bg-black/40 border border-white/10 hover:border-primary/40 rounded-2xl p-5 text-left transition-all hover:bg-white/5 cursor-pointer relative overflow-hidden flex flex-col justify-between min-h-[110px]"
                    >
                      <h4 className="text-sm font-semibold group-hover:text-primary transition-colors text-[#FAF7F2]">
                        {opt.label}
                      </h4>
                      <p className="text-[11px] text-zinc-500 font-light mt-1.5 leading-relaxed">
                        {opt.desc}
                      </p>
                      <div className="absolute right-4 bottom-4 w-6 h-6 rounded-full border border-white/10 group-hover:border-primary/45 group-hover:bg-primary/10 flex items-center justify-center text-primary transition-all">
                        <Check className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </button>
                  ))}
                </div>

                {/* Assistance note */}
                <p className="text-[10px] text-zinc-600 font-light flex items-center gap-1.5 pt-4">
                  <HelpCircle className="h-3 w-3 text-zinc-700" />
                  Your answer helps Gemini determine skin warmth profiles and style weight formulas.
                </p>

              </motion.div>
            )}
          </AnimatePresence>

        </div>

      </div>
    </div>
  );
}
