import { useEffect, useRef } from 'react';
import { useCounter } from '../hooks/useCounter';

function StatCounter({ target, format, suffix }: { target: number; format?: string; suffix?: string }) {
  const { ref, value } = useCounter(target);

  const display = () => {
    if (format === 'million') {
      return (value / 1000000).toFixed(1).replace('.', ',') + 'M';
    }
    return value.toLocaleString('fi-FI') + (suffix ?? '');
  };

  return (
    <div ref={ref} className="mega-stat stat-roller text-amber text-4xl md:text-5xl lg:text-6xl">
      {display()}
    </div>
  );
}

export default function VappuSection() {
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = () => {
      if (!bgRef.current) return;
      const rect = bgRef.current.parentElement!.getBoundingClientRect();
      const inView = rect.bottom >= 0 && rect.top <= window.innerHeight;
      if (inView) {
        const offset = (window.innerHeight - rect.top) * 0.2 * 0.12;
        bgRef.current.style.transform = `translate3d(0, ${offset}px, 0)`;
      }
    };
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <section id="vappu" className="relative overflow-hidden bg-forest-night py-32 md:py-40">
      <div ref={bgRef} className="absolute inset-0 opacity-25" style={{
        backgroundImage: "url('https://i.imgur.com/s11gfNe.jpeg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }} />
      <div className="absolute inset-0 bg-gradient-to-b from-forest-night/90 via-forest-night/80 to-forest-night/90" />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="reveal grid items-start gap-8 md:grid-cols-12">
          <div className="md:col-span-7">
            <p className="eyebrow text-amber">Vappu 2026 · Kaivopuisto</p>
            <h2 className="font-display mt-6 text-6xl text-cream sm:text-7xl md:text-8xl lg:text-9xl">
              Suomi katsoi<br />peiliin<br /><span className="text-amber">yhdessä.</span>
            </h2>
          </div>
          <div className="md:col-span-5">
            <div className="relative mx-auto aspect-[9/16] w-full max-w-sm overflow-hidden md:ml-auto md:mr-0">
              <video
                src="https://video.gumlet.io/689843b7ce30732b0c4db420/69f8decfb73ee3afb2a2da6a/download.mp4"
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-forest-night via-forest-night/45 to-transparent" />
              <p className="absolute inset-x-0 bottom-0 px-6 pb-6 pt-10 text-base font-light leading-relaxed text-cream md:px-7 md:pb-7 md:text-lg">
                Vappuna kuvasin Helsingin Kaivopuiston roskaisen aamun. 48 tunnin sisällä video oli tavoittanut 1,1 miljoonaa suomalaista. Joka viidennen meistä.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 divide-x divide-cream/15 border-y border-cream/15 py-12 md:mt-8 md:grid-cols-4">
          <div className="reveal px-6 text-center md:text-left md:px-12 md:first:pl-0">
            <StatCounter target={2000000} format="million" />
            <p className="eyebrow mt-3 text-cream/55">Näyttöä</p>
          </div>
          <div className="reveal delay-1 px-6 text-center md:text-left md:px-12">
            <StatCounter target={50000} suffix="+" />
            <p className="eyebrow mt-3 text-cream/55">Tykkäystä</p>
          </div>
          <div className="reveal delay-2 px-6 text-center md:text-left md:px-12">
            <StatCounter target={2500} suffix="+" />
            <p className="eyebrow mt-3 text-cream/55">Kommenttia</p>
          </div>
          <div className="reveal delay-3 px-6 text-center md:text-left md:px-12 md:last:pr-0">
            <StatCounter target={48} suffix="h" />
            <p className="eyebrow mt-3 text-cream/55">Aikaa</p>
          </div>
        </div>
      </div>
    </section>
  );
}
