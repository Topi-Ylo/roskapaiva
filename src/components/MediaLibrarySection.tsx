import { useState } from 'react';
import VideoPlayerModal, { VideoSrc } from './VideoPlayerModal';

interface MediaItem {
  thumbnail: string;
  platform: string;
  brand: string;
  description: string;
  src: VideoSrc;
  aspect: '9/16' | '16/9';
}

import { useTableData } from '../hooks/useTableData';

interface CollabRow {
  id?: string;
  brand: string;
  platform: string;
  description: string | null;
  thumbnail_url: string | null;
  video_type: 'youtube' | 'vimeo' | 'mp4';
  video_id: string | null;
  video_url: string | null;
  aspect: '9/16' | '16/9';
}

function rowToItem(r: CollabRow): MediaItem {
  const src: VideoSrc =
    r.video_type === 'mp4'
      ? { type: 'mp4', url: r.video_url ?? '' }
      : r.video_type === 'youtube'
      ? { type: 'youtube', id: r.video_id ?? '' }
      : { type: 'vimeo', id: r.video_id ?? '' };
  return {
    thumbnail: r.thumbnail_url ?? '',
    platform: r.platform,
    brand: r.brand,
    description: r.description ?? '',
    src,
    aspect: r.aspect,
  };
}

// Fallback list shown when Supabase has no rows yet (or env vars missing).
const FALLBACK_ITEMS: MediaItem[] = [  {
    thumbnail: 'https://vumbnail.com/1095523594.jpg',
    platform: 'Some-yhteistyö',
    brand: 'Siisti toukokuu',
    description: 'Yhteistyö Nissan Suomen kanssa.',
    src: { type: 'vimeo', id: '1095523594' },
    aspect: '9/16',
  },
  {
    thumbnail: 'https://vumbnail.com/1095522083.jpg',
    platform: 'Some-yhteistyö',
    brand: 'Koulujen Roskapäivät',
    description: 'Yhteistyö Vantaan kaupungin kanssa.',
    src: { type: 'vimeo', id: '1095522083' },
    aspect: '9/16',
  },
  {
    thumbnail: 'https://vumbnail.com/1038893525.jpg',
    platform: 'Some-yhteistyö',
    brand: 'Uula',
    description: 'Mainosyhteistyö.',
    src: { type: 'vimeo', id: '1038893525' },
    aspect: '9/16',
  },
  {
    thumbnail: 'https://vumbnail.com/954350903.jpg',
    platform: 'Some-yhteistyö',
    brand: 'Suomen luonnonsuojeluliitto',
    description: 'Mainosyhteistyö.',
    src: { type: 'vimeo', id: '954350903' },
    aspect: '9/16',
  },
  {
    thumbnail: 'https://vumbnail.com/954745018.jpg',
    platform: 'Some-yhteistyö',
    brand: 'Recser / Paristokierrätys',
    description: 'Mainosyhteistyö.',
    src: { type: 'vimeo', id: '954745018' },
    aspect: '9/16',
  },
  {
    thumbnail: 'https://vumbnail.com/1038894136.jpg',
    platform: 'Some-yhteistyö',
    brand: 'Kiertokaari',
    description: 'Mainosyhteistyö.',
    src: { type: 'vimeo', id: '1038894136' },
    aspect: '9/16',
  },
  {
    thumbnail: 'https://vumbnail.com/1038892814.jpg',
    platform: 'Some-yhteistyö',
    brand: 'Niimaar',
    description: 'Mainos ja arvonta.',
    src: { type: 'vimeo', id: '1038892814' },
    aspect: '9/16',
  },
  {
    thumbnail: 'https://vumbnail.com/1044333857.jpg',
    platform: 'Some-yhteistyö',
    brand: 'Siivoussyyskuu',
    description: 'Yhteistyö Vantaan kaupungin kanssa.',
    src: { type: 'vimeo', id: '1044333857' },
    aspect: '9/16',
  },
  {
    thumbnail: 'https://vumbnail.com/954743134.jpg',
    platform: 'Some-yhteistyö',
    brand: 'Tavarapyöräasiantuntija',
    description: 'Mainosyhteistyö.',
    src: { type: 'vimeo', id: '954743134' },
    aspect: '9/16',
  },
  {
    thumbnail: 'https://vumbnail.com/954760024.jpg',
    platform: 'Some-yhteistyö',
    brand: 'Lidl Suomi',
    description: 'Mainosyhteistyö.',
    src: { type: 'vimeo', id: '954760024' },
    aspect: '9/16',
  },
  {
    thumbnail: 'https://vumbnail.com/954738656.jpg',
    platform: 'Some-yhteistyö',
    brand: 'Rinki-ekopiste',
    description: 'Mainosyhteistyö.',
    src: { type: 'vimeo', id: '954738656' },
    aspect: '9/16',
  },
  {
    thumbnail: 'https://img.youtube.com/vi/3BNrkHIdJmc/maxresdefault.jpg',
    platform: 'YouTube',
    brand: 'Roskatutkija',
    description: 'Roskapäivä-sisältö.',
    src: { type: 'youtube', id: '3BNrkHIdJmc' },
    aspect: '16/9',
  },
  {
    thumbnail: 'https://img.youtube.com/vi/dDq_REAMY08/maxresdefault.jpg',
    platform: 'YouTube',
    brand: 'Pistä pussiin',
    description: 'Roskapäivä-kampanja.',
    src: { type: 'youtube', id: 'dDq_REAMY08' },
    aspect: '16/9',
  },
  {
    thumbnail: 'https://img.youtube.com/vi/5B-sfgqXvy8/maxresdefault.jpg',
    platform: 'YouTube',
    brand: 'Ois Siistimpää',
    description: 'Roskapäivä-kampanja.',
    src: { type: 'youtube', id: '5B-sfgqXvy8' },
    aspect: '16/9',
  },
];

export default function MediaLibrarySection() {
  const [active, setActive] = useState<MediaItem | null>(null);
  const { data: rows } = useTableData<CollabRow>('social_media_collabs');
  const items: MediaItem[] = rows && rows.length > 0 ? rows.map(rowToItem) : FALLBACK_ITEMS;

  return (
    <>
      <section id="some-yhteistyot" className="relative bg-forest-night py-32 md:py-40">
        <div className="mx-auto max-w-7xl px-6">
          <div className="reveal flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="eyebrow text-amber">Some-yhteistyöt</p>
              <h3 className="font-display mt-6 text-5xl text-cream md:text-6xl lg:text-7xl">
                Esimerkkejä sosiaalisen median yhteistyövideoistani.
              </h3>
            </div>
            <p className="max-w-md text-base text-cream/70 md:text-lg">
              Pieni katselma kaupallisista yhteistöistä Instagramissa, TikTokissa ja YouTubessa. Klikkaa katsoaksesi.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-3 sm:gap-6 md:mt-20 md:grid-cols-3">
            {items.map((item, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActive(item)}
                className="reveal photo-card video-card group relative block aspect-[4/5] overflow-hidden border border-cream/10 text-left transition hover:border-amber/40"
              >
                <img
                  src={item.thumbnail}
                  alt={item.brand}
                  className="absolute inset-0 h-full w-full object-cover"
                  loading="lazy"
                />
                <div className="video-overlay absolute inset-0 bg-forest-night/35 transition-all duration-500" />

                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="play-button flex h-12 w-12 items-center justify-center rounded-full bg-amber shadow-2xl shadow-amber/30 md:h-20 md:w-20">
                    <svg className="ml-0.5 h-5 w-5 text-forest-night md:ml-1 md:h-8 md:w-8" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>

                <div className="relative z-10 flex h-full flex-col justify-end p-3 md:p-7">
                  <p className="eyebrow text-amber text-[9px] md:text-xs">{item.platform}</p>
                  <h4 className="font-display mt-1 text-base leading-tight text-cream md:mt-3 md:text-3xl md:leading-tight">{item.brand}</h4>
                  <p className="mt-2 hidden text-sm leading-snug text-cream/75 md:block">{item.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      <VideoPlayerModal
        open={active !== null}
        onClose={() => setActive(null)}
        src={active?.src ?? null}
        title={active?.brand}
        description={active?.description}
        aspect={active?.aspect}
      />
    </>
  );
}
