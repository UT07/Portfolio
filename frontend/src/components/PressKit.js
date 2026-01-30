import React from 'react';
import { motion } from 'framer-motion';
import { Download, FileText, Image, FileAudio } from 'lucide-react';
import djData from '../data/djData.json';

const PressKit = () => {
  const { pressKit } = djData;

  const getIcon = (type) => {
    switch (type) {
      case 'document':
        return FileText;
      case 'images':
        return Image;
      case 'audio':
        return FileAudio;
      default:
        return Download;
    }
  };

  return (
    <section id="presskit" className="py-24 md:py-32 bg-neutral-900">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
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

        <div className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-black/50 border border-fuchsia-500/30 p-8"
            style={{
              boxShadow: '0 0 15px rgba(217,70,239,0.2)'
            }}
          >
            <h3 className="text-xl font-bold text-fuchsia-400 mb-4 uppercase tracking-widest font-unbounded">
              Short Bio
            </h3>
            <p className="text-sm text-neutral-400 mb-8 font-space-mono leading-relaxed">
              {pressKit.bio_short}
            </p>

            <h3 className="text-xl font-bold text-fuchsia-400 mb-4 uppercase tracking-widest font-unbounded">
              Full Bio
            </h3>
            <div className="space-y-4">
              {pressKit.bio_long.split('\n\n').map((paragraph, index) => (
                <p key={index} className="text-sm text-neutral-400 font-space-mono leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pressKit.downloads.map((item, index) => {
            const Icon = getIcon(item.type);
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: '0 0 25px rgba(217,70,239,0.3)'
                }}
                className="bg-neutral-900/50 border border-white/10 backdrop-blur-sm p-6 hover:border-fuchsia-500/50 transition-all cursor-not-allowed"
                style={{
                  boxShadow: '0 0 15px rgba(217,70,239,0.1)'
                }}
                data-testid={`presskit-item-${index}`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-fuchsia-500/20 border border-fuchsia-500/50 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-fuchsia-400" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-white mb-2 font-unbounded">
                      {item.title}
                    </h4>
                    <p className="text-sm text-neutral-400 mb-4 font-space-mono">
                      {item.description}
                    </p>
                    {item.placeholder && (
                      <div className="flex items-center gap-2 px-4 py-2 border border-neutral-700 text-neutral-600 text-sm font-space-mono uppercase tracking-wider">
                        <Download className="w-4 h-4" />
                        Coming Soon
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PressKit;
