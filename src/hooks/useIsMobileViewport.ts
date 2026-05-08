import { useEffect, useState } from 'react';

// Matches Tailwind's `md:` breakpoint. Anything below this gets the
// "mobile-sized" layout path; iPad portrait (810 px) and up gets desktop.
const BREAKPOINT = 768;

/**
 * True when the viewport is narrower than the `md:` breakpoint (768 px).
 * Replaces the old pointer-based check, which incorrectly classified iPads
 * (and Android tablets) as mobile because they are touch devices.
 *
 * Initializes synchronously via matchMedia so the first render already has
 * the right value (no desktop-flash on phones).
 */
export function useIsMobileViewport() {
  const query = `(max-width: ${BREAKPOINT - 1}px)`;
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;
    const mq = window.matchMedia(query);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    if (mq.addEventListener) mq.addEventListener('change', handler);
    else mq.addListener(handler);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener('change', handler);
      else mq.removeListener(handler);
    };
  }, [query]);

  return isMobile;
}
