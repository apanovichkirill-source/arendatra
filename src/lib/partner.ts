// Второй сайт, на который ссылаемся (продажа сыпучих материалов и спецтехники).
// Пока адрес не задан переменной окружения PARTNER_URL, ссылки не показываются.
export function partnerUrl(path = "", campaign = "arendatra") {
  const base = (process.env.PARTNER_URL ?? "").replace(/\/$/, "");
  if (!base) return null;
  const sep = path.includes("?") ? "&" : "?";
  return `${base}${path}${sep}utm_source=${campaign}&utm_medium=site`;
}

export const PARTNER_NAME = "Продатра";
