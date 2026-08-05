import { useTableData } from '../hooks/useTableData';
import { useSiteSettings } from '../hooks/useSiteSettings';
import {
  FALLBACK_PROGRAM,
  FALLBACK_SCHEDULE,
  type EventProgramItem,
  type EventSlot,
} from '../lib/eventContent';

/** Photograph from the Kallio event, previously used behind the hero. */
const EVENT_IMAGE = 'https://i.imgur.com/If6GHtz.jpeg';

/**
 * The Kallio main event, laid out like a festival poster: a framed bill with
 * the headliner on top, the two venues as "stages" and the programme as a
 * line-up. Content still comes from the same admin tables as before.
 */
export default function MainEventSection() {
  const { data: scheduleData } = useTableData<EventSlot>('event_schedule');
  const { data: programData } = useTableData<EventProgramItem>('event_program');
  const settings = useSiteSettings();

  const schedule = scheduleData && scheduleData.length > 0 ? scheduleData : FALLBACK_SCHEDULE;
  const program = programData && programData.length > 0 ? programData : FALLBACK_PROGRAM;

  return (
    <section id="paatapahtuma" className="relative overflow-hidden bg-forest-deep py-24 md:py-32">
      {/* The photo that used to sit behind the hero now belongs to the event
          it actually shows. Heavily dimmed so the poster stays legible. */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          backgroundImage: `url('${EVENT_IMAGE}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ background: 'linear-gradient(rgba(19, 36, 26, 0.88), rgba(19, 36, 26, 0.94))' }}
      />

      {/* Faint oversized place name behind the poster, festival-print style.
          HELSINKI is set smaller so both lines read at the same width. */}
      <div
        aria-hidden="true"
        className="font-display pointer-events-none absolute inset-x-0 -top-6 flex select-none flex-col items-center leading-[0.78] text-cream/[0.05]"
      >
        <span className="text-[26vw]">KALLIO</span>
        <span className="text-[19vw]">HELSINKI</span>
      </div>

      <div className="relative mx-auto max-w-5xl px-6">
        <div className="reveal border-2 border-amber/70 bg-forest-night/60 p-6 shadow-[0_0_60px_rgba(0,0,0,0.45)] sm:p-10 md:p-14">
          {/* Poster head */}
          <div className="border-b border-cream/15 pb-8 text-center">
            <p className="eyebrow text-amber">Päätapahtuma</p>
            <h2 className="font-display mt-5 text-5xl leading-[0.95] text-cream sm:text-6xl md:text-7xl">
              Kallio<span className="text-amber">.</span>
              <br />
              Helsinki<span className="text-amber">.</span>
            </h2>
            <p className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm font-semibold uppercase tracking-[0.2em] text-cream/80">
              <span>Lauantai</span>
              <span className="text-amber">·</span>
              <span>5.9.2026</span>
              <span className="text-amber">·</span>
              <span>Vapaa pääsy</span>
            </p>
          </div>

          {/* Headliner */}
          {settings.event_headliner && (
            <div className="reveal border-b border-cream/15 py-8 text-center md:py-10">
              <p className="eyebrow text-cream/45">Esiintyjä</p>
              <p className="font-display mt-3 text-4xl text-amber sm:text-5xl md:text-6xl">
                {settings.event_headliner}
              </p>
            </div>
          )}

          {/* Two venues, as stages on the bill */}
          <div className="grid gap-px overflow-hidden border-b border-cream/15 bg-cream/10 sm:grid-cols-2">
            {schedule.slice(0, 2).map((slot, i) => (
              <div key={slot.id ?? i} className="reveal bg-forest-night/60 px-6 py-8 text-center">
                <p className="font-display text-4xl leading-none text-amber md:text-5xl">
                  {slot.slot_time}
                </p>
                <p className="eyebrow mt-4 text-cream/50">{slot.label}</p>
                <p className="font-display mt-2 text-2xl text-cream">{slot.place}</p>
                {slot.area && <p className="mt-1 text-sm text-cream/55">{slot.area}</p>}
                {slot.body && (
                  <p className="mx-auto mt-4 max-w-xs text-sm leading-relaxed text-cream/70">
                    {slot.body}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Line-up */}
          <div className="reveal py-8 md:py-10">
            <p className="eyebrow text-center text-cream/45">Ohjelmassa</p>
            <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-center">
              {program.map((item, i) => (
                <li
                  key={item.id ?? i}
                  className="font-display text-lg text-cream/85 md:text-xl"
                >
                  {item.label}
                  {i < program.length - 1 && <span className="ml-6 text-amber">·</span>}
                </li>
              ))}
            </ul>
          </div>

          {/* Foot */}
          <div className="reveal flex flex-col items-center gap-4 border-t border-cream/15 pt-8 text-center">
            <p className="max-w-lg text-sm leading-relaxed text-cream/70">
              Koko perheen tapahtuma. Hanskat ja säkit löytyvät paikan päältä, sinä tuot vain hyvän
              mielen. Tapahtuma on osallistujille ilmainen, kiitos kumppaneiden.
            </p>
            <a
              href="https://instagram.com/roskapaiva"
              target="_blank"
              rel="noopener noreferrer"
              className="ghost-cta rounded-full px-7 py-3 text-xs font-semibold uppercase tracking-widest text-cream"
            >
              Seuraa @roskapaiva
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
