const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';

class ApiService {
  constructor() {
    this.accessToken = localStorage.getItem('accessToken');
    this.refreshToken = localStorage.getItem('refreshToken');
  }

  setTokens(accessToken, refreshToken) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }

  clearTokens() {
    this.accessToken = null;
    this.refreshToken = null;
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  async request(endpoint, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.accessToken) {
      headers['Authorization'] = `Bearer ${this.accessToken}`;
    }

    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    if (response.status === 401 && this.refreshToken) {
      const refreshed = await this.refreshAccessToken();
      if (refreshed) {
        headers['Authorization'] = `Bearer ${this.accessToken}`;
        return fetch(`${API_BASE}${endpoint}`, { ...options, headers });
      }
    }

    return response;
  }

  async refreshAccessToken() {
    try {
      const response = await fetch(`${API_BASE}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: this.refreshToken }),
      });
      if (response.ok) {
        const data = await response.json();
        this.setTokens(data.access_token, data.refresh_token);
        return true;
      }
    } catch (e) {
      console.error('Token refresh failed:', e);
    }
    this.clearTokens();
    return false;
  }

  // ============ AUTH ============
  async login(email, password) {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) throw new Error('Login failed');
    const data = await response.json();
    this.setTokens(data.access_token, data.refresh_token);
    return data;
  }

  async logout() {
    this.clearTokens();
  }

  async getMe() {
    const response = await this.request('/auth/me');
    if (!response.ok) throw new Error('Not authenticated');
    return response.json();
  }

  // ============ SECTIONS ============
  async getSections() {
    const response = await this.request('/sections');
    if (!response.ok) throw new Error('Failed to fetch sections');
    return response.json();
  }

  async createSection(data) {
    const response = await this.request('/sections', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create section');
    return response.json();
  }

  async updateSection(id, data) {
    const response = await this.request(`/sections/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update section');
    return response.json();
  }

  async deleteSection(id) {
    const response = await this.request(`/sections/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete section');
  }

  // ============ PROJECTS ============
  async getProjects(sectionId = null, publishedOnly = false) {
    let url = `/projects?published_only=${publishedOnly}`;
    if (sectionId) url += `&section_id=${sectionId}`;
    const response = await this.request(url);
    if (!response.ok) throw new Error('Failed to fetch projects');
    return response.json();
  }

  async getProjectsBySectionSlug(slug, publishedOnly = false) {
    // First get section ID, then get projects
    const sections = await this.getSections();
    const section = (sections.items || []).find(s => s.slug === slug);
    if (!section) throw new Error(`Section "${slug}" not found`);
    return this.getProjects(section.id, publishedOnly);
  }

  async getProject(id) {
    const response = await this.request(`/projects/${id}`);
    if (!response.ok) throw new Error('Failed to fetch project');
    return response.json();
  }

  async getProjectBySlug(sectionSlug, projectSlug) {
    const projects = await this.getProjectsBySectionSlug(sectionSlug, false);
    const items = projects.items || [];
    return items.find(p => p.slug === projectSlug) || null;
  }

  async createProject(data) {
    const response = await this.request('/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || 'Failed to create project');
    }
    return response.json();
  }

  async updateProject(id, data) {
    const response = await this.request(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || 'Failed to update project');
    }
    return response.json();
  }

  async deleteProject(id) {
    const response = await this.request(`/projects/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete project');
  }

  async publishProject(id) {
    return this.updateProject(id, { is_published: true });
  }

  async unpublishProject(id) {
    return this.updateProject(id, { is_published: false });
  }

  // ============ ASSETS ============
  async uploadAsset(file, projectId = null, altText = null, caption = null) {
    const formData = new FormData();
    formData.append('file', file);
    if (projectId) formData.append('project_id', projectId);
    if (altText) formData.append('alt_text', altText);
    if (caption) formData.append('caption', caption);

    const response = await fetch(`${API_BASE}/assets/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        // NOTE: Do NOT set Content-Type for FormData — browser sets it with boundary
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || 'Upload failed');
    }
    return response.json();
  }

  async uploadMultipleAssets(files, projectId = null) {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    if (projectId) formData.append('project_id', projectId);

    const response = await fetch(`${API_BASE}/assets/upload-multiple`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || 'Upload failed');
    }
    return response.json();
  }

  async getAssets(projectId = null, fileType = null) {
    let url = '/assets?';
    const params = [];
    if (projectId) params.push(`project_id=${projectId}`);
    if (fileType) params.push(`file_type=${fileType}`);
    url += params.join('&');

    const response = await this.request(url);
    if (!response.ok) throw new Error('Failed to fetch assets');
    return response.json();
  }

  async getAsset(id) {
    const response = await this.request(`/assets/${id}`);
    if (!response.ok) throw new Error('Failed to fetch asset');
    return response.json();
  }

  async updateAsset(id, data) {
    const response = await this.request(`/assets/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update asset');
    return response.json();
  }

  async deleteAsset(id) {
    const response = await this.request(`/assets/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete asset');
  }

  // ============ CONTENT ============
  async getContent() {
    const response = await fetch(`${API_BASE}/content`);
    if (!response.ok) throw new Error('Failed to fetch content');
    return response.json();
  }

  // ============ HELPERS ============
  // Get projects filtered by extra_data.type
  async getProjectsByType(sectionSlug, type) {
    const projects = await this.getProjectsBySectionSlug(sectionSlug, false);
    const items = projects.items || [];
    return items.filter(p => p.extra_data?.type === type);
  }

  // Get single project by slug pattern
  async findProjectBySlugPattern(sectionSlug, pattern) {
    const projects = await this.getProjectsBySectionSlug(sectionSlug, false);
    const items = projects.items || [];
    if (typeof pattern === 'string') {
      return items.find(p => p.slug === pattern);
    }
    // pattern is a RegExp
    return items.find(p => pattern.test(p.slug));
  }
}

export const api = new ApiService();
export default api;
