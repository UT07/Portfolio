import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight, Code } from 'lucide-react';
import {
  SiAmazonwebservices,
  SiApacheairflow,
  SiApachespark,
  SiDocker,
  SiDjango,
  SiDvc,
  SiExpress,
  SiFastapi,
  SiFlask,
  SiGithub,
  SiGithubactions,
  SiGnubash,
  SiGrafana,
  SiGo,
  SiHelm,
  SiJenkins,
  SiJupyter,
  SiKubernetes,
  SiLinux,
  SiMongodb,
  SiMysql,
  SiNewrelic,
  SiNumpy,
  SiOpentelemetry,
  SiPandas,
  SiPostgresql,
  SiPrometheus,
  SiPytorch,
  SiPython,
  SiReact,
  SiRedis,
  SiScikitlearn,
  SiScipy,
  SiTableau,
  SiTensorflow,
  SiTerraform,
  SiTypescript,
  SiYaml
} from 'react-icons/si';
import professionalData from '../data/professionalData.json';

const TechStackSection = () => {
  const { skills } = professionalData;

  const normalizeSkills = useCallback((value) => {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    if (typeof value === 'object') {
      return Object.values(value).flat().filter(Boolean);
    }
    return [];
  }, []);

  const categories = useMemo(() => {
    const list = skills?.categories || [];
    return list
      .filter((category) => category && category.name)
      .map((category) => ({
        name: category.name,
        skills: normalizeSkills(category.skills)
      }));
  }, [skills?.categories, normalizeSkills]);

  const [activeIndex, setActiveIndex] = useState(0);
  const prefersReducedMotion = useReducedMotion();
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    dragFree: true,
    containScroll: 'trimSnaps',
    loop: true
  });

  useEffect(() => {
    if (!categories.length) {
      setActiveIndex(0);
      return;
    }
    if (activeIndex >= categories.length) {
      setActiveIndex(0);
    }
  }, [categories, activeIndex]);

  useEffect(() => {
    if (emblaApi) {
      emblaApi.reInit();
      emblaApi.scrollTo(0);
    }
  }, [emblaApi, activeIndex]);

  useEffect(() => {
    if (!emblaApi || prefersReducedMotion) return undefined;
    const interval = setInterval(() => {
      if (emblaApi.canScrollNext()) {
        emblaApi.scrollNext();
      } else {
        emblaApi.scrollTo(0);
      }
    }, 1800);
    return () => clearInterval(interval);
  }, [emblaApi, prefersReducedMotion, activeIndex]);

  const currentCategory = categories[activeIndex];
  const activeCategoryName = currentCategory?.name;

  const handleTabKeyDown = (event, index) => {
    if (!categories.length) return;
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      setActiveIndex((index + 1) % categories.length);
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      setActiveIndex((index - 1 + categories.length) % categories.length);
    } else if (event.key === 'Home') {
      event.preventDefault();
      setActiveIndex(0);
    } else if (event.key === 'End') {
      event.preventDefault();
      setActiveIndex(categories.length - 1);
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setActiveIndex(index);
    }
  };

  const awsServiceNames = new Set([
    'EC2',
    'ECS/Fargate',
    'EKS',
    'Lambda',
    'Auto Scaling',
    'S3',
    'EBS',
    'EFS',
    'DynamoDB',
    'RDS/Aurora',
    'Redshift',
    'Athena',
    'Glue',
    'EMR',
    'VPC',
    'ALB',
    'Route53',
    'CloudFront',
    'API Gateway',
    'SQS',
    'SNS',
    'EventBridge',
    'Step Functions',
    'IAM',
    'Secrets Manager',
    'WAF',
    'ECR',
    'SageMaker (Pipelines, Feature Store, Model Registry, Endpoints, Monitor, Experiments)'
  ]);

  const getSkillIcon = (skill) => {
    const normalized = skill.toLowerCase();
    if (awsServiceNames.has(skill) || normalized.includes('aws')) return SiAmazonwebservices;
    if (normalized.includes('docker')) return SiDocker;
    if (normalized.includes('kubernetes') || normalized.includes('eks') || normalized.includes('kubectl')) return SiKubernetes;
    if (normalized.includes('helm')) return SiHelm;
    if (normalized.includes('terraform')) return SiTerraform;
    if (normalized.includes('jenkins')) return SiJenkins;
    if (normalized.includes('github')) return SiGithub;
    if (normalized.includes('github actions')) return SiGithubactions;
    if (normalized.includes('linux')) return SiLinux;
    if (normalized.includes('bash')) return SiGnubash;
    if (normalized.includes('prometheus')) return SiPrometheus;
    if (normalized.includes('grafana')) return SiGrafana;
    if (normalized.includes('opentelemetry')) return SiOpentelemetry;
    if (normalized.includes('new relic')) return SiNewrelic;
    if (normalized.includes('airflow')) return SiApacheairflow;
    if (normalized.includes('mlflow')) return SiAmazonwebservices;
    if (normalized.includes('dvc')) return SiDvc;
    if (normalized.includes('pytorch')) return SiPytorch;
    if (normalized.includes('tensorflow')) return SiTensorflow;
    if (normalized.includes('scikit-learn')) return SiScikitlearn;
    if (normalized.includes('scipy')) return SiScipy;
    if (normalized.includes('pandas')) return SiPandas;
    if (normalized.includes('numpy')) return SiNumpy;
    if (normalized.includes('pyspark') || normalized.includes('spark')) return SiApachespark;
    if (normalized.includes('python')) return SiPython;
    if (normalized === 'go') return SiGo;
    if (normalized.includes('mongo')) return SiMongodb;
    if (normalized.includes('mysql')) return SiMysql;
    if (normalized.includes('postgres')) return SiPostgresql;
    if (normalized === 'sql') return SiPostgresql;
    if (normalized.includes('typescript') || normalized.includes('javascript')) return SiTypescript;
    if (normalized.includes('redis')) return SiRedis;
    if (normalized.includes('flask')) return SiFlask;
    if (normalized.includes('django')) return SiDjango;
    if (normalized.includes('fastapi')) return SiFastapi;
    if (normalized.includes('react')) return SiReact;
    if (normalized.includes('express')) return SiExpress;
    if (normalized.includes('tableau')) return SiTableau;
    if (normalized.includes('jupyter')) return SiJupyter;
    if (normalized.includes('yaml')) return SiYaml;
    return Code;
  };

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const displayedSkills = useMemo(() => {
    if (!currentCategory || currentCategory.skills.length === 0) return [];
    if (currentCategory.skills.length <= 10) {
      return [...currentCategory.skills, ...currentCategory.skills];
    }
    return currentCategory.skills;
  }, [currentCategory]);

  const useTwoRows = displayedSkills.length > 10;

  const skillColumns = useMemo(() => {
    if (!displayedSkills.length) return [];
    if (!useTwoRows) return displayedSkills.map((skill) => [skill]);
    const columns = [];
    for (let i = 0; i < displayedSkills.length; i += 2) {
      columns.push(displayedSkills.slice(i, i + 2));
    }
    return columns;
  }, [displayedSkills, useTwoRows]);

  return (
    <section id="tech-stack" className="py-24 md:py-32 bg-white relative overflow-hidden scroll-mt-24">
      <div className="absolute top-20 right-10 w-80 h-80 bg-neutral-100 rounded-full blur-3xl opacity-35" />
      <div className="absolute bottom-16 left-10 w-96 h-96 bg-neutral-50 rounded-full blur-3xl opacity-45" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10"
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
              Tech Stack
            </h2>
          </div>
          <p className="text-base md:text-lg text-neutral-600">
            Browse the tools and platforms I use day-to-day.
          </p>
        </motion.div>

        {categories.length > 0 && (
          <div className="mb-10">
            <div
              role="tablist"
              aria-label="Tech stack categories"
              className="flex flex-wrap gap-4 rounded-3xl bg-white/95 px-6 py-4 border border-neutral-200 shadow-sm"
            >
              {categories.map((category, index) => {
                const isActive = category.name === activeCategoryName;
                return (
                  <button
                    key={category.name}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    tabIndex={isActive ? 0 : -1}
                    onClick={() => setActiveIndex(index)}
                    onKeyDown={(event) => handleTabKeyDown(event, index)}
                    className={`px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                      isActive
                        ? 'bg-black text-white shadow-md'
                        : 'bg-white text-neutral-700 border border-neutral-200 hover:border-blue-400 hover:text-blue-600'
                    }`}
                  >
                    {category.name}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={currentCategory?.name || 'empty'}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35 }}
            className="min-h-[160px]"
          >
            {!currentCategory || currentCategory.skills.length === 0 ? (
              <div className="rounded-2xl border border-neutral-200 bg-white p-8 text-center text-neutral-500 shadow-sm">
                Skills coming soon.
              </div>
            ) : (
              <div className="relative">
                <button
                  type="button"
                  onClick={scrollPrev}
                  aria-label="Scroll skills left"
                  className="absolute -left-6 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-500 shadow-md hover:border-blue-400 hover:text-blue-600 md:flex"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={scrollNext}
                  aria-label="Scroll skills right"
                  className="absolute -right-6 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-500 shadow-md hover:border-blue-400 hover:text-blue-600 md:flex"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
                <div ref={emblaRef} className="overflow-hidden">
                  <div className="flex gap-4 px-12">
                    {skillColumns.map((column, colIndex) => (
                      <div
                        key={`col-${colIndex}`}
                        className={`flex-[0_0_140px] sm:flex-[0_0_160px] md:flex-[0_0_180px] ${useTwoRows ? 'flex flex-col gap-4' : ''}`}
                      >
                        {column.map((skill, idx) => {
                          const Icon = getSkillIcon(skill) || Code;
                          return (
                            <div
                              key={`${skill}-${idx}`}
                              role="button"
                              tabIndex={0}
                              className="group rounded-2xl border border-neutral-200 bg-white px-4 py-4 text-center shadow-sm transition-transform hover:-translate-y-1 hover:shadow-md hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                            >
                              <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100 text-neutral-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                                <Icon className="h-5 w-5" />
                              </div>
                              <div className="text-xs font-semibold text-neutral-800 transition-colors group-hover:text-blue-600">
                                {skill}
                              </div>
                            </div>
                          );
                        })}
                        {useTwoRows && column.length === 1 && (
                          <div className="rounded-2xl border border-transparent bg-transparent px-4 py-4 opacity-0">
                            placeholder
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default TechStackSection;
