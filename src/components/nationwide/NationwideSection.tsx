import { useEffect, useMemo, useRef, useState } from 'react';
import { useTableData } from '../../hooks/useTableData';
import { useCounter } from '../../hooks/useCounter';
import FinlandMap from './FinlandMap';
import MapLegend from './MapLegend';
import {
  contactLink,
  defaultImageFor,
  FALLBACK_COMMUNITY_EVENTS,
  calcStats,
  formatDuration,
  formatEventDate,
  formatTime,
  normalizeDescription,
  type CommunityEvent,
} from '../../lib/communityEvents';

function Stat({ value, suffix, label }: { value: number; suffix?: string; label: string }) {
  const { ref, value: shown } = useCounter(value);
  return (
    <div ref={ref} className="px-4 py-5 text-center sm:px-6">
      <p className="mega-stat stat-roller text-4xl text-amber md:text-5xl">
        {shown.toLocaleString('fi-FI')}
        {suffix ?? ''}
      </p>
      <p className="eyebrow mt-2 text-cream/50">{label}</p>
    </div>
  );
}

function EventRow({
  event,
  active,
  onSelect,
}: {
  event: CommunityEvent;
  active: boolean;
  onSelect: () => void;
}) {
  const time = formatTime(event.start_time);
  const link = contactLink(event);
  const [expanded, setExpanded] = useState(false);
  const descRef = useRef<HTMLSpanElement>(null);
  const full = useMemo(() => normalizeDescription(event.description), [event.description]);
  // The two-line teaser reads better as flowing text. Kept as written, a
  // description that opens with a short line would spend one of its two lines
  // on a blank one; the breaks come back the moment it is expanded.
  const teaser = useMemo(() => full.replace(/\s+/g, ' '), [full]);
  const hasBreaks = teaser !== full;
  // Only offer the toggle when the text is actually cut off, so short entries
  // do not carry a pointless "Näytä lisää". Measured rather than guessed from
  // length, since the cut-off depends on the column width.
  const [isClamped, setIsClamped] = useState(false);

  useEffect(() => {
    const el = descRef.current;
    if (!el) return;
    const measure = () => {
      // Skip while expanded: the element then fits by definition, and
      // remeasuring would hide the control that collapses it again.
      if (!expanded) setIsClamped(el.scrollHeight > el.clientHeight + 1);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [teaser, expanded]);

  // Line breaks alone justify the toggle: without it the structure the
  // organiser wrote would be unreachable, even on a description short enough
  // to fit two lines.
  const canExpand = isClamped || hasBreaks;
  // The row is a button, so the contact link cannot live inside it: a link
  // nested in a button is invalid and unreachable by keyboard. It sits as a
  // sibling, indented to line up with the text column.
  return (
    <div
      className={`border-l-2 transition ${
        active
          ? 'border-amber bg-amber/10'
          : 'border-transparent hover:border-cream/30 hover:bg-cream/5'
      }`}
    >
    <button type="button" onClick={onSelect} className="flex w-full gap-4 p-4 text-left">
      <img
        src={event.image_url || defaultImageFor(event)}
        alt=""
        loading="lazy"
        className="h-16 w-20 shrink-0 rounded bg-forest-night object-cover"
      />
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-baseline gap-x-3">
          <span className="font-display text-lg text-cream">{event.city}</span>
          {event.featured && (
            <span className="rounded-full bg-amber px-2 py-0.5 text-[11px] font-semibold uppercase tracking-widest text-forest-night sm:text-[10px]">
              Päätapahtuma
            </span>
          )}
          {!event.featured && event.is_public && (
            <span className="rounded-full bg-emerald-400/90 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-forest-night sm:text-[9px]">
              Tapahtuma
            </span>
          )}
          <span className="text-xs text-cream/45">{formatEventDate(event.event_date)}</span>
        </span>
        {event.organizer_name && (
          <span className="mt-0.5 block text-xs text-cream/55">
            Järjestää {event.organizer_name}
          </span>
        )}
        <span
          ref={descRef}
          // `block` and `line-clamp-2` are mutually exclusive: the clamp needs
          // display:-webkit-box, and a same-specificity `block` silently wins,
          // leaving -webkit-line-clamp set but inert.
          className={`mt-1 text-sm leading-snug text-cream/75 ${
            expanded ? 'block whitespace-pre-line' : 'line-clamp-2'
          }`}
        >
          {expanded ? full : teaser}
        </span>
        <span className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-xs uppercase tracking-wider text-cream/40 sm:text-[11px]">
          {time && <span>Klo {time}</span>}
          <span>{formatDuration(event.duration_minutes)}</span>
          {event.participants ? <span>{event.participants} osallistujaa</span> : null}
        </span>
      </span>
    </button>
      {(canExpand || link) && (
        <div className="-mt-1 flex flex-wrap items-center gap-x-5 gap-y-2 pb-4 pl-28 pr-4">
          {canExpand && (
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              aria-expanded={expanded}
              className="inline-flex min-h-[44px] items-center text-xs font-semibold uppercase tracking-widest text-cream/55 transition hover:text-cream sm:min-h-0 sm:text-[11px]"
            >
              {expanded ? 'Näytä vähemmän' : 'Näytä lisää'}
            </button>
          )}
          {link && (
            <a
              href={link.href}
              {...(link.href.startsWith('mailto:')
                ? {}
                : { target: '_blank', rel: 'noopener noreferrer' })}
              className="inline-flex min-h-[44px] items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-amber transition hover:text-amber-light sm:min-h-0 sm:text-[11px]"
            >
              {link.label}
              <svg width="11" height="11" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 8h10m0 0L8 3m5 5l-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </a>
          )}
        </div>
      )}
    </div>
  );
}

export default function NationwideSection({ onSignup }: { onSignup: () => void }) {
  const { data, loading } = useTableData<CommunityEvent>('community_events_public', {
    orderBy: 'event_date',
    publishedOnly: false,
  });

  const events = useMemo<CommunityEvent[]>(
    // `null` means Supabase is not configured, so the demo rows keep the
    // section alive in local preview. An empty array is real data: the table
    // exists and simply has no approved events yet, which has to render as the
    // empty state rather than as fictional events.
    () => {
      const list = loading ? [] : (data ?? FALLBACK_COMMUNITY_EVENTS);
      // Every event falls on the same date, so without an explicit order the
      // rows come back in whatever order Postgres chooses.
      return [...list].sort(
        (a, b) =>
          Number(b.featured ?? false) - Number(a.featured ?? false) ||
          a.event_date.localeCompare(b.event_date) ||
          (a.start_time ?? '').localeCompare(b.start_time ?? '')
      );
    },
    [data, loading]
  );

  const [query, setQuery] = useState('');
  const [activeCity, setActiveCity] = useState<string | null>(null);
  // The map key doubles as a filter, so hiding a kind hides it from the list too;
  // otherwise the list would contradict the map.
  const [showPublic, setShowPublic] = useState(true);
  const [showPrivate, setShowPrivate] = useState(true);

  const publicCount = useMemo(() => events.filter((e) => e.is_public).length, [events]);
  const privateCount = events.length - publicCount;

  const visible = useMemo(
    () => events.filter((e) => (e.is_public ? showPublic : showPrivate)),
    [events, showPublic, showPrivate]
  );

  const stats = useMemo(() => calcStats(visible), [visible]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return visible.filter((e) => {
      if (activeCity && e.city !== activeCity) return false;
      if (!q) return true;
      return (
        e.city.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q) ||
        (e.organizer_name ?? '').toLowerCase().includes(q)
      );
    });
  }, [visible, query, activeCity]);

  return (
    <>
      {/* Johdanto ja tilastot */}
      <section id="kartta" className="relative bg-forest-night pt-24 md:pt-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-10 md:grid-cols-12 md:items-end">
            <div className="md:col-span-7">
              <p className="reveal eyebrow text-amber">Koko Suomi</p>
              <h2 className="reveal delay-1 font-display mt-6 text-5xl leading-tight text-cream md:text-6xl">
                Roskapäivä tapahtuu siellä missä sinäkin olet.
              </h2>
            </div>
            <div className="md:col-span-5">
              <p className="reveal delay-2 text-base leading-relaxed text-cream/75">
                Järjestä oma siivoustalkoo, lähde roskaretkelle kaverin kanssa tai siivoa oma
                lähipuistosi. Ilmoita osallistumisesi, niin se näkyy kartalla ja innostaa muitakin
                lähtemään mukaan.
              </p>
              <button
                type="button"
                onClick={onSignup}
                className="reveal delay-3 mt-6 rounded-full bg-amber px-7 py-4 text-xs font-semibold uppercase sm:py-3 tracking-widest text-forest-night transition hover:bg-amber-light"
              >
                Ilmoita osallistumisesi
              </button>
            </div>
          </div>

          <div className="reveal mt-14 grid grid-cols-1 divide-cream/15 border-y border-cream/15 sm:grid-cols-3 sm:divide-x">
            <Stat value={stats.events} label="Tapahtumaa" />
            <Stat value={stats.cities} label="Paikkakuntaa" />
            <Stat value={stats.hours} suffix=" h" label="Talkootunteja" />
          </div>
          {/* The totals count everyone's events on Roskapäivä's own page, which
              reads as Roskapäivä's tally unless it says otherwise. */}
          <p className="reveal mt-4 text-xs leading-relaxed text-cream/40">
            Luvut kertyvät kaikista kartalle ilmoitetuista tapahtumista, jotka paikalliset
            järjestäjät järjestävät itsenäisesti.
          </p>
        </div>
      </section>

      {/* Lista ja kartta */}
      <section className="relative bg-forest-night py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
            {/* Lista, vierii omassa säiliössään */}
            <div className="order-2 lg:order-1 lg:col-span-5">
              <div className="flex flex-wrap items-center gap-3">
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Hae paikkakuntaa, järjestäjää tai tapahtumaa"
                  className="min-w-0 flex-1 rounded border border-cream/20 bg-forest-deep px-4 py-3 text-base text-cream placeholder:text-cream/35 focus:border-amber focus:outline-none sm:py-2.5 sm:text-sm"
                />
                {activeCity && (
                  <button
                    type="button"
                    onClick={() => setActiveCity(null)}
                    className="rounded-full bg-amber/15 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-amber transition hover:bg-amber/25"
                  >
                    {activeCity} ✕
                  </button>
                )}
              </div>

              <p className="mt-4 text-xs uppercase tracking-widest text-cream/40">
                {filtered.length} tapahtuma{filtered.length === 1 ? '' : 'a'}
              </p>

              <div className="no-scrollbar mt-3 divide-y divide-cream/10 border border-cream/10 lg:max-h-[560px] lg:overflow-y-auto">
                {loading && (
                  <p className="p-8 text-center text-sm text-cream/40">Ladataan tapahtumia…</p>
                )}
                {!loading && filtered.length === 0 && (
                  <p className="p-8 text-center text-sm text-cream/40">
                    Ei tapahtumia hakuehdoilla.
                  </p>
                )}
                {filtered.map((e, i) => (
                  <EventRow
                    key={e.id ?? i}
                    event={e}
                    active={activeCity === e.city}
                    onSelect={() => setActiveCity(activeCity === e.city ? null : e.city)}
                  />
                ))}
              </div>
            </div>

            {/* Kartta pysyy paikallaan kun listaa selataan */}
            <div className="order-1 lg:order-2 lg:col-span-7">
              <div className="lg:sticky lg:top-24">
                <div className="relative h-[62vh] max-h-[560px] min-h-[380px] overflow-hidden border border-cream/15 bg-cream-soft lg:h-[625px] lg:max-h-none">
                  <FinlandMap
                    events={visible}
                    activeCity={activeCity}
                    onSelectCity={setActiveCity}
                  />
                  <MapLegend
                    showPublic={showPublic}
                    showPrivate={showPrivate}
                    publicCount={publicCount}
                    privateCount={privateCount}
                    onToggle={(kind) =>
                      kind === 'public'
                        ? setShowPublic((v) => !v)
                        : setShowPrivate((v) => !v)
                    }
                  />
                </div>
                <p className="mt-3 text-xs text-cream/35">
                  Klikkaa karttamerkkiä nähdäksesi paikkakunnan tapahtumat. Zoomaa lähemmäs, niin
                  saman paikkakunnan tapahtumat erottuvat omiin sijainteihinsa. Selitteestä voit
                  piilottaa tapahtumatyypin.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </>
  );
}
