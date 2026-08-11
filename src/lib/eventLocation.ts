import { cityCoords, type LocationPrecision } from './communityEvents';
import { districtCoords } from './finnishDistricts';
import { geocodeAddress } from './geocode';

export interface ResolvedPosition {
  lat: number | null;
  lng: number | null;
  /**
   * What was actually achieved, which can be coarser than what was asked for:
   * an unreachable geocoder demotes an address to the municipality centre. The
   * stored value stays honest about where the pin really is.
   */
  precision: LocationPrecision;
  /** The address itself is wrong. Callers should stop and let it be corrected
   *  rather than quietly dropping the pin in the city centre. */
  notFound?: boolean;
}

/**
 * Single source of truth for where an event's pin goes, shared by the public
 * sign-up form and the admin editor. Having both call this is what stops an
 * admin edit from resetting a Kallio pin back to Helsinki centre.
 */
export async function resolveEventPosition(input: {
  city: string;
  precision: LocationPrecision;
  district?: string | null;
  address?: string | null;
}): Promise<ResolvedPosition> {
  const centre = cityCoords(input.city);
  const fallback = { lat: centre?.lat ?? null, lng: centre?.lng ?? null };

  if (input.precision === 'district' && input.district) {
    const d = districtCoords(input.city, input.district);
    return d
      ? { lat: d.lat, lng: d.lng, precision: 'district' }
      : { ...fallback, precision: 'city' };
  }

  const address = input.address?.trim();
  if (input.precision === 'address' && address) {
    const hit = await geocodeAddress(address, input.city);
    if (hit.status === 'ok') return { lat: hit.lat, lng: hit.lng, precision: 'address' };
    if (hit.status === 'notFound') return { ...fallback, precision: 'city', notFound: true };
    return { ...fallback, precision: 'city' };
  }

  return { ...fallback, precision: 'city' };
}
