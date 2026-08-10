import { useState } from 'react';
import { useTableData } from '../hooks/useTableData';
import { useSiteSettings } from '../hooks/useSiteSettings';
import {
  FALLBACK_SPONSORS,
  type EventSponsor,
  type SponsorTier,
} from '../lib/eventContent';

const HERO_IMAGE = '/sunset-rp.jpg';

/** Fallback for the headliner portrait. */
const EVENT_PHOTO = 'https://i.imgur.com/If6GHtz.jpeg';

/** Rows of the sponsor band, in the order they appear under the hero. */
const SPONSOR_ROWS: { tier: SponsorTier; label: string }[] = [
  { tier: 'organizer', label: 'Järjestäjät' },
  { tier: 'main', label: 'Pääyhteistyökumppanit' },
  { tier: 'support', label: 'Tukisponsorit' },
  { tier: 'exhibitor', label: 'Näytteilleasettajat' },
];

/**
 * Logo sizing per tier. Wide marks are limited by max-width rather than
 * height: Partioaitta is roughly 9:1, so its rendered height is set by the
 * width cap, and raising the height class alone does nothing.
 */
const LOGO_SIZE: Record<SponsorTier, { cls: string; maxW: number }> = {
  main: { cls: 'h-12 md:h-16', maxW: 190 },
  // Järjestäjät: the cap is wide enough that HEIGHT decides the size, so the
  // 6.4:1 Cleaning Angels mark is not squashed by a width limit the way it was
  // at max-w-150, where it came out 23 px against Seiffi's 34 px.
  organizer: { cls: 'h-9', maxW: 240 },
  exhibitor: { cls: 'h-[3.375rem] md:h-[3.75rem]', maxW: 150 },
  support: { cls: 'h-9 md:h-10', maxW: 100 },
};

/**
 * Per-logo nudges where the artwork itself needs one, on top of the tier size.
 * Keyed by tier as well as name because Partioaitta appears twice, and only
 * the näytteilleasettajat instance is meant to change.
 */
const LOGO_SCALE: Record<string, number> = {
  'exhibitor:Seiffi': 0.8,
  'exhibitor:Partioaitta': 1.25,
};

function SponsorLogo({
  sponsor,
  tier,
}: {
  sponsor: EventSponsor;
  tier: SponsorTier;
}) {
  const [failed, setFailed] = useState(false);
  const showLogo = Boolean(sponsor.logo_url) && !failed;
  const big = tier === 'main';
  const { cls: sizeCls, maxW } = LOGO_SIZE[tier];
  const scale = LOGO_SCALE[`${tier}:${sponsor.name}`] ?? 1;

  const inner = (
    <>
      {showLogo && (
        <img
          src={sponsor.logo_url as string}
          alt={big ? sponsor.name : ''}
          loading="lazy"
          onError={() => setFailed(true)}
          style={{
            maxWidth: `${Math.round(maxW * scale)}px`,
            filter: big
              ? 'brightness(0) invert(1) drop-shadow(0 0 6px rgba(127, 212, 163, 0.55)) drop-shadow(0 0 18px rgba(127, 212, 163, 0.3))'
              : sponsor.invert_logo
                ? 'invert(1)'
                : undefined,
          }}
          className={`w-auto shrink-0 object-contain object-left ${sizeCls}`}
        />
      )}
      {(!big || !showLogo) && (
        <span
          className={
            big
              ? 'text-sm font-semibold uppercase tracking-[0.15em] text-cream md:text-base'
              : 'text-xs font-semibold uppercase tracking-wider text-cream/70 transition group-hover:text-cream'
          }
        >
          {sponsor.name}
        </span>
      )}
    </>
  );

  const cls = `group flex items-center py-1 ${big ? 'gap-4' : 'gap-2.5'}`;
  return sponsor.url ? (
    <a href={sponsor.url} target="_blank" rel="noopener noreferrer" className={cls}>
      {inner}
    </a>
  ) : (
    <div className={cls}>{inner}</div>
  );
}

export default function EventSection({ onSignup }: { onSignup: () => void }) {
  const { data: sponsorData } = useTableData<EventSponsor>('event_sponsors');
  const sponsors = sponsorData ?? FALLBACK_SPONSORS;
  const settings = useSiteSettings();

  const tierOf = (s: EventSponsor) => s.tier ?? 'support';
  const rows = SPONSOR_ROWS.map((row) => ({
    ...row,
    items: sponsors.filter((s) => tierOf(s) === row.tier),
  })).filter((row) => row.items.length > 0);

  return (
    <section
      id="tapahtuma"
      className="relative min-h-[100svh] w-full overflow-hidden md:min-h-[100vh]"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          backgroundImage: `url('${HERO_IMAGE}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      {/* Two washes: a vertical one for overall legibility, and a left-hand one
          because the copy sits over the brightest part of the sky. Together
          they keep the sunset readable as an image while the text stays crisp. */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to right, rgba(11, 22, 15, 0.42), rgba(11, 22, 15, 0) 62%),' +
            'linear-gradient(rgba(11, 22, 15, 0.55), rgba(11, 22, 15, 0.9))',
        }}
      />

      <div className="relative z-10 flex min-h-[100svh] flex-col px-6 md:min-h-[100vh]">
        <div className="flex flex-1 items-center pb-10 pt-24 md:pb-0 md:pt-28">
          <div className="mx-auto grid w-full max-w-7xl gap-10 md:grid-cols-12 md:items-center md:gap-12">
            {/* Valtakunnallinen viesti */}
            <div className="md:col-span-7">
              <p className="reveal eyebrow text-amber">Valtakunnallinen siivouspäivä</p>

              <h1 className="reveal delay-1 font-display mt-4 text-3xl text-cream sm:text-4xl md:text-5xl">
                Roskapäivä 2026
              </h1>

              <div className="reveal delay-1 mt-3 flex flex-wrap items-end gap-x-6 gap-y-1 leading-none">
                <span className="font-display text-[20vw] text-amber leading-[0.8] sm:text-[16vw] md:text-[12rem]">
                  5.9.
                </span>
                <span className="font-display text-5xl text-cream sm:text-6xl md:text-7xl">2026</span>
              </div>

              <h2 className="reveal delay-2 font-display mt-7 text-3xl leading-tight text-cream md:text-4xl">
                Koko Suomi siivoaa. Myös sinun kotikulmillasi.
              </h2>

              <p className="reveal delay-2 mt-5 max-w-xl text-sm leading-relaxed text-cream/75 md:text-base">
                Roskapäivä ei ole vain yksi tapahtuma yhdessä kaupungissa. Se on päivä, jona kuka
                tahansa voi järjestää oman siivoustalkoonsa, lähteä roskaretkelle kaverin kanssa tai
                vain pitää huolta omasta pihastaan. Ilmoita osallistumisesi, niin se näkyy
                valtakunnallisella kartalla.
              </p>

              <div className="reveal delay-3 mt-8 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={onSignup}
                  className="rounded-full bg-amber px-7 py-3 text-xs font-semibold uppercase tracking-widest text-forest-night transition hover:bg-amber-light"
                >
                  Ilmoita osallistumisesi
                </button>
                <a
                  href="#kartta"
                  className="ghost-cta rounded-full px-7 py-3 text-xs font-semibold uppercase tracking-widest text-cream"
                >
                  Katso kartta
                </a>
              </div>
            </div>

            {/* Päätapahtuma toissijaisena */}
            <div className="reveal delay-2 md:col-span-5 md:justify-self-end">
              <div className="w-full max-w-sm border border-cream/15 bg-forest-night/50 backdrop-blur-sm">
                <div className="relative aspect-video w-full overflow-hidden bg-forest-night">
                  <img
                    src={settings.event_headliner_image || EVENT_PHOTO}
                    alt={
                      settings.event_headliner
                        ? `Esiintyjä ${settings.event_headliner}`
                        : 'Roskapäivän päätapahtuma'
                    }
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest-night/80 to-transparent" />
                  <span className="absolute bottom-4 left-5 inline-flex items-center gap-2 rounded-full bg-amber px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-forest-night">
                    Päätapahtuma
                  </span>
                </div>

                <div className="flex flex-col gap-3 p-6 md:p-7">
                  <h3 className="font-display text-2xl text-cream">Kallio, Helsinki</h3>
                  <p className="text-sm leading-relaxed text-cream/75">
                    Roskapäivän Eino ja Cleaning Angelsin Sergio isännöivät päivän päätapahtumaa:
                    siivoustalkoot Karhupuistossa ja afterpartyt Kohde Helsingissä.
                  </p>
                  {settings.event_headliner && (
                    <p className="flex flex-wrap items-baseline gap-2 border-t border-cream/10 pt-3">
                      <span className="eyebrow text-amber">Esiintyjä</span>
                      <span className="font-display text-xl text-cream">
                        {settings.event_headliner}
                      </span>
                    </p>
                  )}
                  <a
                    href="#paatapahtuma"
                    className="inline-flex items-center gap-2 py-1 text-xs font-semibold uppercase tracking-widest text-amber transition hover:text-amber-light"
                  >
                    Tutustu päätapahtumaan
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8h10m0 0L8 3m5 5l-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Järjestäjät, kumppanit ja näytteilleasettajat */}
        {rows.length > 0 && (
          <div className="reveal delay-3 pb-8 md:pb-10">
            <div className="mx-auto w-full max-w-7xl space-y-5 pt-6 md:space-y-6">
              {rows.map((row) => (
                <div
                  key={row.tier}
                  className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-10"
                >
                  <p
                    className={`eyebrow shrink-0 sm:w-56 ${
                      row.tier === 'main' || row.tier === 'organizer' ? 'text-amber' : 'text-cream/50'
                    }`}
                  >
                    {row.label}
                  </p>
                  <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
                    {row.items.map((s) => (
                      <SponsorLogo key={s.id ?? s.name} sponsor={s} tier={row.tier} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
