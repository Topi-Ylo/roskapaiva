import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  eventDateLabel,
  isUpcoming,
  type EventItem,
} from '../../lib/eventsData';

interface Props {
  event: EventItem | null;
  onClose: () => void;
}

export default function EventDetailModal({ event, onClose }: Props) {
  const open = event !== null;

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

  const paragraphs = (event?.body ?? '')
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  const link = event?.link_url ?? null;
  const linkLabel = event?.link_label || 'Lue lisää';
  const internal = link?.startsWith('/');

  return (
    <div
      className={`modal-overlay ${open ? 'active' : ''}`}
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-content max-w-3xl">
        <button className="modal-close" onClick={onClose} aria-label="Sulje">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="6" y1="6" x2="18" y2="18" />
            <line x1="6" y1="18" x2="18" y2="6" />
          </svg>
        </button>

        {event && (
          <>
            <div className="relative aspect-[16/9] overflow-hidden bg-forest-night">
              {event.image_url && (
                <img
                  src={event.image_url}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-forest-deep via-forest-deep/40 to-transparent" />
              {isUpcoming(event) && (
                <span className="absolute left-6 top-6 inline-flex items-center gap-2 rounded-full bg-amber px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-forest-night">
                  <span className="h-1.5 w-1.5 rounded-full bg-forest-night" />
                  Tuleva
                </span>
              )}
            </div>

            <div className="p-8 md:p-12">
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-cream/60">
                {event.type && <span className="eyebrow text-amber">{event.type}</span>}
                <span className="text-sm">{eventDateLabel(event)}</span>
                {event.location && <span className="text-sm">{event.location}</span>}
              </div>

              <h2 className="font-display mt-5 text-4xl text-cream md:text-5xl">
                {event.title}
              </h2>
              {event.subtitle && (
                <p className="font-display mt-1 text-2xl text-amber md:text-3xl">{event.subtitle}</p>
              )}

              {event.description && (
                <p className="font-quote mt-8 text-xl italic leading-relaxed text-cream/85 md:text-2xl">
                  {event.description}
                </p>
              )}

              {paragraphs.length > 0 && (
                <div className="mt-8 space-y-5 text-base leading-relaxed text-cream/80 md:text-lg">
                  {paragraphs.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              )}

              {link &&
                (internal ? (
                  <Link
                    to={link}
                    onClick={onClose}
                    className="ghost-cta mt-10 inline-flex items-center gap-2 rounded-full px-7 py-3 text-xs font-semibold uppercase tracking-widest text-cream"
                  >
                    {linkLabel}
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8h10m0 0L8 3m5 5l-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </Link>
                ) : (
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ghost-cta mt-10 inline-flex items-center gap-2 rounded-full px-7 py-3 text-xs font-semibold uppercase tracking-widest text-cream"
                  >
                    {linkLabel}
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8h10m0 0L8 3m5 5l-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </a>
                ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
