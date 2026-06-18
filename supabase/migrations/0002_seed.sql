-- Seed initial content from the hardcoded React arrays.
-- Safe to re-run: uses on conflict do nothing where applicable.
-- Run AFTER 0001_initial_schema.sql.

-- Past events (PastEventsSection)
insert into public.past_events (year, title, description, image_url, sort_order)
values
  ('2024', 'Töölö',     'Ensimmäinen Suomen-laajuinen', 'https://i.imgur.com/DdJYyxb.jpeg', 10),
  ('2025', 'Kallio',    'Kohde Helsinki',                'https://i.imgur.com/toNE94p.jpeg', 20),
  ('2025', 'Vallisaari','Saariston siivous',             'https://i.imgur.com/yjZzydi.jpeg', 30),
  ('2024', 'Tukes',     'Zombiakkukampanja',             'https://i.imgur.com/Yj6YwV7.jpeg', 40),
  ('2026', 'Suvilahti', 'Vappu-reel',                    'https://i.imgur.com/izbXPaq.jpeg', 50)
on conflict do nothing;

-- Timeline entries (StorySection bento)
insert into public.timeline_entries (year, title, description, image_url, is_large, is_wide, object_position, sort_order)
values
  ('2018', 'Ensimmäinen roska',           'Anonyymi Instagram-tili. Roskapäivä saa nimensä.', 'https://i.imgur.com/EQCjiD8.jpeg', true,  false, 'center', 10),
  ('2020', 'Kasvot tilille',              null,                                                'https://i.imgur.com/AMjIwuH.jpeg', false, false, 'center', 20),
  ('2023', 'Koneen säätiön apuraha',      null,                                                'https://i.imgur.com/8zgfoM4.jpeg', false, false, 'center', 30),
  ('2024', 'Suomen-laajuinen Roskapäivä', null,                                                'https://i.imgur.com/toNE94p.jpeg', false, false, 'center', 40),
  ('2025', 'Roskapäivä-ukko',             null,                                                'https://www.mustankorkea.fi/wp-content/uploads/2024/09/roskapaiva-3-1024x766.jpg', false, false, 'center', 50),
  ('2026', '1,7 miljoonaa katsojaa',      'Vappu-reel. MTV3, Huomenta Suomi. Liike on isompi kuin koskaan.', 'https://i.imgur.com/VeVdKTN.png', false, true, 'top', 60),
  ('2027', 'Tulossa',                     'Seuraava Roskapäivä 2.5.2027.',                     'https://www.mustankorkea.fi/wp-content/uploads/2024/09/roskapaiva-4.jpg', false, false, 'center', 70)
on conflict do nothing;

-- Press images (Mediakortti carousel)
insert into public.press_images (label, src, in_zip, sort_order)
values
  ('Eino, muotokuva',              'https://www.roskapaiva.com/wp-content/uploads/2025/10/Picsart_25-10-16_06-40-24-707.jpg', true, 10),
  ('Eino, kentällä',               'https://i.imgur.com/Mf4XgjV.jpeg', true, 20),
  ('Suvilahti · Vappu 2026',       'https://i.imgur.com/izbXPaq.jpeg', true, 30),
  ('Töölö · 2024',                 'https://i.imgur.com/DdJYyxb.jpeg', true, 40),
  ('Vallisaari · 2025',            'https://i.imgur.com/yjZzydi.jpeg', true, 50),
  ('Yleisökuva',                   'https://www.mustankorkea.fi/wp-content/uploads/2024/09/roskapaiva-3-1024x766.jpg', true, 60),
  ('Roskapäivä-tapahtuma',         'https://www.mustankorkea.fi/wp-content/uploads/2024/09/roskapaiva-4.jpg', true, 70),
  ('Tukes · zombiakkukampanja',    'https://i.imgur.com/Yj6YwV7.jpeg', true, 80),
  ('Eino, lähikuva',               'https://i.imgur.com/FSNLVUN.jpeg', true, 90),
  ('Suomen-laajuinen Roskapäivä',  'https://i.imgur.com/toNE94p.jpeg', true, 100)
on conflict do nothing;

-- Partners
insert into public.partners (name, sort_order) values
  ('Partioaitta', 10),
  ('ResQ', 20),
  ('K-Supermarket Mustapekka', 30),
  ('Taffel', 40),
  ('The Bros Burgers', 50),
  ('Cleaning Angels', 60),
  ('Recser', 70),
  ('Stara', 80)
on conflict do nothing;

-- Services
insert into public.services (num, title, description, image_url, cta_label, cta_email, cta_subject, sort_order)
values
  ('01', 'Tapahtumat ja virkistyspäivät', 'Yrityksille, kouluille ja organisaatioille: siivoustapahtumia ja virkistyspäiviä. Voi sisältää luennon, koulutuksen, roskaretken, siivoustapahtuman tai piknik-henkisen iltapäivän.', 'https://i.imgur.com/zOqWc48.jpeg', 'Pyydä tarjous', 'eino@roskapaiva.com', 'Tapahtuma tai virkistyspäivä', 10),
  ('02', 'Luennot ja koulutus', 'Luennoin luonnon roskaantumisesta, kiertotaloudesta ja muista ekoaiheista kouluilla ja yrityksissä. Räätälöin luennon sellaiseksi kuin asiakas toivoo, pitäen Roskapäivän rennon tyylin yllä.', 'https://i.imgur.com/QtoQezv.jpeg', 'Pyydä tarjous', 'eino@roskapaiva.com', 'Luento tai koulutus', 20),
  ('03', 'Kaupalliset yhteistyöt', 'Toteutan kaupallisia yhteistöitä vastuullisten toimijoiden kanssa sosiaalisessa mediassa Instagram-kanavallani Roskapäivä. Ole rohkeasti yhteydessä ja keksitään yhdessä jotain siistiä.', 'https://i.imgur.com/XNXXKgS.jpeg', 'Ota yhteyttä', 'eino@roskapaiva.com', 'Kaupallinen yhteistyö', 30)
on conflict do nothing;
