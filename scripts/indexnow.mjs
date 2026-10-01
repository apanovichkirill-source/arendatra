// Отправляет адреса сайта в поисковые системы по протоколу IndexNow (Яндекс, Bing и др.).
// Запуск: node scripts/indexnow.mjs [адрес сайта]
const SITE = (process.argv[2] ?? "https://xn----7sbabaug8dekkefemmh.xn--p1ai").replace(/\/$/, "");
const KEY = "35382bcac502d8d4bbd5e40fd719b4ff";
const host = new URL(SITE).host;

const sitemap = await (await fetch(`${SITE}/sitemap.xml`)).text();
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
console.log(`Адресов в карте сайта: ${urls.length}`);

for (const endpoint of ["https://yandex.com/indexnow", "https://api.indexnow.org/indexnow"]) {
  for (let i = 0; i < urls.length; i += 9000) {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({ host, key: KEY, keyLocation: `${SITE}/${KEY}.txt`, urlList: urls.slice(i, i + 9000) }),
    });
    console.log(endpoint, res.status, res.statusText);
  }
}
