import { useEffect, useState, type FormEvent } from 'react';
import { supabase } from '../../lib/supabase';
import {
  AdminPageHeader, DangerButton, Field, GhostButton, PrimaryButton,
  inputClass, textareaClass,
} from '../../components/admin/admin-ui';
import ImagePickerField from '../../components/admin/ImagePickerField';

interface Item {
  id: string;
  brand: string;
  platform: string;
  description: string | null;
  thumbnail_url: string | null;
  video_type: 'youtube' | 'vimeo' | 'mp4';
  video_id: string | null;
  video_url: string | null;
  aspect: '9/16' | '16/9';
  sort_order: number;
  published: boolean;
}

interface FormState {
  brand: string; platform: string; description: string;
  thumbnail_url: string; video_type: 'youtube' | 'vimeo' | 'mp4';
  video_id: string; video_url: string; aspect: '9/16' | '16/9';
  sort_order: number; published: boolean;
}

const EMPTY: FormState = {
  brand: '', platform: 'Some-yhteistyö', description: '',
  thumbnail_url: '', video_type: 'vimeo', video_id: '', video_url: '',
  aspect: '9/16', sort_order: 0, published: true,
};

export default function SocialMediaAdmin() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = async () => {
    if (!supabase) return;
    setLoading(true);
    const { data, error } = await supabase.from('social_media_collabs').select('*').order('sort_order');
    if (error) setError(error.message);
    setItems((data ?? []) as Item[]);
    setLoading(false);
  };
  useEffect(() => { refresh(); }, []);

  const startNew = () => { setEditingId(null); setForm(EMPTY); setError(null); };
  const startEdit = (it: Item) => {
    setEditingId(it.id);
    setForm({
      brand: it.brand, platform: it.platform, description: it.description ?? '',
      thumbnail_url: it.thumbnail_url ?? '', video_type: it.video_type,
      video_id: it.video_id ?? '', video_url: it.video_url ?? '',
      aspect: it.aspect, sort_order: it.sort_order, published: it.published,
    });
    setError(null); window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!supabase) return;
    setBusy(true); setError(null);
    const payload = {
      brand: form.brand.trim(), platform: form.platform.trim(),
      description: form.description.trim() || null,
      thumbnail_url: form.thumbnail_url.trim() || null,
      video_type: form.video_type,
      video_id: form.video_type !== 'mp4' ? form.video_id.trim() || null : null,
      video_url: form.video_type === 'mp4' ? form.video_url.trim() || null : null,
      aspect: form.aspect, sort_order: Number(form.sort_order) || 0,
      published: form.published,
    };
    const { error } = editingId
      ? await supabase.from('social_media_collabs').update(payload).eq('id', editingId)
      : await supabase.from('social_media_collabs').insert(payload);
    setBusy(false);
    if (error) { setError(error.message); return; }
    setForm(EMPTY); setEditingId(null); await refresh();
  };

  const onDelete = async (it: Item) => {
    if (!supabase) return;
    if (!confirm(`Poistetaanko "${it.brand}"?`)) return;
    const { error } = await supabase.from('social_media_collabs').delete().eq('id', it.id);
    if (error) { alert(error.message); return; }
    if (editingId === it.id) { setEditingId(null); setForm(EMPTY); }
    await refresh();
  };

  return (
    <div className="mx-auto max-w-5xl">
      <AdminPageHeader eyebrow="Sisältö" title="Some-yhteistyöt"
        actions={editingId ? <GhostButton onClick={startNew}>Uusi yhteistyö</GhostButton> : null} />

      <form onSubmit={onSubmit} className="rounded-lg border border-cream/10 bg-forest-deep p-6 md:p-8">
        <p className="font-display text-xl text-cream">{editingId ? 'Muokkaa yhteistyötä' : 'Uusi yhteistyö'}</p>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <Field label="Brändi / Otsikko"><input required value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} className={inputClass} placeholder="Siisti toukokuu" /></Field>
          <Field label="Alusta"><input required value={form.platform} onChange={(e) => setForm({ ...form, platform: e.target.value })} className={inputClass} placeholder="Some-yhteistyö" /></Field>
          <Field label="Videon tyyppi">
            <select value={form.video_type} onChange={(e) => setForm({ ...form, video_type: e.target.value as 'youtube' | 'vimeo' | 'mp4' })} className={inputClass}>
              <option value="vimeo">Vimeo</option><option value="youtube">YouTube</option><option value="mp4">MP4 (suora URL)</option>
            </select>
          </Field>
          <Field label="Kuvasuhde">
            <select value={form.aspect} onChange={(e) => setForm({ ...form, aspect: e.target.value as '9/16' | '16/9' })} className={inputClass}>
              <option value="9/16">9:16 (pysty)</option><option value="16/9">16:9 (vaaka)</option>
            </select>
          </Field>
          {form.video_type !== 'mp4' ? (
            <Field label={`${form.video_type === 'vimeo' ? 'Vimeo' : 'YouTube'} ID`} hint="esim. 1095523594 tai dQw4w9WgXcQ">
              <input value={form.video_id} onChange={(e) => setForm({ ...form, video_id: e.target.value })} className={inputClass} />
            </Field>
          ) : (
            <Field label="MP4 URL"><input type="url" value={form.video_url} onChange={(e) => setForm({ ...form, video_url: e.target.value })} className={inputClass} /></Field>
          )}
          <ImagePickerField
            label="Pikkukuva"
            hint="Vimeo: vumbnail.com/<id>.jpg, YouTube: img.youtube.com/vi/<id>/maxresdefault.jpg"
            value={form.thumbnail_url}
            onChange={(url) => setForm({ ...form, thumbnail_url: url })}
          />
          <Field label="Järjestys"><input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} className={inputClass} /></Field>
          <div className="md:col-span-2"><Field label="Kuvaus"><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={textareaClass} placeholder="Yhteistyö Nissan Suomen kanssa." /></Field></div>
          <label className="flex items-center gap-3 md:col-span-2"><input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} className="h-4 w-4 accent-amber" /><span className="text-sm text-cream/80">Julkaistu</span></label>
        </div>
        {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
        <div className="mt-6 flex flex-wrap gap-3">
          <PrimaryButton type="submit" disabled={busy}>{busy ? 'Tallennetaan…' : editingId ? 'Tallenna' : 'Lisää'}</PrimaryButton>
          {editingId && <GhostButton type="button" onClick={startNew}>Peruuta</GhostButton>}
        </div>
      </form>

      <div className="mt-12">
        <p className="font-display text-xl text-cream">Yhteistyöt ({items.length})</p>
        {loading ? <p className="mt-4 text-cream/60">Ladataan…</p> : items.length === 0 ? <p className="mt-4 text-cream/60">Ei vielä yhteistöitä.</p> : (
          <ul className="mt-4 space-y-3">
            {items.map((it) => (
              <li key={it.id} className="flex flex-col gap-4 rounded-lg border border-cream/10 bg-forest-deep p-4 md:flex-row md:items-center">
                <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded bg-forest-night">
                  {it.thumbnail_url ? <img src={it.thumbnail_url} alt="" className="h-full w-full object-cover" loading="lazy" /> : <div className="flex h-full w-full items-center justify-center text-[10px] text-cream/40">Ei kuvaa</div>}
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-display text-lg text-cream">{it.brand}</span>
                    <span className="rounded-full bg-cream/5 px-2 py-0.5 text-[10px] uppercase tracking-widest text-cream/60">{it.platform}</span>
                    <span className="rounded-full bg-amber/10 px-2 py-0.5 text-[10px] uppercase tracking-widest text-amber/80">{it.video_type} · {it.aspect}</span>
                    {!it.published && <span className="rounded-full bg-cream/10 px-2 py-0.5 text-[10px] uppercase tracking-widest text-cream/55">luonnos</span>}
                  </div>
                  {it.description && <p className="mt-1 text-sm text-cream/70">{it.description}</p>}
                  <p className="mt-1 text-xs text-cream/40">Järjestys: {it.sort_order} · {it.video_type === 'mp4' ? it.video_url : it.video_id}</p>
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
