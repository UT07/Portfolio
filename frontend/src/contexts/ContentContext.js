import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  fetchAllContent,
  transformDJContent,
  transformProfessionalContent,
  transformProjectsContent
} from '../services/api';

// Static fallback data
import djDataStatic from '../data/djData.json';
import professionalDataStatic from '../data/professionalData.json';
import projectsDataStatic from '../data/projectsData.json';

const ContentContext = createContext(null);

// Check if API is enabled
const USE_API = process.env.REACT_APP_USE_API === 'true';

export function ContentProvider({ children }) {
  const [djData, setDjData] = useState(djDataStatic);
  const [professionalData, setProfessionalData] = useState(professionalDataStatic);
  const [projectsData, setProjectsData] = useState(projectsDataStatic);
  const [loading, setLoading] = useState(USE_API);
  const [error, setError] = useState(null);
  const [usingApi, setUsingApi] = useState(false);

  const loadContent = useCallback(async () => {
    if (!USE_API) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const apiContent = await fetchAllContent();

      // Transform DJ content
      if (apiContent.dj) {
        const transformedDj = transformDJContent(apiContent.dj);
        if (transformedDj) {
          setDjData(transformedDj);
        }
      }

      // Transform Professional content
      if (apiContent.tech) {
        const transformedPro = transformProfessionalContent(apiContent.tech);
        if (transformedPro) {
          setProfessionalData(transformedPro);
        }

        const transformedProjects = transformProjectsContent(apiContent.tech);
        if (transformedProjects) {
          setProjectsData(transformedProjects);
        }
      }

      setUsingApi(true);
      setError(null);
    } catch (err) {
      console.warn('Failed to fetch from API, using static data:', err.message);
      setError(err.message);
      // Keep using static data
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadContent();
  }, [loadContent]);

  const refreshContent = useCallback(() => {
    return loadContent();
  }, [loadContent]);

  const value = {
    djData,
    professionalData,
    projectsData,
    loading,
    error,
    usingApi,
    refreshContent
  };

  return (
    <ContentContext.Provider value={value}>
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
}

// Convenience hooks for specific data
export function useDJData() {
  const { djData, loading, error } = useContent();
  return { data: djData, loading, error };
}

export function useProfessionalData() {
  const { professionalData, loading, error } = useContent();
  return { data: professionalData, loading, error };
}

export function useProjectsData() {
  const { projectsData, loading, error } = useContent();
  return { data: projectsData, loading, error };
}

export default ContentContext;
