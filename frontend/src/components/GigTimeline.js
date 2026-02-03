import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Clock, Music, Users, ChevronLeft, ChevronRight, X } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import { formatDate } from '../utils/helpers';
import placeholderImage from '../assets/asset-placeholder.svg';
import { assetUrl } from '../utils/assets';
import djData from '../data/djData.json';
import { DayPicker } from 'react-day-picker';

const GigTimeline = () => {
  const { gigs, hero } = djData;
  const fallbackGigImage = assetUrl(hero?.hero_image || '/images/PICTURES/REDLINE%20HORIZON/Cris35mm_3335.jpg');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [selectedCollective, setSelectedCollective] = useState('all');
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'center' });
  const [activeGig, setActiveGig] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [failedClips, setFailedClips] = useState({});

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

  const openGig = useCallback((gig, index) => {
    if (emblaApi) emblaApi.scrollTo(index);
    setActiveGig(gig);
  }, [emblaApi]);

  const resolveGigAsset = useCallback(
    (url) => assetUrl(url) || fallbackGigImage,
    [fallbackGigImage]
  );

  const closeGig = () => setActiveGig(null);

  const gigDates = useMemo(() => {
    const uniqueDates = Array.from(new Set(gigs.map((gig) => gig.date)));
    return uniqueDates.map((date) => new Date(date));
  }, [gigs]);

  const openCalendar = (date) => {
    setSelectedDate(date);
    setShowCalendar(true);
  };

  const handleCalendarSelect = (date) => {
    setSelectedDate(date);
    if (!date) return;
    const iso = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    const gigMatch = gigs.find((gig) => gig.date === iso);
    if (gigMatch) {
      setActiveGig(gigMatch);
      setShowCalendar(false);
    }
  };

  const markClipFailed = useCallback((url) => {
    setFailedClips((prev) => ({ ...prev, [url]: true }));
  }, []);

  return (
    <section id="gigs" className="py-24 md:py-32 bg-transparent relative overflow-hidden">
      <div className="absolute inset-0 bg-black/65 pointer-events-none" />
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(255,26,64,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,94,112,0.2) 1px, transparent 1px)',
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
              className="w-16 h-1 bg-gradient-to-r from-red-500 to-red-300"
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
            <Music className="w-4 h-4 text-red-400" />
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="px-4 py-2 bg-neutral-900 border border-red-500/50 text-red-400 text-sm font-space-mono uppercase tracking-wider focus:outline-none focus:border-red-500 cursor-pointer"
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
            <Users className="w-4 h-4 text-red-400" />
            <select
              value={selectedCollective}
              onChange={(e) => setSelectedCollective(e.target.value)}
              className="px-4 py-2 bg-neutral-900 border border-red-500/50 text-red-400 text-sm font-space-mono uppercase tracking-wider focus:outline-none focus:border-red-500 cursor-pointer"
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
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-16 h-16 bg-red-500 text-black rounded-full flex items-center justify-center hover:bg-red-400 transition-colors"
            whileHover={{ scale: 1.1, x: -5 }}
            whileTap={{ scale: 0.9 }}
            style={{ boxShadow: '0 0 30px rgba(255,26,64,0.5)' }}
          >
            <ChevronLeft className="w-8 h-8" />
          </motion.button>

          <motion.button
            onClick={scrollNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-16 h-16 bg-red-500 text-black rounded-full flex items-center justify-center hover:bg-red-400 transition-colors"
            whileHover={{ scale: 1.1, x: 5 }}
            whileTap={{ scale: 0.9 }}
            style={{ boxShadow: '0 0 30px rgba(255,94,112,0.5)' }}
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
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => openGig(gig, index)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter') openGig(gig, index);
                      }}
                      className="relative h-[420px] md:h-[600px] overflow-hidden border-2 border-white/10 cursor-pointer"
                      style={{
                        boxShadow: '0 0 50px rgba(255,26,64,0.2)'
                      }}
                    >
                      {/* Large gig image */}
                      <img 
                        src={resolveGigAsset(gig.image)}
                        alt={gig.event}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        decoding="async"
                        onError={(event) => {
                          if (event.currentTarget.dataset.fallback === 'true') return;
                          event.currentTarget.dataset.fallback = 'true';
                          event.currentTarget.src = placeholderImage;
                        }}
                      />
                      
                      {/* Dark gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
                      
                      {/* Content overlay */}
                      <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12">
                        {/* Date badge */}
                        <motion.button
                          type="button"
                          className="absolute top-6 right-6 md:top-8 md:right-8 px-5 py-3 bg-red-500/90 border-2 border-red-400"
                          whileHover={{ scale: 1.05 }}
                          style={{ boxShadow: '0 0 20px rgba(255,26,64,0.6)' }}
                          onClick={(event) => {
                            event.stopPropagation();
                            openCalendar(new Date(gig.date));
                          }}
                        >
                          <div className="flex items-center gap-3">
                            <Calendar className="w-5 h-5 text-black" />
                            <div>
                              <p className="text-black font-bold text-2xl font-unbounded">
                                {new Date(gig.date).toLocaleDateString('en', { day: 'numeric' })}
                              </p>
                              <p className="text-black text-sm font-bold font-space-mono">
                                {new Date(gig.date).toLocaleDateString('en', { month: 'short', year: 'numeric' })}
                              </p>
                            </div>
                          </div>
                        </motion.button>

                        {/* Event info */}
                        <motion.div
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2, duration: 0.6 }}
                        >
                          <h3 className="text-5xl md:text-6xl font-black text-white mb-4 font-unbounded uppercase tracking-tight leading-tight">
                            {gig.event}
                          </h3>
                          <p className="text-2xl text-red-400 font-bold font-space-mono mb-6">
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
                            <MapPin className="w-5 h-5 text-red-400" />
                            <span className="text-sm">{gig.location}</span>
                          </div>
                          <div className="flex items-center gap-3 text-neutral-300 font-space-mono">
                            <Clock className="w-5 h-5 text-red-400" />
                            <span className="text-sm">{gig.time}</span>
                          </div>
                          <div className="flex items-center gap-3 text-neutral-300 font-space-mono">
                            <Music className="w-5 h-5 text-red-400" />
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
                                className="px-4 py-2 bg-red-500/20 border border-red-500/50 text-red-400 text-xs font-bold uppercase tracking-wider font-space-mono"
                                style={{ boxShadow: '0 0 10px rgba(255,26,64,0.3)' }}
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

        <AnimatePresence>
          {activeGig && (
            <motion.div
              className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeGig}
            >
              <motion.div
                className="relative max-w-5xl w-full bg-neutral-950 border border-red-500/40"
                style={{ boxShadow: '0 0 40px rgba(255,26,64,0.4)' }}
                initial={{ scale: 0.92, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={(event) => event.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={closeGig}
                  className="absolute top-4 right-4 p-2 border border-red-500/50 text-red-400 hover:bg-red-500 hover:text-black transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
                  <div>
                    <img
                      src={resolveGigAsset(activeGig.image)}
                      alt={activeGig.event}
                      className="w-full h-80 object-cover"
                      loading="lazy"
                      decoding="async"
                      onError={(event) => {
                        if (event.currentTarget.dataset.fallback === 'true') return;
                        event.currentTarget.dataset.fallback = 'true';
                        event.currentTarget.src = placeholderImage;
                      }}
                    />
                    <div className="mt-4">
                      <h3 className="text-3xl font-black text-white font-unbounded uppercase tracking-tight">
                        {activeGig.event}
                      </h3>
                      <p className="text-red-400 font-space-mono mt-2">{activeGig.collective}</p>
                      <p className="text-neutral-400 font-space-mono text-sm mt-2">
                        {formatDate(activeGig.date)} · {activeGig.location}
                      </p>
                      <p className="text-neutral-400 font-space-mono text-sm mt-2">{activeGig.time}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-bold text-red-400 uppercase tracking-widest font-unbounded mb-3">
                      Clips from the night
                    </h4>
                    {activeGig.clips && activeGig.clips.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {activeGig.clips.map((clip, idx) => {
                          if (clip.type === 'video') {
                            const clipUrl = assetUrl(clip.url || '');
                            const lowerUrl = clipUrl.toLowerCase();
                            if (failedClips[clipUrl]) {
                              return (
                                <a
                                  key={`clip-${clipUrl}`}
                                  href={clipUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center justify-center rounded-xl border border-red-500/30 bg-black/40 text-xs uppercase tracking-wider text-red-300 text-center px-3"
                                >
                                  Clip unavailable — open in new tab
                                </a>
                              );
                            }
                            if (lowerUrl.endsWith('.mp4') || lowerUrl.endsWith('.mov')) {
                              return (
                                <video
                                  key={idx}
                                  src={clipUrl}
                                  poster={resolveGigAsset(activeGig.image)}
                                  preload="metadata"
                                  playsInline
                                  controls
                                  className="w-full h-48 object-cover border border-white/10"
                                  onError={(event) => {
                                    if (event.currentTarget.dataset.triedMp4 !== 'true' && /\.mov$/i.test(clipUrl)) {
                                      event.currentTarget.dataset.triedMp4 = 'true';
                                      event.currentTarget.src = clipUrl.replace(/\.mov$/i, '.mp4');
                                      event.currentTarget.load();
                                      return;
                                    }
                                    markClipFailed(clipUrl);
                                  }}
                                />
                              );
                            }
                            return (
                              <iframe
                                key={idx}
                                title={`${activeGig.event}-clip-${idx}`}
                                src={clip.url}
                                className="w-full h-48 border border-white/10"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                loading="lazy"
                              />
                            );
                          }
                          if (clip.type === 'instagram') {
                            return (
                              <a
                                key={idx}
                                href={clip.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group relative w-full h-48 overflow-hidden border border-white/10"
                              >
                                <img
                                  src={resolveGigAsset(clip.thumbnail)}
                                  alt="Instagram clip"
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                  loading="lazy"
                                  decoding="async"
                                  onError={(event) => {
                                    if (event.currentTarget.dataset.fallback === 'true') return;
                                    event.currentTarget.dataset.fallback = 'true';
                                    event.currentTarget.src = placeholderImage;
                                  }}
                                />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-xs uppercase tracking-widest text-white font-space-mono">
                                  View on Instagram
                                </div>
                              </a>
                            );
                          }
                          return (
                            <img
                              key={idx}
                              src={resolveGigAsset(clip.url || clip.thumbnail)}
                              alt={`${activeGig.event} clip`}
                              className="w-full h-48 object-cover border border-white/10"
                              loading="lazy"
                              decoding="async"
                              onError={(event) => {
                                if (event.currentTarget.dataset.fallback === 'true') return;
                                event.currentTarget.dataset.fallback = 'true';
                                event.currentTarget.src = placeholderImage;
                              }}
                            />
                          );
                        })}
                      </div>
                    ) : (
                      <div className="border border-white/10 p-4 text-sm text-neutral-400 font-space-mono">
                        Add clips for this gig in `djData.json` to showcase highlights.
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showCalendar && (
            <motion.div
              className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCalendar(false)}
            >
              <motion.div
                className="relative bg-neutral-950 border border-red-500/40 p-6"
                style={{ boxShadow: '0 0 30px rgba(255,94,112,0.35)' }}
                initial={{ scale: 0.92, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(event) => event.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={() => setShowCalendar(false)}
                  className="absolute top-4 right-4 p-2 border border-red-500/50 text-red-400 hover:bg-red-500 hover:text-black transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                <h4 className="text-lg font-bold text-red-400 uppercase tracking-widest font-unbounded mb-4">
                  Gig Calendar
                </h4>
                <DayPicker
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleCalendarSelect}
                  showOutsideDays
                  modifiers={{ performed: gigDates }}
                  modifiersStyles={{
                    performed: { backgroundColor: 'rgb(255, 26, 64)', color: '#0b0b0b' }
                  }}
                  className="text-neutral-200"
                  classNames={{
                    months: "flex flex-col sm:flex-row space-y-4 sm:space-x-6 sm:space-y-0",
                    month: "space-y-4",
                    caption: "flex justify-center pt-1 relative items-center",
                    caption_label: "text-sm font-semibold text-neutral-200",
                    nav: "space-x-1 flex items-center",
                    nav_button: "h-7 w-7 bg-transparent p-0 opacity-60 hover:opacity-100 text-red-400",
                    nav_button_previous: "absolute left-1",
                    nav_button_next: "absolute right-1",
                    table: "w-full border-collapse space-y-1",
                    head_row: "flex",
                    head_cell: "text-neutral-500 rounded-md w-8 font-normal text-[0.75rem]",
                    row: "flex w-full mt-2",
                    cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20",
                    day: "h-8 w-8 p-0 font-medium text-neutral-200 hover:bg-red-500/20 rounded-md",
                    day_selected: "bg-red-500 text-black hover:bg-red-500",
                    day_today: "border border-red-500 text-red-300",
                    day_outside: "text-neutral-700",
                    day_disabled: "text-neutral-700 opacity-50"
                  }}
                  styles={{
                    caption: { color: '#ededed' },
                    head_cell: { color: '#9ca3af' }
                  }}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default GigTimeline;
