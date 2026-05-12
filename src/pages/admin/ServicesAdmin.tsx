import { useEffect, useState, type FormEvent } from 'react';
import { supabase } from '../../lib/supabase';
import {
  AdminPageHeader, DangerButton, Field, GhostButton, PrimaryButton,
  inputClass, textareaClass,
} from '../../components/admin/admin-ui';
import ImagePickerField from '../../components/admin/ImagePickerField';

interface Service {
  id: string;
  num: string;
  title: string;
  description: string | null;
  modal_body: string | null;
  image_url: string | null;
  cta_label: string | null;
  cta_email: string | null;
  cta_subject: string | null;
  sort_order: number;
  published: boolean;
}

interface FormState {
  num: string; title: string; description: string; modal_body: string; image_url: string;
  cta_label: string; cta_email: string; cta_subject: string;
  sort_order: number; published: boolean;
}
const EMPTY: FormState = {
  num: '', title: '', description: '', modal_body: '', image_url: '',
  cta_label: 'Pyydä tarjous', cta_email: 'eino@roskapaiva.com', cta_subject: '',
  sort_order: 0, published: true,
};

export default function ServicesAdmin() {
  const [items, setItems] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = async () => {
    if (!supabase) return;
    setLoading(true);
    const { data, error } = await supabase.from('services').select('*').order('sort_order');
    if (error) setError(error.message);
    setItems((data ?? []) as Service[]);
    setLoading(false);
  };
  useEffect(() => { refresh(); }, []);

  const startNew = () => { setEditingId(null); setForm(EMPTY); setError(null); };
  const startEdit = (s: Service) => {
    setEditingId(s.id);
    setForm({
      num: s.num, title: s.title, description: s.description ?? '',
      modal_body: s.modal_body ?? '',
      image_url: s.image_url ?? '', cta_label: s.cta_label ?? '',
      cta_email: s.cta_email ?? '', cta_subject: s.cta_subject ?? '',
      sort_order: s.sort_order, published: s.published,
    });
    setError(null); window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!supabase) return;
    setBusy(true); setError(null);
    const payload = {
      num: form.num.trim(), title: form.title.trim(),
      description: form.description.trim() || null,
      modal_body: form.modal_body.trim() || null,
      image_url: form.image_url.trim() || null,
      cta_label: form.cta_label.trim() || null,
      cta_email: form.cta_email.trim() || null,
      cta_subject: form.cta_subject.trim() || null,
      sort_order: Number(form.sort_order) || 0,
      published: form.published,
    };
    const { error } = editingId
      ? await supabase.from('services').update(payload).eq('id', editingId)
      : await supabase.from('services').insert(payload);
    setBusy(false);
    if (error) { setError(error.message); return; }
    setForm(EMPTY); setEditingId(null); await refresh();
  };

  const onDelete = async (s: Service) => {
    if (!supabase) return;
    if (!confirm(`Poistetaanko "${s.title}"?`)) return;
    const { error } = await supabase.from('services').delete().eq('id', s.id);
    if (error) { alert(error.message); return; }
    if (editingId === s.id) { setEditingId(null); setForm(EMPTY); }
    await refresh();
  };

  return (
    <div className="mx-auto max-w-5xl">
      <AdminPageHeader eyebrow="Sisältö" title="Palvelut"
        actions={editingId ? <GhostButton onClick={startNew}>Uusi palvelu</GhostButton> : null} />

      <form onSubmit={onSubmit} className="rounded-lg border border-cream/10 bg-forest-deep p-6 md:p-8">
        <p className="font-display text-xl text-cream">{editingId ? 'Muokkaa palvelua' : 'Uusi palvelu'}</p>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <Field label="Numero" hint='esim. "01"'><input required value={form.num} onChange={(e) => setForm({ ...form, num: e.target.value })} className={inputClass} /></Field>
          <Field label="Otsikko" hint='Saa sisältää \n rivinvaihdolle'><input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputClass} placeholder="Tapahtumat ja\nvirkistyspäivät" /></Field>
          <div className="md:col-span-2"><Field label="Lyhyt kuvaus" hint="Näkyy palvelukortilla"><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={textareaClass} /></Field></div>
          <div className="md:col-span-2"><Field label="Modaalin teksti" hint="Pitkä kuvaus, joka näkyy kun kortti avataan. Tyhjä rivi = uusi kappale."><textarea value={form.modal_body} onChange={(e) => setForm({ ...form, modal_body: e.target.value })} className={textareaClass + ' min-h-[180px]'} placeholder="Ensimmäinen kappale.\n\nToinen kappale.\n\nKolmas kappale." /></Field></div>
          <ImagePickerField label="Kuva" value={form.image_url} onChange={(url) => setForm({ ...form, image_url: url })} />
          <Field label="Järjestys"><input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} className={inputClass} /></Field>
          <Field label="CTA-teksti"><input value={form.cta_label} onChange={(e) => setForm({ ...form, cta_label: e.target.value })} className={inputClass} /></Field>
          <Field label="CTA-sähköposti"><input type="email" value={form.cta_email} onChange={(e) => setForm({ ...form, cta_email: e.target.value })} className={inputClass} /></Field>
          <div className="md:col-span-2"><Field label="CTA-aihe"><input value={form.cta_subject} onChange={(e) => setForm({ ...form, cta_subject: e.target.value })} className={inputClass} placeholder="Tapahtuma tai virkistyspäivä" /></Field></div>
          <label className="flex items-center gap-3 md:col-span-2"><input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} className="h-4 w-4 accent-amber" /><span className="text-sm text-cream/80">Julkaistu</span></label>
        </div>
        {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
        <div className="mt-6 flex flex-wrap gap-3">
          <PrimaryButton type="submit" disabled={busy}>{busy ? 'Tallennetaan…' : editingId ? 'Tallenna' : 'Lisää'}</PrimaryButton>
          {editingId && <GhostButton type="button" onClick={startNew}>Peruuta</GhostButton>}
        </div>
      </form>

      <div className="mt-12">
        <p className="font-display text-xl text-cream">Palvelut ({items.length})</p>
        {loading ? <p className="mt-4 text-cream/60">Ladataan…</p> : items.length === 0 ? <p className="mt-4 text-cream/60">Ei vielä palveluita.</p> : (
          <ul className="mt-4 space-y-3">
            {items.map((s) => (
              <li key={s.id} className="flex flex-col gap-4 rounded-lg border border-cream/10 bg-forest-deep p-4 md:flex-row md:items-center">
                <div className="h-20 w-32 flex-shrink-0 overflow-hidden rounded bg-forest-night">
                  {s.image_url ? <img src={s.image_url} alt="" className="h-full w-full object-cover" loading="lazy" /> : <div className="flex h-full w-full items-center justify-center text-xs text-cream/40">Ei kuvaa</div>}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span className="font-display text-2xl text-amber">{s.num}</span>
                    <span className="font-display text-lg text-cream whitespace-pre-line">{s.title.replace('\\n', ' ')}</span>
                    {!s.published && <span className="rounded-full bg-cream/10 px-2 py-0.5 text-[10px] uppercase tracking-widest text-cream/55">luonnos</span>}
                  </div>
                  {s.description && <p className="mt-1 text-sm text-cream/70 line-clamp-2">{s.description}</p>}
                </div>
                <div className="flex gap-2"><GhostButton onClick={() => startEdit(s)}>Muokkaa</GhostButton><DangerButton onClick={() => onDelete(s)}>Poista</DangerButton></div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
