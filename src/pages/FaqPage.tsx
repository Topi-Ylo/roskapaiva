import FooterSection from '../components/FooterSection';
import FaqContent from '../components/FaqContent';

/** Still a real route so a direct link or a search result lands somewhere.
 *  In-site links open the same content as an overlay instead. */
export default function FaqPage() {
  return (
    <>
      <section className="relative bg-forest-night pb-20 pt-32 md:pb-28 md:pt-40">
        <div className="mx-auto max-w-4xl px-6">
          <FaqContent />
        </div>
      </section>
      <FooterSection />
    </>
  );
}
