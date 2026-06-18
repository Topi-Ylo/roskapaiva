import ServicesSection from '../components/ServicesSection';
import VolunteerCTASection from '../components/VolunteerCTASection';
import MediaLibrarySection from '../components/MediaLibrarySection';
import PartnersSection from '../components/PartnersSection';
import ContactSection from '../components/ContactSection';
import FooterSection from '../components/FooterSection';

export default function PalvelutPage() {
  return (
    <>
      <ServicesSection />
      {/* Volunteer recruitment band — slots between paid Services
          and the Some-yhteistyö showcase so it reads as a separate
          ask aimed at individuals (vs the Services cards which
          pitch organisations). */}
      <VolunteerCTASection />
      <MediaLibrarySection />
      <PartnersSection />
      <ContactSection />
      <FooterSection />
    </>
  );
}
