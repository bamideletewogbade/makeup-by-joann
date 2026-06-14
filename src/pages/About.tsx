import { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  Heart, Sparkles, ShieldCheck, Smile, Camera, Film, 
  Palette, Star, Award, MapPin, ArrowRight,
  ChevronDown, Eye, Music
} from 'lucide-react';
import CursorGlow from '../components/CursorGlow';
import ScrollReveal from '../components/ScrollReveal';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }
  })
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

export default function About() {
  const [profileLoaded, setProfileLoaded] = useState(false);
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0.85]);
  const heroScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.97]);
  const imageParallax = useTransform(scrollYProgress, [0, 0.2], [0, -30]);
  const textParallax = useTransform(scrollYProgress, [0, 0.2], [0, 20]);

  useEffect(() => {
    const img = new Image();
    img.onload = () => setProfileLoaded(true);
    img.src = '/profile.jpeg';
  }, []);

  return (
    <div className="bg-background text-foreground min-h-screen relative overflow-hidden">
      {/* Floating ambient glows */}
      <CursorGlow color="rgba(212, 163, 115, 0.08)" size={600} opacity={0.7} zIndex={0} particles />
      <div className="fixed top-1/4 -left-32 w-96 h-96 rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="fixed bottom-1/4 -right-32 w-80 h-80 rounded-full bg-amber-500/5 blur-[100px] pointer-events-none" />

      {/* ═══════════════════ HERO SECTION ═══════════════════ */}
      <motion.section 
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative min-h-screen flex items-center pt-28 pb-16"
      >
        <div className="w-full px-6 sm:px-12 max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            
            {/* ─── Left: Profile Image ─── */}
            <motion.div 
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-5 flex justify-center lg:justify-start"
              style={{ y: imageParallax }}
            >
              <div className="relative group">
                {/* Decorative rings */}
                <div className="absolute -inset-4 rounded-[3rem] border border-primary/10 group-hover:border-primary/20 transition-all duration-700" />
                <div className="absolute -inset-8 rounded-[3.8rem] border border-white/5 group-hover:border-primary/5 transition-all duration-700" />
                
                {/* Main image container */}
                <div className="relative w-72 sm:w-80 h-80 sm:h-[22rem] rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl shadow-black/30 bg-zinc-900">
                  {/* Loading shimmer */}
                  {!profileLoaded && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse" />
                  )}
                  <motion.img 
                    src="/profile.jpeg"
                    alt="Joann - Professional Makeup Artist"
                    className={`w-full h-full object-cover transition-all duration-700 ${
                      profileLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
                    } group-hover:scale-105`}
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 1.2 }}
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  {/* Floating badge */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                    className="absolute bottom-5 left-5 right-5"
                  >
                    <div className="backdrop-blur-xl bg-black/40 border border-white/10 rounded-xl px-4 py-3 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0">
                        <Sparkles className="h-5 w-5 text-primary" />
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-semibold text-foreground tracking-wide">Joann</p>
                        <p className="text-[10px] text-zinc-400">Lead Makeup Artist</p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* ─── Right: Content ─── */}
            <motion.div 
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-7 space-y-6"
              style={{ y: textParallax }}
            >
              {/* Label */}
              <motion.span 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-primary text-[10px] uppercase tracking-widest font-bold"
              >
                <Sparkles className="h-3 w-3" /> Founder & Lead Artist
              </motion.span>

              {/* Title */}
              <motion.h1 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-medium tracking-tight leading-[1.1]"
              >
                Meet Joann: <br />
                <span className="italic font-serif text-primary">Your Creative Partner</span>
              </motion.h1>

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="w-20 h-[2px] bg-primary"
              />
              
              {/* Bio */}
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55, duration: 0.6 }}
                className="text-base sm:text-lg text-gray-300 font-light leading-relaxed max-w-xl"
              >
                With over 4 years of professional experience across film sets, editorial studios, 
                fashion runways, and bridal ceremonies, Joann has built a reputation for exquisite 
                precision, calm professionalism, and deeply collaborative artistry.
              </motion.p>

              {/* Quote */}
              <motion.blockquote 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65, duration: 0.6 }}
                className="border-l-2 border-primary pl-5 py-2"
              >
                <p className="text-sm sm:text-base text-[#FAF7F2] font-light leading-relaxed italic">
                  "Makeup is more than application — it's collaboration. I don't believe in 
                  copy-paste aesthetics. I partner with directors, producers, and brides to 
                  tailor a look that belongs to them and their story."
                </p>
              </motion.blockquote>

              {/* Stats row */}
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.75, duration: 0.6 }}
                className="grid grid-cols-3 gap-6 pt-4 border-t border-white/10 max-w-md"
              >
                {[
                  { number: '25+', label: 'Productions', icon: Film },
                  { number: '4+ Yrs', label: 'Experience', icon: Star },
                  { number: '100%', label: 'Client Satisfaction', icon: Heart },
                ].map((stat, i) => {
                  const Icon = stat.icon;
                  return (
                    <div key={stat.label} className="text-left">
                      <div className="flex items-center gap-1.5 mb-1">
                        <Icon className="h-3 w-3 text-primary" />
                        <motion.span 
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.9 + i * 0.1, type: 'spring', stiffness: 200 }}
                          className="font-heading text-2xl sm:text-3xl font-bold text-primary"
                        >
                          {stat.number}
                        </motion.span>
                      </div>
                      <p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-widest">{stat.label}</p>
                    </div>
                  );
                })}
              </motion.div>

              {/* Scroll indicator */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="pt-6 flex items-center gap-2 text-[10px] text-zinc-600 uppercase tracking-widest"
              >
                <motion.span
                  animate={{ y: [0, 5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <ChevronDown className="h-4 w-4" />
                </motion.span>
                Scroll to explore
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* ═══════════════════ SPECIALTIES GRID ═══════════════════ */}
      <ScrollReveal animation="fade" className="py-20 bg-[#0A0A0A] border-t border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 sm:px-12">
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="text-center max-w-2xl mx-auto mb-16 space-y-4"
          >
            <motion.span variants={fadeUp} custom={0} className="text-primary uppercase tracking-widest text-xs font-semibold font-mono">
              Areas of Expertise
            </motion.span>
            <motion.h2 variants={fadeUp} custom={1} className="font-heading text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight">
              A Multi-Disciplinary <span className="italic font-serif text-primary">Artist</span>
            </motion.h2>
            <motion.div variants={fadeUp} custom={2} className="w-16 h-[2px] bg-primary mx-auto my-3" />
            <motion.p variants={fadeUp} custom={3} className="text-sm text-gray-400 font-light max-w-lg mx-auto leading-relaxed">
              From high-pressure film sets to intimate bridal mornings, every project receives the same 
              dedication to precision, skin health, and artistic excellence.
            </motion.p>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {[
              {
                icon: Film,
                title: 'Film & Television',
                desc: 'HD camera-ready makeup designed for 8K lenses. Color-matched continuity across multi-day shoots, sweat-proof matte finishes, and fast on-set touch-ups between takes.',
                color: 'from-blue-900/20 via-primary/5 to-transparent',
                badge: 'PRODUCTION'
              },
              {
                icon: Camera,
                title: 'Editorial & Commercial',
                desc: 'Avant-garde editorial looks, commercial campaigns, and magazine spreads. Every look is crafted to read boldly through the lens while maintaining skin integrity.',
                color: 'from-rose-900/20 via-primary/5 to-transparent',
                badge: 'FASHION'
              },
              {
                icon: Palette,
                title: 'Creative & SFX',
                desc: 'Character-focused depth modeling, realistic prosthetics, and avant-garde designs for theatrical productions, lookbooks, and creative brand activations.',
                color: 'from-purple-900/20 via-primary/5 to-transparent',
                badge: 'CREATIVE'
              },
              {
                icon: Heart,
                title: 'Bridal Specialist',
                desc: 'Luxury bridal artistry for modern African weddings. From traditional Yoruba, Hausa, and Igbo ceremonies to white wedding glamour — long-wear, waterproof, and photogenic.',
                color: 'from-amber-900/20 via-primary/5 to-transparent',
                badge: 'BRIDAL'
              },
              {
                icon: Music,
                title: 'Fashion Shows',
                desc: 'Runway-ready makeup designed for rapid changes, bold lighting, and distance readability. Backstage coordination for seamless show execution.',
                color: 'from-emerald-900/20 via-primary/5 to-transparent',
                badge: 'RUNWAY'
              },
              {
                icon: Eye,
                title: 'On-Site & Travel',
                desc: 'Fully mobile studio setup for destination weddings, location shoots, and international productions. Equipped for any environment.',
                color: 'from-orange-900/20 via-primary/5 to-transparent',
                badge: 'MOBILE'
              },
            ].map((specialty, i) => {
              const Icon = specialty.icon;
              return (
                <motion.div
                  key={specialty.title}
                  variants={fadeUp}
                  custom={i}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className="group relative bg-[#111] border border-white/5 rounded-2xl p-6 overflow-hidden hover:border-primary/20 transition-all duration-300"
                >
                  {/* Gradient background on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${specialty.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  
                  <div className="relative z-10 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300">
                        <Icon className="h-6 w-6" />
                      </div>
                      <span className="text-[8px] uppercase tracking-[0.2em] text-zinc-600 font-mono font-bold">
                        {specialty.badge}
                      </span>
                    </div>
                    <h3 className="font-heading text-lg font-semibold text-[#FAF7F2] group-hover:text-primary transition-colors">
                      {specialty.title}
                    </h3>
                    <p className="text-xs text-zinc-400 font-light leading-relaxed">
                      {specialty.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </ScrollReveal>

      {/* ═══════════════════ PHILOSOPHY ═══════════════════ */}
      <ScrollReveal animation="up" className="py-24">
        <div className="max-w-7xl mx-auto px-6 sm:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left: Core philosophy */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="space-y-6"
            >
              <span className="text-primary uppercase tracking-widest text-xs font-semibold font-mono">
                The Approach
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl font-medium tracking-tight">
                Calm & Graceful <br />
                <span className="italic font-serif text-primary">Artistry Method</span>
              </h2>
              <div className="w-16 h-[2px] bg-primary" />
              <p className="text-sm text-gray-400 font-light leading-relaxed">
                Designed to create zero friction, ensure absolute comfort, and maintain complete 
                focus under hectic schedule timelines. Every appointment — whether on a film set 
                or in the bridal suite — begins with a consultation to understand skin type, 
                desired look, and the environment the makeup will be worn in.
              </p>

              {/* Principles */}
              <div className="space-y-5 pt-4">
                {[
                  {
                    icon: Smile,
                    title: 'Composed & Punctual',
                    desc: 'Renowned for maintaining a peaceful, patient, and professional composure on intense film production sets, wedding morning rushes, or catalog shoots. Punctuality is absolute.'
                  },
                  {
                    icon: Heart,
                    title: 'Active Collaboration',
                    desc: 'We listen closely to references, sketches, outfits, and styling boards. We map the ideal tones dynamically to match the client\'s skin undertone and event concept.'
                  },
                  {
                    icon: ShieldCheck,
                    title: 'Premium Sanitary Standards',
                    desc: 'Stringent hygiene protocols using sterilized luxury palettes and non-comedogenic formulas to protect the skin barrier. Every brush is cleaned between uses.'
                  },
                ].map((principle, i) => {
                  const Icon = principle.icon;
                  return (
                    <motion.div
                      key={principle.title}
                      initial={{ opacity: 0, x: -15 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 + 0.3 }}
                      className="flex gap-4 p-4 rounded-2xl bg-[#111] border border-white/5 hover:border-primary/10 transition-all"
                    >
                      <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0 mt-0.5">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-[#FAF7F2]">{principle.title}</h4>
                        <p className="text-xs text-zinc-500 font-light mt-1 leading-relaxed">{principle.desc}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Right: Image & mission */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="space-y-8"
            >
              {/* Secondary image */}
              <div className="relative rounded-[2.5rem] overflow-hidden border border-white/5 bg-zinc-900 h-72 sm:h-96">
                <img 
                  src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=1000&auto=format&fit=crop"
                  alt="Makeup Studio"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <span className="text-[10px] uppercase tracking-widest bg-primary/90 text-black font-bold px-3 py-1.5 rounded-lg">
                    Studio Environment
                  </span>
                </div>
              </div>

              {/* Mission & Vision cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-[#111] border border-white/5 rounded-2xl p-6 space-y-3">
                  <Award className="h-6 w-6 text-primary" />
                  <h4 className="font-heading text-base font-semibold text-foreground">Mission</h4>
                  <p className="text-xs text-zinc-400 font-light leading-relaxed">
                    To create professional, camera-ready beauty experiences that bring every story, 
                    character, and client vision to life.
                  </p>
                </div>
                <div className="bg-[#111] border border-white/5 rounded-2xl p-6 space-y-3">
                  <Star className="h-6 w-6 text-primary" />
                  <h4 className="font-heading text-base font-semibold text-foreground">Vision</h4>
                  <p className="text-xs text-zinc-400 font-light leading-relaxed">
                    To become one of Africa's most trusted names in film, television, editorial, 
                    and luxury beauty artistry.
                  </p>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-center gap-3 text-xs text-zinc-500 bg-[#111] border border-white/5 rounded-xl px-5 py-3">
                <MapPin className="h-4 w-4 text-primary shrink-0" />
                <span className="font-light">Available for local, national, and international bookings — from film sets to destination weddings.</span>
              </div>
            </motion.div>
          </div>
        </div>
      </ScrollReveal>

      {/* ═══════════════════ BRANDS & PARTNERS ═══════════════════ */}
      <ScrollReveal animation="fade" className="py-20 bg-[#0A0A0A] border-t border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 sm:px-12">
          <div className="text-center space-y-6">
            <span className="text-primary uppercase tracking-widest text-xs font-bold font-mono">
              Trusted Partners
            </span>
            <h3 className="font-heading text-2xl sm:text-3xl text-gray-300">
              Featuring <span className="italic font-serif text-primary">Premium Brands</span>
            </h3>
            <p className="text-xs sm:text-sm text-zinc-500 font-light max-w-lg mx-auto leading-relaxed">
              Every service uses professional-grade, skin-safe products chosen for their 
              exceptional performance and flawless finish on melanin-rich skin.
            </p>
            
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="flex flex-wrap items-center justify-center gap-x-14 gap-y-6 pt-6"
            >
              {['Pat McGrath Labs', 'Fenty Beauty', 'NARS Cosmetics', 'Lancôme', 'Danessa Myricks', 'Huda Beauty'].map((brand, i) => (
                <motion.span
                  key={brand}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  whileHover={{ y: -2, color: '#D4A373' }}
                  className="text-sm text-zinc-400 font-mono tracking-widest uppercase cursor-default transition-colors duration-300"
                >
                  {brand}
                </motion.span>
              ))}
            </motion.div>
          </div>
        </div>
      </ScrollReveal>

      {/* ═══════════════════ CTA SECTION ═══════════════════ */}
      <ScrollReveal animation="scale" className="py-24 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10 space-y-6">
          <span className="text-primary uppercase tracking-widest text-xs font-bold font-mono">Let's Create Together</span>
          <h2 className="font-heading text-3xl sm:text-5xl font-medium tracking-tight leading-tight">
            Ready to bring your <br />
            <span className="italic font-serif text-primary">vision to life</span>?
          </h2>
          <p className="text-sm text-gray-400 font-light max-w-xl mx-auto leading-relaxed">
            Whether it's for a feature film, a destination wedding, an editorial campaign, 
            or a creative project — every look starts with a conversation.
          </p>
          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <motion.a
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              href="/book"
              className="bg-primary text-black font-bold px-8 py-4 rounded-xl text-xs uppercase tracking-widest transition-all shadow-lg hover:bg-primary/95 flex items-center gap-2"
            >
              Book a Consultation <ArrowRight className="h-4 w-4" />
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              href="/portfolio"
              className="bg-transparent border border-white/20 text-foreground font-semibold px-8 py-4 rounded-xl text-xs uppercase tracking-widest hover:bg-white/5 transition-all"
            >
              View Portfolio
            </motion.a>
          </div>
        </div>
      </ScrollReveal>

    </div>
  );
}
