import { useState } from 'react';

const years = ['2018', '2020', '2023', '2024', '2025', '2026'];

const cards = [
  {
    year: '2018',
    img: 'https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?auto=format&fit=crop&w=1200&q=80',
    title: 'Ensimmäinen roska',
    desc: 'Anonyymi Instagram-tili. Roskapäivä saa nimensä.',
    large: true,
  },
  {
    year: '2020',
    img: 'https://images.unsplash.com/photo-1604881991720-f91add269bed?auto=format&fit=crop&w=1200&q=80',
    title: 'Kasvot tilille',
    desc: '',
  },
  {
    year: '2023',
    img: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
    title: 'Koneen säätiön apuraha',
    desc: '',
  },
  {
    year: '2024',
    img: 'https://images.unsplash.com/photo-1532274402911-5a369e4c4bb5?auto=format&fit=crop&w=1200&q=80',
    title: 'Suomen-laajuinen Roskapäivä',
    desc: '',
  },
  {
    year: '2025',
    img: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80',
    title: 'Roskapäivä-ukko',
    desc: '',
  },
  {
    year: '2026',
    img: 'https://images.unsplash.com/photo-1495107334309-fcf20504a5ab?auto=format&fit=crop&w=1600&q=80',
    title: '1,7 miljoonaa katsojaa',
    desc: 'Vappu-reel. MTV3, Huomenta Suomi. Liike on isompi kuin koskaan.',
    wide: true,
  },
];

export default function TimelineSection() {
  const [activeYear, setActiveYear] = useState('2018');

  return (
    <section id="aikajana" className="relative bg-forest-deep py-32 md:py-40">
      <div className="mx-auto max-w-7xl px-6">
        <div className="reveal flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="eyebrow text-amber">Tarina</p>
            <h2 className="font-display mt-6 text-6xl text-cream md:text-7xl lg:text-8xl">
              Kahdeksan<br />vuotta.
            </h2>
          </div>
          <p className="max-w-md text-base text-cream/70 md:text-lg">
            Yksi askel kerrallaan. Anonyymistä Instagram-tilistä Suomi-laajuiseksi liikkeeksi, jonka jokainen kuudes suomalainen tunnistaa.
          </p>
        </div>

        <div className="reveal mt-16 flex flex-wrap items-center gap-x-10 gap-y-3 border-b border-cream/10 pb-1">
          {years.map((year) => (
            <button
              key={year}
              className={`tab font-display pt-3 text-2xl ${activeYear === year ? 'active' : ''}`}
              onClick={() => setActiveYear(year)}
            >
              {year}
            </button>
          ))}
        </div>

        <div className="reveal mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {cards.map((card) => (
            <a
              key={card.year + card.title}
              href="#"
              className={`photo-card group relative block overflow-hidden ${
                card.large ? 'aspect-[4/5] md:row-span-2 md:aspect-auto' : 'aspect-[4/3]'
              } ${card.wide ? 'md:col-span-2' : ''}`}
            >
              <img
                src={card.img}
                alt={card.year}
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
              />
              <div className="relative z-10 flex h-full flex-col justify-end p-6 md:p-8">
                <p className={`font-display text-amber ${card.large ? 'text-7xl md:text-8xl' : 'text-5xl'}`}>{card.year}</p>
                <p className={`font-medium text-cream mt-3 ${card.large ? 'text-base md:text-lg' : 'text-sm mt-2'}`}>{card.title}</p>
                {card.desc && <p className="mt-2 text-sm text-cream/70">{card.desc}</p>}
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
