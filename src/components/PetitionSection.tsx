import { useCounter } from '../hooks/useCounter';

function PetitionCounter() {
  const { ref, value } = useCounter(16323);
  return (
    <div ref={ref} className="mega-stat stat-roller text-amber text-7xl md:text-8xl">
      {value.toLocaleString('fi-FI')}
    </div>
  );
}

export default function PetitionSection() {
  return (
    <section id="aloite" className="relative overflow-hidden">
      <div className="absolute inset-0" style={{
        backgroundImage: "linear-gradient(rgba(11, 22, 15, 0.88), rgba(11, 22, 15, 0.95)), url('https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&w=2400&q=80')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }} />

      <div className="relative mx-auto max-w-7xl px-6 py-32 md:py-40">
        <div className="grid gap-16 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="reveal eyebrow text-amber">Lainsäädäntö</p>
            <h2 className="reveal delay-1 font-display mt-6 text-5xl text-cream md:text-6xl lg:text-7xl">
              Aloite siistimmän<br />Suomen puolesta.
            </h2>

            <div className="reveal delay-2 mt-12 border-l-2 border-amber pl-6">
              <PetitionCounter />
              <p className="eyebrow mt-3 text-cream/55">Allekirjoittajaa aloitteessa 2021–2022</p>
            </div>
          </div>

          <div className="md:col-span-7 md:pt-16 space-y-6 text-base leading-relaxed text-cream/80 md:text-lg">
            <p className="reveal">
              Edellinen aloite vuosina 2021 ja 2022 keräsi 16 323 allekirjoitusta. Se ei riittänyt eduskuntaan, mutta se osoitti, että yli 16 000 suomalaista oli valmiina muutokseen. Uskon, että nyt on hyvä aika herättää meidät yhteiseen vastuullisuuteen. Tarkoitus on ohjata meitä kaikkia kohti puhtaampaa Suomea.
            </p>
            <p className="reveal delay-1">
              Aloitteen tavoite on yksinkertainen: kunnat saisivat oikeuden määrätä roskaamisesta sakon, ei vain poliisi. Tämä mahdollistaisi toimivamman valvonnan ja oikeudenmukaisemman seuraamuksen.
            </p>

            <div className="reveal delay-2 mt-12 border border-cream/15 bg-forest-night/40 p-8">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-amber animate-pulse" />
                <p className="eyebrow text-amber">Tilanne</p>
              </div>
              <p className="mt-4 text-base leading-relaxed text-cream/80">
                Aloite avataan uudelleen lähiviikkoina. Allekirjoitus tehdään valtion virallisessa kansalaisaloite.fi-palvelussa. Kun aloite avautuu, tieto tulee tähän.
              </p>
              <button
                disabled
                className="mt-6 inline-flex cursor-not-allowed items-center gap-2 border border-cream/20 bg-cream/5 px-6 py-3 text-xs font-semibold uppercase tracking-widest text-cream/40"
              >
                Allekirjoita kansalaisaloite.fi:ssä
                <span className="text-[10px] font-normal opacity-70">(avautuu pian)</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
