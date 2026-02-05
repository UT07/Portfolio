import React, { useState, useEffect } from 'react';
import { Save, Loader2, Plus, Trash2, ExternalLink } from 'lucide-react';
import api from '../../services/api';

export default function Certifications() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [project, setProject] = useState(null);
  const [certs, setCerts] = useState([]);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const projects = await api.getProjectsBySectionSlug('tech', false);
      const items = projects.items || [];
      const proj = items.find((p) => p.slug === 'certifications');
      if (proj) {
        setProject(proj);
        setCerts(proj.content?.items || []);
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
        content: { items: certs },
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const addCert = () => {
    setCerts([...certs, {
      name: '',
      issuer: '',
      date: '',
      credentialId: '',
      link: ''
    }]);
  };

  const updateCert = (index, field, value) => {
    const updated = [...certs];
    updated[index] = { ...updated[index], [field]: value };
    setCerts(updated);
  };

  const removeCert = (index) => {
    setCerts(certs.filter((_, i) => i !== index));
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>;
  }

  return (
    <div className="max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Certifications</h1>
          <p className="text-gray-500 text-sm mt-1">Professional certifications and credentials</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Changes
        </button>
      </div>

      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>}
      {success && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg text-sm">Saved!</div>}

      <div className="space-y-4">
        {certs.map((cert, i) => (
          <div key={i} className="bg-white rounded-lg shadow p-4">
            <div className="flex gap-4">
              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Certification Name</label>
                    <input
                      type="text"
                      value={cert.name}
                      onChange={(e) => updateCert(i, 'name', e.target.value)}
                      placeholder="AWS Solutions Architect"
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Issuer</label>
                    <input
                      type="text"
                      value={cert.issuer}
                      onChange={(e) => updateCert(i, 'issuer', e.target.value)}
                      placeholder="Amazon Web Services"
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Date Issued</label>
                    <input
                      type="text"
                      value={cert.date}
                      onChange={(e) => updateCert(i, 'date', e.target.value)}
                      placeholder="January 2024"
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Credential ID</label>
                    <input
                      type="text"
                      value={cert.credentialId}
                      onChange={(e) => updateCert(i, 'credentialId', e.target.value)}
                      placeholder="ABC123XYZ"
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Verification Link</label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={cert.link}
                      onChange={(e) => updateCert(i, 'link', e.target.value)}
                      placeholder="https://..."
                      className="flex-1 px-3 py-2 border rounded-lg"
                    />
                    {cert.link && (
                      <a href={cert.link} target="_blank" rel="noopener noreferrer" className="px-3 py-2 border rounded-lg hover:bg-gray-50">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
              <button onClick={() => removeCert(i)} className="p-2 text-red-500 hover:bg-red-50 rounded h-fit">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        <button onClick={addCert} className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg">
          <Plus className="w-4 h-4" /> Add Certification
        </button>
      </div>
    </div>
  );
}
