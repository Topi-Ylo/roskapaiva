import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { AdminPageHeader, PrimaryButton } from '../../components/admin/admin-ui';

const TABLES = [
  'past_events',
  'timeline_entries',
  'social_media_collabs',
  'media_posts',
  'press_images',
  'partners',
  'services',
  'site_settings',
  'image_library',
  'admins',
];

export default function BackupAdmin() {
  const [busy, setBusy] = useState(false);
  const [info, setInfo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onExport = async () => {
    if (!supabase) return;
    setBusy(true); setInfo(null); setError(null);
    const dump: Record<string, unknown[]> = {};
    try {
      for (const t of TABLES) {
        const { data, error } = await supabase.from(t).select('*');
        if (error) throw new Error(`${t}: ${error.message}`);
        dump[t] = data ?? [];
      }
      const blob = new Blob([JSON.stringify({ exported_at: new Date().toISOString(), tables: dump }, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `roskapaiva-backup-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setInfo('Varmuuskopio ladattu.');
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      <AdminPageHeader eyebrow="Asetukset" title="Varmuuskopio" />

      <div className="rounded-lg border border-cream/10 bg-forest-deep p-6 md:p-8">
        <p className="font-display text-xl text-cream">Lataa kaikki sisältö JSON-tiedostona</p>
        <p className="mt-3 text-sm leading-relaxed text-cream/70">
          Lataa kaikkien sisältötaulujen tiedot sekä asetukset, kuvakirjasto ja ylläpitäjälista yhtenä JSON-tiedostona.
          Tiedosto tarjoaa portattavan kopion, jonka voit tallentaa varmuuskopioksi.
        </p>
        <ul className="mt-4 grid grid-cols-2 gap-1 text-xs text-cream/55">
          {TABLES.map((t) => <li key={t}>· {t}</li>)}
        </ul>

        {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
        {info && <p className="mt-4 text-sm text-amber-light">{info}</p>}

        <div className="mt-6">
          <PrimaryButton onClick={onExport} disabled={busy}>
            {busy ? 'Pakataan…' : 'Lataa varmuuskopio'}
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}
