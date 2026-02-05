import React, { useState, useEffect } from 'react';
import { Save, Loader2, Plus, Trash2, ExternalLink, RefreshCw } from 'lucide-react';
import api from '../../services/api';

export default function GithubProjects() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [project, setProject] = useState(null);
  const [repos, setRepos] = useState([]);
  const [username, setUsername] = useState('');

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const projects = await api.getProjectsBySectionSlug('tech', false);
      const items = projects.items || [];
      const proj = items.find((p) => p.slug === 'github-projects');
      if (proj) {
        setProject(proj);
        setRepos(proj.content?.repos || []);
        setUsername(proj.content?.username || '');
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
        content: { repos, username },
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const addRepo = () => {
    setRepos([...repos, {
      name: '',
      description: '',
      language: '',
      stars: 0,
      url: ''
    }]);
  };

  const updateRepo = (index, field, value) => {
    const updated = [...repos];
    updated[index] = { ...updated[index], [field]: value };
    setRepos(updated);
  };

  const removeRepo = (index) => {
    setRepos(repos.filter((_, i) => i !== index));
  };

  const languageColors = {
    'JavaScript': 'bg-yellow-100 text-yellow-800',
    'TypeScript': 'bg-blue-100 text-blue-800',
    'Python': 'bg-green-100 text-green-800',
    'Java': 'bg-orange-100 text-orange-800',
    'Go': 'bg-cyan-100 text-cyan-800',
    'Rust': 'bg-red-100 text-red-800',
    'C++': 'bg-pink-100 text-pink-800',
    'Ruby': 'bg-red-100 text-red-800',
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>;
  }

  return (
    <div className="max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">GitHub Projects</h1>
          <p className="text-gray-500 text-sm mt-1">Showcase your open source work</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Changes
        </button>
      </div>

      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>}
      {success && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg text-sm">Saved!</div>}

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div>
          <label className="block text-sm font-medium mb-1">GitHub Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="your-username"
            className="w-full max-w-xs px-3 py-2 border rounded-lg"
          />
          <p className="text-xs text-gray-500 mt-1">Used for the "View all on GitHub" link</p>
        </div>
      </div>

      <div className="space-y-4">
        {repos.map((repo, i) => (
          <div key={i} className="bg-white rounded-lg shadow p-4">
            <div className="flex gap-4">
              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Repository Name</label>
                    <input
                      type="text"
                      value={repo.name}
                      onChange={(e) => updateRepo(i, 'name', e.target.value)}
                      placeholder="my-awesome-project"
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Language</label>
                    <input
                      type="text"
                      value={repo.language}
                      onChange={(e) => updateRepo(i, 'language', e.target.value)}
                      placeholder="TypeScript"
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                    {repo.language && (
                      <span className={`inline-block mt-1 px-2 py-0.5 text-xs rounded ${languageColors[repo.language] || 'bg-gray-100 text-gray-800'}`}>
                        {repo.language}
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <input
                    type="text"
                    value={repo.description}
                    onChange={(e) => updateRepo(i, 'description', e.target.value)}
                    placeholder="A brief description of what this project does"
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Stars</label>
                    <input
                      type="number"
                      value={repo.stars}
                      onChange={(e) => updateRepo(i, 'stars', parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">URL</label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={repo.url}
                        onChange={(e) => updateRepo(i, 'url', e.target.value)}
                        placeholder="https://github.com/..."
                        className="flex-1 px-3 py-2 border rounded-lg"
                      />
                      {repo.url && (
                        <a href={repo.url} target="_blank" rel="noopener noreferrer" className="px-3 py-2 border rounded-lg hover:bg-gray-50">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <button onClick={() => removeRepo(i)} className="p-2 text-red-500 hover:bg-red-50 rounded h-fit">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        <button onClick={addRepo} className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg">
          <Plus className="w-4 h-4" /> Add Repository
        </button>
      </div>
    </div>
  );
}
