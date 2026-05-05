import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { ANALYTICS_ENABLED } from '../../lib/analytics';

interface Counts {
  past_events?: number;
  timeline_entries?: number;
  social_media_collabs?: number;
  media_posts?: number;
  press_images?: number;
}

const TILES: Array<{ key: keyof Counts; label: string; to: string }> = [
  { key: 'past_events', label: 'Edelliset tapahtumat', to: '/admin/past-events' },
  { key: 'timeline_entries', label: 'Aikajana-merkinnät', to: '/admin/timeline' },
  { key: 'social_media_collabs', label: 'Some-yhteistyöt', to: '/admin/social-media' },
  { key: 'media_posts', label: 'Mediajulkaisut', to: '/admin/media-posts' },
  { key: 'press_images', label: 'Lehdistökuvat', to: '/admin/press-images' },
];

export default function AdminDashboard() {
  const [counts, setCounts] = useState<Counts>({});

  useEffect(() => {
    if (!supabase) return;
    let cancelled = false;
    Promise.all(
      TILES.map(async (t) => {
        const { count } = await supabase!.from(t.key).select('id', { count: 'exact', head: true });
        return [t.key, count ?? 0] as const;
      })
    ).then((entries) => {
      if (cancelled) return;
      setCounts(Object.fromEntries(entries) as Counts);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="mx-auto max-w-6xl">
      <p className="eyebrow text-amber">Admin</p>
      <h1 className="font-display mt-4 text-4xl text-cream md:text-5xl">Yleisnäkymä</h1>
      <p className="mt-3 max-w-xl text-cream/70">
        Hallinnoi sivuston sisältöä, mediakirjastoa ja seuraa kävijätilastoja.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TILES.map((t) => (
          <Link
            key={t.key}
            to={t.to}
            className="rounded-lg border border-cream/10 bg-forest-deep p-6 transition hover:border-amber/40"
          >
            <p className="eyebrow text-amber">{t.label}</p>
            <p className="font-display mt-3 text-3xl text-cream">{counts[t.key] ?? '—'}</p>
            <p className="mt-1 text-xs uppercase tracking-widest text-cream/50">tietuetta</p>
          </Link>
        ))}

        <Link
          to="/admin/analytics"
          className="rounded-lg border border-cream/10 bg-forest-deep p-6 transition hover:border-amber/40"
        >
          <p className="eyebrow text-amber">Analytiikka</p>
          <p className="font-display mt-3 text-3xl text-cream">
            {ANALYTICS_ENABLED ? 'GA4' : 'Ei käytössä'}
          </p>
          <p className="mt-1 text-xs uppercase tracking-widest text-cream/50">
            {ANALYTICS_ENABLED ? 'kävijätilastot' : 'aseta VITE_GA_MEASUREMENT_ID'}
          </p>
        </Link>
      </div>
    </div>
  );
}
