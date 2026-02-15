import { useEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router';

let savedScrollY = 0;

/** Call before navigating away from a page whose scroll position should be restorable. */
export function saveScrollPosition(): void {
  savedScrollY = window.scrollY;
}

export default function useScrollRestore(): void {
  const location = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    // POP (back/forward): let the browser handle scroll restoration natively.
    if (navigationType === 'POP') return;

    // PUSH with restoreScroll state: restore the saved position.
    if ((location.state as { restoreScroll?: boolean })?.restoreScroll) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          window.scrollTo(0, savedScrollY);
        });
      });
      return;
    }

    // All other PUSH navigations: scroll to top (SPA doesn't do this natively).
    window.scrollTo(0, 0);
  }, [location.pathname, location.state, navigationType]);
}
