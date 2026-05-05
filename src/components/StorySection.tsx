import { useState } from 'react';
import TarinaModal from './TarinaModal';
import TimelineImageModal from './TimelineImageModal';
import TimelineCarousel from './TimelineCarousel';
import { useTableData } from '../hooks/useTableData';

interface TimelineRow {
  id?: string;
  year: string;
  title: string;
  description: string | null;
  image_url: string | null;
  is_large: boolean | null;
  is_wide: boolean | null;
  object_position: string | null;
}

const years = ['2018', '2020', '2023', '2024', '2025', '2026', '2027'];

interface Card {
  year: string;
  img: string;
  title: string;
  desc?: string;
  large?: boolean;
  wide?: boolean;
  objectPosition?: 'top' | 'center' | 'bottom';
}

const FALLBACK_CARDS: Card[] = [
  {
    year: '2018',
    img: 'https://i.imgur.com/EQCjiD8.jpeg',
    title: 'Ensimmäinen roska',
    desc: 'Anonyymi Instagram-tili. Roskapäivä saa nimensä.',
    large: true,
  },
  {
    year: '2020',
    img: 'https://i.imgur.com/AMjIwuH.jpeg',
    title: 'Kasvot tilille',
    desc: '',
  },
  {
    year: '2023',
    img: 'https://i.imgur.com/8zgfoM4.jpeg',
    title: 'Koneen säätiön apuraha',
    desc: '',
  },
  {
    year: '2024',
    img: 'https://i.imgur.com/toNE94p.jpeg',
    title: 'Suomen-laajuinen Roskapäivä',
    desc: '',
  },
  {
    year: '2025',
    img: 'https://www.mustankorkea.fi/wp-content/uploads/2024/09/roskapaiva-3-1024x766.jpg',
    title: 'Roskapäivä-ukko',
    desc: '',
  },
  {
    year: '2026',
    img: 'https://i.imgur.com/VeVdKTN.png',
    title: '1,7 miljoonaa katsojaa',
    desc: 'Vappu-reel. MTV3, Huomenta Suomi. Liike on isompi kuin koskaan.',
    wide: true,
    objectPosition: 'top' as const,
  },
  {
    year: '2027',
    img: 'https://www.mustankorkea.fi/wp-content/uploads/2024/09/roskapaiva-4.jpg',
    title: 'Tulossa',
    desc: 'Seuraava Roskapäivä 2.5.2027.',
  },
];

export default function StorySection() {
  const [open, setOpen] = useState(false);
  const [activeYear, setActiveYear] = useState('2018');
  const [galleryIndex, setGalleryIndex] = useState<number | null>(null);
  const { data: rows } = useTableData<TimelineRow>('timeline_entries');
  const cards: Card[] = rows && rows.length > 0
    ? rows.map((r) => ({
        year: r.year,
        title: r.title,
        desc: r.description ?? undefined,
        img: r.image_url ?? '',
        large: r.is_large ?? undefined,
        wide: r.is_wide ?? undefined,
        objectPosition: (r.object_position as 'top' | 'center' | 'bottom' | null) ?? undefined,
      }))
    : FALLBACK_CARDS;

  return (
    <>
      <section id="tarina" className="relative bg-forest-night py-32 md:py-40">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-12 md:grid-cols-12 md:gap-16">

            <div className="reveal md:col-span-5">
              <div className="zoom-on-hover relative aspect-[4/5] overflow-hidden">
                <img
                  src="https://www.roskapaiva.com/wp-content/uploads/2025/10/Picsart_25-10-16_06-40-24-707.jpg"
                  alt="Eino Oinio"
                  className="absolute inset-0 h-full w-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest-night via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-cream">
                  <p className="eyebrow text-amber">Eino Oinio</p>
                  <p className="font-quote italic mt-2 text-2xl text-cream md:text-3xl">Roskapäivä-ukko</p>
                </div>
              </div>
            </div>

            <div className="md:col-span-7 md:pt-8">
              <p className="reveal eyebrow text-amber">Roskapäivä ja Einon tarina</p>
              <h2 className="reveal delay-1 font-display mt-6 text-5xl text-cream md:text-6xl lg:text-7xl">
                Pienistä teoista<br />kasvoi liike.
              </h2>

              <div className="reveal delay-2 mt-10 space-y-5 text-base leading-relaxed text-cream/80 md:text-lg">
                <p>
                  Seitsemän vuotta sitten havahduin luonnon roskaantumiseen ja mietin, että asialle on tehtävä jotain. Aloin keräämään ja kuvaamaan roskaa, ja perustin Instagramiin Roskapäivä-tilin.
                </p>
                <p>
                  Kaikki alkoi vuonna 2018 hammasteknikon päivätyöni ohella. Ensin omaksi ilokseni, pian jo intohimosta. Vuosien varrella Roskapäivästä kasvoi tärkeä osa elämääni ja lopulta myös työni.
                </p>
              </div>

              <button
                onClick={() => setOpen(true)}
                className="reveal delay-3 ghost-cta mt-10 inline-flex items-center gap-3 rounded-full px-7 py-3 text-xs font-semibold uppercase tracking-widest text-cream"
              >
                Lue koko tarina
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10m0 0L8 3m5 5l-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </div>

          </div>

          {/* Kahdeksan vuotta — merged from former TimelineSection */}
          <div id="aikajana" className="reveal mt-24 border-t border-cream/10 pt-16 md:mt-32 md:pt-20">
            <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
              <div>
                <p className="eyebrow text-amber">Aikajana</p>
                <h3 className="font-display mt-6 text-5xl text-cream md:text-6xl lg:text-7xl">
                  Kahdeksan<br />vuotta.
                </h3>
              </div>
              <p className="max-w-md text-base text-cream/70 md:text-lg">
                Yksi askel kerrallaan. Anonyymistä Instagram-tilistä kansalliseksi liikkeeksi.
              </p>
            </div>

            <div className="mt-12 flex flex-wrap items-center gap-x-10 gap-y-3 border-b border-cream/10 pb-1">
              {years.map((year) => (
                <button
                  key={year}
                  className={`tab font-display text-2xl ${activeYear === year ? 'active' : ''}`}
                  onClick={() => setActiveYear(year)}
                >
                  {year}
                </button>
              ))}
            </div>

            <div className="mt-12 md:hidden">
              <TimelineCarousel
                cards={cards}
                onCardClick={(i) => setGalleryIndex(i)}
              />
            </div>

            <div className="mt-12 hidden gap-6 md:grid md:auto-rows-[12.5rem] md:grid-cols-3 lg:auto-rows-[15.5rem]">
              {cards.map((card, i) => (
                <button
                  key={card.year + card.title}
                  type="button"
                  onClick={() => setGalleryIndex(i)}
                  className={`photo-card group relative block aspect-[4/5] overflow-hidden text-left md:aspect-auto ${
                    card.large ? 'md:row-span-2' : ''
                  } ${card.wide ? 'md:col-span-2' : ''}`}
                >
                  <img
                    src={card.img}
                    alt={card.year}
                    className={`absolute inset-0 h-full w-full object-cover ${
                      card.objectPosition === 'top' ? 'object-top' : ''
                    }`}
                    loading="lazy"
                  />
                  <div className="relative z-10 flex h-full flex-col justify-end p-6 md:p-8">
                    <p className={`font-display text-amber ${card.large ? 'text-5xl md:text-6xl lg:text-7xl' : 'text-4xl md:text-5xl'}`}>{card.year}</p>
                    <p className="font-medium text-cream mt-2 text-sm md:text-base">{card.title}</p>
                    {card.desc && <p className="mt-2 text-sm text-cream/70">{card.desc}</p>}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <TarinaModal open={open} onClose={() => setOpen(false)} />
      <TimelineImageModal
        open={galleryIndex !== null}
        onClose={() => setGalleryIndex(null)}
        cards={cards}
        index={galleryIndex ?? 0}
        onIndexChange={setGalleryIndex}
      />
    </>
  );
}
