import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import api from '../../services/api';
import { useSections } from '../../contexts/SectionsContext';
import ImagePicker from '../../components/ImagePicker';
import TagInput from '../../components/TagInput';
import ClipsManager from '../../components/ClipsManager';
import { PublishToggle } from '../../components/StatusBadge';

export default function GigEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { djSectionId } = useSections();
  const isNew = !id || id === 'new';

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    event: '',
    collective: '',
    location: '',
    date: '',
    time: '',
    genre: [],
    tags: [],
    description: '',
    image: '',
    clips: [],
    is_published: false,
  });

  // Genre suggestions
  const genreSuggestions = [
    'Hard Techno', 'Hard Bounce', 'Hard Dance', 'Trance', 'Hard Groove',
    'Donk', 'Tribal', 'Makina', 'Melodic Techno', 'Indo-melodic', 'Hard Trance'
  ];

  // Tag suggestions
  const tagSuggestions = [
    'SOLD OUT', 'closing set', 'opening act', 'festival', 'rooftop',
    '240 km/h sound', 'terrace SOLD OUT', 'recorded'
  ];

  useEffect(() => {
    if (!isNew) {
      loadGig();
    }
  }, [id, isNew]);

  const loadGig = async () => {
    try {
      setLoading(true);
      const gig = await api.getProject(id);
      setFormData({
        event: gig.title || '',
        collective: gig.extra_data?.collective || '',
        location: gig.extra_data?.location || '',
        date: gig.content?.date || '',
        time: gig.content?.time || '',
        genre: gig.content?.genre || [],
        tags: gig.tags || [],
        description: gig.description || '',
        image: gig.thumbnail_url || '',
        clips: gig.content?.clips || [],
        is_published: gig.is_published || false,
      });
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.event.trim()) {
      setError('Event name is required');
      return;
    }

    if (!djSectionId) {
      setError('DJ section not found. Please refresh the page.');
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const projectData = {
        section_id: djSectionId,
        slug: isNew ? `gig-${Date.now()}` : undefined,
        title: formData.event,
        subtitle: `${formData.collective} · ${formData.location}`,
        description: formData.description,
        content: {
          date: formData.date,
          time: formData.time,
          genre: formData.genre,
          clips: formData.clips,
        },
        thumbnail_url: formData.image || null,
        tags: formData.tags,
        is_published: formData.is_published,
        extra_data: {
          type: 'gig',
          collective: formData.collective,
          location: formData.location,
        },
      };

      if (isNew) {
        await api.createProject(projectData);
      } else {
        await api.updateProject(id, projectData);
      }

      navigate('/dj/gigs');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-red-600" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate('/dj/gigs')}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">
            {isNew ? 'New Gig' : 'Edit Gig'}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {isNew ? 'Add a new DJ performance' : formData.event}
          </p>
        </div>
        <PublishToggle
          published={formData.is_published}
          onChange={(val) => setFormData({ ...formData, is_published: val })}
        />
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {isNew ? 'Create Gig' : 'Save Changes'}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>
      )}

      {/* Basic Info */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4 pb-2 border-b">Event Details</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Event Name *</label>
            <input
              type="text"
              value={formData.event}
              onChange={(e) => setFormData({ ...formData, event: e.target.value })}
              placeholder="e.g., Redline — The Horizon"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Collective / Organizer</label>
              <input
                type="text"
                value={formData.collective}
                onChange={(e) => setFormData({ ...formData, collective: e.target.value })}
                placeholder="e.g., Redline"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g., Racket Space, Dublin, Ireland"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Time Slot</label>
              <input
                type="text"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                placeholder="e.g., 1:00 AM – 2:00 AM"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Genres</label>
            <TagInput
              tags={formData.genre}
              onChange={(genre) => setFormData({ ...formData, genre })}
              placeholder="Add genres..."
              suggestions={genreSuggestions}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
            <TagInput
              tags={formData.tags}
              onChange={(tags) => setFormData({ ...formData, tags })}
              placeholder="Add tags..."
              suggestions={tagSuggestions}
            />
            <p className="text-xs text-gray-500 mt-1">e.g., SOLD OUT, closing set, festival</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the event and your set..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <ImagePicker
            label="Event Image / Poster"
            value={formData.image}
            onChange={(url) => setFormData({ ...formData, image: url })}
            projectId={isNew ? null : id}
          />
        </div>
      </div>

      {/* Clips */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4 pb-2 border-b">Video / Photo Clips</h2>
        <p className="text-sm text-gray-500 mb-4">
          Add videos and photos from the event. You can upload files or paste CloudFront URLs.
        </p>
        <ClipsManager
          clips={formData.clips}
          onChange={(clips) => setFormData({ ...formData, clips })}
          projectId={isNew ? null : id}
        />
      </div>
    </div>
  );
}
