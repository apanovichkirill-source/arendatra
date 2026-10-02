"use server";

import { after } from "next/server";
import { z } from "zod";
import { isValidPhone, normalizePhone } from "@/lib/format";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { notifyCallback } from "@/lib/notify";

export type CallbackState = { status: "idle" | "ok" | "error"; message?: string };

const schema = z.object({
  name: z.string().trim().max(80).optional(),
  phone: z
    .string()
    .min(5, "Укажите номер телефона")
    .refine(isValidPhone, "Номер телефона должен содержать 11 цифр"),
  comment: z.string().trim().max(500).optional(),
  page: z.string().max(200).optional(),
  consent: z.literal("on", { message: "Нужно согласие на обработку персональных данных" }),
});

export async function requestCallback(_prev: CallbackState, formData: FormData): Promise<CallbackState> {
  // Поле-ловушка для ботов: человек его не видит и не заполняет
  if (formData.get("website")) return { status: "ok" };

  const ip = await getClientIp();
  if (!(await checkRateLimit(`callback:${ip}`, 5, 60 * 60 * 1000))) {
    return { status: "error", message: "Слишком много заявок. Позвоните нам или повторите позже." };
  }

  const parsed = schema.safeParse({
    name: formData.get("name") || undefined,
    phone: formData.get("phone") ?? "",
    comment: formData.get("comment") || undefined,
    page: formData.get("page") || undefined,
    consent: formData.get("consent"),
  });
  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message ?? "Проверьте данные формы" };
  }

  const { name, phone, comment, page } = parsed.data;
  after(() =>
    notifyCallback({
      name: name ?? null,
      phone: normalizePhone(phone),
      comment: comment ?? null,
      page: page ?? null,
    })
  );
  return { status: "ok" };
}
