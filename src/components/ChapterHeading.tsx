import { useEffect, useRef, useState, type ReactNode } from 'react';

interface Props {
  eyebrow: string;
  title: ReactNode;
  /** Render the title in italic Cormorant (a feeling/quote) instead of Playfair (a chapter title). */
  italic?: boolean;
  /** Animate the title word-by-word as it scrolls into view. Requires title to be a string. */
  wordReveal?: boolean;
}

function WordRevealText({ text }: { text: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3, rootMargin: '0px 0px -10% 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const words = text.split(' ');

  return (
    <span ref={ref}>
      {words.map((w, i) => (
        <span
          key={i}
          className="inline-block"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(24px)',
            transition:
              'opacity 0.9s cubic-bezier(0.22, 1, 0.36, 1), transform 0.9s cubic-bezier(0.22, 1, 0.36, 1)',
            transitionDelay: visible ? `${0.1 + i * 0.14}s` : '0s',
          }}
        >
          {w}
          {i < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </span>
  );
}

export default function ChapterHeading({
  eyebrow,
  title,
  italic = false,
  wordReveal = false,
}: Props) {
  const titleBase = italic
    ? 'font-quote mt-8 text-3xl italic leading-[1.15] text-amber-light md:text-5xl'
    : 'font-display mt-8 text-5xl text-cream md:text-7xl';

  // Word-by-word reveal handles its own visibility, so it skips the section-level .reveal class.
  const useWordReveal = wordReveal && typeof title === 'string';

  return (
    <section className="relative bg-forest-night py-24 md:py-32">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <p className="reveal eyebrow text-amber">{eyebrow}</p>
        {useWordReveal ? (
          <h2 className={titleBase}>
            <WordRevealText text={title as string} />
          </h2>
        ) : (
          <h2 className={`reveal delay-1 ${titleBase}`}>{title}</h2>
        )}
      </div>
    </section>
  );
}
