import { useConsent } from '../lib/consent';
import { ANALYTICS_ENABLED } from '../lib/analytics';

export default function CookieConsent() {
  const { consent, grant, deny } = useConsent();

  // Hide entirely if analytics aren't configured (nothing to consent to)
  if (!ANALYTICS_ENABLED) return null;
  if (consent !== 'unknown') return null;

  return (
    <div
      role="dialog"
      aria-label="Eväste-suostumus"
      className="fixed bottom-4 left-4 right-4 z-[60] mx-auto max-w-2xl rounded-lg border border-cream/15 bg-forest-deep/95 p-5 shadow-2xl backdrop-blur md:bottom-6 md:left-6"
    >
      <p className="font-display text-base text-cream md:text-lg">Käytämme evästeitä</p>
      <p className="mt-2 text-sm leading-relaxed text-cream/75">
        Käytämme Google Analyticsia ymmärtääksemme miten sivustoa käytetään. Mitään henkilökohtaisia tietoja ei tallenneta. Voit hyväksyä tai kieltää alla.
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={grant}
          className="rounded-full bg-amber px-5 py-2 text-xs font-semibold uppercase tracking-widest text-forest-night transition hover:bg-amber-light"
        >
          Hyväksy
        </button>
        <button
          type="button"
          onClick={deny}
          className="ghost-cta rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-widest text-cream"
        >
          Kiellä
        </button>
      </div>
    </div>
  );
}
