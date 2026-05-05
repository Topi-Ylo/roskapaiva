import { ANALYTICS_ENABLED } from '../../lib/analytics';

const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined;

export default function AnalyticsAdmin() {
  return (
    <div className="mx-auto max-w-4xl">
      <p className="eyebrow text-amber">Analytiikka</p>
      <h1 className="font-display mt-4 text-4xl text-cream md:text-5xl">Kävijätilastot</h1>

      {!ANALYTICS_ENABLED ? (
        <div className="mt-8 rounded-lg border border-amber/30 bg-amber/5 p-6 text-cream/85">
          <p className="font-display text-lg text-amber">Google Analytics ei ole konfiguroitu</p>
          <p className="mt-3 text-sm leading-relaxed">
            Aseta GA4-tunniste ympäristömuuttujaan <code className="text-cream">VITE_GA_MEASUREMENT_ID</code> (esim. <code className="text-cream">G-ABC123DEF</code>).
            Hae tunniste osoitteesta <a className="text-amber underline" href="https://analytics.google.com" target="_blank" rel="noopener noreferrer">analytics.google.com</a>.
          </p>
        </div>
      ) : (
        <>
          <p className="mt-4 text-cream/70">
            Reaaliaikainen näkymä Google Analytics 4:ssa. Tämä avautuu uudessa ikkunassa.
          </p>
          <a
            href={`https://analytics.google.com/analytics/web/#/p${GA_ID?.replace(/^G-/, '')}/realtime/overview`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-amber px-6 py-3 text-xs font-semibold uppercase tracking-widest text-forest-night transition hover:bg-amber-light"
          >
            Avaa GA4 hallintapaneeli
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M3 13L13 3M13 3H6M13 3v7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>

          <div className="mt-10 rounded-lg border border-cream/10 bg-forest-deep p-6 text-sm leading-relaxed text-cream/75">
            <p className="font-display text-base text-cream">Mitä on käytössä</p>
            <ul className="mt-3 space-y-2">
              <li>· Sivunäkymät (page_view) jokaisesta reitin vaihdosta</li>
              <li>· IP-osoitteet anonymisoituja oletuksena</li>
              <li>· Lataus käynnistyy vain käyttäjän hyväksynnän jälkeen (eväste-banneri)</li>
              <li>· GA4-tunniste: <code className="text-cream">{GA_ID}</code></li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
