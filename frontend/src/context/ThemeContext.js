import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState(() => {
    const saved = localStorage.getItem('portfolio-mode');
    const hash = window.location.hash;
    if (hash === '#dj') return 'dj';
    if (hash === '#tech') return 'professional';
    return saved || 'professional';
  });

  useEffect(() => {
    localStorage.setItem('portfolio-mode', mode);
    const newHash = mode === 'dj' ? '#dj' : '#tech';
    if (window.location.hash !== newHash) {
      window.history.replaceState(null, '', newHash);
    }
  }, [mode]);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#dj' && mode !== 'dj') {
        setMode('dj');
      } else if (hash === '#tech' && mode !== 'professional') {
        setMode('professional');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [mode]);

  const toggleMode = () => {
    setMode(prev => prev === 'professional' ? 'dj' : 'professional');
  };

  const value = {
    mode,
    setMode,
    toggleMode,
    isProfessional: mode === 'professional',
    isDJ: mode === 'dj'
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
