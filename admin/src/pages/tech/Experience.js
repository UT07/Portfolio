import React, { useState, useEffect } from 'react';
import { Save, Loader2, Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import api from '../../services/api';
import { useSections } from '../../contexts/SectionsContext';
import DynamicList, { SimpleListItem } from '../../components/DynamicList';

export default function Experience() {
  const { techSectionId } = useSections();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [entries, setEntries] = useState([]);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await api.getProjectsByType('tech', 'experience');
      setEntries(data.sort((a, b) => a.display_order - b.display_order));
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  const handleSave = async (entry) => {
    try {
      setSaving(true);
      await api.updateProject(entry.id, {
        title: entry.title,
        subtitle: entry.subtitle,
        description: entry.description,
        content: entry.content,
      });
    } catch (err) { setError(err.message); }
    finally { setSaving(false); }
  };

  const handleAdd = async () => {
    if (!techSectionId) return;
    try {
      await api.createProject({
        section_id: techSectionId,
        slug: `experience-${Date.now()}`,
        title: 'Company Name',
        subtitle: 'Role',
        description: '',
        content: { location: '', dates: '', duration: '', responsibilities: [], achievements: [] },
        extra_data: { type: 'experience' },
        display_order: entries.length + 30,
        is_published: true,
      });
      loadData();
    } catch (err) { setError(err.message); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this experience entry?')) return;
    try { await api.deleteProject(id); loadData(); } catch (err) { setError(err.message); }
  };

  const updateEntry = (index, field, value) => {
    const updated = [...entries];
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      updated[index] = { ...updated[index], [parent]: { ...updated[index][parent], [child]: value } };
    } else {
      updated[index] = { ...updated[index], [field]: value };
    }
    setEntries(updated);
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>;

  return (
    <div className="max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <div><h1 className="text-2xl font-bold">Experience</h1><p className="text-gray-500 text-sm mt-1">Work history and roles</p></div>
        <button onClick={handleAdd} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"><Plus className="w-4 h-4" /> Add Entry</button>
      </div>
      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>}
      <div className="space-y-4">
        {entries.map((entry, i) => (
          <div key={entry.id} className="bg-white rounded-lg shadow overflow-hidden">
            <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50" onClick={() => setExpanded(expanded === i ? null : i)}>
              <div><div className="font-medium">{entry.title}</div><div className="text-sm text-gray-500">{entry.subtitle}</div></div>
              <div className="flex items-center gap-2"><span className="text-sm text-gray-500">{entry.content?.duration}</span>{expanded === i ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}</div>
            </div>
            {expanded === i && (
              <div className="p-4 border-t space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-sm font-medium mb-1">Company</label><input type="text" value={entry.title} onChange={(e) => updateEntry(i, 'title', e.target.value)} className="w-full px-3 py-2 border rounded-lg" /></div>
                  <div><label className="block text-sm font-medium mb-1">Role</label><input type="text" value={entry.subtitle} onChange={(e) => updateEntry(i, 'subtitle', e.target.value)} className="w-full px-3 py-2 border rounded-lg" /></div>
                  <div><label className="block text-sm font-medium mb-1">Location</label><input type="text" value={entry.content?.location || ''} onChange={(e) => updateEntry(i, 'content.location', e.target.value)} className="w-full px-3 py-2 border rounded-lg" /></div>
                  <div><label className="block text-sm font-medium mb-1">Dates</label><input type="text" value={entry.content?.dates || ''} onChange={(e) => updateEntry(i, 'content.dates', e.target.value)} className="w-full px-3 py-2 border rounded-lg" /></div>
                </div>
                <div><label className="block text-sm font-medium mb-1">Responsibilities</label>
                  <DynamicList items={entry.content?.responsibilities || []} onChange={(v) => updateEntry(i, 'content.responsibilities', v)} renderItem={(item, idx, onChange) => <SimpleListItem value={item} onChange={onChange} />} createItem={() => ''} addLabel="Add" />
                </div>
                <div><label className="block text-sm font-medium mb-1">Achievements</label>
                  <DynamicList items={entry.content?.achievements || []} onChange={(v) => updateEntry(i, 'content.achievements', v)} renderItem={(item, idx, onChange) => <SimpleListItem value={item} onChange={onChange} />} createItem={() => ''} addLabel="Add" />
                </div>
                <div className="flex gap-2 pt-2">
                  <button onClick={() => handleSave(entry)} disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">{saving ? 'Saving...' : 'Save'}</button>
                  <button onClick={() => handleDelete(entry.id)} className="px-4 py-2 text-red-600 border border-red-200 rounded-lg hover:bg-red-50">Delete</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
