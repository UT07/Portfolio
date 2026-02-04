import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, ChevronLeft, ChevronRight, Clock, MapPin, Music, X } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import { DayPicker } from 'react-day-picker';
import djData from '../data/djData.json';
import { formatDate } from '../utils/helpers';
import placeholderImage from '../assets/asset-placeholder.svg';
import { assetUrl } from '../utils/assets';

const GigCarousel = () => {
  const { gigs, hero } = djData;
  const fallbackPoster = assetUrl(hero?.hero_image || '/images/PICTURES/REDLINE%20HORIZON/Cris35mm_3335.jpg');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, align: 'center' });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [failedClips, setFailedClips] = useState({});

  const sortedGigs = useMemo(() => {
    const sorted = [...gigs].sort((a, b) => {
      const diff = new Date(a.date) - new Date(b.date);
      return sortOrder === 'asc' ? diff : -diff;
    });
    return sorted;
  }, [gigs, sortOrder]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on('select', onSelect);
    onSelect();
    return () => emblaApi.off('select', onSelect);
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.reInit();
    emblaApi.scrollTo(0);
    setSelectedIndex(0);
  }, [emblaApi, sortedGigs]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const gigDates = useMemo(() => {
    const uniqueDates = Array.from(new Set(gigs.map((gig) => gig.date)));
    return uniqueDates.map((date) => new Date(date));
  }, [gigs]);

  const handleCalendarSelect = (date) => {
    setSelectedDate(date);
    if (!date) return;
    const iso = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
      date.getDate()
    ).padStart(2, '0')}`;
    const gigIndex = sortedGigs.findIndex((gig) => gig.date === iso);
    if (gigIndex >= 0 && emblaApi) {
      emblaApi.scrollTo(gigIndex);
      setShowCalendar(false);
    }
  };

  const resolveLocation = (gig) => {
    const isPrivate = gig.event.toLowerCase().includes('teknival') || gig.location.toLowerCase() === 'private';
    return isPrivate ? 'Location: Private' : `Location: ${gig.location}`;
  };

  const resolveTime = (gig) => {
    if (!gig.time) return 'Recorded set';
    return gig.time.toLowerCase().includes('recorded') ? 'Recorded set' : gig.time;
  };

  const hasSoldOut = (gig) => gig.tags?.some((tag) => tag.toLowerCase().includes('sold'));

  const markClipFailed = useCallback((url) => {
    setFailedClips((prev) => ({ ...prev, [url]: true }));
  }, []);

  return (
    <section id="gigs" className="py-24 md:py-32 bg-transparent relative overflow-hidden scroll-mt-24">
      <div className="absolute inset-0 bg-black/65 pointer-events-none" />
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,26,64,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,94,112,0.2) 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-1 bg-gradient-to-r from-red-500 to-red-300" />
                <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-wide md:tracking-widest text-white font-unbounded">
                  Gig Timeline
                </h2>
              </div>
              <p className="text-sm md:text-base text-neutral-300 font-space-mono">
                Explore recent sets, clips, and performance highlights.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setShowCalendar(true)}
                className="inline-flex items-center gap-2 border border-red-500/60 px-4 py-2 text-sm font-semibold uppercase tracking-widest text-red-400 hover:bg-red-500 hover:text-black transition-colors"
              >
                <Calendar className="w-4 h-4" />
                Calendar
              </button>
              <select
                value={sortOrder}
                onChange={(event) => setSortOrder(event.target.value)}
                aria-label="Sort gigs"
                className="bg-neutral-900/80 border border-white/10 px-4 py-2 text-sm font-semibold text-neutral-200 uppercase tracking-widest font-space-mono"
              >
                <option value="desc">Newest to Oldest</option>
                <option value="asc">Oldest to Newest</option>
              </select>
            </div>
          </div>
        </motion.div>

        <div className="relative">
          <button
            type="button"
            onClick={scrollPrev}
            aria-label="Previous gig"
            className="absolute -left-6 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-red-500/50 bg-black/70 text-red-400 transition-colors hover:bg-red-500 hover:text-black md:flex"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            type="button"
            onClick={scrollNext}
            aria-label="Next gig"
            className="absolute -right-6 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-red-500/50 bg-black/70 text-red-400 transition-colors hover:bg-red-500 hover:text-black md:flex"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {sortedGigs.map((gig) => {
                const clips = gig.clips ? gig.clips.slice(0, 4) : [];
                const slots = [...clips];
                const minSlots = clips.length === 0 ? 4 : Math.max(2, clips.length);
                while (slots.length < minSlots) {
                  slots.push({ placeholder: true, index: slots.length + 1 });
                }

                return (
                  <div key={gig.id} className="flex-[0_0_100%] px-2 md:px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-neutral-950/70 border border-red-500/20 rounded-3xl p-6 md:p-8">
                      <div>
                        <div className="rounded-2xl overflow-hidden mb-6">
                          <img
                            src={assetUrl(gig.image)}
                            alt={`${gig.event} cover`}
                            width={640}
                            height={256}
                            className="w-full h-64 object-cover"
                            loading="lazy"
                            decoding="async"
                            onError={(event) => {
                              if (event.currentTarget.dataset.fallback === 'true') return;
                              event.currentTarget.dataset.fallback = 'true';
                              event.currentTarget.src = placeholderImage;
                            }}
                          />
                        </div>
                        <div className="flex flex-wrap items-center gap-3 mb-4">
                          <span className="text-xs uppercase tracking-widest text-red-400 font-semibold">
                            {gig.collective}
                          </span>
                          {hasSoldOut(gig) && (
                            <span className="px-2 py-1 text-xs uppercase tracking-widest bg-red-500 text-black font-bold rounded-full">
                              Sold Out
                            </span>
                          )}
                        </div>
                        <h3 className="text-3xl md:text-4xl font-bold text-white mb-4 font-unbounded">
                          {gig.event}
                        </h3>
                        <div className="space-y-3 text-sm text-neutral-300 font-space-mono">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-red-400" />
                            <span>{formatDate(gig.date)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-red-400" />
                            <span>{resolveLocation(gig)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-red-400" />
                            <span>{resolveTime(gig)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Music className="w-4 h-4 text-red-400" />
                            <span>{gig.genre.join(' / ')}</span>
                          </div>
                        </div>
                        <p className="mt-4 text-sm text-neutral-400">{gig.description}</p>
                        {gig.tags?.length > 0 && (
                          <div className="mt-4 flex flex-wrap gap-2">
                            {gig.tags.map((tag) => (
                              <span
                                key={tag}
                                className="px-3 py-1 rounded-full bg-white/5 text-xs uppercase tracking-wider text-neutral-300"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-red-400 uppercase tracking-widest mb-4 font-unbounded">
                          Clips from the night
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                          {slots.map((clip, index) => {
                            if (clip.placeholder) {
                              return (
                                <div
                                  key={`placeholder-${index}`}
                                  className="flex items-center justify-center rounded-xl border border-red-500/20 bg-black/40 text-sm text-neutral-500"
                                >
                                  Clip {index + 1}
                                </div>
                              );
                            }

                            const clipUrl = assetUrl(clip.url);
                            const isImage = clip.type === 'image' || /\.(png|jpe?g|webp)$/i.test(clipUrl);

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

                            return isImage ? (
                              <img
                                key={`clip-${clipUrl}`}
                                src={clipUrl}
                                alt={`${gig.event} clip ${index + 1}`}
                                className="h-32 w-full rounded-xl object-cover border border-white/10"
                                loading="lazy"
                                decoding="async"
                                onError={(event) => {
                                  if (event.currentTarget.dataset.fallback === 'true') return;
                                  event.currentTarget.dataset.fallback = 'true';
                                  event.currentTarget.src = placeholderImage;
                                }}
                              />
                            ) : (
                              <video
                                key={`clip-${clipUrl}`}
                                poster={assetUrl(gig.image) || fallbackPoster}
                                className="h-32 w-full rounded-xl object-cover border border-white/10"
                                preload="metadata"
                                controls
                                muted
                                playsInline
                                controlsList="nodownload noplaybackrate"
                                src={clipUrl}
                                onError={(event) => {
                                  if (event.currentTarget.dataset.triedMp4 !== 'true' && /\.mov$/i.test(clipUrl)) {
                                    event.currentTarget.dataset.triedMp4 = 'true';
                                    event.currentTarget.src = clipUrl.replace(/\.mov$/i, '.mp4');
                                    event.currentTarget.load();
                                    return;
                                  }
                                  markClipFailed(clipUrl);
                                }}
                              >
                                Your browser does not support the video tag.
                              </video>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-center gap-2">
          {sortedGigs.map((gig, index) => (
            <button
              key={gig.id}
              type="button"
              onClick={() => emblaApi && emblaApi.scrollTo(index)}
              className={`h-2.5 w-2.5 rounded-full transition-colors ${
                index === selectedIndex ? 'bg-red-500' : 'bg-white/20'
              }`}
              aria-label={`Go to ${gig.event}`}
            />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {showCalendar && (
          <motion.div
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
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
                  months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-6 sm:space-y-0',
                  month: 'space-y-4',
                  caption: 'flex justify-center pt-1 relative items-center',
                  caption_label: 'text-sm font-semibold text-neutral-200',
                  nav: 'space-x-1 flex items-center',
                  nav_button: 'h-7 w-7 bg-transparent p-0 opacity-60 hover:opacity-100 text-red-400',
                  nav_button_previous: 'absolute left-1',
                  nav_button_next: 'absolute right-1',
                  table: 'w-full border-collapse space-y-1',
                  head_row: 'flex',
                  head_cell: 'text-neutral-500 rounded-md w-8 font-normal text-[0.75rem]',
                  row: 'flex w-full mt-2',
                  cell: 'relative p-0 text-center text-sm focus-within:relative focus-within:z-20',
                  day: 'h-8 w-8 p-0 font-medium text-neutral-200 hover:bg-red-500/20 rounded-md',
                  day_selected: 'bg-red-500 text-black hover:bg-red-500',
                  day_today: 'border border-red-500 text-red-300',
                  day_outside: 'text-neutral-700',
                  day_disabled: 'text-neutral-700 opacity-50'
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
    </section>
  );
};

export default GigCarousel;
