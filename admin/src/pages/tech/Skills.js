import React, { useState, useEffect } from 'react';
import { Save, Loader2, Plus, Trash2, ChevronDown, ChevronUp, GripVertical } from 'lucide-react';
import api from '../../services/api';
import DynamicList, { SimpleListItem } from '../../components/DynamicList';

const ICON_OPTIONS = [
  'code', 'database', 'cloud', 'server', 'terminal', 'git-branch',
  'cpu', 'monitor', 'smartphone', 'globe', 'lock', 'zap',
  'layers', 'box', 'tool', 'settings', 'activity', 'bar-chart'
];

export default function Skills() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [project, setProject] = useState(null);
  const [categories, setCategories] = useState([]);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const projects = await api.getProjectsBySectionSlug('tech', false);
      const items = projects.items || [];
      const proj = items.find((p) => p.slug === 'skills');
      if (proj) {
        setProject(proj);
        setCategories(proj.content?.categories || []);
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
        content: { categories },
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const addCategory = () => {
    setCategories([...categories, { name: 'New Category', icon: 'code', items: [] }]);
    setExpanded(categories.length);
  };

  const updateCategory = (index, field, value) => {
    const updated = [...categories];
    updated[index] = { ...updated[index], [field]: value };
    setCategories(updated);
  };

  const removeCategory = (index) => {
    if (!window.confirm('Delete this category and all its skills?')) return;
    setCategories(categories.filter((_, i) => i !== index));
    if (expanded === index) setExpanded(null);
  };

  const moveCategory = (index, direction) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= categories.length) return;
    const updated = [...categories];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    setCategories(updated);
    setExpanded(newIndex);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>;
  }

  return (
    <div className="max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Skills & Tech Stack</h1>
          <p className="text-gray-500 text-sm mt-1">Manage skill categories and technologies</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Changes
        </button>
      </div>

      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>}
      {success && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg text-sm">Saved!</div>}

      <div className="space-y-4">
        {categories.map((cat, i) => (
          <div key={i} className="bg-white rounded-lg shadow overflow-hidden">
            <div className="flex items-center gap-2 p-4 cursor-pointer hover:bg-gray-50" onClick={() => setExpanded(expanded === i ? null : i)}>
              <div className="flex flex-col gap-1">
                <button onClick={(e) => { e.stopPropagation(); moveCategory(i, -1); }} disabled={i === 0} className="p-0.5 hover:bg-gray-200 rounded disabled:opacity-30">
                  <ChevronUp className="w-4 h-4" />
                </button>
                <button onClick={(e) => { e.stopPropagation(); moveCategory(i, 1); }} disabled={i === categories.length - 1} className="p-0.5 hover:bg-gray-200 rounded disabled:opacity-30">
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1">
                <div className="font-medium">{cat.name}</div>
                <div className="text-sm text-gray-500">{cat.items?.length || 0} skills</div>
              </div>
              <span className="px-2 py-1 bg-gray-100 rounded text-sm">{cat.icon}</span>
              {expanded === i ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </div>

            {expanded === i && (
              <div className="p-4 border-t space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Category Name</label>
                    <input
                      type="text"
                      value={cat.name}
                      onChange={(e) => updateCategory(i, 'name', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Icon</label>
                    <select
                      value={cat.icon}
                      onChange={(e) => updateCategory(i, 'icon', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg"
                    >
                      {ICON_OPTIONS.map(icon => <option key={icon} value={icon}>{icon}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Skills</label>
                  <DynamicList
                    items={cat.items || []}
                    onChange={(items) => updateCategory(i, 'items', items)}
                    renderItem={(item, idx, onChange) => <SimpleListItem value={item} onChange={onChange} placeholder="Skill name..." />}
                    createItem={() => ''}
                    addLabel="Add Skill"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button onClick={() => removeCategory(i)} className="px-4 py-2 text-red-600 border border-red-200 rounded-lg hover:bg-red-50">
                    <Trash2 className="w-4 h-4 inline mr-1" /> Delete Category
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        <button onClick={addCategory} className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg">
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>
    </div>
  );
}
