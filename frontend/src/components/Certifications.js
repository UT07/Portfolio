import React from 'react';
import { motion } from 'framer-motion';
import { Award, ExternalLink } from 'lucide-react';
import professionalData from '../data/professionalData.json';

const Certifications = () => {
  const { certifications } = professionalData;

  return (
    <section id="certifications" className="py-24 md:py-32 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-black mb-4">
            Certifications
          </h2>
          <p className="text-base md:text-lg text-neutral-600">
            Professional certifications and credentials
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certifications.map((cert, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              whileHover={{ y: -4 }}
              className="bg-white border border-neutral-200 rounded-2xl p-6 hover:border-neutral-300 transition-all"
              data-testid={`certification-card-${index}`}
            >
              <div className="mb-4">
                <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mb-4">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-black mb-2">{cert.name}</h3>
                <p className="text-sm text-neutral-600 mb-1">{cert.issuer}</p>
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-neutral-500">{cert.code}</span>
                  <span className="text-neutral-400">•</span>
                  <span className="text-neutral-500">{cert.year}</span>
                </div>
              </div>
              {cert.link && (
                <a
                  href={cert.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                  data-testid={`certification-link-${index}`}
                >
                  View credential
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Certifications;
