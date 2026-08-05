-- 0019: add the 'organizer' sponsor tier (Järjestäjät row).
--
-- The '26 page now frames Roskapäivä as a nationwide day, and the two hosts of
-- the Kallio main event belong on their own line rather than among the
-- sponsors. Cleaning Angels moves there and Roskapäivä joins it.

alter table public.event_sponsors
  drop constraint if exists event_sponsors_tier_check;

alter table public.event_sponsors
  add constraint event_sponsors_tier_check
  check (tier in ('organizer', 'main', 'support', 'exhibitor'));

update public.event_sponsors
set tier = 'organizer', sort_order = 20
where name ilike '%cleaning angels%';

insert into public.event_sponsors (name, logo_url, url, tier, invert_logo, sort_order)
select 'Roskapäivä', 'https://i.imgur.com/ORj8kKe.png', 'https://roskapaiva.fi/', 'organizer', false, 10
where not exists (
  select 1 from public.event_sponsors where name = 'Roskapäivä' and tier = 'organizer'
);
