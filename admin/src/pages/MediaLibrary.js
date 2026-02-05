import React, { useState, useEffect, useRef } from 'react';
import { Upload, Search, Filter, Trash2, Copy, X, Image, Video, FileText, Loader2 } from 'lucide-react';
import api from '../services/api';
import ConfirmDialog from '../components/ConfirmDialog';

export default function MediaLibrary() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [filterType, setFilterType] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    loadAssets();
  }, [filterType]);

  const loadAssets = async () => {
    try {
      setLoading(true);
      const data = await api.getAssets(null, filterType || null);
      setAssets(data.items || data || []);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploading(true);
    setError(null);

    try {
      for (const file of files) {
        await api.uploadAsset(file);
      }
      loadAssets();
    } catch (err) {
      setError('Upload failed: ' + err.message);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.deleteAsset(deleteTarget.id);
      setDeleteTarget(null);
      setSelectedAsset(null);
      loadAssets();
    } catch (err) {
      alert('Delete failed: ' + err.message);
    }
  };

  const handleCopyUrl = (url) => {
    navigator.clipboard.writeText(url);
    // Could add a toast notification here
  };

  const getFileIcon = (fileType) => {
    switch (fileType) {
      case 'image': return Image;
      case 'video': return Video;
      default: return FileText;
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const filteredAssets = assets.filter(
    (a) => !searchQuery || a.filename?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Media Library</h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage uploaded images, videos, and documents
          </p>
        </div>
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {uploading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Upload className="w-4 h-4" />
          )}
          Upload Files
        </button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleUpload}
          className="hidden"
          accept="image/*,video/*,.pdf,.doc,.docx"
        />
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>
      )}

      {/* Filters */}
      <div className="flex gap-4 mb-4">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search files..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm"
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
        >
          <option value="">All Types</option>
          <option value="image">Images</option>
          <option value="video">Videos</option>
          <option value="document">Documents</option>
        </select>
      </div>

      <div className="flex-1 flex gap-6">
        {/* Asset Grid */}
        <div className="flex-1">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : filteredAssets.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <Image className="w-12 h-12 mb-2 opacity-50" />
              <p>No assets found</p>
              <p className="text-sm">Upload some files to get started</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredAssets.map((asset) => {
                const Icon = getFileIcon(asset.file_type);
                return (
                  <div
                    key={asset.id}
                    onClick={() => setSelectedAsset(asset)}
                    className={`group relative aspect-square rounded-lg border-2 overflow-hidden cursor-pointer transition-all ${
                      selectedAsset?.id === asset.id
                        ? 'border-blue-500 ring-2 ring-blue-200'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {asset.file_type === 'image' ? (
                      <img
                        src={asset.thumbnail_url || asset.cloudfront_url}
                        alt={asset.filename}
                        className="w-full h-full object-cover"
                      />
                    ) : asset.file_type === 'video' ? (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <Video className="w-12 h-12 text-gray-400" />
                      </div>
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <Icon className="w-12 h-12 text-gray-400" />
                      </div>
                    )}

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center">
                      <span className="text-white text-xs font-medium opacity-0 group-hover:opacity-100 truncate px-2">
                        {asset.filename}
                      </span>
                    </div>

                    {/* Type badge */}
                    <div className="absolute top-2 right-2">
                      <span className={`px-1.5 py-0.5 text-xs rounded ${
                        asset.file_type === 'image' ? 'bg-blue-100 text-blue-800' :
                        asset.file_type === 'video' ? 'bg-purple-100 text-purple-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {asset.file_type}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Details Panel */}
        {selectedAsset && (
          <div className="w-80 bg-white rounded-lg shadow p-4 h-fit sticky top-4">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-semibold text-lg truncate pr-2">{selectedAsset.filename}</h3>
              <button
                onClick={() => setSelectedAsset(null)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Preview */}
            <div className="mb-4 aspect-video bg-gray-100 rounded-lg overflow-hidden">
              {selectedAsset.file_type === 'image' ? (
                <img
                  src={selectedAsset.cloudfront_url}
                  alt={selectedAsset.filename}
                  className="w-full h-full object-contain"
                />
              ) : selectedAsset.file_type === 'video' ? (
                <video
                  src={selectedAsset.cloudfront_url}
                  controls
                  className="w-full h-full"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <FileText className="w-12 h-12 text-gray-400" />
                </div>
              )}
            </div>

            {/* Metadata */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Size</span>
                <span>{formatFileSize(selectedAsset.file_size)}</span>
              </div>
              {selectedAsset.width && selectedAsset.height && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Dimensions</span>
                  <span>{selectedAsset.width} × {selectedAsset.height}</span>
                </div>
              )}
              {selectedAsset.duration && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Duration</span>
                  <span>{selectedAsset.duration}s</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-500">Type</span>
                <span>{selectedAsset.mime_type}</span>
              </div>
            </div>

            {/* URL */}
            <div className="mt-4 p-2 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-gray-500">CloudFront URL</span>
                <button
                  onClick={() => handleCopyUrl(selectedAsset.cloudfront_url)}
                  className="text-blue-600 hover:text-blue-800 text-xs flex items-center gap-1"
                >
                  <Copy className="w-3 h-3" />
                  Copy
                </button>
              </div>
              <p className="text-xs text-gray-700 break-all">{selectedAsset.cloudfront_url}</p>
            </div>

            {/* Actions */}
            <div className="mt-4 flex gap-2">
              <a
                href={selectedAsset.cloudfront_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 px-3 py-2 text-sm text-center border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Open
              </a>
              <button
                onClick={() => setDeleteTarget(selectedAsset)}
                className="px-3 py-2 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete confirmation */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Asset"
        message={`Are you sure you want to delete "${deleteTarget?.filename}"? This will also remove it from S3.`}
        confirmLabel="Delete"
        variant="danger"
      />
    </div>
  );
}
