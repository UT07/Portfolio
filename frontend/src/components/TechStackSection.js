import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight, Code, Shield, Network, Layers, Cloud, BarChart3, Workflow, Bell, Database, HardDrive, Lock, Container, Server, Globe, Radio, Gauge } from 'lucide-react';
import {
  SiAmazonwebservices,
  SiAmazonapigateway,
  SiAmazoncloudwatch,
  SiAmazondynamodb,
  SiAmazonec2,
  SiAmazonecs,
  SiAmazoneks,
  SiAmazoniam,
  SiAmazonrds,
  SiAmazonredshift,
  SiAmazonroute53,
  SiAmazons3,
  SiAmazonsqs,
  SiAwselasticloadbalancing,
  SiAwsfargate,
  SiAwslambda,
  SiAwssecretsmanager,
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
import { useProfessionalData } from '../contexts/ContentContext';

// Short display names for long service names
const DISPLAY_NAMES = {
  'AWS SageMaker (Pipelines, Feature Store, Model Registry, Endpoints, Monitor, Experiments)': 'SageMaker',
  'AWS CloudWatch (Logs, Metrics, Log Insights)': 'CloudWatch',
  'Docker (multi-stage, Trivy)': 'Docker',
  'Kubernetes/EKS': 'Kubernetes',
  'Ingress (ALB/NGINX)': 'Ingress',
  'JavaScript/TypeScript': 'JS / TS',
  'ECS/Fargate': 'ECS / Fargate',
  'RDS/Aurora': 'RDS / Aurora',
  'Git/GitHub': 'Git / GitHub',
  'Linux/Unix': 'Linux',
  'Prometheus/Grafana': 'Prometheus / Grafana',
  'Blue/Green Deployments': 'Blue/Green Deploy',
  'AWS Redshift': 'Redshift',
  'AWS Athena': 'Athena',
  'AWS Glue': 'Glue',
  'AWS EMR': 'EMR',
  'AWS Kinesis': 'Kinesis',
};

// Full descriptions for tooltips
const FULL_DESCRIPTIONS = {
  'SageMaker': 'Pipelines, Feature Store, Model Registry, Endpoints, Monitor, Experiments',
  'CloudWatch': 'Logs, Metrics, Log Insights',
  'Docker': 'Multi-stage builds, Trivy scanning',
  'Kubernetes': 'EKS managed clusters',
  'Ingress': 'ALB / NGINX Ingress Controllers',
  'JS / TS': 'JavaScript & TypeScript',
  'ECS / Fargate': 'Elastic Container Service + Fargate',
  'RDS / Aurora': 'Relational Database Service + Aurora',
};

const TechStackSection = () => {
  const { data: professionalData } = useProfessionalData();
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
  const [hoveredSkill, setHoveredSkill] = useState(null);
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

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const getSkillIcon = (skill) => {
    const n = skill.toLowerCase();

    // AWS service-specific icons (ordered most specific first)
    if (n.includes('sagemaker')) return SiAmazonwebservices;
    if (n === 'ec2' || n.includes('amazon ec2')) return SiAmazonec2;
    if (n.includes('ecs') && n.includes('fargate')) return SiAwsfargate;
    if (n === 'ecs' || n.includes('amazon ecs')) return SiAmazonecs;
    if (n === 'eks' || n.includes('amazon eks')) return SiAmazoneks;
    if (n === 'lambda' || n.includes('aws lambda')) return SiAwslambda;
    if (n === 's3' || n.includes('amazon s3')) return SiAmazons3;
    if (n.includes('dynamodb')) return SiAmazondynamodb;
    if (n.includes('rds') || n.includes('aurora')) return SiAmazonrds;
    if (n.includes('redshift')) return SiAmazonredshift;
    if (n.includes('route53') || n.includes('route 53')) return SiAmazonroute53;
    if (n.includes('cloudfront')) return Globe;
    if (n.includes('api gateway')) return SiAmazonapigateway;
    if (n === 'sqs' || n.includes('amazon sqs')) return SiAmazonsqs;
    if (n === 'sns') return Bell;
    if (n.includes('eventbridge')) return Radio;
    if (n.includes('step functions')) return Workflow;
    if (n === 'iam' || n.includes('amazon iam')) return SiAmazoniam;
    if (n.includes('secrets manager')) return SiAwssecretsmanager;
    if (n === 'waf') return Shield;
    if (n === 'ecr') return Container;
    if (n === 'alb' || n.includes('elastic load')) return SiAwselasticloadbalancing;
    if (n.includes('cloudwatch')) return SiAmazoncloudwatch;
    if (n === 'vpc') return Network;
    if (n.includes('auto scaling')) return Gauge;
    if (n === 'ebs' || n === 'efs') return HardDrive;
    if (n.includes('athena')) return Database;
    if (n.includes('glue')) return Layers;
    if (n === 'emr' || n.includes('aws emr')) return SiApachespark;
    if (n.includes('kinesis')) return BarChart3;
    if (n.includes('x-ray')) return SiAmazonwebservices;

    // Containers & orchestration
    if (n.includes('docker')) return SiDocker;
    if (n.includes('kubernetes') || n.includes('kubectl')) return SiKubernetes;
    if (n.includes('helm')) return SiHelm;
    if (n.includes('kustomize')) return SiKubernetes;
    if (n.includes('ingress')) return SiKubernetes;
    if (n.includes('fargate')) return SiAwsfargate;

    // DevOps tools
    if (n.includes('terraform')) return SiTerraform;
    if (n.includes('cloudformation')) return SiAmazonwebservices;
    if (n.includes('jenkins')) return SiJenkins;
    if (n.includes('github actions')) return SiGithubactions;
    if (n.includes('github') || n.includes('git')) return SiGithub;
    if (n.includes('codecommit') || n.includes('codebuild') || n.includes('codedeploy') || n.includes('codepipeline')) return SiAmazonwebservices;
    if (n.includes('blue/green')) return Server;

    // Monitoring
    if (n.includes('prometheus') && n.includes('grafana')) return SiPrometheus;
    if (n.includes('prometheus')) return SiPrometheus;
    if (n.includes('grafana')) return SiGrafana;
    if (n.includes('opentelemetry')) return SiOpentelemetry;
    if (n.includes('new relic')) return SiNewrelic;

    // MLOps
    if (n.includes('airflow') || n.includes('mwaa')) return SiApacheairflow;
    if (n.includes('mlflow')) return Cloud;
    if (n.includes('dvc')) return SiDvc;

    // Languages & tools
    if (n.includes('python')) return SiPython;
    if (n === 'go') return SiGo;
    if (n.includes('typescript') || n.includes('javascript')) return SiTypescript;
    if (n === 'sql') return SiPostgresql;
    if (n.includes('bash')) return SiGnubash;
    if (n.includes('linux')) return SiLinux;
    if (n.includes('yaml')) return SiYaml;
    if (n.includes('rest')) return Globe;

    // ML & Data Science
    if (n.includes('pytorch')) return SiPytorch;
    if (n.includes('tensorflow')) return SiTensorflow;
    if (n.includes('scikit-learn')) return SiScikitlearn;
    if (n.includes('scipy')) return SiScipy;
    if (n.includes('pandas')) return SiPandas;
    if (n.includes('numpy')) return SiNumpy;
    if (n.includes('pyspark') || n.includes('spark')) return SiApachespark;
    if (n.includes('tableau')) return SiTableau;
    if (n.includes('jupyter')) return SiJupyter;
    if (n.includes('matplotlib') || n.includes('seaborn')) return BarChart3;

    // Databases
    if (n.includes('mongo')) return SiMongodb;
    if (n.includes('mysql')) return SiMysql;
    if (n.includes('postgres')) return SiPostgresql;
    if (n.includes('redis')) return SiRedis;

    // Web frameworks
    if (n.includes('flask')) return SiFlask;
    if (n.includes('django')) return SiDjango;
    if (n.includes('fastapi')) return SiFastapi;
    if (n.includes('react')) return SiReact;
    if (n.includes('express')) return SiExpress;

    return Code;
  };

  const getDisplayName = (skill) => {
    return DISPLAY_NAMES[skill] || skill;
  };

  const getTooltip = (skill) => {
    const displayName = getDisplayName(skill);
    if (displayName !== skill) {
      return skill;
    }
    return FULL_DESCRIPTIONS[displayName] || null;
  };

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
                  className="absolute -left-6 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-500 shadow-md hover:border-blue-400 hover:text-blue-600 md:flex z-10"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={scrollNext}
                  aria-label="Scroll skills right"
                  className="absolute -right-6 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-500 shadow-md hover:border-blue-400 hover:text-blue-600 md:flex z-10"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
                <div ref={emblaRef} className="overflow-hidden">
                  <div className="flex gap-4 px-12">
                    {skillColumns.map((column, colIndex) => (
                      <div
                        key={`col-${colIndex}`}
                        className={`flex-[0_0_150px] sm:flex-[0_0_170px] md:flex-[0_0_190px] ${useTwoRows ? 'flex flex-col gap-4' : ''}`}
                      >
                        {column.map((skill, idx) => {
                          const Icon = getSkillIcon(skill) || Code;
                          const displayName = getDisplayName(skill);
                          const tooltip = getTooltip(skill);
                          const skillKey = `${skill}-${idx}`;
                          const isHovered = hoveredSkill === skillKey;
                          return (
                            <div
                              key={skillKey}
                              role="button"
                              tabIndex={0}
                              title={tooltip || skill}
                              onMouseEnter={() => setHoveredSkill(skillKey)}
                              onMouseLeave={() => setHoveredSkill(null)}
                              className="group relative rounded-2xl border border-neutral-200 bg-white px-3 py-4 text-center shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                            >
                              <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100 text-neutral-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                                <Icon className="h-5 w-5" />
                              </div>
                              <div className="text-xs font-semibold text-neutral-800 transition-colors group-hover:text-blue-600 leading-tight">
                                {displayName}
                              </div>
                              {/* Tooltip for abbreviated names */}
                              {tooltip && isHovered && (
                                <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-3 py-2 bg-neutral-900 text-white text-xs rounded-lg shadow-lg whitespace-normal max-w-[240px] z-20 pointer-events-none">
                                  {tooltip}
                                  <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-neutral-900" />
                                </div>
                              )}
                            </div>
                          );
                        })}
                        {useTwoRows && column.length === 1 && (
                          <div className="rounded-2xl border border-transparent bg-transparent px-3 py-4 opacity-0">
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
