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

export type CreditCategory = 'performer' | 'partner' | 'exhibitor';

export interface EventCredit {
  id?: string;
  category: CreditCategory;
  name: string;
  year: string | null;
  url: string | null;
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

export const FALLBACK_CREDITS: EventCredit[] = [
  // Vuoden 2025 esiintyjät
  { category: 'performer', name: 'El Migu', year: '2025', url: null, sort_order: 10 },
  { category: 'performer', name: 'Chebaleba', year: '2025', url: null, sort_order: 20 },
  { category: 'performer', name: 'Eino P & Haku', year: '2025', url: null, sort_order: 30 },
  // Vuoden 2025 kumppanit
  { category: 'partner', name: 'Partioaitta', year: '2025', url: null, sort_order: 10 },
  { category: 'partner', name: 'Team Agency', year: '2025', url: null, sort_order: 20 },
  { category: 'partner', name: 'Bella Kirppis', year: '2025', url: null, sort_order: 30 },
  { category: 'partner', name: 'ResQ Club', year: '2025', url: null, sort_order: 40 },
  { category: 'partner', name: 'K-Supermarket Mustapekka', year: '2025', url: null, sort_order: 50 },
  { category: 'partner', name: 'Taffel Suomi', year: '2025', url: null, sort_order: 60 },
  { category: 'partner', name: 'The Bros Burgers', year: '2025', url: null, sort_order: 70 },
  // Vuoden 2025 näytteilleasettajat
  { category: 'exhibitor', name: 'Paristokierrätys / Recser Oy', year: '2025', url: null, sort_order: 10 },
  { category: 'exhibitor', name: 'Seiffi', year: '2025', url: null, sort_order: 20 },
  { category: 'exhibitor', name: 'Syke Research', year: '2025', url: null, sort_order: 30 },
  { category: 'exhibitor', name: 'Helsingin kaupunkiympäristö', year: '2025', url: null, sort_order: 40 },
  { category: 'exhibitor', name: 'Nuoture.fi', year: '2025', url: null, sort_order: 50 },
];
