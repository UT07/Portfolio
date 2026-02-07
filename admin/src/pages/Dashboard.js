import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Monitor, Disc3, Image, Calendar, FileText, Eye, ArrowRight } from 'lucide-react';
import api from '../services/api';

function Dashboard() {
  const [stats, setStats] = useState({
    techProjects: 0,
    djGigs: 0,
    assets: 0,
    publishedGigs: 0,
  });
  const [recentGigs, setRecentGigs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [techProjects, djProjects, assets] = await Promise.all([
        api.getProjectsBySectionSlug('tech', false),
        api.getProjectsBySectionSlug('dj', false),
        api.getAssets(),
      ]);

      const techItems = techProjects.items || [];
      const djItems = djProjects.items || [];
      const gigs = djItems.filter(p => p.extra_data?.type === 'gig');

      setStats({
        techProjects: techItems.filter(p => p.extra_data?.type === 'featured_project').length,
        djGigs: gigs.length,
        assets: assets.items?.length || assets.length || 0,
        publishedGigs: gigs.filter(g => g.is_published).length,
      });

      setRecentGigs(
        gigs
          .sort((a, b) => new Date(b.content?.date || 0) - new Date(a.content?.date || 0))
          .slice(0, 5)
      );
    } catch (err) {
      console.error('Failed to load stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Monitor className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Featured Projects</p>
              <p className="text-2xl font-bold">{stats.techProjects}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-100 rounded-lg">
              <Calendar className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">DJ Gigs</p>
              <p className="text-2xl font-bold">{stats.djGigs}</p>
              <p className="text-xs text-gray-400">{stats.publishedGigs} published</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <Image className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Media Assets</p>
              <p className="text-2xl font-bold">{stats.assets}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <a
            href="http://localhost:3000"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 hover:opacity-80"
          >
            <div className="p-3 bg-purple-100 rounded-lg">
              <Eye className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">View Site</p>
              <p className="text-sm text-blue-600 underline">localhost:3000</p>
            </div>
          </a>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Tech Mode Quick Actions */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow p-6 border border-blue-200">
          <div className="flex items-center gap-2 mb-4">
            <Monitor className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-blue-900">Tech Mode</h2>
          </div>
          <div className="space-y-2">
            <Link
              to="/tech/hero"
              className="flex items-center justify-between px-4 py-2 bg-white rounded-lg hover:bg-blue-50 border border-blue-200 text-sm"
            >
              <span>Edit Hero & About</span>
              <ArrowRight className="w-4 h-4 text-gray-400" />
            </Link>
            <Link
              to="/tech/projects/new"
              className="flex items-center justify-between px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
            >
              <span>Add Featured Project</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/tech/skills"
              className="flex items-center justify-between px-4 py-2 bg-white rounded-lg hover:bg-blue-50 border border-blue-200 text-sm"
            >
              <span>Manage Skills</span>
              <ArrowRight className="w-4 h-4 text-gray-400" />
            </Link>
          </div>
        </div>

        {/* DJ Mode Quick Actions */}
        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg shadow p-6 border border-red-200">
          <div className="flex items-center gap-2 mb-4">
            <Disc3 className="w-5 h-5 text-red-600" />
            <h2 className="text-lg font-semibold text-red-900">DJ Mode</h2>
          </div>
          <div className="space-y-2">
            <Link
              to="/dj/hero"
              className="flex items-center justify-between px-4 py-2 bg-white rounded-lg hover:bg-red-50 border border-red-200 text-sm"
            >
              <span>Edit Hero & Artist</span>
              <ArrowRight className="w-4 h-4 text-gray-400" />
            </Link>
            <Link
              to="/dj/gigs/new"
              className="flex items-center justify-between px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
            >
              <span>Add New Gig</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/dj/sets"
              className="flex items-center justify-between px-4 py-2 bg-white rounded-lg hover:bg-red-50 border border-red-200 text-sm"
            >
              <span>Manage Sets</span>
              <ArrowRight className="w-4 h-4 text-gray-400" />
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Gigs */}
      {recentGigs.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Recent Gigs</h2>
            <Link to="/dj/gigs" className="text-sm text-blue-600 hover:underline">
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {recentGigs.map((gig) => (
              <Link
                key={gig.id}
                to={`/dj/gigs/${gig.id}`}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
              >
                <div>
                  <div className="font-medium">{gig.title}</div>
                  <div className="text-sm text-gray-500">
                    {gig.extra_data?.collective} · {gig.content?.date}
                  </div>
                </div>
                <span
                  className={`px-2 py-1 text-xs rounded ${
                    gig.is_published
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {gig.is_published ? 'Published' : 'Draft'}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
