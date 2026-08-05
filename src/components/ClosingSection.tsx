/** The pair on stage, cropped from the photograph behind the main event. */
const ORGANIZERS_IMAGE = '/jarjestajat.jpg';

/** The two hosts, using the bundled marks so this needs no database read. */
const ORGANIZERS = [
  { name: 'Roskapäivä', logo: '/favicon.png', url: 'https://roskapaiva.fi/' },
  { name: 'Cleaning Angels', logo: '/cleaning-angels.png', url: 'https://www.cleaningangels.fi/' },
];

/**
 * Closing bands of the Roskapäivä '26 page: the two organisers and the
 * thank-you. The community quote moved up to sit right after the hero.
 */
export default function ClosingSection() {
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
                {ORGANIZERS.map((o) => (
                  <a
                    key={o.name}
                    href={o.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3"
                  >
                    <img
                      src={o.logo}
                      alt={o.name}
                      loading="lazy"
                      className="h-14 w-auto max-w-[150px] shrink-0 object-contain object-left"
                    />
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
