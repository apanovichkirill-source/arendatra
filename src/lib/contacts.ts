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

export const WORK_HOURS = "с 8:00 до 20:00";
export const MESSENGER = "MAX";
export const CLIENTS = ["ЛУКОЙЛ", "ННК", "РВП", "Транснефть"];
