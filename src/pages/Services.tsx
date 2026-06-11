import React, { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Film, Heart, Camera, Palette, Theater, Calendar, Info } from 'lucide-react';
import CursorGlow from '../components/CursorGlow';
import ScrollReveal from '../components/ScrollReveal';

interface Service {
  id: string;
  name: string;
  category: string;
  starting_price: number;
  duration: string;
  description: string;
  popular?: boolean;
}

interface ServicesProps {
  onNavigate: (tab: string) => void;
}

const CATEGORY_ICONS: Record<string, any> = {
  bridal: Heart,
  film_production: Film,
  editorial_shoot: Camera,
  creative_glam: Palette,
  fashion_show: Theater,
};

const CATEGORY_LABELS: Record<string, string> = {
  all: 'All',
  bridal: 'Bridal',
  film_production: 'Film & TV',
  editorial_shoot: 'Editorial',
  creative_glam: 'Creative',
  fashion_show: 'Fashion Show',
};

export default function Services({ onNavigate }: ServicesProps) {
  const [services, setServices] = useState<Service[]>([]);
  const [showPricing, setShowPricing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = useMemo(() => {
    const cats = new Set(services.map(s => s.category));
    return ['all', ...Array.from(cats)];
  }, [services]);

  const filteredServices = useMemo(() => {
    if (activeCategory === 'all') return services;
    return services.filter(s => s.category === activeCategory);
  }, [services, activeCategory]);

  useEffect(() => {
    async function loadServices() {
      try {
        const [resS, resSet] = await Promise.all([
          fetch('/api/services'),
          fetch('/api/settings'),
        ]);

        if (resS.ok) {
          setServices(await resS.json());
        }
        if (resSet.ok) {
          const settingsObj = await resSet.json();
          setShowPricing(!!settingsObj.showPricing);
        }
      } catch (err) {
        console.error("Error loading services data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadServices();
  }, []);

  return (
    <div className="bg-background text-foreground min-h-screen pt-32 pb-24 relative overflow-hidden">
      <CursorGlow color="rgba(212, 163, 115, 0.1)" size={500} opacity={0.7} zIndex={0} particles />
      {/* Page Header */}
      <ScrollReveal animation="fade" className="w-full px-6 sm:px-12 text-center mb-16 space-y-4 relative z-10">
        <span className="text-primary uppercase tracking-widest text-xs font-semibold font-mono">
          Services & Packages
        </span>
        <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-medium tracking-tight">
          Professional <span className="italic font-serif text-primary">Makeup Artistry</span>
        </h1>
        <div className="w-20 h-[1.5px] bg-primary mx-auto my-4"></div>
        <p className="text-xs sm:text-sm text-gray-300 font-light max-w-2xl mx-auto leading-relaxed">
          Expert makeup services for bridal, film and television, editorial shoots, fashion shows, and creative projects.
          Every look is tailored to you — from a wedding morning to a high-production set.
        </p>
      </ScrollReveal>

      {/* Category Filters */}
      {!loading && categories.length > 1 && (
        <section className="w-full px-6 sm:px-12 mb-12 flex flex-wrap justify-center gap-3">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-xs uppercase tracking-widest font-semibold border transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-primary border-primary text-black font-bold shadow-md'
                  : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:border-white/25'
              }`}
            >
              {CATEGORY_LABELS[cat] || cat.replace('_', ' ')}
            </button>
          ))}
        </section>
      )}

      {/* Services Grid */}
      <div className="w-full px-6 sm:px-12">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="animate-pulse bg-white/5 rounded-3xl h-80"></div>
            ))}
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="text-center py-20 bg-[#111] rounded-3xl border border-white/5 max-w-lg mx-auto space-y-3">
            <Info className="h-8 w-8 text-primary mx-auto opacity-55" />
            <h3 className="font-heading text-lg font-semibold">No Services Found</h3>
            <p className="text-xs text-zinc-400 font-light max-w-xs mx-auto">
              There are no services in this category yet. Try selecting another filter.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            {filteredServices.map((service, index) => {
              const IconComponent = CATEGORY_ICONS[service.category] || Sparkles;
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className={`group bg-[#111] rounded-3xl border border-white/5 p-8 flex flex-col justify-between relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:border-primary/20 ${
                    service.popular ? 'border-primary ring-[1px] ring-primary/25' : ''
                  }`}
                >
                  {service.popular && (
                    <span className="absolute top-6 right-6 bg-primary text-black text-[9px] uppercase tracking-widest font-black px-3 py-1 rounded-full">
                      Most Requested
                    </span>
                  )}

                  <div className="space-y-5">
                    {/* Header */}
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                        <IconComponent className="h-6 w-6" />
                      </div>
                      <div>
                        <span className="text-[9px] text-zinc-500 uppercase tracking-widest font-mono">
                          {CATEGORY_LABELS[service.category] || service.category.replace('_', ' ')}
                        </span>
                        <h3 className="font-heading text-xl font-semibold text-[#FAF7F2] mt-0.5 group-hover:text-primary transition-colors">
                          {service.name}
                        </h3>
                      </div>
                    </div>

                    <p className="text-gray-300 text-xs font-light leading-relaxed">
                      {service.description}
                    </p>

                    {/* Features checklist */}
                    <div className="space-y-2.5 pt-3">
                      <p className="text-[10px] text-primary uppercase tracking-widest font-bold font-mono">What's Included:</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-zinc-400 font-light">
                        <p className="flex items-center gap-2">✦ Premium skin prep & hydration</p>
                        <p className="flex items-center gap-2">✦ Camera-ready finish</p>
                        <p className="flex items-center gap-2">✦ Custom lash application</p>
                        <p className="flex items-center gap-2">✦ Travel & on-site setup</p>
                      </div>
                    </div>
                  </div>

                  {/* Footer Info */}
                  <div className="mt-8 pt-6 border-t border-white/5 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="text-left">
                        <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Pricing</p>
                        <p className="text-lg font-bold text-primary mt-0.5">
                          {showPricing ? `From $${service.starting_price}` : 'Pricing on Request'}
                        </p>
                      </div>
                      <div className="w-[1px] h-8 bg-white/10"></div>
                      <div className="text-left">
                        <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Duration</p>
                        <p className="text-sm font-semibold text-gray-300 mt-0.5">{service.duration}</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => onNavigate('book')}
                        className="px-6 py-3 bg-primary hover:bg-primary/95 text-black text-xs uppercase tracking-widest font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-md"
                      >
                        <Calendar className="h-3.5 w-3.5" /> Book Consultation
                      </button>
                    </div>
                  </div>

                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Brands Used */}
      <section className="mt-28 w-full px-6 sm:px-12 border-t border-white/5 pt-20">
        <div className="text-center space-y-4">
          <span className="text-primary uppercase tracking-widest text-[10px] font-bold font-mono">
            Trusted Partners
          </span>
          <h3 className="font-heading text-2xl text-gray-300">
            Featuring <span className="italic font-serif">Premium Brands</span>
          </h3>
          <p className="text-xs text-zinc-400 font-light max-w-md mx-auto leading-relaxed">
            Every service uses high-quality, skin-safe products chosen for their performance and flawless finish.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 pt-6 text-sm text-zinc-400 font-mono tracking-widest uppercase">
            <span className="hover:text-primary transition-colors cursor-default">Pat McGrath Labs</span>
            <span className="hover:text-primary transition-colors cursor-default">Fenty Beauty</span>
            <span className="hover:text-primary transition-colors cursor-default">NARS Cosmetics</span>
            <span className="hover:text-primary transition-colors cursor-default">Lancôme</span>
            <span className="hover:text-primary transition-colors cursor-default">Danessa Myricks</span>
          </div>
        </div>
      </section>

    </div>
  );
}
