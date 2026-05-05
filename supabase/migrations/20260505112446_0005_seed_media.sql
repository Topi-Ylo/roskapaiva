-- Seed Some-yhteistyöt and Mediajulkaisut from the React FALLBACK arrays.
-- These two tables were missing from 0002_seed.sql, so the admin pages and
-- the dashboard counts show 0 until this runs.
-- Safe to re-run: UNIQUE constraints below + on conflict do nothing.

-- ─────────────────────────────────────────────────────────────────────────────
-- Idempotency: add UNIQUE constraints on natural keys.
-- (Past tables got their constraints in 0003_fix_duplicates.sql; these two
-- never had any because they were never seeded.)
-- ─────────────────────────────────────────────────────────────────────────────
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'social_media_collabs_brand_platform_unique'
  ) then
    alter table public.social_media_collabs
      add constraint social_media_collabs_brand_platform_unique unique (brand, platform);
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'media_posts_url_unique'
  ) then
    alter table public.media_posts
      add constraint media_posts_url_unique unique (url);
  end if;
end $$;

-- ─────────────────────────────────────────────────────────────────────────────
-- Some-yhteistyöt (MediaLibrarySection FALLBACK_ITEMS)
-- ─────────────────────────────────────────────────────────────────────────────
insert into public.social_media_collabs
  (brand, platform, description, thumbnail_url, video_type, video_id, video_url, aspect, sort_order)
values
  ('Siisti toukokuu',           'Some-yhteistyö', 'Yhteistyö Nissan Suomen kanssa.',         'https://vumbnail.com/1095523594.jpg', 'vimeo',   '1095523594', null, '9/16', 10),
  ('Koulujen Roskapäivät',      'Some-yhteistyö', 'Yhteistyö Vantaan kaupungin kanssa.',     'https://vumbnail.com/1095522083.jpg', 'vimeo',   '1095522083', null, '9/16', 20),
  ('Uula',                       'Some-yhteistyö', 'Mainosyhteistyö.',                        'https://vumbnail.com/1038893525.jpg', 'vimeo',   '1038893525', null, '9/16', 30),
  ('Suomen luonnonsuojeluliitto','Some-yhteistyö', 'Mainosyhteistyö.',                        'https://vumbnail.com/954350903.jpg',  'vimeo',   '954350903',  null, '9/16', 40),
  ('Recser / Paristokierrätys', 'Some-yhteistyö', 'Mainosyhteistyö.',                        'https://vumbnail.com/954745018.jpg',  'vimeo',   '954745018',  null, '9/16', 50),
  ('Kiertokaari',                'Some-yhteistyö', 'Mainosyhteistyö.',                        'https://vumbnail.com/1038894136.jpg', 'vimeo',   '1038894136', null, '9/16', 60),
  ('Niimaar',                    'Some-yhteistyö', 'Mainos ja arvonta.',                      'https://vumbnail.com/1038892814.jpg', 'vimeo',   '1038892814', null, '9/16', 70),
  ('Siivoussyyskuu',             'Some-yhteistyö', 'Yhteistyö Vantaan kaupungin kanssa.',     'https://vumbnail.com/1044333857.jpg', 'vimeo',   '1044333857', null, '9/16', 80),
  ('Tavarapyöräasiantuntija',    'Some-yhteistyö', 'Mainosyhteistyö.',                        'https://vumbnail.com/954743134.jpg',  'vimeo',   '954743134',  null, '9/16', 90),
  ('Lidl Suomi',                 'Some-yhteistyö', 'Mainosyhteistyö.',                        'https://vumbnail.com/954760024.jpg',  'vimeo',   '954760024',  null, '9/16', 100),
  ('Rinki-ekopiste',             'Some-yhteistyö', 'Mainosyhteistyö.',                        'https://vumbnail.com/954738656.jpg',  'vimeo',   '954738656',  null, '9/16', 110),
  ('Roskatutkija',               'YouTube',        'Roskapäivä-sisältö.',                     'https://img.youtube.com/vi/3BNrkHIdJmc/maxresdefault.jpg', 'youtube', '3BNrkHIdJmc', null, '16/9', 120),
  ('Pistä pussiin',              'YouTube',        'Roskapäivä-kampanja.',                    'https://img.youtube.com/vi/dDq_REAMY08/maxresdefault.jpg', 'youtube', 'dDq_REAMY08', null, '16/9', 130),
  ('Ois Siistimpää',             'YouTube',        'Roskapäivä-kampanja.',                    'https://img.youtube.com/vi/5B-sfgqXvy8/maxresdefault.jpg', 'youtube', '5B-sfgqXvy8', null, '16/9', 140)
on conflict (brand, platform) do nothing;

-- ─────────────────────────────────────────────────────────────────────────────
-- Mediajulkaisut (MediaSection FALLBACK_TV / FALLBACK_PRESS / FALLBACK_OTHER)
-- ─────────────────────────────────────────────────────────────────────────────
insert into public.media_posts
  (category, source, title, description, image_url, url, sort_order)
values
  -- TV / video
  ('tv', 'MTV Uutiset',
   'Roskavaikuttaja Eino järkyttyi Kaivopuiston vappukunnosta: "Kadotus ja tuho"',
   'Moni kauhistui, kuinka kauheaan kuntoon vapun kymmenet tuhannet juhlijat jättivät Helsingin Kaivopuiston. Yksi syy, miksi niin moni näki sotkun, on roskavaikuttaja Eino Oinio.',
   'https://api.mtvuutiset.fi/graphql/caas/v1/media/share/9333286/cef9508776e8d11081a7713eac887442/0405-roskaaminen.jpg',
   'https://www.mtvuutiset.fi/artikkeli/roskavaikuttaja-eino-jarkyttyi-kaivopuiston-vappukunnosta-kadotus-ja-tuho/9333374',
   10),
  ('tv', 'MTV Uutiset · Huomenta Suomi',
   'Roskapäivä tulee — tapahtuman isä Eino jakaa vinkkinsä siistimpään kaupunkiin',
   'Eino vieraana Huomenta Suomessa ennen vuotuista Roskapäivää.',
   'https://imageproxy.a2d.tv/?source=https%3A%2F%2Ftvmedia.image-service.eu-north-1-prod.vmnd.tv%2Fapi%2Fv2%2Fimg%2F66d40ec5e4b0172576f428d3-1725173445678%3Flocation%3Dmain&width=1200',
   'https://www.mtvuutiset.fi/videot/video/prog20850305',
   20),
  ('tv', 'MTV Uutiset · Huomenta Suomi',
   'Jäteongelmaan herännyt perheenisä luo toivoa roska kerrallaan',
   'Vieraana luonnonsuojelija Teemu "Eino" Oinio.',
   'https://imageproxy.a2d.tv/?source=https%3A%2F%2Ftvmedia.image-service.eu-north-1-prod.vmnd.tv%2Fapi%2Fv2%2Fimg%2F668b92f2e4b0a33c8bcf9a3c-1720424291601%3Flocation%3Dmain&width=1200',
   'https://www.mtvuutiset.fi/videot/video/prog20834774',
   30),

  -- Press
  ('press', 'MTV Uutiset',
   'Roskapäivä-Einon nerokas kierrätyskikka: "Voi pitää taskussa"',
   'Perheenisä Teemu "Eino" Oinio alkoi kerätä roskia luonnosta.',
   'https://api.mtvuutiset.fi/graphql/caas/v1/media/share/8970076/6aa36e1d926962c335ec051188157449/jateongelma-perheenisa.jpg',
   'https://www.mtvuutiset.fi/artikkeli/roskapaiva-einon-nerokas-kierratyskikka-voi-pitaa-taskussa/8970034',
   100),
  ('press', 'Uusiouutiset',
   'Roskavaikuttajaksi noussut hammasteknikko Teemu "Eino" Oinio ei nolostu tuijotuksesta vaan kannustaa kaikkia liittymään Roskapäivään',
   'Roskavaikuttaja Eino inspiroi ihmisiä keräämään roskia pois luonnosta ja kaduilta. Suomessa vietetään 7.9.2024 Roskapäivää.',
   'https://uusiouutiset.fi/wp-content/uploads/2024/09/roskapaiva-3-700.jpg',
   'https://uusiouutiset.fi/roskavaikuttajaksi-noussut-hammasteknikko-teemu-eino-oinio-ei-nolostu-tuijotuksesta-vaan-kannustaa-kaikkia-liittymaan-roskapaivaan/',
   110),
  ('press', 'Meillä Kotona',
   'Päätä poimia roska maasta joka päivä, kehottaa Roskapäivä-projektin Teemu Oinio',
   'Teemu Oinio kuvaa roskia Instagramiin ja kerää ne mennessään. Roskaretket avaavat silmät jäteongelmalle ja auttavat suhtautumaan siihen uudella tavalla.',
   'https://assets.meillakotona.fi/elvis/file/Fs03rw8CKPB9lYi4qTRRBp/*/1706758_1770336362990_NnRGE.jpg?w=1200&h=630&q=75&fit=crop-center',
   'https://www.meillakotona.fi/artikkelit/roskapaiva-projektin-teemu-oinio',
   120),
  ('press', 'Kirkko ja Kaupunki',
   'Roskapäivä-Einon somepostausten, kouluvierailuiden ja taiteen aiheena ovat roskat',
   'Itseoppineeksi roskatutkijaksi itseään kutsuva Eino jakaa Instagramissa tietoa roskista ja kannustaa ihmisiä keräämään niitä.',
   'https://www.kirkkojakaupunki.fi/o/adaptive-media/image/48630698/1200/48630688-1048715.jpeg',
   'https://www.kirkkojakaupunki.fi/-/-roskapaiva-einon-somepostausten-kouluvierailuiden-ja-taiteen-aiheena-ovat-roskat-pyrin-jakamaan-tietoa-ympariston-roskaantumisesta-rennolla-tyylilla-',
   130),
  ('press', 'WWF Lehti 2/2022',
   'Roskaretket auttoivat ympäristöahdistukseen: "Olen huomannut, kuinka paljon yksikin ihminen voi saada aikaan"',
   'Roskapäivä-Eino kannustaa Instagramissa lähtemään roskaretkille. Konkreettinen tekeminen ja yhteisöllisyys tuovat toivoa synkkien ympäristöuutisten keskellä.',
   'https://wwf.fi/app/uploads/z/0/h/ia7fe1tpwxb6vo7vash36/roska-eino-aspect-ratio-16-9-2048x1152.jpg',
   'https://wwf.fi/wwf-lehti/wwf-lehti-2-2022/roskaretket-auttoivat-ymparistoahdistukseen-olen-huomannut-kuinka-paljon-yksikin-ihminen-voi-saada-aikaan/',
   140),
  ('press', 'WWF Suomi · Mediakutsu',
   'Dokumenttielokuva perheenisän roskaprojektista haastaa pohtimaan, mitä jokainen voi tehdä luonnon puolesta',
   'Mediakutsu Trashday-dokumenttielokuvan ennakkonäytökseen. Yhteistyössä WWF Suomen kanssa.',
   'https://wwf.fi/app/uploads/9/g/n/riorb4ircgwmwe1kd52783/2019_wwfsivustonstandardi_fb-jakokuva_1200x630.jpg',
   'https://wwf.fi/tiedotteet/2024/05/mediakutsu-dokumenttielokuva-perheenisan-roskaprojektista-haastaa-pohtimaan-mita-jokainen-voi-tehda-luonnon-puolesta/',
   150),
  ('press', 'Apu',
   'Sähkötupakointi yleistyy, vaarallinen piirre: "En olisi fiiliksissä, jos lapseni vetäisivät akkukemikaaleja"',
   'Eino kommentoi: kertakäyttöiset sähkötupakat ovat riski luonnolle ja käyttäjilleen, jotka ovat yhä useammin alaikäisiä.',
   'https://assets.apu.fi/elvis/file/04Xd0CpWKYC8qm0jT-knuG/*/Teemu_Oinio_eli_Roskap%C3%A4iv%C3%A4-Eino_ja_luonnosta_l%C3%B6ydetty_vaperoska_(1)_1770593907561_57z1x.jpg?w=1200&h=630&q=75&fit=crop-center&crop=1920,1080,0,509',
   'https://www.apu.fi/artikkelit/sahkotupakoinnin-yleistymisen-vaarallinen-piirre',
   160),
  ('press', 'Mustankorkea · Kulku-lehti 2/2024',
   'Roskavaikuttaja Eino Oinio pistää itsensä likoon puhtaan lähiluonnon puolesta',
   'Sosiaalisen median roskavaikuttajana tunnettu Eino on 38-vuotias hammasteknikko, skeittaaja ja perheenisä Vantaalta.',
   'https://www.mustankorkea.fi/wp-content/uploads/2024/09/roskapaiva-4.jpg',
   'https://www.mustankorkea.fi/blogit/roskavaikuttaja-eino/',
   170),
  ('press', 'Uula',
   'Arkisia valintoja — luonnonmaalia ja kotitekoista dödöä',
   'Roskavaikuttaja Eino lieventää ympäristöahdistusta pienin arkisin valinnoin. Luonnonmaalein maalattu koti tuo levollisen mielen.',
   'https://uula.fi/wp-content/uploads/2024/11/roskapaiva-kalliolla.webp',
   'https://uula.fi/blogi/luonnonmaalia-ja-kotitekoista-dodoa/',
   180),
  ('press', 'Turun Seutusanomat',
   'Ympäristövaikuttaja Teemu "Eino" Oinio vierailulla Turun Varissuolla',
   'Roskapäivät järjestävä Varissuo-Seura sai asukasbudjettirahaa Moikkaa naapuria, tutustu lähiluontoon varissuolainen! -hankkeelleen.',
   'https://turunseutusanomat.fi/wp-content/uploads/2025/11/Teemu-Eino-Oinio-web.jpg',
   'https://turunseutusanomat.fi/2025/11/ymparistovaikuttaja-teemu-eino-oinio-varissuolla/',
   190),

  -- Other / podcast
  ('podcast', 'Tubecon Awards 2025',
   'Eino ehdolla Vuoden vastuullisuusvaikuttajaksi',
   'Eino oli ehdolla Tubecon Awards 2025 -gaalassa Vuoden vastuullisuusvaikuttaja -kategoriaan. Suomen suurin vaikuttajagaala järjestettiin Turun Logomossa toukokuussa 2025.',
   'https://i.imgur.com/yxI0zxE.jpeg',
   'https://www.tilt.fi/uutiset/ketka-ovat-taman-hetken-kuumimmat-sisallontuottajat-tubecon-awards-ehdokkaat-julki/',
   200),
  ('podcast', 'Trailpodder · Podcast',
   'TRAILPODDER Podcast 66 — Roskapäivä Eino: Käpyläkierros',
   'Eino vieraana Trailpodder-podcastissa. Syyskuu 2022, kesto 1 h 27 min.',
   'https://is1-ssl.mzstatic.com/image/thumb/Podcasts122/v4/d6/84/b5/d684b5c7-3f73-b514-8e11-8c4d2fb86d30/mza_13923872158148369605.jpg/600x600bb.jpg',
   'https://podcasts.apple.com/de/podcast/trailpodder-podcast-66-roskap%C3%A4iv%C3%A4-eino-k%C3%A4pyl%C3%A4kierros/id1573605878?i=1000578577240',
   210)
on conflict (url) do nothing;
