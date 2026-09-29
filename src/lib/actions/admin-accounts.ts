"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { hashPassword, verifyPassword } from "@/lib/password";
import { createAdminSession } from "@/lib/session";
import { requireAdminUser, requireSuper } from "@/lib/admin-access";
import { normalizePermissions } from "@/lib/admin-permissions";
import { logAudit } from "@/lib/audit";
import { checkRateLimit } from "@/lib/rate-limit";

export type AccountFormState = { error?: string; success?: string } | undefined;

const MIN_PASSWORD = 10;

const loginSchema = z
  .string()
  .trim()
  .min(3, "Логин — не короче 3 символов")
  .max(32, "Логин — не длиннее 32 символов")
  .regex(/^[a-zA-Z0-9._-]+$/, "Логин: только латинские буквы, цифры и . _ -");

const passwordSchema = z
  .string()
  .min(MIN_PASSWORD, `Пароль — не короче ${MIN_PASSWORD} символов`)
  .max(128, "Пароль слишком длинный");

function readPermissions(formData: FormData) {
  return normalizePermissions(formData.getAll("perm").map(String));
}

export async function createAdminAccount(
  _prev: AccountFormState,
  formData: FormData
): Promise<AccountFormState> {
  const actor = await requireSuper();

  const login = loginSchema.safeParse(formData.get("login"));
  if (!login.success) return { error: login.error.issues[0].message };
  const password = passwordSchema.safeParse(formData.get("password"));
  if (!password.success) return { error: password.error.issues[0].message };

  const name = String(formData.get("name") ?? "").trim().slice(0, 100) || null;
  const permissions = readPermissions(formData);

  if (await prisma.admin.findUnique({ where: { login: login.data } })) {
    return { error: "Аккаунт с таким логином уже существует" };
  }

  const created = await prisma.admin.create({
    data: {
      login: login.data,
      name,
      passwordHash: await hashPassword(password.data),
      permissions,
      isSuper: false,
      isActive: true,
    },
  });

  await logAudit(actor, "account.create", {
    entityType: "admin",
    entityId: created.id,
    details: `${created.login}; права: ${permissions.join(", ") || "нет"}`,
  });
  revalidatePath("/admin/admins");
  redirect("/admin/admins");
}

export async function updateAdminAccount(
  id: string,
  _prev: AccountFormState,
  formData: FormData
): Promise<AccountFormState> {
  const actor = await requireSuper();

  const target = await prisma.admin.findUnique({ where: { id } });
  if (!target) return { error: "Аккаунт не найден" };
  if (target.isSuper) return { error: "Главного администратора изменить нельзя" };

  const name = String(formData.get("name") ?? "").trim().slice(0, 100) || null;
  const permissions = readPermissions(formData);
  const isActive = formData.get("isActive") === "on";

  const newPasswordRaw = String(formData.get("password") ?? "");
  const data: {
    name: string | null;
    permissions: string[];
    isActive: boolean;
    passwordHash?: string;
    passwordChangedAt?: Date;
    failedAttempts?: number;
    lockedUntil?: null;
  } = { name, permissions, isActive };

  if (newPasswordRaw) {
    const password = passwordSchema.safeParse(newPasswordRaw);
    if (!password.success) return { error: password.error.issues[0].message };
    data.passwordHash = await hashPassword(password.data);
    data.passwordChangedAt = new Date();
    data.failedAttempts = 0;
    data.lockedUntil = null;
  }

  await prisma.admin.update({ where: { id }, data });

  const changes: string[] = [];
  if (name !== target.name) changes.push("имя");
  if (isActive !== target.isActive) changes.push(isActive ? "включён" : "отключён");
  if (
    [...permissions].sort().join() !== [...target.permissions].sort().join()
  ) {
    changes.push(`права: ${permissions.join(", ") || "нет"}`);
  }
  if (changes.length || !newPasswordRaw) {
    await logAudit(actor, "account.update", {
      entityType: "admin",
      entityId: id,
      details: `${target.login}${changes.length ? ` — ${changes.join("; ")}` : " — без изменений"}`,
    });
  }
  if (newPasswordRaw) {
    await logAudit(actor, "account.password_reset", {
      entityType: "admin",
      entityId: id,
      details: target.login,
    });
  }

  revalidatePath("/admin/admins");
  redirect("/admin/admins");
}

export async function deleteAdminAccount(id: string) {
  const actor = await requireSuper();
  const target = await prisma.admin.findUnique({ where: { id } });
  if (!target || target.isSuper) return;

  await prisma.admin.delete({ where: { id } });
  await logAudit(actor, "account.delete", {
    entityType: "admin",
    entityId: id,
    details: target.login,
  });
  revalidatePath("/admin/admins");
}

export async function changeOwnPassword(
  _prev: AccountFormState,
  formData: FormData
): Promise<AccountFormState> {
  const me = await requireAdminUser();

  if (!(await checkRateLimit(`admin-pw:${me.id}`, 10, 60 * 60 * 1000))) {
    return { error: "Слишком много попыток. Повторите позже." };
  }

  const current = String(formData.get("current") ?? "");
  const next = passwordSchema.safeParse(formData.get("next"));
  if (!next.success) return { error: next.error.issues[0].message };
  if (formData.get("next") !== formData.get("confirm")) {
    return { error: "Новый пароль и подтверждение не совпадают" };
  }

  const admin = await prisma.admin.findUnique({ where: { id: me.id } });
  if (!admin || !(await verifyPassword(current, admin.passwordHash))) {
    return { error: "Текущий пароль указан неверно" };
  }

  await prisma.admin.update({
    where: { id: me.id },
    data: { passwordHash: await hashPassword(next.data), passwordChangedAt: new Date() },
  });
  // новая сессия сразу после смены, остальные (старые) перестают действовать
  await createAdminSession(me.id);
  await logAudit(me, "profile.password_change", { entityType: "admin", entityId: me.id });

  return { success: "Пароль изменён. Остальные ваши сессии завершены." };
}
