import FaqAccordion from './FaqAccordion';
import SafetyNotice from './SafetyNotice';

/**
 * The turvallisuus- ja osallistumisohjeet: the safety card followed by the
 * questions.
 *
 * The safety card appears here and in the confirmation e-mail, and nowhere on
 * the page itself. Someone browsing the map is not about to pick up a needle;
 * the people who need it are the ones registering an event and the ones reading
 * the confirmation afterwards.
 */
export default function FaqContent() {
  return (
    <>
      <p className="eyebrow text-amber">Turvallisuus- ja osallistumisohjeet</p>
      <h2 className="font-display mt-4 text-4xl leading-tight text-cream md:text-5xl">
        Näin osallistut Roskapäivään.
      </h2>
      <p className="mt-6 text-base leading-relaxed text-cream/75">
        Roskapäivä järjestää Helsingin päätapahtuman yhdessä Cleaning Angelsin kanssa. Muualla
        Suomessa kartalle ilmoitetut roskaretket ja siivoustalkoot ovat paikallisten järjestäjien
        itsenäisesti järjestämiä tapahtumia.
      </p>

      <SafetyNotice className="mt-8" />

      <div className="mt-10">
        <FaqAccordion />
      </div>
    </>
  );
}
