import { useTableData } from '../hooks/useTableData';

interface PartnerRow {
  id?: string;
  name: string;
  logo_url: string | null;
}

const FALLBACK = [
  'Partioaitta', 'ResQ', 'K-Supermarket\nMustapekka', 'Taffel',
  'The Bros\nBurgers', 'Cleaning\nAngels', 'Recser', 'Stara',
];

export default function PartnersSection() {
  const { data } = useTableData<PartnerRow>('partners');
  const partners = data && data.length > 0 ? data.map((r) => r.name) : FALLBACK;

  return (
    <section className="relative bg-forest-deep pb-24 pt-8 md:pb-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="reveal border-t border-cream/10 pt-16">
          <p className="eyebrow text-center text-cream/45">Kumppaneita ja yhteistyökumppaneita</p>
          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-8">
            {partners.map((p, i) => (
              <div key={i} className="partner-tile flex aspect-[3/2] items-center justify-center text-center text-[10px] font-semibold uppercase tracking-wider leading-tight whitespace-pre-line">
                {p}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
