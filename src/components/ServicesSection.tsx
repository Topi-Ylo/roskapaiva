import { useEffect, useRef, useState } from 'react';
import { useTableData } from '../hooks/useTableData';
import ServiceModal, { type ServiceModalData } from './ServiceModal';

interface ServiceRow {
  id?: string;
  num: string;
  title: string;
  description: string | null;
  modal_body: string | null;
  image_url: string | null;
  cta_label: string | null;
  cta_email: string | null;
  cta_subject: string | null;
}

interface ServiceCard {
  num: string;
  title: string;
  description: string | null;
  modalBody: string | null;
  imageUrl: string | null;
  ctaLabel: string | null;
  ctaEmail: string | null;
  ctaSubject: string | null;
}

const FALLBACK_SERVICES: ServiceCard[] = [
  {
    num: '01',
    title: 'Tapahtumat ja\nvirkistyspäivät',
    description: 'Yrityksille, kouluille ja organisaatioille: siivoustapahtumia ja virkistyspäiviä. Voi sisältää luennon, koulutuksen, roskaretken, siivoustapahtuman tai piknik-henkisen iltapäivän.',
    modalBody:
      'Järjestän yrityksille, kouluille ja organisaatioille räätälöityjä siivoustapahtumia ja virkistyspäiviä, joissa tehdään hyvää luonnolle ja vahvistetaan samalla yhteishenkeä.\n\nTyypillinen tapahtuma voi sisältää lyhyen, innostavan luennon roskaantumisesta, ohjatun roskaretken lähimaastoon tai kaupunkiin sekä rennon yhteisen lopetuksen, esimerkiksi piknik-henkisen iltapäivän tai afterwork-tyylisen koonnin.\n\nPyydä tarjous, niin keksitään yhdessä juuri teille sopiva kokonaisuus.',
    imageUrl: 'https://i.imgur.com/zOqWc48.jpeg',
    ctaLabel: 'Pyydä tarjous',
    ctaEmail: 'eino@roskapaiva.com',
    ctaSubject: 'Tapahtuma tai virkistyspäivä',
  },
  {
    num: '02',
    title: 'Luennot ja\nkoulutus',
    description: 'Luennoin luonnon roskaantumisesta, kiertotaloudesta ja muista ekoaiheista kouluilla ja yrityksissä. Räätälöin luennon sellaiseksi kuin asiakas toivoo.',
    modalBody:
      'Pidän luentoja ja koulutuksia luonnon roskaantumisesta, kiertotaloudesta ja kestävistä elämäntavoista. Käyn puhumassa kouluilla, yrityksissä ja tapahtumissa ympäri Suomen.\n\nLuennoissani yhdistyvät kahdeksan vuoden konkreettinen kokemus roskien parista, ymmärrettävät faktat ja Roskapäivän tunnistettava, rento tyyli.\n\nOta yhteyttä, niin keskustellaan teidän tarpeistanne.',
    imageUrl: 'https://i.imgur.com/QtoQezv.jpeg',
    ctaLabel: 'Pyydä tarjous',
    ctaEmail: 'eino@roskapaiva.com',
    ctaSubject: 'Luento tai koulutus',
  },
  {
    num: '03',
    title: 'Kaupalliset\nyhteistyöt',
    description: 'Toteutan kaupallisia yhteistöitä vastuullisten toimijoiden kanssa sosiaalisessa mediassa Instagram-kanavallani Roskapäivä.',
    modalBody:
      'Toteutan kaupallisia yhteistöitä vastuullisten toimijoiden kanssa sosiaalisessa mediassa, ensisijaisesti Instagram-kanavallani Roskapäivä.\n\nYhteistyömuodot voivat olla esimerkiksi tuote-esittelyitä, sponsoroituja postauksia, pitkäkestoisempia brändikumppanuuksia tai räätälöityjä kampanjoita.\n\nOle rohkeasti yhteydessä, niin keksitään yhdessä jotain siistiä.',
    imageUrl: 'https://i.imgur.com/XNXXKgS.jpeg',
    ctaLabel: 'Ota yhteyttä',
    ctaEmail: 'eino@roskapaiva.com',
    ctaSubject: 'Kaupallinen yhteistyö',
  },
  {
    num: '04',
    title: 'Yritysyhteistyö',
    description: 'Pitkäaikaisia kumppanuuksia ja kampanjoita yritysten kanssa. Sponsoriyhteistyöt, vastuullisuusviestintä ja yhteiset projektit ympäristön hyväksi.',
    modalBody:
      'Yritysyhteistyö Roskapäivän kanssa on enemmän kuin kertaluonteinen tapahtuma. Se on pitkäjänteinen kumppanuus ympäristöteon ympärillä.\n\nTyypillisiä yhteistyömuotoja ovat sponsoriyhteistyöt vuotuiseen Roskapäivään, työntekijöille suunnatut virkistyspäivät, vastuullisuusviestinnän tukeminen ja yhteiset kampanjat sosiaalisessa mediassa.\n\nOle rohkeasti yhteydessä, niin keksitään yhdessä jotain merkityksellistä.',
    imageUrl: null,
    ctaLabel: 'Aloitetaan keskustelu',
    ctaEmail: 'eino@roskapaiva.com',
    ctaSubject: 'Yritysyhteistyö',
  },
  {
    num: '05',
    title: 'Some\nyhteistyö',
    description: 'Sosiaalisen median yhteistöitä Instagramissa ja TikTokissa. Brändilähetykset, sisällöntuotanto ja kampanjat, jotka tavoittavat sitoutuneen yleisön.',
    modalBody:
      'Roskapäivän sosiaalisen median kanavat (Instagram @roskapaiva ja TikTok) tavoittavat aktiivisen, ympäristötietoisen yleisön ympäri Suomen.\n\nSome-yhteistyömuotoja ovat esimerkiksi tuote-esittelyt, sponsoroidut postaukset, pitkäkestoiset brändikumppanuudet ja räätälöidyt kampanjat.\n\nPyydä mediakortti, niin lähetän tarkemmat tiedot tavoittavuudesta ja yhteistyömahdollisuuksista.',
    imageUrl: null,
    ctaLabel: 'Pyydä mediakortti',
    ctaEmail: 'eino@roskapaiva.com',
    ctaSubject: 'Some yhteistyö',
  },
  {
    num: '06',
    title: 'Koulutus- ja\noppimateriaalit',
    description: 'Räätälöityjä oppimateriaaleja kouluille ja oppilaitoksille luonnon roskaantumisesta, kiertotaloudesta ja kestävistä elämäntavoista.',
    modalBody:
      'Tarjoan kouluille ja oppilaitoksille valmiita ja räätälöitäviä oppimateriaaleja luonnon roskaantumisesta, kiertotaloudesta ja kestävistä elämäntavoista.\n\nMateriaalipakettiin voi sisältyä esimerkiksi tehtäväkortteja, opettajan opas, valmiit diasarjat, videosisältöjä ja toiminnalliset harjoitukset.\n\nOta yhteyttä, niin räätälöidään juuri teille sopiva paketti.',
    imageUrl: null,
    ctaLabel: 'Tilaa materiaalit',
    ctaEmail: 'eino@roskapaiva.com',
    ctaSubject: 'Koulutus- ja oppimateriaalit',
  },
];

const ChevronLeft = () => (
  <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
    <path d="M10 2L4 8l6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const ChevronRight = () => (
  <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
    <path d="M6 2l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const ArrowRight = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
    <path d="M3 8h10m0 0L8 3m5 5l-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export default function ServicesSection() {
  const { data: rows, loading } = useTableData<ServiceRow>('services');

  // While the DB is still loading, render no cards instead of the FALLBACK.
  // The earlier behaviour caused the old image to flicker before the
  // freshly-saved one appeared. FALLBACK is only used when the DB has actually
  // returned empty (i.e. Supabase isn't configured or has no rows).
  const services: ServiceCard[] = rows && rows.length > 0
    ? rows.map((r) => ({
        num: r.num,
        title: r.title,
        description: r.description,
        modalBody: r.modal_body,
        imageUrl: r.image_url,
        ctaLabel: r.cta_label,
        ctaEmail: r.cta_email,
        ctaSubject: r.cta_subject,
      }))
    : loading
    ? []
    : FALLBACK_SERVICES;

  const [openService, setOpenService] = useState<ServiceModalData | null>(null);
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  // Keep the prev/next button enabled-state in sync with the scroll position.
  // Re-evaluated on scroll, on resize, and whenever the card list changes.
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const update = () => {
      const max = el.scrollWidth - el.clientWidth;
      setCanScrollPrev(el.scrollLeft > 4);
      setCanScrollNext(el.scrollLeft < max - 4);
    };
    update();
    el.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      el.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [services.length]);

  const scrollByCards = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    // Advance roughly one card width (the first card child) including the gap.
    const first = el.querySelector('[data-service-card]') as HTMLElement | null;
    const step = first ? first.offsetWidth + 20 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * step, behavior: 'smooth' });
  };

  const openModal = (s: ServiceCard) => {
    setOpenService({
      num: s.num,
      title: s.title,
      description: s.description,
      modalBody: s.modalBody,
      imageUrl: s.imageUrl,
      ctaLabel: s.ctaLabel,
      ctaEmail: s.ctaEmail,
      ctaSubject: s.ctaSubject,
    });
  };

  return (
    <section id="palvelut" className="relative overflow-hidden bg-forest-deep py-20 md:py-40">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(19, 36, 26, 0.82), rgba(19, 36, 26, 0.94)), url('https://i.imgur.com/gjC4yE4.jpeg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div className="relative mx-auto max-w-7xl px-6">

        <div className="reveal max-w-3xl">
          <p className="eyebrow text-amber">Palvelut</p>
          <h2 className="font-display mt-6 text-5xl text-cream md:text-7xl lg:text-8xl">
            Tehdään yhdessä<br />Siistejä juttuja.
          </h2>
          <p className="mt-8 text-base leading-relaxed text-cream/75 md:text-lg">
            Työskentelen kaikenlaisissa luonnon roskaantumiseen liittyvissä projekteissa ja hankkeissa. Ota rohkeasti yhteyttä ja katsotaan mitä siistiä saadaan aikaan.
          </p>
        </div>

        {/* Carousel header: title + prev/next controls. Controls are hidden on
            mobile, where the row uses native swipe + scroll-snap. */}
        <div className="mt-16 flex items-end justify-between gap-6">
          <p className="font-display text-2xl text-cream/80 md:text-3xl">
            <span className="text-amber">{services.length || 6}</span> tapaa tehdä yhteistyötä
          </p>
          <div className="hidden gap-3 md:flex">
            <button
              type="button"
              onClick={() => scrollByCards(-1)}
              disabled={!canScrollPrev}
              aria-label="Edellinen"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-cream/30 text-cream transition hover:border-amber hover:text-amber disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-cream/30 disabled:hover:text-cream"
            >
              <ChevronLeft />
            </button>
            <button
              type="button"
              onClick={() => scrollByCards(1)}
              disabled={!canScrollNext}
              aria-label="Seuraava"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-cream/30 text-cream transition hover:border-amber hover:text-amber disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-cream/30 disabled:hover:text-cream"
            >
              <ChevronRight />
            </button>
          </div>
        </div>

        {/* Horizontal scroll-snap carousel. Card widths are responsive so 1
            shows on mobile (with peek), ~2 on tablet, ~3 on desktop with peek
            of the next. The negative margin + matching padding lets the row
            bleed to the screen edge on mobile while still snapping cleanly. */}
        <div
          ref={scrollerRef}
          className="reveal mt-8 -mx-6 flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-4 no-scrollbar scroll-pl-6 scroll-pr-6"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {services.map((s, i) => (
            <article
              key={s.num + s.title}
              data-service-card
              className={`group relative flex flex-shrink-0 snap-start flex-col overflow-hidden border border-cream/10 bg-forest-night/60 transition hover:border-amber/40 ${i === 0 ? '' : i === 1 ? 'delay-1' : i === 2 ? 'delay-2' : i === 3 ? 'delay-3' : 'delay-4'} w-[80vw] sm:w-[60vw] md:w-[48vw] lg:w-[24rem]`}
            >
              <button
                type="button"
                onClick={() => openModal(s)}
                aria-label={`Lue lisää: ${s.title.replace(/\\n/g, ' ').replace(/\n/g, ' ')}`}
                className="flex flex-1 flex-col text-left"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-forest-night">
                  {s.imageUrl ? (
                    <img
                      src={s.imageUrl}
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div
                      className="absolute inset-0 transition duration-700 group-hover:scale-105"
                      style={{
                        background:
                          'radial-gradient(circle at 30% 30%, rgba(201,162,39,0.18), transparent 60%), linear-gradient(135deg, #13241A 0%, #0B160F 100%)',
                      }}
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-forest-night/90 via-forest-night/30 to-transparent" />
                  <span className="absolute left-6 top-6 font-display text-3xl text-amber">{s.num}</span>
                </div>
                <div className="flex flex-1 flex-col p-8 md:p-10">
                  <h3 className="font-display text-3xl text-cream md:text-4xl whitespace-pre-line">{s.title}</h3>
                  {s.description && (
                    <p className="mt-5 flex-1 text-cream/75 leading-relaxed">{s.description}</p>
                  )}
                  <span className="mt-8 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-amber transition group-hover:text-amber-light">
                    Lue lisää
                    <ArrowRight />
                  </span>
                </div>
              </button>
            </article>
          ))}
        </div>

        {/* Mobile hint: "swipe" affordance below the row */}
        <p className="mt-2 text-center text-xs uppercase tracking-widest text-cream/40 md:hidden">
          Pyyhkäise sivulle →
        </p>

      </div>

      <ServiceModal
        open={openService !== null}
        service={openService}
        onClose={() => setOpenService(null)}
      />
    </section>
  );
}
