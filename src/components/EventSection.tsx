import { useTableData } from '../hooks/useTableData';
import {
  FALLBACK_SCHEDULE,
  FALLBACK_SPONSORS,
  type EventSlot,
  type EventSponsor,
} from '../lib/eventContent';

export default function EventSection() {
  const { data } = useTableData<EventSlot>('event_schedule');
  const schedule = data && data.length > 0 ? data : FALLBACK_SCHEDULE;

  // Sponsors are fully admin-controlled: null (Supabase not configured) shows
  // the fallback for local preview; an empty array (admin removed all) hides
  // the band entirely.
  const { data: sponsorData } = useTableData<EventSponsor>('event_sponsors');
  const sponsors = sponsorData ?? FALLBACK_SPONSORS;

  return (
    <section id="tapahtuma" className="relative h-[100vh] min-h-[760px] w-full overflow-hidden">
      {/* Background image, brightened 25%, sitting under the legibility gradient. */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "url('https://i.imgur.com/If6GHtz.jpeg')",
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
        {/* Main hero content — centered in the space above the sponsor band,
            which nudges it up slightly. */}
        <div className="flex flex-1 items-center pt-24 md:pt-28">
          <div className="mx-auto w-full max-w-7xl">
            <p className="reveal eyebrow text-amber">Päätapahtuma · Helsinki</p>

            <div className="reveal delay-1 mt-6 flex flex-wrap items-end gap-x-8 gap-y-2 leading-none">
              <span className="font-display text-[22vw] text-amber leading-[0.8] sm:text-[20vw] md:text-[16rem]">5.9.</span>
              <span className="font-display text-7xl text-cream sm:text-8xl md:text-9xl">2026</span>
            </div>

            {/* Program at a glance — the day's two time slots, pulled from the
                same `event_schedule` data the detail cards use, so admin edits
                flow straight to the hero. */}
            <div className="reveal delay-1 mt-7 flex flex-wrap items-center gap-x-5 gap-y-3 md:mt-9">
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

            <div className="reveal delay-2 mt-10 grid gap-12 md:grid-cols-12 md:items-end">
              <div className="md:col-span-7">
                <h3 className="font-display text-4xl text-cream md:text-5xl">Lauantai. Kalenteriin nyt.</h3>
                <p className="mt-6 max-w-xl text-base leading-relaxed text-cream/75 md:text-lg">
                  Kerätään yhdessä, juhlitaan tehtyä työtä ja tehdään Helsingistä hetkeksi vähän siistimpi. Voit osallistua myös kotiseudullasi: kerää roskia oman matkasi varrelta ja jaa kuva tunnisteella{' '}
                  <span className="text-amber">#roskapäivä2026</span>.
                </p>
              </div>
              <div className="md:col-span-5 md:flex md:justify-end">
                <div className="inline-flex max-w-sm flex-col gap-3 border border-cream/15 bg-forest-night/40 p-6 md:p-7">
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
        </div>

        {/* Yhteistyössä — sponsor band anchored to the bottom of the hero. */}
        {sponsors.length > 0 && (
          <div className="reveal delay-3 pb-8 md:pb-10">
            <div className="mx-auto w-full max-w-7xl border-t border-cream/15 pt-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
                <p className="eyebrow shrink-0 text-cream/50">Yhteistyössä</p>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                  {sponsors.map((s) => {
                    const inner = (
                      <>
                        {s.logo_url && (
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded bg-cream md:h-9 md:w-9">
                            <img
                              src={s.logo_url}
                              alt=""
                              loading="lazy"
                              onError={(e) => {
                                e.currentTarget.parentElement!.style.display = 'none';
                              }}
                              className="h-full w-full object-contain p-1"
                            />
                          </span>
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
                        className="group flex items-center gap-2.5"
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
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
