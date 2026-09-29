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

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

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
  const adminUrl = `${SITE_URL}/admin/bookings`;

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
      subject: `Новая заявка: ${b.vehicleTitle} — ${b.contactPhone}`,
      text: [...rows.map(([k, v]) => `${k}: ${v}`), "", adminUrl].join("\n"),
      html: `<table cellpadding="6" style="font-family:Arial,sans-serif;font-size:14px">${rows
        .map(([k, v]) => `<tr><td style="color:#666">${k}</td><td><b>${esc(v)}</b></td></tr>`)
        .join("")}</table><p><a href="${adminUrl}">Открыть заявки в админке</a></p>`,
    });
  } catch (err) {
    console.error("Не удалось отправить уведомление о заявке", err);
  }
}
