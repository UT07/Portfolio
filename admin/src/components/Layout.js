import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  LogOut,
  User,
  FileText,
  Briefcase,
  GraduationCap,
  Code,
  Award,
  Mail,
  Sparkles,
  Music,
  Mic2,
  Calendar,
  Radio,
  Newspaper,
  Image,
  ChevronDown,
  ChevronRight,
  Monitor,
  Disc3,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

function Layout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState({
    tech: true,
    dj: true,
  });

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const isActive = (path) => location.pathname === path;
  const isActivePrefix = (prefix) => location.pathname.startsWith(prefix);

  const NavItem = ({ to, icon: Icon, children, indent = false }) => (
    <Link
      to={to}
      className={`flex items-center gap-3 px-4 py-2 text-sm transition-colors ${
        indent ? 'pl-10' : ''
      } ${
        isActive(to)
          ? 'bg-white/10 text-white font-medium'
          : 'text-gray-400 hover:text-white hover:bg-white/5'
      }`}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {children}
    </Link>
  );

  const SectionHeader = ({ section, icon: Icon, label, color }) => (
    <button
      onClick={() => toggleSection(section)}
      className={`w-full flex items-center gap-3 px-4 py-2 text-xs font-semibold uppercase tracking-wider ${color} hover:bg-white/5`}
    >
      <Icon className="w-4 h-4" />
      {label}
      {expandedSections[section] ? (
        <ChevronDown className="w-3 h-3 ml-auto" />
      ) : (
        <ChevronRight className="w-3 h-3 ml-auto" />
      )}
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-gray-900 text-white overflow-y-auto">
        <div className="p-4 border-b border-gray-800">
          <h1 className="text-lg font-bold">Portfolio Admin</h1>
          <p className="text-xs text-gray-400 mt-1 truncate">{user?.email}</p>
        </div>

        <nav className="py-2">
          {/* Dashboard */}
          <NavItem to="/" icon={LayoutDashboard}>
            Dashboard
          </NavItem>

          <div className="h-px bg-gray-800 my-2" />

          {/* Tech Mode */}
          <SectionHeader
            section="tech"
            icon={Monitor}
            label="Tech Mode"
            color="text-blue-400"
          />
          {expandedSections.tech && (
            <div className="pb-2">
              <NavItem to="/tech/hero" icon={User} indent>
                Hero & About
              </NavItem>
              <NavItem to="/tech/highlights" icon={Sparkles} indent>
                Highlights
              </NavItem>
              <NavItem to="/tech/education" icon={GraduationCap} indent>
                Education
              </NavItem>
              <NavItem to="/tech/experience" icon={Briefcase} indent>
                Experience
              </NavItem>
              <NavItem to="/tech/skills" icon={Code} indent>
                Skills / Tech Stack
              </NavItem>
              <NavItem to="/tech/projects" icon={FileText} indent>
                Featured Projects
              </NavItem>
              <NavItem to="/tech/github" icon={Code} indent>
                GitHub Projects
              </NavItem>
              <NavItem to="/tech/certifications" icon={Award} indent>
                Certifications
              </NavItem>
              <NavItem to="/tech/contact" icon={Mail} indent>
                Contact
              </NavItem>
            </div>
          )}

          <div className="h-px bg-gray-800 my-2" />

          {/* DJ Mode */}
          <SectionHeader
            section="dj"
            icon={Disc3}
            label="DJ Mode"
            color="text-red-400"
          />
          {expandedSections.dj && (
            <div className="pb-2">
              <NavItem to="/dj/hero" icon={Mic2} indent>
                Hero & Artist
              </NavItem>
              <NavItem to="/dj/gigs" icon={Calendar} indent>
                Gigs
              </NavItem>
              <NavItem to="/dj/sets" icon={Radio} indent>
                Sets
              </NavItem>
              <NavItem to="/dj/press-kit" icon={Newspaper} indent>
                Press Kit
              </NavItem>
              <NavItem to="/dj/contact" icon={Mail} indent>
                Contact / Booking
              </NavItem>
            </div>
          )}

          <div className="h-px bg-gray-800 my-2" />

          {/* Media Library */}
          <NavItem to="/media" icon={Image}>
            Media Library
          </NavItem>
        </nav>

        {/* Logout */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800 bg-gray-900">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2 w-full text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="ml-64 p-8 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
