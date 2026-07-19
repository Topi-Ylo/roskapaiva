import { useTableData } from '../hooks/useTableData';
import { useCounter } from '../hooks/useCounter';
import { useSiteSettings } from '../hooks/useSiteSettings';
import {
  FALLBACK_CREDITS,
  FALLBACK_PROGRAM,
  FALLBACK_SCHEDULE,
  type CreditCategory,
  type EventCredit,
  type EventProgramItem,
  type EventSlot,
} from '../lib/eventContent';

// Reused from the existing site image library.
const EINO_PORTRAIT =
  'https://turunseutusanomat.fi/wp-content/uploads/2025/11/Teemu-Eino-Oinio-web.jpg';

function StatCounter({ target, suffix }: { target: number; suffix?: string }) {
  const { ref, value } = useCounter(target);
  return (
    <div ref={ref} className="mega-stat stat-roller text-amber text-5xl md:text-6xl lg:text-7xl">
      {value.toLocaleString('fi-FI')}
      {suffix ?? ''}
    </div>
  );
}

export default function EventDetailsSection() {
  const { data: scheduleData } = useTableData<EventSlot>('event_schedule');
  const { data: programData } = useTableData<EventProgramItem>('event_program');
  const { data: creditsData } = useTableData<EventCredit>('event_credits');

  const schedule = scheduleData && scheduleData.length > 0 ? scheduleData : FALLBACK_SCHEDULE;
  const program = programData && programData.length > 0 ? programData : FALLBACK_PROGRAM;
  const credits = creditsData && creditsData.length > 0 ? creditsData : FALLBACK_CREDITS;

  const settings = useSiteSettings();

  const byCategory = (cat: CreditCategory) => credits.filter((c) => c.category === cat);
  const performers = byCategory('performer');
  // The "Lavalla <year>" label follows the performers' own year field, so the
  // admin controls it from the credits list rather than it being hardcoded.
  const performerYear = performers.find((p) => p.year)?.year ?? null;
  const partners = byCategory('partner');
  const exhibitors = byCategory('exhibitor');

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
                {settings.event_program_title || 'Enemmän kuin siivous.'}
              </h3>
              <p className="reveal delay-2 mt-6 max-w-md text-base leading-relaxed text-cream/75">
                {settings.event_program_body ||
                  'Ulkona tapahtuvan siivouksen lomassa nautitaan inspiroivista puheista, livemusiikista, yritysten pop-up-näyttelystä, lasten aktiviteeteista, kahvilasta ja rentoutumisalueesta. Roskapäivä on juhla puhtaamman ympäristön puolesta.'}
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

          {performers.length > 0 && (
            <div className="reveal mt-12 flex flex-col gap-5 border-t border-cream/10 pt-10 md:mt-16 md:flex-row md:items-center md:gap-10">
              <p className="eyebrow shrink-0 text-cream/50">
                {performerYear ? `Lavalla ${performerYear}` : 'Lavalla'}
              </p>
              <div className="flex flex-wrap items-baseline gap-x-8 gap-y-2">
                {performers.map((p) => (
                  <span key={p.id ?? p.name} className="font-display text-2xl text-cream md:text-3xl">
                    {p.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Tulevaisuus — kasvun hype */}
      <section id="tulevaisuus" className="relative overflow-hidden bg-forest-night py-28 md:py-32">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "url('https://www.roskapaiva.com/wp-content/uploads/2025/12/Picsart_25-12-15_12-13-53-609.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-forest-night via-forest-night/80 to-forest-night" />

        <div className="relative mx-auto max-w-7xl px-6">
          <div className="grid gap-12 md:grid-cols-12 md:items-end">
            <div className="md:col-span-7">
              <p className="reveal eyebrow text-amber">Tulevaisuus</p>
              <h3 className="reveal delay-1 font-display mt-6 text-5xl text-cream md:text-6xl">
                Joka vuosi vähän isommin.
              </h3>
              <p className="reveal delay-2 mt-6 max-w-xl text-base leading-relaxed text-cream/75 md:text-lg">
                Roskapäivä kasvaa vuosi vuodelta ja tavoittaa yhä useamman. Vuonna 2025
                päätapahtumaan osallistui 150 ihmistä ja sosiaalisen median kautta useita satoja.
                Vuoden 2026 ennakkomarkkinoinnin tavoitteena on moninkertaistaa luvut.
              </p>
            </div>
          </div>

          <div className="reveal mt-14 grid grid-cols-2 divide-x divide-cream/15 border-y border-cream/15 py-10 md:mt-16 md:grid-cols-3">
            <div className="px-6 text-center md:px-12 md:text-left md:first:pl-0">
              <StatCounter target={150} />
              <p className="eyebrow mt-3 text-cream/55">Mukana paikan päällä, 2025</p>
            </div>
            <div className="px-6 text-center md:px-12 md:text-left">
              <div className="mega-stat text-amber text-5xl md:text-6xl lg:text-7xl">Satoja</div>
              <p className="eyebrow mt-3 text-cream/55">Tavoitettu somessa</p>
            </div>
            <div className="col-span-2 mt-10 border-t border-cream/15 px-6 pt-10 text-center md:col-span-1 md:mt-0 md:border-t-0 md:px-12 md:pt-0 md:text-left md:last:pr-0">
              <div className="mega-stat text-cream text-5xl md:text-6xl lg:text-7xl">2026</div>
              <p className="eyebrow mt-3 text-amber">Tavoite: moninkertainen</p>
            </div>
          </div>
        </div>
      </section>

      {/* Yhteisöllisyys — sydän */}
      <section id="yhteisollisyys" className="relative bg-forest-deep py-28 md:py-32">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <p className="reveal eyebrow text-amber">Yhteisöllisyys</p>
          <p className="reveal delay-1 quote-mark mt-8">“</p>
          <p className="reveal delay-1 font-quote -mt-4 text-3xl italic leading-snug text-cream md:text-4xl lg:text-5xl">
            Roskapäivän päätarkoitus on tuoda ihmiset yhteen hyvän asian äärelle. Yhdessä tekemällä
            saadaan paljon hyvää aikaan, ja se jättää pysyvän muistijäljen myös tuleville
            sukupolville.
          </p>
        </div>
      </section>

      {/* Kumppanit & näyttely — rekrytointi + 2025 social proof */}
      <section id="kumppanit" className="relative bg-forest-night py-28 md:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <p className="reveal eyebrow text-amber">Mukaan tapahtumaan</p>
          <h3 className="reveal delay-1 font-display mt-6 max-w-3xl text-4xl text-cream md:text-5xl">
            Rakennetaan vuodesta 2026 isoin tähän mennessä, yhdessä.
          </h3>

          <div className="mt-14 grid gap-10 md:mt-16 md:grid-cols-2 md:gap-8">
            <div className="reveal flex flex-col border border-cream/15 bg-forest-deep p-8 md:p-10">
              <p className="eyebrow text-amber">Kumppanit</p>
              <h4 className="font-display mt-3 text-2xl text-cream md:text-3xl">
                Haemme yhteistyökumppaneita.
              </h4>
              <p className="mt-4 text-sm leading-relaxed text-cream/65">Vuoden 2025 kumppanit:</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {partners.map((p) => (
                  <span
                    key={p.id ?? p.name}
                    className="partner-tile rounded-full px-4 py-2 text-sm"
                  >
                    {p.name}
                  </span>
                ))}
              </div>
            </div>

            <div className="reveal delay-1 flex flex-col border border-cream/15 bg-forest-deep p-8 md:p-10">
              <p className="eyebrow text-amber">Näyttely</p>
              <h4 className="font-display mt-3 text-2xl text-cream md:text-3xl">
                Haemme näytteilleasettajia.
              </h4>
              <p className="mt-4 text-sm leading-relaxed text-cream/65">
                Vuoden 2025 näytteilleasettajat:
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {exhibitors.map((p) => (
                  <span
                    key={p.id ?? p.name}
                    className="partner-tile rounded-full px-4 py-2 text-sm"
                  >
                    {p.name}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="reveal mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <p className="text-base text-cream/75">
              Kiinnostuitko kumppanuudesta tai näyttelypaikasta?
            </p>
            <a
              href="mailto:eino@roskapaiva.com?subject=Roskapäivä 2026 — kumppanuus"
              className="ghost-cta rounded-full px-7 py-3 text-xs font-semibold uppercase tracking-widest text-cream"
            >
              eino@roskapaiva.com
            </a>
          </div>
        </div>
      </section>

      {/* Järjestäjät */}
      <section id="jarjestajat" className="relative bg-forest-deep py-28 md:py-32">
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

      {/* Kiitos — lämmin lopetus */}
      <section id="kiitos" className="relative bg-forest-night py-28 md:py-32">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h3 className="reveal font-display text-6xl text-amber md:text-7xl">Kiitos.</h3>
          <p className="reveal delay-1 mt-8 text-lg leading-relaxed text-cream/80 md:text-xl">
            Jos luit tänne asti, kiitos mielenkiinnosta tapahtumaamme kohtaan. Nähdään 5.9.2026.
          </p>
          <p className="reveal delay-2 mt-6 text-base leading-relaxed text-cream/60">
            Kumppani- ja näyttelypaikoista voit kysyä osoitteesta{' '}
            <a href="mailto:eino@roskapaiva.com" className="text-amber transition hover:text-amber-light">
              eino@roskapaiva.com
            </a>
          </p>
        </div>
      </section>
    </>
  );
}
