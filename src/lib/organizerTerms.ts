/**
 * The declaration a local organiser makes when adding an event to the map.
 *
 * Text and version live together on purpose. What gets stored on the row is the
 * version string, and a record of assent is worthless if you cannot show which
 * wording was assented to — so whenever the text below changes in a way that
 * alters its meaning, bump the version. Old rows keep pointing at the wording
 * they actually agreed to.
 *
 * Imported by both the sign-up form and the confirmation e-mail, so the
 * organiser is reminded of exactly what they accepted.
 */
export const ORGANIZER_TERMS_VERSION = 'v1-2026-08';

export const ORGANIZER_TERMS_TEXT =
  'Vahvistan, että ilmoittamani roskaretki tai siivoustalkoot on itsenäisesti ' +
  'järjestetty tapahtuma ja että tapahtuman järjestäjä vastaa sen käytännön ' +
  'järjestelyistä ja turvallisuudesta sekä tarvittavien lupien, ilmoitusten ja ' +
  'oman vakuutusturvansa selvittämisestä. Ymmärrän, että tapahtuman lisääminen ' +
  'Roskapäivän kartalle ei tee Roskapäivästä paikallisen tapahtuman järjestäjää ' +
  'eikä Roskapäivän Helsingin päätapahtuman vakuutusturva kata paikallista ' +
  'tapahtumaa.';

/** Opt-in, never pre-ticked: this is the only genuine consent on the form. */
export const MARKETING_CONSENT_TEXT =
  'Roskapäivä saa lähettää minulle sähköpostia tapahtumaan liittyen ja ' +
  'kertoa tulevista Roskapäivistä. Voit peruuttaa tämän milloin tahansa.';
