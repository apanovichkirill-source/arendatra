"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { verifyPasswordConstantTime } from "@/lib/password";
import { createAdminSession, clearAdminSession } from "@/lib/session";
import {
  isLocked,
  lockedMessage,
  nextFailureState,
  LOCKOUT_MINUTES,
  MAX_LOGIN_ATTEMPTS,
} from "@/lib/auth-security";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { logAudit } from "@/lib/audit";
import { getCurrentAdmin } from "@/lib/admin-access";

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

  if (!admin || !valid || !admin.isActive) {
    if (admin) {
      const failure = nextFailureState(admin.failedAttempts);
      await prisma.admin.update({ where: { id: admin.id }, data: failure });
      await logAudit(admin, "admin.login_failed", {
        details: admin.isActive && !valid ? "Неверный пароль" : "Аккаунт отключён",
      });
      if (failure.lockedUntil) {
        await logAudit(admin, "admin.locked", {
          details: `Заблокирован на ${LOCKOUT_MINUTES} мин. после ${MAX_LOGIN_ATTEMPTS} неудачных попыток`,
        });
      }
    } else {
      // введённый логин не записываем: в это поле часто по ошибке попадает пароль
      await logAudit(null, "admin.login_failed", {
        loginOverride: "(неизвестный логин)",
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
  await logAudit(admin, "admin.login");
  redirect("/admin");
}

export async function logoutAdmin() {
  const admin = await getCurrentAdmin();
  if (admin) await logAudit(admin, "admin.logout");
  await clearAdminSession();
  redirect("/admin/login");
}
