import { useTableData } from '../hooks/useTableData';
import FaqAccordion, { OrganizerDisclaimer } from './FaqAccordion';
import { useInfoModal } from '../lib/infoModal';
import { FALLBACK_SPONSORS, type EventSponsor } from '../lib/eventContent';

/** The pair on stage, cropped from the photograph behind the main event. */
const ORGANIZERS_IMAGE = '/jarjestajat.jpg';

/** Used only when Supabase is unreachable; normally the hosts come from the
 *  organiser tier of event_sponsors, so these marks stay in step with the
 *  hero band and remain editable from the admin. */
const FALLBACK_ORGANIZERS: EventSponsor[] = [
  { name: 'Roskapäivä', logo_url: '/favicon.png', url: 'https://roskapaiva.fi/', sort_order: 10 },
  {
    name: 'Cleaning Angels',
    logo_url: '/cleaning-angels.png',
    url: 'https://www.cleaningangels.fi/',
    sort_order: 20,
  },
];

/**
 * Closing bands of the Roskapäivä '26 page: the two organisers and the
 * thank-you. The community quote moved up to sit right after the hero.
 */
export default function ClosingSection() {
  const { open: openInfo } = useInfoModal();
  const { data } = useTableData<EventSponsor>('event_sponsors');
  const sponsors = data ?? FALLBACK_SPONSORS;
  const organizers = sponsors.filter((s) => s.tier === 'organizer');
  const hosts = organizers.length > 0 ? organizers : FALLBACK_ORGANIZERS;

  return (
    <>
      <section id="jarjestajat" className="relative bg-forest-deep py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-12 md:grid-cols-12 md:items-center md:gap-16">
            <div className="reveal group order-last md:order-first md:col-span-5">
              <div className="relative aspect-[4/5] overflow-hidden border border-cream/10">
                <img
                  src={ORGANIZERS_IMAGE}
                  alt="Eino Oinio ja Sergio Carrera Roskapäivän lavalla"
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/70 to-transparent" />
              </div>
            </div>
            <div className="md:col-span-7">
              <p className="reveal eyebrow text-amber">Järjestäjät</p>
              <h2 className="reveal delay-1 font-display mt-6 max-w-2xl text-3xl leading-snug text-cream md:text-4xl">
                Roskapäivän perusti Eino Oinio. Vuonna 2024 päätapahtuman järjestäjäksi mukaan
                tuli Sergio Carrera, Cleaning Angelsin perustaja ja Kohde Helsingin isäntä.
              </h2>
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

              <div className="reveal delay-3 mt-9 flex flex-wrap items-center gap-x-10 gap-y-5 border-t border-cream/10 pt-7">
                {hosts.map((o) => (
                  <a
                    key={o.id ?? o.name}
                    href={o.url ?? undefined}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3"
                  >
                    {o.logo_url && (
                      <img
                        src={o.logo_url}
                        alt={o.name}
                        loading="lazy"
                        className="h-9 w-auto max-w-[240px] shrink-0 object-contain object-left"
                      />
                    )}
                    <span className="text-xs font-semibold uppercase tracking-wider text-cream/70 transition group-hover:text-cream">
                      {o.name}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Between Järjestäjät and Kiitos: right after the page has said who
          Roskapäivä is, which is the moment the distinction between "us" and
          "everyone else on the map" actually needs making. */}
      <section id="ukk" className="relative bg-forest-night py-20 md:py-28">
        <div className="mx-auto max-w-4xl px-6">
          <p className="reveal eyebrow text-amber">Usein kysytyt kysymykset</p>
          <h2 className="reveal delay-1 font-display mt-6 text-4xl leading-tight text-cream md:text-5xl">
            Kysyttävää osallistumisesta?
          </h2>

          <div className="reveal delay-2 mt-8 border-l-2 border-amber/50 bg-cream/[0.03] py-4 pl-5 pr-4">
            <OrganizerDisclaimer onOpenSafety={() => openInfo('ukk')} />
          </div>

          <div className="reveal delay-3 mt-10">
            <FaqAccordion />
          </div>
        </div>
      </section>

      <section id="kiitos" className="relative bg-forest-night py-24 md:py-32">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="reveal font-display text-6xl text-amber md:text-7xl">Kiitos.</h2>
          {/* The contact line lives in Järjestäjät just above, and again in the
              footer, so this closes on the sign-off alone. */}
          <p className="reveal delay-1 mt-8 text-lg leading-relaxed text-cream/80 md:text-xl">
            Jos luit tänne asti, kiitos mielenkiinnosta. Nähdään 5.9.2026, missä ikinä oletkin.
          </p>
        </div>
      </section>
    </>
  );
}
