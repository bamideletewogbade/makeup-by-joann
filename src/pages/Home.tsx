import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Calendar, ChevronRight, Star, Heart, Palette, Camera, Image as ImageIcon } from 'lucide-react';

interface Service {
  id: string;
  name: string;
  category: string;
  starting_price: number;
  duration: string;
  description: string;
  popular?: boolean;
}

interface PortfolioItem {
  id: string;
  title: string;
  image_url: string;
  description: string;
  category: string;
  featured?: boolean;
  tags?: string[];
  published_at?: string;
}

interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
}

interface HomeProps {
  onNavigate: (tab: string) => void;
}

const SCENES = [
  {
    title: "Professional Makeup for Film & Television",
    tagline: "Scene 01 // Studio Production",
    description: "High-definition makeup designed to perform under studio lights. Long-wear, camera-ready finishes that look flawless on screen and in person.",
    image: "/images/1.png",
    imageBefore: "/images/1A.png",
    imageAfter: "/images/1.png",
    badge: "Film & TV",
    badgePrimary: "Camera-Ready Artistry",
    headerTitle: "Expert Makeup For",
    headerItalic: "Film, TV & Editorial",
  },
  {
    title: "Luminous Bridal & Evening Glamour",
    tagline: "Scene 02 // Bridal Collection",
    description: "Radiant, long-lasting makeup for your special day. From dewy bridal looks to dramatic evening glam, every detail is tailored to you.",
    image: "/images/2.png",
    imageBefore: "/images/2A.png",
    imageAfter: "/images/2.png",
    badge: "Bridal & Events",
    badgePrimary: "Bridal & Special Events",
    headerTitle: "Beautiful Makeup For",
    headerItalic: "Weddings & Celebrations",
  },
  {
    title: "Editorial & Fashion Runway Looks",
    tagline: "Scene 03 // Editorial Collection",
    description: "Bold, creative makeup for fashion editorials, runway shows, and commercial campaigns. Precision artistry that brings creative visions to life.",
    image: "/images/3.png",
    imageBefore: "/images/3A.png",
    imageAfter: "/images/3.png",
    badge: "Editorial & Fashion",
    badgePrimary: "Editorial & Fashion Artistry",
    headerTitle: "Creative Looks For",
    headerItalic: "Runway & Editorial Shoots",
  }
];

export default function Home({ onNavigate }: HomeProps) {
  const [services, setServices] = useState<Service[]>([]);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [flickrItems, setFlickrItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeScene, setActiveScene] = useState(0);
  const [sliderPosition, setSliderPosition] = useState(45);
  const [homepageSections, setHomepageSections] = useState<Record<string, any>>({});

  // Auto-rotate hero scenes
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveScene((prev) => (prev + 1) % SCENES.length);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    async function loadData() {
      try {
        const [resS, resP, resT, resF, resSet] = await Promise.all([
          fetch('/api/services'),
          fetch('/api/portfolio'),
          fetch('/api/testimonials'),
          fetch('/api/flickr'),
          fetch('/api/settings'),
        ]);
        if (resS.ok) setServices(await resS.json());
        if (resP.ok) {
          const rawP = await resP.json();
          setPortfolio(rawP.filter((item: PortfolioItem) => item.featured));
        }
        if (resT.ok) setTestimonials(await resT.json());
        if (resF.ok) {
          const rawF = await resF.json();
          setFlickrItems(rawF.slice(0, 8));
        }
        if (resSet.ok) {
          const settings = await resSet.json();
          setHomepageSections(settings.homepageSections || {});
        }
      } catch (err) {
        console.error("Error loading home data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const scene = SCENES[activeScene];

  return (
    <div className="flex flex-col bg-background text-foreground overflow-hidden">

      {/* ─── 1. HERO ─── */}
      <section className="relative min-h-screen flex items-center pt-24 bg-background text-foreground overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0 z-0 opacity-30 transition-all duration-1000">
          <img
            src={scene?.imageAfter || "https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=2000&auto=format&fit=crop"}
            alt="Beauty Close-up Background"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-black/40" />
        </div>

        <div className="w-full px-6 sm:px-12 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-center">
          {/* Left: Text */}
          <motion.div
            key={activeScene}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="space-y-6 text-left"
          >
            <span className="inline-block py-1 px-3.5 bg-primary/15 text-primary border border-primary/25 rounded-full text-xs font-semibold uppercase tracking-widest">
              {scene?.badgePrimary || "Professional Makeup Artistry"}
            </span>

            <h1 className="font-heading text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-medium tracking-tight leading-tight">
              <span>{scene?.headerTitle || "Professional Makeup For"}</span>
              <br />
              <span className="text-primary italic font-serif leading-none mt-2 inline-block">
                {scene?.headerItalic || "Every Occasion"}
              </span>
            </h1>

            <p className="text-base sm:text-lg text-gray-300 font-light max-w-xl leading-relaxed min-h-[60px]">
              {scene?.description || "Premium makeup artistry for film, television, bridal, editorial, and fashion. Every look is tailored, every detail perfected."}
            </p>

            {/* Trust metrics */}
            <div className="grid grid-cols-3 gap-6 py-4 border-t border-b border-white/10 max-w-lg">
              <div>
                <motion.h3
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="font-heading text-3xl md:text-4xl font-bold text-primary"
                >
                  25+
                </motion.h3>
                <p className="text-xs sm:text-sm text-gray-400 font-light uppercase tracking-widest">Productions</p>
              </div>
              <div>
                <motion.h3
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="font-heading text-3xl md:text-4xl font-bold text-primary"
                >
                  4+ Yrs
                </motion.h3>
                <p className="text-xs sm:text-sm text-gray-400 font-light uppercase tracking-widest">Experience</p>
              </div>
              <div>
                <motion.h3
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="font-heading text-3xl md:text-4xl font-bold text-primary"
                >
                  100%
                </motion.h3>
                <p className="text-xs sm:text-sm text-gray-400 font-light uppercase tracking-widest">Client Satisfaction</p>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 pt-3">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onNavigate('book')}
                className="bg-primary text-black font-semibold px-6 py-3.5 rounded-lg text-sm tracking-wider cursor-pointer transition-all flex items-center gap-2 shadow-lg hover:bg-primary/90"
              >
                <Calendar className="h-4 w-4" /> Book a Consultation
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onNavigate('portfolio')}
                className="bg-transparent border border-white/25 text-foreground font-semibold px-6 py-3.5 rounded-lg text-sm tracking-wider cursor-pointer transition-all flex items-center gap-1 hover:bg-white/5"
              >
                View Portfolio <ChevronRight className="h-4 w-4" />
              </motion.button>
            </div>
          </motion.div>

          {/* Right: Before/After Slider */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative hidden lg:flex justify-end"
          >
            <div className="w-full max-w-[540px] h-[640px] rounded-[2.5rem] overflow-hidden border border-white/10 bg-gradient-to-b from-[#0F0F0F] to-[#0A0A0A] shadow-2xl shadow-primary/5 relative flex flex-col justify-between p-6 space-y-4">
              {/* Before/After Description */}
              <div className="flex items-center gap-3 px-1 py-0.5">
                <div className="w-6 h-6 rounded-full bg-primary/15 border border-primary/20 flex items-center justify-center shrink-0">
                  <svg className="w-3 h-3 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 3 21 3 21 9"/>
                    <polyline points="9 21 3 21 3 15"/>
                    <line x1="21" y1="3" x2="14" y2="10"/>
                    <line x1="3" y1="21" x2="10" y2="14"/>
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-semibold text-primary/90 uppercase tracking-[0.2em]">
                    Interactive Before & After
                  </span>
                  <p className="text-[8.5px] text-gray-500 font-light tracking-wide mt-0.5">
                    Drag the slider left or right to see the full transformation
                  </p>
                </div>
              </div>

              {/* Interactive Before/After */}
              <motion.div
                className="relative h-[350px] w-full rounded-[1.8rem] overflow-hidden border border-white/5 bg-[#121212] select-none group/slider cursor-ew-resize"
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = ((e.clientX - rect.left) / rect.width) * 100;
                  setSliderPosition(Math.max(0, Math.min(100, x)));
                }}
                onTouchMove={(e) => {
                  if (e.touches[0]) {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = ((e.touches[0].clientX - rect.left) / rect.width) * 100;
                    setSliderPosition(Math.max(0, Math.min(100, x)));
                  }
                }}
                whileHover={{ borderColor: 'rgba(212, 163, 115, 0.3)' }}
                transition={{ duration: 0.3 }}
              >
                {/* After (background) */}
                <img
                  src={scene?.imageAfter}
                  alt="After Look"
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                />
                <div className="absolute bottom-3 right-3 bg-primary text-black text-[8px] uppercase tracking-widest font-bold px-2.5 py-1 rounded-md z-20 pointer-events-none shadow-md">
                  After
                </div>

                {/* Before (clipped) */}
                <div
                  className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden"
                  style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
                >
                  <img
                    src={scene?.imageBefore}
                    alt="Before Look"
                    referrerPolicy="no-referrer"
                    className="absolute inset-0 w-full h-full object-cover pointer-events-none"

                  />
                  <div className="absolute bottom-3 left-3 bg-black/80 text-foreground border border-white/10 text-[8px] uppercase tracking-widest font-bold px-2.5 py-1 rounded-md z-20 pointer-events-none shadow-md">
                    Before
                  </div>
                </div>

                {/* Slider handle */}
                <div
                  className="absolute top-0 bottom-0 w-[1.5px] bg-primary z-30 pointer-events-none"
                  style={{ left: `${sliderPosition}%` }}
                >
                  <motion.div
                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-10 w-10 rounded-full bg-[#121212] border-2 border-primary flex items-center justify-center shadow-xl shadow-primary/20"
                    whileHover={{ scale: 1.15 }}
                    transition={{ duration: 0.2 }}
                  >
                    <span className="text-xs font-mono text-primary text-center select-none font-bold">↔</span>
                  </motion.div>
                </div>

                <motion.div
                  className="absolute top-3 left-3 bg-black/75 backdrop-blur-md border border-white/10 px-2.5 py-1 rounded-lg z-20 flex items-center gap-1.5 pointer-events-none"
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  <span className="text-[7.5px] font-mono tracking-widest text-primary uppercase font-bold">Slide to Compare</span>
                </motion.div>
              </motion.div>

              {/* Scene info */}
              <div className="flex-1 flex flex-col justify-between text-left space-y-3">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.5 }}
                      className="text-[9px] uppercase tracking-widest px-3 py-0.5 rounded-full font-bold bg-primary/20 text-primary border border-primary/20"
                    >
                      {scene?.badge}
                    </motion.span>
                    <span className="text-[9px] font-mono text-gray-500 uppercase">
                      {scene?.tagline}
                    </span>
                  </div>
                  <motion.h4
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.6 }}
                    className="font-heading text-lg font-semibold text-foreground tracking-tight pt-1 leading-tight"
                  >
                    {scene?.title}
                  </motion.h4>
                </div>

                {/* Scene controls */}
                <div className="flex items-center justify-between border-t border-white/5 pt-3">
                  <div className="flex items-center gap-1.5">
                    {SCENES.map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => { setActiveScene(i); setSliderPosition(45); }}
                        className={`h-1.5 rounded-full transition-all duration-500 cursor-pointer ${
                          activeScene === i ? 'w-6 bg-primary shadow-sm shadow-primary/30' : 'w-1.5 bg-white/20 hover:bg-white/40'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest">
                    {activeScene + 1} / {SCENES.length}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── 2. PORTFOLIO PREVIEW ─── */}
      {homepageSections.portfolio !== false && (
      <section className="py-24 w-full px-6 sm:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="space-y-4 text-left">
            <span className="text-primary uppercase tracking-widest text-xs font-semibold font-mono">
              Featured Work
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight">
              Recent <span className="italic font-serif text-primary">Portfolio</span>
            </h2>
            <div className="w-16 h-[1.5px] bg-primary" />
            <p className="text-xs sm:text-sm text-gray-300 font-light max-w-xl leading-relaxed">
              A selection of recent work from film sets, bridal celebrations, and editorial shoots.
              Each look is uniquely tailored to the client and occasion.
            </p>
          </div>
          <button
            onClick={() => onNavigate('portfolio')}
            className="border border-white/20 hover:border-primary text-foreground hover:text-primary text-xs uppercase tracking-widest font-semibold py-3 px-6 rounded-lg transition-all flex items-center gap-1 shrink-0 self-start md:self-auto cursor-pointer"
          >
            View Full Portfolio <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            [1, 2, 3].map(i => (
              <div key={i} className="animate-pulse bg-white/5 rounded-3xl h-72" />
            ))
          ) : portfolio.length === 0 ? (
            <div className="col-span-full text-center py-16 bg-[#111] rounded-3xl border border-white/5 space-y-3">
              <Camera className="h-8 w-8 text-primary mx-auto opacity-50" />
              <p className="text-sm text-zinc-400 font-light">Portfolio images coming soon.</p>
            </div>
          ) : (
            portfolio.slice(0, homepageSections.portfolioCount || 3).map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group bg-[#111] border border-white/5 rounded-3xl overflow-hidden hover:border-primary/20 transition-all duration-300"
              >
                <div className="relative h-64 overflow-hidden bg-zinc-900">
                  <img
                    src={item.image_url}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="p-6 space-y-2 text-left">
                  <span className="text-[9px] text-primary uppercase tracking-widest font-mono font-bold">
                    {item.category.replace('_', ' ')}
                  </span>
                  <h3 className="font-heading text-lg font-semibold text-foreground tracking-tight group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-400 font-light leading-relaxed line-clamp-2">
                    {item.description}
                  </p>
                  <button
                    onClick={() => onNavigate('book')}
                    className="mt-3 text-xs text-primary font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    Inquire About This Look →
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </section>
      )}

      {/* ─── 3. SERVICES PREVIEW ─── */}
      {homepageSections.services !== false && (
      <section className="py-24 w-full px-6 sm:px-12">
          <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <span className="text-primary uppercase tracking-widest text-xs font-semibold">Services</span>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight">
              Professional <span className="italic font-serif text-primary">Packages</span>
            </h2>
            <div className="w-16 h-[1.5px] bg-primary mx-auto my-3" />
            <p className="text-xs sm:text-sm text-gray-300 font-light">
              From bridal beauty to film production makeup — each service is crafted to deliver a flawless, tailored result.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
            {services.slice(0, 3).map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -4 }}
                className={`group bg-[#111] rounded-2xl border border-white/5 overflow-hidden relative flex flex-col justify-between hover:shadow-2xl transition-all duration-300 ${
                  service.popular ? 'border-primary ring-[1px] ring-primary/30' : ''
                }`}
              >
                {service.popular && (
                  <span className="absolute top-4 right-4 bg-primary text-black text-[9px] uppercase tracking-widest font-bold px-3 py-1 rounded-full">
                    Most Requested
                  </span>
                )}
                <div className="p-8 space-y-4">
                  <span className="text-[10px] text-primary font-bold uppercase tracking-widest">
                    {service.category.replace('_', ' ')}
                  </span>
                  <h3 className="font-heading text-xl font-medium group-hover:text-primary transition-colors text-foreground">
                    {service.name}
                  </h3>
                  <p className="text-gray-300 text-xs font-light tracking-wide line-clamp-3">
                    {service.description}
                  </p>
                  <div className="flex items-baseline gap-1 pt-3">
                    <span className="text-xs text-gray-500 font-light">Pricing</span>
                    <span className="text-lg font-bold text-primary">Pricing on Request</span>
                  </div>
                </div>
                <div className="p-8 pt-0 border-t border-white/5 bg-black/20 flex items-center justify-between mt-auto">
                  <span className="text-xs text-gray-500 font-mono tracking-wider">{service.duration}</span>
                  <button
                    onClick={() => onNavigate('services')}
                    className="text-xs text-primary font-semibold tracking-wider hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    View Details →
                  </button>
                </div>
              </motion.div>
            )          )}
          </div>
          </div>

          <div className="text-center mt-12">
            <button
              onClick={() => onNavigate('services')}
              className="border border-white/20 hover:border-primary text-foreground hover:text-primary text-xs uppercase tracking-widest font-semibold py-3 px-8 rounded-lg transition-all cursor-pointer"
            >
              View All Services
            </button>
          </div>
        </section>
      )}

      {/* ─── 4. TRUST & EXPERIENCE ─── */}
      <section className="bg-[#0D0D0D] border-t border-b border-white/5 py-24">
        <div className="w-full px-6 sm:px-12">
          <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <span className="text-primary uppercase tracking-widest text-xs font-semibold font-mono">Why Choose Joann</span>
            <h2 className="font-heading text-3xl sm:text-4xl font-medium tracking-tight">
              Experience You Can <span className="italic font-serif text-primary">Trust</span>
            </h2>
            <div className="w-16 h-[1.5px] bg-primary mx-auto my-3" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div className="bg-[#111] p-8 rounded-3xl border border-white/5 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                <Camera className="h-6 w-6" />
              </div>
              <h3 className="font-heading text-lg font-semibold text-foreground">Film & TV Expertise</h3>
              <p className="text-sm text-gray-300 font-light leading-relaxed">
                25+ productions, 4+ years on set. Experienced in high-pressure environments from film sets to live broadcasts.
              </p>
            </div>

            <div className="bg-[#111] p-8 rounded-3xl border border-white/5 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                <Heart className="h-6 w-6" />
              </div>
              <h3 className="font-heading text-lg font-semibold text-foreground">Bespoke Service</h3>
              <p className="text-sm text-gray-300 font-light leading-relaxed">
                Every look is uniquely designed for you. No templates — just personalized artistry from consultation to final touch.
              </p>
            </div>

            <div className="bg-[#111] p-8 rounded-3xl border border-white/5 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                <Star className="h-6 w-6" />
              </div>
              <h3 className="font-heading text-lg font-semibold text-foreground">Premium Quality</h3>
              <p className="text-sm text-gray-300 font-light leading-relaxed">
                Using only the finest luxury products. Every service includes professional-grade, skin-safe products for a flawless finish.
              </p>
            </div>
          </div>
          </div>
        </div>
      </section>

      {/* ─── 5. FLICKR MEDIA GALLERY ─── */}
      {homepageSections.flickr !== false && (
      <section className="py-24 bg-black/40 border-t border-b border-white/5 overflow-hidden">
        <div className="w-full px-6 sm:px-12 mb-16">
          <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <span className="text-primary uppercase tracking-widest text-xs font-semibold font-mono">
              Live from the Studio
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight">
              Beauty in <span className="italic font-serif text-primary">Action</span>
            </h2>
            <div className="w-16 h-[1.5px] bg-primary mx-auto my-3" />
            <p className="text-xs sm:text-sm text-gray-300 font-light max-w-lg mx-auto leading-relaxed">
              Behind-the-scenes moments, backstage preparations, and finished looks from film sets, bridal celebrations, and editorial shoots.
            </p>
          </div>
          </div>
        </div>

        <div className="w-full px-6 sm:px-12">
          <div className="max-w-7xl mx-auto">
          {flickrItems.length === 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1,2,3,4,5,6,7,8].map(i => (
                <div key={i} className="animate-pulse bg-white/5 aspect-square rounded-2xl" />
              ))}
            </div>
          ) : (
            <>
              {/* Hero row - 2 large images */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {flickrItems.slice(0, 2).map((item, i) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: i * 0.1 }}
                    className="relative group rounded-2xl overflow-hidden bg-[#111] border border-white/5 aspect-[4/3] md:aspect-[16/10]"
                  >
                    <img
                      src={item.image_url}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                      <p className="text-xs text-white font-medium line-clamp-2">{item.title}</p>
                      <span className="text-[9px] text-primary uppercase tracking-widest mt-1 block">
                        {item.tags?.[0] || 'Photography'}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Grid row - 6 smaller images */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {flickrItems.slice(2, 8).map((item, i) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                    className="relative group rounded-xl overflow-hidden bg-[#111] border border-white/5 aspect-square"
                  >
                    <img
                      src={item.image_url}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <span className="text-[9px] text-white uppercase tracking-widest font-bold px-3 py-1.5 bg-primary/80 text-black rounded-full">
                        View
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Flickr CTA */}
              <div className="text-center mt-10">
                <a
                  href="https://www.flickr.com/photos/beautybyjoann/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs text-zinc-400 hover:text-primary transition-colors font-mono tracking-widest uppercase"
                >
                  <ImageIcon className="h-3.5 w-3.5" />
                  View more on Flickr
                </a>
              </div>
            </>
          )}
          </div>
        </div>
      </section>
      )}

      {/* ─── 6. AI CREATIVE LAB TEASER ─── */}
      {homepageSections.creativeLab !== false && (
      <section className="py-20 w-full px-6 sm:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-5 text-left">
            <div className="flex items-center gap-2 text-primary">
              <Sparkles className="h-5 w-5" />
              <span className="text-xs tracking-widest font-semibold uppercase">AI-Powered Tools</span>
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl font-medium tracking-tight leading-tight">
              Discover Your Perfect <br />
              <span className="text-primary italic font-serif">Look</span>
            </h2>
            <p className="text-sm text-gray-300 font-light leading-relaxed">
              Not sure what style suits you best? Try our AI Style Quiz for a personalized palette recommendation,
              or preview makeup looks with our Virtual Try-On tool.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onNavigate('creative-lab')}
                className="bg-primary text-black font-bold px-6 py-3.5 rounded-lg text-xs tracking-widest uppercase cursor-pointer transition-all shadow-md hover:bg-primary/95"
              >
                Explore Creative Lab
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onNavigate('style-quiz')}
                className="bg-transparent border border-white/20 text-foreground font-semibold px-6 py-3.5 rounded-lg text-xs tracking-widest uppercase cursor-pointer hover:bg-white/5 transition-all"
              >
                Take Style Quiz
              </motion.button>
            </div>
          </div>

          <div className="bg-[#111] border border-white/5 p-8 rounded-2xl backdrop-blur-md space-y-5 text-left">
            <span className="text-[10px] uppercase tracking-widest font-bold text-primary">How AI Can Help</span>
            <div className="space-y-4">
              <div className="flex gap-4 items-start">
                <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-semibold flex items-center justify-center shrink-0">1</span>
                <div>
                  <h4 className="text-sm font-semibold text-foreground">Find your color palette</h4>
                  <p className="text-xs text-gray-400 font-light mt-0.5">Answer a few questions about your event and preferences.</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-semibold flex items-center justify-center shrink-0">2</span>
                <div>
                  <h4 className="text-sm font-semibold text-foreground">Preview your look</h4>
                  <p className="text-xs text-gray-400 font-light mt-0.5">Upload a photo and see how different styles look on you.</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-semibold flex items-center justify-center shrink-0">3</span>
                <div>
                  <h4 className="text-sm font-semibold text-foreground">Share with your artist</h4>
                  <p className="text-xs text-gray-400 font-light mt-0.5">Your results can be saved and shared for your consultation.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      )}

      {/* ─── 6. TESTIMONIALS ─── */}
      {homepageSections.testimonials !== false && (
      <section className="py-24 bg-[#0D0D0D] border-t border-b border-white/5">
        <div className="w-full px-6 sm:px-12">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <span className="text-primary uppercase tracking-widest text-xs font-semibold">Testimonials</span>
            <h2 className="font-heading text-3xl sm:text-4xl font-medium tracking-tight">
              What Clients <span className="italic font-serif text-primary">Say</span>
            </h2>
            <div className="w-16 h-[1.5px] bg-primary mx-auto my-3" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            {testimonials.length === 0 && !loading ? (
              <div className="col-span-full text-center py-10 text-sm text-zinc-500 font-light">
                Testimonials coming soon.
              </div>
            ) : (
              testimonials.map((t) => (
                <div key={t.id} className="p-8 bg-[#111] border border-white/5 rounded-3xl relative space-y-5">
                  <span className="text-4xl text-primary font-serif absolute top-5 right-8 opacity-20">"</span>
                  <p className="text-sm text-gray-300 font-light leading-relaxed italic pr-6">
                    "{t.content}"
                  </p>
                  <div className="flex items-center gap-3.5 border-t border-white/5 pt-4">
                    <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-xs uppercase">
                      {t.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-foreground">{t.name}</h4>
                      <p className="text-[10px] text-zinc-500 uppercase tracking-wider mt-0.5">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
      )}

      {/* ─── 7. BOTTOM CTA ─── */}
      <section className="py-28 relative overflow-hidden bg-background border-b border-white/5 text-center">
        <div className="w-full px-6 relative z-10 space-y-6">
          <span className="text-primary uppercase tracking-widest text-xs font-bold font-mono">Get Started</span>
          <h2 className="font-heading text-3xl sm:text-5xl font-medium tracking-tight">
            Ready to create your <span className="italic font-serif text-primary">perfect look</span>?
          </h2>
          <p className="text-sm text-gray-300 font-light max-w-xl mx-auto leading-relaxed">
            Whether it's for a wedding, film production, editorial shoot, or any special occasion —
            let's bring your vision to life.
          </p>
          <div className="pt-4 flex justify-center">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onNavigate('book')}
              className="bg-primary text-black font-bold px-8 py-4 rounded-xl text-xs uppercase tracking-widest cursor-pointer transition-all shadow-lg hover:bg-primary/95 flex items-center gap-2"
            >
              <Calendar className="h-4 w-4" /> Book a Consultation
            </motion.button>
          </div>
        </div>
      </section>

    </div>
  );
}
