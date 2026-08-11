import type { Handler } from '@netlify/functions';
import { adminClient } from './_shared';

/**
 * Applies the retention promises in the privacy notice. Scheduled nightly in
 * netlify.toml.
 *
 * The rules themselves live in purge_expired_personal_data() in the database
 * rather than here, so the retention policy sits next to the data it governs
 * and stays true even if this function is never called. This is only the clock.
 *
 * Runs on a schedule, so there is nobody to report to: it logs what it removed
 * and that is the audit trail.
 */
/** Where volunteers' photos have lived. The prefix inside `media` predates the
 *  dedicated bucket in 0021 and still holds older uploads. */
const PHOTO_LOCATIONS: { bucket: string; prefix: string }[] = [
  { bucket: 'community', prefix: '' },
  { bucket: 'media', prefix: 'community' },
];

/** Someone can upload a photo and then abandon the form, so a file younger than
 *  this is left alone even with nothing pointing at it yet. */
const ORPHAN_GRACE_DAYS = 7;

/**
 * Deletes uploaded photos no row points at any more.
 *
 * Deleting a rejected submission removes the row but not the image, and those
 * images sit in a public bucket — so without this, a photo attached to a
 * rejected event stays reachable forever by anyone holding the URL.
 *
 * Scoped to the two places community sign-ups upload to, so it cannot touch the
 * admin's image library or press material.
 */
async function sweepOrphanedPhotos(
  supabase: ReturnType<typeof adminClient>
): Promise<number> {
  const { data: rows } = await supabase
    .from('community_events')
    .select('image_url')
    .not('image_url', 'is', null);
  const referenced = new Set(
    (rows ?? [])
      .map((r: { image_url: string | null }) => r.image_url?.split('/').pop())
      .filter(Boolean) as string[]
  );

  const cutoff = Date.now() - ORPHAN_GRACE_DAYS * 24 * 60 * 60 * 1000;
  let removed = 0;

  for (const { bucket, prefix } of PHOTO_LOCATIONS) {
    const { data: files, error } = await supabase.storage
      .from(bucket)
      .list(prefix, { limit: 1000 });
    if (error || !files) continue;

    const stale = files
      .filter((f) => f.name && !referenced.has(f.name))
      .filter((f) => {
        const created = f.created_at ? Date.parse(f.created_at) : 0;
        return created > 0 && created < cutoff;
      })
      .map((f) => (prefix ? `${prefix}/${f.name}` : f.name));

    if (stale.length) {
      const { error: rmError } = await supabase.storage.from(bucket).remove(stale);
      if (!rmError) removed += stale.length;
    }
  }
  return removed;
}

export const handler: Handler = async () => {
  try {
    const supabase = adminClient();
    const { data, error } = await supabase.rpc('purge_expired_personal_data');
    if (error) {
      console.error('purge-personal-data epäonnistui', error.message);
      return { statusCode: 500, body: JSON.stringify({ ok: false, error: error.message }) };
    }
    // After the rows, not before: a photo only counts as orphaned once the row
    // that referenced it is gone.
    const photosRemoved = await sweepOrphanedPhotos(supabase);
    const result = { ...(data as object), photos_removed: photosRemoved };
    console.log('purge-personal-data', JSON.stringify(result));
    return { statusCode: 200, body: JSON.stringify({ ok: true, ...result }) };
  } catch (err) {
    console.error('purge-personal-data epäonnistui', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ ok: false, error: err instanceof Error ? err.message : 'virhe' }),
    };
  }
};
