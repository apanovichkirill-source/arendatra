export type ArticleImage = {
  src: string;
  alt: string;
  author: string;
  license: string;
  licenseUrl?: string;
  source: string;
};

// Иллюстрации — свободные фото Wikimedia Commons (показываем лицензию и автора)
export const ARTICLE_IMAGES: Record<string, ArticleImage> = {
  "kak-vybrat-avtokran-25-ili-50-tonn": {
    src: "/articles/kak-vybrat-avtokran-25-ili-50-tonn.jpg",
    alt: "Автокран с телескопической стрелой на выносных опорах",
    author: "AlfvanBeem",
    license: "общественное достояние (CC0)",
    source: "https://commons.wikimedia.org/wiki/File:Faun_mobile_telescope_crane_owned_by_Leemans_pic1.JPG",
  },
  "avtovyshka-agp-kak-vybrat-i-gde-primenyaetsya": {
    src: "/articles/avtovyshka-agp-kak-vybrat-i-gde-primenyaetsya.jpg",
    alt: "Автогидроподъёмник с люлькой на стреле",
    author: "Whoisjohngalt",
    license: "общественное достояние",
    source: "https://commons.wikimedia.org/wiki/File:BlueLine_Rental_Electric_Boom_Lift.jpg",
  },
  "ekskavator-dlya-bolotistogo-grunta": {
    src: "/articles/ekskavator-dlya-bolotistogo-grunta.jpg",
    alt: "Гусеничный экскаватор на строительной площадке",
    author: "Bill Smith",
    license: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0/",
    source: "https://commons.wikimedia.org/wiki/File:CAT_330D_L_crawler_excavator.jpg",
  },
  "buldozer-v-arendu-dlya-kakih-rabot": {
    src: "/articles/buldozer-v-arendu-dlya-kakih-rabot.jpg",
    alt: "Гусеничный бульдозер с широкими гусеницами",
    author: "WindBorneListener",
    license: "общественное достояние (CC0)",
    source: "https://commons.wikimedia.org/wiki/File:John_Deere_850K_LGP_Bulldozer_Overhead_View.jpg",
  },
  "vahtovyy-avtobus-kak-zakazat-perevozku-brigady": {
    src: "/articles/vahtovyy-avtobus-kak-zakazat-perevozku-brigady.jpg",
    alt: "Вахтовый автобус повышенной проходимости",
    author: "Artem Svetlov",
    license: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0/",
    source: "https://commons.wikimedia.org/wiki/File:Ural_Next_shift_bus_with_methane-diesel_engine.jpg",
  },
  "kak-arendovat-spetstehniku-poshagovo": {
    src: "/articles/kak-arendovat-spetstehniku-poshagovo.jpg",
    alt: "Строительная площадка с экскаваторами и кранами",
    author: "Fons Heijnsbroek",
    license: "общественное достояние (CC0)",
    source: "https://commons.wikimedia.org/wiki/File:2014.03_-_Excavation_site_with_cranes,_diggers_and_building_equipment,_along_the_canal_water;_a_geotagged_free_urban_picture,_in_public_domain_Commons_CCO;_city_photography_by_Fons_Heijnsbroek,_The_Netherlands_(13911774369).jpg",
  },
  "iz-chego-skladyvaetsya-stoimost-arendy-spetstehniki": {
    src: "/articles/iz-chego-skladyvaetsya-stoimost-arendy-spetstehniki.jpg",
    alt: "Автокран на городской улице",
    author: "Syced",
    license: "общественное достояние (CC0)",
    source: "https://commons.wikimedia.org/wiki/File:Crane_truck_in_Hiroo.jpg",
  },
  "kak-rasschitat-skolko-chasov-nuzhna-tehnika": {
    src: "/articles/kak-rasschitat-skolko-chasov-nuzhna-tehnika.jpg",
    alt: "Гусеничный экскаватор за работой",
    author: "Arvell Dorsey Jr.",
    license: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0/",
    source: "https://commons.wikimedia.org/wiki/File:CAT_336F_L_Excavator.jpg",
  },
  "spetstehnika-na-severe-zimniki-moroz-sezonnost": {
    src: "/articles/spetstehnika-na-severe-zimniki-moroz-sezonnost.jpg",
    alt: "Северный город зимой, вид сверху",
    author: "Quadro86",
    license: "общественное достояние",
    source: "https://commons.wikimedia.org/wiki/File:%D0%A3%D1%81%D0%B8%D0%BD%D1%81%D0%BA_%D0%B2%D0%B8%D0%B4_%D1%81_%D0%BF%D1%82%D0%B8%D1%87%D1%8C%D0%B5%D0%B3%D0%BE_%D0%BF%D0%BE%D0%BB%D1%91%D1%82%D0%B0.jpg",
  },
  "podgotovka-ploshchadki-dlya-avtokrana-i-avtovyshki": {
    src: "/articles/podgotovka-ploshchadki-dlya-avtokrana-i-avtovyshki.jpg",
    alt: "Автокран на выносных опорах во время работ",
    author: "автор не указан",
    license: "общественное достояние",
    source: "https://commons.wikimedia.org/wiki/File:Mobile_telescopic_crane_of_the_JSDF_salvaging_a_fuel_tanker.jpg",
  },
  "arenda-ili-pokupka-spetstehniki": {
    src: "/articles/arenda-ili-pokupka-spetstehniki.jpg",
    alt: "Гусеничный бульдозер на площадке",
    author: "Wikideas1",
    license: "общественное достояние (CC0)",
    source: "https://commons.wikimedia.org/wiki/File:Bulldozer_2.jpg",
  },
  "avtovyshka-dlya-obsluzhivaniya-osveshcheniya-i-fasadov": {
    src: "/articles/avtovyshka-dlya-obsluzhivaniya-osveshcheniya-i-fasadov.jpg",
    alt: "Замена уличного освещения с помощью подъёмника",
    author: "Cybularny",
    license: "общественное достояние (CC0)",
    source: "https://commons.wikimedia.org/wiki/File:28-05-2018_Warszawa_Jagiello%C5%84ska_wymiana_o%C5%9Bwietlenia,_2.jpg",
  },
  "kakaya-tehnika-nuzhna-na-neftegazovom-obekte": {
    src: "/articles/kakaya-tehnika-nuzhna-na-neftegazovom-obekte.jpg",
    alt: "Монтаж трубопровода на северном объекте",
    author: "Svetlana Ivanova",
    license: "CC BY 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by/3.0/",
    source: "https://commons.wikimedia.org/wiki/File:The_oil_pipeline_Eastern_Siberia_-_Pacific_ocean_-_%D0%9F%D0%B5%D1%80%D0%B5%D1%85%D0%BE%D0%B4_%D1%82%D1%80%D1%83%D0%B1%D0%BE%D0%BF%D1%80%D0%BE%D0%B2%D0%BE%D0%B4%D0%B0_%D0%92%D0%A1%D0%A2%D0%9E_%D1%87%D0%B5%D1%80%D0%B5%D0%B7_%D1%80._%D0%91._%D0%9D%D0%B8%D0%BC%D0%BD%D1%8B%D1%80,_2009_%D0%B3._-_panoramio.jpg",
  },
  "kak-pravilno-podat-zayavku-na-tehniku": {
    src: "/articles/kak-pravilno-podat-zayavku-na-tehniku.jpg",
    alt: "Подъёмник с телескопической стрелой",
    author: "PvOberstein",
    license: "общественное достояние (CC0)",
    source: "https://commons.wikimedia.org/wiki/File:Geniue_Z-139_lift.jpg",
  },
  "zemlyanye-raboty-v-rasputitsu-i-vesnoy": {
    src: "/articles/zemlyanye-raboty-v-rasputitsu-i-vesnoy.jpg",
    alt: "Гусеничный трактор с бульдозерным отвалом",
    author: "George Chernilevsky",
    license: "общественное достояние",
    source: "https://commons.wikimedia.org/wiki/File:Tractor_DT-75_Bulldozer_2017_G1.jpg",
  },
};
