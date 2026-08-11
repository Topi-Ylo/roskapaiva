import { useEffect, useMemo, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { CommunityEvent } from '../../lib/communityEvents';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { groupPins } from '../../lib/mapPins';

/** Tooltips are built as an HTML string, so organiser names must be escaped. */
function escapeHtml(v: string): string {
  return v
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** The Roskapäivä mark as the pin. Cities with several events carry a count. */
export const PIN_IMAGE = '/favicon.png';

interface Props {
  events: CommunityEvent[];
  /** City whose marker should read as selected. */
  activeCity: string | null;
  onSelectCity: (city: string | null) => void;
}

/**
 * Open events invert the mark and take a heavier dark ring, so they read as a
 * different kind of pin at a glance.
 *
 * The invert sits on the <img> and the border on the wrapper deliberately: a
 * CSS filter applies to the whole element including its border, so putting
 * both on the image would flip the dark ring to a light one.
 */
function markerIcon(count: number, active: boolean, isPublic: boolean): L.DivIcon {
  const size = active ? 46 : 36;
  const border = active ? '#C9A227' : isPublic ? '#0B160F' : 'rgba(11,22,15,0.5)';
  return L.divIcon({
    className: 'rp-marker',
    html: `<span style="position:relative;display:block;width:${size}px;height:${size}px;">
      <span style="
        display:block;width:100%;height:100%;box-sizing:border-box;
        border-radius:9999px;overflow:hidden;background:#0B160F;
        border:${isPublic ? 3 : 2}px solid ${border};
        box-shadow:0 2px 8px rgba(11,22,15,0.45)${
          active ? ',0 0 0 7px rgba(201,162,39,0.28)' : ''
        };
        transition:all .2s;">
        <img src="${PIN_IMAGE}" alt="" style="
          display:block;width:100%;height:100%;${isPublic ? 'filter:invert(1);' : ''}">
      </span>
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
  const [zoom, setZoom] = useState(5);
  /**
   * Where a finger last landed. Only used to keep that one label open, because
   * a finger cannot hover — with a mouse the tooltip behaves normally and
   * pinning it would leave labels stuck open all over the map.
   */
  const [tappedKey, setTappedKey] = useState<string | null>(null);
  const canHover = useMediaQuery('(hover: hover) and (pointer: fine)');

  // Zoomed out, everything in a municipality collapses to one pin so the south
  // coast stays readable; zoomed in, each position stands on its own.
  const pins = useMemo(() => groupPins(events, zoom), [events, zoom]);

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
    map.on('zoomend', () => setZoom(map.getZoom()));
    setZoom(map.getZoom());
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

    pins.forEach((p) => {
      const active = activeCity === p.city;
      L.marker([p.lat, p.lng], {
        icon: markerIcon(p.count, active, p.hasPublic),
        title: p.city,
        riseOnHover: true,
      })
        .on('click', () => {
          setTappedKey(active ? null : p.key);
          onSelectCity(active ? null : p.city);
        })
        .bindTooltip(
          `<strong>${p.city}</strong><br>${p.count} tapahtuma${p.count === 1 ? '' : 'a'}` +
            // Naming the organiser is the point: without it every pin reads as
            // one of Roskapäivä's own events. Escaped - the name is user input.
            (p.organizer ? `<br>Järjestää ${escapeHtml(p.organizer)}` : '') +
            (p.hasPublic ? '<br><em>Avoin kaikille</em>' : ''),
          {
            direction: 'top',
            offset: [0, -10],
            className: 'rp-tooltip',
            // Pinned open only on touch, and only for the pin actually tapped.
            // Keying it to the city instead left every pin in that city showing
            // its label at once, and on a mouse it fought the hover it was
            // meant to stand in for.
            permanent: !canHover && p.key === tappedKey,
          }
        )
        .addTo(layer);
    });
  }, [pins, activeCity, onSelectCity, tappedKey, canHover]);

  // Fly to the selected city so map and list stay in step.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (!activeCity) {
      setTappedKey(null);
      map.flyTo([64.6, 26.0], 5, { duration: 0.6 });
      return;
    }
    const points = events
      .filter((e) => e.city === activeCity && e.lat != null && e.lng != null)
      .map((e) => [e.lat as number, e.lng as number] as [number, number]);
    if (!points.length) return;

    // Frame the whole municipality when its events are spread across districts,
    // so picking "Helsinki" reveals the separate pins rather than one stack.
    const distinct = new Set(points.map((p) => p.join(','))).size;
    if (distinct > 1) {
      map.flyToBounds(L.latLngBounds(points), {
        padding: [60, 60],
        maxZoom: 13,
        duration: 0.7,
      });
    } else {
      map.flyTo(points[0], 12, { duration: 0.7 });
    }
  }, [activeCity, events]);

  return (
    <div
      ref={containerRef}
      className="h-full w-full"
      role="application"
      aria-label="Kartta Roskapäivän tapahtumista Suomessa"
    />
  );
}
