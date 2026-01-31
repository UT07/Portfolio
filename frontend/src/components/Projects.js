import React, { useCallback } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Github, Folder, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import projectsData from '../data/projectsData.json';

const Projects = () => {
  const { featured, github_projects } = projectsData;
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start', slidesToScroll: 1 });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const openExternal = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Flatten all GitHub projects into a single array
  const allGithubProjects = Object.entries(github_projects).flatMap(([category, projects]) => 
    projects.map(project => ({ ...project, category }))
  );

  return (
    <section id="projects" className="py-24 md:py-32 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-black mb-4">
            Projects
          </h2>
          <p className="text-base md:text-lg text-neutral-600">
            Featured work and open-source contributions
          </p>
        </motion.div>

        <div className="mb-20">
          <h3 className="text-2xl font-semibold text-black mb-8">Featured Projects</h3>
          <div className="space-y-12">
            {featured.map((project, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="bg-white border border-neutral-200 rounded-2xl p-8 hover:border-neutral-300 transition-colors"
                data-testid={`featured-project-${index}`}
              >
                {/* Project image */}
                {project.demo_image && (
                  <motion.div 
                    className="mb-6 rounded-xl overflow-hidden"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  >
                    <img 
                      src={project.demo_image}
                      alt={project.title}
                      className="w-full h-64 object-cover"
                    />
                  </motion.div>
                )}

                <div className="mb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-3 py-1 bg-black text-white text-xs font-medium rounded-full">
                      {project.category}
                    </span>
                    <span className="text-sm text-neutral-500">{project.timeline}</span>
                  </div>
                  <h4 className="text-2xl font-semibold text-black mb-2">{project.title}</h4>
                  <p className="text-neutral-600">{project.description}</p>
                </div>

                <div className="mb-6">
                  <h5 className="text-sm font-semibold text-black mb-2">Problem</h5>
                  <p className="text-neutral-600 text-sm">{project.problem}</p>
                </div>

                <div className="mb-6">
                  <h5 className="text-sm font-semibold text-black mb-2">Approach</h5>
                  <p className="text-neutral-600 text-sm">{project.approach}</p>
                </div>

                <div className="mb-6">
                  <h5 className="text-sm font-semibold text-black mb-3">Technology Stack</h5>
                  <div className="flex flex-wrap gap-2">
                    {project.stack.map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-neutral-100 text-neutral-700 text-xs rounded-full"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <h5 className="text-sm font-semibold text-black mb-3 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    Outcomes
                  </h5>
                  <ul className="space-y-2">
                    {project.outcomes.map((outcome, idx) => (
                      <li key={idx} className="text-sm text-neutral-600 flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>{outcome}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex gap-3">
                  {project.links.github && (
                    <button
                      onClick={() => openExternal(project.links.github)}
                      className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-full text-sm font-medium hover:bg-neutral-800 transition-colors"
                      data-testid={`project-github-link-${index}`}
                    >
                      <Github className="w-4 h-4" />
                      View on GitHub
                    </button>
                  )}
                  {project.links.demo && (
                    <button
                      onClick={() => openExternal(project.links.demo)}
                      className="flex items-center gap-2 px-4 py-2 bg-neutral-100 text-black rounded-full text-sm font-medium hover:bg-neutral-200 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Live Demo
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-2xl font-semibold text-black mb-8">GitHub Projects</h3>
          
          {/* Carousel container */}
          <div className="relative">
            {/* Navigation buttons */}
            <motion.button
              onClick={scrollPrev}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-black text-white rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors shadow-xl"
              whileHover={{ scale: 1.1, x: -5 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronLeft className="w-6 h-6" />
            </motion.button>

            <motion.button
              onClick={scrollNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-black text-white rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors shadow-xl"
              whileHover={{ scale: 1.1, x: 5 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronRight className="w-6 h-6" />
            </motion.button>

            {/* Embla carousel */}
            <div className="overflow-hidden mx-12" ref={emblaRef}>
              <div className="flex gap-6">
                {allGithubProjects.map((project, idx) => (
                  <motion.div
                    key={idx}
                    className="flex-[0_0_350px] min-w-0"
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.05, duration: 0.4 }}
                  >
                    <motion.div
                      whileHover={{ y: -8, scale: 1.02 }}
                      className="h-full bg-white border-2 border-neutral-200 rounded-2xl p-6 hover:border-blue-500 hover:shadow-2xl transition-all cursor-pointer"
                      onClick={() => openExternal(project.repo)}
                      data-testid={`github-project-${idx}`}
                    >
                      {/* Category badge */}
                      <div className="mb-3">
                        <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full">
                          {project.category.replace(/_/g, ' / ')}
                        </span>
                      </div>

                      <div className="flex items-start justify-between mb-4">
                        <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.6 }}>
                          <Folder className="w-10 h-10 text-blue-500" />
                        </motion.div>
                        <div className="flex gap-2">
                          <motion.button
                            onClick={(e) => {
                              e.stopPropagation();
                              openExternal(project.repo);
                            }}
                            className="p-2 bg-black text-white rounded-lg hover:bg-blue-600 transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Github className="w-4 h-4" />
                          </motion.button>
                          {project.demo && (
                            <motion.button
                              onClick={(e) => {
                                e.stopPropagation();
                                openExternal(project.demo);
                              }}
                              className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <ExternalLink className="w-4 h-4" />
                            </motion.button>
                          )}
                        </div>
                      </div>

                      <h5 className="text-xl font-bold text-black mb-3 group-hover:text-blue-600 transition-colors">
                        {project.name}
                      </h5>
                      <p className="text-sm text-neutral-600 mb-4 line-clamp-3">
                        {project.description}
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {project.stack.map((tech, techIdx) => (
                          <span
                            key={techIdx}
                            className="px-2 py-1 bg-neutral-100 text-neutral-700 text-xs rounded-full font-medium"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Projects;
