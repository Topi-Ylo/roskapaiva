import { useState } from 'react';
import { Link } from 'react-router-dom';
import EventSection from '../components/EventSection';
import CommunityQuoteSection from '../components/CommunityQuoteSection';
import MainEventSection from '../components/MainEventSection';
import NationwideSection from '../components/nationwide/NationwideSection';
import SignupModal from '../components/nationwide/SignupModal';
import ClosingSection from '../components/ClosingSection';
import SafetyNotice from '../components/SafetyNotice';
import FooterSection from '../components/FooterSection';

export default function EventPage() {
  // The sign-up form is an overlay, opened from the hero and from the map
  // section, so the page state lives here rather than in either section.
  const [signupOpen, setSignupOpen] = useState(false);
  const openSignup = () => setSignupOpen(true);

  return (
    <>
      {/* Valtakunnallinen päivä edellä, päätapahtuma toisena */}
      <EventSection onSignup={openSignup} />
      <CommunityQuoteSection />
      <MainEventSection />
      <NationwideSection onSignup={openSignup} />

      {/* Straight after the map: whoever has just found an event to join is the
          person who needs this, and they will not open the sign-up form. */}
      <section className="relative bg-forest-night pb-20 md:pb-28">
        <div className="mx-auto max-w-4xl px-6">
          <SafetyNotice className="reveal" />
          <p className="reveal mt-5 text-xs leading-relaxed text-cream/45">
            Lisää vastauksia löydät{' '}
            <Link to="/ukk" className="text-amber underline hover:text-amber-light">
              usein kysytyistä kysymyksistä
            </Link>
            .
          </p>
        </div>
      </section>

      <ClosingSection />
      <FooterSection />
      <SignupModal open={signupOpen} onClose={() => setSignupOpen(false)} />
    </>
  );
}
