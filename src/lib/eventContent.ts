// Shared types + fallback content for the 5.9.2026 event tab. The schedule and
// program are CMS-driven (Supabase tables `event_schedule` / `event_program`);
// these fallbacks keep the page fully rendered when Supabase isn't configured
// or a table is empty. Images reuse the existing site image library.

export interface EventSlot {
  id?: string;
  slot_time: string;
  label: string;
  place: string;
  area: string | null;
  body: string | null;
  image_url: string | null;
  sort_order: number;
}

export interface EventProgramItem {
  id?: string;
  label: string;
  sort_order: number;
}

export const FALLBACK_SCHEDULE: EventSlot[] = [
  {
    slot_time: '11–14',
    label: 'Siivoustapahtuma',
    place: 'Karhupuisto',
    area: 'Helsinki',
    body: 'Kerätään yhdessä roskat puistosta ja lähikortteleista. Hanskat ja säkit löytyvät paikan päältä, joten mukaan pääsee ilman varusteita. Tule porukalla tai yksin, kaikki ovat tervetulleita.',
    image_url: 'https://www.mustankorkea.fi/wp-content/uploads/2024/09/roskapaiva-4.jpg',
    sort_order: 10,
  },
  {
    slot_time: '14–16.30',
    label: 'Afterpartyt',
    place: 'Kohde Helsinki',
    area: 'Kivenheiton päässä Karhupuistosta',
    body: 'Siirrytään juhlimaan tehtyä työtä. Luvassa puheita, livemusiikkia, kahvilaa ja rentoa meininkiä hyvässä seurassa. Tapahtuma on osallistujille ilmainen, kiitos sponsorien.',
    image_url: 'https://uula.fi/wp-content/uploads/2024/11/roskapaiva-kalliolla.webp',
    sort_order: 20,
  },
];

export const FALLBACK_PROGRAM: EventProgramItem[] = [
  { label: 'Puheita ja inspiraatiota', sort_order: 10 },
  { label: 'Livemusiikkia', sort_order: 20 },
  { label: 'Yritysten pop-up-näyttelyitä', sort_order: 30 },
  { label: 'Lasten ohjelmaa', sort_order: 40 },
  { label: 'Kahvila', sort_order: 50 },
  { label: 'Rentoutumisalueita', sort_order: 60 },
];
