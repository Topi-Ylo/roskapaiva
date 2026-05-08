import { useEffect, useState } from 'react';

// Module-level state so Hero (writer) and Nav (reader) can coordinate the
// time-based hero reveal without a React context. Used on both desktop and
// mobile now that the hero video plays once and freezes on the final frame.
let revealed = false;
const listeners = new Set<() => void>();

export function setHeroRevealed(v: boolean) {
  if (revealed === v) return;
  revealed = v;
  listeners.forEach((l) => l());
}

export function useHeroRevealed(): boolean {
  const [val, setVal] = useState<boolean>(revealed);
  useEffect(() => {
    const listener = () => setVal(revealed);
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);
  return val;
}
