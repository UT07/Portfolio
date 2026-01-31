import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Clock, Music, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import { formatDate } from '../utils/helpers';
import djData from '../data/djData.json';

const GigTimeline = () => {
  const { gigs } = djData;
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [selectedCollective, setSelectedCollective] = useState('all');
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'center' });

  const allGenres = useMemo(() => {
    const genres = new Set();
    gigs.forEach(gig => gig.genre.forEach(g => genres.add(g)));
    return ['all', ...Array.from(genres).sort()];
  }, [gigs]);

  const allCollectives = useMemo(() => {
    const collectives = new Set(gigs.map(gig => gig.collective));
    return ['all', ...Array.from(collectives).sort()];
  }, [gigs]);

  const filteredGigs = useMemo(() => {
    let filtered = gigs;

    if (selectedGenre !== 'all') {
      filtered = filtered.filter(gig => gig.genre.includes(selectedGenre));
    }

    if (selectedCollective !== 'all') {
      filtered = filtered.filter(gig => gig.collective === selectedCollective);
    }

    return filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [gigs, selectedGenre, selectedCollective]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <section id="gigs" className="py-24 md:py-32 bg-black relative overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(217,70,239,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.2) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }} />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Animated title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <motion.div
            className="flex items-center gap-4 mb-4"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="w-16 h-1 bg-gradient-to-r from-fuchsia-500 to-cyan-500"
              initial={{ width: 0 }}
              whileInView={{ width: 64 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            />
            <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-widest text-white font-unbounded">
              {['Gig', 'Timeline'].map((word, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="inline-block mr-3"
                >
                  {word}
                </motion.span>
              ))}
            </h2>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-sm md:text-base font-medium tracking-wide text-neutral-400 font-space-mono"
          >
            {filteredGigs.length} shows · 2025–2026
          </motion.p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 flex flex-wrap gap-4"
        >
          <div className="flex items-center gap-2">
            <Music className="w-4 h-4 text-fuchsia-400" />
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="px-4 py-2 bg-neutral-900 border border-fuchsia-500/50 text-fuchsia-400 text-sm font-space-mono uppercase tracking-wider focus:outline-none focus:border-fuchsia-500 cursor-pointer"
              data-testid="gig-genre-filter"
            >
              {allGenres.map(genre => (
                <option key={genre} value={genre}>
                  {genre === 'all' ? 'All Genres' : genre}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-fuchsia-400" />
            <select
              value={selectedCollective}
              onChange={(e) => setSelectedCollective(e.target.value)}
              className="px-4 py-2 bg-neutral-900 border border-fuchsia-500/50 text-fuchsia-400 text-sm font-space-mono uppercase tracking-wider focus:outline-none focus:border-fuchsia-500 cursor-pointer"
              data-testid="gig-collective-filter"
            >
              {allCollectives.map(collective => (
                <option key={collective} value={collective}>
                  {collective === 'all' ? 'All Collectives' : collective}
                </option>
              ))}
            </select>
          </div>
        </motion.div>

        {/* Carousel */}
        <div className="relative">
          {/* Navigation buttons */}
          <motion.button
            onClick={scrollPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-16 h-16 bg-fuchsia-500 text-black rounded-full flex items-center justify-center hover:bg-fuchsia-400 transition-colors"
            whileHover={{ scale: 1.1, x: -5 }}
            whileTap={{ scale: 0.9 }}
            style={{ boxShadow: '0 0 30px rgba(217,70,239,0.5)' }}
          >
            <ChevronLeft className="w-8 h-8" />
          </motion.button>

          <motion.button
            onClick={scrollNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-16 h-16 bg-cyan-500 text-black rounded-full flex items-center justify-center hover:bg-cyan-400 transition-colors"
            whileHover={{ scale: 1.1, x: 5 }}
            whileTap={{ scale: 0.9 }}
            style={{ boxShadow: '0 0 30px rgba(6,182,212,0.5)' }}
          >
            <ChevronRight className="w-8 h-8" />
          </motion.button>

          {/* Embla carousel */}
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {filteredGigs.map((gig, index) => (
                <div key={gig.id} className="flex-[0_0_100%] min-w-0 px-4">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                    className="relative mx-auto max-w-5xl"
                  >
                    {/* Gig card with image */}
                    <div className="relative h-[600px] overflow-hidden border-2 border-white/10"
                      style={{
                        boxShadow: '0 0 50px rgba(217,70,239,0.2)'
                      }}
                    >
                      {/* Large gig image */}
                      <img 
                        src={gig.image || 'https://via.placeholder.com/1200x800/000000/ffffff?text=Gig+Photo'}
                        alt={gig.event}
                        className="w-full h-full object-cover"
                      />
                      
                      {/* Dark gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
                      
                      {/* Content overlay */}
                      <div className="absolute inset-0 flex flex-col justify-end p-12">
                        {/* Date badge */}
                        <motion.div
                          className="absolute top-8 right-8 px-6 py-3 bg-fuchsia-500/90 border-2 border-fuchsia-400"
                          whileHover={{ scale: 1.05 }}
                          style={{ boxShadow: '0 0 20px rgba(217,70,239,0.6)' }}
                        >
                          <p className="text-black font-bold text-2xl font-unbounded">
                            {new Date(gig.date).toLocaleDateString('en', { day: 'numeric' })}
                          </p>
                          <p className="text-black text-sm font-bold font-space-mono">
                            {new Date(gig.date).toLocaleDateString('en', { month: 'short', year: 'numeric' })}
                          </p>
                        </motion.div>

                        {/* Event info */}
                        <motion.div
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2, duration: 0.6 }}
                        >
                          <h3 className="text-5xl md:text-6xl font-black text-white mb-4 font-unbounded uppercase tracking-tight leading-tight">
                            {gig.event}
                          </h3>
                          <p className="text-2xl text-cyan-400 font-bold font-space-mono mb-6">
                            {gig.collective}
                          </p>
                        </motion.div>

                        {/* Details grid */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4, duration: 0.6 }}
                          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
                        >
                          <div className="flex items-center gap-3 text-neutral-300 font-space-mono">
                            <MapPin className="w-5 h-5 text-fuchsia-400" />
                            <span className="text-sm">{gig.location}</span>
                          </div>
                          <div className="flex items-center gap-3 text-neutral-300 font-space-mono">
                            <Clock className="w-5 h-5 text-fuchsia-400" />
                            <span className="text-sm">{gig.time}</span>
                          </div>
                          <div className="flex items-center gap-3 text-neutral-300 font-space-mono">
                            <Music className="w-5 h-5 text-fuchsia-400" />
                            <span className="text-sm">{gig.genre.join(' · ')}</span>
                          </div>
                        </motion.div>

                        {/* Tags */}
                        {gig.tags && gig.tags.length > 0 && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6, duration: 0.6 }}
                            className="flex flex-wrap gap-2 mb-4"
                          >
                            {gig.tags.map((tag, idx) => (
                              <span
                                key={idx}
                                className="px-4 py-2 bg-fuchsia-500/20 border border-fuchsia-500/50 text-fuchsia-400 text-xs font-bold uppercase tracking-wider font-space-mono"
                                style={{ boxShadow: '0 0 10px rgba(217,70,239,0.3)' }}
                              >
                                {tag}
                              </span>
                            ))}
                          </motion.div>
                        )}

                        {/* Description */}
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.8, duration: 0.6 }}
                          className="text-neutral-400 font-space-mono text-sm max-w-2xl"
                        >
                          {gig.description}
                        </motion.p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {filteredGigs.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-neutral-500 font-space-mono text-lg">No gigs match your filters</p>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default GigTimeline;
