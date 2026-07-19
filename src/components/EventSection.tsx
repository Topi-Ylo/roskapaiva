import type { ReactNode } from 'react';
import { useTableData } from '../hooks/useTableData';
import { EVENT_HERO_BODY_FALLBACK, useSiteSettings } from '../hooks/useSiteSettings';
import {
  FALLBACK_SCHEDULE,
  FALLBACK_SPONSORS,
  type EventSlot,
  type EventSponsor,
} from '../lib/eventContent';

const HERO_IMAGE = 'https://i.imgur.com/If6GHtz.jpeg';

/** Renders a paragraph, highlighting #hashtags in amber. */
function withHashtags(text: string): ReactNode[] {
  return text
    .split(/(#[\p{L}\p{N}]+)/gu)
    .map((part, i) =>
      part.startsWith('#') ? (
        <span key={i} className="text-amber">
          {part}
        </span>
      ) : (
        part
      )
    );
}

export default function EventSection() {
  const { data } = useTableData<EventSlot>('event_schedule');
  const schedule = data && data.length > 0 ? data : FALLBACK_SCHEDULE;

  // Sponsors are fully admin-controlled: null (Supabase not configured) shows
  // the fallback for local preview; an empty array (admin removed all) hides
  // the band entirely.
  const { data: sponsorData } = useTableData<EventSponsor>('event_sponsors');
  const sponsors = sponsorData ?? FALLBACK_SPONSORS;

  const settings = useSiteSettings();
  const bodyParagraphs = (settings.event_hero_body || EVENT_HERO_BODY_FALLBACK)
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <section id="tapahtuma" className="relative h-[100vh] min-h-[760px] w-full overflow-hidden">
      {/* Background image, brightened 25%, sitting under the legibility gradient. */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url('${HERO_IMAGE}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(1.25)',
        }}
      />
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(rgba(11, 22, 15, 0.78), rgba(11, 22, 15, 0.95))' }}
      />

      <div className="relative z-10 flex h-full flex-col px-6">
        <div className="flex flex-1 items-center pt-24 md:pt-28">
          {/* Two columns: all copy on the left, image + note vertically centred
              against it on the right. */}
          <div className="mx-auto grid w-full max-w-7xl gap-10 md:grid-cols-12 md:items-center md:gap-12">
            <div className="md:col-span-7">
              <p className="reveal eyebrow text-amber">Päätapahtuma · Helsinki</p>

              <h1 className="reveal delay-1 font-display mt-4 text-3xl text-cream sm:text-4xl md:text-5xl">
                Roskapäivä 2026
              </h1>

              <div className="reveal delay-1 mt-3 flex flex-wrap items-end gap-x-6 gap-y-1 leading-none">
                <span className="font-display text-[20vw] text-amber leading-[0.8] sm:text-[16vw] md:text-[12rem]">5.9.</span>
                <span className="font-display text-5xl text-cream sm:text-6xl md:text-7xl">2026</span>
              </div>

              {/* Program at a glance — the day's two time slots, pulled from the
                  same `event_schedule` data the detail cards use, so admin edits
                  flow straight to the hero. */}
              <div className="reveal delay-1 mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
                {schedule.slice(0, 2).map((slot, i) => (
                  <div key={slot.id ?? i} className="flex items-center gap-3 md:gap-4">
                    {i > 0 && <span className="mr-2 hidden h-8 w-px bg-cream/25 sm:block md:mr-3" />}
                    <span className="font-display text-3xl leading-none text-amber md:text-4xl">
                      {slot.slot_time}
                    </span>
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-cream/85 md:text-sm">
                      {slot.label}
                    </span>
                  </div>
                ))}
              </div>

              <h3 className="reveal delay-2 font-display mt-9 text-3xl text-cream md:text-4xl">
                Lauantai. Kalenteriin nyt.
              </h3>

              <div className="reveal delay-2 mt-5 max-w-xl space-y-4 text-sm leading-relaxed text-cream/75 md:text-base">
                {bodyParagraphs.map((p, i) => (
                  <p key={i}>{withHashtags(p)}</p>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-5 md:col-span-5 md:items-end">
              <div className="hidden w-full max-w-sm overflow-hidden border border-cream/15 md:block">
                <img
                  src={HERO_IMAGE}
                  alt="Roskapäivä-tapahtuma"
                  loading="lazy"
                  className="aspect-video w-full object-cover"
                />
              </div>
              <div className="inline-flex w-full max-w-sm flex-col gap-3 border border-cream/15 bg-forest-night/40 p-6 md:p-7">
                <div className="flex items-center gap-3">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-amber" />
                  <p className="eyebrow text-amber">Ilmainen · Kiitos sponsorien</p>
                </div>
                <p className="text-sm leading-relaxed text-cream/75">
                  Koko perheen tapahtuma. Hanskat ja säkit löytyvät paikan päältä, sinä tuot vain hyvän mielen.
                </p>
                <a
                  href="https://instagram.com/roskapaiva"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-amber transition hover:text-amber-light"
                >
                  Seuraa @roskapaiva
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8h10m0 0L8 3m5 5l-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Yhteistyössä — sponsor band anchored to the bottom of the hero. */}
        {sponsors.length > 0 && (
          <div className="reveal delay-3 pb-8 md:pb-10">
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 border-t border-cream/15 pt-6 sm:flex-row sm:items-center sm:gap-12">
              <p className="eyebrow shrink-0 text-cream/50">Yhteistyössä</p>
              <div className="flex flex-wrap items-center gap-x-10 gap-y-4">
                {sponsors.map((s, i) => {
                  // The first sponsor (lowest sort_order) is the main sponsor and
                  // gets a larger logo. Logos render on their own with no plate
                  // or padding, so the full mark shows edge to edge.
                  const main = i === 0;
                  const inner = (
                    <>
                      {s.logo_url && (
                        <img
                          src={s.logo_url}
                          alt={s.name}
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                          className={`w-auto shrink-0 object-contain object-left ${
                            main ? 'h-12 max-w-[140px] md:h-14' : 'h-9 max-w-[100px] md:h-10'
                          }`}
                        />
                      )}
                      <span
                        className={`font-semibold uppercase transition ${
                          main
                            ? 'text-sm tracking-[0.15em] text-cream group-hover:text-amber-light md:text-base'
                            : 'text-xs tracking-wider text-cream/70 group-hover:text-cream'
                        }`}
                      >
                        {s.name}
                      </span>
                    </>
                  );
                  const cls = `group flex items-center ${main ? 'gap-4' : 'gap-2.5'}`;
                  return s.url ? (
                    <a
                      key={s.id ?? s.name}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cls}
                    >
                      {inner}
                    </a>
                  ) : (
                    <div key={s.id ?? s.name} className={cls}>
                      {inner}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
