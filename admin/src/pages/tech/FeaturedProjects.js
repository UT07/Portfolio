import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Loader2, Edit, Trash2, Eye, EyeOff, ExternalLink } from 'lucide-react';
import api from '../../services/api';
import { StatusBadge } from '../../components/StatusBadge';
import ConfirmDialog from '../../components/ConfirmDialog';

export default function FeaturedProjects() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [projects, setProjects] = useState([]);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await api.getProjectsByType('tech', 'featured');
      setProjects(data.sort((a, b) => a.display_order - b.display_order));
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePublish = async (project) => {
    try {
      await api.updateProject(project.id, { is_published: !project.is_published });
      loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.deleteProject(deleteTarget.id);
      setDeleteTarget(null);
      loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>;
  }

  return (
    <div className="max-w-5xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Featured Projects</h1>
          <p className="text-gray-500 text-sm mt-1">Showcase your best work</p>
        </div>
        <Link to="/tech/projects/new" className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Plus className="w-4 h-4" /> Add Project
        </Link>
      </div>

      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>}

      {projects.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
          <p>No featured projects yet.</p>
          <Link to="/tech/projects/new" className="text-blue-600 hover:underline mt-2 inline-block">Create your first project</Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Project</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tech</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {projects.map((project) => (
                <tr key={project.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {project.thumbnail_url ? (
                        <img src={project.thumbnail_url} alt="" className="w-12 h-12 rounded object-cover" />
                      ) : (
                        <div className="w-12 h-12 rounded bg-gray-100 flex items-center justify-center text-gray-400">
                          <Edit className="w-5 h-5" />
                        </div>
                      )}
                      <div>
                        <div className="font-medium">{project.title}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">{project.subtitle}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {(project.tags || []).slice(0, 3).map((tag, i) => (
                        <span key={i} className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded">{tag}</span>
                      ))}
                      {(project.tags || []).length > 3 && (
                        <span className="text-xs text-gray-500">+{project.tags.length - 3}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge published={project.is_published} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      {project.content?.github && (
                        <a href={project.content.github} target="_blank" rel="noopener noreferrer" className="p-2 text-gray-500 hover:bg-gray-100 rounded" title="GitHub">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                      <button onClick={() => handleTogglePublish(project)} className="p-2 text-gray-500 hover:bg-gray-100 rounded" title={project.is_published ? 'Unpublish' : 'Publish'}>
                        {project.is_published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      <Link to={`/tech/projects/${project.id}`} className="p-2 text-blue-600 hover:bg-blue-50 rounded" title="Edit">
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button onClick={() => setDeleteTarget(project)} className="p-2 text-red-500 hover:bg-red-50 rounded" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Project"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
      />
    </div>
  );
}
