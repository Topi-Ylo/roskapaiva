import FooterSection from '../components/FooterSection';
import SafetyContent from '../components/SafetyContent';

/** Still a real route so a direct link or a search result lands somewhere.
 *  In-site links open the same content as an overlay instead. */
export default function SafetyPage() {
  return (
    <>
      <section className="relative bg-forest-night pb-20 pt-28 md:pb-28 md:pt-40">
        <div className="mx-auto max-w-3xl px-5 sm:px-6">
          <SafetyContent />
        </div>
      </section>
      <FooterSection />
    </>
  );
}
