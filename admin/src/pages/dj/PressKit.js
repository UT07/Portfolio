import React, { useState, useEffect } from 'react';
import { Save, Loader2, Plus, Trash2, Image as ImageIcon, GripVertical, ChevronDown, ChevronUp } from 'lucide-react';
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
    bio_short: '',
    bio_long: '',
    technical_rider: { title: '', notes: '', sections: [] },
    downloads: [],
    gallery: { title: '', subtitle: '', images: [] },
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
        const c = proj.content || {};
        // Handle gallery: API stores it as {title, subtitle, images[]} object
        const galleryData = c.gallery && typeof c.gallery === 'object' && !Array.isArray(c.gallery)
          ? c.gallery
          : { title: 'Featured Photos', subtitle: '', images: Array.isArray(c.gallery) ? c.gallery : [] };

        // Handle technical_rider: API stores as {title, notes, sections[]}
        const riderData = c.technical_rider && typeof c.technical_rider === 'object'
          ? c.technical_rider
          : { title: '', notes: '', sections: [] };

        setPressKit({
          bio_short: c.bio_short || '',
          bio_long: c.bio_long || '',
          technical_rider: {
            title: riderData.title || '',
            notes: riderData.notes || '',
            sections: Array.isArray(riderData.sections) ? riderData.sections : [],
          },
          downloads: Array.isArray(c.downloads) ? c.downloads : [],
          gallery: {
            title: galleryData.title || 'Featured Photos',
            subtitle: galleryData.subtitle || '',
            images: Array.isArray(galleryData.images) ? galleryData.images : [],
          },
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
        content: {
          bio_short: pressKit.bio_short,
          bio_long: pressKit.bio_long,
          technical_rider: pressKit.technical_rider,
          downloads: pressKit.downloads,
          gallery: pressKit.gallery,
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

  const updateField = (field, value) => {
    setPressKit({ ...pressKit, [field]: value });
  };

  // Gallery methods — gallery is {title, subtitle, images: string[]}
  const addGalleryImage = () => {
    setPressKit({
      ...pressKit,
      gallery: {
        ...pressKit.gallery,
        images: [...(pressKit.gallery.images || []), '']
      }
    });
  };

  const updateGalleryImage = (index, value) => {
    const updated = [...(pressKit.gallery.images || [])];
    updated[index] = value;
    setPressKit({
      ...pressKit,
      gallery: { ...pressKit.gallery, images: updated }
    });
  };

  const removeGalleryImage = (index) => {
    setPressKit({
      ...pressKit,
      gallery: {
        ...pressKit.gallery,
        images: (pressKit.gallery.images || []).filter((_, i) => i !== index)
      }
    });
  };

  // Technical rider section methods
  const addRiderSection = () => {
    setPressKit({
      ...pressKit,
      technical_rider: {
        ...pressKit.technical_rider,
        sections: [...(pressKit.technical_rider.sections || []), { title: '', items: [] }]
      }
    });
  };

  const updateRiderSection = (index, field, value) => {
    const updated = [...(pressKit.technical_rider.sections || [])];
    updated[index] = { ...updated[index], [field]: value };
    setPressKit({
      ...pressKit,
      technical_rider: { ...pressKit.technical_rider, sections: updated }
    });
  };

  const removeRiderSection = (index) => {
    setPressKit({
      ...pressKit,
      technical_rider: {
        ...pressKit.technical_rider,
        sections: (pressKit.technical_rider.sections || []).filter((_, i) => i !== index)
      }
    });
  };

  const addRiderItem = (sectionIndex) => {
    const sections = [...(pressKit.technical_rider.sections || [])];
    sections[sectionIndex] = {
      ...sections[sectionIndex],
      items: [...(sections[sectionIndex].items || []), '']
    };
    setPressKit({
      ...pressKit,
      technical_rider: { ...pressKit.technical_rider, sections }
    });
  };

  const updateRiderItem = (sectionIndex, itemIndex, value) => {
    const sections = [...(pressKit.technical_rider.sections || [])];
    const items = [...(sections[sectionIndex].items || [])];
    items[itemIndex] = value;
    sections[sectionIndex] = { ...sections[sectionIndex], items };
    setPressKit({
      ...pressKit,
      technical_rider: { ...pressKit.technical_rider, sections }
    });
  };

  const removeRiderItem = (sectionIndex, itemIndex) => {
    const sections = [...(pressKit.technical_rider.sections || [])];
    sections[sectionIndex] = {
      ...sections[sectionIndex],
      items: (sections[sectionIndex].items || []).filter((_, i) => i !== itemIndex)
    };
    setPressKit({
      ...pressKit,
      technical_rider: { ...pressKit.technical_rider, sections }
    });
  };

  // Downloads methods
  const addDownload = () => {
    setPressKit({
      ...pressKit,
      downloads: [...(pressKit.downloads || []), { title: '', description: '', type: 'images', placeholder: true }]
    });
  };

  const updateDownload = (index, field, value) => {
    const updated = [...(pressKit.downloads || [])];
    updated[index] = { ...updated[index], [field]: value };
    setPressKit({ ...pressKit, downloads: updated });
  };

  const removeDownload = (index) => {
    setPressKit({
      ...pressKit,
      downloads: (pressKit.downloads || []).filter((_, i) => i !== index)
    });
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-red-600" /></div>;
  }

  const CLOUDFRONT_BASE = 'https://d1q048o59d0tgk.cloudfront.net/assets';

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

      {/* Bios */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4 pb-2 border-b">Bio</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Short Bio (for social media)</label>
            <textarea
              value={pressKit.bio_short}
              onChange={(e) => updateField('bio_short', e.target.value)}
              placeholder="Brief bio for social media and quick references..."
              rows={3}
              className="w-full px-3 py-2 border rounded-lg"
            />
            <p className="text-xs text-gray-500 mt-1">{(pressKit.bio_short || '').length}/280 characters</p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Full Bio (for press releases)</label>
            <textarea
              value={pressKit.bio_long}
              onChange={(e) => updateField('bio_long', e.target.value)}
              placeholder="Complete artist biography for press releases..."
              rows={8}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* Technical Rider — structured editor */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4 pb-2 border-b">Technical Rider</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Rider Title</label>
            <input
              type="text"
              value={pressKit.technical_rider.title || ''}
              onChange={(e) => setPressKit({
                ...pressKit,
                technical_rider: { ...pressKit.technical_rider, title: e.target.value }
              })}
              placeholder="e.g., Technical Rider (Pioneer-focused)"
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Notes</label>
            <input
              type="text"
              value={pressKit.technical_rider.notes || ''}
              onChange={(e) => setPressKit({
                ...pressKit,
                technical_rider: { ...pressKit.technical_rider, notes: e.target.value }
              })}
              placeholder="e.g., Industry-standard club setup preferred."
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-3">Equipment Sections</label>
            <div className="space-y-4">
              {(pressKit.technical_rider.sections || []).map((section, si) => (
                <div key={si} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <input
                      type="text"
                      value={section.title || ''}
                      onChange={(e) => updateRiderSection(si, 'title', e.target.value)}
                      placeholder="Section name (e.g., Mixers, Players)"
                      className="flex-1 px-3 py-2 border rounded-lg font-medium"
                    />
                    <button onClick={() => removeRiderSection(si)} className="p-2 text-red-500 hover:bg-red-100 rounded">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-2 ml-4">
                    {(section.items || []).map((item, ii) => (
                      <div key={ii} className="flex gap-2 items-center">
                        <span className="text-gray-400 text-sm">•</span>
                        <input
                          type="text"
                          value={item}
                          onChange={(e) => updateRiderItem(si, ii, e.target.value)}
                          placeholder="Equipment item..."
                          className="flex-1 px-3 py-1.5 border rounded text-sm"
                        />
                        <button onClick={() => removeRiderItem(si, ii)} className="p-1 text-red-400 hover:text-red-600">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                    <button onClick={() => addRiderItem(si)} className="flex items-center gap-1 px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded">
                      <Plus className="w-3 h-3" /> Add Item
                    </button>
                  </div>
                </div>
              ))}
              <button onClick={addRiderSection} className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg">
                <Plus className="w-4 h-4" /> Add Section
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Press Gallery — gallery.images is a string[] of URLs */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4 pb-2 border-b">Press Gallery</h2>
        <div className="space-y-4 mb-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Gallery Title</label>
              <input
                type="text"
                value={pressKit.gallery.title || ''}
                onChange={(e) => setPressKit({
                  ...pressKit,
                  gallery: { ...pressKit.gallery, title: e.target.value }
                })}
                placeholder="e.g., Featured Photos"
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Gallery Subtitle</label>
              <input
                type="text"
                value={pressKit.gallery.subtitle || ''}
                onChange={(e) => setPressKit({
                  ...pressKit,
                  gallery: { ...pressKit.gallery, subtitle: e.target.value }
                })}
                placeholder="e.g., Swipe through live moments"
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
          </div>
        </div>

        <p className="text-sm text-gray-500 mb-4">
          {(pressKit.gallery.images || []).length} image(s) — URLs relative to CloudFront or full URLs
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
          {(pressKit.gallery.images || []).map((imgUrl, i) => {
            const fullUrl = imgUrl
              ? (imgUrl.startsWith('http') ? imgUrl : `${CLOUDFRONT_BASE}${imgUrl}`)
              : '';
            return (
              <div key={i} className="relative group">
                <ImagePicker
                  value={fullUrl}
                  onChange={(newUrl) => {
                    // Strip CloudFront base to store relative paths when possible
                    const relative = newUrl.startsWith(CLOUDFRONT_BASE)
                      ? newUrl.slice(CLOUDFRONT_BASE.length)
                      : newUrl;
                    updateGalleryImage(i, relative);
                  }}
                  projectId={project?.id || null}
                  label={`Image ${i + 1}`}
                />
                <button
                  onClick={() => removeGalleryImage(i)}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity z-10"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>

        <button onClick={addGalleryImage} className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg">
          <Plus className="w-4 h-4" /> Add Image
        </button>
      </div>

      {/* Downloads */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4 pb-2 border-b">Downloads</h2>
        <p className="text-sm text-gray-500 mb-4">Downloadable assets for promoters and press</p>

        <div className="space-y-3">
          {(pressKit.downloads || []).map((dl, i) => (
            <div key={i} className="flex gap-3 items-start bg-gray-50 p-3 rounded-lg">
              <div className="flex-1 space-y-2">
                <input
                  type="text"
                  value={dl.title || ''}
                  onChange={(e) => updateDownload(i, 'title', e.target.value)}
                  placeholder="Download title"
                  className="w-full px-3 py-2 border rounded-lg"
                />
                <input
                  type="text"
                  value={dl.description || ''}
                  onChange={(e) => updateDownload(i, 'description', e.target.value)}
                  placeholder="Description"
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                />
              </div>
              <select
                value={dl.type || 'images'}
                onChange={(e) => updateDownload(i, 'type', e.target.value)}
                className="px-3 py-2 border rounded-lg text-sm"
              >
                <option value="images">Images</option>
                <option value="document">Document</option>
                <option value="audio">Audio</option>
              </select>
              <label className="flex items-center gap-1 text-xs text-gray-500 cursor-pointer mt-2">
                <input
                  type="checkbox"
                  checked={dl.placeholder || false}
                  onChange={(e) => updateDownload(i, 'placeholder', e.target.checked)}
                  className="rounded"
                />
                Placeholder
              </label>
              <button onClick={() => removeDownload(i)} className="p-2 text-red-500 hover:bg-red-100 rounded mt-1">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button onClick={addDownload} className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg">
            <Plus className="w-4 h-4" /> Add Download
          </button>
        </div>
      </div>
    </div>
  );
}
