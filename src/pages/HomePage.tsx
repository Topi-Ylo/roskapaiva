import Hero from '../components/Hero';
import VisionSection from '../components/VisionSection';
import ChapterHeading from '../components/ChapterHeading';
import StorySection from '../components/StorySection';
import DocumentarySection from '../components/DocumentarySection';
import VappuSection from '../components/VappuSection';
import TeaserSection from '../components/TeaserSection';
import FooterSection from '../components/FooterSection';

export default function HomePage() {
  return (
    <>
      <Hero />
      <VisionSection />
      <ChapterHeading
        eyebrow="Tarina"
        title={<>Tämä on minun ja<br />Roskapäivän taival.</>}
      />
      <StorySection />
      <DocumentarySection />
      <ChapterHeading
        eyebrow="Vappu 2026"
        italic
        wordReveal
        title="Se vaati 88,000€ siivouslaskun, jotta huomattiin että Suomi välittää."
      />
      <VappuSection />
      <TeaserSection />
      <FooterSection />
    </>
  );
}
