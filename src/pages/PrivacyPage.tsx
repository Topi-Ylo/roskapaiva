import { Link } from 'react-router-dom';
import FooterSection from '../components/FooterSection';

/**
 * Tietosuojaseloste — the GDPR Article 13 notice.
 *
 * Deliberately static rather than CMS-driven. This is the document Roskapäivä
 * is held to, and it should change through a reviewed commit with a dated
 * version, not through a text box at midnight.
 *
 * LAST_UPDATED must be bumped whenever the substance changes.
 */
const CONTROLLER = {
  name: 'Roskapäivä',
  registryId: '3145240-5',
  email: 'eino@roskapaiva.com',
};

const LAST_UPDATED = '11.8.2026';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-cream/10 py-8">
      <h2 className="font-display text-xl text-cream md:text-2xl">{title}</h2>
      <div className="mt-3 space-y-3 text-base leading-relaxed text-cream/75">{children}</div>
    </section>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((t) => (
        <li key={t} className="flex gap-3">
          <span aria-hidden="true" className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-amber" />
          <span>{t}</span>
        </li>
      ))}
    </ul>
  );
}

export default function PrivacyPage() {
  return (
    <>
      <section className="relative bg-forest-night pt-32 md:pt-40">
        <div className="mx-auto max-w-3xl px-6">
          <p className="eyebrow text-amber">Tietosuoja</p>
          <h1 className="font-display mt-6 text-5xl leading-tight text-cream md:text-6xl">
            Tietosuojaseloste
          </h1>
          <p className="mt-6 text-sm text-cream/45">Päivitetty {LAST_UPDATED}</p>
          <p className="mt-8 text-base leading-relaxed text-cream/75 md:text-lg">
            Tämä seloste kertoo, mitä henkilötietoja Roskapäivä kerää, mihin niitä käytetään ja
            mitkä oikeudet sinulla on. Selosteen mukainen käsittely koskee ennen kaikkea
            tapahtumailmoituslomaketta.
          </p>
        </div>
      </section>

      <section className="relative bg-forest-night pb-20 pt-12 md:pb-28">
        <div className="mx-auto max-w-3xl px-6">
          <Section title="Rekisterinpitäjä">
            <p>
              {CONTROLLER.name}
              {CONTROLLER.registryId ? ` (Y-tunnus ${CONTROLLER.registryId})` : ''}
            </p>
            <p>
              Tietosuoja-asioissa voit olla yhteydessä osoitteeseen{' '}
              <a
                href={`mailto:${CONTROLLER.email}`}
                className="text-amber underline hover:text-amber-light"
              >
                {CONTROLLER.email}
              </a>
              .
            </p>
          </Section>

          <Section title="Mitä tietoja keräämme">
            <p>Kun ilmoitat roskaretken tai siivoustalkoot Roskapäivän kartalle, tallennamme:</p>
            <Bullets
              items={[
                'järjestäjän nimen tai organisaation nimen',
                'sähköpostiosoitteen',
                'tapahtuman paikkakunnan, ajankohdan, keston ja kuvauksen',
                'valitsemasi sijaintitarkkuuden eli kaupunginosan tai osoitteen',
                'mahdollisen yhteydenotto- tai ilmoittautumislinkin',
                'mahdollisen lataamasi kuvan',
                'vahvistuksen järjestäjän vastuusta sekä sen ajankohdan ja sanamuodon version',
                'tiedon siitä, oletko antanut luvan sähköpostiviestintään',
              ]}
            />
            <p>
              Lisäksi sivustolla käytetään Google Analyticsia, jos hyväksyt sen evästeilmoituksessa.
              Voit kieltää sen milloin tahansa, emmekä tallenna analytiikkaan henkilötietoja.
            </p>
          </Section>

          <Section title="Mihin tietoja käytetään ja millä perusteella">
            <Bullets
              items={[
                'Ilmoituksen käsittelyyn ja julkaisemiseen kartalla. Peruste on oikeutettu etu: ilmoitus on tehty juuri tätä varten.',
                'Yhteydenpitoon ilmoitukseesi liittyen, esimerkiksi vahvistus- ja hyväksymisviesteihin. Peruste on oikeutettu etu.',
                'Tuleviin Roskapäivä-tiedotteisiin vain, jos olet erikseen antanut siihen luvan lomakkeella. Peruste on suostumus, jonka voit peruuttaa milloin tahansa.',
              ]}
            />
          </Section>

          <Section title="Mitä julkaistaan">
            <p>
              Kartalla ja listalla näkyvät tapahtuman paikkakunta, ajankohta, kesto, kuvaus,
              järjestäjän nimi sekä mahdollinen kuva ja ilmoittautumislinkki.
            </p>
            <p>
              <strong className="text-cream">Sähköpostiosoitettasi ei julkaista.</strong> Antamaasi
              kaupunginosaa tai osoitetta ei myöskään näytetä tekstinä, mutta ne määrittävät
              karttamerkin sijainnin — tarkalla osoitteella merkki osuu juuri siihen paikkaan.
              Valitse siis sijaintitarkkuus sen mukaan, kuinka tarkasti haluat paikan näkyvän.
            </p>
          </Section>

          <Section title="Kenelle tietoja luovutetaan">
            <p>
              Emme myy tai luovuta tietoja markkinointitarkoituksiin. Käytämme seuraavia
              palveluntarjoajia, jotka käsittelevät tietoja puolestamme:
            </p>
            <Bullets
              items={[
                'Supabase — tietokanta ja tiedostojen tallennus',
                'Netlify — sivuston ja lomakkeen tekninen ympäristö',
                'Resend — sähköpostien lähetys',
                'Google Analytics — kävijämittaus, vain suostumuksella',
              ]}
            />
            <p>
              Osa palveluntarjoajista toimii EU:n ja ETA:n ulkopuolella. Tällöin siirto perustuu
              Euroopan komission vakiolausekkeisiin tai vastaavaan suojamekanismiin.
            </p>
          </Section>

          <Section title="Kuinka kauan tietoja säilytetään">
            <Bullets
              items={[
                'Julkaistut tapahtumailmoitukset säilytetään tapahtuman jälkeen niin kauan kuin ne ovat kartalla tai tilastoissa merkityksellisiä.',
                'Hylätyt ilmoitukset poistetaan viimeistään 90 päivän kuluessa.',
                'Järjestäjän yhteystiedot poistetaan tai anonymisoidaan viimeistään 12 kuukauden kuluttua tapahtumasta. Tilastot säilyvät tämän jälkeen ilman henkilötietoja.',
                'Sähköpostiluvan peruuttaminen poistaa osoitteesi postituslistalta välittömästi.',
              ]}
            />
          </Section>

          <Section title="Sinun oikeutesi">
            <p>Sinulla on oikeus:</p>
            <Bullets
              items={[
                'saada tietää, mitä tietoja sinusta on tallennettu, ja saada niistä kopio',
                'pyytää virheellisten tietojen oikaisua',
                'pyytää tietojesi poistamista, esimerkiksi jos haluat tapahtumasi pois kartalta',
                'vastustaa käsittelyä tai pyytää sen rajoittamista',
                'peruuttaa antamasi sähköpostilupa milloin tahansa',
              ]}
            />
            <p>
              Pyynnöt osoitteeseen{' '}
              <a
                href={`mailto:${CONTROLLER.email}`}
                className="text-amber underline hover:text-amber-light"
              >
                {CONTROLLER.email}
              </a>
              . Vastaamme viimeistään kuukauden kuluessa.
            </p>
            <p>
              Jos katsot, ettemme käsittele tietojasi lainmukaisesti, voit tehdä ilmoituksen
              tietosuojavaltuutetun toimistolle (
              <a
                href="https://tietosuoja.fi"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber underline hover:text-amber-light"
              >
                tietosuoja.fi
              </a>
              ).
            </p>
          </Section>

          <Section title="Tietoturva">
            <p>
              Tiedot on suojattu pääsynhallinnalla, eikä järjestäjien yhteystietoihin pääse käsiksi
              kukaan muu kuin Roskapäivän ylläpito. Jos tietoturvaloukkaus kuitenkin tapahtuu ja se
              todennäköisesti aiheuttaa riskin oikeuksillesi, ilmoitamme siitä valvontaviranomaiselle
              ja tarvittaessa suoraan sinulle.
            </p>
          </Section>

          <Section title="Kuka vastaa kartalla olevista tapahtumista">
            <p>
              Roskapäivä järjestää Helsingin päätapahtuman. Muualla Suomessa kartalle ilmoitetut
              tapahtumat ovat paikallisten järjestäjien itsenäisesti järjestämiä, ja kukin järjestäjä
              vastaa omasta tapahtumastaan. Lisätietoja{' '}
              <Link to="/ukk" className="text-amber underline hover:text-amber-light">
                usein kysytyissä kysymyksissä
              </Link>
              .
            </p>
          </Section>
        </div>
      </section>

      <FooterSection />
    </>
  );
}
