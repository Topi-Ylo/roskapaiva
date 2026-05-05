import { Link } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { usePreview } from '../lib/preview';

export default function PreviewBanner() {
  const { isAdmin } = useAuth();
  const { enabled, set } = usePreview();
  if (!isAdmin || !enabled) return null;
  return (
    <div className="fixed bottom-4 left-1/2 z-[55] flex -translate-x-1/2 items-center gap-3 rounded-full border border-amber/50 bg-forest-deep/95 px-5 py-2 shadow-2xl backdrop-blur">
      <span className="h-2 w-2 animate-pulse rounded-full bg-amber" />
      <span className="text-xs font-semibold uppercase tracking-widest text-amber">Esikatselutila</span>
      <span className="hidden text-xs text-cream/60 sm:inline">Näet myös luonnokset</span>
      <button
        type="button"
        onClick={() => set(false)}
        className="text-xs text-cream/70 underline-offset-2 transition hover:text-cream hover:underline"
      >
        Sulje
      </button>
      <Link to="/admin" className="text-xs text-amber hover:text-amber-light">Admin →</Link>
    </div>
  );
}
