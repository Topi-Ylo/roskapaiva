-- 0013: point the Cleaning Angels sponsor at the bundled logo asset
-- (public/cleaning-angels.png, served at /cleaning-angels.png). Only touches
-- rows still on the placeholder Clearbit URL, so an admin-uploaded logo wins.

update public.event_sponsors
  set logo_url = '/cleaning-angels.png'
  where name = 'Cleaning Angels'
    and (logo_url is null or logo_url like 'https://logo.clearbit.com/%');
