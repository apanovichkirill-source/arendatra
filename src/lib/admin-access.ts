import { cache } from "react";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/session";
import { can, type Permission } from "@/lib/admin-permissions";
import { logAudit } from "@/lib/audit";

// Права читаем из БД при каждом запросе: отключение аккаунта или смена прав действует сразу.
export const getCurrentAdmin = cache(async () => {
  const session = await getAdminSession();
  if (!session?.adminId) return null;

  const admin = await prisma.admin.findUnique({
    where: { id: session.adminId },
    select: {
      id: true,
      login: true,
      name: true,
      isSuper: true,
      isActive: true,
      permissions: true,
      passwordChangedAt: true,
    },
  });
  if (!admin || !admin.isActive) return null;

  if (admin.passwordChangedAt && session.iat) {
    if (session.iat < Math.floor(admin.passwordChangedAt.getTime() / 1000)) return null;
  }

  return admin;
});

export async function requireAdminUser() {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}

export async function requirePermission(permission: Permission) {
  const admin = await requireAdminUser();
  if (!can(admin, permission)) {
    await logAudit(admin, "access.denied", { details: `Нужно право: ${permission}` });
    redirect("/admin");
  }
  return admin;
}

export async function requireSuper() {
  const admin = await requireAdminUser();
  if (!admin.isSuper) {
    await logAudit(admin, "access.denied", { details: "Нужны права главного администратора" });
    redirect("/admin");
  }
  return admin;
}
