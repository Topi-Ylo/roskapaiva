/** The pair on stage, cropped from the photograph behind the main event. */
const ORGANIZERS_IMAGE = '/jarjestajat.jpg';

/**
 * Closing bands of the Roskapäivä '26 page: the community statement, the two
 * organisers and the thank-you. Tulevaisuus and the partner call to action
 * were dropped when the page shifted from one main event to a nationwide day.
 */
export default function ClosingSection() {
  return (
    <>
      <section id="yhteisollisyys" className="relative bg-forest-night py-24 md:py-32">
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
                Roskapäivän perusti Eino Oinio. Vuonna 2024 mukaan tuli Sergio Carrera, Cleaning
                Angelsin perustaja ja Kohde Helsingin isäntä.
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
            </div>
          </div>
        </div>
      </section>

      <section id="kiitos" className="relative bg-forest-night py-24 md:py-32">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="reveal font-display text-6xl text-amber md:text-7xl">Kiitos.</h2>
          <p className="reveal delay-1 mt-8 text-lg leading-relaxed text-cream/80 md:text-xl">
            Jos luit tänne asti, kiitos mielenkiinnosta. Nähdään 5.9.2026, missä ikinä oletkin.
          </p>
          <p className="reveal delay-2 mt-6 text-base leading-relaxed text-cream/60">
            Kysyttävää tapahtumasta tai yhteistyöstä?{' '}
            <a
              href="mailto:eino@roskapaiva.com"
              className="text-amber transition hover:text-amber-light"
            >
              eino@roskapaiva.com
            </a>
          </p>
        </div>
      </section>
    </>
  );
}
