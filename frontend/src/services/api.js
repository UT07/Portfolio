/**
 * API Service for fetching content from the backend
 */

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';

/**
 * Fetch all content from the API
 */
export async function fetchAllContent() {
  const response = await fetch(`${API_BASE}/content`);
  if (!response.ok) {
    throw new Error(`Failed to fetch content: ${response.status}`);
  }
  return response.json();
}

/**
 * Fetch content for a specific section
 */
export async function fetchSectionContent(sectionSlug) {
  const response = await fetch(`${API_BASE}/content/${sectionSlug}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch section: ${response.status}`);
  }
  return response.json();
}

/**
 * Transform API response to match existing data structure for DJ mode
 */
export function transformDJContent(apiData) {
  if (!apiData?.projects) return null;

  const projects = apiData.projects;
  const getProject = (slug) => projects.find(p => p.slug === slug);

  const hero = getProject('hero');
  const artist = getProject('artist');
  const sets = getProject('sets');
  const pressKit = getProject('press-kit');
  const contact = getProject('contact');
  const gigs = projects
    .filter(p => p.slug.startsWith('gig-'))
    .sort((a, b) => new Date(b.content?.date || 0) - new Date(a.content?.date || 0));

  return {
    hero: hero ? {
      name: hero.title,
      badge: hero.subtitle,
      headline: hero.description,
      subheadline: hero.content?.subheadline,
      genres: hero.content?.genres,
      hero_image: hero.thumbnail_url?.replace('https://d1q048o59d0tgk.cloudfront.net/assets', ''),
      ctas: hero.content?.ctas || []
    } : null,
    artist: artist ? {
      title: artist.subtitle,
      bio: artist.description,
      artist_image: artist.thumbnail_url?.replace('https://d1q048o59d0tgk.cloudfront.net/assets', ''),
      highlights: artist.content?.highlights || []
    } : null,
    gigs: gigs.map(gig => ({
      id: gig.slug,
      event: gig.title,
      collective: gig.extra_data?.collective,
      date: gig.content?.date,
      location: gig.extra_data?.location,
      time: gig.content?.time,
      genre: gig.content?.genre || [],
      tags: gig.tags?.filter(t => !gig.content?.genre?.includes(t)) || [],
      description: gig.description,
      image: gig.thumbnail_url?.replace('https://d1q048o59d0tgk.cloudfront.net/assets', ''),
      clips: gig.content?.clips || []
    })),
    sets: sets ? {
      title: sets.title,
      description: sets.description,
      platforms: sets.content?.platforms || []
    } : null,
    pressKit: pressKit ? {
      title: pressKit.title,
      description: pressKit.description,
      bio_short: pressKit.content?.bio_short,
      bio_long: pressKit.content?.bio_long,
      technical_rider: pressKit.content?.technical_rider,
      downloads: pressKit.content?.downloads || [],
      gallery: pressKit.content?.gallery
    } : null,
    contact: contact ? {
      email: contact.content?.email,
      booking_title: contact.subtitle,
      booking_description: contact.description,
      social: contact.content?.social || {}
    } : null
  };
}

/**
 * Transform API response to match existing data structure for Professional mode
 */
export function transformProfessionalContent(apiData) {
  if (!apiData?.projects) return null;

  const projects = apiData.projects;
  const getProject = (slug) => projects.find(p => p.slug === slug);

  const hero = getProject('hero');
  const highlights = getProject('highlights');
  const about = getProject('about');
  const skills = getProject('skills');
  const certifications = getProject('certifications');
  const contact = getProject('contact');

  const education = projects
    .filter(p => p.extra_data?.type === 'education')
    .sort((a, b) => a.display_order - b.display_order);

  const experience = projects
    .filter(p => p.extra_data?.type === 'experience')
    .sort((a, b) => a.display_order - b.display_order);

  const featuredProjects = projects
    .filter(p => p.extra_data?.type === 'featured_project')
    .sort((a, b) => a.display_order - b.display_order);

  const githubProjects = projects
    .filter(p => p.extra_data?.type === 'github_project');

  // Group GitHub projects by category
  const githubByCategory = {};
  githubProjects.forEach(p => {
    const cat = p.extra_data?.category || 'other';
    if (!githubByCategory[cat]) githubByCategory[cat] = [];
    githubByCategory[cat].push({
      name: p.title,
      description: p.description,
      stack: p.content?.stack || [],
      repo: p.content?.repo,
      demo: p.content?.demo
    });
  });

  return {
    hero: hero ? {
      name: hero.title,
      title: hero.subtitle,
      headline: hero.description,
      subtext: hero.content?.subtext,
      headshot: hero.thumbnail_url?.replace('https://d1q048o59d0tgk.cloudfront.net/assets', ''),
      ctas: hero.content?.ctas || []
    } : null,
    highlights: highlights?.content?.items || [],
    about: about ? {
      title: about.title,
      paragraphs: about.content?.paragraphs || [about.description]
    } : null,
    education: education.map(edu => ({
      institution: edu.title,
      degree: edu.subtitle,
      location: edu.content?.location,
      dates: edu.content?.dates,
      status: edu.content?.status,
      description: edu.description,
      modules: edu.content?.modules || [],
      projects: edu.content?.projects || [],
      thesis: edu.content?.thesis,
      leadership: edu.content?.leadership || []
    })),
    experience: experience.map(exp => ({
      company: exp.title,
      role: exp.subtitle,
      location: exp.content?.location,
      dates: exp.content?.dates,
      duration: exp.content?.duration,
      responsibilities: exp.content?.responsibilities || [],
      achievements: exp.content?.achievements || []
    })),
    skills: skills ? {
      categories: skills.content?.categories || []
    } : { categories: [] },
    certifications: certifications?.content?.items || [],
    contact: contact?.content || {}
  };
}

/**
 * Transform API response for projects data
 */
export function transformProjectsContent(apiData) {
  if (!apiData?.projects) return null;

  const projects = apiData.projects;

  const featuredProjects = projects
    .filter(p => p.extra_data?.type === 'featured_project')
    .sort((a, b) => a.display_order - b.display_order);

  const githubProjects = projects
    .filter(p => p.extra_data?.type === 'github_project');

  // Group GitHub projects by category
  const githubByCategory = {};
  githubProjects.forEach(p => {
    const cat = p.extra_data?.category || 'other';
    if (!githubByCategory[cat]) githubByCategory[cat] = [];
    githubByCategory[cat].push({
      name: p.title,
      description: p.description,
      stack: p.content?.stack || [],
      repo: p.content?.repo,
      demo: p.content?.demo
    });
  });

  return {
    featured: featuredProjects.map(p => ({
      title: p.title,
      category: p.extra_data?.category || p.subtitle,
      timeline: p.content?.timeline,
      description: p.description,
      problem: p.content?.problem,
      approach: p.content?.approach,
      stack: p.content?.stack || [],
      outcomes: p.content?.outcomes || [],
      links: p.content?.links || {},
      demo_image: p.thumbnail_url
    })),
    github_projects: githubByCategory
  };
}

export default {
  fetchAllContent,
  fetchSectionContent,
  transformDJContent,
  transformProfessionalContent,
  transformProjectsContent
};
