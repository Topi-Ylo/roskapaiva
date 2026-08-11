-- 0032: a credit tier for whoever built the thing.
--
-- The sponsor band is rows of logos with a label down the left, and the label
-- is what makes each row mean something. Putting the site's designer under
-- "Tukisponsorit" would say they paid for the event, which is not what
-- happened, so they get their own row and the label carries the credit:
-- "Verkkosivut ja ilme".
--
-- Last in the band, below the partners, because a credit is not a partnership.
--
-- The constraint is replaced rather than added, since 0016 already created one
-- covering the earlier tiers.

alter table public.event_sponsors
  drop constraint if exists event_sponsors_tier_check;

alter table public.event_sponsors
  add constraint event_sponsors_tier_check
  check (tier in ('organizer', 'main', 'support', 'exhibitor', 'creative'));

-- The mark is pure black on transparency, so invert_logo turns it cream
-- against the dark band with no separate artwork. Insert only if it is not
-- already there, so a re-run is harmless.
insert into public.event_sponsors (name, logo_url, url, tier, invert_logo, sort_order, published)
select 'Wihmo Productions', '/wihmo-logo.png', 'https://wihmo.com', 'creative', true, 10, true
where not exists (
  select 1 from public.event_sponsors where name = 'Wihmo Productions'
);
