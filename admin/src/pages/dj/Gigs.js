import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, Eye, EyeOff, Calendar, MapPin, Music, Video, Loader2 } from 'lucide-react';
import api from '../../services/api';
import ConfirmDialog from '../../components/ConfirmDialog';
import StatusBadge from '../../components/StatusBadge';

export default function Gigs() {
  const navigate = useNavigate();
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Filters
  const [filterCollective, setFilterCollective] = useState('');
  const [filterGenre, setFilterGenre] = useState('');
  const [sortOrder, setSortOrder] = useState('desc'); // desc = newest first

  useEffect(() => {
    loadGigs();
  }, []);

  const loadGigs = async () => {
    try {
      setLoading(true);
      const projects = await api.getProjectsBySectionSlug('dj', false);
      const items = projects.items || [];

      // Filter to gigs only
      const gigItems = items.filter((p) => p.extra_data?.type === 'gig' || p.slug.startsWith('gig-'));

      // Deduplicate gigs by title + date (DB may have duplicate records)
      const seen = new Map();
      const dedupedGigs = [];
      gigItems.forEach(gig => {
        const key = `${gig.title}__${gig.content?.date || ''}`;
        const existing = seen.get(key);
        if (!existing) {
          seen.set(key, gig);
          dedupedGigs.push(gig);
        } else {
          // Keep the one with more clips/data
          const existingClips = existing.content?.clips?.length || 0;
          const currentClips = gig.content?.clips?.length || 0;
          if (currentClips > existingClips) {
            const idx = dedupedGigs.indexOf(existing);
            dedupedGigs[idx] = gig;
            seen.set(key, gig);
          }
        }
      });
      setGigs(dedupedGigs);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.deleteProject(deleteTarget.id);
      setDeleteTarget(null);
      loadGigs();
    } catch (err) {
      alert('Failed to delete gig: ' + err.message);
    }
  };

  const handleTogglePublish = async (gig) => {
    try {
      if (gig.is_published) {
        await api.unpublishProject(gig.id);
      } else {
        await api.publishProject(gig.id);
      }
      loadGigs();
    } catch (err) {
      alert('Failed to update gig: ' + err.message);
    }
  };

  // Get unique values for filters
  const collectives = [...new Set(gigs.map((g) => g.extra_data?.collective).filter(Boolean))];
  const genres = [...new Set(gigs.flatMap((g) => g.content?.genre || []))];

  // Apply filters and sort
  const filteredGigs = gigs
    .filter((g) => !filterCollective || g.extra_data?.collective === filterCollective)
    .filter((g) => !filterGenre || (g.content?.genre || []).includes(filterGenre))
    .sort((a, b) => {
      const dateA = new Date(a.content?.date || 0);
      const dateB = new Date(b.content?.date || 0);
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-red-600" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Gigs</h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage DJ performances and events
          </p>
        </div>
        <Link
          to="/dj/gigs/new"
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          <Plus className="w-4 h-4" />
          Add Gig
        </Link>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>
      )}

      {/* Filters */}
      <div className="flex gap-4 mb-4">
        <select
          value={filterCollective}
          onChange={(e) => setFilterCollective(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
        >
          <option value="">All Collectives</option>
          {collectives.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <select
          value={filterGenre}
          onChange={(e) => setFilterGenre(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
        >
          <option value="">All Genres</option>
          {genres.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
        >
          <option value="desc">Newest First</option>
          <option value="asc">Oldest First</option>
        </select>
      </div>

      {/* Gigs table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Event
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Collective
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Date
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Location
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Genres
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Clips
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredGigs.map((gig) => (
              <tr key={gig.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {gig.thumbnail_url && (
                      <img
                        src={gig.thumbnail_url}
                        alt=""
                        className="w-10 h-10 rounded object-cover"
                      />
                    )}
                    <div>
                      <div className="font-medium text-gray-900">{gig.title}</div>
                      {gig.tags?.length > 0 && (
                        <div className="flex gap-1 mt-0.5">
                          {gig.tags.slice(0, 2).map((tag) => (
                            <span key={tag} className="text-xs bg-red-100 text-red-800 px-1.5 py-0.5 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {gig.extra_data?.collective || '-'}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {gig.content?.date || '-'}
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {gig.extra_data?.location || '-'}
                  </div>
                </td>
                <td className="px-4 py-3 text-sm">
                  <div className="flex flex-wrap gap-1">
                    {(gig.content?.genre || []).slice(0, 2).map((g) => (
                      <span key={g} className="text-xs bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded">
                        {g}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Video className="w-3 h-3" />
                    {(gig.content?.clips || []).length}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={gig.is_published ? 'published' : 'draft'} />
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleTogglePublish(gig)}
                      className="p-1.5 hover:bg-gray-100 rounded"
                      title={gig.is_published ? 'Unpublish' : 'Publish'}
                    >
                      {gig.is_published ? (
                        <EyeOff className="w-4 h-4 text-gray-500" />
                      ) : (
                        <Eye className="w-4 h-4 text-gray-500" />
                      )}
                    </button>
                    <Link
                      to={`/dj/gigs/${gig.id}`}
                      className="p-1.5 hover:bg-gray-100 rounded"
                    >
                      <Edit2 className="w-4 h-4 text-blue-600" />
                    </Link>
                    <button
                      onClick={() => setDeleteTarget(gig)}
                      className="p-1.5 hover:bg-gray-100 rounded"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredGigs.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No gigs found. Create one to get started.
          </div>
        )}
      </div>

      {/* Delete confirmation */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Gig"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
      />
    </div>
  );
}
