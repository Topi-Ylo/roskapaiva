import { useState, type ReactNode } from 'react';
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

/**
 * Main partner: logo only, shown large. The mark is dark and the hero is dark,
 * so it is inverted to render white, with a soft green halo to lift it off the
 * background. Falls back to the name if there is no logo or it fails to load.
 */
function MainSponsorLogo({ sponsor }: { sponsor: EventSponsor }) {
  const [failed, setFailed] = useState(false);
  const showLogo = Boolean(sponsor.logo_url) && !failed;

  const content = showLogo ? (
    <img
      src={sponsor.logo_url as string}
      alt={sponsor.name}
      loading="lazy"
      onError={() => setFailed(true)}
      className="h-16 w-auto max-w-[220px] object-contain object-left transition md:h-20"
      style={{
        // brightness(0) flattens the mark to black (alpha is kept), then
        // invert(1) turns it pure white — this renders any logo colour white,
        // whereas a bare invert() would just flip the hue (green -> pink).
        // The green glow goes last so it is not inverted itself.
        filter:
          'brightness(0) invert(1) drop-shadow(0 0 6px rgba(127, 212, 163, 0.55)) drop-shadow(0 0 18px rgba(127, 212, 163, 0.3))',
      }}
    />
  ) : (
    <span className="font-semibold uppercase tracking-[0.15em] text-cream md:text-lg">
      {sponsor.name}
    </span>
  );

  return sponsor.url ? (
    <a
      href={sponsor.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={sponsor.name}
      className="inline-flex"
    >
      {content}
    </a>
  ) : (
    <div className="inline-flex">{content}</div>
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
  // First by sort_order is the main partner; the rest are support sponsors.
  const [mainSponsor, ...supportSponsors] = sponsors;

  const settings = useSiteSettings();
  const bodyParagraphs = (settings.event_hero_body || EVENT_HERO_BODY_FALLBACK)
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  // The hero fills at least one viewport but is free to grow when the copy and
  // sponsor band need more room — on phones, and on short laptop screens too.
  // A fixed height here silently clipped the sponsor band.
  return (
    <section
      id="tapahtuma"
      className="relative min-h-[100svh] w-full overflow-hidden md:min-h-[100vh]"
    >
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

      <div className="relative z-10 flex min-h-[100svh] flex-col px-6 md:min-h-[100vh]">
        <div className="flex flex-1 items-center pb-10 pt-24 md:pb-0 md:pt-28">
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
              {settings.event_headliner && (
                <div className="flex w-full max-w-sm items-baseline gap-2.5">
                  <span className="eyebrow shrink-0 text-amber">Pääesiintyjä:</span>
                  <span className="font-display text-xl text-cream md:text-2xl">
                    {settings.event_headliner}
                  </span>
                </div>
              )}
              <div className="hidden w-full max-w-sm overflow-hidden border border-cream/15 md:block">
                <img
                  src={settings.event_headliner_image || HERO_IMAGE}
                  alt={
                    settings.event_headliner
                      ? `Pääesiintyjä ${settings.event_headliner}`
                      : 'Roskapäivä-tapahtuma'
                  }
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
                  className="inline-flex items-center gap-2 py-2 text-xs font-semibold uppercase tracking-widest text-amber transition hover:text-amber-light"
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

        {/* Sponsors — main partner on its own line, support sponsors below. */}
        {sponsors.length > 0 && (
          <div className="reveal delay-3 pb-8 md:pb-10">
            <div className="mx-auto w-full max-w-7xl border-t border-cream/15 pt-6">
              {mainSponsor && (
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-10">
                  <p className="eyebrow shrink-0 text-amber sm:w-56">Pääyhteistyökumppani</p>
                  <MainSponsorLogo sponsor={mainSponsor} />
                </div>
              )}

              {supportSponsors.length > 0 && (
                <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-10 md:mt-6">
                  <p className="eyebrow shrink-0 text-cream/50 sm:w-56">Tukisponsorit</p>
                  <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
                    {supportSponsors.map((s) => {
                      const inner = (
                        <>
                          {s.logo_url && (
                            <img
                              src={s.logo_url}
                              alt=""
                              loading="lazy"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                              className="h-9 w-auto max-w-[100px] shrink-0 object-contain object-left md:h-10"
                            />
                          )}
                          <span className="text-xs font-semibold uppercase tracking-wider text-cream/70 transition group-hover:text-cream">
                            {s.name}
                          </span>
                        </>
                      );
                      return s.url ? (
                        <a
                          key={s.id ?? s.name}
                          href={s.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group flex items-center gap-2.5 py-1"
                        >
                          {inner}
                        </a>
                      ) : (
                        <div key={s.id ?? s.name} className="group flex items-center gap-2.5">
                          {inner}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
