-- 0017: stop inverting the Seiffi logo.
--
-- 0016 set invert_logo on Seiffi, but its mark is light on a dark backing, so
-- inverting turned it into a bright box on the dark hero. Render it as-is.
-- (This is also togglable per sponsor in /admin/event -> Yhteistyössä.)

update public.event_sponsors
set invert_logo = false
where name ilike '%seiffi%';
