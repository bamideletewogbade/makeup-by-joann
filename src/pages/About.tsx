import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkles, ShieldCheck, Smile } from 'lucide-react';

export default function About() {
  return (
    <div className="bg-background text-foreground min-h-screen pt-32 pb-24">
      {/* Intro Hero Section */}
      <section className="w-full px-6 sm:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-28">
        
        {/* Left text */}
        <div className="lg:col-span-7 space-y-6 text-left">
          <span className="text-primary uppercase tracking-widest text-xs font-semibold font-mono">
            Founder &amp; Lead Artist
          </span>
          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-medium tracking-tight">
            Meet Joann: <span className="italic font-serif text-primary">Your Creative Partner</span>
          </h1>
          <div className="w-16 h-[1.5px] bg-primary"></div>
          
          <p className="text-sm text-gray-300 font-light leading-relaxed max-w-xl">
            With over 4 years of hands-on experience in the professional beauty space, Joann has built a reputation for exquisite precision, calm professionalism, and active collaboration.
          </p>

          <blockquote className="border-l-[1.5px] border-primary pl-4 py-1.5 italic text-sm text-[#FAF7F2] font-light max-w-lg leading-relaxed">
            "Makeup is more than application. It is about collaboration and bringing visions to life. I do not believe in copy-paste aesthetics; I partner with directors, authors, and brides to tailor a style that belongs to them."
          </blockquote>
        </div>

        {/* Right image frame */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="relative w-80 h-96 rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl bg-zinc-900 group">
            <img 
              src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=1000&auto=format&fit=crop"
              alt="Joann Portrait"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
            <div className="absolute bottom-6 left-6 right-6 text-left">
              <span className="text-[9px] uppercase tracking-widest bg-primary text-black font-black px-2.5 py-1 rounded">
                JOANN // OWNER &amp; ARTIST
              </span>
            </div>
          </div>
        </div>

      </section>

      {/* Core Principles Section */}
      <section className="bg-[#0D0D0D] border-t border-b border-white/5 py-24">
        <div className="w-full px-6 sm:px-12">
          
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <span className="text-primary uppercase tracking-widest text-xs font-semibold font-mono">The Approach</span>
            <h2 className="font-heading text-3xl sm:text-4xl font-medium tracking-tight">
              Calm &amp; Graceful <span className="italic font-serif text-primary">Artistry Method</span>
            </h2>
            <div className="w-16 h-[1.5px] bg-primary mx-auto my-3"></div>
            <p className="text-xs sm:text-sm text-gray-500 font-light max-w-md mx-auto leading-relaxed">
              Designed to create zero friction, ensure absolute comfort, and maintain complete focus under hectic schedule timelines.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            
            {/* Principle 1 */}
            <div className="bg-[#111] p-8 rounded-3xl border border-white/5 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                <Smile className="h-5 w-5" />
              </div>
              <h3 className="font-heading text-lg font-semibold text-[#FAF7F2]">Composed &amp; Punctual</h3>
              <p className="text-xs text-zinc-400 font-light leading-relaxed">
                Renowned for maintaining a peaceful, patient, and professional composure on intense film production sets, wedding morning rushes, or catalog shoots. Punctuality is absolute.
              </p>
            </div>

            {/* Principle 2 */}
            <div className="bg-[#111] p-8 rounded-3xl border border-white/5 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                <Heart className="h-5 w-5" />
              </div>
              <h3 className="font-heading text-lg font-semibold text-[#FAF7F2]">Active Collaboration</h3>
              <p className="text-xs text-zinc-400 font-light leading-relaxed">
                We listen closely to references, sketches, outfits, and styling boards. We map the ideal tones dynamically to match the client's skin undertone and event concept.
              </p>
            </div>

            {/* Principle 3 */}
            <div className="bg-[#111] p-8 rounded-3xl border border-white/5 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="font-heading text-lg font-semibold text-[#FAF7F2]">Premium Sanitary Standards</h3>
              <p className="text-xs text-zinc-400 font-light leading-relaxed">
                Stringent sanitary hygiene protocols are practiced at all times, utilizing sterilized luxury palettes and non-comedogenic formulas to protect the skin barrier.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* Narrative block */}
      <section className="w-full px-6 text-center mt-24 space-y-6">
        <h3 className="font-heading text-2xl">Tailoring beauty to suit <span className="italic font-serif text-primary">your unique story</span></h3>
        <p className="text-xs text-zinc-500 font-light leading-relaxed max-w-xl mx-auto">
          From local masterclasses to destination bookings, Joan is equipped for national and international travel. Services are tailored dynamically to match the scope, timeline, and location requirements of your shoot.
        </p>
      </section>

    </div>
  );
}
