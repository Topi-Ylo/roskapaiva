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
import ImagePickerField from '../../components/admin/ImagePickerField';

// ── Schedule ────────────────────────────────────────────────────────────────

interface Slot {
  id: string;
  slot_time: string;
  label: string;
  place: string;
  area: string | null;
  body: string | null;
  image_url: string | null;
  sort_order: number;
  published: boolean;
}

interface SlotForm {
  slot_time: string;
  label: string;
  place: string;
  area: string;
  body: string;
  image_url: string;
  sort_order: number;
  published: boolean;
}

const EMPTY_SLOT: SlotForm = {
  slot_time: '',
  label: '',
  place: '',
  area: '',
  body: '',
  image_url: '',
  sort_order: 0,
  published: true,
};

function ScheduleManager() {
  const [items, setItems] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<SlotForm>(EMPTY_SLOT);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = async () => {
    if (!supabase) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('event_schedule')
      .select('*')
      .order('sort_order', { ascending: true });
    if (error) setError(error.message);
    setItems((data ?? []) as Slot[]);
    setLoading(false);
  };

  useEffect(() => {
    refresh();
  }, []);

  const startNew = () => {
    setEditingId(null);
    setForm(EMPTY_SLOT);
    setError(null);
  };

  const startEdit = (s: Slot) => {
    setEditingId(s.id);
    setForm({
      slot_time: s.slot_time,
      label: s.label,
      place: s.place,
      area: s.area ?? '',
      body: s.body ?? '',
      image_url: s.image_url ?? '',
      sort_order: s.sort_order,
      published: s.published,
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
      slot_time: form.slot_time.trim(),
      label: form.label.trim(),
      place: form.place.trim(),
      area: form.area.trim() || null,
      body: form.body.trim() || null,
      image_url: form.image_url.trim() || null,
      sort_order: Number(form.sort_order) || 0,
      published: form.published,
    };

    const { error } = editingId
      ? await supabase.from('event_schedule').update(payload).eq('id', editingId)
      : await supabase.from('event_schedule').insert(payload);

    setBusy(false);
    if (error) {
      setError(error.message);
      return;
    }
    setForm(EMPTY_SLOT);
    setEditingId(null);
    await refresh();
  };

  const onDelete = async (s: Slot) => {
    if (!supabase) return;
    if (!confirm(`Poistetaanko aikataulurivi "${s.slot_time} ${s.place}"?`)) return;
    const { error } = await supabase.from('event_schedule').delete().eq('id', s.id);
    if (error) {
      alert(error.message);
      return;
    }
    if (editingId === s.id) {
      setEditingId(null);
      setForm(EMPTY_SLOT);
    }
    await refresh();
  };

  return (
    <section>
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="font-display text-2xl text-cream">Aikataulu</p>
          <p className="mt-1 text-sm text-cream/55">
            Päivän aikaikkunat. Ensimmäiset kaksi näkyvät myös hero-osion alla.
          </p>
        </div>
        {editingId && <GhostButton onClick={startNew}>Uusi rivi</GhostButton>}
      </div>

      <form onSubmit={onSubmit} className="mt-5 rounded-lg border border-cream/10 bg-forest-deep p-6 md:p-8">
        <p className="font-display text-xl text-cream">
          {editingId ? 'Muokkaa aikatauluriviä' : 'Uusi aikataulurivi'}
        </p>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <Field label="Aika" hint="esim. 11–14">
            <input
              required
              value={form.slot_time}
              onChange={(e) => setForm({ ...form, slot_time: e.target.value })}
              className={inputClass}
              placeholder="11–14"
            />
          </Field>
          <Field label="Otsikko" hint="esim. Siivoustapahtuma">
            <input
              required
              value={form.label}
              onChange={(e) => setForm({ ...form, label: e.target.value })}
              className={inputClass}
              placeholder="Siivoustapahtuma"
            />
          </Field>
          <Field label="Paikka" hint="esim. Karhupuisto">
            <input
              required
              value={form.place}
              onChange={(e) => setForm({ ...form, place: e.target.value })}
              className={inputClass}
              placeholder="Karhupuisto"
            />
          </Field>
          <Field label="Tarkenne" hint="esim. Helsinki tai osoite">
            <input
              value={form.area}
              onChange={(e) => setForm({ ...form, area: e.target.value })}
              className={inputClass}
              placeholder="Helsinki"
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
            <Field label="Kuvaus" hint="Kortin teksti">
              <textarea
                value={form.body}
                onChange={(e) => setForm({ ...form, body: e.target.value })}
                className={textareaClass}
                placeholder="Kerätään yhdessä roskat puistosta…"
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
            {busy ? 'Tallennetaan…' : editingId ? 'Tallenna muutokset' : 'Lisää rivi'}
          </PrimaryButton>
          {editingId && (
            <GhostButton type="button" onClick={startNew}>
              Peruuta
            </GhostButton>
          )}
        </div>
      </form>

      <div className="mt-8">
        {loading ? (
          <p className="text-cream/60">Ladataan…</p>
        ) : items.length === 0 ? (
          <p className="text-cream/60">Ei vielä aikataulurivejä. Lisää ensimmäinen yllä.</p>
        ) : (
          <ul className="space-y-3">
            {items.map((s) => (
              <li
                key={s.id}
                className="flex flex-col gap-4 rounded-lg border border-cream/10 bg-forest-deep p-4 md:flex-row md:items-center"
              >
                <div className="h-20 w-32 flex-shrink-0 overflow-hidden rounded bg-forest-night">
                  {s.image_url ? (
                    <img src={s.image_url} alt="" className="h-full w-full object-cover" loading="lazy" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-cream/40">
                      Ei kuvaa
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span className="font-display text-2xl text-amber">{s.slot_time}</span>
                    <span className="font-display text-lg text-cream">{s.place}</span>
                    {!s.published && (
                      <span className="rounded-full bg-cream/10 px-2 py-0.5 text-[10px] uppercase tracking-widest text-cream/55">
                        Luonnos
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-cream/70">
                    {s.label}
                    {s.area ? ` · ${s.area}` : ''}
                  </p>
                  <p className="mt-1 text-xs text-cream/40">Järjestys: {s.sort_order}</p>
                </div>
                <div className="flex gap-2">
                  <GhostButton onClick={() => startEdit(s)}>Muokkaa</GhostButton>
                  <DangerButton onClick={() => onDelete(s)}>Poista</DangerButton>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

// ── Program ─────────────────────────────────────────────────────────────────

interface ProgramItem {
  id: string;
  label: string;
  sort_order: number;
  published: boolean;
}

interface ProgramForm {
  label: string;
  sort_order: number;
  published: boolean;
}

const EMPTY_PROGRAM: ProgramForm = { label: '', sort_order: 0, published: true };

function ProgramManager() {
  const [items, setItems] = useState<ProgramItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProgramForm>(EMPTY_PROGRAM);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = async () => {
    if (!supabase) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('event_program')
      .select('*')
      .order('sort_order', { ascending: true });
    if (error) setError(error.message);
    setItems((data ?? []) as ProgramItem[]);
    setLoading(false);
  };

  useEffect(() => {
    refresh();
  }, []);

  const startNew = () => {
    setEditingId(null);
    setForm(EMPTY_PROGRAM);
    setError(null);
  };

  const startEdit = (p: ProgramItem) => {
    setEditingId(p.id);
    setForm({ label: p.label, sort_order: p.sort_order, published: p.published });
    setError(null);
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!supabase) return;
    setBusy(true);
    setError(null);

    const payload = {
      label: form.label.trim(),
      sort_order: Number(form.sort_order) || 0,
      published: form.published,
    };

    const { error } = editingId
      ? await supabase.from('event_program').update(payload).eq('id', editingId)
      : await supabase.from('event_program').insert(payload);

    setBusy(false);
    if (error) {
      setError(error.message);
      return;
    }
    setForm(EMPTY_PROGRAM);
    setEditingId(null);
    await refresh();
  };

  const onDelete = async (p: ProgramItem) => {
    if (!supabase) return;
    if (!confirm(`Poistetaanko ohjelmakohta "${p.label}"?`)) return;
    const { error } = await supabase.from('event_program').delete().eq('id', p.id);
    if (error) {
      alert(error.message);
      return;
    }
    if (editingId === p.id) {
      setEditingId(null);
      setForm(EMPTY_PROGRAM);
    }
    await refresh();
  };

  return (
    <section className="mt-16">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="font-display text-2xl text-cream">Ohjelma</p>
          <p className="mt-1 text-sm text-cream/55">"Ohjelmassa"-listan kohdat.</p>
        </div>
        {editingId && <GhostButton onClick={startNew}>Uusi kohta</GhostButton>}
      </div>

      <form onSubmit={onSubmit} className="mt-5 rounded-lg border border-cream/10 bg-forest-deep p-6 md:p-8">
        <p className="font-display text-xl text-cream">
          {editingId ? 'Muokkaa ohjelmakohtaa' : 'Uusi ohjelmakohta'}
        </p>
        <div className="mt-5 grid gap-4 md:grid-cols-[1fr,auto]">
          <Field label="Teksti" hint="esim. Livemusiikkia">
            <input
              required
              value={form.label}
              onChange={(e) => setForm({ ...form, label: e.target.value })}
              className={inputClass}
              placeholder="Livemusiikkia"
            />
          </Field>
          <Field label="Järjestys">
            <input
              type="number"
              value={form.sort_order}
              onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })}
              className={inputClass}
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
            {busy ? 'Tallennetaan…' : editingId ? 'Tallenna muutokset' : 'Lisää kohta'}
          </PrimaryButton>
          {editingId && (
            <GhostButton type="button" onClick={startNew}>
              Peruuta
            </GhostButton>
          )}
        </div>
      </form>

      <div className="mt-8">
        {loading ? (
          <p className="text-cream/60">Ladataan…</p>
        ) : items.length === 0 ? (
          <p className="text-cream/60">Ei vielä ohjelmakohtia. Lisää ensimmäinen yllä.</p>
        ) : (
          <ul className="space-y-2">
            {items.map((p) => (
              <li
                key={p.id}
                className="flex items-center justify-between gap-4 rounded-lg border border-cream/10 bg-forest-deep px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber" />
                  <span className="text-cream/85">{p.label}</span>
                  {!p.published && (
                    <span className="rounded-full bg-cream/10 px-2 py-0.5 text-[10px] uppercase tracking-widest text-cream/55">
                      Luonnos
                    </span>
                  )}
                  <span className="text-xs text-cream/40">#{p.sort_order}</span>
                </div>
                <div className="flex gap-2">
                  <GhostButton onClick={() => startEdit(p)}>Muokkaa</GhostButton>
                  <DangerButton onClick={() => onDelete(p)}>Poista</DangerButton>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

// ── Credits (performers / partners / exhibitors) ─────────────────────────────

type CreditCategory = 'performer' | 'partner' | 'exhibitor';

const CREDIT_CATEGORIES: { value: CreditCategory; label: string }[] = [
  { value: 'performer', label: 'Esiintyjä' },
  { value: 'partner', label: 'Kumppani' },
  { value: 'exhibitor', label: 'Näytteilleasettaja' },
];

const CREDIT_LABEL: Record<CreditCategory, string> = {
  performer: 'Esiintyjä',
  partner: 'Kumppani',
  exhibitor: 'Näytteilleasettaja',
};

interface Credit {
  id: string;
  category: CreditCategory;
  name: string;
  year: string | null;
  url: string | null;
  sort_order: number;
  published: boolean;
}

interface CreditForm {
  category: CreditCategory;
  name: string;
  year: string;
  url: string;
  sort_order: number;
  published: boolean;
}

const EMPTY_CREDIT: CreditForm = {
  category: 'performer',
  name: '',
  year: '2025',
  url: '',
  sort_order: 0,
  published: true,
};

function CreditsManager() {
  const [items, setItems] = useState<Credit[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<CreditForm>(EMPTY_CREDIT);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = async () => {
    if (!supabase) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('event_credits')
      .select('*')
      .order('category', { ascending: true })
      .order('sort_order', { ascending: true });
    if (error) setError(error.message);
    setItems((data ?? []) as Credit[]);
    setLoading(false);
  };

  useEffect(() => {
    refresh();
  }, []);

  const startNew = () => {
    setEditingId(null);
    setForm(EMPTY_CREDIT);
    setError(null);
  };

  const startEdit = (c: Credit) => {
    setEditingId(c.id);
    setForm({
      category: c.category,
      name: c.name,
      year: c.year ?? '',
      url: c.url ?? '',
      sort_order: c.sort_order,
      published: c.published,
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
      category: form.category,
      name: form.name.trim(),
      year: form.year.trim() || null,
      url: form.url.trim() || null,
      sort_order: Number(form.sort_order) || 0,
      published: form.published,
    };

    const { error } = editingId
      ? await supabase.from('event_credits').update(payload).eq('id', editingId)
      : await supabase.from('event_credits').insert(payload);

    setBusy(false);
    if (error) {
      setError(error.message);
      return;
    }
    setForm(EMPTY_CREDIT);
    setEditingId(null);
    await refresh();
  };

  const onDelete = async (c: Credit) => {
    if (!supabase) return;
    if (!confirm(`Poistetaanko "${c.name}"?`)) return;
    const { error } = await supabase.from('event_credits').delete().eq('id', c.id);
    if (error) {
      alert(error.message);
      return;
    }
    if (editingId === c.id) {
      setEditingId(null);
      setForm(EMPTY_CREDIT);
    }
    await refresh();
  };

  return (
    <section className="mt-16">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="font-display text-2xl text-cream">Esiintyjät, kumppanit ja näyttely</p>
          <p className="mt-1 text-sm text-cream/55">
            Vuosittaiset nimet, jotka näkyvät tapahtumasivun ohjelma- ja kumppaniosioissa.
          </p>
        </div>
        {editingId && <GhostButton onClick={startNew}>Uusi nimi</GhostButton>}
      </div>

      <form onSubmit={onSubmit} className="mt-5 rounded-lg border border-cream/10 bg-forest-deep p-6 md:p-8">
        <p className="font-display text-xl text-cream">
          {editingId ? 'Muokkaa nimeä' : 'Uusi nimi'}
        </p>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <Field label="Tyyppi">
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value as CreditCategory })}
              className={inputClass}
            >
              {CREDIT_CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Nimi">
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={inputClass}
              placeholder="Partioaitta"
            />
          </Field>
          <Field label="Vuosi" hint="esim. 2025">
            <input
              value={form.year}
              onChange={(e) => setForm({ ...form, year: e.target.value })}
              className={inputClass}
              placeholder="2025"
            />
          </Field>
          <Field label="Järjestys" hint="Pienempi = ensin">
            <input
              type="number"
              value={form.sort_order}
              onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })}
              className={inputClass}
            />
          </Field>
          <div className="md:col-span-2">
            <Field label="Linkki" hint="Valinnainen">
              <input
                type="url"
                value={form.url}
                onChange={(e) => setForm({ ...form, url: e.target.value })}
                className={inputClass}
                placeholder="https://…"
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
            {busy ? 'Tallennetaan…' : editingId ? 'Tallenna muutokset' : 'Lisää nimi'}
          </PrimaryButton>
          {editingId && (
            <GhostButton type="button" onClick={startNew}>
              Peruuta
            </GhostButton>
          )}
        </div>
      </form>

      <div className="mt-8">
        {loading ? (
          <p className="text-cream/60">Ladataan…</p>
        ) : items.length === 0 ? (
          <p className="text-cream/60">Ei vielä nimiä. Lisää ensimmäinen yllä.</p>
        ) : (
          <ul className="space-y-2">
            {items.map((c) => (
              <li
                key={c.id}
                className="flex items-center justify-between gap-4 rounded-lg border border-cream/10 bg-forest-deep px-4 py-3"
              >
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full bg-amber/15 px-2 py-0.5 text-[10px] uppercase tracking-widest text-amber">
                    {CREDIT_LABEL[c.category]}
                  </span>
                  <span className="text-cream/85">{c.name}</span>
                  {c.year && <span className="text-xs text-cream/40">{c.year}</span>}
                  {!c.published && (
                    <span className="rounded-full bg-cream/10 px-2 py-0.5 text-[10px] uppercase tracking-widest text-cream/55">
                      Luonnos
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <GhostButton onClick={() => startEdit(c)}>Muokkaa</GhostButton>
                  <DangerButton onClick={() => onDelete(c)}>Poista</DangerButton>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

export default function EventAdmin() {
  return (
    <div className="mx-auto max-w-5xl">
      <AdminPageHeader
        eyebrow="Sisältö"
        title="Tapahtuma 5.9."
      />
      <ScheduleManager />
      <ProgramManager />
      <CreditsManager />
    </div>
  );
}
