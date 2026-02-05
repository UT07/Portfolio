import React, { useState, useEffect } from 'react';
import { Save, Loader2, Plus, Trash2 } from 'lucide-react';
import api from '../../services/api';

const ICON_OPTIONS = ['award', 'cloud', 'zap', 'cpu', 'trending-down', 'activity'];

export default function Highlights() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [project, setProject] = useState(null);
  const [highlights, setHighlights] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const projects = await api.getProjectsBySectionSlug('tech', false);
      const items = projects.items || [];
      const proj = items.find((p) => p.slug === 'highlights');
      if (proj) {
        setProject(proj);
        setHighlights(proj.content?.items || []);
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
        content: { items: highlights },
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const addHighlight = () => {
    setHighlights([...highlights, { category: '', title: '', description: '', icon: 'award' }]);
  };

  const updateHighlight = (index, field, value) => {
    const updated = [...highlights];
    updated[index] = { ...updated[index], [field]: value };
    setHighlights(updated);
  };

  const removeHighlight = (index) => {
    setHighlights(highlights.filter((_, i) => i !== index));
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>;
  }

  return (
    <div className="max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Highlights</h1>
          <p className="text-gray-500 text-sm mt-1">Key achievements and metrics</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Changes
        </button>
      </div>

      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>}
      {success && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg text-sm">Saved!</div>}

      <div className="space-y-4">
        {highlights.map((h, i) => (
          <div key={i} className="bg-white rounded-lg shadow p-4">
            <div className="flex gap-4">
              <div className="flex-1 grid grid-cols-2 gap-4">
                <input type="text" value={h.category} onChange={(e) => updateHighlight(i, 'category', e.target.value)} placeholder="Category" className="px-3 py-2 border rounded-lg" />
                <select value={h.icon} onChange={(e) => updateHighlight(i, 'icon', e.target.value)} className="px-3 py-2 border rounded-lg">
                  {ICON_OPTIONS.map(icon => <option key={icon} value={icon}>{icon}</option>)}
                </select>
                <input type="text" value={h.title} onChange={(e) => updateHighlight(i, 'title', e.target.value)} placeholder="Title" className="px-3 py-2 border rounded-lg col-span-2" />
                <textarea value={h.description} onChange={(e) => updateHighlight(i, 'description', e.target.value)} placeholder="Description" className="px-3 py-2 border rounded-lg col-span-2" rows={2} />
              </div>
              <button onClick={() => removeHighlight(i)} className="p-2 text-red-500 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
        <button onClick={addHighlight} className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg">
          <Plus className="w-4 h-4" /> Add Highlight
        </button>
      </div>
    </div>
  );
}
