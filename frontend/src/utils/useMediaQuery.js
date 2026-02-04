import { useEffect, useState } from 'react';

const getInitialMatch = (query) => {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia(query).matches;
};

export const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(() => getInitialMatch(query));

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return undefined;
    const mediaQueryList = window.matchMedia(query);
    const handler = (event) => setMatches(event.matches);

    setMatches(mediaQueryList.matches);
    if (mediaQueryList.addEventListener) {
      mediaQueryList.addEventListener('change', handler);
      return () => mediaQueryList.removeEventListener('change', handler);
    }

    mediaQueryList.addListener(handler);
    return () => mediaQueryList.removeListener(handler);
  }, [query]);

  return matches;
};
