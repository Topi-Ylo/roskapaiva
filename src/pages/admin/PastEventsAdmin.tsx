import { useEffect, useState, type FormEvent } from 'react';
import { supabase } from '../../lib/supabase';
import {
  AdminPageHeader,
  DangerButton,
  Field,
  GhostButton,
  PrimaryButton,
  inputClass,
  textareaClass,
} from '../../components/admin/admin-ui';

interface PastEvent {
  id: string;
  year: string;
  title: string;
  description: string | null;
  image_url: string | null;
  sort_order: number;
  published: boolean;
}

interface FormState {
  year: string;
  title: string;
  description: string;
  image_url: string;
  sort_order: number;
  published: boolean;
}

const EMPTY: FormState = {
  year: '',
  title: '',
  description: '',
  image_url: '',
  sort_order: 0,
  published: true,
};

export default function PastEventsAdmin() {
  const [items, setItems] = useState<PastEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = async () => {
    if (!supabase) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('past_events')
      .select('*')
      .order('sort_order', { ascending: true });
    if (error) setError(error.message);
    setItems((data ?? []) as PastEvent[]);
    setLoading(false);
  };

  useEffect(() => {
    refresh();
  }, []);

  const startNew = () => {
    setEditingId(null);
    setForm(EMPTY);
    setError(null);
  };

  const startEdit = (e: PastEvent) => {
    setEditingId(e.id);
    setForm({
      year: e.year,
      title: e.title,
      description: e.description ?? '',
      image_url: e.image_url ?? '',
      sort_order: e.sort_order,
      published: e.published,
    });
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!supabase) return;
    setBusy(true);
    setError(null);

    const payload = {
      year: form.year.trim(),
      title: form.title.trim(),
      description: form.description.trim() || null,
      image_url: form.image_url.trim() || null,
      sort_order: Number(form.sort_order) || 0,
      published: form.published,
    };

    const { error } = editingId
      ? await supabase.from('past_events').update(payload).eq('id', editingId)
      : await supabase.from('past_events').insert(payload);

    setBusy(false);
    if (error) {
      setError(error.message);
      return;
    }
    setForm(EMPTY);
    setEditingId(null);
    await refresh();
  };

  const onDelete = async (e: PastEvent) => {
    if (!supabase) return;
    if (!confirm(`Poistetaanko "${e.title}" (${e.year})?`)) return;
    const { error } = await supabase.from('past_events').delete().eq('id', e.id);
    if (error) {
      alert(error.message);
      return;
    }
    if (editingId === e.id) {
      setEditingId(null);
      setForm(EMPTY);
    }
    await refresh();
  };

  return (
    <div className="mx-auto max-w-5xl">
      <AdminPageHeader
        eyebrow="Sisältö"
        title="Edelliset tapahtumat"
        actions={editingId ? <GhostButton onClick={startNew}>Uusi tapahtuma</GhostButton> : null}
      />

      <form onSubmit={onSubmit} className="rounded-lg border border-cream/10 bg-forest-deep p-6 md:p-8">
        <p className="font-display text-xl text-cream">
          {editingId ? 'Muokkaa tapahtumaa' : 'Uusi tapahtuma'}
        </p>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <Field label="Vuosi" hint="esim. 2026">
            <input
              required
              value={form.year}
              onChange={(e) => setForm({ ...form, year: e.target.value })}
              className={inputClass}
              placeholder="2026"
            />
          </Field>
          <Field label="Otsikko">
            <input
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className={inputClass}
              placeholder="Suvilahti"
            />
          </Field>
          <Field label="Järjestys" hint="Pienempi = aikaisemmin">
            <input
              type="number"
              value={form.sort_order}
              onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })}
              className={inputClass}
            />
          </Field>
          <ImagePickerField
            label="Kuva"
            value={form.image_url}
            onChange={(url) => setForm({ ...form, image_url: url })}
            placeholder="https://i.imgur.com/..."
          />
          <div className="md:col-span-2">
            <Field label="Kuvaus" hint="Lyhyt rivi, näkyy kortin alla">
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className={textareaClass}
                placeholder="Vappu-reel"
              />
            </Field>
          </div>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(e) => setForm({ ...form, published: e.target.checked })}
              className="h-4 w-4 accent-amber"
            />
            <span className="text-sm text-cream/80">Julkaistu (näkyvissä sivustolla)</span>
          </label>
        </div>

        {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

        <div className="mt-6 flex flex-wrap gap-3">
          <PrimaryButton type="submit" disabled={busy}>
            {busy ? 'Tallennetaan…' : editingId ? 'Tallenna muutokset' : 'Lisää tapahtuma'}
          </PrimaryButton>
          {editingId && (
            <GhostButton type="button" onClick={startNew}>
              Peruuta
            </GhostButton>
          )}
        </div>
      </form>

      <div className="mt-12">
        <p className="font-display text-xl text-cream">Tapahtumat ({items.length})</p>

        {loading ? (
          <p className="mt-4 text-cream/60">Ladataan…</p>
        ) : items.length === 0 ? (
          <p className="mt-4 text-cream/60">Ei vielä tapahtumia. Lisää ensimmäinen yllä.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {items.map((e) => (
              <li
                key={e.id}
                className="flex flex-col gap-4 rounded-lg border border-cream/10 bg-forest-deep p-4 md:flex-row md:items-center"
              >
                <div className="h-20 w-32 flex-shrink-0 overflow-hidden rounded bg-forest-night">
                  {e.image_url ? (
                    <img src={e.image_url} alt="" className="h-full w-full object-cover" loading="lazy" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-cream/40">
                      Ei kuvaa
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span className="font-display text-2xl text-amber">{e.year}</span>
                    <span className="font-display text-lg text-cream">{e.title}</span>
                    {!e.published && (
                      <span className="rounded-full bg-cream/10 px-2 py-0.5 text-[10px] uppercase tracking-widest text-cream/55">
                        Luonnos
                      </span>
                    )}
                  </div>
                  {e.description && (
                    <p className="mt-1 text-sm text-cream/70">{e.description}</p>
                  )}
                  <p className="mt-1 text-xs text-cream/40">Järjestys: {e.sort_order}</p>
                </div>
                <div className="flex gap-2">
                  <GhostButton onClick={() => startEdit(e)}>Muokkaa</GhostButton>
                  <DangerButton onClick={() => onDelete(e)}>Poista</DangerButton>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
