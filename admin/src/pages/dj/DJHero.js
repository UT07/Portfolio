import React, { useState, useEffect } from 'react';
import { Save, Loader2 } from 'lucide-react';
import api from '../../services/api';
import ImagePicker from '../../components/ImagePicker';
import CTAEditor from '../../components/CTAEditor';
import DynamicList, { SimpleListItem } from '../../components/DynamicList';

export default function DJHero() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Hero data
  const [heroProject, setHeroProject] = useState(null);
  const [hero, setHero] = useState({
    name: '',
    badge: '',
    headline: '',
    subheadline: '',
    genres: '',
    heroImage: '',
    ctas: [],
  });

  // Artist data
  const [artistProject, setArtistProject] = useState(null);
  const [artist, setArtist] = useState({
    tagline: '',
    bio: '',
    highlights: [],
    artistImage: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const projects = await api.getProjectsBySectionSlug('dj', false);
      const items = projects.items || [];

      // Find hero project
      const heroProj = items.find((p) => p.slug === 'hero');
      if (heroProj) {
        setHeroProject(heroProj);
        setHero({
          name: heroProj.title || '',
          badge: heroProj.subtitle || '',
          headline: heroProj.description || '',
          subheadline: heroProj.content?.subheadline || '',
          genres: heroProj.content?.genres || '',
          heroImage: heroProj.thumbnail_url || '',
          ctas: heroProj.content?.ctas || [],
        });
      }

      // Find artist project
      const artistProj = items.find((p) => p.slug === 'artist');
      if (artistProj) {
        setArtistProject(artistProj);
        setArtist({
          tagline: artistProj.subtitle || '',
          bio: artistProj.description || '',
          highlights: artistProj.content?.highlights || [],
          artistImage: artistProj.thumbnail_url || '',
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
    try {
      setSaving(true);
      setError(null);
      setSuccess(false);

      // Save hero
      if (heroProject) {
        await api.updateProject(heroProject.id, {
          title: hero.name,
          subtitle: hero.badge,
          description: hero.headline,
          content: {
            subheadline: hero.subheadline,
            genres: hero.genres,
            ctas: hero.ctas,
          },
          thumbnail_url: hero.heroImage,
        });
      }

      // Save artist
      if (artistProject) {
        await api.updateProject(artistProject.id, {
          subtitle: artist.tagline,
          description: artist.bio,
          content: {
            highlights: artist.highlights,
          },
          thumbnail_url: artist.artistImage,
        });
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
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
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Hero & Artist</h1>
          <p className="text-gray-500 text-sm mt-1">
            Edit the main landing section for DJ mode
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Changes
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg text-sm">
          Changes saved successfully!
        </div>
      )}

      {/* Hero Section */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4 pb-2 border-b text-red-600">DJ Hero</h2>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">DJ Name</label>
              <input
                type="text"
                value={hero.name}
                onChange={(e) => setHero({ ...hero, name: e.target.value })}
                placeholder="e.g., UT"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Badge / Location</label>
              <input
                type="text"
                value={hero.badge}
                onChange={(e) => setHero({ ...hero, badge: e.target.value })}
                placeholder="e.g., DJ (Dublin)"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Headline</label>
            <input
              type="text"
              value={hero.headline}
              onChange={(e) => setHero({ ...hero, headline: e.target.value })}
              placeholder="Your main tagline..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subheadline</label>
            <textarea
              value={hero.subheadline}
              onChange={(e) => setHero({ ...hero, subheadline: e.target.value })}
              placeholder="Describe your sound and style..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Genres</label>
            <input
              type="text"
              value={hero.genres}
              onChange={(e) => setHero({ ...hero, genres: e.target.value })}
              placeholder="e.g., Hard Bounce · Hard Techno · Trance"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <p className="text-xs text-gray-500 mt-1">Separate genres with · or commas</p>
          </div>

          <ImagePicker
            label="Hero Image"
            value={hero.heroImage}
            onChange={(url) => setHero({ ...hero, heroImage: url })}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Call-to-Action Buttons
            </label>
            <CTAEditor
              ctas={hero.ctas}
              onChange={(ctas) => setHero({ ...hero, ctas })}
            />
          </div>
        </div>
      </div>

      {/* Artist Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4 pb-2 border-b text-red-600">Artist Bio</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tagline</label>
            <input
              type="text"
              value={artist.tagline}
              onChange={(e) => setArtist({ ...artist, tagline: e.target.value })}
              placeholder="e.g., Raised in India, shaping Dublin's dancefloors"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
            <textarea
              value={artist.bio}
              onChange={(e) => setArtist({ ...artist, bio: e.target.value })}
              placeholder="Tell your story... Use double line breaks for paragraphs."
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <p className="text-xs text-gray-500 mt-1">Use \n\n for paragraph breaks</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Highlights</label>
            <DynamicList
              items={artist.highlights}
              onChange={(highlights) => setArtist({ ...artist, highlights })}
              renderItem={(item, index, onChange) => (
                <SimpleListItem
                  value={item}
                  onChange={onChange}
                  placeholder="e.g., Typical tempo: 155–180 BPM"
                />
              )}
              createItem={() => ''}
              addLabel="Add Highlight"
            />
          </div>

          <ImagePicker
            label="Artist Photo"
            value={artist.artistImage}
            onChange={(url) => setArtist({ ...artist, artistImage: url })}
          />
        </div>
      </div>
    </div>
  );
}
