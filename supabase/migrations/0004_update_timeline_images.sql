-- Updates the timeline_entries images for years 2018, 2020, 2023, 2024.
-- Run this in Supabase SQL Editor to update your live data.
--
-- These years are unique in the timeline (one entry per year), so updating
-- by year is safe.

update public.timeline_entries
set image_url = 'https://i.imgur.com/EQCjiD8.jpeg'
where year = '2018';

update public.timeline_entries
set image_url = 'https://i.imgur.com/AMjIwuH.jpeg'
where year = '2020';

update public.timeline_entries
set image_url = 'https://i.imgur.com/8zgfoM4.jpeg'
where year = '2023';

update public.timeline_entries
set image_url = 'https://i.imgur.com/toNE94p.jpeg'
where year = '2024';
