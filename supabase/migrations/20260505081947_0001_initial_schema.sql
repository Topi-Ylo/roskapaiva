-- Roskapäivä admin schema. Run this once in Supabase SQL editor.
--
-- Creates: admins, content tables, site_settings, image_library, audit_log.
-- Adds Row Level Security: public can read published content; only rows in
-- the `admins` table can write. Audit triggers log every insert/update/delete.

create extension if not exists "pgcrypto";

-- ─────────────────────────────────────────────────────────────────────────────
-- Admin role table
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

-- Generic updated_at trigger
create or replace function public.set_updated_at() returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ─────────────────────────────────────────────────────────────────────────────
-- Content tables
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
  image_url   text,
  cta_label   text,
  cta_email   text,
  cta_subject text,
  sort_order  int default 0,
  published   boolean default true,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- Singleton site settings
create table if not exists public.site_settings (
  id                   int primary key default 1 check (id = 1),
  contact_email        text default 'eino@roskapaiva.com',
  contact_phone        text default '+358 45 673 2109',
  instagram_url        text default 'https://instagram.com/roskapaiva',
  tiktok_url           text,
  youtube_url          text,
  next_event_date      text default '5.9.2026',
  next_event_location  text default 'Helsinki',
  petition_url         text,
  petition_open        boolean default false,
  mediakortti_pdf_url  text,
  press_zip_url        text,
  updated_at           timestamptz default now()
);
insert into public.site_settings (id) values (1) on conflict (id) do nothing;

-- Reusable image library (URL-based for Phase 1; Storage in Phase 3)
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

-- Audit log
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

-- ─────────────────────────────────────────────────────────────────────────────
-- updated_at triggers
-- ─────────────────────────────────────────────────────────────────────────────
do $$ declare t text;
begin
  for t in select unnest(array[
    'past_events','timeline_entries','social_media_collabs','media_posts',
    'press_images','partners','services','site_settings'
  ]) loop
    execute format(
      'drop trigger if exists %I_updated_at on public.%I; '
      'create trigger %I_updated_at before update on public.%I '
      'for each row execute function public.set_updated_at();',
      t, t, t, t);
  end loop;
end $$;

-- ─────────────────────────────────────────────────────────────────────────────
-- Audit trigger: every write into a content table is recorded
-- ─────────────────────────────────────────────────────────────────────────────
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

do $$ declare t text;
begin
  for t in select unnest(array[
    'past_events','timeline_entries','social_media_collabs','media_posts',
    'press_images','partners','services','site_settings'
  ]) loop
    execute format(
      'drop trigger if exists audit_%I on public.%I; '
      'create trigger audit_%I after insert or update or delete on public.%I '
      'for each row execute function public.audit_changes();',
      t, t, t, t);
  end loop;
end $$;

-- ─────────────────────────────────────────────────────────────────────────────
-- Row Level Security
-- ─────────────────────────────────────────────────────────────────────────────
alter table public.admins              enable row level security;
alter table public.past_events         enable row level security;
alter table public.timeline_entries    enable row level security;
alter table public.social_media_collabs enable row level security;
alter table public.media_posts         enable row level security;
alter table public.press_images        enable row level security;
alter table public.partners            enable row level security;
alter table public.services            enable row level security;
alter table public.site_settings       enable row level security;
alter table public.image_library       enable row level security;
alter table public.audit_log           enable row level security;

-- Public read access (only published rows)
do $$ declare t text;
begin
  for t in select unnest(array[
    'past_events','timeline_entries','social_media_collabs','media_posts',
    'press_images','partners','services'
  ]) loop
    execute format('drop policy if exists "public_read_%s" on public.%I;', t, t);
    execute format('create policy "public_read_%s" on public.%I for select using (published = true);', t, t);
  end loop;
end $$;

drop policy if exists "public_read_site_settings" on public.site_settings;
create policy "public_read_site_settings" on public.site_settings for select using (true);

-- Admin full access on all content tables
do $$ declare t text;
begin
  for t in select unnest(array[
    'past_events','timeline_entries','social_media_collabs','media_posts',
    'press_images','partners','services','site_settings','image_library'
  ]) loop
    execute format('drop policy if exists "admins_all_%s" on public.%I;', t, t);
    execute format('create policy "admins_all_%s" on public.%I for all using (public.is_admin()) with check (public.is_admin());', t, t);
  end loop;
end $$;

-- Admins table policies
drop policy if exists "admins_read_self_or_admin" on public.admins;
create policy "admins_read_self_or_admin" on public.admins for select
  using (auth.uid() = user_id or public.is_admin());

drop policy if exists "admins_write_admin" on public.admins;
create policy "admins_write_admin" on public.admins for all
  using (public.is_admin()) with check (public.is_admin());

-- Audit log: admins read-only (writes happen via SECURITY DEFINER trigger)
drop policy if exists "audit_log_read_admin" on public.audit_log;
create policy "audit_log_read_admin" on public.audit_log for select using (public.is_admin());

-- ─────────────────────────────────────────────────────────────────────────────
-- Storage bucket for image uploads (Phase 3)
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
