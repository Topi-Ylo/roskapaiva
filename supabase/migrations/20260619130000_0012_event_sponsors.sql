-- 0012 event sponsors: the Roskapäivä '26 hero "Yhteistyössä" band.
--
-- The current-year event sponsors, separate from the site-wide `partners`
-- marquee used on Palvelut/home. Same conventions as the other content tables:
-- public read of published rows, admin full access, updated_at + audit triggers.

create table if not exists public.event_sponsors (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  logo_url    text,
  url         text,
  sort_order  int default 0,
  published   boolean default true,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

drop trigger if exists event_sponsors_updated_at on public.event_sponsors;
create trigger event_sponsors_updated_at before update on public.event_sponsors
  for each row execute function public.set_updated_at();

drop trigger if exists audit_event_sponsors on public.event_sponsors;
create trigger audit_event_sponsors after insert or update or delete on public.event_sponsors
  for each row execute function public.audit_changes();

alter table public.event_sponsors enable row level security;

drop policy if exists "public_read_event_sponsors" on public.event_sponsors;
create policy "public_read_event_sponsors" on public.event_sponsors for select using (published = true);

drop policy if exists "admins_all_event_sponsors" on public.event_sponsors;
create policy "admins_all_event_sponsors" on public.event_sponsors for all
  using (public.is_admin()) with check (public.is_admin());

-- Seed the only confirmed 2026 sponsor so far (only when empty).
insert into public.event_sponsors (name, logo_url, url, sort_order)
select * from (values
  ('Cleaning Angels', 'https://logo.clearbit.com/cleaningangels.fi', 'https://www.cleaningangels.fi/', 10)
) as v(name, logo_url, url, sort_order)
where not exists (select 1 from public.event_sponsors);
