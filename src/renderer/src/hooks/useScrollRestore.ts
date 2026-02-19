import { useEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router';

const scrollPositions = new Map<string, number>();
let savedScrollY = 0;

/** Call before navigating away from a page whose scroll position should be restorable. */
export function saveScrollPosition(): void {
  savedScrollY = document.querySelector('main')?.scrollTop ?? 0;
}

export default function useScrollRestore(): void {
  const location = useLocation();
  const navigationType = useNavigationType();

  // Continuously save scroll position for POP restoration.
  useEffect(() => {
    const main = document.querySelector('main');
    if (!main) return;
    function handleScroll() {
      scrollPositions.set(location.key, main!.scrollTop);
    }
    main.addEventListener('scroll', handleScroll, { passive: true });
    return () => main.removeEventListener('scroll', handleScroll);
  }, [location.key]);

  // Restore scroll on navigation.
  useEffect(() => {
    const main = document.querySelector('main');
    if (!main) return;

    // POP (back/forward): restore from saved positions map.
    if (navigationType === 'POP') {
      const saved = scrollPositions.get(location.key);
      if (saved != null) {
        requestAnimationFrame(() => {
          main.scrollTop = saved;
        });
      }
      return;
    }

    // PUSH with restoreScroll state: restore the manually saved position.
    if ((location.state as { restoreScroll?: boolean })?.restoreScroll) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          main.scrollTop = savedScrollY;
        });
      });
      return;
    }

    // All other PUSH navigations: scroll to top.
    main.scrollTop = 0;
  }, [location.pathname, location.key, location.state, navigationType]);
}
