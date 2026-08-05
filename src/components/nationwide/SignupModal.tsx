import { useEffect } from 'react';
import EventSignupForm from './EventSignupForm';

interface Props {
  open: boolean;
  onClose: () => void;
}

/** The sign-up form as an overlay, opened from the hero and the map section. */
export default function SignupModal({ open, onClose }: Props) {
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

  return (
    <div
      className={`modal-overlay ${open ? 'active' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label="Ilmoita osallistumisesi"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-content max-w-2xl">
        <button className="modal-close" onClick={onClose} aria-label="Sulje">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="6" y1="6" x2="18" y2="18" />
            <line x1="6" y1="18" x2="18" y2="6" />
          </svg>
        </button>

        <div className="p-8 md:p-12">
          <p className="eyebrow text-amber">Ilmoita tapahtumasi</p>
          <h2 className="font-display mt-5 text-3xl text-cream md:text-4xl">Järjestätkö omasi?</h2>
          <p className="mt-5 text-base leading-relaxed text-cream/75">
            Kerro lyhyesti mitä olet suunnitellut, niin lisäämme tapahtumasi kartalle.
            Kaikenkokoiset tapahtumat ovat tervetulleita, kahden hengen roskaretkestä koko kylän
            talkoisiin.
          </p>

          <div className="mt-8">
            <EventSignupForm />
          </div>
        </div>
      </div>
    </div>
  );
}
