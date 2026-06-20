import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLenis } from 'lenis/react';

export default function ScrollToTop() {
  const { pathname } = useLocation();
  const lenis = useLenis();

  useEffect(() => {
    // 1. Force native scroll snap
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    
    // 2. Force Lenis to snap instantly without animating
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    }
  }, [pathname, lenis]);

  return null;
}
