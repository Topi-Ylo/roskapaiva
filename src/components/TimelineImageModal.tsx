import { useEffect } from 'react';

interface Card {
  year: string;
  img: string;
  title: string;
  desc?: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  cards: Card[];
  index: number;
  onIndexChange: (next: number) => void;
}

export default function TimelineImageModal({
  open,
  onClose,
  cards,
  index,
  onIndexChange,
}: Props) {
  useEffect(() => {
    if (open) document.body.classList.add('modal-open');
    else document.body.classList.remove('modal-open');
    return () => document.body.classList.remove('modal-open');
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight') onIndexChange((index + 1) % cards.length);
      else if (e.key === 'ArrowLeft') onIndexChange((index - 1 + cards.length) % cards.length);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, index, cards.length, onClose, onIndexChange]);

  const card = cards[index];
  if (!card) return null;

  const goPrev = () => onIndexChange((index - 1 + cards.length) % cards.length);
  const goNext = () => onIndexChange((index + 1) % cards.length);

  return (
    <div
      className={`modal-overlay ${open ? 'active' : ''}`}
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-content max-w-5xl bg-forest-night">
        <button className="modal-close" onClick={onClose} aria-label="Sulje">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="6" y1="6" x2="18" y2="18" />
            <line x1="6" y1="18" x2="18" y2="6" />
          </svg>
        </button>

        <div className="relative aspect-[16/10] bg-black">
          <img
            key={card.img}
            src={card.img}
            alt={card.title}
            className="absolute inset-0 h-full w-full object-contain"
          />

          <button
            type="button"
            onClick={goPrev}
            aria-label="Edellinen"
            className="absolute left-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-forest-night/70 text-cream transition hover:bg-forest-night"
          >
            <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
              <path d="M10 2L4 8l6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <button
            type="button"
            onClick={goNext}
            aria-label="Seuraava"
            className="absolute right-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-forest-night/70 text-cream transition hover:bg-forest-night"
          >
            <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
              <path d="M6 2l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        <div className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between md:p-8">
          <div>
            <p className="font-display text-3xl text-amber md:text-4xl">{card.year}</p>
            <p className="mt-1 text-base text-cream md:text-lg">{card.title}</p>
            {card.desc && <p className="mt-2 text-sm leading-relaxed text-cream/70">{card.desc}</p>}
          </div>
          <p className="text-xs uppercase tracking-widest text-cream/50">
            {index + 1} / {cards.length}
          </p>
        </div>
      </div>
    </div>
  );
}
