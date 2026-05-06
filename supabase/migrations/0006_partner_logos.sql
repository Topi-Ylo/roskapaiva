-- Backfill logo_url + website url for the eight seeded partners.
--
-- Logo URLs use Clearbit's logo CDN (https://logo.clearbit.com/<domain>).
-- That endpoint is deprecated as of 2024 but the existing URLs still serve
-- for established domains. Three of the eight are edge cases worth noting:
--   • K-Supermarket Mustapekka — single store inside the K-Ruoka chain;
--     k-ruoka.fi resolves to the chain "K" mark, not a store-specific logo.
--   • Stara — a Helsinki city service, not a standalone domain. hel.fi
--     resolves to the Helsinki crest, not Stara's own wordmark.
--   • Cleaning Angels — small business; Clearbit may have no asset.
-- Open Kumppanit in /admin and replace any that don't render with a clean
-- upload via the new image picker (drag-and-drop or "Lataa uusi kuva").
-- Safe to re-run.

update public.partners
  set logo_url = 'https://logo.clearbit.com/partioaitta.fi',
      url      = 'https://www.partioaitta.fi/'
  where name = 'Partioaitta';

update public.partners
  set logo_url = 'https://logo.clearbit.com/resq-club.com',
      url      = 'https://www.resq-club.com/'
  where name = 'ResQ';

update public.partners
  set logo_url = 'https://logo.clearbit.com/k-ruoka.fi',
      url      = 'https://www.k-ruoka.fi/kauppa/k-supermarket-mustapekka'
  where name = 'K-Supermarket Mustapekka';

update public.partners
  set logo_url = 'https://logo.clearbit.com/taffel.fi',
      url      = 'https://taffel.fi/'
  where name = 'Taffel';

update public.partners
  set logo_url = 'https://logo.clearbit.com/thebrosburger.fi',
      url      = 'https://thebrosburger.fi/'
  where name = 'The Bros Burgers';

update public.partners
  set logo_url = 'https://logo.clearbit.com/cleaningangels.fi',
      url      = 'https://www.cleaningangels.fi/'
  where name = 'Cleaning Angels';

update public.partners
  set logo_url = 'https://logo.clearbit.com/paristokierratys.fi',
      url      = 'https://www.paristokierratys.fi/'
  where name = 'Recser';

update public.partners
  set logo_url = 'https://logo.clearbit.com/hel.fi',
      url      = 'https://www.hel.fi/stara/fi'
  where name = 'Stara';
