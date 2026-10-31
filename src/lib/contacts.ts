// Первый номер — основной (он же в Яндекс Бизнесе и на картах)
export const PHONES = [
  { tel: "+79121266664", display: "+7 912 126-66-64" },
  { tel: "+79121263013", display: "+7 912 126-30-13" },
] as const;

// База: отсюда техника выходит на объекты, этот город везде показываем первым
export const BASE_CITY = "Усинск";
export const ADDRESS = {
  region: "Республика Коми",
  city: "Усинск",
  locality: "пгт Парма",
  street: "ул. Луговая, 59А",
  full: "Республика Коми, г. Усинск, пгт Парма, ул. Луговая, 59А",
  short: "Усинск, пгт Парма, ул. Луговая, 59А",
} as const;

// Имя должно совпадать с профилем на Яндекс Исполнителях — по нему Яндекс подтверждает сайт
export const OWNER_NAME = "Кирилл Апанович";

// Наши карточки на площадках: в разметке sameAs и ссылки «отзывы» на сайте
export const PROFILES = {
  yandexMaps: "https://yandex.ru/maps/org/arendatra/228262412590/",
  yandexReviews: "https://yandex.ru/maps/org/arendatra/228262412590/reviews/",
  yandexUslugi: "https://uslugi.yandex.ru/profile/KirillApanovich-3443933",
} as const;

export const WORK_HOURS = "с 8:00 до 20:00";
export const MESSENGER = "MAX";
export const CLIENTS = ["ЛУКОЙЛ", "ННК", "РВП", "Транснефть"];
