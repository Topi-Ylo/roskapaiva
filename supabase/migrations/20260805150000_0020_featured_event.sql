-- 0020: pin the Kallio main event to the top of the nationwide list.
--
-- Adds a `featured` flag so the main event stays first however many sign-ups
-- arrive. Ordering by date alone was not enough: every event shares 5.9.2026,
-- so Postgres was free to return them in any order.

alter table public.community_events
  add column if not exists featured boolean not null default false;

-- The site reads the view, so it has to carry the new column too.
create or replace view public.community_events_public
with (security_invoker = true) as
  select id, city, lat, lng, event_date, start_time, duration_minutes,
         description, image_url, participants, waste_kg, featured
  from public.community_events
  where status = 'approved';

grant select on public.community_events_public to anon, authenticated;

-- The main event itself, published straight away (only when absent, so a
-- re-run does not create a second copy).
insert into public.community_events (
  organizer_name, organizer_email, city, lat, lng,
  event_date, start_time, duration_minutes, description, image_url,
  status, featured
)
select
  'Roskapäivä', 'eino@roskapaiva.com', 'Helsinki', 60.1699, 24.9384,
  '2026-09-05'::date, '11:00'::time, 330,
  'Päätapahtuma: Karhupuisto ja Kohde Helsinki',
  'https://i.imgur.com/If6GHtz.jpeg',
  'approved', true
where not exists (
  select 1 from public.community_events where featured = true
);
