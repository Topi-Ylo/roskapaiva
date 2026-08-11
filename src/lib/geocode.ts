/**
 * Address lookup for the sign-up form, via the geocode function.
 *
 * The three outcomes are kept apart on purpose. "No such address" is the
 * organiser's typo and worth stopping for; "geocoder is down" is not their
 * problem and must never cost them a sign-up.
 */
export type GeocodeOutcome =
  | { status: 'ok'; lat: number; lng: number; label: string | null }
  | { status: 'notFound' }
  | { status: 'unavailable' };

export async function geocodeAddress(address: string, city: string): Promise<GeocodeOutcome> {
  // AbortSignal.timeout is not in every browser we support, so drive the
  // controller by hand.
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 9000);
  try {
    const res = await fetch('/.netlify/functions/geocode', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ address, city }),
      signal: controller.signal,
    });
    if (!res.ok) return { status: 'unavailable' };

    const data = (await res.json()) as { lat?: number | null; lng?: number | null; label?: string };
    if (typeof data.lat !== 'number' || typeof data.lng !== 'number') return { status: 'notFound' };
    return { status: 'ok', lat: data.lat, lng: data.lng, label: data.label ?? null };
  } catch {
    return { status: 'unavailable' };
  } finally {
    clearTimeout(timer);
  }
}
