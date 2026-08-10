-- 0025: how to reach an open event.
--
-- Only meaningful for open events, and entirely optional: plenty of organisers
-- will just want people to turn up. Two columns rather than one URL so the
-- list can label the link correctly (ilmoittaudu / lisätietoja / ota yhteyttä)
-- and build a mailto: where appropriate.
--
-- Note this value IS published, unlike organizer_email, because the organiser
-- types it into a field that says so. The form spells that out.

alter table public.community_events
  add column if not exists contact_type text
    check (contact_type is null or contact_type in ('email', 'website', 'form')),
  add column if not exists contact_value text
    check (contact_value is null or char_length(contact_value) <= 200);

create or replace view public.community_events_public
with (security_invoker = true) as
  select id, city, lat, lng, event_date, start_time, duration_minutes,
         description, image_url, participants, waste_kg, featured,
         organizer_name, is_public,
         -- only surfaced for open events; a private clean-up publishes nothing
         case when is_public then contact_type  end as contact_type,
         case when is_public then contact_value end as contact_value
  from public.community_events
  where status = 'approved';

grant select on public.community_events_public to anon, authenticated;
