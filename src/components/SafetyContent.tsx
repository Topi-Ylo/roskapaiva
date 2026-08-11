import SafetyNotice from './SafetyNotice';

/**
 * Turvallisuus- ja osallistumisohjeet: the safety card and who is responsible
 * for what.
 *
 * The questions themselves are a section of the '26 page now, so repeating them
 * here would just be two copies to keep in step. This is what opens from the
 * sign-up form, and it is the one place on the site that still carries the
 * safety card — along with the confirmation e-mail.
 */
export default function SafetyContent() {
  return (
    <>
      <p className="eyebrow text-amber">Turvallisuus- ja osallistumisohjeet</p>
      <h2 className="font-display mt-4 text-3xl leading-tight text-cream sm:text-4xl md:text-5xl">
        Näin osallistut turvallisesti.
      </h2>
      <p className="mt-5 text-base leading-relaxed text-cream/75">
        Roskapäivä järjestää Helsingin päätapahtuman yhdessä Cleaning Angelsin kanssa. Muualla
        Suomessa kartalle ilmoitetut roskaretket ja siivoustalkoot ovat paikallisten järjestäjien
        itsenäisesti järjestämiä tapahtumia. Paikallinen järjestäjä vastaa oman tapahtumansa
        käytännön järjestelyistä ja turvallisuudesta sekä tarvittavien lupien, ilmoitusten ja oman
        vakuutusturvansa selvittämisestä.
      </p>

      <SafetyNotice className="mt-8" />

      <p className="mt-8 text-sm leading-relaxed text-cream/55">
        Lisää vastauksia löydät Roskapäivä 2026 -sivun Usein kysytyt kysymykset -osiosta.
      </p>
    </>
  );
}
