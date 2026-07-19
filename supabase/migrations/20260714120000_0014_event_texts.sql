-- 0014: make the Roskapäivä '26 page texts editable from the admin.
--
-- Adds the hero body copy and the "Ohjelmassa" lead to site_settings so they
-- can be edited under /admin/event → Tekstit, instead of being hardcoded.
-- Paragraphs are separated by a blank line.

alter table public.site_settings
  add column if not exists event_hero_body     text,
  add column if not exists event_program_title text,
  add column if not exists event_program_body  text;

update public.site_settings
set
  event_hero_body = coalesce(event_hero_body, $$Kerätään yhdessä, juhlitaan tehtyä työtä ja tehdään Helsingistä vähän siistimpi. Voit osallistua myös kotiseudullasi: kerää roskia oman matkasi varrelta ja jaa kuva tunnisteella #roskapäivä2026

Roskapäivä-tapahtumaa järjestävät vuosittain Roskapäivän Eino sekä Sergio Cleaning Angelsilta. Tapahtuman tavoitteena on tuoda ihmiset yhteen tekemään konkreettisia ympäristötekoja rennossa ja yhteisöllisessä hengessä. Jokainen kerätty roska on askel kohti puhtaampaa ympäristöä – ja samalla mahdollisuus inspiroida yhä useampia pitämään yhdessä huolta luonnostamme.$$),
  event_program_title = coalesce(event_program_title, 'Enemmän kuin siivous.'),
  event_program_body = coalesce(event_program_body, $$Ulkona tapahtuvan siivouksen lomassa nautitaan inspiroivista puheista, livemusiikista, yritysten pop-up-näyttelystä, lasten aktiviteeteista, kahvilasta ja rentoutumisalueesta. Roskapäivä on juhla puhtaamman ympäristön puolesta.$$)
where id = 1;
