import React, { useState, useEffect } from 'react';
import { Save, Loader2 } from 'lucide-react';
import api from '../../services/api';
import ImagePicker from '../../components/ImagePicker';
import CTAEditor from '../../components/CTAEditor';
import DynamicList, { TextareaListItem } from '../../components/DynamicList';

export default function TechHero() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Hero data
  const [heroProject, setHeroProject] = useState(null);
  const [hero, setHero] = useState({
    name: '',
    title: '',
    headline: '',
    subtext: '',
    headshot: '',
    ctas: [],
  });

  // About data
  const [aboutProject, setAboutProject] = useState(null);
  const [about, setAbout] = useState({
    title: '',
    paragraphs: [],
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const projects = await api.getProjectsBySectionSlug('tech', false);
      const items = projects.items || [];

      // Find hero project
      const heroProj = items.find((p) => p.slug === 'hero');
      if (heroProj) {
        setHeroProject(heroProj);
        setHero({
          name: heroProj.title || '',
          title: heroProj.subtitle || '',
          headline: heroProj.description || '',
          subtext: heroProj.content?.subtext || '',
          headshot: heroProj.thumbnail_url || '',
          ctas: heroProj.content?.ctas || [],
        });
      }

      // Find about project
      const aboutProj = items.find((p) => p.slug === 'about');
      if (aboutProj) {
        setAboutProject(aboutProj);
        setAbout({
          title: aboutProj.title || '',
          paragraphs: aboutProj.content?.paragraphs || [],
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
          subtitle: hero.title,
          description: hero.headline,
          content: {
            subtext: hero.subtext,
            ctas: hero.ctas,
          },
          thumbnail_url: hero.headshot,
        });
      }

      // Save about
      if (aboutProject) {
        await api.updateProject(aboutProject.id, {
          title: about.title,
          content: {
            paragraphs: about.paragraphs,
          },
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
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Hero & About</h1>
          <p className="text-gray-500 text-sm mt-1">
            Edit the main landing section for Tech/Professional mode
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
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
        <h2 className="text-lg font-semibold mb-4 pb-2 border-b">Hero Section</h2>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={hero.name}
                onChange={(e) => setHero({ ...hero, name: e.target.value })}
                placeholder="e.g., Utkarsh Singh"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
              <input
                type="text"
                value={hero.title}
                onChange={(e) => setHero({ ...hero, title: e.target.value })}
                placeholder="e.g., Cloud + Systems Engineer"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Headline</label>
            <input
              type="text"
              value={hero.headline}
              onChange={(e) => setHero({ ...hero, headline: e.target.value })}
              placeholder="e.g., Cloud + Systems Engineer building reliable platforms..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subtext</label>
            <textarea
              value={hero.subtext}
              onChange={(e) => setHero({ ...hero, subtext: e.target.value })}
              placeholder="Additional context about your work and focus areas..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <ImagePicker
            label="Headshot Photo"
            value={hero.headshot}
            onChange={(url) => setHero({ ...hero, headshot: url })}
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

      {/* About Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4 pb-2 border-b">About Section</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Section Title</label>
            <input
              type="text"
              value={about.title}
              onChange={(e) => setAbout({ ...about, title: e.target.value })}
              placeholder="e.g., About"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bio Paragraphs
            </label>
            <DynamicList
              items={about.paragraphs}
              onChange={(paragraphs) => setAbout({ ...about, paragraphs })}
              renderItem={(item, index, onChange) => (
                <TextareaListItem
                  value={item}
                  onChange={onChange}
                  placeholder="Write a paragraph about yourself..."
                  rows={3}
                />
              )}
              createItem={() => ''}
              addLabel="Add Paragraph"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
