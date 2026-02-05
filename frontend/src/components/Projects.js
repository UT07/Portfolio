import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Github, FileText, FileCode } from 'lucide-react';
import { useProjectsData } from '../contexts/ContentContext';
import placeholderImage from '../assets/asset-placeholder.svg';
import { assetUrl } from '../utils/assets';

const Projects = () => {
  const { data: projectsData } = useProjectsData();
  const { featured, github_projects } = projectsData;
  const handleImgError = (event) => {
    if (event.currentTarget.dataset.fallback === 'true') return;
    event.currentTarget.dataset.fallback = 'true';
    event.currentTarget.src = placeholderImage;
  };

  const allGithubProjects = Object.entries(github_projects).flatMap(([category, projects]) =>
    projects.map((project) => ({ ...project, category }))
  );

  const getRepoName = (repoUrl) => {
    if (!repoUrl) return null;
    try {
      const { pathname } = new URL(repoUrl);
      const parts = pathname.split('/').filter(Boolean);
      return parts.length >= 2 ? parts[1] : null;
    } catch (error) {
      return null;
    }
  };

  const getOgImage = (repoUrl) => {
    const repoName = getRepoName(repoUrl);
    if (!repoName) return null;
    return `https://opengraph.githubassets.com/1/UT07/${repoName}`;
  };

  const renderLinks = (links) => {
    if (!links) return null;
    return (
      <div className="flex flex-wrap gap-3">
        {links.github && (
          <a
            href={links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-black px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-neutral-800"
          >
            <Github className="h-4 w-4" />
            View on GitHub
          </a>
        )}
        {links.paper && (
          <a
            href={assetUrl(links.paper)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-neutral-300 px-4 py-2 text-sm font-semibold text-neutral-700 transition-colors hover:border-neutral-500"
          >
            <FileText className="h-4 w-4" />
            Research paper
          </a>
        )}
        {links.manual && (
          <a
            href={assetUrl(links.manual)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-neutral-300 px-4 py-2 text-sm font-semibold text-neutral-700 transition-colors hover:border-neutral-500"
          >
            <FileCode className="h-4 w-4" />
            Configuration manual
          </a>
        )}
      </div>
    );
  };

  return (
    <section id="projects" className="py-24 md:py-32 bg-neutral-50 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-black mb-4">
            Projects
          </h2>
          <p className="text-base md:text-lg text-neutral-600">
            Featured work and open-source contributions
          </p>
        </motion.div>

        <div className="mb-12">
          <h3 className="text-2xl font-semibold text-black mb-6">Featured Projects</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featured.map((project, index) => {
              const repoUrl = project.links?.github;
              const ogImage = getOgImage(repoUrl);
              return (
                <motion.article
                  key={project.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05, duration: 0.5 }}
                  className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                  data-testid={`featured-project-${index}`}
                >
                  {ogImage ? (
                    <img
                      src={ogImage}
                      alt={`${project.title} preview`}
                      className="w-full h-48 object-cover"
                      loading="lazy"
                      decoding="async"
                      onError={handleImgError}
                    />
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-br from-neutral-100 to-neutral-200 flex items-center justify-center text-neutral-500 text-sm">
                      Preview unavailable
                    </div>
                  )}
                  <div className="p-6 space-y-4">
                    <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-wider text-neutral-500">
                      <span className="px-2 py-1 rounded-full bg-neutral-100 text-neutral-700 font-semibold">
                        {project.category}
                      </span>
                      <span>{project.timeline}</span>
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold text-black mb-2">{project.title}</h4>
                      <p className="text-sm text-neutral-600">{project.description}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {project.stack.map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1 rounded-full bg-neutral-100 text-neutral-700 text-xs font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    {renderLinks(project.links)}
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>

        <div>
          <h3 className="text-2xl font-semibold text-black mb-6">GitHub Projects</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allGithubProjects.map((project, index) => {
              const ogImage = getOgImage(project.repo);
              return (
                <motion.article
                  key={`${project.name}-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.03, duration: 0.4 }}
                  className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                  data-testid={`github-project-${index}`}
                >
                  {ogImage ? (
                    <img
                      src={ogImage}
                      alt={`${project.name} preview`}
                      className="w-full h-40 object-cover"
                      loading="lazy"
                      decoding="async"
                      onError={handleImgError}
                    />
                  ) : (
                    <div className="w-full h-40 bg-gradient-to-br from-neutral-100 to-neutral-200 flex items-center justify-center text-neutral-500 text-sm">
                      Preview unavailable
                    </div>
                  )}
                  <div className="p-5 space-y-4">
                    <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-wider text-neutral-500">
                      <span className="px-2 py-1 rounded-full bg-neutral-100 text-neutral-700 font-semibold">
                        {project.category.replace(/_/g, ' / ')}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-black mb-2">{project.name}</h4>
                      <p className="text-sm text-neutral-600">{project.description}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {project.stack.map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1 rounded-full bg-neutral-100 text-neutral-700 text-xs font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    <a
                      href={project.repo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full bg-black px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-neutral-800"
                    >
                      <Github className="h-4 w-4" />
                      View on GitHub
                    </a>
                    {project.demo && (
                      <a
                        href={project.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-full border border-neutral-300 px-4 py-2 text-sm font-semibold text-neutral-700 transition-colors hover:border-neutral-500"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Live demo
                      </a>
                    )}
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Projects;
