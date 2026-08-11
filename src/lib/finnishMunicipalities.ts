/**
 * Every Finnish municipality, grouped by region.
 *
 * Names and the municipality-to-region mapping come from Statistics Finland's
 * official 2026 classification (kunta_1_20260101 / maakunta_1_20260101), so the
 * list is complete and current rather than a guess at which towns matter.
 *
 * Coordinates are town centres from OpenStreetMap place nodes, not the centre
 * of the municipality's bounding box — those sit tens of kilometres out in
 * forest for the larger northern municipalities. 19 municipalities have no
 * matching place node and fall back to the boundary centre; all are within
 * about ten kilometres.
 *
 * The 54 coordinates already in use before this list existed were kept exactly
 * as they were, so no pin on the live map moves.
 *
 * Regions are in the official order, which runs roughly south to north.
 */
export interface Municipality {
  name: string;
  lat: number;
  lng: number;
  region: string;
}

/** Offered when someone's municipality genuinely is not the point — the pin
 *  falls back to the middle of the country. */
export const OTHER_MUNICIPALITY = 'Muu paikkakunta';

export const REGIONS: string[] = [
  'Uusimaa',
  'Varsinais-Suomi',
  'Satakunta',
  'Kanta-Häme',
  'Pirkanmaa',
  'Päijät-Häme',
  'Kymenlaakso',
  'Etelä-Karjala',
  'Etelä-Savo',
  'Pohjois-Savo',
  'Pohjois-Karjala',
  'Keski-Suomi',
  'Etelä-Pohjanmaa',
  'Pohjanmaa',
  'Keski-Pohjanmaa',
  'Pohjois-Pohjanmaa',
  'Kainuu',
  'Lappi',
  'Ahvenanmaa',
];

export const MUNICIPALITIES: Municipality[] = [
  // Uusimaa
  { name: 'Askola', lat: 60.5272, lng: 25.6, region: 'Uusimaa' },
  { name: 'Espoo', lat: 60.2055, lng: 24.6559, region: 'Uusimaa' },
  { name: 'Hanko', lat: 59.8248, lng: 22.9679, region: 'Uusimaa' },
  { name: 'Helsinki', lat: 60.1699, lng: 24.9384, region: 'Uusimaa' },
  { name: 'Hyvinkää', lat: 60.6306, lng: 24.8598, region: 'Uusimaa' },
  { name: 'Inkoo', lat: 60.0461, lng: 24.0042, region: 'Uusimaa' },
  { name: 'Järvenpää', lat: 60.4736, lng: 25.09, region: 'Uusimaa' },
  { name: 'Karkkila', lat: 60.5354, lng: 24.2125, region: 'Uusimaa' },
  { name: 'Kauniainen', lat: 60.2118, lng: 24.7288, region: 'Uusimaa' },
  { name: 'Kerava', lat: 60.4022, lng: 25.1029, region: 'Uusimaa' },
  { name: 'Kirkkonummi', lat: 60.1256, lng: 24.4381, region: 'Uusimaa' },
  { name: 'Lapinjärvi', lat: 60.6273, lng: 26.1981, region: 'Uusimaa' },
  { name: 'Lohja', lat: 60.2503, lng: 24.0653, region: 'Uusimaa' },
  { name: 'Loviisa', lat: 60.457, lng: 26.2256, region: 'Uusimaa' },
  { name: 'Myrskylä', lat: 60.6703, lng: 25.8514, region: 'Uusimaa' },
  { name: 'Mäntsälä', lat: 60.6353, lng: 25.3159, region: 'Uusimaa' },
  { name: 'Nurmijärvi', lat: 60.4642, lng: 24.8072, region: 'Uusimaa' },
  { name: 'Pornainen', lat: 60.4756, lng: 25.3746, region: 'Uusimaa' },
  { name: 'Porvoo', lat: 60.3932, lng: 25.6639, region: 'Uusimaa' },
  { name: 'Pukkila', lat: 60.6456, lng: 25.582, region: 'Uusimaa' },
  { name: 'Raasepori', lat: 59.9286, lng: 23.3859, region: 'Uusimaa' },
  { name: 'Sipoo', lat: 60.3767, lng: 25.2686, region: 'Uusimaa' },
  { name: 'Siuntio', lat: 60.139, lng: 24.2265, region: 'Uusimaa' },
  { name: 'Tuusula', lat: 60.4028, lng: 25.0292, region: 'Uusimaa' },
  { name: 'Vantaa', lat: 60.2934, lng: 25.0378, region: 'Uusimaa' },
  { name: 'Vihti', lat: 60.417, lng: 24.3237, region: 'Uusimaa' },

  // Varsinais-Suomi
  { name: 'Aura', lat: 60.65, lng: 22.5866, region: 'Varsinais-Suomi' },
  { name: 'Kaarina', lat: 60.4072, lng: 22.3699, region: 'Varsinais-Suomi' },
  { name: 'Kemiönsaari', lat: 60.1651, lng: 22.727, region: 'Varsinais-Suomi' },
  { name: 'Koski Tl', lat: 60.6531, lng: 23.1406, region: 'Varsinais-Suomi' },
  { name: 'Kustavi', lat: 60.5458, lng: 21.3558, region: 'Varsinais-Suomi' },
  { name: 'Laitila', lat: 60.8801, lng: 21.6926, region: 'Varsinais-Suomi' },
  { name: 'Lieto', lat: 60.5055, lng: 22.4584, region: 'Varsinais-Suomi' },
  { name: 'Loimaa', lat: 60.8516, lng: 23.058, region: 'Varsinais-Suomi' },
  { name: 'Marttila', lat: 60.5851, lng: 22.8985, region: 'Varsinais-Suomi' },
  { name: 'Masku', lat: 60.5667, lng: 22.1, region: 'Varsinais-Suomi' },
  { name: 'Mynämäki', lat: 60.6789, lng: 21.9861, region: 'Varsinais-Suomi' },
  { name: 'Naantali', lat: 60.4689, lng: 22.0291, region: 'Varsinais-Suomi' },
  { name: 'Nousiainen', lat: 60.5992, lng: 22.0841, region: 'Varsinais-Suomi' },
  { name: 'Oripää', lat: 60.856, lng: 22.6972, region: 'Varsinais-Suomi' },
  { name: 'Paimio', lat: 60.457, lng: 22.6883, region: 'Varsinais-Suomi' },
  { name: 'Parainen', lat: 60.3009, lng: 22.3021, region: 'Varsinais-Suomi' },
  { name: 'Pyhäranta', lat: 60.9499, lng: 21.4427, region: 'Varsinais-Suomi' },
  { name: 'Pöytyä', lat: 60.7889, lng: 22.5513, region: 'Varsinais-Suomi' },
  { name: 'Raisio', lat: 60.4858, lng: 22.1692, region: 'Varsinais-Suomi' },
  { name: 'Rusko', lat: 60.5407, lng: 22.2209, region: 'Varsinais-Suomi' },
  { name: 'Salo', lat: 60.3833, lng: 23.1333, region: 'Varsinais-Suomi' },
  { name: 'Sauvo', lat: 60.3432, lng: 22.6943, region: 'Varsinais-Suomi' },
  { name: 'Somero', lat: 60.6299, lng: 23.514, region: 'Varsinais-Suomi' },
  { name: 'Taivassalo', lat: 60.5619, lng: 21.6132, region: 'Varsinais-Suomi' },
  { name: 'Turku', lat: 60.4518, lng: 22.2666, region: 'Varsinais-Suomi' },
  { name: 'Uusikaupunki', lat: 60.8003, lng: 21.4083, region: 'Varsinais-Suomi' },
  { name: 'Vehmaa', lat: 60.6866, lng: 21.7153, region: 'Varsinais-Suomi' },

  // Satakunta
  { name: 'Eura', lat: 61.1304, lng: 22.1302, region: 'Satakunta' },
  { name: 'Eurajoki', lat: 61.2018, lng: 21.7297, region: 'Satakunta' },
  { name: 'Harjavalta', lat: 61.3125, lng: 22.1357, region: 'Satakunta' },
  { name: 'Huittinen', lat: 61.1771, lng: 22.6991, region: 'Satakunta' },
  { name: 'Jämijärvi', lat: 61.8198, lng: 22.6916, region: 'Satakunta' },
  { name: 'Kankaanpää', lat: 61.8042, lng: 22.3937, region: 'Satakunta' },
  { name: 'Karvia', lat: 62.137, lng: 22.561, region: 'Satakunta' },
  { name: 'Kokemäki', lat: 61.2547, lng: 22.3564, region: 'Satakunta' },
  { name: 'Merikarvia', lat: 61.8583, lng: 21.5004, region: 'Satakunta' },
  { name: 'Nakkila', lat: 61.3665, lng: 22.0, region: 'Satakunta' },
  { name: 'Pomarkku', lat: 61.6935, lng: 22.0084, region: 'Satakunta' },
  { name: 'Pori', lat: 61.4851, lng: 21.7974, region: 'Satakunta' },
  { name: 'Rauma', lat: 61.1288, lng: 21.5114, region: 'Satakunta' },
  { name: 'Siikainen', lat: 61.8767, lng: 21.8218, region: 'Satakunta' },
  { name: 'Säkylä', lat: 61.046, lng: 22.3431, region: 'Satakunta' },
  { name: 'Ulvila', lat: 61.4333, lng: 21.8833, region: 'Satakunta' },

  // Kanta-Häme
  { name: 'Forssa', lat: 60.8145, lng: 23.6241, region: 'Kanta-Häme' },
  { name: 'Hattula', lat: 61.0488, lng: 24.3152, region: 'Kanta-Häme' },
  { name: 'Hausjärvi', lat: 60.7936, lng: 24.9532, region: 'Kanta-Häme' },
  { name: 'Humppila', lat: 60.9333, lng: 23.3667, region: 'Kanta-Häme' },
  { name: 'Hämeenlinna', lat: 60.9959, lng: 24.4643, region: 'Kanta-Häme' },
  { name: 'Janakkala', lat: 60.8883, lng: 24.6958, region: 'Kanta-Häme' },
  { name: 'Jokioinen', lat: 60.8039, lng: 23.4859, region: 'Kanta-Häme' },
  { name: 'Loppi', lat: 60.7174, lng: 24.4414, region: 'Kanta-Häme' },
  { name: 'Riihimäki', lat: 60.7375, lng: 24.7725, region: 'Kanta-Häme' },
  { name: 'Tammela', lat: 60.807, lng: 23.7588, region: 'Kanta-Häme' },
  { name: 'Ypäjä', lat: 60.8038, lng: 23.2821, region: 'Kanta-Häme' },

  // Pirkanmaa
  { name: 'Akaa', lat: 61.1582, lng: 23.7259, region: 'Pirkanmaa' },
  { name: 'Hämeenkyrö', lat: 61.6512, lng: 23.1897, region: 'Pirkanmaa' },
  { name: 'Ikaalinen', lat: 61.7681, lng: 23.0747, region: 'Pirkanmaa' },
  { name: 'Juupajoki', lat: 61.822, lng: 24.447, region: 'Pirkanmaa' },
  { name: 'Kangasala', lat: 61.4639, lng: 24.0714, region: 'Pirkanmaa' },
  { name: 'Kihniö', lat: 62.2031, lng: 23.1764, region: 'Pirkanmaa' },
  { name: 'Kuhmoinen', lat: 61.5667, lng: 25.1833, region: 'Pirkanmaa' },
  { name: 'Lempäälä', lat: 61.3136, lng: 23.7548, region: 'Pirkanmaa' },
  { name: 'Mänttä-Vilppula', lat: 62.0832, lng: 24.3832, region: 'Pirkanmaa' },
  { name: 'Nokia', lat: 61.4781, lng: 23.5089, region: 'Pirkanmaa' },
  { name: 'Orivesi', lat: 61.6775, lng: 24.3588, region: 'Pirkanmaa' },
  { name: 'Parkano', lat: 62.0106, lng: 23.0187, region: 'Pirkanmaa' },
  { name: 'Pirkkala', lat: 61.4661, lng: 23.6463, region: 'Pirkanmaa' },
  { name: 'Punkalaidun', lat: 61.1158, lng: 23.0994, region: 'Pirkanmaa' },
  { name: 'Pälkäne', lat: 61.3371, lng: 24.2649, region: 'Pirkanmaa' },
  { name: 'Ruovesi', lat: 61.9856, lng: 24.0703, region: 'Pirkanmaa' },
  { name: 'Sastamala', lat: 61.3406, lng: 22.9086, region: 'Pirkanmaa' },
  { name: 'Tampere', lat: 61.4978, lng: 23.761, region: 'Pirkanmaa' },
  { name: 'Urjala', lat: 61.0812, lng: 23.549, region: 'Pirkanmaa' },
  { name: 'Valkeakoski', lat: 61.2642, lng: 24.0314, region: 'Pirkanmaa' },
  { name: 'Vesilahti', lat: 61.297, lng: 23.6388, region: 'Pirkanmaa' },
  { name: 'Virrat', lat: 62.2401, lng: 23.7712, region: 'Pirkanmaa' },
  { name: 'Ylöjärvi', lat: 61.5533, lng: 23.5964, region: 'Pirkanmaa' },

  // Päijät-Häme
  { name: 'Asikkala', lat: 61.2305, lng: 25.5635, region: 'Päijät-Häme' },
  { name: 'Hartola', lat: 61.5799, lng: 26.0206, region: 'Päijät-Häme' },
  { name: 'Heinola', lat: 61.2027, lng: 26.0314, region: 'Päijät-Häme' },
  { name: 'Hollola', lat: 60.9876, lng: 25.5164, region: 'Päijät-Häme' },
  { name: 'Iitti', lat: 60.9517, lng: 26.2685, region: 'Päijät-Häme' },
  { name: 'Kärkölä', lat: 60.8668, lng: 25.2641, region: 'Päijät-Häme' },
  { name: 'Lahti', lat: 60.9827, lng: 25.6612, region: 'Päijät-Häme' },
  { name: 'Orimattila', lat: 60.8051, lng: 25.7334, region: 'Päijät-Häme' },
  { name: 'Padasjoki', lat: 61.3513, lng: 25.2786, region: 'Päijät-Häme' },
  { name: 'Sysmä', lat: 61.5074, lng: 25.6739, region: 'Päijät-Häme' },

  // Kymenlaakso
  { name: 'Hamina', lat: 60.5697, lng: 27.1978, region: 'Kymenlaakso' },
  { name: 'Kotka', lat: 60.4664, lng: 26.9458, region: 'Kymenlaakso' },
  { name: 'Kouvola', lat: 60.8679, lng: 26.7042, region: 'Kymenlaakso' },
  { name: 'Miehikkälä', lat: 60.6706, lng: 27.6996, region: 'Kymenlaakso' },
  { name: 'Pyhtää', lat: 60.4922, lng: 26.5429, region: 'Kymenlaakso' },
  { name: 'Virolahti', lat: 60.509, lng: 27.6199, region: 'Kymenlaakso' },

  // Etelä-Karjala
  { name: 'Imatra', lat: 61.1719, lng: 28.7561, region: 'Etelä-Karjala' },
  { name: 'Lappeenranta', lat: 61.0587, lng: 28.1887, region: 'Etelä-Karjala' },
  { name: 'Lemi', lat: 61.0616, lng: 27.8042, region: 'Etelä-Karjala' },
  { name: 'Luumäki', lat: 60.9225, lng: 27.5693, region: 'Etelä-Karjala' },
  { name: 'Parikkala', lat: 61.558, lng: 29.5014, region: 'Etelä-Karjala' },
  { name: 'Rautjärvi', lat: 61.3653, lng: 29.234, region: 'Etelä-Karjala' },
  { name: 'Ruokolahti', lat: 61.2925, lng: 28.8121, region: 'Etelä-Karjala' },
  { name: 'Savitaipale', lat: 61.1977, lng: 27.6827, region: 'Etelä-Karjala' },
  { name: 'Taipalsaari', lat: 61.1599, lng: 28.0604, region: 'Etelä-Karjala' },

  // Etelä-Savo
  { name: 'Enonkoski', lat: 62.0887, lng: 28.9162, region: 'Etelä-Savo' },
  { name: 'Hirvensalmi', lat: 61.6413, lng: 26.7764, region: 'Etelä-Savo' },
  { name: 'Juva', lat: 61.8976, lng: 27.8576, region: 'Etelä-Savo' },
  { name: 'Kangasniemi', lat: 61.9895, lng: 26.6441, region: 'Etelä-Savo' },
  { name: 'Mikkeli', lat: 61.6886, lng: 27.2723, region: 'Etelä-Savo' },
  { name: 'Mäntyharju', lat: 61.4169, lng: 26.8804, region: 'Etelä-Savo' },
  { name: 'Pieksämäki', lat: 62.3016, lng: 27.1635, region: 'Etelä-Savo' },
  { name: 'Puumala', lat: 61.5226, lng: 28.1776, region: 'Etelä-Savo' },
  { name: 'Rantasalmi', lat: 62.0637, lng: 28.3045, region: 'Etelä-Savo' },
  { name: 'Savonlinna', lat: 61.8699, lng: 28.8783, region: 'Etelä-Savo' },
  { name: 'Sulkava', lat: 61.7872, lng: 28.371, region: 'Etelä-Savo' },

  // Pohjois-Savo
  { name: 'Iisalmi', lat: 63.5608, lng: 27.1908, region: 'Pohjois-Savo' },
  { name: 'Joroinen', lat: 62.1798, lng: 27.8291, region: 'Pohjois-Savo' },
  { name: 'Kaavi', lat: 62.9758, lng: 28.4801, region: 'Pohjois-Savo' },
  { name: 'Keitele', lat: 63.1782, lng: 26.3397, region: 'Pohjois-Savo' },
  { name: 'Kiuruvesi', lat: 63.6528, lng: 26.6197, region: 'Pohjois-Savo' },
  { name: 'Kuopio', lat: 62.8924, lng: 27.677, region: 'Pohjois-Savo' },
  { name: 'Lapinlahti', lat: 63.3659, lng: 27.3907, region: 'Pohjois-Savo' },
  { name: 'Leppävirta', lat: 62.4917, lng: 27.7881, region: 'Pohjois-Savo' },
  { name: 'Pielavesi', lat: 63.2333, lng: 26.75, region: 'Pohjois-Savo' },
  { name: 'Rautalampi', lat: 62.6207, lng: 26.8385, region: 'Pohjois-Savo' },
  { name: 'Rautavaara', lat: 63.4941, lng: 28.2985, region: 'Pohjois-Savo' },
  { name: 'Siilinjärvi', lat: 63.0744, lng: 27.6589, region: 'Pohjois-Savo' },
  { name: 'Sonkajärvi', lat: 63.6691, lng: 27.5232, region: 'Pohjois-Savo' },
  { name: 'Suonenjoki', lat: 62.6242, lng: 27.1246, region: 'Pohjois-Savo' },
  { name: 'Tervo', lat: 62.9564, lng: 26.7605, region: 'Pohjois-Savo' },
  { name: 'Tuusniemi', lat: 62.813, lng: 28.474, region: 'Pohjois-Savo' },
  { name: 'Varkaus', lat: 62.3151, lng: 27.8714, region: 'Pohjois-Savo' },
  { name: 'Vesanto', lat: 62.9303, lng: 26.4089, region: 'Pohjois-Savo' },
  { name: 'Vieremä', lat: 63.75, lng: 27.0167, region: 'Pohjois-Savo' },

  // Pohjois-Karjala
  { name: 'Heinävesi', lat: 62.4255, lng: 28.6314, region: 'Pohjois-Karjala' },
  { name: 'Ilomantsi', lat: 62.6731, lng: 30.9323, region: 'Pohjois-Karjala' },
  { name: 'Joensuu', lat: 62.6012, lng: 29.7636, region: 'Pohjois-Karjala' },
  { name: 'Juuka', lat: 63.2413, lng: 29.2538, region: 'Pohjois-Karjala' },
  { name: 'Kitee', lat: 62.1002, lng: 30.1356, region: 'Pohjois-Karjala' },
  { name: 'Kontiolahti', lat: 62.7667, lng: 29.85, region: 'Pohjois-Karjala' },
  { name: 'Lieksa', lat: 63.3185, lng: 30.0265, region: 'Pohjois-Karjala' },
  { name: 'Liperi', lat: 62.5315, lng: 29.3872, region: 'Pohjois-Karjala' },
  { name: 'Nurmes', lat: 63.5421, lng: 29.1407, region: 'Pohjois-Karjala' },
  { name: 'Outokumpu', lat: 62.7255, lng: 29.0187, region: 'Pohjois-Karjala' },
  { name: 'Polvijärvi', lat: 62.8545, lng: 29.3669, region: 'Pohjois-Karjala' },
  { name: 'Rääkkylä', lat: 62.3143, lng: 29.6276, region: 'Pohjois-Karjala' },
  { name: 'Tohmajärvi', lat: 62.2259, lng: 30.3336, region: 'Pohjois-Karjala' },

  // Keski-Suomi
  { name: 'Hankasalmi', lat: 62.3893, lng: 26.4368, region: 'Keski-Suomi' },
  { name: 'Joutsa', lat: 61.7427, lng: 26.1117, region: 'Keski-Suomi' },
  { name: 'Jyväskylä', lat: 62.2426, lng: 25.7473, region: 'Keski-Suomi' },
  { name: 'Jämsä', lat: 61.8638, lng: 25.1897, region: 'Keski-Suomi' },
  { name: 'Kannonkoski', lat: 62.9769, lng: 25.2637, region: 'Keski-Suomi' },
  { name: 'Karstula', lat: 62.8779, lng: 24.8008, region: 'Keski-Suomi' },
  { name: 'Keuruu', lat: 62.258, lng: 24.7084, region: 'Keski-Suomi' },
  { name: 'Kinnula', lat: 63.3668, lng: 24.9709, region: 'Keski-Suomi' },
  { name: 'Kivijärvi', lat: 63.1223, lng: 25.0725, region: 'Keski-Suomi' },
  { name: 'Konnevesi', lat: 62.6267, lng: 26.2916, region: 'Keski-Suomi' },
  { name: 'Kyyjärvi', lat: 63.0458, lng: 24.564, region: 'Keski-Suomi' },
  { name: 'Laukaa', lat: 62.4167, lng: 25.95, region: 'Keski-Suomi' },
  { name: 'Luhanka', lat: 61.797, lng: 25.7046, region: 'Keski-Suomi' },
  { name: 'Multia', lat: 62.41, lng: 24.8001, region: 'Keski-Suomi' },
  { name: 'Muurame', lat: 62.129, lng: 25.6749, region: 'Keski-Suomi' },
  { name: 'Petäjävesi', lat: 62.2505, lng: 25.2005, region: 'Keski-Suomi' },
  { name: 'Pihtipudas', lat: 63.3706, lng: 25.5755, region: 'Keski-Suomi' },
  { name: 'Saarijärvi', lat: 62.7051, lng: 25.2583, region: 'Keski-Suomi' },
  { name: 'Toivakka', lat: 62.0962, lng: 26.0805, region: 'Keski-Suomi' },
  { name: 'Uurainen', lat: 62.5008, lng: 25.438, region: 'Keski-Suomi' },
  { name: 'Viitasaari', lat: 63.0837, lng: 25.8528, region: 'Keski-Suomi' },
  { name: 'Äänekoski', lat: 62.6032, lng: 25.7301, region: 'Keski-Suomi' },

  // Etelä-Pohjanmaa
  { name: 'Alajärvi', lat: 62.9999, lng: 23.8168, region: 'Etelä-Pohjanmaa' },
  { name: 'Alavus', lat: 62.5862, lng: 23.6185, region: 'Etelä-Pohjanmaa' },
  { name: 'Evijärvi', lat: 63.3671, lng: 23.4769, region: 'Etelä-Pohjanmaa' },
  { name: 'Ilmajoki', lat: 62.7313, lng: 22.5798, region: 'Etelä-Pohjanmaa' },
  { name: 'Isojoki', lat: 62.1143, lng: 21.9588, region: 'Etelä-Pohjanmaa' },
  { name: 'Isokyrö', lat: 63.0, lng: 22.3167, region: 'Etelä-Pohjanmaa' },
  { name: 'Karijoki', lat: 62.3075, lng: 21.7078, region: 'Etelä-Pohjanmaa' },
  { name: 'Kauhajoki', lat: 62.4317, lng: 22.1842, region: 'Etelä-Pohjanmaa' },
  { name: 'Kauhava', lat: 63.0994, lng: 23.057, region: 'Etelä-Pohjanmaa' },
  { name: 'Kuortane', lat: 62.807, lng: 23.5069, region: 'Etelä-Pohjanmaa' },
  { name: 'Kurikka', lat: 62.6172, lng: 22.3992, region: 'Etelä-Pohjanmaa' },
  { name: 'Lappajärvi', lat: 63.2193, lng: 23.6284, region: 'Etelä-Pohjanmaa' },
  { name: 'Lapua', lat: 62.9703, lng: 23.0068, region: 'Etelä-Pohjanmaa' },
  { name: 'Seinäjoki', lat: 62.7903, lng: 22.8403, region: 'Etelä-Pohjanmaa' },
  { name: 'Soini', lat: 62.8738, lng: 24.2077, region: 'Etelä-Pohjanmaa' },
  { name: 'Teuva', lat: 62.4869, lng: 21.746, region: 'Etelä-Pohjanmaa' },
  { name: 'Vimpeli', lat: 63.1615, lng: 23.8178, region: 'Etelä-Pohjanmaa' },
  { name: 'Ähtäri', lat: 62.55, lng: 24.0702, region: 'Etelä-Pohjanmaa' },

  // Pohjanmaa
  { name: 'Kaskinen', lat: 62.3846, lng: 21.2226, region: 'Pohjanmaa' },
  { name: 'Korsnäs', lat: 62.7864, lng: 21.1878, region: 'Pohjanmaa' },
  { name: 'Kristiinankaupunki', lat: 62.2742, lng: 21.3772, region: 'Pohjanmaa' },
  { name: 'Kruunupyy', lat: 63.7288, lng: 23.0215, region: 'Pohjanmaa' },
  { name: 'Laihia', lat: 62.9761, lng: 22.0122, region: 'Pohjanmaa' },
  { name: 'Luoto', lat: 63.7534, lng: 22.7456, region: 'Pohjanmaa' },
  { name: 'Maalahti', lat: 62.937, lng: 21.5701, region: 'Pohjanmaa' },
  { name: 'Mustasaari', lat: 63.1248, lng: 21.6941, region: 'Pohjanmaa' },
  { name: 'Närpiö', lat: 62.478, lng: 21.3367, region: 'Pohjanmaa' },
  { name: 'Pedersören kunta', lat: 63.5416, lng: 22.9649, region: 'Pohjanmaa' },
  { name: 'Pietarsaari', lat: 63.6753, lng: 22.7028, region: 'Pohjanmaa' },
  { name: 'Uusikaarlepyy', lat: 63.5222, lng: 22.5284, region: 'Pohjanmaa' },
  { name: 'Vaasa', lat: 63.096, lng: 21.6158, region: 'Pohjanmaa' },
  { name: 'Vöyri', lat: 63.1305, lng: 22.2507, region: 'Pohjanmaa' },

  // Keski-Pohjanmaa
  { name: 'Halsua', lat: 63.4619, lng: 24.169, region: 'Keski-Pohjanmaa' },
  { name: 'Kannus', lat: 63.9008, lng: 23.917, region: 'Keski-Pohjanmaa' },
  { name: 'Kaustinen', lat: 63.549, lng: 23.6965, region: 'Keski-Pohjanmaa' },
  { name: 'Kokkola', lat: 63.8376, lng: 23.132, region: 'Keski-Pohjanmaa' },
  { name: 'Lestijärvi', lat: 63.5245, lng: 24.6683, region: 'Keski-Pohjanmaa' },
  { name: 'Perho', lat: 63.2144, lng: 24.4196, region: 'Keski-Pohjanmaa' },
  { name: 'Toholampi', lat: 63.7726, lng: 24.2515, region: 'Keski-Pohjanmaa' },
  { name: 'Veteli', lat: 63.4719, lng: 23.7926, region: 'Keski-Pohjanmaa' },

  // Pohjois-Pohjanmaa
  { name: 'Alavieska', lat: 64.1701, lng: 24.2991, region: 'Pohjois-Pohjanmaa' },
  { name: 'Haapajärvi', lat: 63.7515, lng: 25.3135, region: 'Pohjois-Pohjanmaa' },
  { name: 'Haapavesi', lat: 64.1379, lng: 25.3658, region: 'Pohjois-Pohjanmaa' },
  { name: 'Hailuoto', lat: 65.0138, lng: 24.7292, region: 'Pohjois-Pohjanmaa' },
  { name: 'Ii', lat: 65.3219, lng: 25.3716, region: 'Pohjois-Pohjanmaa' },
  { name: 'Kalajoki', lat: 64.26, lng: 23.9505, region: 'Pohjois-Pohjanmaa' },
  { name: 'Kempele', lat: 64.9125, lng: 25.5108, region: 'Pohjois-Pohjanmaa' },
  { name: 'Kuusamo', lat: 65.9667, lng: 29.1833, region: 'Pohjois-Pohjanmaa' },
  { name: 'Kärsämäki', lat: 63.9797, lng: 25.7588, region: 'Pohjois-Pohjanmaa' },
  { name: 'Liminka', lat: 64.8106, lng: 25.4085, region: 'Pohjois-Pohjanmaa' },
  { name: 'Lumijoki', lat: 64.8384, lng: 25.1868, region: 'Pohjois-Pohjanmaa' },
  { name: 'Merijärvi', lat: 64.2977, lng: 24.448, region: 'Pohjois-Pohjanmaa' },
  { name: 'Muhos', lat: 64.8063, lng: 25.9954, region: 'Pohjois-Pohjanmaa' },
  { name: 'Nivala', lat: 63.929, lng: 24.9613, region: 'Pohjois-Pohjanmaa' },
  { name: 'Oulainen', lat: 64.2668, lng: 24.8, region: 'Pohjois-Pohjanmaa' },
  { name: 'Oulu', lat: 65.0121, lng: 25.4651, region: 'Pohjois-Pohjanmaa' },
  { name: 'Pudasjärvi', lat: 65.3604, lng: 26.9985, region: 'Pohjois-Pohjanmaa' },
  { name: 'Pyhäjoki', lat: 64.4663, lng: 24.2551, region: 'Pohjois-Pohjanmaa' },
  { name: 'Pyhäjärvi', lat: 63.6777, lng: 25.82, region: 'Pohjois-Pohjanmaa' },
  { name: 'Pyhäntä', lat: 64.0963, lng: 26.3316, region: 'Pohjois-Pohjanmaa' },
  { name: 'Raahe', lat: 64.6842, lng: 24.4795, region: 'Pohjois-Pohjanmaa' },
  { name: 'Reisjärvi', lat: 63.6041, lng: 24.9356, region: 'Pohjois-Pohjanmaa' },
  { name: 'Sievi', lat: 63.9083, lng: 24.516, region: 'Pohjois-Pohjanmaa' },
  { name: 'Siikajoki', lat: 64.7113, lng: 24.7363, region: 'Pohjois-Pohjanmaa' },
  { name: 'Siikalatva', lat: 64.3121, lng: 26.0752, region: 'Pohjois-Pohjanmaa' },
  { name: 'Taivalkoski', lat: 65.5753, lng: 28.2426, region: 'Pohjois-Pohjanmaa' },
  { name: 'Tyrnävä', lat: 64.7621, lng: 25.6499, region: 'Pohjois-Pohjanmaa' },
  { name: 'Utajärvi', lat: 64.7614, lng: 26.4169, region: 'Pohjois-Pohjanmaa' },
  { name: 'Vaala', lat: 64.5565, lng: 26.8467, region: 'Pohjois-Pohjanmaa' },
  { name: 'Ylivieska', lat: 64.0729, lng: 24.5327, region: 'Pohjois-Pohjanmaa' },

  // Kainuu
  { name: 'Hyrynsalmi', lat: 64.6747, lng: 28.4923, region: 'Kainuu' },
  { name: 'Kajaani', lat: 64.2273, lng: 27.7285, region: 'Kainuu' },
  { name: 'Kuhmo', lat: 64.1262, lng: 29.5195, region: 'Kainuu' },
  { name: 'Paltamo', lat: 64.4069, lng: 27.8336, region: 'Kainuu' },
  { name: 'Puolanka', lat: 64.873, lng: 27.6553, region: 'Kainuu' },
  { name: 'Ristijärvi', lat: 64.5009, lng: 28.2132, region: 'Kainuu' },
  { name: 'Sotkamo', lat: 64.1318, lng: 28.3878, region: 'Kainuu' },
  { name: 'Suomussalmi', lat: 64.8848, lng: 28.9146, region: 'Kainuu' },

  // Lappi
  { name: 'Enontekiö', lat: 68.3855, lng: 23.6438, region: 'Lappi' },
  { name: 'Inari', lat: 68.9056, lng: 27.0289, region: 'Lappi' },
  { name: 'Kemi', lat: 65.7362, lng: 24.5637, region: 'Lappi' },
  { name: 'Kemijärvi', lat: 66.7161, lng: 27.4334, region: 'Lappi' },
  { name: 'Keminmaa', lat: 65.803, lng: 24.5209, region: 'Lappi' },
  { name: 'Kittilä', lat: 67.652, lng: 24.9095, region: 'Lappi' },
  { name: 'Kolari', lat: 67.3303, lng: 23.7815, region: 'Lappi' },
  { name: 'Muonio', lat: 67.9593, lng: 23.6774, region: 'Lappi' },
  { name: 'Pelkosenniemi', lat: 67.1096, lng: 27.5118, region: 'Lappi' },
  { name: 'Pello', lat: 66.7747, lng: 23.9677, region: 'Lappi' },
  { name: 'Posio', lat: 66.1093, lng: 28.1651, region: 'Lappi' },
  { name: 'Ranua', lat: 65.9277, lng: 26.5131, region: 'Lappi' },
  { name: 'Rovaniemi', lat: 66.5039, lng: 25.7294, region: 'Lappi' },
  { name: 'Salla', lat: 66.8319, lng: 28.6669, region: 'Lappi' },
  { name: 'Savukoski', lat: 67.2923, lng: 28.1639, region: 'Lappi' },
  { name: 'Simo', lat: 65.6623, lng: 25.0638, region: 'Lappi' },
  { name: 'Sodankylä', lat: 67.4167, lng: 26.6, region: 'Lappi' },
  { name: 'Tervola', lat: 66.0823, lng: 24.8059, region: 'Lappi' },
  { name: 'Tornio', lat: 65.8481, lng: 24.1447, region: 'Lappi' },
  { name: 'Utsjoki', lat: 69.9076, lng: 27.0252, region: 'Lappi' },
  { name: 'Ylitornio', lat: 66.39, lng: 23.655, region: 'Lappi' },

  // Ahvenanmaa
  { name: 'Brändö', lat: 60.4136, lng: 21.044, region: 'Ahvenanmaa' },
  { name: 'Eckerö', lat: 60.2239, lng: 19.5589, region: 'Ahvenanmaa' },
  { name: 'Finström', lat: 60.3157, lng: 19.8843, region: 'Ahvenanmaa' },
  { name: 'Föglö', lat: 60.0107, lng: 20.4247, region: 'Ahvenanmaa' },
  { name: 'Geta', lat: 60.374, lng: 19.8498, region: 'Ahvenanmaa' },
  { name: 'Hammarland', lat: 60.2197, lng: 19.7378, region: 'Ahvenanmaa' },
  { name: 'Jomala', lat: 60.1523, lng: 19.9489, region: 'Ahvenanmaa' },
  { name: 'Kumlinge', lat: 60.2588, lng: 20.7782, region: 'Ahvenanmaa' },
  { name: 'Kökar', lat: 59.9216, lng: 20.9112, region: 'Ahvenanmaa' },
  { name: 'Lemland', lat: 60.069, lng: 20.086, region: 'Ahvenanmaa' },
  { name: 'Lumparland', lat: 60.1179, lng: 20.2607, region: 'Ahvenanmaa' },
  { name: 'Maarianhamina', lat: 60.1024, lng: 19.9413, region: 'Ahvenanmaa' },
  { name: 'Saltvik', lat: 60.2739, lng: 20.0641, region: 'Ahvenanmaa' },
  { name: 'Sottunga', lat: 60.1286, lng: 20.6685, region: 'Ahvenanmaa' },
  { name: 'Sund', lat: 60.253, lng: 20.1199, region: 'Ahvenanmaa' },
  { name: 'Vårdö', lat: 60.2422, lng: 20.3744, region: 'Ahvenanmaa' },
];

/**
 * Region -> its municipalities, in the order above and alphabetical within each.
 * Finnish collation: å, ä and ö sort after z, so Ähtäri is last in
 * Etelä-Pohjanmaa rather than second.
 */
export const MUNICIPALITIES_BY_REGION: { region: string; items: Municipality[] }[] =
  REGIONS.map((region) => ({
    region,
    items: MUNICIPALITIES.filter((m) => m.region === region).sort((a, b) =>
      a.name.localeCompare(b.name, 'fi')
    ),
  }));

/** Diacritic- and case-insensitive, so "jarvenpaa" finds Järvenpää. */
export function normalizeSearch(v: string): string {
  return v
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

export function searchMunicipalities(query: string): Municipality[] {
  const q = normalizeSearch(query);
  if (!q) return [];
  // Exact before prefix before anywhere-in: typing "ii" should offer Ii, the
  // municipality, ahead of Iisalmi and Iitti.
  const exact: Municipality[] = [];
  const starts: Municipality[] = [];
  const contains: Municipality[] = [];
  for (const m of MUNICIPALITIES) {
    const n = normalizeSearch(m.name);
    if (n === q) exact.push(m);
    else if (n.startsWith(q)) starts.push(m);
    else if (n.includes(q) || normalizeSearch(m.region).includes(q)) contains.push(m);
  }
  return [...exact, ...starts, ...contains];
}
