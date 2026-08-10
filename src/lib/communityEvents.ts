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
export const FINNISH_CITIES: { name: string; lat: number; lng: number }[] = [
  { name: 'Helsinki', lat: 60.1699, lng: 24.9384 },
  { name: 'Espoo', lat: 60.2055, lng: 24.6559 },
  { name: 'Vantaa', lat: 60.2934, lng: 25.0378 },
  { name: 'Kauniainen', lat: 60.2118, lng: 24.7288 },
  { name: 'Tampere', lat: 61.4978, lng: 23.761 },
  { name: 'Turku', lat: 60.4518, lng: 22.2666 },
  { name: 'Oulu', lat: 65.0121, lng: 25.4651 },
  { name: 'Jyväskylä', lat: 62.2426, lng: 25.7473 },
  { name: 'Lahti', lat: 60.9827, lng: 25.6612 },
  { name: 'Kuopio', lat: 62.8924, lng: 27.677 },
  { name: 'Pori', lat: 61.4851, lng: 21.7974 },
  { name: 'Kouvola', lat: 60.8679, lng: 26.7042 },
  { name: 'Joensuu', lat: 62.6012, lng: 29.7636 },
  { name: 'Lappeenranta', lat: 61.0587, lng: 28.1887 },
  { name: 'Hämeenlinna', lat: 60.9959, lng: 24.4643 },
  { name: 'Vaasa', lat: 63.096, lng: 21.6158 },
  { name: 'Seinäjoki', lat: 62.7903, lng: 22.8403 },
  { name: 'Rovaniemi', lat: 66.5039, lng: 25.7294 },
  { name: 'Mikkeli', lat: 61.6886, lng: 27.2723 },
  { name: 'Kotka', lat: 60.4664, lng: 26.9458 },
  { name: 'Salo', lat: 60.3833, lng: 23.1333 },
  { name: 'Porvoo', lat: 60.3932, lng: 25.6639 },
  { name: 'Kokkola', lat: 63.8376, lng: 23.132 },
  { name: 'Hyvinkää', lat: 60.6306, lng: 24.8598 },
  { name: 'Nurmijärvi', lat: 60.4642, lng: 24.8072 },
  { name: 'Järvenpää', lat: 60.4736, lng: 25.09 },
  { name: 'Rauma', lat: 61.1288, lng: 21.5114 },
  { name: 'Kajaani', lat: 64.2273, lng: 27.7285 },
  { name: 'Kerava', lat: 60.4022, lng: 25.1029 },
  { name: 'Savonlinna', lat: 61.8699, lng: 28.8783 },
  { name: 'Nokia', lat: 61.4781, lng: 23.5089 },
  { name: 'Kaarina', lat: 60.4072, lng: 22.3699 },
  { name: 'Ylöjärvi', lat: 61.5533, lng: 23.5964 },
  { name: 'Kirkkonummi', lat: 60.1256, lng: 24.4381 },
  { name: 'Tuusula', lat: 60.4028, lng: 25.0292 },
  { name: 'Kangasala', lat: 61.4639, lng: 24.0714 },
  { name: 'Riihimäki', lat: 60.7375, lng: 24.7725 },
  { name: 'Raisio', lat: 60.4858, lng: 22.1692 },
  { name: 'Imatra', lat: 61.1719, lng: 28.7561 },
  { name: 'Sastamala', lat: 61.3406, lng: 22.9086 },
  { name: 'Raahe', lat: 64.6842, lng: 24.4795 },
  { name: 'Hamina', lat: 60.5697, lng: 27.1978 },
  { name: 'Iisalmi', lat: 63.5608, lng: 27.1908 },
  { name: 'Varkaus', lat: 62.3151, lng: 27.8714 },
  { name: 'Tornio', lat: 65.8481, lng: 24.1447 },
  { name: 'Kemi', lat: 65.7362, lng: 24.5637 },
  { name: 'Kuusamo', lat: 65.9667, lng: 29.1833 },
  { name: 'Kokemäki', lat: 61.2547, lng: 22.3564 },
  { name: 'Pietarsaari', lat: 63.6753, lng: 22.7028 },
  { name: 'Uusikaupunki', lat: 60.8003, lng: 21.4083 },
  { name: 'Valkeakoski', lat: 61.2642, lng: 24.0314 },
  { name: 'Lohja', lat: 60.2503, lng: 24.0653 },
  { name: 'Mariehamn', lat: 60.0971, lng: 19.9349 },
  { name: 'Inari', lat: 68.9056, lng: 27.0289 },
  { name: 'Sodankylä', lat: 67.4167, lng: 26.6 },
  { name: 'Muu paikkakunta', lat: 62.5, lng: 25.5 },
];

export function cityCoords(name: string) {
  return FINNISH_CITIES.find((c) => c.name === name) ?? null;
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
