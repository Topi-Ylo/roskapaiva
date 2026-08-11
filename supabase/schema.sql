-- ============================================================================
-- Roskapäivä — complete database schema
-- ============================================================================
-- Stands up a brand new Supabase project in one run. This is the flattened
-- equivalent of migrations 0001..0019: same tables, policies, triggers and
-- storage rules, in dependency order and without the intermediate steps.
--
-- Use this INSTEAD of replaying the migrations on a fresh instance. Do not run
-- it on the existing database, which is already at 0019.
--
-- Structure only. Content (partners, services, timeline, copy) is not seeded
-- here; export those rows from the old project or re-enter them in /admin.
--
-- AFTER RUNNING:
--   1. Auth -> Users -> Add user, to create your admin login.
--   2. Promote that user:
--        insert into public.admins (user_id, email, full_name)
--        select id, email, 'Eino Oinio' from auth.users where email = 'YOUR_EMAIL';
--   3. Point the site at the project: VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY,
--      and the Netlify functions at SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY.
-- ============================================================================

create extension if not exists "pgcrypto";

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. Admin role and shared functions
-- ─────────────────────────────────────────────────────────────────────────────

create table if not exists public.admins (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  email      text not null,
  full_name  text,
  created_at timestamptz default now()
);

create or replace function public.is_admin() returns boolean
language sql security definer stable
as $$
  select exists(select 1 from public.admins where user_id = auth.uid());
$$;

create or replace function public.set_updated_at() returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Audit log has to exist before the trigger function that writes to it.
create table if not exists public.audit_log (
  id          bigserial primary key,
  user_id     uuid references auth.users(id),
  user_email  text,
  table_name  text not null,
  record_id   text,
  action      text not null check (action in ('insert','update','delete')),
  changes     jsonb,
  created_at  timestamptz default now()
);

create or replace function public.audit_changes() returns trigger
language plpgsql security definer
as $$
begin
  insert into public.audit_log (user_id, user_email, table_name, record_id, action, changes)
  values (
    auth.uid(),
    coalesce((select email from auth.users where id = auth.uid()), 'system'),
    TG_TABLE_NAME,
    case when TG_OP = 'DELETE' then OLD.id::text else NEW.id::text end,
    lower(TG_OP),
    case
      when TG_OP = 'INSERT' then to_jsonb(NEW)
      when TG_OP = 'UPDATE' then jsonb_build_object('old', to_jsonb(OLD), 'new', to_jsonb(NEW))
      when TG_OP = 'DELETE' then to_jsonb(OLD)
    end
  );
  return coalesce(NEW, OLD);
end;
$$;

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. Content tables
-- ─────────────────────────────────────────────────────────────────────────────

create table if not exists public.past_events (
  id          uuid primary key default gen_random_uuid(),
  year        text not null,
  title       text not null,
  description text,
  image_url   text,
  sort_order  int default 0,
  published   boolean default true,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

create table if not exists public.timeline_entries (
  id              uuid primary key default gen_random_uuid(),
  year            text not null,
  title           text not null,
  description     text,
  image_url       text,
  is_large        boolean default false,
  is_wide         boolean default false,
  object_position text default 'center',
  sort_order      int default 0,
  published       boolean default true,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

create table if not exists public.social_media_collabs (
  id            uuid primary key default gen_random_uuid(),
  brand         text not null,
  platform      text not null,
  description   text,
  thumbnail_url text,
  video_type    text not null check (video_type in ('youtube','vimeo','mp4')),
  video_id      text,
  video_url     text,
  aspect        text default '9/16' check (aspect in ('9/16','16/9')),
  sort_order    int default 0,
  published     boolean default true,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

create table if not exists public.media_posts (
  id          uuid primary key default gen_random_uuid(),
  category    text not null check (category in ('tv','press','podcast')),
  source      text not null,
  title       text not null,
  description text,
  image_url   text,
  url         text not null,
  sort_order  int default 0,
  published   boolean default true,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

create table if not exists public.press_images (
  id         uuid primary key default gen_random_uuid(),
  label      text not null,
  src        text not null,
  in_zip     boolean default true,
  sort_order int default 0,
  published  boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.partners (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  logo_url   text,
  url        text,
  sort_order int default 0,
  published  boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.services (
  id          uuid primary key default gen_random_uuid(),
  num         text not null,
  title       text not null,
  description text,
  modal_body  text,                 -- added by 0007
  image_url   text,
  cta_label   text,
  cta_email   text,
  cta_subject text,
  sort_order  int default 0,
  published   boolean default true,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- Events calendar behind /tapahtumat (0011)
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

-- Roskapäivä '26 page: schedule, programme, credits, sponsors (0009/0010/0012/0016/0019)
create table if not exists public.event_schedule (
  id          uuid primary key default gen_random_uuid(),
  slot_time   text not null,
  label       text not null,
  place       text not null,
  area        text,
  body        text,
  image_url   text,
  sort_order  int default 0,
  published   boolean default true,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

create table if not exists public.event_program (
  id          uuid primary key default gen_random_uuid(),
  label       text not null,
  sort_order  int default 0,
  published   boolean default true,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

create table if not exists public.event_credits (
  id          uuid primary key default gen_random_uuid(),
  category    text not null check (category in ('performer','partner','exhibitor')),
  name        text not null,
  year        text,
  url         text,
  sort_order  int default 0,
  published   boolean default true,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

create table if not exists public.event_sponsors (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  logo_url    text,
  url         text,
  tier        text not null default 'support'
                check (tier in ('organizer','main','support','exhibitor')),
  invert_logo boolean not null default false,
  sort_order  int default 0,
  published   boolean default true,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- Nationwide sign-ups shown on the map (0018)
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
  -- 200 words of Finnish fit comfortably inside this (0023)
  description      text not null check (char_length(description) <= 2000),
  image_url        text,
  status           text not null default 'pending'
                     check (status in ('pending','approved','rejected')),
  approval_token   uuid not null default gen_random_uuid(),
  participants     int,
  waste_kg         numeric(10,1),
  admin_note       text,
  featured         boolean not null default false,
  -- open for anyone to join, as opposed to tidying your own street (0024)
  is_public        boolean not null default false,
  -- how to reach an open event; published only when is_public (0025)
  contact_type     text
                     check (contact_type is null
                            or contact_type in ('email','website','form')),
  contact_value    text check (contact_value is null
                               or char_length(contact_value) <= 200),
  -- where the pin goes (0026). district and address are deliberately absent
  -- from community_events_public: only the resolved lat/lng is published.
  location_precision text not null default 'city'
                     check (location_precision in ('city','district','address')),
  district         text check (district is null or char_length(district) <= 80),
  address          text check (address is null or char_length(address) <= 200),
  created_at       timestamptz default now(),
  updated_at       timestamptz default now()
);

create index if not exists community_events_status_date_idx
  on public.community_events (status, event_date);

-- Singleton settings row, including the '26 page copy (0014/0015)
create table if not exists public.site_settings (
  id                    int primary key default 1 check (id = 1),
  contact_email         text default 'eino@roskapaiva.com',
  contact_phone         text default '+358 45 673 2109',
  instagram_url         text default 'https://instagram.com/roskapaiva',
  tiktok_url            text,
  youtube_url           text,
  next_event_date       text default '5.9.2026',
  next_event_location   text default 'Helsinki',
  petition_url          text,
  petition_open         boolean default false,
  mediakortti_pdf_url   text,
  press_zip_url         text,
  event_hero_body       text,
  event_program_title   text,
  event_program_body    text,
  event_headliner       text,
  event_headliner_image text,
  updated_at            timestamptz default now()
);
insert into public.site_settings (id) values (1) on conflict (id) do nothing;

create table if not exists public.image_library (
  id           uuid primary key default gen_random_uuid(),
  url          text not null,
  label        text,
  alt_text     text,
  uploaded     boolean default false,
  storage_path text,
  width        int,
  height       int,
  size_bytes   bigint,
  created_at   timestamptz default now()
);

-- Public projection of community events: approved rows only, and never the
-- organiser's contact details or the approval token.
-- security_invoker is deliberately off (0027): anon has no SELECT on the base
-- table, so this view is the only way in and must not run as the caller. Its
-- WHERE clause is the row filter and its column list is the column filter.
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

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. Triggers: updated_at + audit on every content table
-- ─────────────────────────────────────────────────────────────────────────────

do $$ declare t text;
begin
  for t in select unnest(array[
    'past_events','timeline_entries','social_media_collabs','media_posts',
    'press_images','partners','services','site_settings','events',
    'event_schedule','event_program','event_credits','event_sponsors',
    'community_events'
  ]) loop
    execute format(
      'drop trigger if exists %I_updated_at on public.%I; '
      'create trigger %I_updated_at before update on public.%I '
      'for each row execute function public.set_updated_at();',
      t, t, t, t);
    execute format(
      'drop trigger if exists audit_%I on public.%I; '
      'create trigger audit_%I after insert or update or delete on public.%I '
      'for each row execute function public.audit_changes();',
      t, t, t, t);
  end loop;
end $$;

-- ─────────────────────────────────────────────────────────────────────────────
-- 4. Row Level Security
-- ─────────────────────────────────────────────────────────────────────────────

do $$ declare t text;
begin
  for t in select unnest(array[
    'admins','past_events','timeline_entries','social_media_collabs','media_posts',
    'press_images','partners','services','site_settings','image_library','audit_log',
    'events','event_schedule','event_program','event_credits','event_sponsors',
    'community_events'
  ]) loop
    execute format('alter table public.%I enable row level security;', t);
  end loop;
end $$;

-- Public read of published rows.
do $$ declare t text;
begin
  for t in select unnest(array[
    'past_events','timeline_entries','social_media_collabs','media_posts',
    'press_images','partners','services','events','event_schedule',
    'event_program','event_credits','event_sponsors'
  ]) loop
    execute format('drop policy if exists "public_read_%s" on public.%I;', t, t);
    execute format(
      'create policy "public_read_%s" on public.%I for select using (published = true);', t, t);
  end loop;
end $$;

-- Admin full access.
do $$ declare t text;
begin
  for t in select unnest(array[
    'past_events','timeline_entries','social_media_collabs','media_posts',
    'press_images','partners','services','site_settings','image_library',
    'events','event_schedule','event_program','event_credits','event_sponsors',
    'community_events'
  ]) loop
    execute format('drop policy if exists "admins_all_%s" on public.%I;', t, t);
    execute format(
      'create policy "admins_all_%s" on public.%I for all '
      'using (public.is_admin()) with check (public.is_admin());', t, t);
  end loop;
end $$;

-- Settings are world-readable (the public site renders from them).
drop policy if exists "public_read_site_settings" on public.site_settings;
create policy "public_read_site_settings" on public.site_settings for select using (true);

-- Community events: public sees approved rows; anyone may submit, but only
-- ever as a pending row with no statistics attached.
drop policy if exists "public_read_community_events" on public.community_events;
create policy "public_read_community_events" on public.community_events
  for select using (status = 'approved');

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

-- anon reaches community_events only through the view above; direct SELECT on
-- the base table would expose organizer_email, approval_token and the private
-- location columns (0027). INSERT stays, for the public sign-up form.
revoke select on public.community_events from anon;
grant select on public.community_events_public to anon, authenticated;

-- Admins table: you can see your own row, admins see all.
drop policy if exists "admins_read_self_or_admin" on public.admins;
create policy "admins_read_self_or_admin" on public.admins for select
  using (auth.uid() = user_id or public.is_admin());

drop policy if exists "admins_write_admin" on public.admins;
create policy "admins_write_admin" on public.admins for all
  using (public.is_admin()) with check (public.is_admin());

-- Audit log is read-only for admins; rows arrive via the SECURITY DEFINER trigger.
drop policy if exists "audit_log_read_admin" on public.audit_log;
create policy "audit_log_read_admin" on public.audit_log for select using (public.is_admin());

-- ─────────────────────────────────────────────────────────────────────────────
-- 5. Storage
-- ─────────────────────────────────────────────────────────────────────────────

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

drop policy if exists "media_public_read" on storage.objects;
create policy "media_public_read" on storage.objects for select using (bucket_id = 'media');

drop policy if exists "media_admin_insert" on storage.objects;
create policy "media_admin_insert" on storage.objects for insert
  with check (bucket_id = 'media' and public.is_admin());

drop policy if exists "media_admin_update" on storage.objects;
create policy "media_admin_update" on storage.objects for update
  using (bucket_id = 'media' and public.is_admin())
  with check (bucket_id = 'media' and public.is_admin());

drop policy if exists "media_admin_delete" on storage.objects;
create policy "media_admin_delete" on storage.objects for delete
  using (bucket_id = 'media' and public.is_admin());

-- Volunteers attaching a photo to a sign-up may write into community/ only.
drop policy if exists "media_community_insert" on storage.objects;
create policy "media_community_insert" on storage.objects for insert
  to anon, authenticated
  with check (bucket_id = 'media' and (storage.foldername(name))[1] = 'community');
