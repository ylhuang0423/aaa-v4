import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router';

const scrollPositions: Record<string, number> = {};

export default function useScrollRestore(): void {
  const { pathname } = useLocation();
  const prevPathRef = useRef(pathname);

  useEffect(() => {
    // Save previous route's scroll position
    if (prevPathRef.current !== pathname) {
      scrollPositions[prevPathRef.current] = window.scrollY;
      prevPathRef.current = pathname;
    }

    // Restore scroll position for current route
    const saved = scrollPositions[pathname];
    if (saved !== undefined) {
      window.scrollTo(0, saved);
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname]);
}
