import { useEffect, useMemo, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { CommunityEvent } from '../../lib/communityEvents';

interface Props {
  events: CommunityEvent[];
  /** City whose marker should read as selected. */
  activeCity: string | null;
  onSelectCity: (city: string | null) => void;
}

interface CityGroup {
  city: string;
  lat: number;
  lng: number;
  count: number;
}

/** Amber pin, sized by how many events the city has. */
function markerIcon(count: number, active: boolean): L.DivIcon {
  const size = count > 1 ? 40 : 30;
  return L.divIcon({
    className: 'rp-marker',
    html: `<span style="
      display:flex;align-items:center;justify-content:center;
      width:${size}px;height:${size}px;border-radius:9999px;
      background:${active ? '#E5BC3A' : '#C9A227'};
      color:#0B160F;
      font-family:Inter,system-ui,sans-serif;font-size:${count > 1 ? 14 : 11}px;font-weight:700;
      border:2px solid ${active ? '#F4F1E8' : 'rgba(244,241,232,0.65)'};
      box-shadow:0 0 0 ${active ? 8 : 4}px rgba(201,162,39,0.22), 0 2px 10px rgba(0,0,0,0.5);
      transition:all .2s;
    ">${count > 1 ? count : ''}</span>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

export default function FinlandMap({ events, activeCity, onSelectCity }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layerRef = useRef<L.LayerGroup | null>(null);

  // One marker per city, so ten Helsinki events do not stack into one blob.
  const groups = useMemo<CityGroup[]>(() => {
    const byCity = new Map<string, CityGroup>();
    events.forEach((e) => {
      if (e.lat == null || e.lng == null) return;
      const existing = byCity.get(e.city);
      if (existing) existing.count += 1;
      else byCity.set(e.city, { city: e.city, lat: e.lat, lng: e.lng, count: 1 });
    });
    return [...byCity.values()];
  }, [events]);

  // Create the map once.
  useEffect(() => {
    if (mapRef.current || !containerRef.current) return;
    const map = L.map(containerRef.current, {
      center: [64.6, 26.0],
      zoom: 5,
      minZoom: 4,
      maxZoom: 12,
      scrollWheelZoom: false, // page scroll wins; the +/- control still zooms
      attributionControl: true,
    });
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
    }).addTo(map);
    layerRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
      layerRef.current = null;
    };
  }, []);

  // Redraw markers whenever the events or the selection change.
  useEffect(() => {
    const layer = layerRef.current;
    if (!layer) return;
    layer.clearLayers();

    groups.forEach((g) => {
      const active = activeCity === g.city;
      L.marker([g.lat, g.lng], {
        icon: markerIcon(g.count, active),
        title: g.city,
        riseOnHover: true,
      })
        .on('click', () => onSelectCity(active ? null : g.city))
        .bindTooltip(
          `<strong>${g.city}</strong><br>${g.count} tapahtuma${g.count === 1 ? '' : 'a'}`,
          { direction: 'top', offset: [0, -10], className: 'rp-tooltip' }
        )
        .addTo(layer);
    });
  }, [groups, activeCity, onSelectCity]);

  // Fly to the selected city so map and list stay in step.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (!activeCity) {
      map.flyTo([64.6, 26.0], 5, { duration: 0.6 });
      return;
    }
    const g = groups.find((x) => x.city === activeCity);
    if (g) map.flyTo([g.lat, g.lng], 9, { duration: 0.7 });
  }, [activeCity, groups]);

  return (
    <div
      ref={containerRef}
      className="h-full w-full"
      role="application"
      aria-label="Kartta Roskapäivän tapahtumista Suomessa"
    />
  );
}
