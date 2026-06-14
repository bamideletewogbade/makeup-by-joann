import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, ChevronRight, BookOpen, Sparkles } from 'lucide-react';
import CursorGlow from '../components/CursorGlow';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  category: string;
  published_at?: string;
}

const BLOG_CATEGORIES = ['all', 'pro_tips', 'skincare', 'bridal', 'industry_news'];

const CATEGORY_LABELS: Record<string, string> = {
  all: 'All Posts',
  pro_tips: 'Pro Tips',
  skincare: 'Skincare',
  bridal: 'Bridal',
  industry_news: 'Industry News',
};

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [expandedPost, setExpandedPost] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch('/api/blogs');
        if (res.ok) {
          const data = await res.json();
          // Sort by date descending, newest first
          const sorted = data.sort((a: BlogPost, b: BlogPost) => {
            if (a.published_at && b.published_at) {
              return new Date(b.published_at).getTime() - new Date(a.published_at).getTime();
            }
            return 0;
          });
          setPosts(sorted);
          setFilteredPosts(sorted);
        }
      } catch (error) {
        console.error("Failed to load blog posts:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  useEffect(() => {
    if (activeCategory === 'all') {
      setFilteredPosts(posts);
    } else {
      setFilteredPosts(posts.filter(p => p.category === activeCategory));
    }
    setExpandedPost(null);
  }, [activeCategory, posts]);

  return (
    <div className="bg-background text-foreground min-h-screen pt-32 pb-24 relative overflow-hidden">
      <CursorGlow color="rgba(212, 163, 115, 0.1)" size={500} opacity={0.7} zIndex={0} particles />
      <div className="w-full px-6 max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12 space-y-4">
          <span className="text-primary uppercase tracking-widest text-xs font-semibold font-mono">
            Beauty Blog
          </span>
          <h1 className="font-heading text-4xl sm:text-5xl font-medium tracking-tight">
            Insights & <span className="italic font-serif text-primary">Inspiration</span>
          </h1>
          <div className="w-16 h-[1.5px] bg-primary mx-auto my-2" />
          <p className="text-xs text-zinc-400 font-light max-w-lg mx-auto leading-relaxed">
            Expert tips, bridal prep guides, skincare advice, and behind-the-scenes stories from the studio.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {BLOG_CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-[10px] uppercase tracking-widest font-semibold border transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-primary border-primary text-black font-bold'
                  : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:border-white/25'
              }`}
            >
              {CATEGORY_LABELS[cat] || cat.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Blog Posts */}
        {loading ? (
          <div className="space-y-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse bg-[#111] rounded-2xl h-48 border border-white/5" />
            ))}
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-20 bg-[#111] rounded-3xl border border-white/5 p-8 max-w-lg mx-auto space-y-3">
            <BookOpen className="h-8 w-8 text-primary mx-auto opacity-55" />
            <h3 className="font-heading text-lg font-semibold">No Posts Yet</h3>
            <p className="text-xs text-zinc-500 font-light max-w-xs mx-auto">
              Blog posts are managed from the admin panel. Check back soon for new content!
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredPosts.map((post, i) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 transition-all"
              >
                <div
                  onClick={() => setExpandedPost(expandedPost === post.id ? null : post.id)}
                  className="p-6 md:p-8 cursor-pointer"
                >
                  {/* Meta */}
                  <div className="flex items-center gap-3 mb-3 flex-wrap">
                    <span className="text-[9px] uppercase tracking-widest font-mono font-bold text-primary bg-primary/5 border border-primary/10 px-2.5 py-0.5 rounded-full">
                      {CATEGORY_LABELS[post.category] || post.category.replace('_', ' ')}
                    </span>
                    {post.published_at && (
                      <span className="text-[10px] text-zinc-500 flex items-center gap-1">
                        <Calendar className="h-3 w-3" /> {post.published_at}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h2 className="font-heading text-xl md:text-2xl font-semibold tracking-tight text-foreground mb-3 group-hover:text-primary transition-colors">
                    {post.title}
                  </h2>

                  {/* Content preview or full */}
                  <div className={`text-sm text-zinc-400 font-light leading-relaxed ${
                    expandedPost === post.id ? '' : 'line-clamp-3'
                  }`}>
                    {post.content.split('\n').map((paragraph, idx) => (
                      <p key={idx} className={idx > 0 ? 'mt-3' : ''}>{paragraph}</p>
                    ))}
                  </div>

                  {/* Expand toggle */}
                  <div className="mt-4 flex items-center gap-1 text-[10px] text-primary font-semibold uppercase tracking-widest">
                    {expandedPost === post.id ? 'Show Less' : 'Read More'}
                    <ChevronRight className={`h-3 w-3 transition-transform ${
                      expandedPost === post.id ? 'rotate-90' : ''
                    }`} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="bg-[#0F0F0F] border border-white/5 rounded-2xl p-8 max-w-lg mx-auto space-y-4">
            <div className="w-12 h-12 rounded-full bg-primary/15 flex items-center justify-center mx-auto">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <p className="text-xs text-zinc-400 font-light">
              Want to be featured? If you've worked with Joann and would like to share your experience or be featured in a case study, 
              <a href="/contact" className="text-primary hover:underline"> get in touch</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
