import { useRef } from 'react';
import { useTableData } from '../hooks/useTableData';

interface PastEvent {
  id?: string;
  year: string;
  title: string;
  description: string | null;
  image_url: string | null;
  sort_order: number;
}

// Fallback content used when Supabase isn't configured / returns empty.
const FALLBACK: PastEvent[] = [
  { year: '2024', title: 'Töölö',     description: 'Ensimmäinen Suomen-laajuinen', image_url: 'https://i.imgur.com/DdJYyxb.jpeg', sort_order: 10 },
  { year: '2025', title: 'Kallio',    description: 'Kohde Helsinki',                image_url: 'https://www.roskapaiva.com/wp-content/uploads/2025/12/Picsart_25-12-15_12-13-53-609.jpg', sort_order: 20 },
  { year: '2025', title: 'Vallisaari',description: 'Saariston siivous',             image_url: 'https://i.imgur.com/yjZzydi.jpeg', sort_order: 30 },
  { year: '2024', title: 'Tukes',     description: 'Zombiakkukampanja',             image_url: 'https://i.imgur.com/Yj6YwV7.jpeg', sort_order: 40 },
  { year: '2026', title: 'Suvilahti', description: 'Vappu-reel',                    image_url: 'https://i.imgur.com/izbXPaq.jpeg', sort_order: 50 },
];

export default function PastEventsSection() {
  const carouselRef = useRef<HTMLDivElement>(null);
  const { data, loading } = useTableData<PastEvent>('past_events');

  const events = data && data.length > 0 ? data : loading ? [] : FALLBACK;

  const scroll = (dir: 'prev' | 'next') => {
    if (!carouselRef.current) return;
    carouselRef.current.scrollBy({ left: dir === 'prev' ? -340 : 340, behavior: 'smooth' });
  };

  return (
    <section className="relative bg-forest-night py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="reveal flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="eyebrow text-amber">Edelliset tapahtumat</p>
            <h3 className="font-display mt-6 text-5xl text-cream md:text-6xl">Mitä on tehty. Mitä on nähty.</h3>
          </div>
          <div className="flex items-center gap-2">
            <button aria-label="Edellinen" onClick={() => scroll('prev')} className="ghost-cta flex h-12 w-12 items-center justify-center rounded-full text-cream">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M10 2L4 8l6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button aria-label="Seuraava" onClick={() => scroll('next')} className="ghost-cta flex h-12 w-12 items-center justify-center rounded-full text-cream">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M6 2l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>

        <div ref={carouselRef} className="reveal mt-16 flex gap-6 overflow-x-auto pb-4 no-scrollbar md:mt-20">
          {events.map((ev, i) => (
            <article key={ev.id ?? i} className="photo-card group relative aspect-[3/4] w-72 flex-shrink-0 md:w-80">
              {ev.image_url && <img src={ev.image_url} alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />}
              <div className="relative z-10 flex h-full flex-col justify-between p-6 text-cream">
                <span className="eyebrow self-start bg-amber/90 px-2 py-1 text-forest-night">{ev.year}</span>
                <div>
                  <h4 className="font-display text-2xl">{ev.title}</h4>
                  {ev.description && <p className="mt-1 text-sm text-cream/70">{ev.description}</p>}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
