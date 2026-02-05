import React, { useState, useEffect } from 'react';
import { Save, Loader2, Plus, Trash2, Image as ImageIcon } from 'lucide-react';
import api from '../../services/api';
import ImagePicker from '../../components/ImagePicker';
import DynamicList, { SimpleListItem } from '../../components/DynamicList';

export default function PressKit() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [project, setProject] = useState(null);
  const [pressKit, setPressKit] = useState({
    bio: '',
    shortBio: '',
    technicalRider: '',
    genres: [],
    gallery: [],
    downloadableAssets: [],
  });

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const projects = await api.getProjectsBySectionSlug('dj', false);
      const items = projects.items || [];
      const proj = items.find((p) => p.slug === 'press-kit');
      if (proj) {
        setProject(proj);
        setPressKit({
          bio: proj.content?.bio || '',
          shortBio: proj.content?.shortBio || '',
          technicalRider: proj.content?.technicalRider || '',
          genres: proj.content?.genres || [],
          gallery: proj.content?.gallery || [],
          downloadableAssets: proj.content?.downloadableAssets || [],
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
        content: pressKit,
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
    setPressKit({ ...pressKit, [field]: value });
  };

  const addGalleryImage = () => {
    setPressKit({
      ...pressKit,
      gallery: [...pressKit.gallery, { url: '', caption: '' }]
    });
  };

  const updateGalleryImage = (index, field, value) => {
    const updated = [...pressKit.gallery];
    updated[index] = { ...updated[index], [field]: value };
    setPressKit({ ...pressKit, gallery: updated });
  };

  const removeGalleryImage = (index) => {
    setPressKit({
      ...pressKit,
      gallery: pressKit.gallery.filter((_, i) => i !== index)
    });
  };

  const addDownloadable = () => {
    setPressKit({
      ...pressKit,
      downloadableAssets: [...pressKit.downloadableAssets, { name: '', url: '', type: 'image' }]
    });
  };

  const updateDownloadable = (index, field, value) => {
    const updated = [...pressKit.downloadableAssets];
    updated[index] = { ...updated[index], [field]: value };
    setPressKit({ ...pressKit, downloadableAssets: updated });
  };

  const removeDownloadable = (index) => {
    setPressKit({
      ...pressKit,
      downloadableAssets: pressKit.downloadableAssets.filter((_, i) => i !== index)
    });
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-red-600" /></div>;
  }

  return (
    <div className="max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Press Kit</h1>
          <p className="text-gray-500 text-sm mt-1">Professional assets for promoters and press</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Changes
        </button>
      </div>

      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>}
      {success && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg text-sm">Saved!</div>}

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4 pb-2 border-b">Bio</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Short Bio (for social media)</label>
            <textarea
              value={pressKit.shortBio}
              onChange={(e) => updateField('shortBio', e.target.value)}
              placeholder="Brief bio for social media and quick references..."
              rows={2}
              className="w-full px-3 py-2 border rounded-lg"
            />
            <p className="text-xs text-gray-500 mt-1">{pressKit.shortBio.length}/280 characters</p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Full Bio</label>
            <textarea
              value={pressKit.bio}
              onChange={(e) => updateField('bio', e.target.value)}
              placeholder="Complete artist biography for press releases..."
              rows={6}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4 pb-2 border-b">Genres</h2>
        <DynamicList
          items={pressKit.genres}
          onChange={(genres) => updateField('genres', genres)}
          renderItem={(item, idx, onChange) => <SimpleListItem value={item} onChange={onChange} placeholder="Genre name..." />}
          createItem={() => ''}
          addLabel="Add Genre"
        />
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4 pb-2 border-b">Technical Rider</h2>
        <div>
          <label className="block text-sm font-medium mb-1">Equipment Requirements</label>
          <textarea
            value={pressKit.technicalRider}
            onChange={(e) => updateField('technicalRider', e.target.value)}
            placeholder="List your technical requirements..."
            rows={6}
            className="w-full px-3 py-2 border rounded-lg font-mono text-sm"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4 pb-2 border-b">Press Gallery</h2>
        <p className="text-sm text-gray-500 mb-4">High-quality photos for promotional use</p>

        <div className="grid grid-cols-2 gap-4 mb-4">
          {pressKit.gallery.map((img, i) => (
            <div key={i} className="relative group">
              <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                {img.url ? (
                  <img src={img.url} alt={img.caption} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <ImageIcon className="w-12 h-12" />
                  </div>
                )}
              </div>
              <div className="mt-2 space-y-2">
                <input
                  type="url"
                  value={img.url}
                  onChange={(e) => updateGalleryImage(i, 'url', e.target.value)}
                  placeholder="Image URL"
                  className="w-full px-2 py-1 text-sm border rounded"
                />
                <input
                  type="text"
                  value={img.caption}
                  onChange={(e) => updateGalleryImage(i, 'caption', e.target.value)}
                  placeholder="Caption"
                  className="w-full px-2 py-1 text-sm border rounded"
                />
              </div>
              <button
                onClick={() => removeGalleryImage(i)}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        <button onClick={addGalleryImage} className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg">
          <Plus className="w-4 h-4" /> Add Image
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4 pb-2 border-b">Downloadable Assets</h2>
        <p className="text-sm text-gray-500 mb-4">Logos, press photos, and other downloadable files</p>

        <div className="space-y-3">
          {pressKit.downloadableAssets.map((asset, i) => (
            <div key={i} className="flex gap-3 items-center bg-gray-50 p-3 rounded-lg">
              <input
                type="text"
                value={asset.name}
                onChange={(e) => updateDownloadable(i, 'name', e.target.value)}
                placeholder="Asset name"
                className="flex-1 px-3 py-2 border rounded-lg"
              />
              <select
                value={asset.type}
                onChange={(e) => updateDownloadable(i, 'type', e.target.value)}
                className="px-3 py-2 border rounded-lg"
              >
                <option value="image">Image</option>
                <option value="logo">Logo</option>
                <option value="document">Document</option>
                <option value="audio">Audio</option>
              </select>
              <input
                type="url"
                value={asset.url}
                onChange={(e) => updateDownloadable(i, 'url', e.target.value)}
                placeholder="Download URL"
                className="flex-1 px-3 py-2 border rounded-lg"
              />
              <button onClick={() => removeDownloadable(i)} className="p-2 text-red-500 hover:bg-red-100 rounded">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button onClick={addDownloadable} className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg">
            <Plus className="w-4 h-4" /> Add Asset
          </button>
        </div>
      </div>
    </div>
  );
}
