import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import professionalData from '../data/professionalData.json';

const Skills = () => {
  const { skills } = professionalData;
  const [selectedCategory, setSelectedCategory] = useState(0);

  return (
    <section id="skills" className="py-24 md:py-32 bg-neutral-50 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-20 right-10 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-20" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-neutral-200 rounded-full blur-3xl opacity-20" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="flex items-center gap-4 mb-4">
            <motion.div
              className="w-16 h-1 bg-black"
              initial={{ width: 0 }}
              whileInView={{ width: 64 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            />
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-black">
              Skills
            </h2>
          </div>
          <p className="text-base md:text-lg text-neutral-600">
            Technical expertise and tools
          </p>
        </motion.div>

        {/* Category tabs */}
        <div className="mb-12 flex flex-wrap gap-3">
          {skills.categories.map((category, index) => (
            <motion.button
              key={index}
              onClick={() => setSelectedCategory(index)}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                selectedCategory === index
                  ? 'bg-black text-white shadow-xl scale-105'
                  : 'bg-white text-black border-2 border-neutral-200 hover:border-black'
              }`}
              whileHover={{ scale: selectedCategory === index ? 1.05 : 1.02 }}
              whileTap={{ scale: 0.98 }}
              data-testid={`skill-category-${index}`}
            >
              {category.name}
            </motion.button>
          ))}
        </div>

        {/* Skills display */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
          >
            {skills.categories[selectedCategory].skills.map((skill, idx) => (
              <motion.div
                key={skill}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05, duration: 0.3 }}
                whileHover={{ 
                  scale: 1.1, 
                  rotate: [0, -5, 5, 0],
                  transition: { duration: 0.3 }
                }}
                className="group relative bg-white border-2 border-neutral-200 rounded-2xl p-6 hover:border-blue-500 hover:shadow-2xl transition-all cursor-pointer overflow-hidden"
              >
                {/* Gradient background on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                
                {/* Skill text */}
                <p className="relative z-10 text-center font-semibold text-neutral-800 group-hover:text-blue-600 transition-colors">
                  {skill}
                </p>

                {/* Animated border on hover */}
                <motion.div
                  className="absolute inset-0 border-2 border-blue-500 rounded-2xl opacity-0 group-hover:opacity-100"
                  initial={false}
                  whileHover={{
                    scale: [1, 1.05, 1],
                  }}
                  transition={{ duration: 0.4, repeat: Infinity }}
                />

                {/* Corner accent */}
                <motion.div
                  className="absolute top-0 right-0 w-0 h-0 border-t-[20px] border-r-[20px] border-t-blue-500/20 border-r-transparent opacity-0 group-hover:opacity-100 transition-opacity"
                  initial={false}
                />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Skill count indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <p className="text-sm text-neutral-500">
            Showing {skills.categories[selectedCategory].skills.length} skills in{' '}
            <span className="font-semibold text-black">
              {skills.categories[selectedCategory].name}
            </span>
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;
