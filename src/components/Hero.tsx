import { useEffect, useRef } from 'react';
import { useHeroProgress } from '../hooks/useHeroProgress';
import { useIsCoarsePointer } from '../hooks/useIsCoarsePointer';

const VIDEO_URL =
  'https://video.gumlet.io/689843b7ce30732b0c4db420/69f89f6bb73ee3afb29be580/download.mp4';

// Placeholder portraits — swap for real Eino photos later.
const EINO_IMG_1 = 'https://i.imgur.com/Mf4XgjV.jpeg';
const EINO_IMG_2 = 'https://i.imgur.com/FSNLVUN.jpeg';

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const targetTimeRef = useRef(0);
  const currentTimeRef = useRef(0);
  const progress = useHeroProgress();
  const isMobile = useIsCoarsePointer();

  // The section is now 400vh tall. The original hero scrub plays out across the first
  // half of the section (heroProgress 0->1), and the Eino interlude takes the second.
  const heroProgress = Math.min(1, progress * 2);
  const panelProgress = Math.max(0, Math.min(1, (progress - 0.5) * 2));

  // Update the target playhead from heroProgress whenever it changes.
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !video.duration) return;
    targetTimeRef.current = heroProgress * video.duration;
  }, [heroProgress]);

  // Drive the video. On desktop we scrub currentTime from scroll progress; on
  // touch-first devices that's too jittery, so we autoplay on a loop instead.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isMobile) {
      video.loop = true;
      video.muted = true;
      const tryPlay = () => {
        video.play().catch(() => {
          /* autoplay denied; user gesture will start it */
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

    // Desktop scrubbing path
    const onMeta = () => {
      video.pause();
      targetTimeRef.current = heroProgress * video.duration;
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
          // some browsers throw if seeking before metadata is ready; ignore
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

  // Hero text + nav reveal between heroProgress 50% and 75%.
  const reveal = Math.max(0, Math.min(1, (heroProgress - 0.5) / 0.25));
  const textOpacity = reveal;
  const textTranslateY = (1 - reveal) * 24;
  // The big white subtitle reveals after the rest of the title settles,
  // and finishes before the Eino panel begins sliding in (panel starts at progress 0.5
  // = heroProgress 1.0; subtitle finishes at heroProgress 0.95 = progress 0.475).
  // For visual variety it slides in horizontally from the left instead of fading up.
  const subtitleReveal = Math.max(0, Math.min(1, (heroProgress - 0.75) / 0.20));
  const subtitleSlideX = (1 - subtitleReveal) * -3;

  // Overlay: heroProgress 70% to 100%, peaking at 65% darkening.
  const overlayReveal = Math.max(0, Math.min(1, (heroProgress - 0.7) / 0.3));
  const overlayOpacity = overlayReveal * 0.65;

  // Scroll hint: fades out within the first ~12% of the hero scrub.
  const hintOpacity = Math.max(0, 1 - heroProgress * 8);

  // Eino panel (second act):
  //   0     -> 0.20 : slide in from the right
  //   0.20  -> 0.45 : beat 1 holds
  //   0.45  -> 0.65 : crossfade to beat 2
  //   0.65  -> 1.00 : beat 2 holds (then sticky releases and hero scrolls up)
  const panelSlideIn = Math.max(0, Math.min(1, panelProgress / 0.2));
  const beatCross = Math.max(0, Math.min(1, (panelProgress - 0.45) / 0.2));
  const panelTranslateX = (1 - panelSlideIn) * 100;

  return (
    <section id="hero" className="relative z-20" style={{ height: '400vh' }}>
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
        />

        <div
          className="pointer-events-none absolute inset-0 bg-forest-night"
          style={{ opacity: overlayOpacity, transition: 'none' }}
        />

        <div
          className="relative z-10 flex h-full flex-col justify-end px-6 pb-[calc(6rem+10vh)] md:pb-[calc(8rem+10vh)]"
          style={{
            opacity: textOpacity,
            transform: `translate3d(0, ${textTranslateY}px, 0)`,
            transition: 'none',
          }}
        >
          <div className="mx-auto w-full max-w-7xl">
            <p className="eyebrow text-amber">Helsinki · Est. 2018</p>
            <h1 className="font-display mt-6 text-[18vw] leading-[0.92] text-cream sm:text-[15vw] md:text-[12rem] lg:text-[14rem]">
              Ois<br /><em className="italic font-medium text-amber-light">siistimpää,</em>
            </h1>
            <p
              className="font-quote mt-3 text-center text-[9vw] italic leading-[0.95] text-white sm:text-[7.5vw] md:text-[6rem] lg:text-[7rem]"
              style={{
                opacity: subtitleReveal,
                transform: `translate3d(${subtitleSlideX}vw, 0, 0)`,
                transition: 'none',
              }}
            >
              Jos ois siistimpää.
            </p>
            <p className="mt-10 max-w-md text-base font-light leading-relaxed text-cream/80 md:text-lg">
              Liike puhtaamman ympäristön puolesta.
            </p>

            <div className="mt-12 flex items-center gap-8">
              <a href="#vappu" className="ghost-cta rounded-full px-7 py-3 text-xs font-semibold uppercase tracking-widest text-cream">
                Tutustu tarinaan
              </a>
              <div className="flex items-center gap-2">
                <span className="dot active" />
                <span className="dot" />
                <span className="dot" />
              </div>
            </div>
          </div>
        </div>

        <div
          className="absolute bottom-8 right-6 z-10 hidden text-cream/50 md:block"
          style={{ opacity: textOpacity, transition: 'none' }}
        >
          <div className="flex flex-col items-center gap-3">
            <div className="h-12 w-px bg-cream/30" />
            <span className="eyebrow" style={{ writingMode: 'vertical-rl' }}>Scroll</span>
          </div>
        </div>

        <div
          className="pointer-events-none absolute bottom-10 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-6 md:bottom-14 md:gap-8"
          style={{ opacity: hintOpacity, transition: 'none' }}
        >
          <svg
            className="scroll-bounce"
            width="64"
            height="64"
            viewBox="0 0 48 48"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M12 18l12 12 12-12"
              stroke="#000"
              strokeWidth="11"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 18l12 12 12-12"
              stroke="#fff"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Eino interlude — right-anchored card that's 80vw on phones and a 28vw strip on desktop. */}
        <aside
          className="absolute right-0 top-[76px] bottom-0 z-30 w-[80vw] md:w-[28vw] md:min-w-[260px] md:max-w-[440px]"
          style={{
            transform: `translate3d(${panelTranslateX}%, 0, 0)`,
            transition: 'none',
          }}
          aria-hidden={panelSlideIn < 0.5}
        >
          <div className="relative h-full w-full overflow-hidden border-l border-cream/15 bg-forest-deep shadow-[-24px_0_60px_rgba(0,0,0,0.5)]">
            {/* Beat 1 */}
            <div
              className="absolute inset-0"
              style={{ opacity: 1 - beatCross, transition: 'none' }}
            >
              <img
                src={EINO_IMG_1}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest-night via-forest-night/40 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 px-6 py-8 md:px-8 md:py-10">
                <p className="font-display text-3xl leading-[1.05] text-cream md:text-4xl">
                  Moi, mä olen Eino, roskapäivän perustaja.
                </p>
              </div>
            </div>

            {/* Beat 2 */}
            <div
              className="absolute inset-0"
              style={{ opacity: beatCross, transition: 'none' }}
            >
              <img
                src={EINO_IMG_2}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest-night via-forest-night/40 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 px-6 py-8 md:px-8 md:py-10">
                <p className="font-display text-3xl leading-[1.05] text-cream md:text-4xl">
                  Mä haluan kertoa mikä on roskapäivä.
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
