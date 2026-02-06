import React, { useState, useEffect } from 'react';
import { Save, Loader2, Plus, Trash2, ExternalLink, Music } from 'lucide-react';
import api from '../../services/api';

const PLATFORMS = [
  { id: 'soundcloud', label: 'SoundCloud', color: 'bg-orange-100 text-orange-800' },
  { id: 'youtube', label: 'YouTube', color: 'bg-red-100 text-red-800' },
  { id: 'mixcloud', label: 'Mixcloud', color: 'bg-blue-100 text-blue-800' },
  { id: 'spotify', label: 'Spotify', color: 'bg-green-100 text-green-800' },
];

export default function Sets() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [project, setProject] = useState(null);
  const [sets, setSets] = useState({
    soundcloudUrl: '',
    youtubePlaylist: '',
    featuredSets: [],
  });

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const projects = await api.getProjectsBySectionSlug('dj', false);
      const items = projects.items || [];
      const proj = items.find((p) => p.slug === 'sets');
      if (proj) {
        setProject(proj);
        const c = proj.content || {};
        // Data is stored as { platforms: [{name, url, logo, sets[]}] }
        // Normalize to admin's flat structure
        const platforms = Array.isArray(c.platforms) ? c.platforms : [];
        const scPlatform = platforms.find(p => p.name === 'SoundCloud');
        const ytPlatform = platforms.find(p => p.name === 'YouTube');

        // Collect all featured sets from all platforms
        const allSets = [];
        platforms.forEach(p => {
          (p.sets || []).forEach(s => {
            allSets.push({
              title: s.title || '',
              platform: (p.name || '').toLowerCase() === 'youtube' ? 'youtube' : 'soundcloud',
              url: s.url || '',
              duration: s.duration || '',
              date: s.date || '',
            });
          });
        });

        setSets({
          soundcloudUrl: c.soundcloudUrl || scPlatform?.url || '',
          youtubePlaylist: c.youtubePlaylist || ytPlatform?.url || '',
          featuredSets: Array.isArray(c.featuredSets) && c.featuredSets.length > 0
            ? c.featuredSets
            : allSets,
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
      // Build platforms array for frontend compatibility
      const scSets = sets.featuredSets.filter(s => s.platform === 'soundcloud');
      const ytSets = sets.featuredSets.filter(s => s.platform === 'youtube');
      const otherSets = sets.featuredSets.filter(s => !['soundcloud', 'youtube'].includes(s.platform));

      const platforms = [];
      if (sets.soundcloudUrl || scSets.length > 0) {
        platforms.push({
          name: 'SoundCloud',
          url: sets.soundcloudUrl,
          logo: '/images/logo-soundcloud.svg',
          sets: scSets.map(s => ({
            title: s.title, url: s.url, date: s.date,
            duration: s.duration, thumbnail: s.thumbnail || '',
          })),
        });
      }
      if (sets.youtubePlaylist || ytSets.length > 0) {
        platforms.push({
          name: 'YouTube',
          url: sets.youtubePlaylist,
          logo: '/images/logo-youtube.svg',
          sets: ytSets.map(s => ({
            title: s.title, url: s.url, date: s.date,
            duration: s.duration, thumbnail: s.thumbnail || '',
          })),
        });
      }

      await api.updateProject(project.id, {
        content: {
          // Save in both formats for compatibility
          platforms,
          soundcloudUrl: sets.soundcloudUrl,
          youtubePlaylist: sets.youtubePlaylist,
          featuredSets: sets.featuredSets,
        },
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const addFeaturedSet = () => {
    setSets({
      ...sets,
      featuredSets: [...sets.featuredSets, {
        title: '',
        platform: 'soundcloud',
        url: '',
        duration: '',
        date: '',
      }]
    });
  };

  const updateFeaturedSet = (index, field, value) => {
    const updated = [...sets.featuredSets];
    updated[index] = { ...updated[index], [field]: value };
    setSets({ ...sets, featuredSets: updated });
  };

  const removeFeaturedSet = (index) => {
    setSets({
      ...sets,
      featuredSets: sets.featuredSets.filter((_, i) => i !== index)
    });
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-red-600" /></div>;
  }

  return (
    <div className="max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Sets & Music</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your DJ sets and music platforms</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Changes
        </button>
      </div>

      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>}
      {success && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg text-sm">Saved!</div>}

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4 pb-2 border-b">Platform URLs</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">SoundCloud Profile URL</label>
            <input
              type="url"
              value={sets.soundcloudUrl}
              onChange={(e) => setSets({ ...sets, soundcloudUrl: e.target.value })}
              placeholder="https://soundcloud.com/your-profile"
              className="w-full px-3 py-2 border rounded-lg"
            />
            <p className="text-xs text-gray-500 mt-1">Your SoundCloud profile for fetching tracks</p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">YouTube Playlist ID</label>
            <input
              type="text"
              value={sets.youtubePlaylist}
              onChange={(e) => setSets({ ...sets, youtubePlaylist: e.target.value })}
              placeholder="PLxxxxxxxxxx"
              className="w-full px-3 py-2 border rounded-lg"
            />
            <p className="text-xs text-gray-500 mt-1">YouTube playlist ID for DJ set videos</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4 pb-2 border-b">Featured Sets</h2>
        <p className="text-sm text-gray-500 mb-4">Highlight specific sets to feature on your page</p>

        <div className="space-y-4">
          {sets.featuredSets.map((set, i) => {
            const platform = PLATFORMS.find(p => p.id === set.platform) || PLATFORMS[0];
            return (
              <div key={i} className="bg-gray-50 rounded-lg p-4">
                <div className="flex gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium mb-1">Title</label>
                        <input
                          type="text"
                          value={set.title}
                          onChange={(e) => updateFeaturedSet(i, 'title', e.target.value)}
                          placeholder="Set name"
                          className="w-full px-3 py-2 border rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Platform</label>
                        <select
                          value={set.platform}
                          onChange={(e) => updateFeaturedSet(i, 'platform', e.target.value)}
                          className="w-full px-3 py-2 border rounded-lg"
                        >
                          {PLATFORMS.map(p => (
                            <option key={p.id} value={p.id}>{p.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">URL</label>
                      <div className="flex gap-2">
                        <input
                          type="url"
                          value={set.url}
                          onChange={(e) => updateFeaturedSet(i, 'url', e.target.value)}
                          placeholder="https://..."
                          className="flex-1 px-3 py-2 border rounded-lg"
                        />
                        {set.url && (
                          <a href={set.url} target="_blank" rel="noopener noreferrer" className="px-3 py-2 border rounded-lg hover:bg-gray-100">
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium mb-1">Duration</label>
                        <input
                          type="text"
                          value={set.duration}
                          onChange={(e) => updateFeaturedSet(i, 'duration', e.target.value)}
                          placeholder="1:30:00"
                          className="w-full px-3 py-2 border rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Date</label>
                        <input
                          type="date"
                          value={set.date}
                          onChange={(e) => updateFeaturedSet(i, 'date', e.target.value)}
                          className="w-full px-3 py-2 border rounded-lg"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col justify-between">
                    <span className={`px-2 py-1 text-xs rounded ${platform.color}`}>
                      {platform.label}
                    </span>
                    <button onClick={() => removeFeaturedSet(i)} className="p-2 text-red-500 hover:bg-red-50 rounded">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          <button onClick={addFeaturedSet} className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg">
            <Plus className="w-4 h-4" /> Add Featured Set
          </button>
        </div>
      </div>
    </div>
  );
}
