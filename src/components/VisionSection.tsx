import { useEffect, useRef, useState } from 'react';
// Title typewriter is now scroll-driven; no TextType needed here.
import './TextType.css';
import { useIsCoarsePointer } from '../hooks/useIsCoarsePointer';

const VIDEO_URL =
  'https://video.gumlet.io/689843b7ce30732b0c4db420/69f8db00b73ee3afb2a27927/download.mp4';

interface Step {
  text: string;
  /** scroll progress at which fade-in begins */
  fadeInStart: number;
  /** scroll progress at which the step is fully visible */
  fadeInEnd: number;
  /** scroll progress at which fade-out begins */
  fadeOutStart: number;
  /** scroll progress at which the step is fully gone (use 2 to hold) */
  fadeOutEnd: number;
  variant: 'title' | 'narration' | 'tagline';
}

// Pacing across the section's 0..1 progress:
//   0.00 - 0.25 : Hero exiting on top, Vision dark behind.
//   0.25 - 0.30 : Video fades in.
//   0.27 - 0.42 : Title (typewriter) fades in / types / holds.
//   0.42 - 0.46 : Title fades out.
//   0.46 - 0.59 : Narration 1 fades in / holds / fades out.
//   0.59 - 0.72 : Narration 2.
//   0.72 - 0.85 : Narration 3.
//   0.85 - 0.95 : Narration 4 (compressed slightly).
//   0.95 - 1.00 : Climax tagline fades in and is held.
const STEPS: Step[] = [
  {
    text: 'Mutta sitä ennen, haluan kertoa miksi roskattomuus on tärkeää.',
    fadeInStart: 0.27, fadeInEnd: 0.32, fadeOutStart: 0.42, fadeOutEnd: 0.46,
    variant: 'title',
  },
  {
    text: 'Joka päivä Suomessa päätyy luontoon tuhansia kiloja roskaa, jota kukaan ei ole tarkoittanut sinne jättää.',
    fadeInStart: 0.46, fadeInEnd: 0.50, fadeOutStart: 0.55, fadeOutEnd: 0.59,
    variant: 'narration',
  },
  {
    text: 'Roskapäivän ydinajatus on ettei muutos vaadi täydellisyyttä, vaan pieniä tekoja ja asenteiden muutosta, vähentämällä ja ymmärtämällä.',
    fadeInStart: 0.59, fadeInEnd: 0.63, fadeOutStart: 0.68, fadeOutEnd: 0.72,
    variant: 'narration',
  },
  {
    text: 'Roskattomuus tuntuu hyvältä meille kaikille, me kaikki tiedämme sen ja yhdessä voimme edesauttaa.',
    fadeInStart: 0.72, fadeInEnd: 0.76, fadeOutStart: 0.81, fadeOutEnd: 0.85,
    variant: 'narration',
  },
  {
    text: 'Tavoitteemme on tehdä roskattomuudesta valtakunnallinen ilmiö, johon jokainen voi osallistua omalla tavallaan.',
    fadeInStart: 0.85, fadeInEnd: 0.88, fadeOutStart: 0.92, fadeOutEnd: 0.95,
    variant: 'narration',
  },
  {
    text: 'Jokainen päivä voi olla roskapäivä.',
    fadeInStart: 0.95, fadeInEnd: 0.98, fadeOutStart: 2, fadeOutEnd: 2,
    variant: 'tagline',
  },
];

const clamp = (v: number, min = 0, max = 1) => Math.max(min, Math.min(max, v));

function stepOpacity(step: Step, progress: number): number {
  if (progress < step.fadeInStart) return 0;
  if (progress < step.fadeInEnd) {
    const span = step.fadeInEnd - step.fadeInStart;
    return span <= 0 ? 1 : (progress - step.fadeInStart) / span;
  }
  if (progress < step.fadeOutStart) return 1;
  if (progress < step.fadeOutEnd) {
    const span = step.fadeOutEnd - step.fadeOutStart;
    return span <= 0 ? 0 : 1 - (progress - step.fadeOutStart) / span;
  }
  return 0;
}

export default function VisionSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const targetTimeRef = useRef(0);
  const currentTimeRef = useRef(0);
  const [progress, setProgress] = useState(0);
  const isMobile = useIsCoarsePointer();
  // Track scroll progress through this section.
  useEffect(() => {
    let ticking = false;
    let last = 0;
    const compute = () => {
      const section = sectionRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const scrollable = section.offsetHeight - window.innerHeight;
      if (scrollable <= 0) {
        if (last !== 0) {
          last = 0;
          setProgress(0);
        }
        return;
      }
      const scrolled = -rect.top;
      const p = clamp(scrolled / scrollable);
      if (Math.abs(p - last) > 0.0005) {
        last = p;
        setProgress(p);
      }
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        compute();
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    compute();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  // Video target follows the post-transition active progress.
  const activeProgress = clamp((progress - 0.25) / 0.75);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !video.duration) return;
    targetTimeRef.current = activeProgress * video.duration;
  }, [activeProgress]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isMobile) {
      // Mobile: autoplay on loop instead of scrubbing currentTime — same reason as Hero.
      video.loop = true;
      video.muted = true;
      const tryPlay = () => {
        video.play().catch(() => {
          /* autoplay denied */
        });
      };
      const onMeta = () => tryPlay();
      video.addEventListener('loadedmetadata', onMeta);
      if (video.readyState >= 1) tryPlay();
      return () => {
        video.removeEventListener('loadedmetadata', onMeta);
        video.pause();
      };
    }

    const onMeta = () => {
      video.pause();
      targetTimeRef.current = activeProgress * video.duration;
    };
    video.addEventListener('loadedmetadata', onMeta);
    video.pause();

    let rafId = 0;
    const tick = () => {
      if (video.duration && !video.seeking) {
        const diff = targetTimeRef.current - currentTimeRef.current;
        if (Math.abs(diff) < 0.0008) {
          currentTimeRef.current = targetTimeRef.current;
        } else {
          currentTimeRef.current += diff * 0.18;
        }
        try {
          video.currentTime = currentTimeRef.current;
        } catch {
          /* ignore */
        }
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafId);
      video.removeEventListener('loadedmetadata', onMeta);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile]);

  // 20% baseline so the video is already faintly visible while the Hero is exiting,
  // ramping to 100% over the same 5% scroll window after the transition.
  const videoOpacity = 0.2 + clamp((progress - 0.25) / 0.05) * 0.8;

  return (
    <section
      ref={sectionRef}
      id="visio"
      className={`relative z-10 ${isMobile ? '' : '-mt-[100vh]'}`}
      style={{ height: '500vh' }}
    >
      <div className="sticky top-0 h-viewport w-full overflow-hidden bg-forest-night">
        <video
          ref={videoRef}
          src={VIDEO_URL}
          muted
          playsInline
          preload="auto"
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore — non-standard but harmless on browsers that ignore it
          disableRemotePlayback
          className="absolute inset-0 h-full w-full object-cover"
          style={{ opacity: videoOpacity, transition: 'none' }}
        />
        <div
          className="pointer-events-none absolute inset-0 bg-forest-night/55"
          style={{ opacity: videoOpacity }}
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(11,22,15,0) 35%, rgba(11,22,15,0.7) 100%)',
            opacity: videoOpacity,
          }}
        />

        {STEPS.map((step, i) => {
          const opacity = stepOpacity(step, progress);

          if (step.variant === 'title') {
            // Typewriter is scroll-driven: chars appear progressively as the user
            // scrolls through the title's visible window (fadeInStart -> fadeOutStart).
            const typeRange = step.fadeOutStart - step.fadeInStart;
            const typeProgress = typeRange > 0
              ? clamp((progress - step.fadeInStart) / typeRange)
              : 0;
            const visibleCharCount = Math.ceil(step.text.length * typeProgress);
            const visibleText = step.text.slice(0, visibleCharCount);
            return (
              <div
                key={i}
                className="pointer-events-none absolute inset-0 flex items-center justify-center px-6 text-center"
                style={{ opacity, transition: 'none' }}
              >
                <p className="font-display mx-auto max-w-4xl text-4xl italic leading-tight text-cream md:text-6xl lg:text-7xl">
                  {visibleText}
                  <span className="text-type__cursor" style={{ animationDuration: '1s' }}>_</span>
                </p>
              </div>
            );
          }

          if (step.variant === 'narration') {
            return (
              <div
                key={i}
                className="pointer-events-none absolute inset-0 flex items-center justify-center px-6 text-center"
                style={{ opacity, transition: 'none' }}
              >
                <p className="font-display mx-auto max-w-3xl text-2xl font-light leading-relaxed text-cream md:text-4xl">
                  {step.text}
                </p>
              </div>
            );
          }

          // tagline (climax) — matches the Oispa siistimpää title's font and rhythm,
          // slightly smaller. "Jokainen päivä voi olla" in cream, "Roskapäivä." in amber.
          return (
            <div
              key={i}
              className="pointer-events-none absolute inset-0 flex items-center justify-center px-6 text-center"
              style={{ opacity, transition: 'none' }}
            >
              <p className="font-display text-[8.5vw] leading-[0.92] text-cream sm:text-[7vw] md:text-[5.5rem] lg:text-[6rem]">
                Jokainen päivä voi olla<br />
                <span className="italic text-amber-light">Roskapäivä.</span>
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
