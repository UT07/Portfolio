import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock, Filter, ArrowUpDown, Music, Users } from 'lucide-react';
import { formatDate } from '../utils/helpers';
import djData from '../data/djData.json';

const GigTimeline = () => {
  const { gigs } = djData;
  const [sortOrder, setSortOrder] = useState('newest');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [selectedCollective, setSelectedCollective] = useState('all');

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
    <section id="gigs" className="py-24 md:py-32 bg-black">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-widest text-white mb-4 font-unbounded">
            Gig Timeline
          </h2>
          <p className="text-sm md:text-base font-medium tracking-wide text-neutral-400 font-space-mono">
            {filteredAndSortedGigs.length} gigs · 2025–2026
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 flex flex-wrap gap-4"
        >
          <button
            onClick={() => setSortOrder(prev => prev === 'newest' ? 'oldest' : 'newest')}
            className="flex items-center gap-2 px-4 py-2 border border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 transition-colors text-sm font-space-mono uppercase tracking-wider"
            data-testid="gig-sort-toggle"
          >
            <ArrowUpDown className="w-4 h-4" />
            {sortOrder === 'newest' ? 'Newest First' : 'Oldest First'}
          </button>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-fuchsia-400" />
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="px-4 py-2 bg-neutral-900 border border-fuchsia-500/50 text-fuchsia-400 text-sm font-space-mono uppercase tracking-wider focus:outline-none focus:border-fuchsia-500"
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
              className="px-4 py-2 bg-neutral-900 border border-fuchsia-500/50 text-fuchsia-400 text-sm font-space-mono uppercase tracking-wider focus:outline-none focus:border-fuchsia-500"
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

        <div className="space-y-6">
          {filteredAndSortedGigs.map((gig, index) => (
            <motion.div
              key={gig.id}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
              className="bg-neutral-900/50 border border-white/10 backdrop-blur-sm p-6 hover:border-cyan-500/50 transition-colors"
              data-testid={`gig-card-${index}`}
            >
              <div className="flex flex-col md:flex-row md:items-start gap-6">
                <div className="flex-1">
                  <div className="mb-3">
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-2 font-unbounded">
                      {gig.event}
                    </h3>
                    <p className="text-cyan-400 text-sm font-space-mono">{gig.collective}</p>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-3 text-sm text-neutral-400 font-space-mono">
                      <Calendar className="w-4 h-4 text-fuchsia-400" />
                      <span>{formatDate(gig.date)}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-neutral-400 font-space-mono">
                      <MapPin className="w-4 h-4 text-fuchsia-400" />
                      <span>{gig.location}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-neutral-400 font-space-mono">
                      <Clock className="w-4 h-4 text-fuchsia-400" />
                      <span>{gig.time}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-neutral-400 font-space-mono">
                      <Music className="w-4 h-4 text-fuchsia-400" />
                      <span>{gig.genre.join(' · ')}</span>
                    </div>
                  </div>

                  {gig.tags && gig.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {gig.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-fuchsia-500/20 border border-fuchsia-500/30 text-fuchsia-400 text-xs font-bold uppercase tracking-wider"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <p className="text-sm text-neutral-500 font-space-mono">{gig.description}</p>
                </div>

                <div className="md:w-48">
                  <div className="grid grid-cols-2 gap-2">
                    {[1, 2, 3, 4].map((clipNum) => (
                      <div
                        key={clipNum}
                        className="aspect-square bg-neutral-800 border border-neutral-700 flex items-center justify-center text-neutral-600 text-xs font-space-mono"
                      >
                        Clip {clipNum}
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-neutral-600 mt-2 text-center font-space-mono">
                    Media coming soon
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredAndSortedGigs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-neutral-500 font-space-mono">No gigs match your filters</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default GigTimeline;
