import { Link } from 'react-router-dom';
import FooterSection from '../components/FooterSection';
import SafetyNotice from '../components/SafetyNotice';
import { useTableData } from '../hooks/useTableData';
import { FALLBACK_FAQ, type FaqItem } from '../lib/faq';

export default function FaqPage() {
  const { data, loading } = useTableData<FaqItem>('faq_items', { orderBy: 'sort_order' });

  // Same rule as the map: an empty array is real data, null means the table is
  // unreachable. Either way the answers about who runs what must still appear,
  // so unlike the map this falls back in both cases rather than showing nothing.
  const items = loading ? [] : data?.length ? data : FALLBACK_FAQ;

  return (
    <>
      <section className="relative bg-forest-night pt-32 md:pt-40">
        <div className="mx-auto max-w-4xl px-6">
          <p className="reveal eyebrow text-amber">Usein kysytyt kysymykset</p>
          <h1 className="reveal delay-1 font-display mt-6 text-5xl leading-tight text-cream md:text-6xl">
            Näin osallistut<br />Roskapäivään.
          </h1>
          <p className="reveal delay-2 mt-8 max-w-2xl text-base leading-relaxed text-cream/75 md:text-lg">
            Roskapäivä järjestää Helsingin päätapahtuman yhdessä Cleaning Angelsin kanssa. Muualla
            Suomessa kartalle ilmoitetut roskaretket ja siivoustalkoot ovat paikallisten
            järjestäjien itsenäisesti järjestämiä tapahtumia.
          </p>

          <SafetyNotice className="reveal delay-3 mt-12" />
        </div>
      </section>

      <section className="relative bg-forest-night py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-6">
          {loading ? (
            <p className="text-sm text-cream/40">Ladataan…</p>
          ) : (
            <dl className="divide-y divide-cream/10 border-y border-cream/10">
              {items.map((item, i) => (
                <div key={item.id ?? i} className="py-8">
                  <dt className="font-display text-xl text-cream md:text-2xl">{item.question}</dt>
                  <dd className="mt-3 whitespace-pre-line text-base leading-relaxed text-cream/75">
                    {item.answer}
                  </dd>
                </div>
              ))}
            </dl>
          )}

          <div className="mt-14 border border-cream/15 bg-forest-deep/40 p-8">
            <p className="eyebrow text-amber">Ilmoita oma tapahtumasi</p>
            <p className="mt-4 text-base leading-relaxed text-cream/80">
              Järjestätkö oman roskaretken tai siivoustalkoot? Ilmoita se kartalle, niin muut
              näkevät missä kaikkialla Suomessa siivotaan.
            </p>
            <Link
              to="/5-9-2026#kartta"
              className="mt-6 inline-block rounded-full bg-amber px-7 py-3 text-xs font-semibold uppercase tracking-widest text-forest-night transition hover:bg-amber-light"
            >
              Ilmoita osallistumisesi
            </Link>
          </div>

          <p className="mt-10 text-xs leading-relaxed text-cream/40">
            Henkilötietojen käsittelystä kerrotaan{' '}
            <Link to="/tietosuoja" className="text-amber underline hover:text-amber-light">
              tietosuojaselosteessa
            </Link>
            .
          </p>
        </div>
      </section>

      <FooterSection />
    </>
  );
}
