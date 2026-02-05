import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, CheckCircle2 } from 'lucide-react';
import { useProfessionalData } from '../contexts/ContentContext';

const Experience = () => {
  const { data: professionalData } = useProfessionalData();
  const { experience } = professionalData;

  return (
    <section id="experience" className="py-24 md:py-32 bg-white scroll-mt-24">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-black mb-4">
            Experience
          </h2>
          <p className="text-base md:text-lg text-neutral-600">
            Professional journey and key contributions
          </p>
        </motion.div>

        <div className="space-y-8">
          {experience.map((exp, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="relative"
              data-testid={`experience-card-${index}`}
            >
              <div className="flex items-start gap-6">
                <div className="w-14 h-14 bg-black rounded-full flex items-center justify-center flex-shrink-0">
                  <Briefcase className="w-7 h-7 text-white" />
                </div>

                <div className="flex-1">
                  <div className="mb-4">
                    <h3 className="text-2xl font-semibold text-black mb-1">{exp.role}</h3>
                    <p className="text-lg text-neutral-700 mb-2">{exp.company}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-neutral-600">
                      <span>{exp.location}</span>
                      <span>•</span>
                      <span>{exp.dates}</span>
                      <span>•</span>
                      <span>{exp.duration}</span>
                    </div>
                  </div>

                  <div className="mb-5">
                    <h4 className="text-lg font-semibold text-black mb-3">Key Responsibilities</h4>
                    <ul className="space-y-2">
                      {exp.responsibilities.map((resp, idx) => (
                        <li key={idx} className="text-neutral-600 flex items-start gap-3">
                          <span className="text-neutral-400 mt-1">•</span>
                          <span className="leading-relaxed">{resp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {exp.achievements && exp.achievements.length > 0 && (
                    <div className="bg-neutral-50 rounded-xl p-6">
                      <h4 className="text-lg font-semibold text-black mb-4 flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                        Key Achievements
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {exp.achievements.map((achievement, idx) => (
                          <div
                            key={idx}
                            className="text-sm text-neutral-700 flex items-start gap-2"
                          >
                            <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                            <span>{achievement}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {index < experience.length - 1 && (
                <div className="ml-7 mt-8 h-12 border-l-2 border-neutral-200" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
