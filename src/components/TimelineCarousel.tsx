import { useEffect, useState } from 'react';

interface Card {
  year: string;
  img: string;
  title: string;
  desc?: string;
}

interface Props {
  cards: Card[];
  onCardClick: (index: number) => void;
  /** ms between auto-advances. Defaults to 4000. */
  intervalMs?: number;
}

export default function TimelineCarousel({ cards, onCardClick, intervalMs = 4000 }: Props) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  // Auto-advance unless the user is mid-touch interaction.
  useEffect(() => {
    if (paused || cards.length <= 1) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % cards.length);
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [paused, cards.length, intervalMs]);

  // Touch swipe: pause auto-cycle while user drags, advance/retreat on release.
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
    setPaused(true);
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 40) {
      if (dx < 0) setIndex((i) => (i + 1) % cards.length);
      else setIndex((i) => (i - 1 + cards.length) % cards.length);
    }
    setTouchStartX(null);
    // Resume auto-cycle after a brief pause so the new slide gets time to read.
    window.setTimeout(() => setPaused(false), 1500);
  };

  return (
    <div
      className="relative"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        {cards.map((card, i) => (
          <button
            key={card.year + card.title}
            type="button"
            onClick={() => onCardClick(i)}
            className="absolute inset-0 block text-left transition-opacity duration-700"
            style={{
              opacity: i === index ? 1 : 0,
              pointerEvents: i === index ? 'auto' : 'none',
            }}
            aria-hidden={i !== index}
            tabIndex={i === index ? 0 : -1}
          >
            <img
              src={card.img}
              alt={card.year}
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-forest-night via-forest-night/30 to-transparent" />
            <div className="relative z-10 flex h-full flex-col justify-end p-6">
              <p className="font-display text-5xl text-amber">{card.year}</p>
              <p className="mt-2 text-sm font-medium text-cream">{card.title}</p>
              {card.desc && <p className="mt-2 text-sm text-cream/70">{card.desc}</p>}
            </div>
          </button>
        ))}
      </div>

      {/* Dots indicator — the dot stays small, but the button around it is a
          full 44px touch target so it is tappable on phones. */}
      <div className="mt-2 flex flex-wrap items-center justify-center">
        {cards.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => {
              setIndex(i);
              setPaused(true);
              window.setTimeout(() => setPaused(false), 4000);
            }}
            className="flex h-11 items-center justify-center px-1.5"
            aria-label={`Aikajanan kuva ${i + 1}`}
          >
            <span
              className={`block h-2 rounded-full transition-all ${
                i === index ? 'w-6 bg-amber' : 'w-2 bg-cream/30'
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
