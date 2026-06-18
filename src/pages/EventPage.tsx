import EventSection from '../components/EventSection';
import EventDetailsSection from '../components/EventDetailsSection';
import PastEventsSection from '../components/PastEventsSection';
import FooterSection from '../components/FooterSection';

export default function EventPage() {
  return (
    <>
      <EventSection />
      <EventDetailsSection />
      <PastEventsSection />
      <FooterSection />
    </>
  );
}
