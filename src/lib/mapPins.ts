import { cityCoords, type CommunityEvent } from './communityEvents';

export interface Pin {
  key: string;
  city: string;
  lat: number;
  lng: number;
  count: number;
  /** True when at least one event behind this pin is open to join. */
  hasPublic: boolean;
  /**
   * Who is running it — only when this pin is a single event. Merged pins clear
   * it, because naming one organiser for several events would say something
   * untrue about the others.
   */
  organizer: string | null;
}

/**
 * Below this zoom a municipality shows one pin, however many events it holds;
 * at or above it every distinct position gets its own, so districts and street
 * addresses pull apart instead of stacking on the city centre.
 *
 * Kept under the zoom that selecting a city flies to, so clicking through from
 * the list always lands in the spread-out view.
 */
export const SPREAD_ZOOM = 10;

/**
 * Collapses events into the markers actually drawn at a given zoom.
 *
 * Pure, and exported so the behaviour can be tested without a map: the whole
 * point is that the same events yield one pin per municipality when zoomed out
 * and one per distinct position when zoomed in.
 */
export function groupPins(events: CommunityEvent[], zoom: number): Pin[] {
  const spread = zoom >= SPREAD_ZOOM;
  const byKey = new Map<string, Pin>();
  events.forEach((e) => {
    if (e.lat == null || e.lng == null) return;
    // Five decimals is about a metre, so two events at one address still share
    // a pin rather than sitting invisibly on top of each other.
    const key = spread ? `${e.city}@${e.lat.toFixed(5)},${e.lng.toFixed(5)}` : e.city;
    const existing = byKey.get(key);
    if (existing) {
      existing.count += 1;
      existing.hasPublic ||= Boolean(e.is_public);
      existing.organizer = null;
      return;
    }
    // A collapsed pin belongs on the municipality centre, not on whichever
    // event happened to be read first: otherwise "Helsinki 5" would land in
    // Vuosaari because that row sorted first.
    const centre = spread ? null : cityCoords(e.city);
    byKey.set(key, {
      key,
      city: e.city,
      lat: centre?.lat ?? e.lat,
      lng: centre?.lng ?? e.lng,
      count: 1,
      hasPublic: Boolean(e.is_public),
      organizer: e.organizer_name ?? null,
    });
  });
  return [...byKey.values()];
}

/** The Roskapäivä mark as the pin. Cities with several events carry a count. */
export const PIN_IMAGE = '/favicon.png';
