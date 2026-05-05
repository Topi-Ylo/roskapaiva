import { useEffect, useState, type FormEvent } from 'react';
import { supabase } from '../../lib/supabase';
import {
  AdminPageHeader, DangerButton, Field, GhostButton, PrimaryButton, inputClass,
} from '../../components/admin/admin-ui';

interface Partner {
  id: string;
  name: string;
  logo_url: string | null;
  url: string | null;
  sort_order: number;
  published: boolean;
}

interface FormState { name: string; logo_url: string; url: string; sort_order: number; published: boolean; }
const EMPTY: FormState = { name: '', logo_url: '', url: '', sort_order: 0, published: true };

export default function PartnersAdmin() {
  const [items, setItems] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = async () => {
    if (!supabase) return;
    setLoading(true);
    const { data, error } = await supabase.from('partners').select('*').order('sort_order');
    if (error) setError(error.message);
    setItems((data ?? []) as Partner[]);
    setLoading(false);
  };
  useEffect(() => { refresh(); }, []);

  const startNew = () => { setEditingId(null); setForm(EMPTY); setError(null); };
  const startEdit = (p: Partner) => {
    setEditingId(p.id);
    setForm({ name: p.name, logo_url: p.logo_url ?? '', url: p.url ?? '', sort_order: p.sort_order, published: p.published });
    setError(null); window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!supabase) return;
    setBusy(true); setError(null);
    const payload = {
      name: form.name.trim(),
      logo_url: form.logo_url.trim() || null,
      url: form.url.trim() || null,
      sort_order: Number(form.sort_order) || 0,
      published: form.published,
    };
    const { error } = editingId
      ? await supabase.from('partners').update(payload).eq('id', editingId)
      : await supabase.from('partners').insert(payload);
    setBusy(false);
    if (error) { setError(error.message); return; }
    setForm(EMPTY); setEditingId(null); await refresh();
  };

  const onDelete = async (p: Partner) => {
    if (!supabase) return;
    if (!confirm(`Poistetaanko ${p.name}?`)) return;
    const { error } = await supabase.from('partners').delete().eq('id', p.id);
    if (error) { alert(error.message); return; }
    if (editingId === p.id) { setEditingId(null); setForm(EMPTY); }
    await refresh();
  };

  return (
    <div className="mx-auto max-w-5xl">
      <AdminPageHeader eyebrow="Sisältö" title="Kumppanit"
        actions={editingId ? <GhostButton onClick={startNew}>Uusi kumppani</GhostButton> : null} />

      <form onSubmit={onSubmit} className="rounded-lg border border-cream/10 bg-forest-deep p-6 md:p-8">
        <p className="font-display text-xl text-cream">{editingId ? 'Muokkaa kumppania' : 'Uusi kumppani'}</p>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <Field label="Nimi"><input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} /></Field>
          <Field label="Järjestys"><input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} className={inputClass} /></Field>
          <Field label="Logo (URL, valinnainen)"><input type="url" value={form.logo_url} onChange={(e) => setForm({ ...form, logo_url: e.target.value })} className={inputClass} /></Field>
          <Field label="Kumppanin sivu (valinnainen)"><input type="url" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} className={inputClass} /></Field>
          <label className="flex items-center gap-3 md:col-span-2"><input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} className="h-4 w-4 accent-amber" /><span className="text-sm text-cream/80">Julkaistu</span></label>
        </div>
        {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
        <div className="mt-6 flex flex-wrap gap-3">
          <PrimaryButton type="submit" disabled={busy}>{busy ? 'Tallennetaan…' : editingId ? 'Tallenna' : 'Lisää'}</PrimaryButton>
          {editingId && <GhostButton type="button" onClick={startNew}>Peruuta</GhostButton>}
        </div>
      </form>

      <div className="mt-12">
        <p className="font-display text-xl text-cream">Kumppanit ({items.length})</p>
        {loading ? <p className="mt-4 text-cream/60">Ladataan…</p> : items.length === 0 ? <p className="mt-4 text-cream/60">Ei vielä kumppaneita.</p> : (
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((p) => (
              <li key={p.id} className="flex items-center justify-between gap-2 rounded-lg border border-cream/10 bg-forest-deep p-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-display text-base text-cream">{p.name}</span>
                    {!p.published && <span className="rounded-full bg-cream/10 px-2 py-0.5 text-[10px] uppercase tracking-widest text-cream/55">luonnos</span>}
                  </div>
                  <p className="mt-1 text-xs text-cream/40">Järjestys: {p.sort_order}</p>
                </div>
                <div className="flex gap-2"><GhostButton onClick={() => startEdit(p)}>Muokkaa</GhostButton><DangerButton onClick={() => onDelete(p)}>Poista</DangerButton></div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
