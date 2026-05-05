import { useEffect } from 'react';

export type VideoSrc =
  | { type: 'youtube'; id: string }
  | { type: 'vimeo'; id: string }
  | { type: 'mp4'; url: string };

interface Props {
  open: boolean;
  onClose: () => void;
  src: VideoSrc | null;
  title?: string;
  description?: string;
  /**
   * Aspect ratio of the player. '9/16' for vertical (Vimeo reels, Instagram-style),
   * '16/9' for horizontal (YouTube long-form). Defaults to '16/9'.
   */
  aspect?: '9/16' | '16/9';
}

export default function VideoPlayerModal({
  open,
  onClose,
  src,
  title,
  description,
  aspect = '16/9',
}: Props) {
  useEffect(() => {
    if (open) document.body.classList.add('modal-open');
    else document.body.classList.remove('modal-open');
    return () => document.body.classList.remove('modal-open');
  }, [open]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  // Vertical player gets a narrower max width so it doesn't tower over the screen.
  const playerWrapperClass =
    aspect === '9/16'
      ? 'mx-auto w-full max-w-sm aspect-[9/16]'
      : 'mx-auto w-full aspect-video';
  const modalWidthClass = aspect === '9/16' ? 'max-w-md' : 'max-w-5xl';

  return (
    <div
      className={`modal-overlay ${open ? 'active' : ''}`}
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={`modal-content bg-forest-night ${modalWidthClass}`}>
        <button className="modal-close" onClick={onClose} aria-label="Sulje">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="6" y1="6" x2="18" y2="18" />
            <line x1="6" y1="18" x2="18" y2="6" />
          </svg>
        </button>

        <div className={`bg-black ${playerWrapperClass}`}>
          {open && src && src.type === 'youtube' && (
            <iframe
              className="h-full w-full"
              src={`https://www.youtube.com/embed/${src.id}?autoplay=1&rel=0`}
              title={title ?? 'Video'}
              frameBorder="0"
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
            />
          )}
          {open && src && src.type === 'vimeo' && (
            <iframe
              className="h-full w-full"
              src={`https://player.vimeo.com/video/${src.id}?autoplay=1&dnt=1`}
              title={title ?? 'Video'}
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
            />
          )}
          {open && src && src.type === 'mp4' && (
            <video
              key={src.url}
              src={src.url}
              className="h-full w-full object-contain"
              autoPlay
              controls
              playsInline
            />
          )}
        </div>

        {(title || description) && (
          <div className="p-6 md:p-8">
            {title && <p className="font-display text-2xl text-cream md:text-3xl">{title}</p>}
            {description && (
              <p className="mt-3 text-sm leading-relaxed text-cream/70 md:text-base">{description}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
