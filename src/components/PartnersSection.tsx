import { useTableData } from '../hooks/useTableData';

interface PartnerRow {
  id?: string;
  name: string;
  logo_url: string | null;
  url: string | null;
}

interface DisplayPartner {
  name: string;
  logo_url: string | null;
  url: string | null;
}

// Used only when Supabase is unreachable. Once the seeded rows are present
// these become irrelevant.
const FALLBACK: DisplayPartner[] = [
  { name: 'Partioaitta',                logo_url: null, url: null },
  { name: 'ResQ',                       logo_url: null, url: null },
  { name: 'K-Supermarket\nMustapekka', logo_url: null, url: null },
  { name: 'Taffel',                     logo_url: null, url: null },
  { name: 'The Bros\nBurgers',         logo_url: null, url: null },
  { name: 'Cleaning\nAngels',          logo_url: null, url: null },
  { name: 'Recser',                     logo_url: null, url: null },
  { name: 'Stara',                      logo_url: null, url: null },
];

function PartnerTile({ partner }: { partner: DisplayPartner }) {
  const inner = (
    <>
      {partner.logo_url && (
        <img
          src={partner.logo_url}
          alt={partner.name}
          loading="lazy"
          className="max-h-[72px] max-w-full object-contain opacity-60 grayscale transition duration-300 group-hover:opacity-100 group-hover:grayscale-0 md:max-h-[84px]"
        />
      )}
      <span className="text-center text-[11px] font-semibold uppercase tracking-wider leading-tight whitespace-pre-line text-cream/55 transition group-hover:text-cream">
        {partner.name}
      </span>
    </>
  );

  const tileClass =
    'group mx-2 flex h-32 w-40 flex-shrink-0 flex-col items-center justify-center gap-3 md:mx-3 md:h-36 md:w-48';

  if (partner.url) {
    return (
      <a
        href={partner.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={partner.name}
        className={tileClass}
      >
        {inner}
      </a>
    );
  }
  return (
    <div className={tileClass} aria-label={partner.name}>
      {inner}
    </div>
  );
}

export default function PartnersSection() {
  const { data, loading } = useTableData<PartnerRow>('partners');
  const partners: DisplayPartner[] =
    data && data.length > 0
      ? data.map((r) => ({ name: r.name, logo_url: r.logo_url, url: r.url }))
      : loading
      ? []
      : FALLBACK;

  // Duplicate the list so the CSS marquee can translate by -50% and land on
  // a seamless loop point. The list is also doubled visually so the row is
  // wide enough to scroll on any viewport.
  const loop = [...partners, ...partners];

  return (
    <section className="relative overflow-hidden bg-forest-deep pb-24 pt-8 md:pb-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="reveal border-t border-cream/10 pt-16">
          <p className="eyebrow text-center text-cream/45">
            Kumppaneita ja yhteistyökumppaneita
          </p>
        </div>
      </div>

      <div className="reveal relative mt-12 overflow-hidden md:mt-16">
        {/* Edge fade so logos slip in/out softly */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-forest-deep to-transparent md:w-32" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-forest-deep to-transparent md:w-32" />

        <div className="partner-marquee flex items-center" aria-hidden="false">
          {loop.map((p, i) => (
            <PartnerTile key={`${p.name}-${i}`} partner={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
