-- 0010 event credits: performers, partners and exhibitors for the event tab.
--
-- Single category-keyed table (same shape as media_posts' category column):
--   category in ('performer','partner','exhibitor')
-- Used as yearly social proof + recruitment lists. Public read of published
-- rows, admin full access, updated_at + audit triggers.

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

drop trigger if exists event_credits_updated_at on public.event_credits;
create trigger event_credits_updated_at before update on public.event_credits
  for each row execute function public.set_updated_at();

drop trigger if exists audit_event_credits on public.event_credits;
create trigger audit_event_credits after insert or update or delete on public.event_credits
  for each row execute function public.audit_changes();

alter table public.event_credits enable row level security;

drop policy if exists "public_read_event_credits" on public.event_credits;
create policy "public_read_event_credits" on public.event_credits for select using (published = true);

drop policy if exists "admins_all_event_credits" on public.event_credits;
create policy "admins_all_event_credits" on public.event_credits for all
  using (public.is_admin()) with check (public.is_admin());

-- Seed 2025 credits (only when empty, so re-runs don't duplicate)
insert into public.event_credits (category, name, year, sort_order)
select * from (values
  ('performer', 'El Migu', '2025', 10),
  ('performer', 'Chebaleba', '2025', 20),
  ('performer', 'Eino P & Haku', '2025', 30),
  ('partner', 'Partioaitta', '2025', 10),
  ('partner', 'Team Agency', '2025', 20),
  ('partner', 'Bella Kirppis', '2025', 30),
  ('partner', 'ResQ Club', '2025', 40),
  ('partner', 'K-Supermarket Mustapekka', '2025', 50),
  ('partner', 'Taffel Suomi', '2025', 60),
  ('partner', 'The Bros Burgers', '2025', 70),
  ('exhibitor', 'Paristokierrätys / Recser Oy', '2025', 10),
  ('exhibitor', 'Seiffi', '2025', 20),
  ('exhibitor', 'Syke Research', '2025', 30),
  ('exhibitor', 'Helsingin kaupunkiympäristö', '2025', 40),
  ('exhibitor', 'Nuoture.fi', '2025', 50)
) as v(category, name, year, sort_order)
where not exists (select 1 from public.event_credits);
