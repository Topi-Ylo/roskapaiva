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

/** The Roskapäivä mark as the pin. Cities with several events carry a count. */
const PIN_IMAGE = '/favicon.png';

function markerIcon(count: number, active: boolean): L.DivIcon {
  const size = active ? 46 : 36;
  return L.divIcon({
    className: 'rp-marker',
    html: `<span style="position:relative;display:block;width:${size}px;height:${size}px;">
      <img src="${PIN_IMAGE}" alt="" style="
        display:block;width:100%;height:100%;border-radius:9999px;background:#0B160F;
        border:2px solid ${active ? '#C9A227' : 'rgba(11,22,15,0.5)'};
        box-shadow:0 2px 8px rgba(11,22,15,0.45)${
          active ? ',0 0 0 7px rgba(201,162,39,0.28)' : ''
        };
        transition:all .2s;">
      ${
        count > 1
          ? `<span style="
              position:absolute;top:-5px;right:-5px;min-width:19px;height:19px;padding:0 4px;
              box-sizing:border-box;border-radius:9999px;background:#C9A227;color:#0B160F;
              border:2px solid #F4F1E8;font-family:Inter,system-ui,sans-serif;
              font-size:11px;font-weight:700;line-height:15px;text-align:center;">${count}</span>`
          : ''
      }
    </span>`,
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
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
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
