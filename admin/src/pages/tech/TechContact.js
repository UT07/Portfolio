import React, { useState, useEffect } from 'react';
import { Save, Loader2, Plus, Trash2 } from 'lucide-react';
import api from '../../services/api';

const SOCIAL_PLATFORMS = [
  { id: 'linkedin', label: 'LinkedIn', placeholder: 'https://linkedin.com/in/...' },
  { id: 'github', label: 'GitHub', placeholder: 'https://github.com/...' },
  { id: 'twitter', label: 'Twitter/X', placeholder: 'https://twitter.com/...' },
  { id: 'email', label: 'Email', placeholder: 'mailto:you@example.com' },
  { id: 'website', label: 'Website', placeholder: 'https://...' },
];

export default function TechContact() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [project, setProject] = useState(null);
  const [contact, setContact] = useState({
    headline: '',
    subheadline: '',
    email: '',
    socials: [],
    resumeUrl: '',
  });

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const projects = await api.getProjectsBySectionSlug('tech', false);
      const items = projects.items || [];
      const proj = items.find((p) => p.slug === 'contact');
      if (proj) {
        setProject(proj);
        setContact({
          headline: proj.content?.headline || '',
          subheadline: proj.content?.subheadline || '',
          email: proj.content?.email || '',
          socials: proj.content?.socials || [],
          resumeUrl: proj.content?.resumeUrl || '',
        });
      }
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!project) return;
    try {
      setSaving(true);
      await api.updateProject(project.id, {
        content: contact,
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field, value) => {
    setContact({ ...contact, [field]: value });
  };

  const addSocial = () => {
    setContact({
      ...contact,
      socials: [...contact.socials, { platform: 'linkedin', url: '' }]
    });
  };

  const updateSocial = (index, field, value) => {
    const updated = [...contact.socials];
    updated[index] = { ...updated[index], [field]: value };
    setContact({ ...contact, socials: updated });
  };

  const removeSocial = (index) => {
    setContact({
      ...contact,
      socials: contact.socials.filter((_, i) => i !== index)
    });
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>;
  }

  return (
    <div className="max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Contact</h1>
          <p className="text-gray-500 text-sm mt-1">Contact information for professional inquiries</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Changes
        </button>
      </div>

      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>}
      {success && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg text-sm">Saved!</div>}

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4 pb-2 border-b">Contact Section</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Headline</label>
            <input
              type="text"
              value={contact.headline}
              onChange={(e) => updateField('headline', e.target.value)}
              placeholder="Let's connect"
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Subheadline</label>
            <textarea
              value={contact.subheadline}
              onChange={(e) => updateField('subheadline', e.target.value)}
              placeholder="I'm always open to discussing new opportunities..."
              rows={2}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={contact.email}
              onChange={(e) => updateField('email', e.target.value)}
              placeholder="you@example.com"
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Resume URL</label>
            <input
              type="url"
              value={contact.resumeUrl}
              onChange={(e) => updateField('resumeUrl', e.target.value)}
              placeholder="https://..."
              className="w-full px-3 py-2 border rounded-lg"
            />
            <p className="text-xs text-gray-500 mt-1">Link to your resume PDF</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4 pb-2 border-b">Social Links</h2>
        <div className="space-y-3">
          {contact.socials.map((social, i) => {
            const platform = SOCIAL_PLATFORMS.find(p => p.id === social.platform) || SOCIAL_PLATFORMS[0];
            return (
              <div key={i} className="flex gap-3 items-center">
                <select
                  value={social.platform}
                  onChange={(e) => updateSocial(i, 'platform', e.target.value)}
                  className="px-3 py-2 border rounded-lg w-36"
                >
                  {SOCIAL_PLATFORMS.map(p => (
                    <option key={p.id} value={p.id}>{p.label}</option>
                  ))}
                </select>
                <input
                  type="url"
                  value={social.url}
                  onChange={(e) => updateSocial(i, 'url', e.target.value)}
                  placeholder={platform.placeholder}
                  className="flex-1 px-3 py-2 border rounded-lg"
                />
                <button onClick={() => removeSocial(i)} className="p-2 text-red-500 hover:bg-red-50 rounded">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })}
          <button onClick={addSocial} className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg">
            <Plus className="w-4 h-4" /> Add Social Link
          </button>
        </div>
      </div>
    </div>
  );
}
