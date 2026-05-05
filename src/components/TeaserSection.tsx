import TextType from './TextType';

export default function TeaserSection() {
  return (
    <section className="relative bg-forest-night py-32 md:py-40">
      <div className="mx-auto max-w-5xl px-6 text-center">
        <div className="flex min-h-[5rem] items-start justify-center md:min-h-[7.5rem] lg:min-h-[10rem]">
          <TextType
          as="p"
          text={[
            'Ehkä ensi vuonna Roskapäivä onkin 2.5.2027 ja pidetään yhdessä Suomi siistinä.',
            'Roskapäivä 2.5.2027?',
          ]}
          typingSpeed={50}
          variableSpeed={{ min: 40, max: 80 }}
          deletingSpeed={20}
          pauseDuration={1800}
          loop={false}
          showCursor
          cursorCharacter="_"
          cursorBlinkDuration={0.5}
          startOnVisible
          className="font-display text-2xl italic font-light leading-relaxed text-cream md:text-4xl lg:text-5xl"
          />
        </div>
      </div>
    </section>
  );
}
