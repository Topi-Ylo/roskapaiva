import { useEffect, useState, type FormEvent } from 'react';
import { supabase } from '../../lib/supabase';
import {
  AdminPageHeader, DangerButton, Field, GhostButton, PrimaryButton,
  inputClass, textareaClass,
} from '../../components/admin/admin-ui';
import ImagePickerField from '../../components/admin/ImagePickerField';

type Category = 'tv' | 'press' | 'podcast';

interface Post {
  id: string;
  category: Category;
  source: string;
  title: string;
  description: string | null;
  image_url: string | null;
  url: string;
  sort_order: number;
  published: boolean;
}

interface FormState {
  category: Category; source: string; title: string;
  description: string; image_url: string; url: string;
  sort_order: number; published: boolean;
}

const EMPTY: FormState = {
  category: 'press', source: '', title: '', description: '',
  image_url: '', url: '', sort_order: 0, published: true,
};

const CATEGORY_LABELS: Record<Category, string> = {
  tv: 'TV ja video', press: 'Lehdistö', podcast: 'Podcast',
};

export default function MediaPostsAdmin() {
  const [items, setItems] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = async () => {
    if (!supabase) return;
    setLoading(true);
    const { data, error } = await supabase.from('media_posts').select('*').order('sort_order');
    if (error) setError(error.message);
    setItems((data ?? []) as Post[]);
    setLoading(false);
  };
  useEffect(() => { refresh(); }, []);

  const startNew = () => { setEditingId(null); setForm(EMPTY); setError(null); };
  const startEdit = (p: Post) => {
    setEditingId(p.id);
    setForm({
      category: p.category, source: p.source, title: p.title,
      description: p.description ?? '', image_url: p.image_url ?? '',
      url: p.url, sort_order: p.sort_order, published: p.published,
    });
    setError(null); window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!supabase) return;
    setBusy(true); setError(null);
    const payload = {
      category: form.category, source: form.source.trim(),
      title: form.title.trim(),
      description: form.description.trim() || null,
      image_url: form.image_url.trim() || null,
      url: form.url.trim(),
      sort_order: Number(form.sort_order) || 0,
      published: form.published,
    };
    const { error } = editingId
      ? await supabase.from('media_posts').update(payload).eq('id', editingId)
      : await supabase.from('media_posts').insert(payload);
    setBusy(false);
    if (error) { setError(error.message); return; }
    setForm(EMPTY); setEditingId(null); await refresh();
  };

  const onDelete = async (p: Post) => {
    if (!supabase) return;
    if (!confirm(`Poistetaanko "${p.title}"?`)) return;
    const { error } = await supabase.from('media_posts').delete().eq('id', p.id);
    if (error) { alert(error.message); return; }
    if (editingId === p.id) { setEditingId(null); setForm(EMPTY); }
    await refresh();
  };

  const grouped = items.reduce<Record<Category, Post[]>>((acc, p) => {
    (acc[p.category] = acc[p.category] || []).push(p);
    return acc;
  }, { tv: [], press: [], podcast: [] });

  return (
    <div className="mx-auto max-w-5xl">
      <AdminPageHeader eyebrow="Sisältö" title="Mediassa"
        actions={editingId ? <GhostButton onClick={startNew}>Uusi julkaisu</GhostButton> : null} />

      <form onSubmit={onSubmit} className="rounded-lg border border-cream/10 bg-forest-deep p-6 md:p-8">
        <p className="font-display text-xl text-cream">{editingId ? 'Muokkaa julkaisua' : 'Uusi julkaisu'}</p>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <Field label="Kategoria">
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as Category })} className={inputClass}>
              <option value="tv">TV ja video</option><option value="press">Lehdistö</option><option value="podcast">Podcast</option>
            </select>
          </Field>
          <Field label="Lähde" hint="esim. MTV Uutiset, Apu, Kirkko ja Kaupunki"><input required value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })} className={inputClass} /></Field>
          <div className="md:col-span-2"><Field label="Otsikko"><input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputClass} /></Field></div>
          <div className="md:col-span-2"><Field label="Kuvaus"><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={textareaClass} /></Field></div>
          <Field label="Artikkelin URL"><input required type="url" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} className={inputClass} /></Field>
          <ImagePickerField label="Kuva" value={form.image_url} onChange={(url) => setForm({ ...form, image_url: url })} />
          <Field label="Järjestys"><input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} className={inputClass} /></Field>
          <label className="flex items-center gap-3 self-end"><input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} className="h-4 w-4 accent-amber" /><span className="text-sm text-cream/80">Julkaistu</span></label>
        </div>
        {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
        <div className="mt-6 flex flex-wrap gap-3">
          <PrimaryButton type="submit" disabled={busy}>{busy ? 'Tallennetaan…' : editingId ? 'Tallenna' : 'Lisää'}</PrimaryButton>
          {editingId && <GhostButton type="button" onClick={startNew}>Peruuta</GhostButton>}
        </div>
      </form>

      <div className="mt-12 space-y-10">
        {(['tv', 'press', 'podcast'] as Category[]).map((cat) => (
          <div key={cat}>
            <p className="font-display text-xl text-cream">{CATEGORY_LABELS[cat]} ({grouped[cat].length})</p>
            {loading ? <p className="mt-3 text-cream/60">Ladataan…</p> : grouped[cat].length === 0 ? <p className="mt-3 text-cream/60">Ei vielä julkaisuja.</p> : (
              <ul className="mt-4 space-y-3">
                {grouped[cat].map((p) => (
                  <li key={p.id} className="flex flex-col gap-4 rounded-lg border border-cream/10 bg-forest-deep p-4 md:flex-row md:items-center">
                    <div className="h-20 w-32 flex-shrink-0 overflow-hidden rounded bg-forest-night">
                      {p.image_url ? <img src={p.image_url} alt="" className="h-full w-full object-cover" loading="lazy" /> : <div className="flex h-full w-full items-center justify-center text-xs text-cream/40">Ei kuvaa</div>}
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-amber/15 px-2 py-0.5 text-[10px] uppercase tracking-widest text-amber">{p.source}</span>
                        {!p.published && <span className="rounded-full bg-cream/10 px-2 py-0.5 text-[10px] uppercase tracking-widest text-cream/55">luonnos</span>}
                      </div>
                      <p className="mt-2 font-display text-lg text-cream">{p.title}</p>
                      {p.description && <p className="mt-1 text-sm text-cream/70 line-clamp-2">{p.description}</p>}
                      <a href={p.url} target="_blank" rel="noopener noreferrer" className="mt-1 block truncate text-xs text-amber hover:text-amber-light">{p.url}</a>
                    </div>
                    <div className="flex gap-2"><GhostButton onClick={() => startEdit(p)}>Muokkaa</GhostButton><DangerButton onClick={() => onDelete(p)}>Poista</DangerButton></div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
