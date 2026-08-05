-- 0018 community events: the nationwide Roskapäivä map + list.
--
-- Anyone can register their own clean-up for the day. Submissions land as
-- 'pending', Eino approves them (from the notification email or the admin),
-- and only approved rows are public. participants / waste_kg are filled in
-- afterwards by the admin and drive the statistics bar.

create table if not exists public.community_events (
  id               uuid primary key default gen_random_uuid(),
  organizer_name   text not null,
  organizer_email  text not null,
  city             text not null,
  lat              double precision,
  lng              double precision,
  event_date       date not null,
  start_time       time,
  duration_minutes int  not null default 120,
  description      text not null check (char_length(description) <= 50),
  image_url        text,
  status           text not null default 'pending'
                     check (status in ('pending', 'approved', 'rejected')),
  -- single-use secret behind the approve/reject links in the e-mail
  approval_token   uuid not null default gen_random_uuid(),
  participants     int,
  waste_kg         numeric(10,1),
  admin_note       text,
  created_at       timestamptz default now(),
  updated_at       timestamptz default now()
);

create index if not exists community_events_status_date_idx
  on public.community_events (status, event_date);

drop trigger if exists community_events_updated_at on public.community_events;
create trigger community_events_updated_at before update on public.community_events
  for each row execute function public.set_updated_at();

drop trigger if exists audit_community_events on public.community_events;
create trigger audit_community_events after insert or update or delete on public.community_events
  for each row execute function public.audit_changes();

alter table public.community_events enable row level security;

-- Public sees approved events only, and never the organiser's contact details
-- or the approval token (see the view below).
drop policy if exists "public_read_community_events" on public.community_events;
create policy "public_read_community_events" on public.community_events
  for select using (status = 'approved');

-- Anyone may submit, but only ever as a pending row: the check constraint stops
-- a crafted request from self-approving or seeding fake statistics.
drop policy if exists "public_insert_community_events" on public.community_events;
create policy "public_insert_community_events" on public.community_events
  for insert to anon, authenticated
  with check (
    status = 'pending'
    and participants is null
    and waste_kg is null
    and char_length(description) <= 50
    and char_length(organizer_name) between 2 and 80
    and char_length(organizer_email) between 5 and 120
  );

drop policy if exists "admins_all_community_events" on public.community_events;
create policy "admins_all_community_events" on public.community_events
  for all using (public.is_admin()) with check (public.is_admin());

-- Public-facing projection: approved rows without organiser contact details.
create or replace view public.community_events_public
with (security_invoker = true) as
  select id, city, lat, lng, event_date, start_time, duration_minutes,
         description, image_url, participants, waste_kg
  from public.community_events
  where status = 'approved';

grant select on public.community_events_public to anon, authenticated;
