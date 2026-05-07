import { useTableData } from '../hooks/useTableData';

interface ServiceRow {
  id?: string;
  num: string;
  title: string;
  description: string | null;
  image_url: string | null;
  cta_label: string | null;
  cta_email: string | null;
  cta_subject: string | null;
}

const FALLBACK_SERVICES = [
  {
    num: '01',
    img: 'https://i.imgur.com/zOqWc48.jpeg',
    title: 'Tapahtumat ja\nvirkistyspäivät',
    desc: 'Yrityksille, kouluille ja organisaatioille: siivoustapahtumia ja virkistyspäiviä. Voi sisältää luennon, koulutuksen, roskaretken, siivoustapahtuman tai piknik-henkisen iltapäivän.',
    mailto: 'eino@roskapaiva.com?subject=Tapahtuma%20tai%20virkistyspäivä',
    cta: 'Pyydä tarjous',
    delay: '',
  },
  {
    num: '02',
    img: 'https://i.imgur.com/QtoQezv.jpeg',
    title: 'Luennot ja\nkoulutus',
    desc: 'Luennoin luonnon roskaantumisesta, kiertotaloudesta ja muista ekoaiheista kouluilla ja yrityksissä. Räätälöin luennon sellaiseksi kuin asiakas toivoo, pitäen Roskapäivän rennon tyylin yllä.',
    mailto: 'eino@roskapaiva.com?subject=Luento%20tai%20koulutus',
    cta: 'Pyydä tarjous',
    delay: 'delay-1',
  },
  {
    num: '03',
    img: 'https://i.imgur.com/XNXXKgS.jpeg',
    title: 'Kaupalliset\nyhteistyöt',
    desc: 'Toteutan kaupallisia yhteistöitä vastuullisten toimijoiden kanssa sosiaalisessa mediassa Instagram-kanavallani Roskapäivä. Ole rohkeasti yhteydessä ja keksitään yhdessä jotain siistiä.',
    mailto: 'eino@roskapaiva.com?subject=Kaupallinen%20yhteistyö',
    cta: 'Ota yhteyttä',
    delay: 'delay-2',
  },
];

const ArrowRight = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
    <path d="M3 8h10m0 0L8 3m5 5l-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export default function ServicesSection() {
  const { data: rows } = useTableData<ServiceRow>('services');
  const services = rows && rows.length > 0
    ? rows.map((r, i) => ({
        num: r.num,
        img: r.image_url ?? '',
        title: r.title,
        desc: r.description ?? '',
        mailto: `${r.cta_email ?? ''}${r.cta_subject ? '?subject=' + encodeURIComponent(r.cta_subject) : ''}`,
        cta: r.cta_label ?? 'Ota yhteyttä',
        delay: i === 0 ? '' : `delay-${i}`,
      }))
    : FALLBACK_SERVICES;

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

        <div className="mt-20 grid gap-6 md:grid-cols-3">
          {services.map((s) => (
            <article key={s.num} className={`reveal ${s.delay} group flex flex-col overflow-hidden border border-cream/10 bg-forest-night/60 transition hover:border-amber/40`}>
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={s.img}
                  alt={s.title.replace('\n', ' ')}
                  className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest-night/90 via-forest-night/30 to-transparent" />
                <span className="absolute left-6 top-6 font-display text-3xl text-amber">{s.num}</span>
              </div>
              <div className="flex flex-1 flex-col p-8 md:p-10">
                <h3 className="font-display text-3xl text-cream md:text-4xl whitespace-pre-line">{s.title}</h3>
                <p className="mt-5 flex-1 text-cream/75 leading-relaxed">{s.desc}</p>
                <a
                  href={`mailto:${s.mailto}`}
                  className="mt-8 inline-flex items-center gap-2 self-start text-sm font-semibold uppercase tracking-widest text-amber transition hover:text-amber-light"
                >
                  {s.cta}
                  <ArrowRight />
                </a>
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
}
