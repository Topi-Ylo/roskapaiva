export interface FaqItem {
  id?: string;
  question: string;
  answer: string;
  sort_order?: number;
  published?: boolean;
}

/**
 * Eino's own wording, kept verbatim. This is the fallback the page renders when
 * faq_items is empty or unreachable, so the answers explaining who runs each
 * event are never missing — that is the whole reason the FAQ exists.
 *
 * The admin copy wins once rows exist. Edit there, not here.
 */
export const FALLBACK_FAQ: FaqItem[] = [
  {
    question: 'Kuka voi osallistua Roskapäivään?',
    answer:
      'Kuka tahansa! Voit kerätä yhden roskan, lähteä roskaretkelle ystävien kanssa ' +
      'tai järjestää omat siivoustalkoot esimerkiksi yrityksen, koulun, ' +
      'yhdistyksen, harrastusryhmän tai muun yhteisön kanssa.',
    sort_order: 0,
  },
  {
    question: 'Pitääkö osallistumisesta ilmoittaa?',
    answer:
      'Ei ole pakko, mutta toivomme sitä! Ilmoitetut roskaretket ja siivoustalkoot ' +
      'lisätään Roskapäivän Suomen kartalle. Näin näemme, missä kaikkialla Suomessa ' +
      'siivotaan ja kuinka paljon yhteisiä talkootunteja päivän aikana kertyy.',
    sort_order: 1,
  },
  {
    question: 'Mihin kerätyt roskat viedään?',
    answer:
      'Toimita kerätyt roskat oman alueesi jätehuolto-ohjeiden mukaiseen ' +
      'jätekeräykseen. Älä jätä täysiä jätesäkkejä puistoon, kadun varteen tai ' +
      'roska-astian viereen. Jos järjestät suuremmat talkoot, selvitä etukäteen ' +
      'omalta kunnalta tai alueesi jätehuoltotoimijalta, mihin suuremmat jätemäärät ' +
      'voidaan toimittaa.',
    sort_order: 2,
  },
  {
    question: 'Pitääkö roskat lajitella?',
    answer:
      'Roskat voi lajitella jo keräämisen yhteydessä, jos se onnistuu helposti ja ' +
      'turvallisesti. Kerättyjä roskapusseja ei kuitenkaan tarvitse eikä pidä ' +
      'jälkikäteen penkoa lajittelua varten, sillä niiden joukossa voi olla teräviä ' +
      'tai muuten vaarallisia esineitä. Tärkeintä on saada roskat turvallisesti ' +
      'pois ympäristöstä ja asianmukaiseen jätehuoltoon. Vaaralliset jätteet tulee ' +
      'pitää erillään ja käsitellä paikallisten jätehuolto-ohjeiden mukaisesti.',
    sort_order: 3,
  },
  {
    question: 'Mitä kannattaa ottaa mukaan?',
    answer:
      'Suojakäsineet, roskapihdit ja kestävät roskapussit tai jätesäkit. Lisäksi ' +
      'kannattaa varustautua säänmukaisilla vaatteilla ja hyvillä kengillä. ' +
      'Helsingin päätapahtumassa tarvittavat keräysvälineet saa paikan päältä.',
    sort_order: 4,
  },
  {
    question: 'Mitä ei pidä kerätä?',
    answer:
      'Älä käsittele paljain käsin neuloja, ruiskuja, rikkoutunutta lasia tai muita ' +
      'teräviä esineitä. Älä koske tuntemattomiin kemikaaleihin, vaarallisiin ' +
      'aineisiin tai muihin jätteisiin, joiden käsittely ei vaikuta turvalliselta. ' +
      'Tarkista niiden käsittely oman alueesi jätehuolto-ohjeista.',
    sort_order: 5,
  },
  {
    question: 'Voivatko lapset osallistua?',
    answer:
      'Kyllä! Lasten tulee osallistua aikuisen valvonnassa. Lasten kanssa kannattaa ' +
      'kerätä vain helposti tunnistettavaa ja turvallista roskaa.',
    sort_order: 6,
  },
  {
    question: 'Voiko yritys, koulu, yhdistys tai harrastusryhmä järjestää oman tapahtuman?',
    answer:
      'Ehdottomasti. Voitte järjestää oman roskaretken tai siivoustalkoot ja ' +
      'ilmoittaa ne Roskapäivän Suomen kartalle. Osallistumisen ei tarvitse olla ' +
      'suuri – jo pieni porukka ja lyhyt roskaretki riittävät.',
    sort_order: 7,
  },
  {
    question: 'Voiko koulu osallistua, vaikka 5.9. on lauantai?',
    answer:
      'Kyllä. Koulu tai luokka voi järjestää oman Roskapäivä-roskaretken ' +
      'esimerkiksi tapahtumaa edeltävällä viikolla tai haastaa oppilaat ja perheet ' +
      'osallistumaan varsinaisena Roskapäivänä.',
    sort_order: 8,
  },
  {
    question: 'Tarvitseeko omiin talkoisiin lupia?',
    answer:
      'Jos järjestät yleisölle avoimen tapahtuman, käytät tapahtumaa varten yleistä ' +
      'tai toisen omistamaa aluetta tai tapahtuma vaatii erityisjärjestelyjä, ' +
      'selvitä etukäteen mahdollisesti tarvittavat luvat ja ilmoitukset ' +
      'paikallisilta viranomaisilta ja alueen omistajalta. Pienen oman porukan ' +
      'roskaretki on eri asia kuin varsinainen yleisötapahtuma.',
    sort_order: 9,
  },
  {
    question: 'Kuka järjestää eri puolilla Suomea järjestettävät tapahtumat?',
    answer:
      'Roskapäivä järjestää Helsingin päätapahtuman yhdessä Cleaning Angelsin ' +
      'kanssa. Muualla Suomessa Roskapäivän kartalle ilmoitetut roskaretket ja ' +
      'siivoustalkoot ovat paikallisten järjestäjien itsenäisesti järjestämiä ' +
      'tapahtumia. Tapahtuman lisääminen Roskapäivän kartalle ei tee Roskapäivästä ' +
      'paikallisen tapahtuman järjestäjää. Paikallinen järjestäjä vastaa oman ' +
      'tapahtumansa käytännön järjestelyistä ja turvallisuudesta sekä tarvittavien ' +
      'lupien, ilmoitusten ja oman vakuutusturvansa selvittämisestä.',
    sort_order: 10,
  },
  {
    question: 'Kattaako Roskapäivän vakuutus kaikki kartalla olevat tapahtumat?',
    answer:
      'Ei. Roskapäivän järjestäjän vastuuvakuutus koskee Helsingin päätapahtumaa ' +
      'vakuutusehtojen mukaisesti. Muualla Suomessa järjestettävät ja kartalle ' +
      'ilmoitetut tapahtumat ovat paikallisten järjestäjien itsenäisesti ' +
      'järjestämiä, eikä Helsingin päätapahtuman vakuutusturva kata niitä. ' +
      'Paikallisen tapahtuman järjestäjän tulee itse arvioida oman toimintansa ' +
      'vakuutustarve.',
    sort_order: 11,
  },
  {
    question: 'Voinko osallistua ilman, että järjestän tapahtumaa?',
    answer:
      'Totta kai. Voit osallistua täysin omatoimisesti vaikka keräämällä yhden ' +
      'roskan tai lähtemällä pienelle roskaretkelle. Huolehdi omasta ' +
      'turvallisuudestasi, käytä sopivia välineitä ja noudata paikallisia ' +
      'jätehuolto-ohjeita.',
    sort_order: 12,
  },
];

/**
 * The short safety card. Kept in code rather than the CMS: it is referenced
 * from the sign-up form and the event page as well as the FAQ, and it should
 * not be possible to leave one of those pointing at nothing.
 *
 * Three points beyond Eino's original list, all things that turn a minor
 * incident into a serious one: being seen near traffic, reporting a dangerous
 * find rather than only stepping around it, and the emergency number.
 */
export const SAFETY_TITLE = 'Roskapäivän turvallinen osallistuminen';

export const SAFETY_POINTS: string[] = [
  'Kerää vain roskia, jotka pystyt käsittelemään turvallisesti.',
  'Käytä suojakäsineitä tai roskapihtejä.',
  'Älä käsittele vaarallisia tai tuntemattomia jätteitä äläkä penko kerättyjä roskapusseja.',
  'Noudata liikennesääntöjä ja paikallisia jätehuolto-ohjeita.',
  'Käytä heijastavaa tai huomioväristä vaatetusta, jos siivoat teiden varsilla.',
  'Jos löydät neuloja, ruiskuja tai muuta vaarallista jätettä, älä koske siihen vaan ilmoita kunnan tai alueen jätehuollon ohjeiden mukaisesti.',
  'Lapset osallistuvat aikuisen valvonnassa.',
  'Hätätilanteessa soita 112.',
];
