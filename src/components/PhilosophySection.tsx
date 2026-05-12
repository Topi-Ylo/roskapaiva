export default function PhilosophySection() {
  return (
    <section id="mika" className="relative h-[90vh] min-h-[700px] w-full overflow-hidden">
      <div className="absolute inset-0" style={{
        backgroundImage: "linear-gradient(90deg, rgba(11, 22, 15, 0.92) 0%, rgba(11, 22, 15, 0.55) 50%, rgba(11, 22, 15, 0.3) 100%), url('https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=2400&q=80')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }} />

      <div className="relative z-10 flex h-full items-center px-6">
        <div className="mx-auto w-full max-w-7xl">
          <div className="max-w-2xl">
            <p className="reveal eyebrow text-amber">Filosofia</p>
            <h2 className="reveal delay-1 font-display mt-6 text-6xl text-cream sm:text-7xl md:text-8xl">
              Mikä<br />Roskapäivä<br />on.
            </h2>

            <div className="reveal delay-2 mt-10 space-y-5 text-base leading-relaxed text-cream/80 md:text-lg">
              <p>
                Roskapäivä ei ole tapahtuma, johon osallistutaan kerran vuodessa. Se on tapa katsoa omaa jälkeään. Päätös, että emme jätä Suomea sellaiseen tilaan, jossa emme itse haluaisi kävellä.
              </p>
              <p>
                Emme syyllistä Vapun viettäjiä. Vappu on hieno juhla. Roskapäivä on Vapun jatke. Päivä jolloin näytämme itsellemme, minkälaisia me oikeasti olemme. Yhdessä.
              </p>
            </div>

            <p className="reveal delay-3 font-quote mt-10 border-l-2 border-amber pl-6 text-2xl italic leading-snug text-amber-light md:text-3xl">
              Jokainen päivä voi olla Roskapäivä.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
