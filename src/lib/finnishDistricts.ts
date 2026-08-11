/**
 * Districts for Finland's eight largest cities, offered in the sign-up form so
 * a Helsinki clean-up can sit in Kallio rather than on top of every other
 * Helsinki pin.
 *
 * Coordinates are approximate district centres, not survey points. That is the
 * right precision for this: the pin says "somewhere in Töölö", and an organiser
 * who needs the map to show an exact spot gives an address instead.
 *
 * Neither the district nor the address is ever displayed — they only decide
 * where the pin lands. See community_events_public, which selects columns
 * explicitly and leaves both out.
 */
export interface District {
  name: string;
  lat: number;
  lng: number;
}

/**
 * Keyed by the city names used in the municipality list, so lookups are direct.
 * Written in rough geographic order — sorted for display below, so adding one
 * anywhere in a block is fine.
 */
const RAW_CITY_DISTRICTS: Record<string, District[]> = {
  Helsinki: [
    { name: 'Kallio', lat: 60.1841, lng: 24.9506 },
    { name: 'Sörnäinen', lat: 60.1875, lng: 24.96 },
    { name: 'Vallila', lat: 60.1955, lng: 24.954 },
    { name: 'Alppila', lat: 60.189, lng: 24.944 },
    { name: 'Töölö', lat: 60.179, lng: 24.923 },
    { name: 'Kamppi', lat: 60.1675, lng: 24.932 },
    { name: 'Punavuori', lat: 60.161, lng: 24.9395 },
    { name: 'Eira', lat: 60.156, lng: 24.943 },
    { name: 'Ullanlinna', lat: 60.1585, lng: 24.949 },
    { name: 'Kruununhaka', lat: 60.1725, lng: 24.9535 },
    { name: 'Katajanokka', lat: 60.1665, lng: 24.97 },
    { name: 'Ruoholahti', lat: 60.162, lng: 24.913 },
    { name: 'Lauttasaari', lat: 60.159, lng: 24.877 },
    { name: 'Meilahti', lat: 60.19, lng: 24.906 },
    { name: 'Ruskeasuo', lat: 60.2, lng: 24.904 },
    { name: 'Pasila', lat: 60.199, lng: 24.933 },
    { name: 'Kumpula', lat: 60.209, lng: 24.964 },
    { name: 'Toukola / Arabianranta', lat: 60.205, lng: 24.979 },
    { name: 'Käpylä', lat: 60.215, lng: 24.95 },
    { name: 'Koskela', lat: 60.217, lng: 24.964 },
    { name: 'Maunula', lat: 60.232, lng: 24.927 },
    { name: 'Oulunkylä', lat: 60.228, lng: 24.967 },
    { name: 'Pakila', lat: 60.245, lng: 24.93 },
    { name: 'Paloheinä', lat: 60.26, lng: 24.921 },
    { name: 'Pihlajamäki', lat: 60.238, lng: 24.995 },
    { name: 'Viikki', lat: 60.227, lng: 25.017 },
    { name: 'Pukinmäki', lat: 60.245, lng: 24.988 },
    { name: 'Malmi', lat: 60.251, lng: 25.01 },
    { name: 'Tapanila', lat: 60.256, lng: 25.025 },
    { name: 'Puistola', lat: 60.265, lng: 25.04 },
    { name: 'Suutarila', lat: 60.27, lng: 25.012 },
    { name: 'Jakomäki', lat: 60.265, lng: 25.07 },
    { name: 'Munkkiniemi', lat: 60.196, lng: 24.872 },
    { name: 'Munkkivuori', lat: 60.205, lng: 24.87 },
    { name: 'Haaga', lat: 60.22, lng: 24.893 },
    { name: 'Pitäjänmäki', lat: 60.221, lng: 24.863 },
    { name: 'Konala', lat: 60.24, lng: 24.862 },
    { name: 'Kulosaari', lat: 60.186, lng: 25.008 },
    { name: 'Herttoniemi', lat: 60.194, lng: 25.03 },
    { name: 'Roihuvuori', lat: 60.194, lng: 25.053 },
    { name: 'Laajasalo', lat: 60.175, lng: 25.05 },
    { name: 'Vartiokylä / Itäkeskus', lat: 60.211, lng: 25.08 },
    { name: 'Myllypuro', lat: 60.223, lng: 25.064 },
    { name: 'Kontula', lat: 60.238, lng: 25.085 },
    { name: 'Mellunmäki', lat: 60.24, lng: 25.11 },
    { name: 'Vuosaari', lat: 60.21, lng: 25.144 },
  ],
  Espoo: [
    { name: 'Tapiola', lat: 60.176, lng: 24.804 },
    { name: 'Otaniemi', lat: 60.185, lng: 24.828 },
    { name: 'Westend', lat: 60.165, lng: 24.809 },
    { name: 'Haukilahti', lat: 60.162, lng: 24.777 },
    { name: 'Niittykumpu', lat: 60.172, lng: 24.783 },
    { name: 'Olari', lat: 60.174, lng: 24.757 },
    { name: 'Matinkylä', lat: 60.16, lng: 24.738 },
    { name: 'Suurpelto', lat: 60.187, lng: 24.762 },
    { name: 'Mankkaa', lat: 60.193, lng: 24.769 },
    { name: 'Leppävaara', lat: 60.219, lng: 24.813 },
    { name: 'Perkkaa', lat: 60.211, lng: 24.825 },
    { name: 'Kilo', lat: 60.216, lng: 24.783 },
    { name: 'Karakallio', lat: 60.226, lng: 24.783 },
    { name: 'Lintuvaara', lat: 60.23, lng: 24.801 },
    { name: 'Laaksolahti', lat: 60.232, lng: 24.716 },
    { name: 'Viherlaakso', lat: 60.228, lng: 24.729 },
    { name: 'Lippajärvi', lat: 60.238, lng: 24.748 },
    { name: 'Espoon keskus', lat: 60.205, lng: 24.656 },
    { name: 'Suvela', lat: 60.208, lng: 24.674 },
    { name: 'Kauklahti', lat: 60.19, lng: 24.601 },
    { name: 'Espoonlahti', lat: 60.15, lng: 24.66 },
    { name: 'Soukka', lat: 60.14, lng: 24.69 },
    { name: 'Nöykkiö', lat: 60.16, lng: 24.69 },
    { name: 'Latokaski', lat: 60.155, lng: 24.67 },
    { name: 'Saunalahti', lat: 60.147, lng: 24.63 },
    { name: 'Kalajärvi', lat: 60.31, lng: 24.73 },
    { name: 'Nuuksio', lat: 60.3, lng: 24.53 },
  ],
  Tampere: [
    { name: 'Keskusta', lat: 61.4978, lng: 23.761 },
    { name: 'Amuri', lat: 61.499, lng: 23.744 },
    { name: 'Pyynikki', lat: 61.495, lng: 23.737 },
    { name: 'Pispala', lat: 61.499, lng: 23.713 },
    { name: 'Santalahti', lat: 61.506, lng: 23.728 },
    { name: 'Tammela', lat: 61.501, lng: 23.776 },
    { name: 'Ratina', lat: 61.493, lng: 23.769 },
    { name: 'Kaleva', lat: 61.498, lng: 23.792 },
    { name: 'Kissanmaa', lat: 61.505, lng: 23.808 },
    { name: 'Hakametsä', lat: 61.501, lng: 23.821 },
    { name: 'Nekala', lat: 61.479, lng: 23.79 },
    { name: 'Hatanpää', lat: 61.479, lng: 23.769 },
    { name: 'Härmälä', lat: 61.467, lng: 23.755 },
    { name: 'Peltolammi', lat: 61.452, lng: 23.77 },
    { name: 'Multisilta', lat: 61.44, lng: 23.783 },
    { name: 'Hervanta', lat: 61.448, lng: 23.85 },
    { name: 'Vuores', lat: 61.42, lng: 23.832 },
    { name: 'Kaukajärvi', lat: 61.48, lng: 23.89 },
    { name: 'Linnainmaa', lat: 61.515, lng: 23.87 },
    { name: 'Atala', lat: 61.53, lng: 23.91 },
    { name: 'Olkahinen', lat: 61.535, lng: 23.89 },
    { name: 'Lielahti', lat: 61.517, lng: 23.679 },
    { name: 'Niemenranta', lat: 61.522, lng: 23.665 },
    { name: 'Lentävänniemi', lat: 61.525, lng: 23.64 },
    { name: 'Tesoma', lat: 61.496, lng: 23.648 },
    { name: 'Rahola', lat: 61.488, lng: 23.665 },
  ],
  Vantaa: [
    { name: 'Tikkurila', lat: 60.292, lng: 25.04 },
    { name: 'Jokiniemi', lat: 60.287, lng: 25.033 },
    { name: 'Simonkylä', lat: 60.296, lng: 25.035 },
    { name: 'Hakkila', lat: 60.283, lng: 25.07 },
    { name: 'Hakunila', lat: 60.279, lng: 25.109 },
    { name: 'Länsimäki', lat: 60.24, lng: 25.108 },
    { name: 'Ilola', lat: 60.312, lng: 25.03 },
    { name: 'Rajakylä', lat: 60.312, lng: 25.08 },
    { name: 'Koivukylä', lat: 60.33, lng: 25.07 },
    { name: 'Rekola', lat: 60.332, lng: 25.05 },
    { name: 'Korso', lat: 60.354, lng: 25.07 },
    { name: 'Päiväkumpu', lat: 60.34, lng: 25.03 },
    { name: 'Leinelä', lat: 60.32, lng: 25.04 },
    { name: 'Kartanonkoski', lat: 60.295, lng: 24.98 },
    { name: 'Pakkala', lat: 60.297, lng: 24.967 },
    { name: 'Aviapolis', lat: 60.314, lng: 24.964 },
    { name: 'Veromies', lat: 60.299, lng: 24.96 },
    { name: 'Myyrmäki', lat: 60.261, lng: 24.854 },
    { name: 'Martinlaakso', lat: 60.276, lng: 24.848 },
    { name: 'Vapaala', lat: 60.265, lng: 24.83 },
    { name: 'Varisto', lat: 60.27, lng: 24.818 },
    { name: 'Petikko', lat: 60.283, lng: 24.811 },
    { name: 'Askisto', lat: 60.283, lng: 24.828 },
    { name: 'Kivistö', lat: 60.32, lng: 24.845 },
  ],
  Oulu: [
    { name: 'Keskusta', lat: 65.0121, lng: 25.4651 },
    { name: 'Raksila', lat: 65.008, lng: 25.483 },
    { name: 'Tuira', lat: 65.025, lng: 25.47 },
    { name: 'Toppila', lat: 65.033, lng: 25.44 },
    { name: 'Nallikari', lat: 65.025, lng: 25.41 },
    { name: 'Koskela', lat: 65.04, lng: 25.47 },
    { name: 'Puolivälinkangas', lat: 65.03, lng: 25.482 },
    { name: 'Kaijonharju', lat: 65.057, lng: 25.47 },
    { name: 'Linnanmaa', lat: 65.059, lng: 25.465 },
    { name: 'Ritaharju', lat: 65.08, lng: 25.43 },
    { name: 'Herukka', lat: 65.07, lng: 25.462 },
    { name: 'Rajakylä', lat: 65.07, lng: 25.44 },
    { name: 'Pateniemi', lat: 65.09, lng: 25.42 },
    { name: 'Höyhtyä', lat: 64.995, lng: 25.479 },
    { name: 'Karjasilta', lat: 65.001, lng: 25.464 },
    { name: 'Kaukovainio', lat: 64.988, lng: 25.49 },
    { name: 'Kaakkuri', lat: 64.97, lng: 25.49 },
    { name: 'Metsokangas', lat: 64.97, lng: 25.53 },
    { name: 'Myllyoja', lat: 65.01, lng: 25.533 },
    { name: 'Korvensuora', lat: 65.02, lng: 25.56 },
    { name: 'Hiukkavaara', lat: 65.04, lng: 25.56 },
    { name: 'Haukipudas', lat: 65.178, lng: 25.35 },
    { name: 'Kello', lat: 65.13, lng: 25.36 },
    { name: 'Kiiminki', lat: 65.13, lng: 25.79 },
    { name: 'Jääli', lat: 65.08, lng: 25.7 },
    { name: 'Oulunsalo', lat: 64.93, lng: 25.41 },
  ],
  Turku: [
    { name: 'Keskusta', lat: 60.4518, lng: 22.2666 },
    { name: 'Port Arthur', lat: 60.457, lng: 22.256 },
    { name: 'Martti', lat: 60.444, lng: 22.279 },
    { name: 'Kupittaa', lat: 60.45, lng: 22.296 },
    { name: 'Nummi', lat: 60.457, lng: 22.29 },
    { name: 'Itäharju', lat: 60.457, lng: 22.31 },
    { name: 'Varissuo', lat: 60.453, lng: 22.366 },
    { name: 'Lauste', lat: 60.447, lng: 22.34 },
    { name: 'Moisio', lat: 60.462, lng: 22.33 },
    { name: 'Halinen', lat: 60.475, lng: 22.31 },
    { name: 'Räntämäki', lat: 60.48, lng: 22.29 },
    { name: 'Maaria', lat: 60.5, lng: 22.3 },
    { name: 'Jäkärlä', lat: 60.52, lng: 22.31 },
    { name: 'Runosmäki', lat: 60.475, lng: 22.25 },
    { name: 'Kaerla', lat: 60.47, lng: 22.24 },
    { name: 'Hepokulta', lat: 60.48, lng: 22.262 },
    { name: 'Länsikeskus', lat: 60.45, lng: 22.23 },
    { name: 'Pansio', lat: 60.44, lng: 22.18 },
    { name: 'Perno', lat: 60.435, lng: 22.16 },
    { name: 'Hirvensalo', lat: 60.42, lng: 22.24 },
    { name: 'Kakskerta', lat: 60.38, lng: 22.22 },
    { name: 'Ilpoinen', lat: 60.43, lng: 22.29 },
    { name: 'Uittamo', lat: 60.42, lng: 22.3 },
    { name: 'Skanssi', lat: 60.432, lng: 22.31 },
  ],
  Jyväskylä: [
    { name: 'Keskusta', lat: 62.2426, lng: 25.7473 },
    { name: 'Mäki-Matti', lat: 62.236, lng: 25.733 },
    { name: 'Nisula', lat: 62.25, lng: 25.76 },
    { name: 'Tourula', lat: 62.255, lng: 25.755 },
    { name: 'Ristonmaa', lat: 62.252, lng: 25.762 },
    { name: 'Seppälä', lat: 62.262, lng: 25.77 },
    { name: 'Huhtasuo', lat: 62.262, lng: 25.79 },
    { name: 'Halssila', lat: 62.245, lng: 25.812 },
    { name: 'Kuokkala', lat: 62.22, lng: 25.79 },
    { name: 'Lohikoski', lat: 62.26, lng: 25.73 },
    { name: 'Kortepohja', lat: 62.26, lng: 25.71 },
    { name: 'Kypärämäki', lat: 62.245, lng: 25.7 },
    { name: 'Keltinmäki', lat: 62.24, lng: 25.662 },
    { name: 'Myllyjärvi', lat: 62.23, lng: 25.67 },
    { name: 'Vaajakoski', lat: 62.24, lng: 25.86 },
    { name: 'Palokka', lat: 62.29, lng: 25.7 },
    { name: 'Tikkakoski', lat: 62.4, lng: 25.66 },
    { name: 'Vesanka', lat: 62.26, lng: 25.55 },
    { name: 'Säynätsalo', lat: 62.13, lng: 25.75 },
    { name: 'Korpilahti', lat: 62.015, lng: 25.57 },
  ],
  Kuopio: [
    { name: 'Keskusta', lat: 62.8924, lng: 27.677 },
    { name: 'Niirala', lat: 62.887, lng: 27.665 },
    { name: 'Linnanpelto', lat: 62.895, lng: 27.695 },
    { name: 'Männistö', lat: 62.901, lng: 27.702 },
    { name: 'Puijonlaakso', lat: 62.905, lng: 27.652 },
    { name: 'Julkula', lat: 62.92, lng: 27.64 },
    { name: 'Kelloniemi', lat: 62.92, lng: 27.7 },
    { name: 'Rypysuo', lat: 62.908, lng: 27.69 },
    { name: 'Neulamäki', lat: 62.879, lng: 27.618 },
    { name: 'Särkiniemi', lat: 62.885, lng: 27.628 },
    { name: 'Saarijärvi', lat: 62.86, lng: 27.67 },
    { name: 'Jynkkä', lat: 62.85, lng: 27.672 },
    { name: 'Levänen', lat: 62.86, lng: 27.71 },
    { name: 'Pirtti', lat: 62.835, lng: 27.66 },
    { name: 'Petonen', lat: 62.83, lng: 27.68 },
    { name: 'Hiltulanlahti', lat: 62.81, lng: 27.68 },
    { name: 'Riistavesi', lat: 62.95, lng: 28.1 },
    { name: 'Vehmersalmi', lat: 62.77, lng: 28.0 },
    { name: 'Karttula', lat: 62.88, lng: 26.97 },
    { name: 'Nilsiä', lat: 63.2, lng: 28.09 },
  ],
};

/**
 * Finnish collation, not the default: å, ä and ö belong after z rather than
 * beside a and o, so Ähtäri sorts last and not second.
 */
const byName = (a: District, b: District) => a.name.localeCompare(b.name, 'fi');

/** Sorted once at module load, so the dropdown is alphabetical and
 *  districtsFor stays a plain lookup. */
export const CITY_DISTRICTS: Record<string, District[]> = Object.fromEntries(
  Object.entries(RAW_CITY_DISTRICTS).map(([city, list]) => [city, [...list].sort(byName)])
);

/** Empty for every municipality outside the eight, which is the signal the
 *  form uses to hide the district option and offer only city or address. */
export function districtsFor(city: string): District[] {
  return CITY_DISTRICTS[city] ?? [];
}

export function districtCoords(city: string, name: string): District | null {
  return districtsFor(city).find((d) => d.name === name) ?? null;
}
