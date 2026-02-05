import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const SectionsContext = createContext(null);

export function SectionsProvider({ children }) {
  const [sections, setSections] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadSections = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.getSections();
      const items = data.items || [];

      // Create a map of slug -> section data
      const sectionMap = {};
      items.forEach(section => {
        sectionMap[section.slug] = section;
      });

      setSections(sectionMap);
      setError(null);
    } catch (err) {
      console.error('Failed to load sections:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSections();
  }, [loadSections]);

  // Get section ID by slug
  const getSectionId = useCallback((slug) => {
    return sections[slug]?.id || null;
  }, [sections]);

  // Get tech section ID
  const techSectionId = sections.tech?.id || null;

  // Get DJ section ID
  const djSectionId = sections.dj?.id || null;

  const value = {
    sections,
    loading,
    error,
    getSectionId,
    techSectionId,
    djSectionId,
    reload: loadSections,
  };

  return (
    <SectionsContext.Provider value={value}>
      {children}
    </SectionsContext.Provider>
  );
}

export function useSections() {
  const context = useContext(SectionsContext);
  if (!context) {
    throw new Error('useSections must be used within a SectionsProvider');
  }
  return context;
}

export default SectionsContext;
