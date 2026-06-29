-- 0011 events: the Tapahtumat (events calendar) feature.
--
-- A full events list with real dates so the site can split upcoming vs past and
-- highlight the next event. Coexists with past_events (homepage carousel) and
-- the dedicated /5-9-2026 page. Same conventions as the other content tables:
-- public read of published rows, admin full access, updated_at + audit triggers.

create table if not exists public.events (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  subtitle    text,
  event_date  date,
  date_label  text,
  location    text,
  type        text,
  image_url   text,
  description text,
  body        text,
  link_url    text,
  link_label  text,
  sort_order  int default 0,
  published   boolean default true,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

drop trigger if exists events_updated_at on public.events;
create trigger events_updated_at before update on public.events
  for each row execute function public.set_updated_at();

drop trigger if exists audit_events on public.events;
create trigger audit_events after insert or update or delete on public.events
  for each row execute function public.audit_changes();

alter table public.events enable row level security;

drop policy if exists "public_read_events" on public.events;
create policy "public_read_events" on public.events for select using (published = true);

drop policy if exists "admins_all_events" on public.events;
create policy "admins_all_events" on public.events for all
  using (public.is_admin()) with check (public.is_admin());

-- Seed (only when empty, so re-runs don't duplicate)
insert into public.events
  (title, event_date, date_label, location, type, image_url, description, body, link_url, link_label, sort_order)
select * from (values
  (
    'Roskapäivä 2026', '2026-09-05'::date, '5.9.2026', 'Karhupuisto & Kohde Helsinki', 'Siivoustapahtuma',
    'https://www.mustankorkea.fi/wp-content/uploads/2024/09/roskapaiva-4.jpg',
    'Vuotuinen Roskapäivä valtaa Helsingin: siivoustapahtuma Karhupuistossa klo 11–14 ja afterpartyt kivenheiton päässä Kohde Helsingissä klo 14–16.30.',
    E'Kerätään yhdessä roskat puistosta ja lähikortteleista, kuullaan inspiroivia puheita ja juhlitaan tehtyä työtä livemusiikin tahtiin. Tapahtuma on osallistujille ilmainen, kiitos sponsorien.\n\nVoit osallistua myös kotiseudullasi: kerää roskia oman matkasi varrelta ja jaa kuva tunnisteella #roskapäivä2026.',
    '/5-9-2026', 'Tapahtuman tiedot', 10
  ),
  (
    'Vappusiivous 2026', '2026-05-01'::date, 'Vappu 2026', 'Kaivopuisto, Helsinki', 'Siivousreel',
    'https://i.imgur.com/izbXPaq.jpeg',
    'Vappuna kuvattu Kaivopuiston roskainen aamu tavoitti 48 tunnissa yli miljoona suomalaista.',
    'Vappu on yksi vuoden roskaisimmista päivistä. Kuvasimme Kaivopuiston aamun ja muistutimme, miltä yhteinen jälki näyttää, kun juhlat ovat ohi.',
    null, null, 20
  ),
  (
    'Roskapäivä 2025', '2025-09-06'::date, '2025', 'Kallio · Kohde Helsinki', 'Siivoustapahtuma',
    'https://www.roskapaiva.com/wp-content/uploads/2025/12/Picsart_25-12-15_12-13-53-609.jpg',
    'Päätapahtuma Kalliossa Kohde Helsingissä keräsi 150 ihmistä paikan päälle ja satoja sosiaalisen median kautta.',
    'Vuoden 2025 Roskapäivä järjestettiin Kalliossa Kohde Helsingissä. Päivän aikana siivottiin yhdessä, kuultiin puheita ja nautittiin livemusiikista esiintyjinä El Migu, Chebaleba sekä Eino P & Haku.',
    null, null, 30
  ),
  (
    'Roskapäivä 2024', '2024-09-07'::date, '2024', 'Töölö, Helsinki', 'Siivoustapahtuma',
    'https://i.imgur.com/DdJYyxb.jpeg',
    'Ensimmäinen Suomen-laajuinen Roskapäivä kokosi siivoojia ympäri maan.',
    'Töölössä järjestetty Roskapäivä 2024 oli ensimmäinen koko Suomen laajuinen tapahtuma. Mukana oli ihmisiä, kouluja ja yhteisöjä eri puolilta maata.',
    null, null, 40
  )
) as v(title, event_date, date_label, location, type, image_url, description, body, link_url, link_label, sort_order)
where not exists (select 1 from public.events);
