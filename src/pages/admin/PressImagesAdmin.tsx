import { useEffect, useState, type FormEvent } from 'react';
import { supabase } from '../../lib/supabase';
import {
  AdminPageHeader, DangerButton, Field, GhostButton, PrimaryButton, inputClass,
} from '../../components/admin/admin-ui';

interface PressImage {
  id: string;
  label: string;
  src: string;
  in_zip: boolean;
  sort_order: number;
  published: boolean;
}

interface FormState { label: string; src: string; in_zip: boolean; sort_order: number; published: boolean; }
const EMPTY: FormState = { label: '', src: '', in_zip: true, sort_order: 0, published: true };

export default function PressImagesAdmin() {
  const [items, setItems] = useState<PressImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = async () => {
    if (!supabase) return;
    setLoading(true);
    const { data, error } = await supabase.from('press_images').select('*').order('sort_order');
    if (error) setError(error.message);
    setItems((data ?? []) as PressImage[]);
    setLoading(false);
  };
  useEffect(() => { refresh(); }, []);

  const startNew = () => { setEditingId(null); setForm(EMPTY); setError(null); };
  const startEdit = (it: PressImage) => {
    setEditingId(it.id);
    setForm({ label: it.label, src: it.src, in_zip: it.in_zip, sort_order: it.sort_order, published: it.published });
    setError(null); window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!supabase) return;
    setBusy(true); setError(null);
    const payload = {
      label: form.label.trim(), src: form.src.trim(),
      in_zip: form.in_zip, sort_order: Number(form.sort_order) || 0,
      published: form.published,
    };
    const { error } = editingId
      ? await supabase.from('press_images').update(payload).eq('id', editingId)
      : await supabase.from('press_images').insert(payload);
    setBusy(false);
    if (error) { setError(error.message); return; }
    setForm(EMPTY); setEditingId(null); await refresh();
  };

  const onDelete = async (it: PressImage) => {
    if (!supabase) return;
    if (!confirm(`Poistetaanko "${it.label}"?`)) return;
    const { error } = await supabase.from('press_images').delete().eq('id', it.id);
    if (error) { alert(error.message); return; }
    if (editingId === it.id) { setEditingId(null); setForm(EMPTY); }
    await refresh();
  };

  return (
    <div className="mx-auto max-w-5xl">
      <AdminPageHeader eyebrow="Sisältö" title="Lehdistökuvat"
        actions={editingId ? <GhostButton onClick={startNew}>Uusi kuva</GhostButton> : null} />

      <form onSubmit={onSubmit} className="rounded-lg border border-cream/10 bg-forest-deep p-6 md:p-8">
        <p className="font-display text-xl text-cream">{editingId ? 'Muokkaa kuvaa' : 'Uusi kuva'}</p>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2"><Field label="Kuva (URL)"><input required type="url" value={form.src} onChange={(e) => setForm({ ...form, src: e.target.value })} className={inputClass} /></Field></div>
          <Field label="Otsake / kuvateksti"><input required value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} className={inputClass} placeholder="Eino, kentällä" /></Field>
          <Field label="Järjestys"><input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} className={inputClass} /></Field>
          <label className="flex items-center gap-3"><input type="checkbox" checked={form.in_zip} onChange={(e) => setForm({ ...form, in_zip: e.target.checked })} className="h-4 w-4 accent-amber" /><span className="text-sm text-cream/80">Sisällytä lataus-zipiin</span></label>
          <label className="flex items-center gap-3"><input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} className="h-4 w-4 accent-amber" /><span className="text-sm text-cream/80">Julkaistu (näkyy karusellissa)</span></label>
        </div>
        {form.src && <div className="mt-5"><img src={form.src} alt="" className="h-40 w-auto rounded border border-cream/10 object-cover" /></div>}
        {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
        <div className="mt-6 flex flex-wrap gap-3">
          <PrimaryButton type="submit" disabled={busy}>{busy ? 'Tallennetaan…' : editingId ? 'Tallenna' : 'Lisää'}</PrimaryButton>
          {editingId && <GhostButton type="button" onClick={startNew}>Peruuta</GhostButton>}
        </div>
      </form>

      <div className="mt-12">
        <p className="font-display text-xl text-cream">Kuvat ({items.length})</p>
        {loading ? <p className="mt-4 text-cream/60">Ladataan…</p> : items.length === 0 ? <p className="mt-4 text-cream/60">Ei vielä kuvia.</p> : (
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {items.map((it) => (
              <li key={it.id} className="flex flex-col gap-3 rounded-lg border border-cream/10 bg-forest-deep p-4">
                <div className="aspect-[4/5] overflow-hidden rounded bg-forest-night">
                  <img src={it.src} alt="" className="h-full w-full object-cover" loading="lazy" />
                </div>
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm text-cream">{it.label}</p>
                  <div className="flex flex-wrap gap-1">
                    {it.in_zip && <span className="rounded-full bg-amber/10 px-2 py-0.5 text-[10px] uppercase tracking-widest text-amber/80">zip</span>}
                    {!it.published && <span className="rounded-full bg-cream/10 px-2 py-0.5 text-[10px] uppercase tracking-widest text-cream/55">luonnos</span>}
                  </div>
                </div>
                <div className="flex gap-2"><GhostButton onClick={() => startEdit(it)}>Muokkaa</GhostButton><DangerButton onClick={() => onDelete(it)}>Poista</DangerButton></div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
