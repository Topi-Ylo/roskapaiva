/**
 * VolunteerCTASection — recruitment band on the Palvelut page.
 *
 * Sits between the Services cards and the Some-yhteistyö media
 * grid. The Services section pitches paid engagements; the Some
 * grid showcases past partnerships; this band is the "personal
 * invite" in between — for individuals who want to volunteer
 * alongside Roskapäivä at events and stunts.
 *
 * Visual rhythm:
 *   Services (deep forest, 3 cards)
 *   ↓
 *   This band (mid-forest, two-column image + copy + amber CTA)
 *   ↓
 *   MediaLibrary / Some-yhteistyöt (darker forest, video grid)
 * The middle-forest tone gives this section its own visual
 * register so it doesn't read as another Services card or another
 * partner tile — it's a different kind of ask.
 *
 * The image URL is hardcoded for now. Once the admin Services
 * editor pattern is extended (see ServicesAdmin.tsx) it can be
 * promoted to a Supabase row like the other content blocks.
 */

const VOLUNTEER_IMAGE = 'https://i.imgur.com/zOqWc48.jpeg';
const VOLUNTEER_MAILTO =
  'mailto:eino@roskapaiva.com?subject=Haluan%20mukaan%20vapaaehtoiseksi';

const ArrowRight = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M3 8h10m0 0L8 3m5 5l-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export default function VolunteerCTASection() {
  return (
    <section id="vapaaehtoiseksi" className="relative overflow-hidden bg-forest-mid py-20 md:py-32">
      {/* Subtle texture overlay so the flat forest-mid doesn't read
          as a blank slab between two image-heavy sections. Same
          backdrop trick as ServicesSection but with lighter
          gradient so the band feels brighter and friendlier. */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "linear-gradient(rgba(31, 61, 46, 0.7), rgba(31, 61, 46, 0.95)), url('https://i.imgur.com/gjC4yE4.jpeg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-12 md:grid-cols-12 md:gap-16">
          {/* Image: 5/12 cols on desktop, full width on mobile. The
              4/3 aspect mirrors the Services cards above so the page
              has a rhythm of image-tiles all the way down rather
              than a sudden shift to a banner. */}
          <div className="reveal relative aspect-[4/3] overflow-hidden md:col-span-5 md:aspect-[5/4]">
            <img
              src={VOLUNTEER_IMAGE}
              alt="Vapaaehtoiset Roskapäivän tempauksessa"
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
            />
            {/* Light forest-night gradient at the bottom of the image
                so any text bleed reads against a consistent dark
                edge, matching the treatment on the Services cards. */}
            <div className="absolute inset-0 bg-gradient-to-t from-forest-night/50 via-transparent to-transparent" />
          </div>

          {/* Copy + CTA: 7/12 cols on desktop. */}
          <div className="reveal md:col-span-7">
            <p className="eyebrow text-amber">Vapaaehtoiseksi</p>
            <h2 className="mt-6 font-display text-4xl text-cream md:text-5xl lg:text-6xl">
              Tule mukaan tekemään<br />Siistejä juttuja.
            </h2>
            <p className="mt-8 text-base leading-relaxed text-cream/80 md:text-lg">
              Haluatko mukaan jakamaan roskattomuuden hyvää mieltä? Roskapäivä kaipaa usein vapaaehtoisia erilaisiin tapahtumiin ja tempauksiin. Ota yhteyttä ja löydetään yhdessä tapa millä voit olla mukana Roskapäivän toiminnassa.
            </p>

            {/* Solid amber button as the primary CTA — stronger
                visual weight than the Services cards' text+arrow
                links, because this is a top-of-funnel "first
                touchpoint" ask and we want the click to feel
                inviting and obvious. */}
            <a
              href={VOLUNTEER_MAILTO}
              className="mt-10 inline-flex items-center gap-3 bg-amber px-8 py-4 text-sm font-semibold uppercase tracking-widest text-forest-night transition hover:bg-amber-light"
            >
              Ota yhteyttä
              <ArrowRight />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
