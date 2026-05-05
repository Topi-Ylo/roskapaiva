import { useEffect, useState } from 'react';

/**
 * Returns true on touch-first devices (phones, most tablets) where setting
 * `video.currentTime` rapidly during scroll is jittery. Used to switch
 * scroll-scrubbed video playback to plain looped autoplay on mobile.
 */
export function useIsCoarsePointer() {
  const [isCoarse, setIsCoarse] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;
    const mq = window.matchMedia('(pointer: coarse)');
    setIsCoarse(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsCoarse(e.matches);
    if (mq.addEventListener) mq.addEventListener('change', handler);
    else mq.addListener(handler);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener('change', handler);
      else mq.removeListener(handler);
    };
  }, []);

  return isCoarse;
}
