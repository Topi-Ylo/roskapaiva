import { useTableData } from '../hooks/useTableData';

interface Article {
  source: string;
  title: string;
  description: string;
  image: string;
  url: string;
}

interface MediaPostRow {
  id?: string;
  category: 'tv' | 'press' | 'podcast';
  source: string;
  title: string;
  description: string | null;
  image_url: string | null;
  url: string;
}

function rowToArticle(r: MediaPostRow): Article {
  return {
    source: r.source,
    title: r.title,
    description: r.description ?? '',
    image: r.image_url ?? '',
    url: r.url,
  };
}

const FALLBACK_TV: Article[] = [
  {
    source: 'MTV Uutiset',
    title: 'Roskavaikuttaja Eino järkyttyi Kaivopuiston vappukunnosta: "Kadotus ja tuho"',
    description:
      'Moni kauhistui, kuinka kauheaan kuntoon vapun kymmenet tuhannet juhlijat jättivät Helsingin Kaivopuiston. Yksi syy, miksi niin moni näki sotkun, on roskavaikuttaja Eino Oinio.',
    image:
      'https://api.mtvuutiset.fi/graphql/caas/v1/media/share/9333286/cef9508776e8d11081a7713eac887442/0405-roskaaminen.jpg',
    url: 'https://www.mtvuutiset.fi/artikkeli/roskavaikuttaja-eino-jarkyttyi-kaivopuiston-vappukunnosta-kadotus-ja-tuho/9333374',
  },
  {
    source: 'MTV Uutiset · Huomenta Suomi',
    title: 'Roskapäivä tulee — tapahtuman isä Eino jakaa vinkkinsä siistimpään kaupunkiin',
    description: 'Eino vieraana Huomenta Suomessa ennen vuotuista Roskapäivää.',
    image:
      'https://imageproxy.a2d.tv/?source=https%3A%2F%2Ftvmedia.image-service.eu-north-1-prod.vmnd.tv%2Fapi%2Fv2%2Fimg%2F66d40ec5e4b0172576f428d3-1725173445678%3Flocation%3Dmain&width=1200',
    url: 'https://www.mtvuutiset.fi/videot/video/prog20850305',
  },
  {
    source: 'MTV Uutiset · Huomenta Suomi',
    title: 'Jäteongelmaan herännyt perheenisä luo toivoa roska kerrallaan',
    description: 'Vieraana luonnonsuojelija Teemu "Eino" Oinio.',
    image:
      'https://imageproxy.a2d.tv/?source=https%3A%2F%2Ftvmedia.image-service.eu-north-1-prod.vmnd.tv%2Fapi%2Fv2%2Fimg%2F668b92f2e4b0a33c8bcf9a3c-1720424291601%3Flocation%3Dmain&width=1200',
    url: 'https://www.mtvuutiset.fi/videot/video/prog20834774',
  },
];

const FALLBACK_PRESS: Article[] = [
  {
    source: 'MTV Uutiset',
    title: 'Roskapäivä-Einon nerokas kierrätyskikka: "Voi pitää taskussa"',
    description: 'Perheenisä Teemu "Eino" Oinio alkoi kerätä roskia luonnosta.',
    image:
      'https://api.mtvuutiset.fi/graphql/caas/v1/media/share/8970076/6aa36e1d926962c335ec051188157449/jateongelma-perheenisa.jpg',
    url: 'https://www.mtvuutiset.fi/artikkeli/roskapaiva-einon-nerokas-kierratyskikka-voi-pitaa-taskussa/8970034',
  },
  {
    source: 'Uusiouutiset',
    title:
      'Roskavaikuttajaksi noussut hammasteknikko Teemu "Eino" Oinio ei nolostu tuijotuksesta vaan kannustaa kaikkia liittymään Roskapäivään',
    description:
      'Roskavaikuttaja Eino inspiroi ihmisiä keräämään roskia pois luonnosta ja kaduilta. Suomessa vietetään 7.9.2024 Roskapäivää.',
    image: 'https://uusiouutiset.fi/wp-content/uploads/2024/09/roskapaiva-3-700.jpg',
    url: 'https://uusiouutiset.fi/roskavaikuttajaksi-noussut-hammasteknikko-teemu-eino-oinio-ei-nolostu-tuijotuksesta-vaan-kannustaa-kaikkia-liittymaan-roskapaivaan/',
  },
  {
    source: 'Meillä Kotona',
    title: 'Päätä poimia roska maasta joka päivä, kehottaa Roskapäivä-projektin Teemu Oinio',
    description:
      'Teemu Oinio kuvaa roskia Instagramiin ja kerää ne mennessään. Roskaretket avaavat silmät jäteongelmalle ja auttavat suhtautumaan siihen uudella tavalla.',
    image:
      'https://assets.meillakotona.fi/elvis/file/Fs03rw8CKPB9lYi4qTRRBp/*/1706758_1770336362990_NnRGE.jpg?w=1200&h=630&q=75&fit=crop-center',
    url: 'https://www.meillakotona.fi/artikkelit/roskapaiva-projektin-teemu-oinio',
  },
  {
    source: 'Kirkko ja Kaupunki',
    title:
      'Roskapäivä-Einon somepostausten, kouluvierailuiden ja taiteen aiheena ovat roskat',
    description:
      'Itseoppineeksi roskatutkijaksi itseään kutsuva Eino jakaa Instagramissa tietoa roskista ja kannustaa ihmisiä keräämään niitä.',
    image:
      'https://www.kirkkojakaupunki.fi/o/adaptive-media/image/48630698/1200/48630688-1048715.jpeg',
    url: 'https://www.kirkkojakaupunki.fi/-/-roskapaiva-einon-somepostausten-kouluvierailuiden-ja-taiteen-aiheena-ovat-roskat-pyrin-jakamaan-tietoa-ympariston-roskaantumisesta-rennolla-tyylilla-',
  },
  {
    source: 'WWF Lehti 2/2022',
    title:
      'Roskaretket auttoivat ympäristöahdistukseen: "Olen huomannut, kuinka paljon yksikin ihminen voi saada aikaan"',
    description:
      'Roskapäivä-Eino kannustaa Instagramissa lähtemään roskaretkille. Konkreettinen tekeminen ja yhteisöllisyys tuovat toivoa synkkien ympäristöuutisten keskellä.',
    image:
      'https://wwf.fi/app/uploads/z/0/h/ia7fe1tpwxb6vo7vash36/roska-eino-aspect-ratio-16-9-2048x1152.jpg',
    url: 'https://wwf.fi/wwf-lehti/wwf-lehti-2-2022/roskaretket-auttoivat-ymparistoahdistukseen-olen-huomannut-kuinka-paljon-yksikin-ihminen-voi-saada-aikaan/',
  },
  {
    source: 'WWF Suomi · Mediakutsu',
    title:
      'Dokumenttielokuva perheenisän roskaprojektista haastaa pohtimaan, mitä jokainen voi tehdä luonnon puolesta',
    description:
      'Mediakutsu Trashday-dokumenttielokuvan ennakkonäytökseen. Yhteistyössä WWF Suomen kanssa.',
    image:
      'https://wwf.fi/app/uploads/9/g/n/riorb4ircgwmwe1kd52783/2019_wwfsivustonstandardi_fb-jakokuva_1200x630.jpg',
    url: 'https://wwf.fi/tiedotteet/2024/05/mediakutsu-dokumenttielokuva-perheenisan-roskaprojektista-haastaa-pohtimaan-mita-jokainen-voi-tehda-luonnon-puolesta/',
  },
  {
    source: 'Apu',
    title:
      'Sähkötupakointi yleistyy, vaarallinen piirre: "En olisi fiiliksissä, jos lapseni vetäisivät akkukemikaaleja"',
    description:
      'Eino kommentoi: kertakäyttöiset sähkötupakat ovat riski luonnolle ja käyttäjilleen, jotka ovat yhä useammin alaikäisiä.',
    image:
      'https://assets.apu.fi/elvis/file/04Xd0CpWKYC8qm0jT-knuG/*/Teemu_Oinio_eli_Roskap%C3%A4iv%C3%A4-Eino_ja_luonnosta_l%C3%B6ydetty_vaperoska_(1)_1770593907561_57z1x.jpg?w=1200&h=630&q=75&fit=crop-center&crop=1920,1080,0,509',
    url: 'https://www.apu.fi/artikkelit/sahkotupakoinnin-yleistymisen-vaarallinen-piirre',
  },
  {
    source: 'Mustankorkea · Kulku-lehti 2/2024',
    title: 'Roskavaikuttaja Eino Oinio pistää itsensä likoon puhtaan lähiluonnon puolesta',
    description:
      'Sosiaalisen median roskavaikuttajana tunnettu Eino on 38-vuotias hammasteknikko, skeittaaja ja perheenisä Vantaalta.',
    image: 'https://www.mustankorkea.fi/wp-content/uploads/2024/09/roskapaiva-4.jpg',
    url: 'https://www.mustankorkea.fi/blogit/roskavaikuttaja-eino/',
  },
  {
    source: 'Uula',
    title: 'Arkisia valintoja — luonnonmaalia ja kotitekoista dödöä',
    description:
      'Roskavaikuttaja Eino lieventää ympäristöahdistusta pienin arkisin valinnoin. Luonnonmaalein maalattu koti tuo levollisen mielen.',
    image: 'https://uula.fi/wp-content/uploads/2024/11/roskapaiva-kalliolla.webp',
    url: 'https://uula.fi/blogi/luonnonmaalia-ja-kotitekoista-dodoa/',
  },
  {
    source: 'Turun Seutusanomat',
    title: 'Ympäristövaikuttaja Teemu "Eino" Oinio vierailulla Turun Varissuolla',
    description:
      'Roskapäivät järjestävä Varissuo-Seura sai asukasbudjettirahaa Moikkaa naapuria, tutustu lähiluontoon varissuolainen! -hankkeelleen.',
    image: 'https://turunseutusanomat.fi/wp-content/uploads/2025/11/Teemu-Eino-Oinio-web.jpg',
    url: 'https://turunseutusanomat.fi/2025/11/ymparistovaikuttaja-teemu-eino-oinio-varissuolla/',
  },
];

const FALLBACK_OTHER: Article[] = [
  {
    source: 'Tubecon Awards 2025',
    title: 'Eino ehdolla Vuoden vastuullisuusvaikuttajaksi',
    description:
      'Eino oli ehdolla Tubecon Awards 2025 -gaalassa Vuoden vastuullisuusvaikuttaja -kategoriaan. Suomen suurin vaikuttajagaala järjestettiin Turun Logomossa toukokuussa 2025.',
    image: 'https://i.imgur.com/yxI0zxE.jpeg',
    url: 'https://www.tilt.fi/uutiset/ketka-ovat-taman-hetken-kuumimmat-sisallontuottajat-tubecon-awards-ehdokkaat-julki/',
  },
  {
    source: 'Trailpodder · Podcast',
    title: 'TRAILPODDER Podcast 66 — Roskapäivä Eino: Käpyläkierros',
    description: 'Eino vieraana Trailpodder-podcastissa. Syyskuu 2022, kesto 1 h 27 min.',
    image:
      'https://is1-ssl.mzstatic.com/image/thumb/Podcasts122/v4/d6/84/b5/d684b5c7-3f73-b514-8e11-8c4d2fb86d30/mza_13923872158148369605.jpg/600x600bb.jpg',
    url: 'https://podcasts.apple.com/de/podcast/trailpodder-podcast-66-roskap%C3%A4iv%C3%A4-eino-k%C3%A4pyl%C3%A4kierros/id1573605878?i=1000578577240',
  },
];

function ArticleCard({ article }: { article: Article }) {
  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="reveal photo-card group flex w-[78vw] max-w-sm flex-shrink-0 snap-start flex-col overflow-hidden border border-cream/10 bg-forest-deep/40 transition hover:border-amber/40 md:w-auto md:max-w-none md:flex-shrink"
    >
      <div className="relative aspect-video overflow-hidden">
        <img
          src={article.image}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-forest-night/15 transition-all duration-500 group-hover:bg-forest-night/0" />
      </div>
      <div className="flex flex-1 flex-col p-6 md:p-7">
        <p className="eyebrow text-amber">{article.source}</p>
        <h4 className="font-display mt-3 text-xl text-cream md:text-2xl">{article.title}</h4>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-cream/70">{article.description}</p>
        <div className="mt-5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-amber">
          Lue artikkeli
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
            <path d="M3 13L13 3M13 3H6M13 3v7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </a>
  );
}

export default function MediaSection() {
  const { data: rows } = useTableData<MediaPostRow>('media_posts');

  let tv: Article[] = FALLBACK_TV;
  let press: Article[] = FALLBACK_PRESS;
  let other: Article[] = FALLBACK_OTHER;

  if (rows && rows.length > 0) {
    tv = rows.filter((r) => r.category === 'tv').map(rowToArticle);
    press = rows.filter((r) => r.category === 'press').map(rowToArticle);
    other = rows.filter((r) => r.category === 'podcast').map(rowToArticle);
  }

  return (
    <section id="media" className="relative overflow-hidden bg-forest-night py-20 md:py-40">
      <div className="absolute inset-0 opacity-15" style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=2400&q=80')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }} />
      <div className="absolute inset-0 bg-gradient-to-b from-forest-night via-forest-night/95 to-forest-night" />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="reveal text-center">
          <p className="eyebrow text-amber">Mediassa</p>
          <h2 className="font-display mt-6 text-4xl text-cream md:text-6xl lg:text-7xl">Missä Roskapäivä on<br />ollut esillä.</h2>
        </div>

        <div className="mt-20 md:mt-24">
          <p className="reveal eyebrow text-amber">TV ja video</p>
          <div className="reveal mt-8 -mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-4 no-scrollbar md:mx-0 md:grid md:grid-cols-2 md:gap-6 md:overflow-visible md:px-0">
            {tv.map((a) => (
              <ArticleCard key={a.url} article={a} />
            ))}
          </div>
        </div>

        <div className="mt-20 md:mt-28">
          <p className="reveal eyebrow text-amber">Lehdistö</p>
          <div className="reveal mt-8 -mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-4 no-scrollbar md:mx-0 md:grid md:grid-cols-2 md:gap-6 md:overflow-visible md:px-0 lg:grid-cols-3">
            {press.map((a) => (
              <ArticleCard key={a.url} article={a} />
            ))}
          </div>
        </div>

        <div className="mt-20 md:mt-28">
          <p className="reveal eyebrow text-amber">Muut</p>
          <div className="reveal mt-8 -mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-4 no-scrollbar md:mx-0 md:grid md:grid-cols-2 md:gap-6 md:overflow-visible md:px-0 lg:grid-cols-3">
            {other.map((a) => (
              <ArticleCard key={a.url} article={a} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
