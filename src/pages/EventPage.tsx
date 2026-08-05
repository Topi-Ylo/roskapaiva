import { useState } from 'react';
import EventSection from '../components/EventSection';
import MainEventSection from '../components/MainEventSection';
import NationwideSection from '../components/nationwide/NationwideSection';
import SignupModal from '../components/nationwide/SignupModal';
import ClosingSection from '../components/ClosingSection';
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
      <MainEventSection />
      <NationwideSection onSignup={openSignup} />
      <ClosingSection />
      <FooterSection />
      <SignupModal open={signupOpen} onClose={() => setSignupOpen(false)} />
    </>
  );
}
