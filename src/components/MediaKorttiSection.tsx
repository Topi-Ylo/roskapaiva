import { useState } from 'react';
import MediaModal from './MediaModal';
import PressImageModal from './PressImageModal';
import { useTableData } from '../hooks/useTableData';
import { useSiteSettings } from '../hooks/useSiteSettings';

interface PressImageRow {
  id?: string;
  label: string;
  src: string;
}

// Press kit images sourced from the existing site library.
const FALLBACK_PRESS_IMAGES = [
  { src: 'https://www.roskapaiva.com/wp-content/uploads/2025/10/Picsart_25-10-16_06-40-24-707.jpg', label: 'Eino, muotokuva' },
  { src: 'https://i.imgur.com/Mf4XgjV.jpeg', label: 'Eino, kentällä' },
  { src: 'https://i.imgur.com/izbXPaq.jpeg', label: 'Suvilahti · Vappu 2026' },
  { src: 'https://i.imgur.com/DdJYyxb.jpeg', label: 'Töölö · 2024' },
  { src: 'https://i.imgur.com/yjZzydi.jpeg', label: 'Vallisaari · 2025' },
  { src: 'https://www.mustankorkea.fi/wp-content/uploads/2024/09/roskapaiva-3-1024x766.jpg', label: 'Yleisökuva' },
  { src: 'https://www.mustankorkea.fi/wp-content/uploads/2024/09/roskapaiva-4.jpg', label: 'Roskapäivä-tapahtuma' },
  { src: 'https://i.imgur.com/Yj6YwV7.jpeg', label: 'Tukes · zombiakkukampanja' },
  { src: 'https://i.imgur.com/FSNLVUN.jpeg', label: 'Eino, lähikuva' },
  { src: 'https://www.roskapaiva.com/wp-content/uploads/2025/12/Picsart_25-12-15_12-13-53-609.jpg', label: 'Suomen-laajuinen Roskapäivä' },
];

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    if (!navigator.clipboard) return;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  };

  return (
    <button onClick={copy} className="mt-6 inline-flex items-center gap-2 self-start text-xs font-semibold uppercase tracking-widest text-amber transition hover:text-amber-light">
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
        <rect x="3" y="3" width="9" height="9" rx="1" stroke="currentColor" strokeWidth="1.5" />
        <path d="M5 3V2a1 1 0 011-1h7a1 1 0 011 1v9a1 1 0 01-1 1h-1" stroke="currentColor" strokeWidth="1.5" />
      </svg>
      {copied ? 'Kopioitu!' : 'Kopioi teksti'}
    </button>
  );
}

export default function MediaKorttiSection() {
  const [open, setOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState<number | null>(null);
  const { data: rows } = useTableData<PressImageRow>('press_images');
  const settings = useSiteSettings();
  const pressImages = rows && rows.length > 0
    ? rows.map((r) => ({ src: r.src, label: r.label }))
    : FALLBACK_PRESS_IMAGES;

  return (
    <>
      <section id="medialle" className="relative overflow-hidden bg-forest-deep py-32 md:py-40">
        <div className="absolute inset-0 opacity-15" style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?auto=format&fit=crop&w=2400&q=80')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }} />
        <div className="absolute inset-0 bg-gradient-to-b from-forest-deep via-forest-deep/95 to-forest-deep" />

        <div className="relative mx-auto max-w-7xl px-6">

          <div className="reveal flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow text-amber">Medialle</p>
              <h2 className="font-display mt-6 text-5xl text-cream md:text-6xl lg:text-7xl">Mediakortti.</h2>
            </div>
            <p className="max-w-md text-base text-cream/70 md:text-lg">
              Lehdistölle ja toimittajille: pikaesittely, avainluvut, lehdistökuvat ja yhteystiedot juttuja varten.
            </p>
          </div>

          <div className="mt-20 grid gap-6 md:grid-cols-3">
            <div className="reveal flex flex-col border border-cream/10 bg-forest-night/60 p-8 md:p-10">
              <p className="eyebrow text-amber">01 Pikaesittely</p>
              <h3 className="font-display mt-6 text-2xl text-cream md:text-3xl">Mikä on Roskapäivä?</h3>
              <p className="mt-4 flex-1 text-cream/80 leading-relaxed">
                Eino Oinio on vuonna 2018 perustanut Roskapäivän, liikkeen luonnon roskaantumisen vähentämiseksi. Vuodesta 2025 hän on työskennellyt täysipäiväisesti ympäristöprojektien parissa, jätettyään 14 vuoden uransa hammasteknikkona.
              </p>
              <CopyButton text="Eino Oinio on vuonna 2018 perustanut Roskapäivän, liikkeen luonnon roskaantumisen vähentämiseksi. Vuodesta 2025 hän on työskennellyt täysipäiväisesti ympäristöprojektien parissa." />
            </div>

            <div className="reveal delay-1 flex flex-col border border-cream/10 bg-forest-night/60 p-8 md:p-10">
              <p className="eyebrow text-amber">02 Avainluvut</p>
              <h3 className="font-display mt-6 text-2xl text-cream md:text-3xl">Tilastot</h3>
              <ul className="mt-6 flex-1 space-y-4">
                {[
                  { stat: '22 000', label: 'seuraajaa Instagramissa' },
                  { stat: '500 000', label: 'tavoittavuus / kk' },
                  { stat: '25 000', label: 'näyttöä / postaus (keskimäärin)' },
                  { stat: '100', label: 'kouluvierailua ja siivoustapahtumaa / vuosi' },
                ].map((item) => (
                  <li key={item.stat} className="flex items-baseline gap-4">
                    <span className="font-display text-2xl text-amber md:text-3xl whitespace-nowrap">{item.stat}</span>
                    <span className="text-sm text-cream/70 leading-snug">{item.label}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="reveal delay-2 flex flex-col border border-cream/10 bg-forest-night/60 p-8 md:p-10">
              <p className="eyebrow text-amber">03 Yhteydenotto</p>
              <h3 className="font-display mt-6 text-2xl text-cream md:text-3xl">Lehdistölle</h3>
              <p className="mt-4 text-cream/80 leading-relaxed">Haastattelupyynnöt, kommenttipyynnöt ja muut mediakyselyt:</p>
              <div className="mt-6 flex-1 space-y-3">
                <div>
                  <p className="eyebrow text-cream/45">Sähköposti</p>
                  <a href="mailto:eino@roskapaiva.com" className="font-display mt-1 block text-xl text-amber transition hover:text-amber-light">eino@roskapaiva.com</a>
                </div>
                <div>
                  <p className="eyebrow text-cream/45">Puhelin</p>
                  <a href="tel:+358456732109" className="font-display mt-1 block text-xl text-amber transition hover:text-amber-light">+358 45 673 2109</a>
                </div>
              </div>
            </div>
          </div>

          <div className="reveal mt-16">
            <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
              <div>
                <p className="eyebrow text-amber">Lehdistökuvat</p>
                <h3 className="font-display mt-3 text-3xl text-cream md:text-4xl">Vapaasti käytettävissä.</h3>
              </div>
              <button
                onClick={() => setOpen(true)}
                className="ghost-cta inline-flex items-center gap-3 self-start rounded-full px-7 py-3 text-xs font-semibold uppercase tracking-widest text-cream md:self-auto"
              >
                Avaa koko mediakortti
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10m0 0L8 3m5 5l-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <div className="-mx-6 overflow-hidden md:-mx-0">
              <div className="media-marquee flex gap-3 px-6 md:px-0">
                {[...pressImages, ...pressImages].map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setGalleryIndex(i % pressImages.length)}
                    className="photo-card group relative block aspect-[4/5] w-[200px] flex-shrink-0 overflow-hidden text-left sm:w-[240px] md:w-[260px]"
                  >
                    <img
                      src={img.src}
                      alt={img.label}
                      className="absolute inset-0 h-full w-full object-cover"
                      loading="lazy"
                    />
                    <div className="relative z-10 flex h-full items-end p-4">
                      <p className="text-xs uppercase tracking-wider text-cream/80">{img.label}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-cream/55">
                Käyttöehdot: kuvia voi käyttää vapaasti journalistisissa yhteyksissä, kun lähde mainitaan (Roskapäivä / Eino Oinio).
              </p>
              <a
                href={settings.press_zip_url ?? '#'}
                target={settings.press_zip_url ? '_blank' : undefined}
                rel={settings.press_zip_url ? 'noopener noreferrer' : undefined}
                onClick={(e) => { if (!settings.press_zip_url) e.preventDefault(); }}
                aria-disabled={!settings.press_zip_url}
                className={`inline-flex items-center gap-3 self-start bg-amber px-6 py-3 text-xs font-bold uppercase tracking-widest text-forest-night transition hover:bg-amber-light sm:self-auto ${settings.press_zip_url ? '' : 'cursor-not-allowed opacity-50'}`}
              >
                Lataa kuvat (.zip)
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M8 1v10m0 0l4-4m-4 4l-4-4M2 14h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>
          </div>

        </div>
      </section>

      <MediaModal open={open} onClose={() => setOpen(false)} />
      <PressImageModal
        open={galleryIndex !== null}
        onClose={() => setGalleryIndex(null)}
        images={pressImages}
        index={galleryIndex ?? 0}
        onIndexChange={setGalleryIndex}
      />
    </>
  );
}
