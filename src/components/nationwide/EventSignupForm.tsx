import { useState, type ChangeEvent, type FormEvent } from 'react';
import { supabase, SUPABASE_CONFIGURED } from '../../lib/supabase';
import { COMMUNITY_BUCKET, prepareCommunityImage, uploadToStorage } from '../../lib/storage';
import {
  CONTACT_OPTIONS,
  DESCRIPTION_MAX_WORDS,
  countWords,
  type ContactType,
  DURATION_OPTIONS,
  FINNISH_CITIES,
  cityCoords,
} from '../../lib/communityEvents';

const EMPTY = {
  organizer_name: '',
  organizer_email: '',
  city: '',
  event_date: '2026-09-05',
  start_time: '11:00',
  duration_minutes: 120,
  description: '',
  image_url: '',
  is_public: false,
  contact_type: '' as '' | ContactType,
  contact_value: '',
};

/** crypto.randomUUID needs a secure context; fall back for older browsers. */
function newId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}

// An explicit height rather than vertical padding, because browsers give
// <select> its own intrinsic height and largely ignore padding on it. Without
// this the two dropdowns sit shorter than the text fields beside them.
const FIELD_H = 'h-12';

const inputCls =
  `w-full ${FIELD_H} rounded border border-cream/20 bg-forest-night/60 px-4 text-sm text-cream ` +
  'placeholder:text-cream/35 focus:border-amber focus:outline-none';

// appearance-none drops the platform chevron along with the platform sizing,
// so the arrow below is drawn back in.
const selectCls = `${inputCls} cursor-pointer appearance-none pr-10`;

/** Wraps a <select> so it can carry its own chevron. */
function SelectField({ children }: { children: React.ReactNode }) {
  return (
    <span className="relative block">
      {children}
      <svg
        aria-hidden="true"
        width="12"
        height="12"
        viewBox="0 0 16 16"
        fill="none"
        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-cream/50"
      >
        <path d="M3 6l5 5 5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

function Label({ children, hint }: { children: string; hint?: string }) {
  return (
    <span className="mb-1.5 block">
      <span className="text-xs font-semibold uppercase tracking-widest text-cream/70">
        {children}
      </span>
      {hint && <span className="ml-2 text-xs text-cream/40">{hint}</span>}
    </span>
  );
}

export default function EventSignupForm() {
  const [form, setForm] = useState({ ...EMPTY });
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const words = countWords(form.description);
  const overWordLimit = words > DESCRIPTION_MAX_WORDS;

  const onUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      // Validate and shrink first: this form is public, and a phone photo is
      // several megabytes straight off the camera.
      const prepared = await prepareCommunityImage(file);
      const { url } = await uploadToStorage(prepared, '', COMMUNITY_BUCKET);
      set('image_url', url);
    } catch (err) {
      setError(
        err instanceof Error
          ? `Kuvan lataus ei onnistunut: ${err.message}`
          : 'Kuvan lataus ei onnistunut.'
      );
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!SUPABASE_CONFIGURED || !supabase) {
      setError('Lomake on käytössä vasta julkaistulla sivustolla.');
      return;
    }
    if (overWordLimit) {
      setError(`Kuvaus saa olla enintään ${DESCRIPTION_MAX_WORDS} sanaa.`);
      return;
    }

    setBusy(true);
    const coords = cityCoords(form.city);
    // The id is generated here rather than read back after the insert. Asking
    // Postgres to return the new row requires a SELECT policy that matches it,
    // and the only public one covers approved rows; a freshly inserted pending
    // row is invisible, which PostgREST reports as an RLS violation on insert.
    const id = newId();
    const payload = {
      id,
      organizer_name: form.organizer_name.trim(),
      organizer_email: form.organizer_email.trim(),
      city: form.city,
      lat: coords?.lat ?? null,
      lng: coords?.lng ?? null,
      event_date: form.event_date,
      start_time: form.start_time || null,
      duration_minutes: Number(form.duration_minutes),
      description: form.description.trim(),
      image_url: form.image_url.trim() || null,
      is_public: form.is_public,
      status: 'pending' as const,
      // Contact details belong to open events only, so a box unticked after
      // typing something does not quietly publish it. The keys are omitted
      // rather than sent as null when unused: PostgREST rejects the whole
      // insert for an unknown column, so sending them always would let a
      // pending migration break every sign-up, not just the ones using this.
      ...(form.is_public && form.contact_type
        ? {
            contact_type: form.contact_type,
            contact_value: form.contact_value.trim() || null,
          }
        : {}),
    };

    const { error: insertError } = await supabase.from('community_events').insert(payload);

    if (insertError) {
      setBusy(false);
      setError(`Ilmoituksen tallennus ei onnistunut: ${insertError.message}`);
      return;
    }

    // Notify Eino and confirm to the organiser. The submission is already
    // saved, so a mail failure must not look like a failed sign-up: it is
    // logged and the volunteer still gets the thank-you screen.
    try {
      await fetch('/.netlify/functions/notify-event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
    } catch (err) {
      console.warn('Sähköposti-ilmoitusta ei voitu lähettää', err);
    }

    setBusy(false);
    setDone(true);
    setForm({ ...EMPTY });
  };

  if (done) {
    return (
      <div className="border border-amber/40 bg-forest-night/40 p-8 text-center">
        <p className="font-display text-3xl text-amber md:text-4xl">Kiitos, että olet mukana.</p>
        <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-cream/80">
          Ilmoituksesi on nyt matkalla Einolle. Kun se on hyväksytty, osallistumisesi näkyy
          kartalla ja listalla. Saat vahvistuksen sähköpostiisi.
        </p>
        <button
          type="button"
          onClick={() => setDone(false)}
          className="ghost-cta mt-8 rounded-full px-7 py-3 text-xs font-semibold uppercase tracking-widest text-cream"
        >
          Tee uusi ilmoitus
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <Label>Nimi</Label>
          <input
            required
            minLength={2}
            maxLength={80}
            value={form.organizer_name}
            onChange={(e) => set('organizer_name', e.target.value)}
            className={inputCls}
            placeholder="Etunimi Sukunimi tai yhteisö"
          />
        </label>

        <label className="block">
          <Label>Sähköposti</Label>
          <input
            required
            type="email"
            maxLength={120}
            value={form.organizer_email}
            onChange={(e) => set('organizer_email', e.target.value)}
            className={inputCls}
            placeholder="nimi@esimerkki.fi"
          />
        </label>

        <label className="block">
          <Label>Paikkakunta</Label>
          <SelectField>
            <select
              required
              value={form.city}
              onChange={(e) => set('city', e.target.value)}
              className={selectCls}
            >
              <option value="" disabled>
                Valitse paikkakunta
              </option>
              {FINNISH_CITIES.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </SelectField>
        </label>

        <label className="block">
          <Label>Päivämäärä</Label>
          <input
            required
            type="date"
            value={form.event_date}
            onChange={(e) => set('event_date', e.target.value)}
            className={inputCls}
          />
        </label>

        <label className="block">
          <Label>Alkamisaika</Label>
          <input
            required
            type="time"
            value={form.start_time}
            onChange={(e) => set('start_time', e.target.value)}
            className={inputCls}
          />
        </label>

        <label className="block">
          <Label>Kesto</Label>
          <SelectField>
            <select
              value={form.duration_minutes}
              onChange={(e) => set('duration_minutes', Number(e.target.value))}
              className={selectCls}
            >
              {DURATION_OPTIONS.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.label}
                </option>
              ))}
            </select>
          </SelectField>
        </label>

        <label className="block sm:col-span-2">
          <Label hint={`${words}/${DESCRIPTION_MAX_WORDS} sanaa`}>Kuvaus</Label>
          <textarea
            required
            rows={5}
            value={form.description}
            onChange={(e) => set('description', e.target.value)}
            className={`${inputCls} h-auto min-h-[7rem] resize-y py-3 leading-relaxed`}
            placeholder="Kerro lyhyesti mitä olette tekemässä, mistä lähdette liikkeelle ja kenelle tapahtuma sopii."
          />
          {overWordLimit && (
            <span className="mt-1.5 block text-xs text-amber">
              Kuvaus on {words - DESCRIPTION_MAX_WORDS} sanaa liian pitkä.
            </span>
          )}
        </label>

        <label className="flex cursor-pointer items-start gap-3 rounded border border-cream/15 bg-forest-night/40 p-4 sm:col-span-2">
          <input
            type="checkbox"
            checked={form.is_public}
            onChange={(e) => set('is_public', e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 accent-amber"
          />
          <span>
            <span className="block text-sm font-semibold text-cream">
              Tapahtuma on avoin kaikille
            </span>
            <span className="mt-1 block text-xs leading-relaxed text-cream/55">
              Rastita, jos muut saavat tulla mukaan. Avoimet tapahtumat erottuvat
              kartalla ja listalla, jotta niihin voi liittyä. Jätä tyhjäksi, jos siivoat
              omalla porukalla.
            </span>
          </span>
        </label>

        {form.is_public && (
          <div className="grid gap-4 sm:col-span-2 sm:grid-cols-2">
            <label className="block">
              <Label hint="vapaaehtoinen">Miten mukaan?</Label>
              <SelectField>
                <select
                  value={form.contact_type}
                  onChange={(e) =>
                    set('contact_type', e.target.value as '' | ContactType)
                  }
                  className={selectCls}
                >
                  <option value="">Ei erillistä ilmoittautumista</option>
                  {CONTACT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </SelectField>
            </label>

            {form.contact_type && (
              <label className="block">
                <Label hint="näkyy julkisesti">
                  {CONTACT_OPTIONS.find((o) => o.value === form.contact_type)?.label ?? 'Linkki'}
                </Label>
                <input
                  required
                  type={form.contact_type === 'email' ? 'email' : 'url'}
                  maxLength={200}
                  value={form.contact_value}
                  onChange={(e) => set('contact_value', e.target.value)}
                  className={inputCls}
                  placeholder={
                    CONTACT_OPTIONS.find((o) => o.value === form.contact_type)?.hint
                  }
                />
              </label>
            )}
          </div>
        )}

        <div className="sm:col-span-2">
          <Label hint="vapaaehtoinen, enintään 25 Mt">Kuva</Label>
          <div className="flex flex-wrap items-center gap-4">
            <label className="inline-flex cursor-pointer items-center">
              <input type="file" accept="image/*" onChange={onUpload} className="hidden" />
              <span className="ghost-cta rounded-full px-6 py-3 text-xs font-semibold uppercase tracking-widest text-cream">
                {uploading ? 'Ladataan…' : 'Valitse kuva'}
              </span>
            </label>
            {form.image_url && (
              <span className="flex items-center gap-3">
                <img
                  src={form.image_url}
                  alt=""
                  className="h-12 w-16 rounded object-cover"
                />
                <button
                  type="button"
                  onClick={() => set('image_url', '')}
                  className="text-xs uppercase tracking-widest text-cream/50 underline-offset-2 hover:text-cream"
                >
                  Poista
                </button>
              </span>
            )}
          </div>
        </div>
      </div>

      {error && <p className="mt-5 text-sm text-red-400">{error}</p>}

      <div className="mt-8 flex flex-wrap items-center gap-5">
        <button
          type="submit"
          disabled={busy || uploading || overWordLimit}
          className="rounded-full bg-amber px-8 py-3.5 text-xs font-semibold uppercase tracking-widest text-forest-night transition hover:bg-amber-light disabled:opacity-50"
        >
          {busy ? 'Lähetetään…' : 'Lähetä ilmoitus'}
        </button>
        <p className="text-xs leading-relaxed text-cream/45">
          Ilmoitus ei sido mihinkään. Eino käy ilmoitukset läpi ennen julkaisua.
        </p>
      </div>
    </form>
  );
}
