export default function EventSection() {
  return (
    <section id="tapahtuma" className="relative h-[100vh] min-h-[700px] w-full overflow-hidden">
      <div className="absolute inset-0" style={{
        backgroundImage: "linear-gradient(rgba(11, 22, 15, 0.78), rgba(11, 22, 15, 0.95)), url('https://i.imgur.com/If6GHtz.jpeg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }} />

      <div className="relative z-10 flex h-full items-center px-6">
        <div className="mx-auto w-full max-w-7xl">
          <p className="reveal eyebrow text-amber">Päätapahtuma</p>

          <div className="reveal delay-1 mt-6 flex flex-wrap items-end gap-x-8 gap-y-2 leading-none">
            <span className="font-display text-[22vw] text-amber leading-[0.8] sm:text-[20vw] md:text-[16rem]">5.9.</span>
            <span className="font-display text-7xl text-cream sm:text-8xl md:text-9xl">2026</span>
          </div>

          <div className="reveal delay-2 mt-12 grid gap-12 md:grid-cols-12 md:items-end">
            <div className="md:col-span-7">
              <h3 className="font-display text-4xl text-cream md:text-5xl">Lauantai. Kalenteriin nyt.</h3>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-cream/75 md:text-lg">
                Kerätään yhdessä, kuullaan puheita, syödään, kuunnellaan musiikkia. Päätapahtuman lokaatio Helsingissä varmistuu lähikuukausina. Voit osallistua myös kotiseudullasi: kerää roskia oman matkasi varrelta, jaa kuva tunnisteella{' '}
                <span className="text-amber">#roskapäivä2026</span>.
              </p>
            </div>
            <div className="md:col-span-5 md:flex md:justify-end">
              <div className="inline-flex max-w-sm flex-col gap-3 border border-cream/15 bg-forest-night/40 p-6 md:p-7">
                <div className="flex items-center gap-3">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-amber" />
                  <p className="eyebrow text-amber">Tarkemmat tiedot tulossa</p>
                </div>
                <p className="text-sm leading-relaxed text-cream/75">
                  Aikataulu, lokaatio ja osallistumisohjeet julkaistaan lähempänä tapahtumaa.
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
    </section>
  );
}
