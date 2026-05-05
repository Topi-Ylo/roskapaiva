import { useEffect, useState } from 'react';

// Module-level state so Hero (writer) and Nav (reader) can coordinate the
// time-based reveal on mobile without a context tree.
let revealed = false;
const listeners = new Set<() => void>();

export function setMobileHeroRevealed(v: boolean) {
  if (revealed === v) return;
  revealed = v;
  listeners.forEach((l) => l());
}

export function useMobileHeroRevealed(): boolean {
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