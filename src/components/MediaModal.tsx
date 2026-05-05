import { useEffect } from 'react';
import { useSiteSettings } from '../hooks/useSiteSettings';

interface Props {
  open: boolean;
  onClose: () => void;
}

const PARTNERS = [
  'ResQ Club',
  'Hakola',
  'Partioaitta',
  'Nissan Suomi',
  'S-ryhmä',
  'WWF Suomi',
  'Vantaan kaupunki',
  'Paristokierrätys',
  'SER-kierrätys',
  'Pohjolan Maalipojat',
];

const KEY_NUMBERS = [
  { stat: '22 000', label: 'seuraajaa Instagramissa' },
  { stat: '500 000', label: 'tavoittavuus / kk' },
  { stat: '25 000', label: 'näyttöä / postaus' },
  { stat: '500', label: 'tykkäystä / postaus' },
  { stat: '100', label: 'kouluvierailua / siivoustapahtumaa / v' },
  { stat: '1,1M', label: 'tavoittavuus Vappu-reelillä' },
];

const IMPACT_GROUPS = [
  {
    title: 'Konkreettinen ympäristövaikutus',
    points: [
      'Tuhansia kiloja roskaa poistettu luonnosta',
      'Rantaroskan systemaattinen kerääminen',
      'Yhteisöjen aktivoiminen omaehtoiseen toimintaan',
      'Yli 1 000 osallistunutta ihmistä',
    ],
  },
  {
    title: 'Nuorten käyttäytymiseen vaikuttaminen',
    points: [
      '2 000 oppilasta vuosittain',
      'Opettajilta toistuva positiivinen palaute',
      'Nuorten oma-aloitteisen roskankeräyksen lisääntyminen',
    ],
  },
  {
    title: 'Viestinnällinen vaikutus',
    points: [
      'Keskimäärin 25 000 näyttöä / julkaisu',
      'Parhaimmillaan yli 100 000 näyttöä',
      'Ympäristöteemat tavoittavat myös ei-valmiiksi-aktiivisia',
    ],
  },
  {
    title: 'Uskottavuus',
    points: [
      'Pitkäjänteinen toiminta vuodesta 2018',
      'Aiemmat apurahat toteutettu onnistuneesti',
      'Toiminta jatkunut projektien jälkeenkin',
    ],
  },
];

const APURAHAT = [
  { source: 'Koneen Säätiö', year: '2023' },
  { source: 'Haavikko-säätiö', year: '2026' },
];

export default function MediaModal({ open, onClose }: Props) {
  const settings = useSiteSettings();
  useEffect(() => {
    if (open) document.body.classList.add('modal-open');
    else document.body.classList.remove('modal-open');
    return () => document.body.classList.remove('modal-open');
  }, [open]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
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
      <div className="modal-content max-w-4xl">
        <button className="modal-close" onClick={onClose} aria-label="Sulje">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="6" y1="6" x2="18" y2="18" />
            <line x1="6" y1="18" x2="18" y2="6" />
          </svg>
        </button>

        <div className="relative aspect-[16/9] overflow-hidden">
          <img
            src="https://i.imgur.com/fcwg4uh.jpeg"
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-forest-deep via-forest-deep/40 to-transparent" />
        </div>

        <div className="p-8 md:p-14">
          <p className="eyebrow text-amber">Medialle</p>
          <h2 className="font-display mt-6 text-4xl text-cream md:text-5xl lg:text-6xl">Mediakortti.</h2>
          <p className="mt-6 text-base text-cream/70 md:text-lg">
            Lehdistölle, toimittajille ja tuottajille. Vapaa käytettäväksi journalistisissa yhteyksissä.
          </p>

          <div className="mt-12 space-y-12">
            <section>
              <p className="eyebrow text-amber">Pikaesittely</p>
              <h3 className="font-display mt-3 text-2xl text-cream md:text-3xl">Roskapäivä Eino</h3>
              <p className="mt-4 text-base leading-relaxed text-cream/80 md:text-lg">
                Eino Oinio on vastuullisuusvaikuttaja ja roska-aktivisti, Roskapäivä-toiminnan ja sen Instagram-tilin perustaja. Vuodesta 2018 hän on tehnyt pitkäjänteistä työtä luonnon roskaantumisen vähentämiseksi. Toiminta yhdistää konkreettisen kenttätyön, nuorten ympäristökasvatuksen, yhteisölliset siivoustapahtumat, datalähtöisen kehittämisen ja laajan viestinnällisen vaikuttavuuden.
              </p>
              <p className="mt-4 text-base leading-relaxed text-cream/80 md:text-lg">
                Vuodesta 2025 alkaen Eino on toiminut täysipäiväisesti ympäristöprojektien parissa, jättäen 14 vuoden hammasteknikon uransa taakseen.
              </p>
            </section>

            <section>
              <p className="eyebrow text-amber">Avainluvut</p>
              <h3 className="font-display mt-3 text-2xl text-cream md:text-3xl">Tilastoja</h3>
              <ul className="mt-6 grid grid-cols-2 gap-6 md:grid-cols-3">
                {KEY_NUMBERS.map((item) => (
                  <li key={item.stat}>
                    <p className="font-display text-3xl text-amber">{item.stat}</p>
                    <p className="eyebrow mt-2 text-cream/55">{item.label}</p>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <p className="eyebrow text-amber">Vaikuttavuus &amp; näyttö</p>
              <div className="mt-6 grid gap-6 md:grid-cols-2">
                {IMPACT_GROUPS.map((group) => (
                  <div key={group.title} className="border-l-2 border-amber/60 pl-5">
                    <p className="font-display text-lg text-cream md:text-xl">{group.title}</p>
                    <ul className="mt-3 space-y-2 text-sm text-cream/75 md:text-base">
                      {group.points.map((p) => (
                        <li key={p}>· {p}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <p className="eyebrow text-amber">Viimeisimmät yhteistyöt</p>
              <h3 className="font-display mt-3 text-2xl text-cream md:text-3xl">Kumppaneita</h3>
              <ul className="mt-5 grid grid-cols-2 gap-x-6 gap-y-2 text-sm text-cream/75 md:grid-cols-3 md:text-base">
                {PARTNERS.map((p) => (
                  <li key={p} className="font-medium uppercase tracking-wider">{p}</li>
                ))}
              </ul>
            </section>

            <section>
              <p className="eyebrow text-amber">Saadut apurahat</p>
              <ul className="mt-5 space-y-2 text-cream/80">
                {APURAHAT.map((a) => (
                  <li key={a.source} className="flex items-baseline justify-between border-b border-cream/10 pb-2">
                    <span className="font-medium uppercase tracking-wider">{a.source}</span>
                    <span className="font-display text-xl text-amber">{a.year}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <p className="eyebrow text-amber">Roskapäivä 2026</p>
              <h3 className="font-display mt-3 text-2xl text-cream md:text-3xl">Tapahtuma</h3>
              <ul className="mt-4 space-y-2 text-cream/80">
                <li><span className="text-amber">Päivämäärä:</span> Lauantai 5.9.2026</li>
                <li><span className="text-amber">Paikka:</span> Helsinki</li>
                <li><span className="text-amber">Osallistuminen:</span> Ilmainen, kiitos sponsoreiden</li>
              </ul>
            </section>

            <section>
              <p className="eyebrow text-amber">Yhteydenotto</p>
              <h3 className="font-display mt-3 text-2xl text-cream md:text-3xl">Mediakyselyt</h3>
              <div className="mt-4 space-y-2">
                <a href="mailto:eino@roskapaiva.com" className="font-display block text-2xl text-amber transition hover:text-amber-light">eino@roskapaiva.com</a>
                <a href="tel:+358456732109" className="font-display block text-2xl text-amber transition hover:text-amber-light">+358 45 673 2109</a>
              </div>
            </section>

            <div className="border-t border-cream/10 pt-8 flex flex-wrap gap-3">
              <a
                href={settings.mediakortti_pdf_url ?? '#'}
                target={settings.mediakortti_pdf_url ? '_blank' : undefined}
                rel={settings.mediakortti_pdf_url ? 'noopener noreferrer' : undefined}
                onClick={(e) => { if (!settings.mediakortti_pdf_url) e.preventDefault(); }}
                aria-disabled={!settings.mediakortti_pdf_url}
                className={`inline-flex items-center gap-2 bg-amber px-6 py-3 text-xs font-bold uppercase tracking-widest text-forest-night transition hover:bg-amber-light ${settings.mediakortti_pdf_url ? '' : 'cursor-not-allowed opacity-50'}`}
              >
                Lataa mediakortti (PDF)
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M8 1v10m0 0l4-4m-4 4l-4-4M2 14h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
              <a
                href={settings.press_zip_url ?? '#'}
                target={settings.press_zip_url ? '_blank' : undefined}
                rel={settings.press_zip_url ? 'noopener noreferrer' : undefined}
                onClick={(e) => { if (!settings.press_zip_url) e.preventDefault(); }}
                aria-disabled={!settings.press_zip_url}
                className={`inline-flex items-center gap-2 ghost-cta px-6 py-3 text-xs font-semibold uppercase tracking-widest text-cream rounded-none ${settings.press_zip_url ? '' : 'cursor-not-allowed opacity-50'}`}
              >
                Lataa lehdistökuvat (.zip)
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
