import { useState } from 'react';
import { useTableData } from '../hooks/useTableData';
import { FALLBACK_FAQ, type FaqItem } from '../lib/faq';

/**
 * The questions as expandable rows.
 *
 * Native <details>/<summary> rather than hand-rolled state: it opens without
 * JavaScript, the browser gives keyboard and screen-reader behaviour for free,
 * and in-page find still reaches text inside a closed row in current browsers.
 */
function Row({ item }: { item: FaqItem }) {
  return (
    <details className="group border-b border-cream/10">
      <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-5 text-left [&::-webkit-details-marker]:hidden">
        <span className="font-display text-lg text-cream transition group-hover:text-amber md:text-xl">
          {item.question}
        </span>
        <span
          aria-hidden="true"
          className="mt-1.5 shrink-0 text-amber transition-transform duration-200 group-open:rotate-45"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </span>
      </summary>
      <p className="whitespace-pre-line pb-6 pr-10 text-base leading-relaxed text-cream/75">
        {item.answer}
      </p>
    </details>
  );
}

export default function FaqAccordion() {
  const { data, loading } = useTableData<FaqItem>('faq_items', { orderBy: 'sort_order' });

  // Falls back on both an empty table and an unreachable one. Unlike the map,
  // where invented events would be a lie, missing answers about who is
  // responsible for what is the worse outcome.
  const items = loading ? [] : data?.length ? data : FALLBACK_FAQ;

  if (loading) return <p className="py-6 text-sm text-cream/40">Ladataan…</p>;

  return (
    <div className="border-t border-cream/10">
      {items.map((item, i) => (
        <Row key={item.id ?? i} item={item} />
      ))}
    </div>
  );
}

/** Kept beside the accordion so both surfaces phrase it identically. */
export function OrganizerDisclaimer({ onOpenSafety }: { onOpenSafety?: () => void }) {
  const [hover, setHover] = useState(false);
  return (
    <p className="text-sm leading-relaxed text-cream/70">
      Roskapäivä järjestää Helsingin päätapahtuman yhdessä Cleaning Angelsin kanssa. Muut kartan
      tapahtumat ovat paikallisten järjestäjien itsenäisesti järjestämiä, ja kukin järjestäjä
      vastaa oman tapahtumansa turvallisuudesta ja käytännön järjestelyistä.
      {onOpenSafety && (
        <>
          {' '}
          <button
            type="button"
            onClick={onOpenSafety}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            className={`underline ${hover ? 'text-amber-light' : 'text-amber'}`}
          >
            Lue turvallisuus- ja osallistumisohjeet
          </button>
          .
        </>
      )}
    </p>
  );
}
