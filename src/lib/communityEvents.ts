import { MUNICIPALITIES } from './finnishMunicipalities';
// Nationwide Roskapäivä: types, the city list behind the sign-up dropdown, and
// the statistics derived from approved events.

export interface CommunityEvent {
  id?: string;
  city: string;
  lat: number | null;
  lng: number | null;
  event_date: string;
  start_time: string | null;
  duration_minutes: number;
  description: string;
  image_url: string | null;
  participants: number | null;
  waste_kg: number | null;
  /** Who is running it. The organiser's e-mail is never exposed publicly. */
  organizer_name?: string | null;
  /** The Kallio main event, pinned to the top of the list. */
  featured?: boolean;
  /** Open for anyone to join, as opposed to someone tidying their own street. */
  is_public?: boolean;
  /** Optional way to reach an open event. Published only when is_public. */
  contact_type?: ContactType | null;
  contact_value?: string | null;
}

/**
 * How precisely the organiser placed themselves on the map. Only the resolved
 * lat/lng is published: the district name and the street address stay in the
 * base table, out of community_events_public.
 */
export type LocationPrecision = 'city' | 'district' | 'address';

export const LOCATION_OPTIONS: { value: LocationPrecision; label: string; hint: string }[] = [
  { value: 'city', label: 'Vain paikkakunta', hint: 'Merkki asetetaan paikkakunnan keskustaan.' },
  { value: 'district', label: 'Kaupunginosa', hint: 'Merkki asetetaan kaupunginosan kohdalle.' },
  { value: 'address', label: 'Tarkka osoite', hint: 'Merkki asetetaan juuri tähän osoitteeseen.' },
];

/** Descriptions are limited by words, which reads better to a volunteer than
 *  a character count. The database keeps a 2000-character ceiling as a
 *  backstop; 200 Finnish words fit inside it comfortably. */
export type ContactType = 'email' | 'website' | 'form';

export const CONTACT_OPTIONS: { value: ContactType; label: string; hint: string }[] = [
  { value: 'form', label: 'Ilmoittautumislomake', hint: 'https://…' },
  { value: 'website', label: 'Verkkosivu', hint: 'https://…' },
  { value: 'email', label: 'Sähköposti', hint: 'nimi@esimerkki.fi' },
];

/** The link shown in the list, or null when the organiser gave no contact. */
export function contactLink(
  e: { is_public?: boolean; contact_type?: ContactType | null; contact_value?: string | null }
): { href: string; label: string } | null {
  if (!e.is_public || !e.contact_type || !e.contact_value) return null;
  const v = e.contact_value.trim();
  if (!v) return null;
  if (e.contact_type === 'email') {
    return { href: `mailto:${v}`, label: 'Ota yhteyttä' };
  }
  const href = /^https?:\/\//i.test(v) ? v : `https://${v}`;
  return { href, label: e.contact_type === 'form' ? 'Ilmoittaudu' : 'Lisätietoja' };
}

export const DESCRIPTION_MAX_WORDS = 200;

/**
 * Sign-ups arrive with the organiser's own line breaks, and at 200 words those
 * breaks are what makes a description readable rather than one blob. Keep them,
 * but cap runs of blank lines so a stray paste cannot leave a chasm in the list.
 */
export function normalizeDescription(text: string): string {
  return text
    .replace(/\r\n?/g, '\n')
    .replace(/[ \t]+$/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export function countWords(text: string): number {
  const t = text.trim();
  return t ? t.split(/\s+/).length : 0;
}

/** Shown in the list when a sign-up has no photo of its own. Open events get
 *  a group shot, private ones a lone volunteer, so the thumbnail alone hints
 *  at whether you would be welcome to turn up. */
export const DEFAULT_EVENT_IMAGE = '/default-event.jpg';
export const DEFAULT_PUBLIC_EVENT_IMAGE = '/default-public-event.jpg';

export function defaultImageFor(event: { is_public?: boolean }): string {
  return event.is_public ? DEFAULT_PUBLIC_EVENT_IMAGE : DEFAULT_EVENT_IMAGE;
}

/** Duration options offered in the form, in minutes. */
export const DURATION_OPTIONS = [
  { value: 60, label: '1 tunti' },
  { value: 90, label: '1,5 tuntia' },
  { value: 120, label: '2 tuntia' },
  { value: 180, label: '3 tuntia' },
  { value: 240, label: '4 tuntia' },
  { value: 360, label: '6 tuntia' },
  { value: 480, label: 'Koko päivä' },
];

/**
 * Municipalities offered in the dropdown, with coordinates so every submission
 * lands on the map without a geocoding round-trip. A fixed list also keeps the
 * data clean enough to group and count by city.
 */
/**
 * Every municipality, with coordinates — see finnishMunicipalities.ts, which is
 * generated from Statistics Finland's official classification. Kept exported
 * under the old name so existing callers do not care that the list went from
 * 56 hand-picked towns to all 308.
 */
export const FINNISH_CITIES: { name: string; lat: number; lng: number }[] = MUNICIPALITIES.map(
  ({ name, lat, lng }) => ({ name, lat, lng })
);

/** Middle of the country, for "Muu paikkakunta" and anything unrecognised. */
const COUNTRY_CENTRE = { lat: 64.6, lng: 26.0 };

export function cityCoords(name: string) {
  const hit = MUNICIPALITIES.find((c) => c.name === name);
  if (hit) return { lat: hit.lat, lng: hit.lng };
  // A municipality that has since been merged away, or the deliberate
  // "somewhere else" option: still place the pin rather than dropping the event.
  return name ? COUNTRY_CENTRE : null;
}

export interface EventStats {
  events: number;
  cities: number;
  hours: number;
  wasteKg: number;
  participants: number;
}

export function calcStats(events: CommunityEvent[]): EventStats {
  const cities = new Set(events.map((e) => e.city));
  return {
    events: events.length,
    cities: cities.size,
    // Talkootunnit: each event's duration multiplied by the people on site.
    // Events without a headcount yet still count once, so the figure only ever
    // understates the real total.
    hours: Math.round(
      events.reduce(
        (sum, e) => sum + (e.duration_minutes / 60) * Math.max(1, e.participants ?? 1),
        0
      )
    ),
    wasteKg: Math.round(events.reduce((sum, e) => sum + (e.waste_kg ?? 0), 0)),
    participants: events.reduce((sum, e) => sum + (e.participants ?? 0), 0),
  };
}

const MONTHS_FI = [
  'tammikuuta', 'helmikuuta', 'maaliskuuta', 'huhtikuuta', 'toukokuuta', 'kesäkuuta',
  'heinäkuuta', 'elokuuta', 'syyskuuta', 'lokakuuta', 'marraskuuta', 'joulukuuta',
];

export function formatEventDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  if (!y || !m || !d) return iso;
  return `${d}. ${MONTHS_FI[m - 1]} ${y}`;
}

/** '11:00:00' -> '11.00' */
export function formatTime(t: string | null): string | null {
  if (!t) return null;
  const [h, min] = t.split(':');
  return `${Number(h)}.${min ?? '00'}`;
}

export function formatDuration(minutes: number): string {
  if (minutes >= 480) return 'Koko päivä';
  const h = minutes / 60;
  return Number.isInteger(h) ? `${h} h` : `${String(h).replace('.', ',')} h`;
}

/** Shown before Supabase is configured, so the section is never empty. */
export const FALLBACK_COMMUNITY_EVENTS: CommunityEvent[] = [
  {
    id: 'demo-1', organizer_name: 'Roskapäivä', is_public: true, city: 'Helsinki', lat: 60.1699, lng: 24.9384,
    event_date: '2026-09-05', start_time: '11:00:00', duration_minutes: 180,
    description: 'Kallion päätapahtuma ja koko korttelin siivous',
    image_url: null, participants: 150, waste_kg: 240, featured: true,
  },
  {
    id: 'demo-2', organizer_name: 'Tampereen ympäristöyhdistys', is_public: true, city: 'Tampere', lat: 61.4978, lng: 23.761,
    event_date: '2026-09-05', start_time: '10:00:00', duration_minutes: 120,
    description: 'Näsijärven rantojen siivoustalkoot', image_url: null,
    participants: 40, waste_kg: 65,
  },
  {
    id: 'demo-3', organizer_name: 'Aurajoen ystävät', city: 'Turku', lat: 60.4518, lng: 22.2666,
    event_date: '2026-09-05', start_time: '12:00:00', duration_minutes: 120,
    description: 'Aurajoen varsi kuntoon yhdessä', image_url: null,
    participants: 25, waste_kg: 38,
  },
  {
    id: 'demo-4', organizer_name: 'Oulun perhekerho', is_public: true, city: 'Oulu', lat: 65.0121, lng: 25.4651,
    event_date: '2026-09-05', start_time: '11:00:00', duration_minutes: 90,
    description: 'Hupisaarten puistosiivous perheille', image_url: null,
    participants: 30, waste_kg: 22,
  },
  {
    id: 'demo-5', organizer_name: 'Ounasvaaran retkeilijät', city: 'Rovaniemi', lat: 66.5039, lng: 25.7294,
    event_date: '2026-09-05', start_time: '13:00:00', duration_minutes: 120,
    description: 'Ounasvaaran polkujen roskaretki', image_url: null,
    participants: 18, waste_kg: 14,
  },
  {
    id: 'demo-6', organizer_name: 'Jyväskylän partiolaiset', city: 'Jyväskylä', lat: 62.2426, lng: 25.7473,
    event_date: '2026-09-05', start_time: '10:30:00', duration_minutes: 120,
    description: 'Jyväsjärven ranta siistiksi', image_url: null,
    participants: 22, waste_kg: 30,
  },
  {
    id: 'demo-7', organizer_name: 'Kuopion keskustan asukkaat', city: 'Kuopio', lat: 62.8924, lng: 27.677,
    event_date: '2026-09-05', start_time: '11:00:00', duration_minutes: 120,
    description: 'Sataman ja torin siivous', image_url: null,
    participants: 16, waste_kg: 19,
  },
  {
    id: 'demo-8', organizer_name: 'Vaasan rantaporukka', city: 'Vaasa', lat: 63.096, lng: 21.6158,
    event_date: '2026-09-05', start_time: '12:00:00', duration_minutes: 90,
    description: 'Rantabulevardin roskienkeruu', image_url: null,
    participants: 14, waste_kg: 11,
  },
];
