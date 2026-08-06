-- 0023: longer descriptions, and the organiser's name on the public list.
--
-- The description was capped at 50 characters, which is a headline rather than
-- a description. It now allows up to 200 words; the form counts words, and the
-- database keeps a character ceiling as the backstop, since a word count is not
-- something a CHECK constraint should be asked to enforce.
--
-- The limit lived in TWO places: the table constraint and the anonymous insert
-- policy. Both have to move, or submissions would pass the constraint and then
-- be rejected by row-level security.

alter table public.community_events
  drop constraint if exists community_events_description_check;

alter table public.community_events
  add constraint community_events_description_check
  check (char_length(description) <= 2000);

drop policy if exists "public_insert_community_events" on public.community_events;
create policy "public_insert_community_events" on public.community_events
  for insert to anon, authenticated
  with check (
    status = 'pending'
    and participants is null
    and waste_kg is null
    and char_length(description) <= 2000
    and char_length(organizer_name) between 2 and 80
    and char_length(organizer_email) between 5 and 120
  );

-- The list now credits whoever is running each event. The name only: the
-- e-mail address stays out of the public projection.
create or replace view public.community_events_public
with (security_invoker = true) as
  select id, city, lat, lng, event_date, start_time, duration_minutes,
         description, image_url, participants, waste_kg, featured,
         organizer_name
  from public.community_events
  where status = 'approved';

grant select on public.community_events_public to anon, authenticated;
