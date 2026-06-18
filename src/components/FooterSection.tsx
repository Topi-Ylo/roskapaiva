import { Link } from 'react-router-dom';
import { useSiteSettings } from '../hooks/useSiteSettings';
export default function FooterSection() {
  const settings = useSiteSettings();
  return (
    <section id="mukaan" className="relative overflow-hidden">
      <div className="absolute inset-0" style={{
        backgroundImage: "linear-gradient(rgba(11, 22, 15, 0.75), rgba(11, 22, 15, 0.95)), url('https://i.imgur.com/q6UJMnj.jpeg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }} />

      <div className="relative mx-auto max-w-7xl px-6 py-32 md:py-40">
        <p className="reveal eyebrow text-amber">Mukaan</p>
        <h2 className="reveal delay-1 font-display mt-6 text-5xl text-cream md:text-6xl lg:text-7xl">Vaikutetaan<br />yhdessä.</h2>

        <div className="mt-20 grid gap-px bg-cream/10 md:grid-cols-3">
          <a
            href={settings.instagram_url ?? 'https://instagram.com/roskapaiva'}
            target="_blank"
            rel="noopener noreferrer"
            className="reveal delay-2 group block bg-forest-night/80 p-10 transition hover:bg-forest-night md:p-12"
          >
            <p className="font-display text-5xl text-amber">01</p>
            <h3 className="font-display mt-4 text-2xl text-cream md:text-3xl">Seuraa<br />Instagramissa</h3>
            <span className="mt-8 inline-flex items-center gap-2 text-cream transition group-hover:text-amber">
              <span className="font-display text-xl">@roskapaiva</span>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10m0 0L8 3m5 5l-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </span>
          </a>

          <Link
            to="/5-9-2026"
            className="reveal delay-3 group block bg-forest-night/80 p-10 transition hover:bg-forest-night md:p-12"
          >
            <p className="font-display text-5xl text-amber">02</p>
            <h3 className="font-display mt-4 text-2xl text-cream md:text-3xl">Roskapäivä<br />{settings.next_event_date ?? '5.9.2026'}</h3>
            <span className="mt-8 inline-flex items-center gap-2 text-cream/80 transition group-hover:text-amber">
              <span className="font-display text-xl">Tapahtuman sivu</span>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10m0 0L8 3m5 5l-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </span>
          </Link>

          <Link
            to="/kansalaisaloite"
            className="reveal delay-4 group block bg-forest-night/80 p-10 transition hover:bg-forest-night md:p-12"
          >
            <p className="font-display text-5xl text-amber">03</p>
            <h3 className="font-display mt-4 text-2xl text-cream md:text-3xl">Allekirjoita<br />kansalaisaloite</h3>
            <span className="mt-8 inline-flex items-center gap-2 text-cream/80 transition group-hover:text-amber">
              <span className="font-display text-xl">Lue lisää</span>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10m0 0L8 3m5 5l-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </span>
          </Link>
        </div>

        <div className="reveal mt-24 grid gap-12 border-t border-cream/15 pt-16 md:grid-cols-12">
          <div className="md:col-span-7">
            <p className="eyebrow text-amber">Yhteystiedot</p>
            <div className="mt-6 space-y-2">
              <a href={`mailto:${settings.contact_email ?? 'eino@roskapaiva.com'}`} className="font-display block text-3xl text-cream transition hover:text-amber md:text-4xl">{settings.contact_email ?? 'eino@roskapaiva.com'}</a>
              <a href={`tel:${(settings.contact_phone ?? '+358 45 673 2109').replace(/\s/g, '')}`} className="font-display block text-3xl text-cream transition hover:text-amber md:text-4xl">{settings.contact_phone ?? '+358 45 673 2109'}</a>
            </div>
          </div>

          <div className="md:col-span-5 md:text-right">
            <p className="eyebrow text-amber">Some</p>
            <div className="mt-6 flex gap-4 md:justify-end">
              <a
                href={settings.instagram_url ?? 'https://instagram.com/roskapaiva'}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="ghost-cta flex h-14 w-14 items-center justify-center rounded-full text-cream transition hover:text-amber"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
                </svg>
              </a>
              <a
                href={settings.tiktok_url ?? 'https://www.tiktok.com/@roskapaiva'}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="ghost-cta flex h-14 w-14 items-center justify-center rounded-full text-cream transition hover:text-amber"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.55a8.16 8.16 0 0 0 4.77 1.52V6.62a4.85 4.85 0 0 1-1.84.07Z" />
                </svg>
              </a>
              <a
                href={settings.youtube_url ?? 'https://www.youtube.com/@roskapaiva'}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="ghost-cta flex h-14 w-14 items-center justify-center rounded-full text-cream transition hover:text-amber"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M22 8.5a4 4 0 0 0-3-3C17 5 12 5 12 5s-5 0-7 .5a4 4 0 0 0-3 3C2 10.5 2 12 2 12s0 1.5.5 3.5a4 4 0 0 0 3 3C7.5 19 12 19 12 19s5 0 7-.5a4 4 0 0 0 3-3c.5-2 .5-3.5.5-3.5s0-1.5-.5-3.5Z" />
                  <path d="m10 9 5 3-5 3V9Z" fill="currentColor" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-20 flex flex-col items-center justify-between gap-4 border-t border-cream/10 pt-8 text-xs text-cream/40 md:flex-row">
          <div className="flex items-center gap-3">
            <img
              src="https://i.imgur.com/ORj8kKe.png"
              alt="Roskapäivä"
              className="h-7 w-auto"
            />
            <p className="eyebrow">© 2018–2026 Roskapäivä</p>
          </div>
          <p className="font-quote text-base italic text-cream/55">Tehty Helsingissä.</p>
        </div>
      </div>
    </section>
  );
}
