"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/password";
import { createAdminSession, clearAdminSession } from "@/lib/session";

const loginSchema = z.object({
  login: z.string().min(1, "Введите логин"),
  password: z.string().min(1, "Введите пароль"),
});

export type AuthFormState = { error?: string } | undefined;

export async function loginAdmin(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const parsed = loginSchema.safeParse({
    login: formData.get("login"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Проверьте данные формы" };
  }

  const admin = await prisma.admin.findUnique({ where: { login: parsed.data.login } });
  if (!admin || !(await verifyPassword(parsed.data.password, admin.passwordHash))) {
    return { error: "Неверный логин или пароль" };
  }

  await createAdminSession(admin.id);
  redirect("/admin");
}

export async function logoutAdmin() {
  await clearAdminSession();
  redirect("/admin/login");
}
