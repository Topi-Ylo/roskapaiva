import { useEffect, useState, type FormEvent } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../lib/auth';
import {
  AdminPageHeader, DangerButton, Field, PrimaryButton, inputClass,
} from '../../components/admin/admin-ui';

interface AdminRow {
  user_id: string;
  email: string;
  full_name: string | null;
  created_at: string;
}

export default function UsersAdmin() {
  const { user } = useAuth();
  const [items, setItems] = useState<AdminRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const refresh = async () => {
    if (!supabase) return;
    setLoading(true);
    const { data, error } = await supabase.from('admins').select('*').order('created_at');
    if (error) setError(error.message);
    setItems((data ?? []) as AdminRow[]);
    setLoading(false);
  };
  useEffect(() => { refresh(); }, []);

  const onAdd = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!supabase) return;
    setBusy(true); setError(null); setInfo(null);

    // Find auth.users row by email via Supabase RPC or list (we use an explicit query)
    // Note: this requires the user to already exist in Supabase Auth.
    const { data: existing, error: lookupErr } = await supabase
      .from('admins').select('user_id').eq('email', email.trim().toLowerCase()).maybeSingle();
    if (lookupErr) { setError(lookupErr.message); setBusy(false); return; }
    if (existing) { setError('Tämä sähköposti on jo ylläpitäjä.'); setBusy(false); return; }

    // The admins table requires a real user_id. We can't create auth users via
    // RLS-bound query, so we ask the new user to sign up first via the login page.
    // Once they exist in auth.users, we can promote them by email lookup (server-side).
    // For now: try inserting via match-by-email through a postgres function would be cleaner;
    // simplest path is to require the user to first sign in once, then we promote them here.
    setError(
      'Käyttäjän pitää ensin rekisteröityä Supabase-projektiin (Auth → Users → Add user). ' +
      'Sen jälkeen voit lisätä hänet ylläpitäjäksi täältä, tai suoraan SQL-editorissa: ' +
      'insert into public.admins (user_id, email, full_name) select id, email, $1 from auth.users where email = $2;'
    );
    setBusy(false);
  };

  const onRemove = async (a: AdminRow) => {
    if (!supabase) return;
    if (a.user_id === user?.id) { alert('Et voi poistaa itseäsi ylläpitäjäoikeuksista.'); return; }
    if (!confirm(`Poistetaanko ${a.email} ylläpitäjistä?`)) return;
    const { error } = await supabase.from('admins').delete().eq('user_id', a.user_id);
    if (error) { alert(error.message); return; }
    await refresh();
  };

  return (
    <div className="mx-auto max-w-3xl">
      <AdminPageHeader eyebrow="Asetukset" title="Käyttäjät" />

      <div className="rounded-lg border border-cream/10 bg-forest-deep p-6 md:p-8">
        <p className="font-display text-xl text-cream">Lisää ylläpitäjä</p>
        <p className="mt-2 text-sm text-cream/65">
          Käyttäjä on luotava ensin Supabase Authiin (Dashboard → Authentication → Users → "Add user"). Sen jälkeen
          voit promotoida hänet ylläpitäjäksi.
        </p>
        <form onSubmit={onAdd} className="mt-5 grid gap-4 md:grid-cols-2">
          <Field label="Sähköposti"><input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} /></Field>
          <Field label="Nimi (valinnainen)"><input value={fullName} onChange={(e) => setFullName(e.target.value)} className={inputClass} /></Field>
          <div className="md:col-span-2 flex flex-wrap gap-3">
            <PrimaryButton type="submit" disabled={busy}>{busy ? 'Lisätään…' : 'Promovoi ylläpitäjäksi'}</PrimaryButton>
          </div>
          {error && <p className="md:col-span-2 text-sm text-red-300">{error}</p>}
          {info && <p className="md:col-span-2 text-sm text-amber-light">{info}</p>}
        </form>
      </div>

      <div className="mt-10">
        <p className="font-display text-xl text-cream">Ylläpitäjät ({items.length})</p>
        {loading ? <p className="mt-4 text-cream/60">Ladataan…</p> : (
          <ul className="mt-4 space-y-3">
            {items.map((a) => (
              <li key={a.user_id} className="flex items-center justify-between gap-4 rounded-lg border border-cream/10 bg-forest-deep p-4">
                <div>
                  <p className="font-display text-base text-cream">{a.full_name ?? a.email}</p>
                  <p className="text-xs text-cream/55">{a.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  {a.user_id === user?.id && <span className="text-[10px] uppercase tracking-widest text-amber/80">sinä</span>}
                  <DangerButton onClick={() => onRemove(a)} disabled={a.user_id === user?.id}>Poista</DangerButton>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
