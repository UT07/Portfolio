import React, { useState, useRef } from 'react';
import { Upload, Link, X, Image as ImageIcon } from 'lucide-react';
import api from '../services/api';

/**
 * ImagePicker - Image preview with upload or URL input options
 *
 * @param {string} value - Current image URL
 * @param {Function} onChange - Callback when URL changes
 * @param {string} projectId - Optional project ID for asset association
 * @param {string} label - Field label
 */
export default function ImagePicker({
  value,
  onChange,
  projectId = null,
  label = 'Image',
  className = '',
}) {
  const [mode, setMode] = useState('preview'); // preview, url, upload
  const [urlInput, setUrlInput] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim());
      setMode('preview');
      setUrlInput('');
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      const result = await api.uploadAsset(file, projectId);
      onChange(result.cloudfront_url);
      setMode('preview');
    } catch (err) {
      setError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleClear = () => {
    onChange('');
  };

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}

      {/* Preview Mode */}
      {mode === 'preview' && (
        <div className="space-y-2">
          {value ? (
            <div className="relative inline-block">
              <img
                src={value}
                alt="Preview"
                className="max-w-full max-h-48 rounded-lg border border-gray-200 object-cover"
                onError={(e) => {
                  e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect fill="%23f3f4f6" width="100" height="100"/><text x="50%" y="50%" fill="%239ca3af" text-anchor="middle" dy=".3em">Error</text></svg>';
                }}
              />
              <button
                type="button"
                onClick={handleClear}
                className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
              <ImageIcon className="w-8 h-8 text-gray-400" />
            </div>
          )}

          <div className="flex gap-2">
            {projectId !== null ? (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Upload className="w-4 h-4" />
                Upload
              </button>
            ) : (
              <span className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-400 border border-gray-200 rounded-lg cursor-not-allowed" title="Save first to enable upload">
                <Upload className="w-4 h-4" />
                Upload
              </span>
            )}
            <button
              type="button"
              onClick={() => {
                setMode('url');
                setUrlInput(value || '');
              }}
              className="flex items-center gap-2 px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Link className="w-4 h-4" />
              URL
            </button>
          </div>
          {projectId === null && (
            <p className="text-xs text-gray-500 mt-1">Save the entry first to enable file upload, or use a URL.</p>
          )}
        </div>
      )}

      {/* URL Mode */}
      {mode === 'url' && (
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
            <button
              type="button"
              onClick={handleUrlSubmit}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Set
            </button>
            <button
              type="button"
              onClick={() => setMode('preview')}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
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
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Upload progress */}
      {uploading && (
        <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          Uploading...
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mt-2 text-sm text-red-500">
          {error}
        </div>
      )}
    </div>
  );
}
