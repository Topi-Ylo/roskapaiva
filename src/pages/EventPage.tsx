import EventSection from '../components/EventSection';
import MainEventSection from '../components/MainEventSection';
import NationwideSection from '../components/nationwide/NationwideSection';
import ClosingSection from '../components/ClosingSection';
import FooterSection from '../components/FooterSection';

export default function EventPage() {
  return (
    <>
      {/* Valtakunnallinen päivä edellä, päätapahtuma toisena */}
      <EventSection />
      <MainEventSection />
      <NationwideSection />
      <ClosingSection />
      <FooterSection />
    </>
  );
}
