import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
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
import {
  DESCRIPTION_MAX,
  DURATION_OPTIONS,
  FINNISH_CITIES,
  cityCoords,
  formatDuration,
  formatEventDate,
  formatTime,
} from '../../lib/communityEvents';

type Status = 'pending' | 'approved' | 'rejected';

interface Row {
  id: string;
  organizer_name: string;
  organizer_email: string;
  city: string;
  lat: number | null;
  lng: number | null;
  event_date: string;
  start_time: string | null;
  duration_minutes: number;
  description: string;
  image_url: string | null;
  status: Status;
  participants: number | null;
  waste_kg: number | null;
  admin_note: string | null;
  created_at: string;
}

interface FormState {
  organizer_name: string;
  organizer_email: string;
  city: string;
  event_date: string;
  start_time: string;
  duration_minutes: number;
  description: string;
  image_url: string;
  participants: string;
  waste_kg: string;
  admin_note: string;
}

const EMPTY: FormState = {
  organizer_name: '',
  organizer_email: '',
  city: '',
  event_date: '2026-09-05',
  start_time: '11:00',
  duration_minutes: 120,
  description: '',
  image_url: '',
  participants: '',
  waste_kg: '',
  admin_note: '',
};

const STATUS_LABEL: Record<Status, string> = {
  pending: 'Odottaa',
  approved: 'Julkaistu',
  rejected: 'Hylätty',
};

const STATUS_STYLE: Record<Status, string> = {
  pending: 'bg-amber/20 text-amber',
  approved: 'bg-emerald-500/20 text-emerald-300',
  rejected: 'bg-red-500/15 text-red-300',
};

export default function CommunityEventsAdmin() {
  const [items, setItems] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Status>('pending');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const refresh = async () => {
    if (!supabase) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('community_events')
      .select('*')
      .order('event_date', { ascending: true })
      .order('created_at', { ascending: false });
    if (error) setError(error.message);
    setItems((data ?? []) as Row[]);
    setLoading(false);
  };

  useEffect(() => {
    refresh();
  }, []);

  const counts = useMemo(
    () => ({
      pending: items.filter((i) => i.status === 'pending').length,
      approved: items.filter((i) => i.status === 'approved').length,
      rejected: items.filter((i) => i.status === 'rejected').length,
    }),
    [items]
  );

  const shown = items.filter((i) => i.status === tab);

  const setStatus = async (row: Row, status: Status) => {
    if (!supabase) return;
    const { error } = await supabase
      .from('community_events')
      .update({ status })
      .eq('id', row.id);
    if (error) {
      alert(error.message);
      return;
    }
    await refresh();
  };

  const startNew = () => {
    setEditingId(null);
    setForm(EMPTY);
    setError(null);
  };

  const startEdit = (r: Row) => {
    setEditingId(r.id);
    setForm({
      organizer_name: r.organizer_name,
      organizer_email: r.organizer_email,
      city: r.city,
      event_date: r.event_date,
      start_time: r.start_time ? r.start_time.slice(0, 5) : '',
      duration_minutes: r.duration_minutes,
      description: r.description,
      image_url: r.image_url ?? '',
      participants: r.participants?.toString() ?? '',
      waste_kg: r.waste_kg?.toString() ?? '',
      admin_note: r.admin_note ?? '',
    });
    setError(null);
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!supabase) return;
    setBusy(true);
    setError(null);

    const coords = cityCoords(form.city);
    const payload = {
      organizer_name: form.organizer_name.trim(),
      organizer_email: form.organizer_email.trim(),
      city: form.city,
      lat: coords?.lat ?? null,
      lng: coords?.lng ?? null,
      event_date: form.event_date,
      start_time: form.start_time || null,
      duration_minutes: Number(form.duration_minutes) || 120,
      description: form.description.trim(),
      image_url: form.image_url.trim() || null,
      participants: form.participants === '' ? null : Number(form.participants),
      waste_kg: form.waste_kg === '' ? null : Number(form.waste_kg),
      admin_note: form.admin_note.trim() || null,
    };

    const { error } = editingId
      ? await supabase.from('community_events').update(payload).eq('id', editingId)
      : await supabase.from('community_events').insert({ ...payload, status: 'approved' });

    setBusy(false);
    if (error) {
      setError(error.message);
      return;
    }
    setForm(EMPTY);
    setEditingId(null);
    await refresh();
  };

  const onDelete = async (r: Row) => {
    if (!supabase) return;
    if (!confirm(`Poistetaanko "${r.city}: ${r.description}" pysyvästi?`)) return;
    const { error } = await supabase.from('community_events').delete().eq('id', r.id);
    if (error) {
      alert(error.message);
      return;
    }
    if (editingId === r.id) startNew();
    await refresh();
  };

  return (
    <div className="mx-auto max-w-5xl">
      <AdminPageHeader
        eyebrow="Sisältö"
        title="Valtakunnalliset tapahtumat"
        actions={editingId ? <GhostButton onClick={startNew}>Uusi tapahtuma</GhostButton> : null}
      />

      <form
        ref={formRef}
        onSubmit={onSubmit}
        className="scroll-mt-24 rounded-lg border border-cream/10 bg-forest-deep p-6 md:p-8"
      >
        <p className="font-display text-xl text-cream">
          {editingId ? 'Muokkaa tapahtumaa' : 'Lisää tapahtuma käsin'}
        </p>
        <p className="mt-1 text-sm text-cream/55">
          Käsin lisätty tapahtuma julkaistaan heti. Lomakkeen kautta tulleet odottavat hyväksyntää.
        </p>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <Field label="Ilmoittajan nimi">
            <input
              required
              value={form.organizer_name}
              onChange={(e) => setForm({ ...form, organizer_name: e.target.value })}
              className={inputClass}
            />
          </Field>
          <Field label="Sähköposti">
            <input
              required
              type="email"
              value={form.organizer_email}
              onChange={(e) => setForm({ ...form, organizer_email: e.target.value })}
              className={inputClass}
            />
          </Field>
          <Field label="Paikkakunta" hint="Määrää sijainnin kartalla">
            <select
              required
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              className={inputClass}
            >
              <option value="" disabled>
                Valitse
              </option>
              {FINNISH_CITIES.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Päivämäärä">
            <input
              required
              type="date"
              value={form.event_date}
              onChange={(e) => setForm({ ...form, event_date: e.target.value })}
              className={inputClass}
            />
          </Field>
          <Field label="Alkamisaika">
            <input
              type="time"
              value={form.start_time}
              onChange={(e) => setForm({ ...form, start_time: e.target.value })}
              className={inputClass}
            />
          </Field>
          <Field label="Kesto">
            <select
              value={form.duration_minutes}
              onChange={(e) => setForm({ ...form, duration_minutes: Number(e.target.value) })}
              className={inputClass}
            >
              {DURATION_OPTIONS.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.label}
                </option>
              ))}
            </select>
          </Field>
          <div className="md:col-span-2">
            <Field label="Kuvaus" hint={`${form.description.length}/${DESCRIPTION_MAX} merkkiä`}>
              <input
                required
                maxLength={DESCRIPTION_MAX}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className={inputClass}
              />
            </Field>
          </div>
          <ImagePickerField
            label="Kuva"
            value={form.image_url}
            onChange={(url) => setForm({ ...form, image_url: url })}
            placeholder="https://…"
          />
          <div className="grid grid-cols-2 gap-4">
            <Field label="Osallistujia" hint="Tapahtuman jälkeen">
              <input
                type="number"
                min={0}
                value={form.participants}
                onChange={(e) => setForm({ ...form, participants: e.target.value })}
                className={inputClass}
              />
            </Field>
            <Field label="Roskaa (kg)" hint="Tapahtuman jälkeen">
              <input
                type="number"
                min={0}
                step="0.1"
                value={form.waste_kg}
                onChange={(e) => setForm({ ...form, waste_kg: e.target.value })}
                className={inputClass}
              />
            </Field>
          </div>
          <div className="md:col-span-2">
            <Field label="Sisäinen muistiinpano" hint="Ei näy sivustolla">
              <textarea
                value={form.admin_note}
                onChange={(e) => setForm({ ...form, admin_note: e.target.value })}
                className={textareaClass}
              />
            </Field>
          </div>
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
          {(['pending', 'approved', 'rejected'] as Status[]).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setTab(s)}
              className={`pb-3 text-[11px] font-bold uppercase tracking-widest transition ${
                tab === s ? 'border-b-2 border-amber text-cream' : 'text-cream/45 hover:text-cream'
              }`}
            >
              {STATUS_LABEL[s]} ({counts[s]})
            </button>
          ))}
        </div>

        {loading ? (
          <p className="mt-4 text-cream/60">Ladataan…</p>
        ) : shown.length === 0 ? (
          <p className="mt-4 text-cream/60">Ei tapahtumia tässä näkymässä.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {shown.map((r) => (
              <li
                key={r.id}
                className="flex flex-col gap-4 rounded-lg border border-cream/10 bg-forest-deep p-4 md:flex-row md:items-center"
              >
                <div className="h-20 w-28 flex-shrink-0 overflow-hidden rounded bg-forest-night">
                  {r.image_url ? (
                    <img src={r.image_url} alt="" className="h-full w-full object-cover" loading="lazy" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center font-display text-xl text-amber/60">
                      {r.city.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-display text-lg text-cream">{r.city}</span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] uppercase tracking-widest ${STATUS_STYLE[r.status]}`}
                    >
                      {STATUS_LABEL[r.status]}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-cream/80">{r.description}</p>
                  <p className="mt-1 text-xs text-cream/45">
                    {formatEventDate(r.event_date)}
                    {r.start_time ? ` · klo ${formatTime(r.start_time)}` : ''} ·{' '}
                    {formatDuration(r.duration_minutes)}
                  </p>
                  <p className="mt-1 text-xs text-cream/40">
                    {r.organizer_name} · {r.organizer_email}
                    {r.participants ? ` · ${r.participants} osallistujaa` : ''}
                    {r.waste_kg ? ` · ${r.waste_kg} kg` : ''}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {r.status !== 'approved' && (
                    <PrimaryButton onClick={() => setStatus(r, 'approved')}>Hyväksy</PrimaryButton>
                  )}
                  {r.status !== 'rejected' && (
                    <GhostButton onClick={() => setStatus(r, 'rejected')}>Hylkää</GhostButton>
                  )}
                  <GhostButton onClick={() => startEdit(r)}>Muokkaa</GhostButton>
                  <DangerButton onClick={() => onDelete(r)}>Poista</DangerButton>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
