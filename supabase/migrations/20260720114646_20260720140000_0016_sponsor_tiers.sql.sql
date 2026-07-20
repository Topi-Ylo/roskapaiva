-- 0016: sponsor tiers + per-logo invert for the Roskapäivä '26 hero band.
--
-- The band previously derived the main partner from sort_order alone and had
-- only two lines. Add an explicit tier so the admin can place a sponsor on the
-- Pääyhteistyökumppani / Tukisponsorit / Näytteilleasettajat line, plus an
-- invert flag for logos that are too dark to read on the hero.

alter table public.event_sponsors
  add column if not exists tier        text not null default 'support',
  add column if not exists invert_logo boolean not null default false;

-- Constrain to the three known tiers (added separately so re-runs are safe).
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'event_sponsors_tier_check'
  ) then
    alter table public.event_sponsors
      add constraint event_sponsors_tier_check
      check (tier in ('main', 'support', 'exhibitor'));
  end if;
end $$;

-- Preserve what the site currently shows: the lowest sort_order was the main
-- partner, everything else was a support sponsor.
update public.event_sponsors
set tier = 'main'
where id = (
  select id from public.event_sponsors order by sort_order asc, created_at asc limit 1
)
and not exists (select 1 from public.event_sponsors where tier = 'main');

-- Seiffi becomes an exhibitor; its logo is dark, so invert it. The role is now
-- carried by the line label, so drop the redundant suffix from the name.
update public.event_sponsors
set tier = 'exhibitor',
    invert_logo = true,
    name = 'Seiffi'
where name ilike '%seiffi%';

-- Partioaitta also exhibits, so it gets a second row on the exhibitor line
-- (regular size), reusing the logo/link of the main-partner row.
insert into public.event_sponsors (name, logo_url, url, tier, invert_logo, sort_order)
select 'Partioaitta', logo_url, url, 'exhibitor', false, 20
from public.event_sponsors
where name ilike 'partioaitta%'
  and tier = 'main'
  and not exists (
    select 1 from public.event_sponsors
    where name ilike 'partioaitta%' and tier = 'exhibitor'
  )
limit 1;
