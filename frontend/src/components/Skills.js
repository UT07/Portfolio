import React from 'react';
import { motion } from 'framer-motion';
import professionalData from '../data/professionalData.json';

const Skills = () => {
  const { skills } = professionalData;

  return (
    <section id="skills" className="py-24 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-black mb-4">
            Skills
          </h2>
          <p className="text-base md:text-lg text-neutral-600">
            Technical expertise and tools
          </p>
        </motion.div>

        <div className="space-y-12">
          {skills.categories.map((category, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              data-testid={`skill-category-${index}`}
            >
              <h3 className="text-xl font-semibold text-black mb-6">
                {category.name}
              </h3>
              <div className="flex flex-wrap gap-3">
                {category.skills.map((skill, idx) => (
                  <motion.span
                    key={idx}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.02, duration: 0.3 }}
                    whileHover={{ scale: 1.05 }}
                    className="px-4 py-2 bg-neutral-100 text-neutral-800 rounded-full text-sm font-medium hover:bg-neutral-200 transition-colors"
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
