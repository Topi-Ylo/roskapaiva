-- Fixes the duplicate rows that were inserted by repeated runs of 0002_seed.sql.
-- Root cause: the seed used `on conflict do nothing` but the original schema had
-- no UNIQUE constraints on the natural keys, so every re-run inserted fresh rows
-- with new UUIDs.
--
-- This migration:
--   1. Deletes duplicate rows in 5 seeded tables, keeping the oldest copy
--      of each natural-key combination (by created_at).
--   2. Adds UNIQUE constraints so future seed re-runs are actually idempotent.
--
-- Safe to run once. After this, the seed file (0002) can be re-run any number
-- of times without producing duplicates.

-- ─────────────────────────────────────────────────────────────────────────────
-- Step 1: Deduplicate existing rows
-- ─────────────────────────────────────────────────────────────────────────────

-- past_events: dedupe on (year, title)
delete from public.past_events p1
using public.past_events p2
where p1.year = p2.year
  and p1.title = p2.title
  and p1.created_at > p2.created_at;

-- past_events: handle pure ties on created_at (unlikely but possible)
delete from public.past_events p1
using public.past_events p2
where p1.year = p2.year
  and p1.title = p2.title
  and p1.created_at = p2.created_at
  and p1.id > p2.id;

-- timeline_entries: dedupe on (year, title)
delete from public.timeline_entries p1
using public.timeline_entries p2
where p1.year = p2.year
  and p1.title = p2.title
  and p1.created_at > p2.created_at;

delete from public.timeline_entries p1
using public.timeline_entries p2
where p1.year = p2.year
  and p1.title = p2.title
  and p1.created_at = p2.created_at
  and p1.id > p2.id;

-- press_images: dedupe on src (URL)
delete from public.press_images p1
using public.press_images p2
where p1.src = p2.src
  and p1.created_at > p2.created_at;

delete from public.press_images p1
using public.press_images p2
where p1.src = p2.src
  and p1.created_at = p2.created_at
  and p1.id > p2.id;

-- partners: dedupe on name
delete from public.partners p1
using public.partners p2
where p1.name = p2.name
  and p1.created_at > p2.created_at;

delete from public.partners p1
using public.partners p2
where p1.name = p2.name
  and p1.created_at = p2.created_at
  and p1.id > p2.id;

-- services: dedupe on num
delete from public.services p1
using public.services p2
where p1.num = p2.num
  and p1.created_at > p2.created_at;

delete from public.services p1
using public.services p2
where p1.num = p2.num
  and p1.created_at = p2.created_at
  and p1.id > p2.id;

-- ─────────────────────────────────────────────────────────────────────────────
-- Step 2: Add UNIQUE constraints so on conflict do nothing can actually fire
-- ─────────────────────────────────────────────────────────────────────────────

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'past_events_year_title_unique'
  ) then
    alter table public.past_events
      add constraint past_events_year_title_unique unique (year, title);
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'timeline_entries_year_title_unique'
  ) then
    alter table public.timeline_entries
      add constraint timeline_entries_year_title_unique unique (year, title);
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'press_images_src_unique'
  ) then
    alter table public.press_images
      add constraint press_images_src_unique unique (src);
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'partners_name_unique'
  ) then
    alter table public.partners
      add constraint partners_name_unique unique (name);
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'services_num_unique'
  ) then
    alter table public.services
      add constraint services_num_unique unique (num);
  end if;
end $$;
