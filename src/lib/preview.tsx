import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

interface PreviewValue {
  enabled: boolean;
  toggle: () => void;
  set: (v: boolean) => void;
}

const KEY = 'roskapaiva-preview-mode';
const PreviewContext = createContext<PreviewValue | undefined>(undefined);

export function PreviewProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    try {
      setEnabled(localStorage.getItem(KEY) === '1');
    } catch {
      /* ignore */
    }
  }, []);

  const set = useCallback((v: boolean) => {
    setEnabled(v);
    try {
      if (v) localStorage.setItem(KEY, '1');
      else localStorage.removeItem(KEY);
    } catch {
      /* ignore */
    }
  }, []);

  const toggle = useCallback(() => set(!enabled), [enabled, set]);

  const value = useMemo<PreviewValue>(() => ({ enabled, toggle, set }), [enabled, toggle, set]);

  return <PreviewContext.Provider value={value}>{children}</PreviewContext.Provider>;
}

export function usePreview(): PreviewValue {
  const ctx = useContext(PreviewContext);
  if (!ctx) throw new Error('usePreview must be used within PreviewProvider');
  return ctx;
}
