"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { hashPassword, verifyPassword } from "@/lib/password";
import { createBuyerSession, clearBuyerSession } from "@/lib/session";
import { normalizePhone } from "@/lib/format";

const registerSchema = z.object({
  phone: z.string().min(5, "Укажите номер телефона"),
  password: z.string().min(6, "Пароль должен быть не короче 6 символов"),
  name: z.string().optional(),
  city: z.string().optional(),
});

const loginSchema = z.object({
  phone: z.string().min(5, "Укажите номер телефона"),
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
    name: formData.get("name") || undefined,
    city: formData.get("city") || undefined,
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

  if (!buyer || !(await verifyPassword(parsed.data.password, buyer.passwordHash))) {
    return { error: "Неверный телефон или пароль" };
  }

  await createBuyerSession(buyer.id);
  redirect("/account");
}

export async function logoutBuyer() {
  await clearBuyerSession();
  redirect("/");
}
