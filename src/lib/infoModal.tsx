import { createContext, useCallback, useContext, useMemo, useState } from 'react';

/**
 * Which of the two reference documents an overlay is showing.
 *
 * These used to be links that opened a new tab. Sending someone away mid-form
 * is the surest way to lose a half-filled sign-up, so they open over the page
 * instead and the form is still there when the overlay closes.
 *
 * The routes stay: /turvallisuusohjeet and /tietosuoja are still real pages, so a
 * direct link or a search result lands somewhere sensible.
 */
export type InfoDoc = 'ohjeet' | 'tietosuoja';

interface InfoModalValue {
  doc: InfoDoc | null;
  open: (doc: InfoDoc) => void;
  close: () => void;
}

const Ctx = createContext<InfoModalValue>({
  doc: null,
  open: () => {},
  close: () => {},
});

export function InfoModalProvider({ children }: { children: React.ReactNode }) {
  const [doc, setDoc] = useState<InfoDoc | null>(null);
  const open = useCallback((d: InfoDoc) => setDoc(d), []);
  const close = useCallback(() => setDoc(null), []);
  const value = useMemo(() => ({ doc, open, close }), [doc, open, close]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useInfoModal(): InfoModalValue {
  return useContext(Ctx);
}
