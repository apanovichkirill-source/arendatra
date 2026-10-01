export type VehiclePhoto = { src: string; alt: string; author: string; license: string; licenseUrl?: string; source: string };

// Иллюстративные фото (Wikimedia Commons, свободные лицензии). Это не снимки конкретных машин каталога.
const POOLS: Record<string, VehiclePhoto[]> = {
  "avtokran": [
    {"src": "/vehicles/avtokran-1.jpg", "alt": "Автокран на городской улице", "author": "High Contrast", "license": "CC BY-SA 3.0", "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/", "source": "https://commons.wikimedia.org/wiki/File:MAZ-5335_based_crane_truck.jpg"},
    {"src": "/vehicles/avtokran-2.jpg", "alt": "Автокран на городской улице", "author": "Georg Pik", "license": "общественное достояние (CC0)", "source": "https://commons.wikimedia.org/wiki/File:Telescope_crane_Klintsy.jpg"},
    {"src": "/vehicles/avtokran-3.jpg", "alt": "Автокран на городской улице", "author": "Nikolai Bulykin", "license": "CC BY-SA 4.0", "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/", "source": "https://commons.wikimedia.org/wiki/File:%D0%92%D0%B5%D0%BB%D0%B8%D0%BA%D0%B8%D0%B5_%D0%9B%D1%83%D0%BA%D0%B8,_%D0%A3%D1%80%D0%B0%D0%BB-%D0%BA%D1%80%D0%B0%D0%BD_%D0%BD%D0%B0_%D0%A1%D0%B5%D0%B2%D0%B5%D1%80%D0%BD%D0%BE%D0%BC_%D0%BC%D0%BE%D1%81%D1%82%D1%83_%D0%B7%D0%B8%D0%BC%D0%BE%D0%B9_(1).jpg"},
    {"src": "/vehicles/avtokran-4.jpg", "alt": "Автокран на городской улице", "author": "Nikolai Bulykin", "license": "CC BY-SA 4.0", "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/", "source": "https://commons.wikimedia.org/wiki/File:%D0%92%D0%B5%D0%BB%D0%B8%D0%BA%D0%B8%D0%B5_%D0%9B%D1%83%D0%BA%D0%B8,_%D0%A3%D1%80%D0%B0%D0%BB-%D0%BA%D1%80%D0%B0%D0%BD_%D0%BD%D0%B0_%D0%A1%D0%B5%D0%B2%D0%B5%D1%80%D0%BD%D0%BE%D0%BC_%D0%BC%D0%BE%D1%81%D1%82%D1%83_%D0%B7%D0%B8%D0%BC%D0%BE%D0%B9_(2).jpg"},
    {"src": "/vehicles/avtokran-5.jpg", "alt": "Автокран на городской улице", "author": "Georg Pik", "license": "общественное достояние (CC0)", "source": "https://commons.wikimedia.org/wiki/File:Chelyabinsk_crane,_plus_series.jpg"},
  ],
  "avtovyshka": [
    {"src": "/vehicles/avtovyshka-1.jpg", "alt": "Автовышка с люлькой на стреле", "author": "Georg Pik", "license": "общественное достояние (CC0)", "source": "https://commons.wikimedia.org/wiki/File:Cherry_picker_UAZ.jpg"},
    {"src": "/vehicles/avtovyshka-2.jpg", "alt": "Автовышка с люлькой на стреле", "author": "Alex Blokha", "license": "CC BY-SA 4.0", "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/", "source": "https://commons.wikimedia.org/wiki/File:Man_Multitel_cherry_picker._Blokha_2.jpg"},
    {"src": "/vehicles/avtovyshka-3.jpg", "alt": "Автовышка с люлькой на стреле", "author": "Artyom Svetlov", "license": "CC BY 4.0", "licenseUrl": "https://creativecommons.org/licenses/by/4.0/", "source": "https://commons.wikimedia.org/wiki/File:Moscow_overhead_contact_line_2024-09_1727172864.jpg"},
    {"src": "/vehicles/avtovyshka-4.jpg", "alt": "Автовышка с люлькой на стреле", "author": "Artyom Svetlov", "license": "CC BY 4.0", "licenseUrl": "https://creativecommons.org/licenses/by/4.0/", "source": "https://commons.wikimedia.org/wiki/File:Moscow_overhead_contact_line_2024-09_1727172887.jpg"},
    {"src": "/vehicles/avtovyshka-5.jpg", "alt": "Автовышка с люлькой на стреле", "author": "Georg Pik", "license": "общественное достояние (CC0)", "source": "https://commons.wikimedia.org/wiki/File:GAZ_bucket_truck.jpg"},
    {"src": "/vehicles/avtovyshka-6.jpg", "alt": "Автовышка с люлькой на стреле", "author": "RG72", "license": "CC BY-SA 4.0", "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/", "source": "https://commons.wikimedia.org/wiki/File:Lavado_de_fasado_de_la_konstrua%C4%B5o_en_strato_Vorovskij_2,_Tjumeno.jpg"},
  ],
  "ekskavator": [
    {"src": "/vehicles/ekskavator-1.jpg", "alt": "Гусеничный экскаватор на площадке", "author": "Georg Pik", "license": "общественное достояние (CC0)", "source": "https://commons.wikimedia.org/wiki/File:Hitachi_Zaxis_200_(Solvychegodsk).jpg"},
    {"src": "/vehicles/ekskavator-2.jpg", "alt": "Гусеничный экскаватор на площадке", "author": "Jonathan Cutrer", "license": "общественное достояние (CC0)", "source": "https://commons.wikimedia.org/wiki/File:Komatsu_PC650LC-11_crawler_hydraulic_excavator.jpg"},
    {"src": "/vehicles/ekskavator-3.jpg", "alt": "Гусеничный экскаватор на площадке", "author": "Daderot", "license": "общественное достояние (CC0)", "source": "https://commons.wikimedia.org/wiki/File:Komatsu_excavator_-_Arlington,_MA.jpg"},
    {"src": "/vehicles/ekskavator-4.jpg", "alt": "Гусеничный экскаватор на площадке", "author": "Tiia Monto", "license": "CC BY-SA 3.0", "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/", "source": "https://commons.wikimedia.org/wiki/File:Komatsu_excavator_2.jpg"},
    {"src": "/vehicles/ekskavator-5.jpg", "alt": "Гусеничный экскаватор на площадке", "author": "Artaxerxes", "license": "CC BY 4.0", "licenseUrl": "https://creativecommons.org/licenses/by/4.0/", "source": "https://commons.wikimedia.org/wiki/File:Komatsu_PC50MR_excavator_Elliot_Street_downtown_Brattleboro_VT_May_2025.jpg"},
  ],
  "buldozer": [
    {"src": "/vehicles/buldozer-1.jpg", "alt": "Гусеничная техника с отвалом", "author": "Denis Blisch", "license": "CC BY-SA 4.0", "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/", "source": "https://commons.wikimedia.org/wiki/File:%D0%96%D0%B5%D0%BB%D1%82%D1%8B%D0%B9_%D0%B1%D1%83%D0%BB%D1%8C%D0%B4%D0%BE%D0%B7%D0%B5%D1%80.jpg"},
    {"src": "/vehicles/buldozer-2.jpg", "alt": "Гусеничная техника с отвалом", "author": "RG72", "license": "CC BY-SA 4.0", "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/", "source": "https://commons.wikimedia.org/wiki/File:Strato_Pionerskaja_en_vila%C4%9Do_Pokrovskoje_(Tjumena_provinco)_02.jpg"},
    {"src": "/vehicles/buldozer-3.jpg", "alt": "Гусеничная техника с отвалом", "author": "RG72", "license": "CC BY-SA 4.0", "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/", "source": "https://commons.wikimedia.org/wiki/File:Buldozo_apud_amaso_da_ne%C4%9Do_(Tjumeno)_01.jpg"},
    {"src": "/vehicles/buldozer-4.jpg", "alt": "Гусеничная техника с отвалом", "author": "RG72", "license": "CC BY-SA 4.0", "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/", "source": "https://commons.wikimedia.org/wiki/File:Buldozo_apud_amaso_da_ne%C4%9Do_(Tjumeno)_02.jpg"},
    {"src": "/vehicles/buldozer-5.jpg", "alt": "Гусеничная техника с отвалом", "author": "RG72", "license": "CC BY-SA 4.0", "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/", "source": "https://commons.wikimedia.org/wiki/File:Buldozo_apud_amaso_da_ne%C4%9Do_(Tjumeno)_03.jpg"},
  ],
  "bus": [
    {"src": "/vehicles/bus-1.jpg", "alt": "Вахтовый автобус на шасси КАМАЗ", "author": "Georg Pik", "license": "общественное достояние (CC0)", "source": "https://commons.wikimedia.org/wiki/File:KamAZ-43502_bus_and_truck_(01).jpg"},
    {"src": "/vehicles/bus-2.jpg", "alt": "Вахтовый автобус на шасси КАМАЗ", "author": "Georg Pik", "license": "общественное достояние (CC0)", "source": "https://commons.wikimedia.org/wiki/File:KamAZ-43502_bus_and_truck_(02).jpg"},
  ],
  "legkovye": [
    {"src": "/vehicles/legkovye-1.jpg", "alt": "Легковой внедорожник УАЗ", "author": "alex74_2011", "license": "CC BY 4.0", "licenseUrl": "https://creativecommons.org/licenses/by/4.0/", "source": "https://commons.wikimedia.org/wiki/File:2018_UAZ_Patriot_Expedition_front.jpg"},
    {"src": "/vehicles/legkovye-2.jpg", "alt": "Легковой внедорожник УАЗ", "author": "Sergey A. Demidov", "license": "CC BY 4.0", "licenseUrl": "https://creativecommons.org/licenses/by/4.0/", "source": "https://commons.wikimedia.org/wiki/File:20250716_UAZ_Patriot_in_Zelenograd.jpg"},
  ],
};

// Тип техники определяется по началу адреса карточки (так названы все машины каталога)
const POOL_BY_PREFIX: [string, string][] = [
  ["avtokran-", "avtokran"],
  ["avtovyshka-", "avtovyshka"],
  ["gusenichnyy-ekskavator", "ekskavator"],
  ["buldozer", "buldozer"],
  ["vahtovyy-avtobus", "bus"],
  ["legkovye-ts", "legkovye"],
];

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

export function vehiclePhoto(slug: string): VehiclePhoto | null {
  const pool = POOL_BY_PREFIX.find(([prefix]) => slug.startsWith(prefix));
  if (!pool) return null;
  const photos = POOLS[pool[1]];
  return photos[hash(slug) % photos.length] ?? null;
}
