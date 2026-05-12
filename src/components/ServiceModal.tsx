import { useEffect } from 'react';

export interface ServiceModalData {
  num: string;
  title: string;
  description: string | null;
  modalBody: string | null;
  imageUrl: string | null;
  ctaLabel: string | null;
  ctaEmail: string | null;
  ctaSubject: string | null;
}

interface Props {
  open: boolean;
  service: ServiceModalData | null;
  onClose: () => void;
}

const ArrowRight = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
    <path d="M3 8h10m0 0L8 3m5 5l-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export default function ServiceModal({ open, service, onClose }: Props) {
  useEffect(() => {
    if (open) document.body.classList.add('modal-open');
    else document.body.classList.remove('modal-open');
    return () => document.body.classList.remove('modal-open');
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!service) return null;

  const title = service.title.replace(/\\n/g, ' ').replace(/\n/g, ' ');
  const body = service.modalBody?.trim() || service.description?.trim() || '';
  const paragraphs = body.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
  const mailto = service.ctaEmail
    ? `mailto:${service.ctaEmail}${service.ctaSubject ? '?subject=' + encodeURIComponent(service.ctaSubject) : ''}`
    : null;

  return (
    <div
      className={`modal-overlay ${open ? 'active' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="service-modal-title"
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

        <div className="relative aspect-[16/9] overflow-hidden bg-forest-night">
          {service.imageUrl ? (
            <img
              src={service.imageUrl}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <div
              className="absolute inset-0"
              style={{
                background:
                  'radial-gradient(circle at 30% 30%, rgba(201,162,39,0.15), transparent 60%), linear-gradient(135deg, #13241A 0%, #0B160F 100%)',
              }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-forest-deep via-forest-deep/40 to-transparent" />
          <span className="absolute left-6 top-6 font-display text-4xl text-amber md:left-10 md:top-10 md:text-5xl">
            {service.num}
          </span>
        </div>

        <div className="p-8 md:p-14">
          <p className="eyebrow text-amber">Palvelu</p>
          <h2
            id="service-modal-title"
            className="font-display mt-6 text-4xl text-cream md:text-5xl lg:text-6xl"
          >
            {title}
          </h2>

          {service.description && (
            <p className="mt-8 font-quote text-lg italic leading-relaxed text-cream/85 md:text-xl">
              {service.description}
            </p>
          )}

          {paragraphs.length > 0 && (
            <div className="mt-8 space-y-5 text-base leading-relaxed text-cream/80 md:text-lg">
              {paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          )}

          {mailto && service.ctaLabel && (
            <div className="mt-12">
              <a
                href={mailto}
                className="inline-flex items-center gap-3 rounded-full bg-amber px-7 py-3 text-xs font-semibold uppercase tracking-widest text-forest-night transition hover:bg-amber-light"
              >
                {service.ctaLabel}
                <ArrowRight />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
