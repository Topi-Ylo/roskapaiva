// Types, date helpers and fallback content for the Tapahtumat (events calendar)
// feature. CMS-driven via the Supabase `events` table; the fallbacks keep the
// page rendered when Supabase isn't configured or the table is empty.

export interface EventItem {
  id?: string;
  title: string;
  subtitle: string | null;
  /** ISO date 'YYYY-MM-DD'. Null = ajankohta auki (treated as upcoming). */
  event_date: string | null;
  /** Optional display override, e.g. "Vappu 2026" when the exact date is fuzzy. */
  date_label: string | null;
  location: string | null;
  type: string | null;
  image_url: string | null;
  description: string | null;
  body: string | null;
  link_url: string | null;
  link_label: string | null;
  sort_order: number;
}

const MONTHS_FI = [
  'Tammi', 'Helmi', 'Maalis', 'Huhti', 'Touko', 'Kesä',
  'Heinä', 'Elo', 'Syys', 'Loka', 'Marras', 'Joulu',
];

/** Parse an ISO date as local midnight (avoids UTC off-by-one in comparisons). */
function parseLocal(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

/** Upcoming = no date yet, or the date is today or later. */
export function isUpcoming(e: EventItem): boolean {
  if (!e.event_date) return true;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return parseLocal(e.event_date) >= today;
}

export function eventDay(e: EventItem): string | null {
  if (!e.event_date) return null;
  return String(parseLocal(e.event_date).getDate()).padStart(2, '0');
}

export function eventMonth(e: EventItem): string | null {
  if (!e.event_date) return null;
  return MONTHS_FI[parseLocal(e.event_date).getMonth()];
}

/** Human display date: explicit label wins, else formatted date, else TBA. */
export function eventDateLabel(e: EventItem): string {
  if (e.date_label) return e.date_label;
  if (!e.event_date) return 'Ajankohta tarkentuu';
  const d = parseLocal(e.event_date);
  return `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}.${d.getFullYear()}`;
}

/** Sort upcoming soonest-first, past most-recent-first. Undated sort to the top of upcoming. */
export function sortEvents(list: EventItem[], upcoming: boolean): EventItem[] {
  return [...list].sort((a, b) => {
    if (!a.event_date) return -1;
    if (!b.event_date) return 1;
    const cmp = parseLocal(a.event_date).getTime() - parseLocal(b.event_date).getTime();
    return upcoming ? cmp : -cmp;
  });
}

export const FALLBACK_EVENTS: EventItem[] = [
  {
    title: 'Roskapäivä 2026',
    subtitle: null,
    event_date: '2026-09-05',
    date_label: '5.9.2026',
    location: 'Karhupuisto & Kohde Helsinki',
    type: 'Siivoustapahtuma',
    image_url: 'https://www.mustankorkea.fi/wp-content/uploads/2024/09/roskapaiva-4.jpg',
    description:
      'Vuotuinen Roskapäivä valtaa Helsingin: siivoustapahtuma Karhupuistossa klo 11–14 ja afterpartyt kivenheiton päässä Kohde Helsingissä klo 14–16.30.',
    body:
      'Kerätään yhdessä roskat puistosta ja lähikortteleista, kuullaan inspiroivia puheita ja juhlitaan tehtyä työtä livemusiikin tahtiin. Tapahtuma on osallistujille ilmainen, kiitos sponsorien.\n\nVoit osallistua myös kotiseudullasi: kerää roskia oman matkasi varrelta ja jaa kuva tunnisteella #roskapäivä2026.',
    link_url: '/5-9-2026',
    link_label: 'Tapahtuman tiedot',
    sort_order: 10,
  },
  {
    title: 'Vappusiivous 2026',
    subtitle: null,
    event_date: '2026-05-01',
    date_label: 'Vappu 2026',
    location: 'Kaivopuisto, Helsinki',
    type: 'Siivousreel',
    image_url: 'https://i.imgur.com/izbXPaq.jpeg',
    description:
      'Vappuna kuvattu Kaivopuiston roskainen aamu tavoitti 48 tunnissa yli miljoona suomalaista.',
    body:
      'Vappu on yksi vuoden roskaisimmista päivistä. Kuvasimme Kaivopuiston aamun ja muistutimme, miltä yhteinen jälki näyttää, kun juhlat ovat ohi.',
    link_url: null,
    link_label: null,
    sort_order: 20,
  },
  {
    title: 'Roskapäivä 2025',
    subtitle: null,
    event_date: '2025-09-06',
    date_label: '2025',
    location: 'Kallio · Kohde Helsinki',
    type: 'Siivoustapahtuma',
    image_url:
      'https://www.roskapaiva.com/wp-content/uploads/2025/12/Picsart_25-12-15_12-13-53-609.jpg',
    description:
      'Päätapahtuma Kalliossa Kohde Helsingissä keräsi 150 ihmistä paikan päälle ja satoja sosiaalisen median kautta.',
    body:
      'Vuoden 2025 Roskapäivä järjestettiin Kalliossa Kohde Helsingissä. Päivän aikana siivottiin yhdessä, kuultiin puheita ja nautittiin livemusiikista esiintyjinä El Migu, Chebaleba sekä Eino P & Haku.',
    link_url: null,
    link_label: null,
    sort_order: 30,
  },
  {
    title: 'Roskapäivä 2024',
    subtitle: null,
    event_date: '2024-09-07',
    date_label: '2024',
    location: 'Töölö, Helsinki',
    type: 'Siivoustapahtuma',
    image_url: 'https://i.imgur.com/DdJYyxb.jpeg',
    description: 'Ensimmäinen Suomen-laajuinen Roskapäivä kokosi siivoojia ympäri maan.',
    body:
      'Töölössä järjestetty Roskapäivä 2024 oli ensimmäinen koko Suomen laajuinen tapahtuma. Mukana oli ihmisiä, kouluja ja yhteisöjä eri puolilta maata.',
    link_url: null,
    link_label: null,
    sort_order: 40,
  },
];
