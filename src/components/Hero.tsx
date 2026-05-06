import { useEffect, useRef } from 'react';
import { useHeroProgress } from '../hooks/useHeroProgress';
import { useIsCoarsePointer } from '../hooks/useIsCoarsePointer';
import {
  setMobileHeroRevealed,
  useMobileHeroRevealed,
} from '../hooks/useMobileHeroReveal';

const VIDEO_URL_DESKTOP =
  'https://video.gumlet.io/689843b7ce30732b0c4db420/69fae84160e95a00ee864b32/download.mp4';
const VIDEO_URL_MOBILE =
  'https://video.gumlet.io/689843b7ce30732b0c4db420/69fae94a5c890ee77b65e6db/download.mp4';

// Placeholder portraits — swap for real Eino photos later.
const EINO_IMG_1 = 'https://i.imgur.com/Mf4XgjV.jpeg';
const EINO_IMG_2 = 'https://i.imgur.com/FSNLVUN.jpeg';

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const targetTimeRef = useRef(0);
  const currentTimeRef = useRef(0);
  const progress = useHeroProgress();
  const isMobile = useIsCoarsePointer();
  const mobileRevealed = useMobileHeroRevealed();
  const mobileTriggerRef = useRef(false);

  // The section is now 400vh tall. The original hero scrub plays out across the first
  // half of the section (heroProgress 0->1), and the Eino interlude takes the second.
  const heroProgress = Math.min(1, progress * 2);
  // Desktop: panel is the second half of the section. Mobile: hero reveal is
  // time-driven, so the entire scroll is dedicated to the Eino panel.
  const panelProgress = isMobile
    ? progress
    : Math.max(0, Math.min(1, (progress - 0.5) * 2));

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
      // Mobile: play once, freeze on final frame, and trigger the rest of the
      // hero animation (nav slide-in, text fade-in, dark overlay) at 3.5 s of
      // playback. After that the user simply scrolls past the section.
      video.loop = false;
      video.muted = true;
      const TRIGGER_AT = 3.5;
      const tryPlay = () => {
        video.play().catch(() => {
          /* autoplay denied; user gesture will kick it off */
        });
      };
      const onTime = () => {
        if (!mobileTriggerRef.current && video.currentTime >= TRIGGER_AT) {
          mobileTriggerRef.current = true;
          setMobileHeroRevealed(true);
        }
      };
      const onMeta = () => tryPlay();
      video.addEventListener('loadedmetadata', onMeta);
      video.addEventListener('timeupdate', onTime);
      if (video.readyState >= 1) tryPlay();
      return () => {
        video.removeEventListener('loadedmetadata', onMeta);
        video.removeEventListener('timeupdate', onTime);
        video.pause();
        mobileTriggerRef.current = false;
        setMobileHeroRevealed(false);
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

  // Desktop: scroll-driven curves. Mobile: binary 0/1 driven by mobileRevealed
  // (set when the hero video crosses 3.5 s).
  const desktopReveal = Math.max(0, Math.min(1, (heroProgress - 0.5) / 0.25));
  const desktopSubtitleReveal = Math.max(0, Math.min(1, (heroProgress - 0.75) / 0.20));
  const desktopOverlayReveal = Math.max(0, Math.min(1, (heroProgress - 0.7) / 0.3));

  const mobileBinary = mobileRevealed ? 1 : 0;
  const reveal = isMobile ? mobileBinary : desktopReveal;
  const subtitleReveal = isMobile ? mobileBinary : desktopSubtitleReveal;
  const overlayReveal = isMobile ? mobileBinary : desktopOverlayReveal;

  const textOpacity = reveal;
  const textTranslateY = isMobile ? (1 - reveal) * 16 : (1 - reveal) * 24;
  const subtitleSlideX = (1 - subtitleReveal) * -3;
  const overlayOpacity = overlayReveal * 0.65;

  // Scroll hint: hidden on mobile (no scroll required), fades out during the
  // first ~12% of the hero scrub on desktop.
  const hintOpacity = isMobile ? 0 : Math.max(0, 1 - heroProgress * 8);

  // Mobile reveal animations need a CSS transition since the values flip from
  // 0 to 1 instead of being lerped via scroll.
  const mobileEase = 'opacity 0.9s cubic-bezier(0.22, 1, 0.36, 1), transform 0.9s cubic-bezier(0.22, 1, 0.36, 1)';

  // Eino panel (second act):
  //   0     -> 0.20 : slide in from the right
  //   0.20  -> 0.45 : beat 1 holds
  //   0.45  -> 0.65 : crossfade to beat 2
  //   0.65  -> 1.00 : beat 2 holds (then sticky releases and hero scrolls up)
  const panelSlideIn = Math.max(0, Math.min(1, panelProgress / (isMobile ? 0.3 : 0.2)));
  const beatCross = Math.max(0, Math.min(1, (panelProgress - 0.45) / 0.2));
  const panelTranslateX = (1 - panelSlideIn) * 100;

  return (
    <section id="hero" className="relative z-20" style={{ height: isMobile ? '200dvh' : '400vh' }}>
      <div
        className="sticky top-0 w-full overflow-hidden bg-forest-night"
        style={{ height: isMobile ? '100svh' : '100dvh' }}
      >
        <video
          ref={videoRef}
          src={isMobile ? VIDEO_URL_MOBILE : VIDEO_URL_DESKTOP}
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
          style={{ opacity: overlayOpacity, transition: isMobile ? mobileEase : 'none' }}
        />

        <div
          className="relative z-10 flex h-full flex-col justify-end px-6 pb-12 md:pb-[calc(8rem+10vh)]"
          style={{
            opacity: textOpacity,
            transform: `translate3d(0, ${textTranslateY}px, 0)`,
            transition: isMobile ? mobileEase : 'none',
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
                transition: isMobile ? mobileEase : 'none',
              }}
            >
              Jos ois siistimpää.
            </p>
            <p className="mt-10 max-w-md text-base font-light leading-relaxed text-cream/80 md:text-lg">
              Liike puhtaamman ympäristön puolesta.
            </p>

            <div className="mt-12 flex items-center gap-8">
              <span
                className="ghost-cta rounded-full px-7 py-3 text-xs font-semibold uppercase tracking-widest text-cream inline-flex items-center gap-3 cursor-default select-none"
                aria-hidden="true"
              >
                Selaa alas
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="scroll-bounce"
                >
                  <path d="M7 13l5 5 5-5M7 6l5 5 5-5" />
                </svg>
              </span>
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
          style={{ opacity: textOpacity, transition: isMobile ? mobileEase : 'none' }}
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
          className="absolute right-0 top-[76px] bottom-0 z-30 w-full md:w-[28vw] md:min-w-[260px] md:max-w-[440px]"
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
              <div className="absolute inset-x-0 bottom-0 px-6 pt-8 md:px-8 md:pt-10" style={{ paddingBottom: 'max(2rem, calc(2rem + env(safe-area-inset-bottom)))' }}>
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
              <div className="absolute inset-x-0 bottom-0 px-6 pt-8 md:px-8 md:pt-10" style={{ paddingBottom: 'max(2rem, calc(2rem + env(safe-area-inset-bottom)))' }}>
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
