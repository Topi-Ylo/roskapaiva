import { useState } from 'react';
import VideoModal from './VideoModal';

export default function DocumentarySection() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <section id="dokumentti" className="relative overflow-hidden bg-forest-night py-32 md:py-40">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&w=2400&q=80')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }} />
        <div className="absolute inset-0 bg-gradient-to-b from-forest-night via-forest-night/90 to-forest-night" />

        <div className="relative mx-auto max-w-7xl px-6">
          <div className="reveal max-w-3xl">
            <p className="eyebrow text-amber">Lyhytdokumentti</p>
            <h2 className="font-display mt-6 text-5xl text-cream md:text-6xl lg:text-7xl">
              Tervetuloa<br />Roskapäivän maailmaan!
            </h2>
            <p className="mt-8 text-base leading-relaxed text-cream/75 md:text-lg">
              Trashday on muotokuva Einosta, isästä joka alkoi kerätä roskia helpottaakseen huoltaan ympäristöstä. Petrus Koskisen ohjaama dokumentti, ensi-ilta 11.6.2024.
            </p>
          </div>

          <button
            onClick={() => setOpen(true)}
            className="reveal delay-1 video-card mt-16 group relative block w-full overflow-hidden border border-cream/10"
          >
            <div className="aspect-video relative">
              <img
                src="https://i.imgur.com/HF2HqLa.png"
                alt="Roskapäivä, dokumentti"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="video-overlay absolute inset-0 bg-forest-night/45 transition-all duration-500" />

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="play-button flex h-20 w-20 items-center justify-center rounded-full bg-amber shadow-2xl shadow-amber/30 md:h-28 md:w-28">
                  <svg className="ml-1.5 h-8 w-8 text-forest-night md:ml-2 md:h-12 md:w-12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-forest-night via-forest-night/60 to-transparent p-6 md:p-10">
                <div className="flex items-end justify-between gap-6">
                  <div className="text-cream">
                    <p className="font-display text-3xl md:text-4xl">Trashday</p>
                    <p className="mt-2 text-sm text-cream/70 md:text-base">13:41 · 2024</p>
                  </div>
                  <span className="hidden text-xs uppercase tracking-widest text-cream/60 md:inline">Klikkaa katsoaksesi</span>
                </div>
              </div>
            </div>
          </button>
        </div>
      </section>

      <VideoModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
