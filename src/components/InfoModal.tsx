import { useEffect } from 'react';
import SafetyContent from './SafetyContent';
import PrivacyContent from './PrivacyContent';
import { useInfoModal } from '../lib/infoModal';

/**
 * The safety guidance and the privacy notice as an overlay.
 *
 * Rendered once at the app root, so any link anywhere opens it without sending
 * the reader away from what they were doing — which matters most on the sign-up
 * form, where leaving the page loses a half-filled submission.
 */
export default function InfoModal() {
  const { doc, close } = useInfoModal();
  const open = doc !== null;

  useEffect(() => {
    if (open) document.body.classList.add('modal-open');
    else document.body.classList.remove('modal-open');
    return () => document.body.classList.remove('modal-open');
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, close]);

  return (
    <div
      className={`modal-overlay ${open ? 'active' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label={doc === 'tietosuoja' ? 'Tietosuojaseloste' : 'Turvallisuus- ja osallistumisohjeet'}
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div className="modal-content max-w-3xl">
        <button className="modal-close" onClick={close} aria-label="Sulje">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="6" y1="6" x2="18" y2="18" />
            <line x1="6" y1="18" x2="18" y2="6" />
          </svg>
        </button>
        <div className="px-6 py-10 md:px-10">
          {/* Unmounted while closed: nothing renders or fetches until opened. */}
          {doc === 'ohjeet' && <SafetyContent />}
          {doc === 'tietosuoja' && <PrivacyContent />}
        </div>
      </div>
    </div>
  );
}
