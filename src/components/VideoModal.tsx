import { useEffect } from 'react';

interface Props {
  open: boolean;
  onClose: () => void;
}

const videoId = 'hdbIkePH_og';

export default function VideoModal({ open, onClose }: Props) {
  useEffect(() => {
    if (open) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    return () => document.body.classList.remove('modal-open');
  }, [open]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div
      className={`modal-overlay ${open ? 'active' : ''}`}
      role="dialog"
      aria-modal="true"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="modal-content max-w-5xl bg-forest-night">
        <button className="modal-close" onClick={onClose} aria-label="Sulje">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="6" y1="6" x2="18" y2="18" />
            <line x1="6" y1="18" x2="18" y2="6" />
          </svg>
        </button>
        <div className="aspect-video">
          {open && (
            <iframe
              className="h-full w-full"
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
              title="Trashday"
              frameBorder="0"
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
            />
          )}
        </div>
        <div className="p-6 md:p-10">
          <p className="eyebrow text-amber">Dokumentti</p>
          <h3 className="font-display mt-3 text-3xl text-cream md:text-4xl">Trashday</h3>
          <p className="mt-4 text-base leading-relaxed text-cream/85 md:text-lg">
            Trashday on muotokuva Einosta, isästä joka alkoi kerätä roskia helpottaakseen huoltaan ympäristöstä.
          </p>
          <p className="mt-3 text-sm text-cream/60">Ensi-ilta 11.6.2024.</p>

          <div className="mt-8 grid gap-1 border-t border-cream/10 pt-6 text-xs leading-relaxed text-cream/55 md:text-sm">
            <p>A film by Petrus Koskinen</p>
            <p>Cinematography by Tuukka Kovasiipi</p>
            <p>Original score composed by Benjami Koskinen</p>
            <p>Sound design by Akseli Soini / El Camino Helsinki</p>
            <p>Grade by Juhani Vuorisalo / Grade One</p>
            <p>Graphic design by Jari Salo</p>
            <p>Trailer editor Rickard Stolpe</p>
            <p>Sound effect editing by Sakari Karjalainen and Heli Linnus</p>
            <p>Helping hand and drone pilot Anton Stennabb</p>
            <p className="mt-3 text-cream/45">
              Documentary made in association with Helsinki, WWF, Jenny and Antti Wihuri Foundation &amp; Baltiplast Interreg.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
