-- 0026: where the pin goes.
--
-- Every event in a municipality has shared one coordinate until now, so all
-- the Helsinki sign-ups stacked into a single marker. An organiser can now
-- place themselves in a district -- offered for the eight largest cities -- or
-- at a street address, and the map pulls those apart as you zoom in.
--
-- Neither value is published. community_events_public selects its columns
-- explicitly, so district and address stay in the base table, readable only by
-- admins and the service role; just the resolved lat/lng goes out. The view is
-- therefore left untouched by this migration, which is the point.
--
-- location_precision records where the pin actually ended up, which can be
-- coarser than what was asked for: an unreachable geocoder demotes an address
-- to the municipality centre while keeping the typed address, so an admin can
-- retry the lookup instead of the address being lost.

alter table public.community_events
  add column if not exists location_precision text not null default 'city'
    check (location_precision in ('city', 'district', 'address')),
  add column if not exists district text
    check (district is null or char_length(district) <= 80),
  add column if not exists address text
    check (address is null or char_length(address) <= 200);
