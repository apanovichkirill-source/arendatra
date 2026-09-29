import { domainToUnicode } from "node:url";
import nodemailer from "nodemailer";
import { formatPrice } from "@/lib/format";
import { SITE_URL } from "@/lib/site";

export type BookingNotice = {
  id: string;
  vehicleTitle: string;
  city: string | null;
  ownerName: string;
  startAt: Date;
  endAt: Date;
  totalPrice: number | null;
  contactName?: string | null;
  contactPhone: string;
  comment?: string | null;
};

const fmt = (d: Date) =>
  new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Moscow",
  }).format(d);

export async function notifyNewBooking(b: BookingNotice) {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, NOTIFY_EMAIL } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !NOTIFY_EMAIL) return;

  const rows: [string, string][] = [
    ["Техника", `${b.vehicleTitle}${b.city ? `, ${b.city}` : ""}`],
    ["Владелец", b.ownerName],
    ["Период", `${fmt(b.startAt)} — ${fmt(b.endAt)} (МСК)`],
    ["Сумма", formatPrice(b.totalPrice)],
    ["Клиент", b.contactName || "не указано"],
    ["Телефон", b.contactPhone],
    ["Комментарий", b.comment || "—"],
  ];
  const adminUrl = `${domainToUnicode(new URL(SITE_URL).hostname)}/admin/bookings`;

  try {
    const port = Number(SMTP_PORT) || 465;
    const transport = nodemailer.createTransport({
      host: SMTP_HOST,
      port,
      secure: port === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });
    await transport.sendMail({
      from: `Арендатра <${SMTP_USER}>`,
      to: NOTIFY_EMAIL,
      subject: `Новая заявка на бронь: ${b.vehicleTitle}`,
      text: [
        "Поступила новая заявка на бронирование.",
        "",
        ...rows.map(([k, v]) => `${k}: ${v}`),
        "",
        `Все заявки: ${adminUrl}`,
      ].join("\n"),
    });
  } catch (err) {
    console.error("Не удалось отправить уведомление о заявке", err);
  }
}
