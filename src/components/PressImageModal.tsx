import { useEffect } from 'react';

interface PressImage {
  src: string;
  label: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  images: PressImage[];
  index: number;
  onIndexChange: (next: number) => void;
}

export default function PressImageModal({
  open,
  onClose,
  images,
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
      else if (e.key === 'ArrowRight') onIndexChange((index + 1) % images.length);
      else if (e.key === 'ArrowLeft') onIndexChange((index - 1 + images.length) % images.length);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, index, images.length, onClose, onIndexChange]);

  const img = images[index];
  if (!img) return null;

  const goPrev = () => onIndexChange((index - 1 + images.length) % images.length);
  const goNext = () => onIndexChange((index + 1) % images.length);

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

        <div className="relative aspect-[4/5] bg-black sm:aspect-[16/10]">
          <img
            key={img.src}
            src={img.src}
            alt={img.label}
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

        <div className="flex flex-col gap-3 p-6 md:flex-row md:items-center md:justify-between md:p-8">
          <div>
            <p className="eyebrow text-amber">Lehdistökuva</p>
            <p className="font-display mt-2 text-xl text-cream md:text-2xl">{img.label}</p>
          </div>
          <div className="flex items-center gap-4 text-xs uppercase tracking-widest text-cream/50">
            <span>{index + 1} / {images.length}</span>
            <a
              href={img.src}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-amber transition hover:text-amber-light"
            >
              Avaa alkuperäinen
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                <path d="M3 13L13 3M13 3H6M13 3v7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
