import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image as ImageIcon, ExternalLink } from 'lucide-react';
import CursorGlow from '../components/CursorGlow';

interface FlickrItem {
  id: string;
  title: string;
  image_url: string;
  description: string;
  category: string;
  tags?: string[];
  published_at?: string;
}

export default function Portfolio() {
  const [items, setItems] = useState<FlickrItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<FlickrItem[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFlickr() {
      try {
        const res = await fetch('/api/flickr');
        if (res.ok) {
          const data = await res.json();
          const normalized = data.map((item: FlickrItem) => ({
            ...item,
            category: 'Flickr Stream'
          }));
          setItems(normalized);
          setFilteredItems(normalized);
        }
      } catch (error) {
        console.error("Failed to load Flickr images:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchFlickr();
  }, []);

  useEffect(() => {
    if (activeCategory === 'All') {
      setFilteredItems(items);
    } else {
      setFilteredItems(items.filter(item => item.category.toLowerCase() === activeCategory.toLowerCase()));
    }
  }, [activeCategory, items]);

  // Extract unique tags as categories for filtering
  const allTags = [...new Set(items.flatMap(item => item.tags || []))];

  return (
    <div className="bg-background text-foreground min-h-screen pt-32 pb-24 relative overflow-hidden">
      <CursorGlow color="rgba(212, 163, 115, 0.1)" size={500} opacity={0.7} zIndex={0} particles />
      {/* Header */}
      <section className="w-full px-6 sm:px-12 text-center mb-16 space-y-4 relative z-10">
        <span className="text-primary uppercase tracking-widest text-xs font-semibold font-mono">
          Live from the Studio
        </span>
        <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-medium tracking-tight">
          Beauty in <span className="italic font-serif text-primary">Action</span>
        </h1>
        <div className="w-20 h-[1.5px] bg-primary mx-auto my-4"></div>
        <p className="text-xs sm:text-sm text-gray-400 font-light max-w-2xl mx-auto leading-relaxed">
          Real moments from film sets, bridal preparations, editorial shoots, and backstage — 
          synchronised directly from our studio feed.
        </p>
      </section>

      {/* Tag Filters */}
      {!loading && items.length > 0 && (
        <section className="w-full px-6 sm:px-12 mb-12 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => setActiveCategory('All')}
            className={`px-5 py-2.5 rounded-full text-xs uppercase tracking-widest font-semibold border transition-all cursor-pointer ${
              activeCategory === 'All'
                ? 'bg-primary border-primary text-black font-bold shadow-md'
                : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:border-white/25'
            }`}
          >
            All
          </button>
          {allTags.slice(0, 8).map(tag => (
            <button
              key={tag}
              onClick={() => setActiveCategory(tag)}
              className={`px-5 py-2.5 rounded-full text-xs uppercase tracking-widest font-semibold border transition-all cursor-pointer ${
                activeCategory === tag
                  ? 'bg-primary border-primary text-black font-bold shadow-md'
                  : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:border-white/25'
              }`}
            >
              #{tag}
            </button>
          ))}
        </section>
      )}

      {/* Masonry Grid */}
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
                <h3 className="font-heading text-lg font-semibold">No Images Yet</h3>
                <p className="text-xs text-zinc-500 font-light max-w-xs mx-auto">
                  The studio feed is loading. Images sync directly from our Flickr stream — check back soon.
                </p>
              </div>
            ) : (
              <motion.div
                layout
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
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
                      className="bg-[#111] border border-white/5 rounded-3xl overflow-hidden group shadow-lg"
                    >
                      <div className="relative h-72 overflow-hidden bg-zinc-900">
                        <img
                          src={item.image_url}
                          alt={item.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                          onError={(e) => {
                            const target = e.currentTarget;
                            target.src = 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=800&auto=format&fit=crop';
                          }}
                        />
                        <span className="absolute top-4 left-4 bg-black/80 border border-white/10 text-[8.5px] uppercase tracking-widest font-mono font-bold px-3 py-1 rounded-full text-primary">
                          Live Still
                        </span>
                      </div>

                      <div className="p-6 space-y-3">
                        <h3 className="font-heading text-lg font-semibold text-[#FAF7F2] tracking-tight group-hover:text-primary transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-xs text-zinc-400 font-light leading-relaxed line-clamp-2">
                          {item.description}
                        </p>

                        {item.tags && item.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {item.tags.slice(0, 4).map(tag => (
                              <span key={tag} className="text-[8.5px] font-mono text-zinc-500 bg-white/5 px-2 py-0.5 rounded border border-white/5 uppercase">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="pt-2 flex items-center justify-between text-[10px] text-zinc-500 font-mono">
                          <span>{item.published_at || 'Recent'}</span>
                          <a
                            href="https://www.flickr.com/photos/beautybyjoann/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-primary hover:underline"
                          >
                            <ExternalLink className="h-3 w-3" /> Flickr
                          </a>
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

      {/* Footer */}
      <section className="w-full px-6 text-center mt-20 space-y-6">
        <h3 className="font-heading text-2xl">Real artistry, <span className="italic font-serif text-primary">real moments</span></h3>
        <p className="text-xs text-zinc-500 font-light leading-relaxed max-w-lg mx-auto">
          Follow our latest work on Flickr for behind-the-scenes content, backstage preparations, and finished looks.
        </p>
        <a
          href="https://www.flickr.com/photos/beautybyjoann/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/95 text-black text-xs uppercase tracking-widest font-bold rounded-xl transition-all"
        >
          <ExternalLink className="h-3.5 w-3.5" /> View on Flickr
        </a>
      </section>
    </div>
  );
}
