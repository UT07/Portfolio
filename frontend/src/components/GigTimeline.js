import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Clock, Filter, ArrowUpDown, Music, Users, Star, ExternalLink } from 'lucide-react';
import { formatDate } from '../utils/helpers';
import djData from '../data/djData.json';

const GigTimeline = () => {
  const { gigs } = djData;
  const [sortOrder, setSortOrder] = useState('newest');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [selectedCollective, setSelectedCollective] = useState('all');
  const [hoveredGig, setHoveredGig] = useState(null);

  const allGenres = useMemo(() => {
    const genres = new Set();
    gigs.forEach(gig => gig.genre.forEach(g => genres.add(g)));
    return ['all', ...Array.from(genres).sort()];
  }, [gigs]);

  const allCollectives = useMemo(() => {
    const collectives = new Set(gigs.map(gig => gig.collective));
    return ['all', ...Array.from(collectives).sort()];
  }, [gigs]);

  const filteredAndSortedGigs = useMemo(() => {
    let filtered = gigs;

    if (selectedGenre !== 'all') {
      filtered = filtered.filter(gig => gig.genre.includes(selectedGenre));
    }

    if (selectedCollective !== 'all') {
      filtered = filtered.filter(gig => gig.collective === selectedCollective);
    }

    const sorted = [...filtered].sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

    return sorted;
  }, [gigs, sortOrder, selectedGenre, selectedCollective]);

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
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="w-16 h-1 bg-gradient-to-r from-fuchsia-500 to-cyan-500"
              initial={{ width: 0 }}
              animate={{ width: 64 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            />
            <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-widest text-white font-unbounded">
              Gig Timeline
            </h2>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-sm md:text-base font-medium tracking-wide text-neutral-400 font-space-mono"
          >
            {filteredAndSortedGigs.length} shows · 2025–2026
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 flex flex-wrap gap-4"
        >
          <motion.button
            onClick={() => setSortOrder(prev => prev === 'newest' ? 'oldest' : 'newest')}
            className="flex items-center gap-2 px-4 py-2 bg-neutral-900 border border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 transition-all text-sm font-space-mono uppercase tracking-wider"
            whileHover={{ scale: 1.05, borderColor: 'rgba(6,182,212,1)' }}
            whileTap={{ scale: 0.95 }}
            data-testid="gig-sort-toggle"
          >
            <ArrowUpDown className="w-4 h-4" />
            {sortOrder === 'newest' ? 'Newest First' : 'Oldest First'}
          </motion.button>

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredAndSortedGigs.map((gig, index) => (
              <motion.div
                key={gig.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
                onMouseEnter={() => setHoveredGig(gig.id)}
                onMouseLeave={() => setHoveredGig(null)}
                className="group relative bg-neutral-900/80 backdrop-blur-sm border border-white/10 p-6 hover:border-cyan-500/50 transition-all cursor-pointer overflow-hidden"
                whileHover={{ y: -8, boxShadow: '0 0 30px rgba(6,182,212,0.3)' }}
                data-testid={`gig-card-${index}`}
              >
                {/* Animated corner accent */}
                <motion.div
                  className="absolute top-0 right-0 w-0 h-0 border-t-[40px] border-r-[40px] border-t-fuchsia-500/20 border-r-transparent"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                />

                {/* Date badge */}
                <motion.div
                  className="absolute top-4 right-4 px-3 py-1 bg-fuchsia-500/20 border border-fuchsia-500/50 text-fuchsia-400 text-xs font-bold uppercase tracking-wider"
                  whileHover={{ scale: 1.1 }}
                >
                  {formatDate(gig.date)}
                </motion.div>

                <div className="mb-4">
                  <h3 className="text-xl font-bold text-white mb-2 font-unbounded uppercase tracking-tight leading-tight pr-16">
                    {gig.event}
                  </h3>
                  <p className="text-cyan-400 text-sm font-space-mono font-semibold">{gig.collective}</p>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-xs text-neutral-400 font-space-mono">
                    <MapPin className="w-3 h-3 text-fuchsia-400 flex-shrink-0" />
                    <span className="truncate">{gig.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-neutral-400 font-space-mono">
                    <Clock className="w-3 h-3 text-fuchsia-400 flex-shrink-0" />
                    <span>{gig.time}</span>
                  </div>
                </div>

                {/* Genre tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {gig.genre.slice(0, 2).map((genre, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-black/50 border border-white/20 text-white text-xs font-space-mono"
                    >
                      {genre}
                    </span>
                  ))}
                  {gig.genre.length > 2 && (
                    <span className="px-2 py-1 bg-black/50 border border-white/20 text-neutral-400 text-xs font-space-mono">
                      +{gig.genre.length - 2}
                    </span>
                  )}
                </div>

                {/* Special tags */}
                {gig.tags && gig.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {gig.tags.map((tag, idx) => (
                      <motion.span
                        key={idx}
                        className="px-2 py-1 bg-fuchsia-500/20 border border-fuchsia-500/50 text-fuchsia-400 text-xs font-bold uppercase tracking-wider"
                        whileHover={{ scale: 1.05 }}
                      >
                        {tag}
                      </motion.span>
                    ))}
                  </div>
                )}

                {/* Hover overlay */}
                <AnimatePresence>
                  {hoveredGig === gig.id && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex items-end p-6"
                    >
                      <p className="text-xs text-neutral-300 font-space-mono">{gig.description}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredAndSortedGigs.length === 0 && (
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
