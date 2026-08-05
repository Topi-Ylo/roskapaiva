/**
 * Closing bands of the Roskapäivä '26 page: the community statement and the
 * thank-you. What used to sit between them (tulevaisuus, kumppanihaku,
 * järjestäjät) moved into the hero band or was dropped when the page shifted
 * from one main event to a nationwide day.
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

      <section id="kiitos" className="relative bg-forest-deep py-24 md:py-32">
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
