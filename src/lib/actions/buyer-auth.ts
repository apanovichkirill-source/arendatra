"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { hashPassword, verifyPasswordConstantTime } from "@/lib/password";
import { createBuyerSession, clearBuyerSession } from "@/lib/session";
import { normalizePhone, isValidPhone } from "@/lib/format";
import { isLocked, lockedMessage, nextFailureState } from "@/lib/auth-security";

// Имя и фамилия из букв (кириллица/латиница), без цифр и никнеймов: минимум два слова
const REAL_NAME_REGEX =
  /^[A-Za-zА-ЯЁа-яё]+(?:-[A-Za-zА-ЯЁа-яё]+)?(?:\s+[A-Za-zА-ЯЁа-яё]+(?:-[A-Za-zА-ЯЁа-яё]+)?){1,3}$/;
const CITY_REGEX = /^[A-Za-zА-ЯЁа-яё]+(?:[-\s][A-Za-zА-ЯЁа-яё]+)*$/;

const registerSchema = z.object({
  phone: z
    .string()
    .min(5, "Укажите номер телефона")
    .refine(isValidPhone, "Номер телефона должен содержать 11 цифр"),
  password: z.string().min(6, "Пароль должен быть не короче 6 символов"),
  name: z
    .string()
    .trim()
    .min(1, "Укажите имя и фамилию")
    .regex(REAL_NAME_REGEX, "Укажите настоящее имя и фамилию (не ник и не цифры)"),
  city: z
    .string()
    .trim()
    .min(2, "Укажите город")
    .regex(CITY_REGEX, "Город должен состоять из букв"),
  organization: z.string().trim().max(200).optional(),
  consent: z.literal("on", {
    message: "Нужно согласие на обработку персональных данных",
  }),
});

const loginSchema = z.object({
  phone: z
    .string()
    .min(5, "Укажите номер телефона")
    .refine(isValidPhone, "Номер телефона должен содержать 11 цифр"),
  password: z.string().min(1, "Введите пароль"),
});

export type AuthFormState = { error?: string } | undefined;

export async function registerBuyer(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const parsed = registerSchema.safeParse({
    phone: formData.get("phone"),
    password: formData.get("password"),
    name: formData.get("name"),
    city: formData.get("city"),
    organization: formData.get("organization") || undefined,
    consent: formData.get("consent") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Проверьте данные формы" };
  }

  const phone = normalizePhone(parsed.data.phone);

  const existing = await prisma.buyer.findUnique({ where: { phone } });
  if (existing) {
    return { error: "Пользователь с таким телефоном уже зарегистрирован" };
  }

  const buyer = await prisma.buyer.create({
    data: {
      phone,
      passwordHash: await hashPassword(parsed.data.password),
      name: parsed.data.name,
      city: parsed.data.city,
      organization: parsed.data.organization || null,
      consentAt: new Date(),
    },
  });

  await createBuyerSession(buyer.id);
  redirect("/account");
}

export async function loginBuyer(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const parsed = loginSchema.safeParse({
    phone: formData.get("phone"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Проверьте данные формы" };
  }

  const phone = normalizePhone(parsed.data.phone);
  const buyer = await prisma.buyer.findUnique({ where: { phone } });

  if (buyer && isLocked(buyer.lockedUntil)) {
    return { error: lockedMessage(buyer.lockedUntil) };
  }

  const valid = await verifyPasswordConstantTime(parsed.data.password, buyer?.passwordHash);

  if (!buyer || !valid) {
    if (buyer) {
      await prisma.buyer.update({
        where: { id: buyer.id },
        data: nextFailureState(buyer.failedAttempts),
      });
    }
    return { error: "Неверный телефон или пароль" };
  }

  if (buyer.failedAttempts > 0 || buyer.lockedUntil) {
    await prisma.buyer.update({
      where: { id: buyer.id },
      data: { failedAttempts: 0, lockedUntil: null },
    });
  }

  await createBuyerSession(buyer.id);
  redirect("/account");
}

export async function logoutBuyer() {
  await clearBuyerSession();
  redirect("/");
}
