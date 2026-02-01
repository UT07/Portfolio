import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import djData from '../data/djData.json';
import { resolveAssetUrl } from '../utils/assetUrl';

const PressKit = () => {
  const { pressKit } = djData;
  const galleryImages = pressKit.gallery?.images || [];
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeSection, setActiveSection] = useState(0);
  const resolvedGalleryImages = useMemo(
    () => galleryImages.map((image) => resolveAssetUrl(image)),
    [galleryImages]
  );
  const activeImage = resolvedGalleryImages[currentSlide];
  const fallbackImage = galleryImages[currentSlide];

  useEffect(() => {
    if (resolvedGalleryImages.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % resolvedGalleryImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [resolvedGalleryImages.length]);

  return (
    <section id="presskit" className="py-24 md:py-32 bg-transparent relative overflow-hidden">
      <div className="absolute inset-0 bg-black/60 pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,26,64,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,94,112,0.2) 1px, transparent 1px)',
          backgroundSize: '80px 80px'
        }}
      />
      <div className="absolute -inset-10 pointer-events-none opacity-40"
        style={{
          background: 'radial-gradient(circle at 20% 20%, rgba(255,26,64,0.35), transparent 45%), radial-gradient(circle at 80% 70%, rgba(255,94,112,0.35), transparent 40%)'
        }}
      />
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-widest text-white mb-4 font-unbounded">
            {pressKit.title}
          </h2>
          <p className="text-sm md:text-base font-medium tracking-wide text-neutral-400 font-space-mono">
            {pressKit.description}
          </p>
        </motion.div>

        {resolvedGalleryImages.length > 0 && (
          <div className="mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative border border-red-500/40 bg-black/50 overflow-hidden"
              style={{ boxShadow: '0 0 30px rgba(255,26,64,0.25)' }}
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                <div>
                  <h3 className="text-xl font-bold text-red-400 uppercase tracking-widest font-unbounded">
                    {pressKit.gallery?.title || 'Featured Photos'}
                  </h3>
                  <p className="text-xs text-neutral-400 font-space-mono">
                    {pressKit.gallery?.subtitle || 'Swipe through press-ready moments'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setCurrentSlide((prev) => (prev - 1 + resolvedGalleryImages.length) % resolvedGalleryImages.length)}
                    className="w-10 h-10 border border-red-500/50 text-red-400 hover:bg-red-500 hover:text-black transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentSlide((prev) => (prev + 1) % resolvedGalleryImages.length)}
                    className="w-10 h-10 border border-red-500/50 text-red-400 hover:bg-red-500 hover:text-black transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="relative h-[420px] md:h-[520px] overflow-hidden bg-black">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeImage}
                    className="absolute inset-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6 }}
                  >
                    <img
                      src={activeImage}
                      alt=""
                      className="absolute inset-0 w-full h-full object-cover blur-2xl scale-110 opacity-40"
                      loading="lazy"
                      decoding="async"
                      onError={(event) => {
                        if (!fallbackImage || event.currentTarget.dataset.fallback === 'true') return;
                        event.currentTarget.dataset.fallback = 'true';
                        event.currentTarget.src = fallbackImage;
                      }}
                    />
                    <img
                      src={activeImage}
                      alt={`Press photo ${currentSlide + 1}`}
                      className="absolute inset-0 w-full h-full object-contain"
                      loading="lazy"
                      decoding="async"
                      onError={(event) => {
                        if (!fallbackImage || event.currentTarget.dataset.fallback === 'true') return;
                        event.currentTarget.dataset.fallback = 'true';
                        event.currentTarget.src = fallbackImage;
                      }}
                    />
                  </motion.div>
                </AnimatePresence>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 px-3 py-2 bg-black/60 border border-red-500/40 text-xs text-red-300 font-space-mono uppercase tracking-widest">
                  {currentSlide + 1} / {resolvedGalleryImages.length}
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {pressKit.technical_rider && pressKit.technical_rider.sections && (
          <div className="mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-neutral-900/70 border border-red-500/30 p-8"
              style={{
                boxShadow: '0 0 20px rgba(255,94,112,0.2)'
              }}
            >
              <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
                <div>
                  <h3 className="text-xl font-bold text-red-400 uppercase tracking-widest font-unbounded">
                    {pressKit.technical_rider.title}
                  </h3>
                  <p className="text-sm text-neutral-400 font-space-mono mt-1">
                    {pressKit.technical_rider.notes}
                  </p>
                </div>
                <div className="text-xs text-neutral-500 font-space-mono uppercase tracking-wider">
                  Tap a section to expand
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {pressKit.technical_rider.sections.map((section, index) => (
                  <motion.button
                    key={section.title}
                    type="button"
                    onClick={() => setActiveSection(index)}
                    whileHover={{ scale: 1.02 }}
                    className={`p-4 border ${
                      activeSection === index
                        ? 'border-red-500 text-white'
                        : 'border-white/10 text-neutral-400'
                    } bg-black/60 text-left transition-colors`}
                    style={{
                      boxShadow: activeSection === index
                        ? '0 0 20px rgba(255,26,64,0.35)'
                        : 'none'
                    }}
                  >
                    <p className="text-sm font-bold uppercase tracking-widest font-unbounded">
                      {section.title}
                    </p>
                    <p className="text-xs font-space-mono mt-2">
                      {section.items[0]}
                    </p>
                  </motion.button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                {pressKit.technical_rider.sections[activeSection] && (
                  <motion.div
                    key={pressKit.technical_rider.sections[activeSection].title}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="mt-6 flex flex-wrap gap-3"
                  >
                    {pressKit.technical_rider.sections[activeSection].items.map((item, idx) => (
                      <span
                        key={idx}
                        className="px-4 py-2 text-xs font-space-mono uppercase tracking-wider border border-red-500/40 text-red-300 bg-black/50"
                        style={{ boxShadow: '0 0 12px rgba(255,26,64,0.25)' }}
                      >
                        {item}
                      </span>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        )}

        
      </div>
    </section>
  );
};

export default PressKit;
