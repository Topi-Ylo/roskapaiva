-- 0021: a dedicated bucket for public sign-up photos.
--
-- Community photos previously went into `media`, alongside the mediakortti PDF
-- and the press ZIP. Those are uncompressed and can be tens of megabytes, so
-- `media` has to stay generous, which left the one anonymous upload path able
-- to write 50 MB files. A separate bucket gets a tight limit and an image-only
-- MIME allowlist, enforced by storage itself rather than by the browser.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'community', 'community', true,
  3145728,  -- 3 MB; the form already shrinks to under 2 MB
  array['image/jpeg','image/png','image/webp','image/heic','image/heif']
)
on conflict (id) do update
  set public             = excluded.public,
      file_size_limit    = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "community_public_read" on storage.objects;
create policy "community_public_read" on storage.objects
  for select using (bucket_id = 'community');

drop policy if exists "community_anon_insert" on storage.objects;
create policy "community_anon_insert" on storage.objects
  for insert to anon, authenticated
  with check (bucket_id = 'community');

-- Admins can tidy up rejected or unwanted photos.
drop policy if exists "community_admin_manage" on storage.objects;
create policy "community_admin_manage" on storage.objects
  for all using (bucket_id = 'community' and public.is_admin())
  with check (bucket_id = 'community' and public.is_admin());

-- The old anonymous route into `media` is no longer needed. Existing files
-- there keep working: media's public read policy is untouched.
drop policy if exists "media_community_insert" on storage.objects;
