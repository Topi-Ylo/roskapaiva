import { useEffect, useMemo, useState, type FormEvent } from 'react';
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
import ImagePickerField from '../../components/admin/ImagePickerField';
import { eventDateLabel, isUpcoming, type EventItem } from '../../lib/eventsData';

interface Row extends EventItem {
  id: string;
  published: boolean;
}

interface FormState {
  title: string;
  subtitle: string;
  event_date: string;
  date_label: string;
  location: string;
  type: string;
  image_url: string;
  description: string;
  body: string;
  link_url: string;
  link_label: string;
  sort_order: number;
  published: boolean;
}

const EMPTY: FormState = {
  title: '',
  subtitle: '',
  event_date: '',
  date_label: '',
  location: '',
  type: '',
  image_url: '',
  description: '',
  body: '',
  link_url: '',
  link_label: '',
  sort_order: 0,
  published: true,
};

export default function EventsAdmin() {
  const [items, setItems] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'tulevat' | 'menneet'>('tulevat');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = async () => {
    if (!supabase) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('event_date', { ascending: false });
    if (error) setError(error.message);
    setItems((data ?? []) as Row[]);
    setLoading(false);
  };

  useEffect(() => {
    refresh();
  }, []);

  const upcoming = useMemo(() => items.filter(isUpcoming), [items]);
  const past = useMemo(() => items.filter((e) => !isUpcoming(e)), [items]);
  const shown = tab === 'tulevat' ? upcoming : past;

  const startNew = () => {
    setEditingId(null);
    setForm(EMPTY);
    setError(null);
  };

  const startEdit = (e: Row) => {
    setEditingId(e.id);
    setForm({
      title: e.title,
      subtitle: e.subtitle ?? '',
      event_date: e.event_date ?? '',
      date_label: e.date_label ?? '',
      location: e.location ?? '',
      type: e.type ?? '',
      image_url: e.image_url ?? '',
      description: e.description ?? '',
      body: e.body ?? '',
      link_url: e.link_url ?? '',
      link_label: e.link_label ?? '',
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
      title: form.title.trim(),
      subtitle: form.subtitle.trim() || null,
      event_date: form.event_date || null,
      date_label: form.date_label.trim() || null,
      location: form.location.trim() || null,
      type: form.type.trim() || null,
      image_url: form.image_url.trim() || null,
      description: form.description.trim() || null,
      body: form.body.trim() || null,
      link_url: form.link_url.trim() || null,
      link_label: form.link_label.trim() || null,
      sort_order: Number(form.sort_order) || 0,
      published: form.published,
    };

    const { error } = editingId
      ? await supabase.from('events').update(payload).eq('id', editingId)
      : await supabase.from('events').insert(payload);

    setBusy(false);
    if (error) {
      setError(error.message);
      return;
    }
    setForm(EMPTY);
    setEditingId(null);
    await refresh();
  };

  const onDelete = async (e: Row) => {
    if (!supabase) return;
    if (!confirm(`Poistetaanko "${e.title}"?`)) return;
    const { error } = await supabase.from('events').delete().eq('id', e.id);
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
        title="Tapahtumat (kalenteri)"
        actions={editingId ? <GhostButton onClick={startNew}>Uusi tapahtuma</GhostButton> : null}
      />

      <form onSubmit={onSubmit} className="rounded-lg border border-cream/10 bg-forest-deep p-6 md:p-8">
        <p className="font-display text-xl text-cream">
          {editingId ? 'Muokkaa tapahtumaa' : 'Uusi tapahtuma'}
        </p>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <Field label="Nimi">
            <input
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className={inputClass}
              placeholder="Roskapäivä 2026"
            />
          </Field>
          <Field label="Alaotsikko" hint="Valinnainen">
            <input
              value={form.subtitle}
              onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
              className={inputClass}
            />
          </Field>
          <Field label="Päivämäärä" hint="Määrää tuleva/mennyt-jaon">
            <input
              type="date"
              value={form.event_date}
              onChange={(e) => setForm({ ...form, event_date: e.target.value })}
              className={inputClass}
            />
          </Field>
          <Field label="Näyttöpäivä" hint="Valinnainen, esim. 'Vappu 2026'">
            <input
              value={form.date_label}
              onChange={(e) => setForm({ ...form, date_label: e.target.value })}
              className={inputClass}
              placeholder="5.9.2026"
            />
          </Field>
          <Field label="Paikka">
            <input
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              className={inputClass}
              placeholder="Karhupuisto, Helsinki"
            />
          </Field>
          <Field label="Tyyppi" hint="esim. Siivoustapahtuma">
            <input
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className={inputClass}
              placeholder="Siivoustapahtuma"
            />
          </Field>
          <ImagePickerField
            label="Kuva"
            value={form.image_url}
            onChange={(url) => setForm({ ...form, image_url: url })}
            placeholder="https://i.imgur.com/..."
          />
          <Field label="Järjestys" hint="Pienempi = ensin">
            <input
              type="number"
              value={form.sort_order}
              onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })}
              className={inputClass}
            />
          </Field>
          <div className="md:col-span-2">
            <Field label="Lyhyt kuvaus" hint="Näkyy kortilla">
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className={textareaClass}
              />
            </Field>
          </div>
          <div className="md:col-span-2">
            <Field label="Pitkä kuvaus" hint="Näkyy avatussa näkymässä. Tyhjä rivi = uusi kappale.">
              <textarea
                value={form.body}
                onChange={(e) => setForm({ ...form, body: e.target.value })}
                className={`${textareaClass} min-h-[140px]`}
              />
            </Field>
          </div>
          <Field label="Linkki" hint="Valinnainen, esim. /5-9-2026 tai https://...">
            <input
              value={form.link_url}
              onChange={(e) => setForm({ ...form, link_url: e.target.value })}
              className={inputClass}
              placeholder="/5-9-2026"
            />
          </Field>
          <Field label="Linkin teksti" hint="Oletus: Lue lisää">
            <input
              value={form.link_label}
              onChange={(e) => setForm({ ...form, link_label: e.target.value })}
              className={inputClass}
              placeholder="Tapahtuman tiedot"
            />
          </Field>
          <label className="flex items-center gap-3 md:col-span-2">
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
        <div className="flex gap-6 border-b border-cream/10">
          {(['tulevat', 'menneet'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`pb-3 text-[11px] font-bold uppercase tracking-widest transition ${
                tab === t ? 'border-b-2 border-amber text-cream' : 'text-cream/45 hover:text-cream'
              }`}
            >
              {t === 'tulevat' ? `Tulevat (${upcoming.length})` : `Menneet (${past.length})`}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="mt-4 text-cream/60">Ladataan…</p>
        ) : shown.length === 0 ? (
          <p className="mt-4 text-cream/60">Ei tapahtumia tässä näkymässä.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {shown.map((e) => (
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
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-display text-lg text-cream">
                      {e.title} {e.subtitle}
                    </span>
                    {!e.published && (
                      <span className="rounded-full bg-cream/10 px-2 py-0.5 text-[10px] uppercase tracking-widest text-cream/55">
                        Luonnos
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-cream/70">
                    {eventDateLabel(e)}
                    {e.location ? ` · ${e.location}` : ''}
                  </p>
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
