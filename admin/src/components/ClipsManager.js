import React, { useState, useRef } from 'react';
import { Plus, Trash2, Upload, Link, Play, Image as ImageIcon, ChevronUp, ChevronDown, X } from 'lucide-react';
import api from '../services/api';

/**
 * ClipsManager - Manage video/image clips for gigs
 *
 * @param {Array} clips - Array of clip objects [{type: 'video'|'image', url: string}]
 * @param {Function} onChange - Callback when clips change
 * @param {string} projectId - Optional project ID for asset association
 */
export default function ClipsManager({ clips = [], onChange, projectId = null, className = '' }) {
  const [uploading, setUploading] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [showUrlForm, setShowUrlForm] = useState(false);
  const [urlType, setUrlType] = useState('video');
  const fileInputRef = useRef(null);

  const handleAddUrl = () => {
    if (!urlInput.trim()) return;
    onChange([...clips, { type: urlType, url: urlInput.trim() }]);
    setUrlInput('');
    setShowUrlForm(false);
  };

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploading(true);
    try {
      for (const file of files) {
        const result = await api.uploadAsset(file, projectId);
        const type = file.type.startsWith('video/') ? 'video' : 'image';
        onChange([...clips, { type, url: result.cloudfront_url }]);
      }
    } catch (err) {
      alert('Upload failed: ' + err.message);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemove = (index) => {
    onChange(clips.filter((_, i) => i !== index));
  };

  const handleMoveUp = (index) => {
    if (index === 0) return;
    const newClips = [...clips];
    [newClips[index - 1], newClips[index]] = [newClips[index], newClips[index - 1]];
    onChange(newClips);
  };

  const handleMoveDown = (index) => {
    if (index === clips.length - 1) return;
    const newClips = [...clips];
    [newClips[index], newClips[index + 1]] = [newClips[index + 1], newClips[index]];
    onChange(newClips);
  };

  return (
    <div className={className}>
      {/* Clip grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
        {clips.map((clip, index) => (
          <div key={index} className="relative group">
            <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
              {clip.type === 'video' ? (
                <div className="relative w-full h-full">
                  <video
                    src={clip.url}
                    className="w-full h-full object-cover"
                    muted
                    onMouseEnter={(e) => e.target.play()}
                    onMouseLeave={(e) => {
                      e.target.pause();
                      e.target.currentTime = 0;
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 group-hover:bg-opacity-10 transition-colors pointer-events-none">
                    <Play className="w-8 h-8 text-white opacity-80" />
                  </div>
                </div>
              ) : (
                <img
                  src={clip.url}
                  alt={`Clip ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect fill="%23f3f4f6" width="100" height="100"/><text x="50%" y="50%" fill="%239ca3af" text-anchor="middle" dy=".3em">Error</text></svg>';
                  }}
                />
              )}
            </div>

            {/* Controls overlay */}
            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                type="button"
                onClick={() => handleMoveUp(index)}
                disabled={index === 0}
                className="p-1 bg-white rounded shadow hover:bg-gray-100 disabled:opacity-30"
              >
                <ChevronUp className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => handleMoveDown(index)}
                disabled={index === clips.length - 1}
                className="p-1 bg-white rounded shadow hover:bg-gray-100 disabled:opacity-30"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="p-1 bg-red-500 text-white rounded shadow hover:bg-red-600"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Type badge */}
            <div className="absolute bottom-2 left-2">
              <span className={`px-2 py-0.5 text-xs rounded ${
                clip.type === 'video' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
              }`}>
                {clip.type}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Add buttons */}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
        >
          <Upload className="w-4 h-4" />
          {uploading ? 'Uploading...' : 'Upload Media'}
        </button>

        <button
          type="button"
          onClick={() => setShowUrlForm(!showUrlForm)}
          className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          <Link className="w-4 h-4" />
          Add URL
        </button>
      </div>

      {/* URL form */}
      {showUrlForm && (
        <div className="mt-3 p-3 border border-gray-200 rounded-lg bg-gray-50">
          <div className="flex gap-2 mb-2">
            <select
              value={urlType}
              onChange={(e) => setUrlType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="video">Video</option>
              <option value="image">Image</option>
            </select>
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleAddUrl}
              className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
            >
              Add Clip
            </button>
            <button
              type="button"
              onClick={() => {
                setShowUrlForm(false);
                setUrlInput('');
              }}
              className="px-4 py-2 border border-gray-300 text-sm rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        multiple
        onChange={handleUpload}
        className="hidden"
      />
    </div>
  );
}
