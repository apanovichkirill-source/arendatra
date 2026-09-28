"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { verifyPasswordConstantTime } from "@/lib/password";
import { createAdminSession, clearAdminSession } from "@/lib/session";
import { isLocked, lockedMessage, nextFailureState } from "@/lib/auth-security";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

const loginSchema = z.object({
  login: z.string().min(1, "Введите логин"),
  password: z.string().min(1, "Введите пароль"),
});

export type AuthFormState = { error?: string } | undefined;

export async function loginAdmin(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const ip = await getClientIp();
  if (!(await checkRateLimit(`login-admin:${ip}`, 15, 15 * 60 * 1000))) {
    return { error: "Слишком много попыток. Повторите чуть позже." };
  }

  const parsed = loginSchema.safeParse({
    login: formData.get("login"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Проверьте данные формы" };
  }

  const admin = await prisma.admin.findUnique({ where: { login: parsed.data.login } });

  if (admin && isLocked(admin.lockedUntil)) {
    return { error: lockedMessage(admin.lockedUntil) };
  }

  const valid = await verifyPasswordConstantTime(parsed.data.password, admin?.passwordHash);

  if (!admin || !valid) {
    if (admin) {
      await prisma.admin.update({
        where: { id: admin.id },
        data: nextFailureState(admin.failedAttempts),
      });
    }
    return { error: "Неверный логин или пароль" };
  }

  if (admin.failedAttempts > 0 || admin.lockedUntil) {
    await prisma.admin.update({
      where: { id: admin.id },
      data: { failedAttempts: 0, lockedUntil: null },
    });
  }

  await createAdminSession(admin.id);
  redirect("/admin");
}

export async function logoutAdmin() {
  await clearAdminSession();
  redirect("/admin/login");
}
