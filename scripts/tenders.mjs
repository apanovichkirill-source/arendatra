// Мониторинг тендеров по Коми и НАО: стройка, дороги, спецтехника, перевозка вахт.
// Источник — открытое API ГосПлан (данные ЕИС zakupki.gov.ru по 44-ФЗ, 223-ФЗ и ПП РФ 615).
// Отчёт: 1) закупки, где можем подать заявку сами; 2) победители контрактов — кому предложить технику в субаренду;
// 3) открытые стройки — после итогов звонить победителю.
//
// Запуск: node scripts/tenders.mjs [--days 7] [--all] [--no-mail]
//   --days N   за сколько дней смотреть при первом запуске (дальше — с прошлого запуска), максимум 30
//   --all      показать всё за период, а не только новое
//   --no-mail  не отправлять письмо, только сохранить отчёт
// Окружение: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, TENDERS_EMAIL (или NOTIFY_EMAIL), TENDERS_DIR,
// GOSPLAN_URL и GOSPLAN_PAUSE_MS (пауза между запросами; на платном доступе можно меньше).
// Работает только с российского IP (сервер в Москве): ГосПлан и ЕИС режут зарубежные адреса.
import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const flag = (name) => args.includes(name);
const opt = (name, def) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : def;
};

const API = (process.env.GOSPLAN_URL ?? "https://v2test.gosplan.info").replace(/\/$/, "");
const DIR = path.resolve(process.env.TENDERS_DIR ?? "data/tenders");
const STATE_FILE = path.join(DIR, "state.json");
const REGIONS = [11, 83]; // Республика Коми, Ненецкий АО
const DAYS = Math.min(Number(opt("--days", 7)) || 7, 30);
const API_PAUSE = Number(process.env.GOSPLAN_PAUSE_MS ?? 6500); // тестовый доступ ГосПлана: 10 запросов в минуту
const MAX_ENRICH = 40; // сколько контрактов дочитывать за запуск ради контактов

// ——— Что ищем ———

// Наш парк и услуги: если это в предмете закупки, можем участвовать сами
const EQUIP = [
  /автокран/, /кран[а-яё]* на автомобильном/, /грузоподъ[её]мн[а-яё]* (механизм|техник|кран)/,
  /автовышк/, /автогидроподъ[её]мник/, /подъ[её]мник[а-яё]* (автомобильн|телескоп)/, /(^|[^а-яё])агп([^а-яё]|$)/,
  /экскаватор/, /бульдозер/, /спецтехник/, /специальн[а-яё]* техник/, /дорожно-строительн[а-яё]* техник/,
  /вахтов/, /перевозк[а-яё]* (работник|персонал|сотрудник|пассажир|вахт|людей)/,
  /транспортн[а-яё]* (обслуживан|услуг)/, /аренд[а-яё]* (транспорт|техник|автомоб|машин|спецтехник|экскаватор|крана|автокран)/,
  /предоставлени[а-яё]* (техник|транспорт|автотранспорт|спецтехник)/, /услуг[а-яё]* (спец)?техник/, /услуг[а-яё]* автотранспорт/,
  /земляны[а-яё]* работ/, /планировк[а-яё]* (территор|грунт|площад)/, /отсыпк/, /расчистк/,
  /вывоз[а-яё]* снег/, /уборк[а-яё]* снег/, /очистк[а-яё]* от снег/, /погрузочно-разгрузочн/,
];
// Не наше: покупка техники, запчасти, ремонт чужих машин, страховки
const EXCLUDE = [
  /запасн[а-яё]* част/, /запчаст/, /(^|[^а-яё])шин[ыа]?([^а-яё]|$)/, /смазочн/, /горюче-смазочн/, /топлив/,
  /ремонт[а-яё]* (и техническ[а-яё]* обслуживани[а-яё]* )?(экскаватор|бульдозер|автокран|автомоб|транспортн|техник|спецтехник)/,
  /техническ[а-яё]* обслуживани[а-яё]* (автомоб|транспорт|техник)/, /страхован/, /лизинг/,
  /(поставк|приобретени|закупк)[а-яё]* (нового |новых )?(автомоб|экскаватор|бульдозер|автокран|техник|спецтехник|транспортн)/,
];
// Стройка и дороги: технику там нанимают подрядчики-победители
const CONSTRUCTION = [
  /строительств/, /реконструкц/, /капитальн[а-яё]* ремонт/, /ремонт[а-яё]* (автомобильн|дорог|моста|мостов|улиц|проезд|участк)/,
  /содержани[а-яё]* (автомобильн|дорог|улиц)/, /благоустройств/, /(^|[^а-яё])снос/, /демонтаж/, /обустройств/,
  /сет[ейи] (водо|тепло|газо|электро)/, /(водо|тепло|газо)провод/, /канализац/, /берегоукреплен/, /рекультивац/,
];
const DIRECT_OKPD = ["77.32", "77.39", "43.99.90", "43.12", "49.39", "49.41", "81.29.12", "52.21"];
const CONSTRUCTION_OKPD = ["41", "42", "43"];

// Расстояние от базы (Усинск, пгт Парма): чем ближе — тем выше в отчёте
const GEO = [
  [5, /усинск/], [5, /(^|[^а-яё])парм[аеыу]([^а-яё]|$)/], [5, /возей/], [4, /харьяг/], [4, /нарьян-мар/],
  [4, /ненецк/], [4, /печор/], [4, /кожв/], [3, /(^|[^а-яё])инт[аеыу]([^а-яё]|$)|интинск/], [3, /воркут/],
  [3, /вуктыл/], [3, /ижм[аеыу]|ижемск/], [3, /усть-цильм/], [2, /ухт[аеыу]|ухтинск/], [2, /сосногорск/],
  [2, /нижн[а-яё]* одес/], [2, /троицко-печорск/],
];

// ——— Утилиты ———

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const lower = (s) => String(s ?? "").toLowerCase().replace(/ё/g, "е");
const reTest = (list, text) => list.some((re) => re.test(text));
const day = (d) => d.toISOString().slice(0, 10);
const money = (n) =>
  n == null || n === "" || Number.isNaN(Number(n))
    ? "—"
    : new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 0 }).format(Number(n)) + " ₽";
const dateRu = (s) => (s ? new Date(s).toLocaleDateString("ru-RU", { timeZone: "Europe/Moscow" }) : "—");
const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

let lastCall = 0;
// ГосПлан на тяжёлых запросах рвёт соединение через ~60 с — долго ждать и много раз повторять бесполезно
async function api(p, params = {}, tries = 4) {
  const q = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) for (const x of [].concat(v)) if (x != null) q.append(k, String(x));
  const url = `${API}${p}${q.size ? `?${q}` : ""}`;
  for (let attempt = 0; attempt < tries; attempt++) {
    const wait = lastCall + API_PAUSE - Date.now();
    if (wait > 0) await sleep(wait);
    lastCall = Date.now();
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(45_000), headers: { Accept: "application/json" } });
      if (res.status === 429) {
        await sleep((Number(res.headers.get("retry-after")) || 30) * 1000);
        continue;
      }
      if (res.status === 404) return null;
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${(await res.text()).slice(0, 200)}`);
      return await res.json();
    } catch (err) {
      console.warn(`  ${p}: ${err.cause?.code ?? err.message} (попытка ${attempt + 1})`);
      await sleep(3000 * (attempt + 1));
    }
  }
  throw new Error(`ГосПлан не отвечает: ${url}`);
}

// Обход любого JSON: имена полей у 44-ФЗ, 223-ФЗ и 615 разные, поэтому ищем по смыслу ключей
function walk(node, fn, trail = []) {
  const entries = Array.isArray(node) ? node.entries() : node && typeof node === "object" ? Object.entries(node) : [];
  for (const [k, v] of entries) {
    fn(k, v, trail);
    walk(v, fn, [...trail, k]);
  }
}

function allText(rec) {
  const out = [];
  walk(rec, (_k, v) => typeof v === "string" && v.length > 3 && !/^[\d.:T+-]+$/.test(v) && out.push(v));
  return out.join(" ");
}

function okpdCodes(rec) {
  const out = new Set();
  walk(rec, (k, v, trail) => {
    if (typeof v !== "string" || !/^\d{2}(\.\d{1,3}){0,4}(-\d+)?$/.test(v)) return;
    if ([...trail, k].some((s) => typeof s === "string" && /okpd|ktru/i.test(s))) out.add(v);
  });
  return [...out];
}

function firstValue(rec, keyRe, pred = (v) => v != null && v !== "") {
  let found;
  walk(rec, (k, v) => {
    if (found === undefined && typeof k === "string" && keyRe.test(k) && typeof v !== "object" && pred(v)) found = v;
  });
  return found;
}

const normPhone = (s) => {
  const d = String(s).replace(/\D/g, "");
  if (d.length === 11 && /^[78]/.test(d)) return `+7 ${d.slice(1, 4)} ${d.slice(4, 7)}-${d.slice(7, 9)}-${d.slice(9)}`;
  if (d.length === 10) return `+7 ${d.slice(0, 3)} ${d.slice(3, 6)}-${d.slice(6, 8)}-${d.slice(8)}`;
  return String(s).trim();
};

// Участники с ролью (поставщик, подрядчик, заказчик): группы полей с ИНН, названием, телефоном, почтой
function parties(rec, roleRe) {
  const groups = new Map();
  walk(rec, (k, v, trail) => {
    if (v == null || typeof v === "object") return;
    const full = [...trail, k];
    // группа — самый глубокий узел с ролью (suppliers/supplier/0); плоские supplier_inn, supplier_name — одна группа
    const j = trail.findLastIndex((s) => typeof s === "string" && roleRe.test(s));
    let key;
    if (j >= 0) {
      let end = j + 1;
      if (typeof full[end] === "number") end++;
      key = full.slice(0, end).join("/");
    } else if (typeof k === "string" && roleRe.test(k)) key = `${trail.join("/")}#flat`;
    else return;
    const g = groups.get(key) ?? { phones: new Set(), emails: new Set(), person: {} };
    groups.set(key, g);
    const s = String(v).trim();
    const kk = typeof k === "string" ? k : "";
    if ((/inn$/i.test(kk) || typeof k === "number") && /^\d{10}(\d{2})?$/.test(s)) g.inn ??= s;
    else if (/mail/i.test(kk) || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)) {
      if (s.includes("@")) g.emails.add(s.toLowerCase());
    } else if (/phone|tel/i.test(kk)) {
      if (s.replace(/\D/g, "").length >= 6) g.phones.add(normPhone(s));
    }
    else if (/full_?name/i.test(kk)) g.fullName ??= s;
    else if (/short_?name/i.test(kk)) g.shortName ??= s;
    else if (/^(last|first|middle)_?name$/i.test(kk)) g.person[kk.toLowerCase().slice(0, 1)] ??= s;
    else if (/(^|_)name$|firm|^title$/i.test(kk)) g.name ??= s;
    else if (/address|location/i.test(kk) && s.length > 10) g.address ??= s;
  });
  return [...groups.values()]
    .map((g) => ({
      inn: g.inn,
      name: g.shortName ?? g.fullName ?? g.name ?? ([g.person.l, g.person.f, g.person.m].filter(Boolean).join(" ") || undefined),
      fullName: g.fullName,
      address: g.address,
      phones: [...g.phones],
      emails: [...g.emails],
    }))
    .filter((p) => p.inn || p.name);
}

function mergeParty(list) {
  const byKey = new Map();
  for (const p of list) {
    const key = p.inn ?? p.name;
    const prev = byKey.get(key);
    if (!prev) byKey.set(key, { ...p, phones: [...p.phones], emails: [...p.emails] });
    else {
      prev.name ??= p.name;
      prev.fullName ??= p.fullName;
      prev.address ??= p.address;
      for (const x of p.phones) if (!prev.phones.includes(x)) prev.phones.push(x);
      for (const x of p.emails) if (!prev.emails.includes(x)) prev.emails.push(x);
    }
  }
  return [...byKey.values()];
}

// ——— Классификация ———

function classify(rec) {
  const subject = String(
    rec.object_info ?? rec.subject ?? rec.name ?? firstValue(rec, /subject|object_info|purchase_object|name$/i) ?? "",
  ).trim();
  const okpd = okpdCodes(rec);
  const text = lower(subject + " " + allText(rec));
  const subj = lower(subject);
  const direct =
    (reTest(EQUIP, subj) || okpd.some((c) => DIRECT_OKPD.some((p) => c.startsWith(p)))) && !reTest(EXCLUDE, subj);
  const construction =
    okpd.some((c) => CONSTRUCTION_OKPD.some((p) => c.startsWith(p + ".") || c === p)) || reTest(CONSTRUCTION, subj);
  const kind = direct ? "direct" : construction ? "construction" : null;
  const geo = Math.max(0, ...GEO.filter(([, re]) => re.test(text)).map(([w]) => w));
  return { subject, okpd, kind, geo };
}

function score(item) {
  const p = Number(item.price) || 0;
  return (
    item.geo * 2 +
    (item.kind === "direct" ? 6 : 0) +
    (item.region === 83 ? 2 : 0) +
    (p >= 1e8 ? 4 : p >= 1e7 ? 3 : p >= 1e6 ? 2 : p >= 3e5 ? 1 : 0)
  );
}

// ——— Загрузка ———

// Свежие записи страницами от новых к старым, пока не дойдём до начала периода.
// Запросы с диапазоном дат и обратной сортировкой ГосПлан не тянет — обрывает соединение.
const PAGE = 50;
async function loadRange(endpoint, from, _to, extra = {}) {
  const out = [];
  for (let skip = 0; skip <= 1000; skip += PAGE) {
    const page = await api(endpoint, { region: REGIONS, sort: "published_at_desc", limit: PAGE, skip, ...extra });
    const rows = Array.isArray(page) ? page : (page?.items ?? page?.data ?? []);
    out.push(...rows.filter((r) => !r.published_at || new Date(r.published_at) >= from));
    const oldest = rows.at(-1)?.published_at;
    if (rows.length < PAGE || (oldest && new Date(oldest) < from)) break;
    if (skip + PAGE > 1000) console.warn(`  ${endpoint}: дошли до предела 1050 записей, более старые пропущены`);
  }
  console.log(`  ${endpoint}: ${out.length}`);
  return out;
}

const SOURCES = {
  purchases: [
    { law: "44-ФЗ", endpoint: "/fz44/purchases", extra: { stage: "1" } },
    { law: "223-ФЗ", endpoint: "/fz223/purchases", extra: { stage: "1" } },
    { law: "ПП 615", endpoint: "/pprf615/purchases", extra: { stage: "1" } },
  ],
  contracts: [
    { law: "44-ФЗ", endpoint: "/fz44/contracts" },
    { law: "223-ФЗ", endpoint: "/fz223/contracts" },
    { law: "ПП 615", endpoint: "/pprf615/contracts" },
  ],
};

const purchaseLink = (law, num) =>
  `https://zakupki.gov.ru/epz/order/extendedsearch/results.html?searchString=${num}` +
  (law === "223-ФЗ" ? "&fz223=on" : law === "ПП 615" ? "&ppRf615=on" : "&fz44=on");
const contractLink = (law, num) =>
  law === "44-ФЗ"
    ? `https://zakupki.gov.ru/epz/contract/contractCard/common-info.html?reestrNumber=${num}`
    : law === "223-ФЗ"
      ? `https://zakupki.gov.ru/epz/contractfz223/search/results.html?searchString=${num}`
      : `https://zakupki.gov.ru/epz/contract/extendedsearch/results.html?searchString=${num}`;
const companyLink = (inn) => `https://www.rusprofile.ru/search?query=${inn}`;
const isNum = (v) => v !== "" && v != null && !Number.isNaN(Number(v));

function toPurchase(rec, law) {
  const c = classify(rec);
  const number = String(rec.purchase_number ?? rec.registration_number ?? rec.reg_number ?? firstValue(rec, /purchase_?number/i) ?? "");
  return {
    id: `${law}:${number}`,
    law,
    number,
    region: Number(rec.region) || null,
    price: rec.max_price ?? firstValue(rec, /max_?price|price/i, isNum),
    deadline: rec.collecting_finished_at ?? rec.submission_close_at ?? firstValue(rec, /finish|close|end_?date/i),
    published: rec.published_at,
    customerInn: [].concat(rec.customers ?? rec.customer ?? rec.placer ?? [])[0],
    link: purchaseLink(law, number),
    ...c,
  };
}

const SUPPLIER_ROLE = /supplier|contractor|participant|winner|executor/i;

function toContract(rec, law) {
  const c = classify(rec);
  const number = String(rec.reg_num ?? rec.registration_number ?? rec.reg_number ?? firstValue(rec, /reg_?num/i) ?? "");
  return {
    id: `${law}:${number}`,
    law,
    number,
    endpoint: SOURCES.contracts.find((s) => s.law === law).endpoint,
    region: Number(rec.region) || null,
    price: rec.price ?? rec.contract_price ?? firstValue(rec, /price|sum/i, isNum),
    signed: rec.sign_date ?? rec.signed_at ?? firstValue(rec, /sign/i) ?? rec.published_at,
    published: rec.published_at,
    customerInn: [].concat(rec.customers ?? rec.customer ?? [])[0],
    suppliers: mergeParty(parties(rec, SUPPLIER_ROLE)),
    link: contractLink(law, number),
    ...c,
  };
}

// Карточка контракта в ЕИС: телефон и почта поставщика (раздел «Информация о поставщиках»)
let eisAlive = true;
async function contactsFromEis(contract) {
  const none = { phones: [], emails: [] };
  if (!eisAlive || contract.law !== "44-ФЗ") return none;
  try {
    const res = await fetch(contract.link, {
      signal: AbortSignal.timeout(30_000),
      headers: { "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36" },
    });
    if (!res.ok) return none;
    const html = await res.text();
    const i = html.search(/Информация о поставщик/i);
    const part = (i >= 0 ? html.slice(i, i + 20000) : html).replace(/<[^>]+>/g, " ").replace(/&nbsp;|&#160;/g, " ");
    const emails = [...new Set((part.match(/[\w.+-]+@[\w-]+(\.[\w-]+)+/g) ?? []).map((e) => e.toLowerCase()))];
    const phones = [...new Set((part.match(/(\+7|8)[\s(-]*\d{3,5}[\s)-]*\d{1,3}[\s-]?\d{2}[\s-]?\d{2}/g) ?? []).map(normPhone))];
    await sleep(1500);
    return { phones, emails };
  } catch {
    eisAlive = false; // с зарубежного IP ЕИС не открывается — дальше не тратим время
    return none;
  }
}

const orgCache = {};
let orgFails = 0;
async function orgInfo(inn, law) {
  if (!inn) return null;
  if (orgCache[inn] !== undefined) return orgCache[inn];
  if (orgFails >= 3) return null;
  const ep = law === "223-ФЗ" ? "/fz223/organizations" : "/fz44/organizations";
  let info = null;
  try {
    const res = await api(ep, { inn, limit: 1 }, 2);
    orgFails = 0;
    const rec = Array.isArray(res) ? res[0] : res;
    if (rec) {
      const p = parties({ org: rec }, /^org$/)[0];
      info = { name: p?.name ?? p?.fullName ?? null, address: p?.address ?? null };
    }
  } catch (err) {
    console.warn(`  организация ${inn}: ${err.message}`);
    orgFails++;
    return null; // не кешируем сбой — попробуем в следующий раз
  }
  orgCache[inn] = info;
  return info;
}

// ——— Отчёт ———

function partyHtml(p) {
  const contacts = [
    ...p.phones.map((t) => `<a href="tel:${t.replace(/[^\d+]/g, "")}">${esc(t)}</a>`),
    ...p.emails.map((e) => `<a href="mailto:${esc(e)}">${esc(e)}</a>`),
  ];
  return (
    `<b>${esc(p.name ?? "Без названия")}</b>` +
    (p.inn ? ` · ИНН <a href="${companyLink(p.inn)}">${p.inn}</a>` : "") +
    `<br>${contacts.length ? contacts.join(" · ") : '<span style="color:#b45309">контакты не найдены — открой карточку или Rusprofile по ИНН</span>'}` +
    (p.address ? `<br><span style="color:#666">${esc(p.address)}</span>` : "")
  );
}

const tag = (bg, fg, text) => `<span style="background:${bg};color:${fg};padding:1px 6px;border-radius:4px">${text}</span> `;
const geoTag = (it) => (it.geo >= 4 ? tag("#dcfce7", "#166534", "рядом с базой") : it.geo >= 2 ? tag("#fef9c3", "#854d0e", "север Коми") : "");
const newTag = (it) => (it.isNew ? tag("#dbeafe", "#1e40af", "новое") : "");
const regionName = (r) => (r === 83 ? "НАО" : r === 11 ? "Коми" : "");
const card = (inner) => `<div style="border:1px solid #e5e7eb;border-radius:8px;padding:10px 12px;margin:8px 0">${inner}</div>`;

function purchaseHtml(p) {
  return card(
    `${newTag(p)}${geoTag(p)}<b>${esc(p.subject || "Предмет не указан")}</b><br>` +
      `НМЦК ${money(p.price)} · приём заявок до <b>${dateRu(p.deadline)}</b> · ${p.law} · ${regionName(p.region)}<br>` +
      `Заказчик: ${esc(p.customer?.name ?? p.customerInn ?? "—")}${p.customer?.address ? `, ${esc(p.customer.address)}` : ""}<br>` +
      `<a href="${p.link}">№ ${p.number} в ЕИС</a>`,
  );
}

function contractHtml(c) {
  return card(
    `${newTag(c)}${geoTag(c)}<b>${esc(c.subject || "Предмет не указан")}</b><br>` +
      `Сумма ${money(c.price)} · заключён ${dateRu(c.signed)} · ${c.law} · ${regionName(c.region)}<br>` +
      `Заказчик: ${esc(c.customer?.name ?? c.customerInn ?? "—")}<br>` +
      (c.suppliers.length ? c.suppliers.map((s) => `Победитель: ${partyHtml(s)}`).join("<br>") : "Победитель: см. карточку") +
      `<br><a href="${c.link}">Контракт № ${c.number} в ЕИС</a>`,
  );
}

function buildReport({ direct, winners, building, from, to, stats }) {
  const section = (title, hint, items, render) =>
    `<h2 style="font-size:18px;margin:24px 0 4px">${title} (${items.length})</h2><p style="color:#555;margin:0 0 8px">${hint}</p>` +
    (items.length ? items.map(render).join("") : '<p style="color:#888">Ничего подходящего за период.</p>');
  return `<!doctype html><html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Тендеры Коми и НАО ${day(to)}</title></head>
<body style="font-family:-apple-system,Segoe UI,Roboto,Arial,sans-serif;font-size:14px;line-height:1.45;color:#111;max-width:860px;margin:0 auto;padding:16px">
<h1 style="font-size:22px;margin:0 0 4px">Тендеры Коми и НАО</h1>
<p style="color:#555;margin:0">Период ${dateRu(from)} — ${dateRu(to)}. Просмотрено закупок: ${stats.purchases}, контрактов: ${stats.contracts}. Сначала то, что ближе к Усинску и крупнее.</p>
${section("1. Можно участвовать самим", "Аренда техники, перевозка вахт, земляные работы, снег — заявки ещё принимаются.", direct, purchaseHtml)}
${section("2. Победители — предложить технику в субаренду", "Подрядчики, которые только что выиграли стройку, дороги или работы с техникой. Звонить в первые дни после контракта.", winners, contractHtml)}
${section("3. Стройки на торгах — следить за итогами", "Заявки ещё принимаются; когда определится победитель, он попадёт в раздел 2.", building, purchaseHtml)}
<p style="color:#888;font-size:12px;margin-top:24px">Источник: ЕИС через открытое API ГосПлан. Коммерческие тендеры ЛУКОЙЛ, Роснефти и др. на собственных площадках сюда не попадают.</p>
</body></html>`;
}

const CSV_HEAD = ["Дата", "Компания", "ИНН", "Телефоны", "Почта", "Предмет", "Сумма", "Заказчик", "Регион", "Ссылка"];
const csvRow = (cells) => cells.map((c) => `"${String(c ?? "").replace(/"/g, '""')}"`).join(";");

async function sendMail(subject, html, attachments) {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  const to = process.env.TENDERS_EMAIL || process.env.NOTIFY_EMAIL;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !to) {
    console.log("SMTP не настроен — письмо не отправлено");
    return;
  }
  const { default: nodemailer } = await import("nodemailer");
  const port = Number(SMTP_PORT) || 465;
  const transport = nodemailer.createTransport({ host: SMTP_HOST, port, secure: port === 465, auth: { user: SMTP_USER, pass: SMTP_PASS } });
  await transport.sendMail({ from: `Арендатра <${SMTP_USER}>`, to, subject, html, attachments });
  console.log(`Письмо отправлено: ${to}`);
}

// ——— Основной ход ———

fs.mkdirSync(DIR, { recursive: true });
const state = fs.existsSync(STATE_FILE) ? JSON.parse(fs.readFileSync(STATE_FILE, "utf8")) : { lastRun: null, seen: {}, orgs: {} };
Object.assign(orgCache, state.orgs ?? {});

const to = new Date();
// день перекрытия: ЕИС публикует с задержкой
const from =
  state.lastRun && !flag("--all")
    ? new Date(Math.max(new Date(state.lastRun).getTime() - 86400000, to.getTime() - 30 * 86400000))
    : new Date(to.getTime() - DAYS * 86400000);
console.log(`Тендеры Коми и НАО: ${day(from)} — ${day(to)}`);

const purchases = [];
for (const s of SOURCES.purchases) {
  try {
    purchases.push(...(await loadRange(s.endpoint, from, to, s.extra)).map((r) => toPurchase(r, s.law)));
  } catch (err) {
    console.error(`  ${s.law} закупки: ${err.message}`);
  }
}
const contracts = [];
for (const s of SOURCES.contracts) {
  try {
    contracts.push(...(await loadRange(s.endpoint, from, to)).map((r) => toContract(r, s.law)));
  } catch (err) {
    console.error(`  ${s.law} контракты: ${err.message}`);
  }
}
if (!purchases.length && !contracts.length) {
  console.error("Ничего не загружено — проверь доступ к ГосПлану (нужен российский IP).");
  process.exit(1);
}

const keep = (it) => flag("--all") || it.isNew;
const byScore = (a, b) => b.score - a.score || (Number(b.price) || 0) - (Number(a.price) || 0);
for (const it of [...purchases, ...contracts]) {
  it.score = score(it);
  it.isNew = !state.seen[it.id];
}

const now = Date.now();
const open = purchases.filter((p) => p.kind && (!p.deadline || new Date(p.deadline).getTime() > now));
const direct = open.filter((p) => p.kind === "direct" && keep(p)).sort(byScore).slice(0, 40);
const building = open
  .filter((p) => p.kind === "construction" && keep(p) && (Number(p.price) || 0) >= 1e6)
  .sort(byScore)
  .slice(0, 30);
const winners = contracts
  .filter((c) => c.kind && keep(c) && (Number(c.price) || 0) >= (c.kind === "direct" ? 2e5 : 1e6))
  .sort(byScore)
  .slice(0, 40);

// Контакты победителей: полный документ контракта, затем карточка ЕИС
// Если документы подряд не отдаются, дальше их не просим (иначе запуск растягивается на часы)
let enriched = 0;
let docFails = 0;
for (const c of winners) {
  const needs = () => !c.suppliers.length || c.suppliers.every((s) => !s.phones.length && !s.emails.length);
  if (needs() && enriched < MAX_ENRICH && docFails < 3) {
    enriched++;
    try {
      const doc = await api(`${c.endpoint}/${c.number}/contract`, {}, 2);
      docFails = 0;
      if (doc) {
        c.suppliers = mergeParty([...c.suppliers, ...parties(doc, SUPPLIER_ROLE)]);
        if (!c.subject) c.subject = classify(doc).subject;
      }
    } catch (err) {
      docFails++;
      console.warn(`  контракт ${c.number}: ${err.message}`);
      if (docFails === 3) console.warn("  ГосПлан не отдаёт документы контрактов — контакты берём из карточек ЕИС");
    }
  }
  if (needs()) {
    const extra = await contactsFromEis(c);
    if (extra.phones.length || extra.emails.length) {
      if (!c.suppliers.length) c.suppliers.push({ phones: [], emails: [] });
      const s = c.suppliers[0];
      s.phones.push(...extra.phones.filter((x) => !s.phones.includes(x)));
      s.emails.push(...extra.emails.filter((x) => !s.emails.includes(x)));
    }
  }
}
for (const it of [...direct, ...building, ...winners]) it.customer = await orgInfo(it.customerInn, it.law);

const found = direct.length + winners.length + building.length;
const html = buildReport({ direct, winners, building, from, to, stats: { purchases: purchases.length, contracts: contracts.length } });
// пустой повторный запуск не затирает утренний отчёт
const reportFile = path.join(DIR, `report-${day(to)}${fs.existsSync(path.join(DIR, `report-${day(to)}.html`)) ? `-${to.getTime()}` : ""}.html`);
if (found) fs.writeFileSync(reportFile, html);

// Таблица контактов для обзвона (копится от запуска к запуску)
const csvRows = winners
  .filter((c) => c.isNew)
  .flatMap((c) =>
    (c.suppliers.length ? c.suppliers : [{ phones: [], emails: [] }]).map((s) =>
      csvRow([dateRu(c.signed), s.name, s.inn, s.phones.join(", "), s.emails.join(", "), c.subject, c.price, c.customer?.name ?? c.customerInn, regionName(c.region), c.link]),
    ),
  );
const csvFile = path.join(DIR, "winners.csv");
if (!fs.existsSync(csvFile)) fs.writeFileSync(csvFile, "﻿" + csvRow(CSV_HEAD) + "\n");
if (csvRows.length) fs.appendFileSync(csvFile, csvRows.join("\n") + "\n");

for (const it of [...purchases, ...contracts]) if (it.kind) state.seen[it.id] ??= day(to);
const cutoff = day(new Date(to.getTime() - 120 * 86400000));
for (const [k, v] of Object.entries(state.seen)) if (v < cutoff) delete state.seen[k];
state.lastRun = to.toISOString();
state.orgs = orgCache;
fs.writeFileSync(STATE_FILE, JSON.stringify(state));

console.log(`Сами: ${direct.length}, победители: ${winners.length}, стройки: ${building.length}.${found ? ` Отчёт: ${reportFile}` : ""}`);
if (!flag("--no-mail") && found) {
  // отчёт уже сохранён — сбой почты не должен ронять запуск
  try {
    await sendMail(
      `Тендеры Коми/НАО ${dateRu(to)}: самим ${direct.length}, победителей ${winners.length}, строек ${building.length}`,
      html,
      csvRows.length
        ? [{ filename: `pobediteli-${day(to)}.csv`, content: "﻿" + [csvRow(CSV_HEAD), ...csvRows].join("\n") + "\n" }]
        : [],
    );
  } catch (err) {
    console.error("Письмо не отправлено:", err.message);
    process.exitCode = 1;
  }
}
