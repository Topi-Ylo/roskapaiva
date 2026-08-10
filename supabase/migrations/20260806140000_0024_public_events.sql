-- 0024: mark which sign-ups are open for others to join.
--
-- Most sign-ups are someone cleaning their own neighbourhood, which nobody
-- should turn up to uninvited. A few are open events. The flag drives a
-- separate badge, thumbnail and map pin, so the two never look alike.
--
-- Defaults to false: a submission that predates this column, or one where the
-- volunteer left the box alone, is treated as private.

alter table public.community_events
  add column if not exists is_public boolean not null default false;

create or replace view public.community_events_public
with (security_invoker = true) as
  select id, city, lat, lng, event_date, start_time, duration_minutes,
         description, image_url, participants, waste_kg, featured,
         organizer_name, is_public
  from public.community_events
  where status = 'approved';

grant select on public.community_events_public to anon, authenticated;

-- The Kallio main event is open to everyone by definition.
update public.community_events set is_public = true where featured = true;

-- Varissuo-Seura's Turku clean-up is open to the neighbourhood.
update public.community_events
set is_public = true
where organizer_name ilike '%varissuo%';
