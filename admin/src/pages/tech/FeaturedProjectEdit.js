import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import api from '../../services/api';
import { useSections } from '../../contexts/SectionsContext';
import ImagePicker from '../../components/ImagePicker';
import TagInput from '../../components/TagInput';
import DynamicList, { SimpleListItem } from '../../components/DynamicList';
import { PublishToggle } from '../../components/StatusBadge';

export default function FeaturedProjectEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { techSectionId } = useSections();
  const isNew = !id || id === 'new';

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    image: '',
    tags: [],
    github: '',
    demo: '',
    features: [],
    is_published: false,
  });

  const techSuggestions = [
    'React', 'TypeScript', 'Python', 'FastAPI', 'Node.js', 'PostgreSQL',
    'AWS', 'Docker', 'Redis', 'GraphQL', 'Next.js', 'Tailwind CSS'
  ];

  useEffect(() => {
    if (!isNew) loadProject();
  }, [id, isNew]);

  const loadProject = async () => {
    try {
      setLoading(true);
      const project = await api.getProject(id);
      setFormData({
        title: project.title || '',
        subtitle: project.subtitle || '',
        description: project.description || '',
        image: project.thumbnail_url || '',
        tags: project.tags || [],
        github: project.content?.github || '',
        demo: project.content?.demo || '',
        features: project.content?.features || [],
        is_published: project.is_published || false,
      });
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.title.trim()) {
      setError('Project title is required');
      return;
    }

    if (!techSectionId) {
      setError('Tech section not found. Please refresh the page.');
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const projectData = {
        section_id: techSectionId,
        slug: isNew ? `project-${Date.now()}` : undefined,
        title: formData.title,
        subtitle: formData.subtitle,
        description: formData.description,
        thumbnail_url: formData.image || null,
        tags: formData.tags,
        content: {
          github: formData.github,
          demo: formData.demo,
          features: formData.features,
        },
        extra_data: { type: 'featured' },
        is_published: formData.is_published,
      };

      if (isNew) {
        await api.createProject(projectData);
      } else {
        await api.updateProject(id, projectData);
      }

      navigate('/tech/projects');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>;
  }

  return (
    <div className="max-w-4xl">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate('/tech/projects')} className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{isNew ? 'New Project' : 'Edit Project'}</h1>
          <p className="text-gray-500 text-sm mt-1">{isNew ? 'Add a featured project' : formData.title}</p>
        </div>
        <PublishToggle
          published={formData.is_published}
          onChange={(val) => setFormData({ ...formData, is_published: val })}
        />
        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {isNew ? 'Create Project' : 'Save Changes'}
        </button>
      </div>

      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>}

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4 pb-2 border-b">Project Details</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Project name"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
            <input
              type="text"
              value={formData.subtitle}
              onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
              placeholder="Brief tagline"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the project..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">GitHub URL</label>
              <input
                type="url"
                value={formData.github}
                onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                placeholder="https://github.com/..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Demo URL</label>
              <input
                type="url"
                value={formData.demo}
                onChange={(e) => setFormData({ ...formData, demo: e.target.value })}
                placeholder="https://..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Technologies</label>
            <TagInput
              tags={formData.tags}
              onChange={(tags) => setFormData({ ...formData, tags })}
              placeholder="Add technologies..."
              suggestions={techSuggestions}
            />
          </div>

          <ImagePicker
            label="Project Image"
            value={formData.image}
            onChange={(url) => setFormData({ ...formData, image: url })}
            projectId={id}
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4 pb-2 border-b">Key Features</h2>
        <DynamicList
          items={formData.features}
          onChange={(features) => setFormData({ ...formData, features })}
          renderItem={(item, idx, onChange) => <SimpleListItem value={item} onChange={onChange} placeholder="Feature description..." />}
          createItem={() => ''}
          addLabel="Add Feature"
        />
      </div>
    </div>
  );
}
