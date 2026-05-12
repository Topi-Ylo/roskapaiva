import { useEffect } from 'react';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function TarinaModal({ open, onClose }: Props) {
  useEffect(() => {
    if (open) document.body.classList.add('modal-open');
    else document.body.classList.remove('modal-open');
    return () => document.body.classList.remove('modal-open');
  }, [open]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div
      className={`modal-overlay ${open ? 'active' : ''}`}
      role="dialog"
      aria-modal="true"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="modal-content max-w-3xl">
        <button className="modal-close" onClick={onClose} aria-label="Sulje">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="6" y1="6" x2="18" y2="18" />
            <line x1="6" y1="18" x2="18" y2="6" />
          </svg>
        </button>

        <div className="relative aspect-[16/9] overflow-hidden">
          <img
            src="https://i.imgur.com/RM0xy9X.jpeg"
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-forest-deep via-forest-deep/40 to-transparent" />
        </div>

        <div className="p-8 md:p-14">
          <p className="eyebrow text-amber">Roskapäivä ja Einon tarina</p>
          <h2 className="font-display mt-6 text-4xl text-cream md:text-5xl lg:text-6xl">
            Pienistä teoista<br />kasvoi liike.
          </h2>

          <p className="mt-10 text-lg italic leading-relaxed text-cream/85 font-quote md:text-xl">
            Kahdeksan vuotta sitten havahduin luonnon roskaantumiseen ja mietin, että asialle on tehtävä jotain. Aloin keräämään ja kuvaamaan roskaa, ja perustin Instagramiin Roskapäivä-tilin. Siitä kasvoi yhteisö, joka innostaa ihmisiä toimimaan luonnon puolesta omalla tavallaan.
          </p>

          <div className="mt-10 space-y-5 text-base leading-relaxed text-cream/80 md:text-lg">
            <p>
              Olen huomannut, että tekemällä omaa juttua voi päästä pitkälle. Kaikki alkoi vuonna 2018, kun aloin hammasteknikon päivätyöni ohella kerätä roskia. Ensin omaksi ilokseni, pian jo intohimosta. Vuosien varrella Roskapäivästä kasvoi tärkeä osa elämääni ja lopulta myös työni.
            </p>
            <p>
              Vuonna 2023 sain Koneen Säätiöltä apurahan, jonka turvin pystyin omistautumaan roskahommille täysipäiväisesti. Järjestin siivoustapahtumia Helsingissä ja Roskapäiviä pääkaupunkiseudun kouluissa. Seuraavana vuonna perustin oman toiminimen ja aloitin urani täysipäiväisenä roska-aktivistina ja sosiaalisen median vastuullisuusvaikuttajana.
            </p>
            <p>
              Syksyllä 2024 järjestin ensimmäisen koko Suomea koskevan Roskapäivän, johon osallistui yli 500 ihmistä sosiaalisen median kautta ja noin 100 kävijää Töölön tapahtumassa. Tapahtuma sai jatkoa ja järjestetään vuosittain aina syyskuun ensimmäisenä lauantaina. Kesällä 2025 jätin taakseni 14 vuoden urani hammasteknikkona ja ryhdyin kokoaikaiseksi Roskapäivä-ukoksi, tekemään sitä, mikä tuntuu omalta ja kaikista merkityksellisimmältä.
            </p>
            <p>
              Työssäni kierrän kouluissa ja yrityksissä puhumassa ympäristöstä ja järjestämässä Roskapäiviä. Yrityksille tarjoan myös rentoja, afterwork-henkisiä virkistysiltoja, joissa siivotaan yhdessä ja tehdään hyvää. Lisäksi teen sosiaaliseen mediaan kaupallisia yhteistyöitä vastuullisten toimijoiden kanssa.
            </p>
            <p>
              Pidän yllä vuonna 2018 perustamaani Roskapäivä-Instagram-tiliä, jossa kerron luonnon roskaantumisesta ja näytän esimerkilläni, kuinka pienillä teoilla voi auttaa luontoa ja eläimiä. Teen sisältöä myös TikTokiin, jossa tavoitan erityisesti nuoria.
            </p>
            <p>
              Roskapäivän tyyli on rento ja helposti lähestyttävä. En halua syyllistää, vaan innostaa.
            </p>
          </div>

          <blockquote className="mt-12 border-l-2 border-amber pl-6 font-quote text-2xl italic text-amber-light md:text-3xl">
            Jokainen päivä voi olla Roskapäivä.
          </blockquote>

          <p className="mt-6 text-sm text-cream/60 leading-relaxed">
            Se tarkoittaa, että jokainen voi omalla tavallaan auttaa: poimia yhden roskan tai järjestää kokonaisen siivoustapahtuman. Roskapäivän somekanavissa järjestän myös silloin tällöin haasteita ja kilpailuja, jotka kannustavat ihmisiä mukaan tekemään hyvää luonnon puolesta.
          </p>
        </div>
      </div>
    </div>
  );
}
