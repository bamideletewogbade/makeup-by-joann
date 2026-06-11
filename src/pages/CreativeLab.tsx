import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Wand2, Eye, ArrowRight } from 'lucide-react';
import CursorGlow from '../components/CursorGlow';

export default function CreativeLab() {
  const navigate = useNavigate();

  const tools = [
    {
      id: 'style-quiz',
      title: 'AI Style Quiz',
      subtitle: 'Find Your Perfect Look',
      description: 'Answer 4 quick questions about your event, style preferences, and undertones. Our AI generates a custom color palette and product recommendations tailored just for you.',
      icon: Sparkles,
      benefits: ['Personalized color palette', 'Product recommendations', 'Bridal & editorial styles'],
      gradient: 'from-amber-900/30 via-primary/10 to-transparent',
    },
    {
      id: 'virtual-try-on',
      title: 'Virtual Makeup Try-On',
      subtitle: 'Preview Before You Commit',
      description: 'Upload a selfie or use your camera to preview luxury makeup looks applied to your face in real time. Experiment with different styles before your consultation.',
      icon: Eye,
      benefits: ['Real-time makeup preview', 'Multiple signature looks', 'Share with your artist'],
      gradient: 'from-rose-900/30 via-primary/10 to-transparent',
    },
  ];

  return (
    <div className="bg-background text-foreground min-h-screen pt-32 pb-24 relative overflow-hidden">
      <CursorGlow color="rgba(212, 163, 115, 0.1)" size={500} opacity={0.7} zIndex={0} particles />
      <div className="w-full px-6 sm:px-12 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <span className="text-primary uppercase tracking-widest text-xs font-semibold font-mono flex items-center justify-center gap-1.5">
            <Sparkles className="h-4 w-4 text-primary" /> AI-Powered Studio
          </span>
          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-medium tracking-tight">
            Creative <span className="italic font-serif text-primary">Lab</span>
          </h1>
          <div className="w-16 h-[1.5px] bg-primary mx-auto my-3"></div>
          <p className="text-xs sm:text-sm text-gray-400 font-light max-w-xl mx-auto leading-relaxed">
            Explore your style with AI-powered tools. Discover your perfect palette or preview makeup looks before your consultation.
          </p>
        </div>

        {/* Tool Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {tools.map((tool, index) => {
            const Icon = tool.icon;
            return (
              <motion.div
                key={tool.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="group relative bg-[#111] border border-white/5 rounded-[2.5rem] overflow-hidden hover:border-primary/30 transition-all duration-500"
              >
                {/* Gradient background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${tool.gradient} opacity-60 group-hover:opacity-100 transition-opacity duration-500`} />

                <div className="relative z-10 p-8 sm:p-10 flex flex-col h-full">
                  {/* Icon */}
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-6 group-hover:scale-105 transition-transform duration-300">
                    <Icon className="h-7 w-7" />
                  </div>

                  {/* Content */}
                  <div className="space-y-3 flex-1">
                    <span className="text-[10px] text-primary uppercase tracking-widest font-bold font-mono">
                      {tool.subtitle}
                    </span>
                    <h2 className="font-heading text-2xl sm:text-3xl font-medium text-[#FAF7F2] group-hover:text-primary transition-colors">
                      {tool.title}
                    </h2>
                    <p className="text-sm text-gray-400 font-light leading-relaxed">
                      {tool.description}
                    </p>
                  </div>

                  {/* Benefits */}
                  <div className="mt-6 space-y-2">
                    {tool.benefits.map((benefit) => (
                      <div key={benefit} className="flex items-center gap-2.5 text-xs text-zinc-400">
                        <span className="w-1 h-1 rounded-full bg-primary" />
                        {benefit}
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  <button
                    onClick={() => navigate(`/${tool.id}`)}
                    className="mt-8 w-full py-3.5 bg-primary hover:bg-primary/95 text-black font-bold rounded-xl text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 group/btn shadow-lg"
                  >
                    Launch {tool.title.split(' ')[0]}
                    <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom info */}
        <div className="mt-20 text-center max-w-2xl mx-auto space-y-4">
          <p className="text-xs text-zinc-500 font-light leading-relaxed">
            These tools are designed to help you discover your signature style before your consultation.
            Your results can be shared directly with Joann to ensure a seamless, personalized experience.
          </p>
        </div>
      </div>
    </div>
  );
}
