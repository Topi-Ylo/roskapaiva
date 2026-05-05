import { useEffect, useState } from 'react';

/**
 * Returns scroll progress through the #hero section, from 0 (section top at viewport top)
 * to 1 (section bottom at viewport bottom). Throttled to one update per animation frame.
 */
export function useHeroProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let ticking = false;
    let last = 0;

    const compute = () => {
      const hero = document.getElementById('hero');
      if (!hero) return;
      const rect = hero.getBoundingClientRect();
      const scrollable = hero.offsetHeight - window.innerHeight;
      if (scrollable <= 0) {
        if (last !== 0) {
          last = 0;
          setProgress(0);
        }
        return;
      }
      const scrolled = -rect.top;
      const p = Math.max(0, Math.min(1, scrolled / scrollable));
      if (Math.abs(p - last) > 0.0005) {
        last = p;
        setProgress(p);
      }
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        compute();
        ticking = false;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    compute();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return progress;
}
