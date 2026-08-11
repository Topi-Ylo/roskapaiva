import { useEffect, useState } from 'react';

/**
 * Reads a media query in JavaScript, for the cases CSS cannot cover — here,
 * how many list rows to render at all. Hiding the surplus with CSS would still
 * build every row and still leave the page kilometres long on a phone.
 *
 * Starts from the real value rather than a guess, so the first paint is already
 * correct and the list does not visibly re-cut itself.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() =>
    typeof window !== 'undefined' && 'matchMedia' in window
      ? window.matchMedia(query).matches
      : false
  );

  useEffect(() => {
    if (typeof window === 'undefined' || !('matchMedia' in window)) return;
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}
