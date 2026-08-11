-- 0027: close direct anonymous read access to community_events.
--
-- community_events_public was written as the public projection: approved rows
-- only, without the organiser's contact details. Nothing actually enforced it.
-- Supabase grants anon SELECT on every table in the public schema by default,
-- and row-level security filters rows, not columns, so the base table stayed
-- readable — and with it every column the view deliberately leaves out:
--
--   * organizer_email  — every organiser's address, harvestable in one request
--   * approval_token   — the secret behind the approve / reject e-mail links
--   * admin_note       — internal notes
--   * district, address (0026) — meant to steer the pin, never to be published
--
-- The token is the serious one. It rotates when a link is used, but the fresh
-- token is written back to the row, and approved rows were readable. Anyone
-- could read id + approval_token and call approve-event with action=reject to
-- unpublish any event on the map. approve-event does not check the current
-- status, only that the token matches.
--
-- Pending rows were never exposed (the policy only matched status='approved'),
-- so no one could force an unreviewed submission live.
--
-- The fix is to take SELECT away from anon so the view is the only way in. The
-- view therefore has to stop running as the caller: as a security_invoker view
-- it would inherit the revoked grant and break for everyone. Its own
-- "where status = 'approved'" is the row filter and its explicit column list is
-- the column filter, so it remains a complete boundary on its own.
--
-- Supabase's linter flags security-definer views. Here that is the point: the
-- view IS the access-control boundary, not a convenience over one.
--
-- anon keeps INSERT. The public sign-up form still needs it, and that path
-- never reads back — the row id is generated client-side precisely so the
-- insert does not require a matching SELECT policy.

revoke select on public.community_events from anon;

create or replace view public.community_events_public
with (security_invoker = false) as
  select id, city, lat, lng, event_date, start_time, duration_minutes,
         description, image_url, participants, waste_kg, featured,
         organizer_name, is_public,
         -- only surfaced for open events; a private clean-up publishes nothing
         case when is_public then contact_type  end as contact_type,
         case when is_public then contact_value end as contact_value
  from public.community_events
  where status = 'approved';

grant select on public.community_events_public to anon, authenticated;
