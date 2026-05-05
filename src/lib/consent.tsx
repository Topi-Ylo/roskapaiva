import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

type ConsentState = 'unknown' | 'granted' | 'denied';

interface ConsentValue {
  consent: ConsentState;
  grant: () => void;
  deny: () => void;
}

const STORAGE_KEY = 'roskapaiva-consent-v1';
const ConsentContext = createContext<ConsentValue | undefined>(undefined);

export function ConsentProvider({ children }: { children: ReactNode }) {
  const [consent, setConsent] = useState<ConsentState>('unknown');

  useEffect(() => {
    try {
      const v = localStorage.getItem(STORAGE_KEY);
      if (v === 'granted' || v === 'denied') setConsent(v);
    } catch {
      /* ignore */
    }
  }, []);

  const grant = useCallback(() => {
    setConsent('granted');
    try {
      localStorage.setItem(STORAGE_KEY, 'granted');
    } catch {
      /* ignore */
    }
  }, []);

  const deny = useCallback(() => {
    setConsent('denied');
    try {
      localStorage.setItem(STORAGE_KEY, 'denied');
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo<ConsentValue>(() => ({ consent, grant, deny }), [consent, grant, deny]);

  return <ConsentContext.Provider value={value}>{children}</ConsentContext.Provider>;
}

export function useConsent(): ConsentValue {
  const ctx = useContext(ConsentContext);
  if (!ctx) throw new Error('useConsent must be used within ConsentProvider');
  return ctx;
}
