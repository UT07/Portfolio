import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { SectionsProvider } from './contexts/SectionsContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Layout from './components/Layout';

// Media Library
import MediaLibrary from './pages/MediaLibrary';

// Tech section pages
import TechHero from './pages/tech/TechHero';
import Highlights from './pages/tech/Highlights';
import Education from './pages/tech/Education';
import Experience from './pages/tech/Experience';
import Skills from './pages/tech/Skills';
import Certifications from './pages/tech/Certifications';
import FeaturedProjects from './pages/tech/FeaturedProjects';
import FeaturedProjectEdit from './pages/tech/FeaturedProjectEdit';
import GithubProjects from './pages/tech/GithubProjects';
import TechContact from './pages/tech/TechContact';

// DJ section pages
import DJHero from './pages/dj/DJHero';
import Gigs from './pages/dj/Gigs';
import GigEdit from './pages/dj/GigEdit';
import Sets from './pages/dj/Sets';
import PressKit from './pages/dj/PressKit';
import DJContact from './pages/dj/DJContact';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return user ? children : <Navigate to="/login" />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <SectionsProvider>
              <Layout />
            </SectionsProvider>
          </PrivateRoute>
        }
      >
        {/* Dashboard */}
        <Route index element={<Dashboard />} />

        {/* Media Library */}
        <Route path="media" element={<MediaLibrary />} />

        {/* Tech Section Routes */}
        <Route path="tech/hero" element={<TechHero />} />
        <Route path="tech/highlights" element={<Highlights />} />
        <Route path="tech/education" element={<Education />} />
        <Route path="tech/experience" element={<Experience />} />
        <Route path="tech/skills" element={<Skills />} />
        <Route path="tech/certifications" element={<Certifications />} />
        <Route path="tech/projects" element={<FeaturedProjects />} />
        <Route path="tech/projects/new" element={<FeaturedProjectEdit />} />
        <Route path="tech/projects/:id" element={<FeaturedProjectEdit />} />
        <Route path="tech/github" element={<GithubProjects />} />
        <Route path="tech/contact" element={<TechContact />} />

        {/* DJ Section Routes */}
        <Route path="dj/hero" element={<DJHero />} />
        <Route path="dj/gigs" element={<Gigs />} />
        <Route path="dj/gigs/new" element={<GigEdit />} />
        <Route path="dj/gigs/:id" element={<GigEdit />} />
        <Route path="dj/sets" element={<Sets />} />
        <Route path="dj/press-kit" element={<PressKit />} />
        <Route path="dj/contact" element={<DJContact />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
