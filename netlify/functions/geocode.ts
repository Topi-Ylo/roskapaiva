import type { Handler } from '@netlify/functions';
import { SITE_URL } from './_shared';

/**
 * Turns a street address into map coordinates for the sign-up form.
 *
 * This runs as a function rather than a fetch straight from the browser
 * because Nominatim's usage policy requires a User-Agent identifying the
 * application, and a browser will not let a page set one.
 *
 * Nothing is stored here. The caller keeps the coordinates and sends them with
 * the sign-up; the address itself never reaches the public view.
 */
const NOMINATIM = 'https://nominatim.openstreetmap.org/search';

function json(statusCode: number, body: unknown) {
  return { statusCode, headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) };
}

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  let address = '';
  let city = '';
  try {
    const body = JSON.parse(event.body ?? '{}');
    address = String(body.address ?? '').trim();
    city = String(body.city ?? '').trim();
  } catch {
    return json(400, { error: 'invalid body' });
  }

  // Keeps obvious junk off a shared public service. Anything that passes is a
  // plausible Finnish street address.
  if (address.length < 3 || address.length > 200 || city.length > 80) {
    return json(400, { error: 'invalid address' });
  }

  const query = [address, city, 'Finland'].filter(Boolean).join(', ');
  const url = `${NOMINATIM}?${new URLSearchParams({
    q: query,
    format: 'jsonv2',
    limit: '1',
    countrycodes: 'fi',
  })}`;

  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': `Roskapaiva/1.0 (${SITE_URL})`,
        'Accept-Language': 'fi',
      },
      signal: AbortSignal.timeout(7000),
    });
    if (!res.ok) return json(502, { error: 'geocoder unavailable' });

    const hits = (await res.json()) as { lat?: string; lon?: string; display_name?: string }[];
    const hit = Array.isArray(hits) ? hits[0] : undefined;
    // A miss is a normal outcome, not a failure: the form falls back to the
    // district or the municipality and the sign-up still goes through.
    if (!hit?.lat || !hit?.lon) return json(200, { lat: null, lng: null });

    return json(200, {
      lat: Number(hit.lat),
      lng: Number(hit.lon),
      label: hit.display_name ?? null,
    });
  } catch {
    return json(502, { error: 'geocoder unavailable' });
  }
};
