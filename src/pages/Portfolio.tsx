import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Film, Sparkles, Heart, ChevronRight, Grid, Image as ImageIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PortfolioItem {
  id: string;
  title: string;
  image_url: string;
  description: string;
  category: string;
  tags?: string[];
  published_at?: string;
}

const CATEGORIES = [
  'All',
  'Film Production',
  'Editorial Shoot',
  'Creative Glam',
  'Bridal',
  'Fashion Show',
  'Flickr Stream'
];

export default function Portfolio() {
  const navigate = useNavigate();
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<PortfolioItem[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLookbook() {
      try {
        const [resP, resF] = await Promise.all([
          fetch('/api/portfolio'),
          fetch('/api/flickr')
        ]);

        let lookbookData: PortfolioItem[] = [];
        let flickrData: PortfolioItem[] = [];

        if (resP.ok) {
          lookbookData = await resP.json();
        }
        if (resF.ok) {
          flickrData = await resF.json();
        }

        // Standardize category labeling for filtering
        const normalizedLookbook = lookbookData.map(item => ({
          ...item,
          category: item.category || 'Editorial Shoot'
        }));

        const normalizedFlickr = flickrData.map(item => ({
          ...item,
          category: 'Flickr Stream'
        }));

        const combined = [...normalizedLookbook, ...normalizedFlickr];
        setItems(combined);
        setFilteredItems(combined);
      } catch (error) {
        console.error("Failed to load portfolio items:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchLookbook();
  }, []);

  useEffect(() => {
    if (activeCategory === 'All') {
      setFilteredItems(items);
    } else {
      setFilteredItems(items.filter(item => item.category.toLowerCase() === activeCategory.toLowerCase()));
    }
  }, [activeCategory, items]);

  return (
    <div className="bg-background text-foreground min-h-screen pt-32 pb-24">
      {/* Header */}
      <section className="w-full px-6 sm:px-12 text-center mb-16 space-y-4">
        <span className="text-primary uppercase tracking-widest text-xs font-semibold font-mono">
          Artistic Lookbook
        </span>
        <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-medium tracking-tight">
          Flawless <span className="italic font-serif text-primary">Artistry in Action</span>
        </h1>
        <div className="w-20 h-[1.5px] bg-primary mx-auto my-4"></div>
        <p className="text-xs sm:text-sm text-gray-400 font-light max-w-2xl mx-auto leading-relaxed">
          A premium collection of lookbook portraits and dynamic camera stills synchronised directly from film production sets, runways, and bridal preparations.
        </p>
      </section>

      {/* Category Filters */}
      <section className="w-full px-6 sm:px-12 mb-12 flex flex-wrap justify-center gap-3">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-5 py-2.5 rounded-full text-xs uppercase tracking-widest font-semibold border transition-all cursor-pointer ${
              activeCategory === cat
                ? 'bg-primary border-primary text-black font-bold shadow-md'
                : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:border-white/25'
            }`}
          >
            {cat}
          </button>
        ))}
      </section>

      {/* Lookbook Masonry / Grid */}
      <section className="w-full px-6 sm:px-12">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="animate-pulse bg-[#111] rounded-3xl h-80"></div>
            ))}
          </div>
        ) : (
          <>
            {filteredItems.length === 0 ? (
              <div className="text-center py-20 bg-[#111] rounded-3xl border border-white/5 p-8 max-w-lg mx-auto space-y-3">
                <ImageIcon className="h-8 w-8 text-primary mx-auto opacity-55 animate-pulse" />
                <h3 className="font-heading text-lg font-semibold">Lookbook Category Empty</h3>
                <p className="text-xs text-zinc-500 font-light max-w-xs mx-auto">
                  There are no portraits listed under this category yet. Select another tab or synchronise your Flickr feed.
                </p>
              </div>
            ) : (
              <motion.div
                layout
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-left"
              >
                <AnimatePresence mode="popLayout">
                  {filteredItems.map((item, index) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.4 }}
                      key={item.id}
                      className="bg-[#111] border border-white/5 rounded-3xl overflow-hidden group shadow-lg flex flex-col justify-between"
                    >
                      <div className="relative h-72 overflow-hidden bg-zinc-900">
                        <img
                          src={item.image_url}
                          alt={item.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <span className="absolute top-4 left-4 bg-black/80 border border-white/10 text-[8.5px] uppercase tracking-widest font-mono font-bold px-3 py-1 rounded-full text-primary">
                          {item.category === 'Flickr Stream' ? 'Live Still' : item.category}
                        </span>
                      </div>

                      <div className="p-6 space-y-2">
                        <h3 className="font-heading text-lg font-semibold text-[#FAF7F2] tracking-tight group-hover:text-primary transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-xs text-zinc-400 font-light leading-relaxed line-clamp-3">
                          {item.description}
                        </p>

                        {/* Display custom tags if available */}
                        {item.tags && item.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-2">
                            {item.tags.slice(0, 3).map(tag => (
                              <span key={tag} className="text-[8.5px] font-mono text-zinc-500 bg-white/5 px-2 py-0.5 rounded border border-white/5 uppercase">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                        
                        <div className="pt-4 mt-2 flex flex-col gap-3">
                          <div className="flex items-center justify-between text-[10px] text-zinc-500 font-mono">
                            <span>{item.category === 'Flickr Stream' ? (item.tags ? '#' + item.tags.slice(0,2).join(' #') : "Joan's Flickr") : 'Studio Portfolio'}</span>
                            <span>{item.published_at || 'Recent'}</span>
                          </div>
                          {item.category === 'Flickr Stream' && (
                            <div className="flex flex-wrap gap-1.5">
                              {item.tags?.slice(0, 3).map(tag => (
                                <span key={tag} className="text-[8px] font-mono text-zinc-500 bg-white/5 px-2 py-0.5 rounded border border-white/5 uppercase">#{tag}</span>
                              ))}
                            </div>
                          )}
                          <button
                            onClick={() => navigate('/book')}
                            className="w-full py-2.5 bg-primary hover:bg-primary/95 text-black text-[10px] uppercase tracking-widest font-bold rounded-xl transition-all cursor-pointer shadow-md"
                          >
                            Book This Look
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </>
        )}
      </section>

      {/* Footer Info */}
      <section className="w-full px-6 text-center mt-20 space-y-6">
        <h3 className="font-heading text-2xl">Tailoring evocative designs for <span className="italic font-serif text-primary">every setup</span></h3>
        <p className="text-xs text-zinc-500 font-light leading-relaxed max-w-lg mx-auto">
          Joan collaborates directly with clients to map tones and styling structures. Discover your matching palette using our AI tool or initiate a consultation.
        </p>
      </section>

    </div>
  );
}
