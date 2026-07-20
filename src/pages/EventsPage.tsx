import { useEffect, useMemo, useRef, useState } from 'react';
import FooterSection from '../components/FooterSection';
import EventDetailModal from '../components/events/EventDetailModal';
import { useTableData } from '../hooks/useTableData';
import {
  FALLBACK_EVENTS,
  eventDateLabel,
  eventDay,
  eventMonth,
  isUpcoming,
  sortEvents,
  type EventItem,
} from '../lib/eventsData';

function DateBadge({ event }: { event: EventItem }) {
  const day = eventDay(event);
  const month = eventMonth(event);
  return (
    <div className="flex h-20 w-16 flex-col items-center justify-center bg-amber font-display text-forest-night">
      {day ? (
        <>
          <span className="text-2xl leading-none">{day}</span>
          <span className="text-[10px] font-semibold uppercase tracking-tight">{month}</span>
        </>
      ) : (
        <span className="px-1 text-center text-[10px] font-semibold uppercase tracking-tight">
          Pian
        </span>
      )}
    </div>
  );
}

function FeaturedEventCard({ event, onSelect }: { event: EventItem; onSelect: (e: EventItem) => void }) {
  return (
    <article
      className="reveal group col-span-1 cursor-pointer md:col-span-2"
      onClick={() => onSelect(event)}
    >
      <div className="grid grid-cols-1 overflow-hidden border border-cream/15 bg-forest-deep md:grid-cols-2">
        <div className="relative min-h-[280px] overflow-hidden bg-forest-night md:min-h-[460px]">
          {event.image_url && (
            <img
              src={event.image_url}
              alt=""
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/60 to-transparent" />
          <div className="absolute left-6 top-6">
            <DateBadge event={event} />
          </div>
          {isUpcoming(event) && (
            <span className="absolute bottom-6 left-6 inline-flex items-center gap-2 rounded-full bg-amber px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-forest-night">
              <span className="h-1.5 w-1.5 rounded-full bg-forest-night" />
              Seuraava tapahtuma
            </span>
          )}
        </div>

        <div className="flex flex-col justify-between p-8 md:p-12">
          <div>
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-amber" />
              {event.type && <span className="eyebrow text-amber">{event.type}</span>}
            </div>
            <h2 className="font-display mt-6 text-4xl leading-tight text-cream md:text-5xl">
              {event.title}
            </h2>
            {event.subtitle && (
              <p className="font-display mt-1 text-2xl text-amber md:text-3xl">{event.subtitle}</p>
            )}

            <div className="mt-8 grid grid-cols-2 gap-6 border-t border-cream/10 pt-8">
              <div>
                <p className="eyebrow text-cream/40">Paikka</p>
                <p className="mt-1 text-sm text-cream/85">{event.location ?? '—'}</p>
              </div>
              <div>
                <p className="eyebrow text-cream/40">Ajankohta</p>
                <p className="mt-1 text-sm text-cream/85">{eventDateLabel(event)}</p>
              </div>
            </div>

            {event.description && (
              <p className="mt-8 text-base leading-relaxed text-cream/70">{event.description}</p>
            )}
          </div>

          <span className="mt-10 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-amber">
            Lue lisää
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10m0 0L8 3m5 5l-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </span>
        </div>
      </div>
    </article>
  );
}

function StandardEventCard({
  event,
  index,
  onSelect,
}: {
  event: EventItem;
  index: number;
  onSelect: (e: EventItem) => void;
}) {
  return (
    <article
      className={`reveal group cursor-pointer ${index % 2 === 1 ? 'md:mt-20' : ''}`}
      onClick={() => onSelect(event)}
    >
      <div className="relative mb-6 aspect-[4/5] overflow-hidden bg-forest-night">
        {event.image_url && (
          <img
            src={event.image_url}
            alt=""
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-forest-night/70 to-transparent" />
        <div className="absolute right-6 top-6">
          <DateBadge event={event} />
        </div>
        {isUpcoming(event) && (
          <span className="absolute bottom-6 left-6 inline-flex items-center gap-2 rounded-full bg-amber px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-forest-night">
            Tuleva
          </span>
        )}
      </div>

      <div className="flex items-start justify-between gap-4">
        <div>
          {event.type && <p className="eyebrow text-amber">{event.type}</p>}
          <h3 className="font-display mt-2 text-2xl leading-tight text-cream md:text-3xl">
            {event.title} {event.subtitle}
          </h3>
        </div>
        <svg
          width="20"
          height="20"
          viewBox="0 0 16 16"
          fill="none"
          className="mt-1 shrink-0 text-cream/30 transition group-hover:text-amber"
        >
          <path d="M3 8h10m0 0L8 3m5 5l-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
      <p className="mt-2 text-sm text-cream/50">
        {eventDateLabel(event)}
        {event.location ? ` · ${event.location}` : ''}
      </p>
      {event.description && (
        <p className="mt-4 max-w-md text-sm leading-relaxed text-cream/65">{event.description}</p>
      )}
    </article>
  );
}

export default function EventsPage() {
  const { data, loading } = useTableData<EventItem>('events', { orderBy: 'sort_order' });
  const events = useMemo<EventItem[]>(
    () => (data && data.length > 0 ? data : loading ? [] : FALLBACK_EVENTS),
    [data, loading]
  );

  const [filter, setFilter] = useState<'tulevat' | 'menneet'>('tulevat');
  const [selected, setSelected] = useState<EventItem | null>(null);

  // Choose the default tab once data is in: Tulevat if anything is upcoming,
  // otherwise Menneet. Runs once so it never overrides a user click.
  const didInit = useRef(false);
  useEffect(() => {
    if (loading || didInit.current || events.length === 0) return;
    didInit.current = true;
    setFilter(events.some(isUpcoming) ? 'tulevat' : 'menneet');
  }, [loading, events]);

  const upcoming = sortEvents(events.filter(isUpcoming), true);
  const past = sortEvents(events.filter((e) => !isUpcoming(e)), false);
  const filtered = filter === 'tulevat' ? upcoming : past;
  const single = filtered.length === 1;

  return (
    <>
      <section id="tapahtumat" className="relative min-h-screen bg-forest-night pb-24 pt-32 md:pt-40">
        <div className="mx-auto max-w-7xl px-6">
          <header className="reveal">
            <div className="flex items-center gap-3">
              <span className="h-px w-12 bg-amber" />
              <span className="eyebrow text-amber">Tapahtumakalenteri</span>
            </div>
            <h1 className="font-display mt-6 text-5xl text-cream sm:text-7xl md:text-8xl">
              Tapahtumat
            </h1>

            <div className="mt-10 flex items-center gap-8 border-y border-cream/15 py-5">
              {(['tulevat', 'menneet'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setFilter(t)}
                  className={`text-xs font-semibold uppercase tracking-widest transition ${
                    filter === t
                      ? 'border-b-2 border-amber pb-1 text-cream'
                      : 'text-cream/40 hover:text-cream'
                  }`}
                >
                  {t === 'tulevat' ? `Tulevat (${upcoming.length})` : `Menneet (${past.length})`}
                </button>
              ))}
            </div>
          </header>

          <div className="mt-10 grid grid-cols-1 gap-x-10 gap-y-12 md:mt-16 md:gap-y-16 md:grid-cols-2">
            {loading && (
              <div className="col-span-full py-24 text-center text-cream/40">Ladataan tapahtumia…</div>
            )}
            {!loading && filtered.length === 0 && (
              <div className="col-span-full py-24 text-center">
                <p className="eyebrow text-cream/40">
                  {filter === 'tulevat' ? 'Ei tulevia tapahtumia juuri nyt' : 'Ei menneitä tapahtumia'}
                </p>
              </div>
            )}
            {!loading && single && (
              <FeaturedEventCard event={filtered[0]} onSelect={setSelected} />
            )}
            {!loading &&
              !single &&
              filtered.map((event, i) => (
                <StandardEventCard
                  key={event.id ?? event.title}
                  event={event}
                  index={i}
                  onSelect={setSelected}
                />
              ))}
          </div>
        </div>
      </section>

      <EventDetailModal event={selected} onClose={() => setSelected(null)} />
      <FooterSection />
    </>
  );
}
