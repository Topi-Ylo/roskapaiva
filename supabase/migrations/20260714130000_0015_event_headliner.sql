-- 0015: headliner (pääesiintyjä) name + photo for the Roskapäivä '26 hero.
--
-- Split out from 0014, which was already applied before these two columns
-- existed. Migrations stay append-only, so this adds them separately.
-- Both are editable under /admin/event → Tekstit.

alter table public.site_settings
  add column if not exists event_headliner       text,
  add column if not exists event_headliner_image text;

update public.site_settings
set
  event_headliner = coalesce(event_headliner, 'Jaakko Kulta'),
  event_headliner_image = coalesce(event_headliner_image, 'https://i.imgur.com/If6GHtz.jpeg')
where id = 1;
