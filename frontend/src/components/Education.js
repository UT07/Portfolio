import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, GraduationCap, Award, BookOpen, Github, FileText, FileCode } from 'lucide-react';
import { useProfessionalData } from '../contexts/ContentContext';
import { assetUrl } from '../utils/assets';

const Education = () => {
  const { data: professionalData } = useProfessionalData();
  const { education } = professionalData;
  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const openExternal = (url) => {
    window.open(assetUrl(url), '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="education" className="py-24 md:py-32 bg-neutral-50 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-black mb-4">
            Education
          </h2>
          <p className="text-base md:text-lg text-neutral-600">
            Academic background with industry-relevant technical focus
          </p>
        </motion.div>

        <div className="space-y-8">
          {education.map((edu, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="bg-white border border-neutral-200 rounded-2xl p-8 hover:border-neutral-300 transition-colors"
              data-testid={`education-card-${index}`}
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center flex-shrink-0">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-semibold text-black mb-1">{edu.degree}</h3>
                  <p className="text-lg text-neutral-700 mb-2">{edu.institution}</p>
                  <div className="flex flex-wrap gap-4 text-sm text-neutral-600">
                    <span>{edu.location}</span>
                    <span>•</span>
                    <span>{edu.dates}</span>
                    <span>•</span>
                    <span className={edu.status === 'In Progress' ? 'text-blue-600 font-medium' : 'text-neutral-600'}>
                      {edu.status}
                    </span>
                  </div>
                </div>
              </div>

              {edu.description && (
                <p className="text-neutral-600 mb-6 leading-relaxed">{edu.description}</p>
              )}

              {edu.modules && edu.modules.length > 0 && (
                <div className="mb-6">
                  <button
                    type="button"
                    onClick={() => toggleExpand(index)}
                    className="flex items-center gap-2 text-black font-medium hover:text-neutral-700 transition-colors mb-4"
                    aria-expanded={expandedIndex === index}
                    aria-controls={`education-modules-${index}`}
                    aria-label={`Toggle relevant coursework for ${edu.degree} at ${edu.institution}`}
                    data-testid={`education-modules-toggle-${index}`}
                  >
                    <BookOpen className="w-5 h-5" />
                    <span>Relevant coursework ({edu.modules.length} modules)</span>
                    <ChevronDown
                      className={`w-5 h-5 transition-transform ${expandedIndex === index ? 'rotate-180' : ''}`}
                    />
                  </button>
                  
                  <AnimatePresence>
                    {expandedIndex === index && (
                      <motion.div
                        id={`education-modules-${index}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-7">
                          {edu.modules.map((module, idx) => (
                            <div
                              key={idx}
                              className="text-sm text-neutral-600 flex items-start gap-2"
                            >
                              <span className="text-neutral-400">•</span>
                              <span>{module}</span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {edu.projects && edu.projects.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-black mb-3 flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    Key Academic Projects
                  </h4>
                  {edu.projects.map((project, idx) => (
                    <div key={idx} className="bg-neutral-50 rounded-xl p-4 mb-3 border border-neutral-200 hover:border-blue-500 transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <h5 className="font-semibold text-black">{project.name}</h5>
                        <div className="flex gap-2">
                          {project.github && (
                            <motion.button
                              onClick={() => openExternal(project.github)}
                              className="p-2 bg-black text-white rounded-lg hover:bg-blue-600 transition-colors"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              title="View on GitHub"
                            >
                              <Github className="w-4 h-4" />
                            </motion.button>
                          )}
                          {project.research_paper && (
                            <motion.button
                              onClick={() => openExternal(project.research_paper)}
                              className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              title="Research Paper"
                            >
                              <FileText className="w-4 h-4" />
                            </motion.button>
                          )}
                          {project.configuration_manual && (
                            <motion.button
                              onClick={() => openExternal(project.configuration_manual)}
                              className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              title="Configuration Manual"
                            >
                              <FileCode className="w-4 h-4" />
                            </motion.button>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-neutral-600 mb-2">{project.description}</p>
                      {project.outcomes && (
                        <p className="text-sm text-neutral-700 font-medium">{project.outcomes}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {edu.thesis && (
                <div className="bg-blue-50 rounded-xl p-4">
                  <p className="text-sm font-medium text-blue-900">
                    <span className="font-semibold">Thesis:</span> {edu.thesis}
                  </p>
                </div>
              )}

              {edu.leadership && edu.leadership.length > 0 && (
                <div className="mt-6 pt-6 border-t border-neutral-200">
                  <h4 className="text-lg font-semibold text-black mb-3">Teaching & Leadership</h4>
                  <ul className="space-y-2">
                    {edu.leadership.map((role, idx) => (
                      <li key={idx} className="text-neutral-600 flex items-start gap-2">
                        <span className="text-neutral-400">•</span>
                        <span>{role}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Education;
