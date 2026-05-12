-- Mirror of 20260512083000_0007_services_modal_body.sql kept for parity with the
-- legacy unprefixed migration files (0001..0006). The Supabase CLI uses the
-- timestamped variants — this copy exists only so the two sets stay in sync.

alter table public.services
  add column if not exists modal_body text;

update public.services
  set modal_body = $$Järjestän yrityksille, kouluille ja organisaatioille räätälöityjä siivoustapahtumia ja virkistyspäiviä, joissa tehdään hyvää luonnolle ja vahvistetaan samalla yhteishenkeä.

Tyypillinen tapahtuma voi sisältää lyhyen, innostavan luennon roskaantumisesta, ohjatun roskaretken lähimaastoon tai kaupunkiin sekä rennon yhteisen lopetuksen — esimerkiksi piknik-henkisen iltapäivän tai afterwork-tyylisen koonnin. Suunnittelen jokaisen tapahtuman teidän toiveidenne ja aikataulunne mukaan.

Tapahtumat sopivat yhtä lailla isoille yrityksille, pienille tiimeille kuin koululuokille. Tärkeintä on, että jokainen lähtee tilaisuudesta tunne, että on tehnyt jotain konkreettista — ja että se oli vielä hauskaa.

Pyydä tarjous, niin keksitään yhdessä juuri teille sopiva kokonaisuus.$$
  where num = '01' and (modal_body is null or modal_body = '');

update public.services
  set modal_body = $$Pidän luentoja ja koulutuksia luonnon roskaantumisesta, kiertotaloudesta ja kestävistä elämäntavoista — kouluilla, yrityksissä ja tapahtumissa ympäri Suomen. Räätälöin sisällön aina kohderyhmän ja tilaisuuden mukaan.

Luennoissani yhdistyvät kahdeksan vuoden konkreettinen kokemus roskien parista, ymmärrettävät faktat ja Roskapäivän tunnistettava, rento tyyli. En halua syyllistää — haluan innostaa ihmisiä toimimaan omalla tavallaan, omassa arjessaan.

Luento voi olla itsenäinen kokonaisuus tai osa laajempaa koulutuspakettia, johon kuuluu myös työpajoja, käytännön harjoituksia tai vaikka koko teemaviikko. Kesto, syvyys ja tyyli sovitaan aina yhdessä.

Ota yhteyttä, niin keskustellaan teidän tarpeistanne.$$
  where num = '02' and (modal_body is null or modal_body = '');

update public.services
  set modal_body = $$Toteutan kaupallisia yhteistöitä vastuullisten toimijoiden kanssa sosiaalisessa mediassa, ensisijaisesti Instagram-kanavallani Roskapäivä. Yhteistyössä yhdistyvät Roskapäivän rento tyyli ja sisällön aitous — ei syyllistämistä, vaan inspirointia.

Yhteistyömuodot voivat olla esimerkiksi tuote-esittelyitä, sponsoroituja postauksia, pitkäkestoisempia brändikumppanuuksia tai räätälöityjä kampanjoita. Suunnittelen sisällöt aina yhdessä asiakkaan kanssa niin, että ne istuvat luontevasti omaan kanavaani ja tavoittavat sitoutuneen yleisöni.

Teen yhteistyötä vain sellaisten brändien kanssa, joiden arvot sopivat yhteen Roskapäivän kanssa. Vastuullisuus, läpinäkyvyys ja kestävyys ovat kaiken yhteistyön lähtökohtia.

Ole rohkeasti yhteydessä, niin keksitään yhdessä jotain siistiä.$$
  where num = '03' and (modal_body is null or modal_body = '');

insert into public.services
  (num, title, description, modal_body, image_url, cta_label, cta_email, cta_subject, sort_order)
values
  (
    '04',
    'Yritysyhteistyö',
    'Pitkäaikaisia kumppanuuksia ja kampanjoita yritysten kanssa. Sponsoriyhteistyöt, vastuullisuusviestintä ja yhteiset projektit ympäristön hyväksi.',
    $$Yritysyhteistyö Roskapäivän kanssa on enemmän kuin kertaluonteinen tapahtuma — se on pitkäjänteinen kumppanuus ympäristöteon ympärillä. Räätälöin yhteistyön juuri teidän tarpeisiinne sopivaksi.

Tyypillisiä yhteistyömuotoja ovat sponsoriyhteistyöt vuotuiseen Roskapäivään, työntekijöille suunnatut virkistyspäivät, vastuullisuusviestinnän tukeminen ja yhteiset kampanjat sosiaalisessa mediassa. Voimme myös rakentaa pidempiä, useamman vuoden kumppanuuksia, joissa Roskapäivä on osa yrityksenne ympäristötekoja.

Olen tehnyt yhteistyötä monien vastuullisten suomalaisten brändien kanssa, ja jokainen kumppanuus suunnitellaan yhdessä alusta loppuun. Tärkeintä on, että yhteistyö tuntuu aidolta ja palvelee sekä luontoa että yritystä.

Ole rohkeasti yhteydessä — keksitään yhdessä jotain merkityksellistä.$$,
    null,
    'Aloitetaan keskustelu',
    'eino@roskapaiva.com',
    'Yritysyhteistyö',
    40
  ),
  (
    '05',
    'Some yhteistyö',
    'Sosiaalisen median yhteistöitä Instagramissa ja TikTokissa. Brändilähetykset, sisällöntuotanto ja kampanjat, jotka tavoittavat sitoutuneen, luontoaktiivisen yleisön.',
    $$Roskapäivän sosiaalisen median kanavat — Instagram (@roskapaiva) ja TikTok — tavoittavat aktiivisen, ympäristötietoisen yleisön ympäri Suomen. Seuraajat ovat sitoutuneita ja arvostavat aitoa, vastuullista sisältöä.

Some-yhteistyömuotoja ovat esimerkiksi tuote-esittelyt, sponsoroidut postaukset, pitkäkestoiset brändikumppanuudet ja räätälöidyt kampanjat. Kaikki sisällöt suunnitellaan ja toteutetaan Roskapäivän rennolla ja innostavalla tyylillä — ei syyllistäen, vaan ihmisiä mukaan kannustaen.

Teen yhteistyötä vain sellaisten brändien kanssa, joiden arvot sopivat yhteen Roskapäivän kanssa. Vastuullisuus, läpinäkyvyys ja kestävyys ovat kaiken yhteistyön lähtökohtia.

Pyydä mediakortti, niin lähetän tarkemmat tiedot tavoittavuudesta, hinnoittelusta ja yhteistyömahdollisuuksista.$$,
    null,
    'Pyydä mediakortti',
    'eino@roskapaiva.com',
    'Some yhteistyö',
    50
  ),
  (
    '06',
    'Koulutus- ja oppimateriaalit',
    'Räätälöityjä oppimateriaaleja kouluille ja oppilaitoksille luonnon roskaantumisesta, kiertotaloudesta ja kestävistä elämäntavoista.',
    $$Tarjoan kouluille ja oppilaitoksille valmiita ja räätälöitäviä oppimateriaaleja luonnon roskaantumisesta, kiertotaloudesta ja kestävistä elämäntavoista. Materiaalit on suunniteltu sopimaan opetussuunnitelmaan ja toimimaan inspiroivana lähtökohtana ympäristökeskusteluille.

Materiaalipakettiin voi sisältyä esimerkiksi tehtäväkortteja, opettajan opas, valmiit diasarjat, videosisältöjä ja toiminnalliset harjoitukset, joita voi tehdä luokassa tai luonnossa. Sisällöt sopivat sekä alakouluille että toisen asteen oppilaitoksille — räätälöin tason ryhmän mukaan.

Materiaalit ovat täydennys luennoilleni ja Roskapäivä-tapahtumille, mutta toimivat hyvin myös itsenäisinä opetuskokonaisuuksina. Voin myös tehdä kouluille kokonaisia teemaviikkoja, jotka huipentuvat yhteiseen siivouspäivään.

Ota yhteyttä, niin keskustellaan tarpeistanne ja räätälöidään juuri teille sopiva paketti.$$,
    null,
    'Tilaa materiaalit',
    'eino@roskapaiva.com',
    'Koulutus- ja oppimateriaalit',
    60
  )
on conflict do nothing;
