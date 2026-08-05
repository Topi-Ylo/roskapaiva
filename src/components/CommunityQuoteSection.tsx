/**
 * The "why" of the day, set as a pull quote. Sits directly after the hero so
 * the page states its purpose before going into the Kallio event and the
 * nationwide map.
 */
export default function CommunityQuoteSection() {
  return (
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
  );
}
