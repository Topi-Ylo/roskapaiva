import { useTableData } from '../hooks/useTableData';
import {
  FALLBACK_PROGRAM,
  FALLBACK_SCHEDULE,
  type EventProgramItem,
  type EventSlot,
} from '../lib/eventContent';

// Reused from the existing site image library.
const EINO_PORTRAIT =
  'https://turunseutusanomat.fi/wp-content/uploads/2025/11/Teemu-Eino-Oinio-web.jpg';

export default function EventDetailsSection() {
  const { data: scheduleData } = useTableData<EventSlot>('event_schedule');
  const { data: programData } = useTableData<EventProgramItem>('event_program');

  const schedule = scheduleData && scheduleData.length > 0 ? scheduleData : FALLBACK_SCHEDULE;
  const program = programData && programData.length > 0 ? programData : FALLBACK_PROGRAM;

  return (
    <>
      {/* Aikataulu — kaksi lokaatiota, kaksi aikaikkunaa */}
      <section id="aikataulu" className="relative bg-forest-deep py-28 md:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <p className="reveal eyebrow text-amber">Päivän kulku</p>
          <h3 className="reveal delay-1 font-display mt-6 text-5xl text-cream md:text-6xl">
            Kaksi osoitetta, yksi päivä.
          </h3>

          <div className="mt-14 grid gap-6 md:mt-16 md:grid-cols-2 md:gap-8">
            {schedule.map((slot, i) => (
              <article
                key={slot.id ?? slot.place}
                className={`reveal delay-${i + 1} group flex flex-col overflow-hidden border border-cream/15 bg-forest-night/40`}
              >
                <div className="relative aspect-[16/9] overflow-hidden bg-forest-night">
                  {slot.image_url && (
                    <img
                      src={slot.image_url}
                      alt=""
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-forest-night via-forest-night/30 to-transparent" />
                  <span className="absolute bottom-5 left-6 font-display text-5xl leading-none text-amber md:text-6xl">
                    {slot.slot_time}
                  </span>
                </div>
                <div className="flex flex-col p-8 md:p-10">
                  <p className="eyebrow text-amber">{slot.label}</p>
                  <h4 className="font-display mt-2 text-3xl text-cream">{slot.place}</h4>
                  {slot.area && <p className="mt-1 text-sm text-cream/55">{slot.area}</p>}
                  {slot.body && (
                    <p className="mt-6 text-base leading-relaxed text-cream/75">{slot.body}</p>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Miten osallistua */}
      <section id="osallistu" className="relative bg-forest-night py-28 md:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-12 md:grid-cols-12 md:items-end">
            <div className="md:col-span-7">
              <p className="reveal eyebrow text-amber">Miten osallistua</p>
              <h3 className="reveal delay-1 font-display mt-6 text-4xl leading-tight text-cream md:text-5xl">
                Roskapäivä tapahtuu kaikkialla, missä joku kumartuu nostamaan roskan maasta.
              </h3>
            </div>
            <div className="md:col-span-5">
              <p className="reveal delay-2 text-base leading-relaxed text-cream/75 md:text-lg">
                Mukaan pääsevät yksityishenkilöt, kaupungit, yritykset, koulut ja yhteisöt. Kerää
                roskia luonnosta pitkin päivää ja jaa kokemus tunnisteella{' '}
                <span className="text-amber">#roskapäivä2026</span>. Helsinki isännöi
                päätapahtumaa, mutta Roskapäivän voi viettää omalla kotiseudullaan.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Ohjelma */}
      <section id="ohjelma" className="relative bg-forest-deep py-28 md:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-12 md:grid-cols-12 md:gap-16">
            <div className="md:col-span-5">
              <p className="reveal eyebrow text-amber">Ohjelmassa</p>
              <h3 className="reveal delay-1 font-display mt-6 text-4xl text-cream md:text-5xl">
                Enemmän kuin siivous.
              </h3>
              <p className="reveal delay-2 mt-6 max-w-md text-base leading-relaxed text-cream/75">
                Roskapäivä on juhla puhtaamman ympäristön puolesta. Keräämisen lomassa nautitaan
                ohjelmasta, joka tuo ihmiset yhteen hyvän asian äärelle.
              </p>
            </div>
            <div className="md:col-span-7">
              <ul className="reveal delay-1 grid gap-px overflow-hidden border border-cream/10 bg-cream/10 sm:grid-cols-2">
                {program.map((item, i) => (
                  <li
                    key={item.id ?? i}
                    className="flex items-center gap-4 bg-forest-deep px-6 py-7 text-cream/85"
                  >
                    <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber" />
                    {item.label}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Järjestäjät */}
      <section id="jarjestajat" className="relative bg-forest-night py-28 md:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-12 md:grid-cols-12 md:items-center md:gap-16">
            <div className="reveal group order-last md:order-first md:col-span-5">
              <div className="relative aspect-[4/5] overflow-hidden border border-cream/10">
                <img
                  src={EINO_PORTRAIT}
                  alt="Eino Oinio, Roskapäivän perustaja"
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest-night/70 to-transparent" />
              </div>
            </div>
            <div className="md:col-span-7">
              <p className="reveal eyebrow text-amber">Järjestäjät</p>
              <h3 className="reveal delay-1 font-display mt-6 max-w-2xl text-3xl leading-snug text-cream md:text-4xl">
                Roskapäivän perusti Eino Oinio. Vuonna 2024 mukaan tuli Sergio Carrera, Cleaning
                Angelsin perustaja ja Kohde Helsingin isäntä.
              </h3>
              <p className="reveal delay-2 mt-6 max-w-xl text-base leading-relaxed text-cream/75">
                Yhteinen into siivoamiseen synnytti tapahtuman, joka kasvaa vuosi vuodelta.
                Kysyttävää tapahtumasta?{' '}
                <a
                  href="mailto:eino@roskapaiva.com"
                  className="text-amber transition hover:text-amber-light"
                >
                  eino@roskapaiva.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
