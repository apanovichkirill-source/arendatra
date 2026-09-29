import { prisma } from "@/lib/prisma";
import { getClientIp } from "@/lib/rate-limit";

export const AUDIT_ACTION_LABELS: Record<string, string> = {
  "admin.login": "Вход в админ-панель",
  "admin.login_failed": "Неудачная попытка входа",
  "admin.locked": "Аккаунт временно заблокирован",
  "admin.logout": "Выход",
  "access.denied": "Отказ в доступе",
  "owner.create": "Владелец создан",
  "owner.update": "Владелец изменён",
  "owner.delete": "Владелец удалён",
  "vehicle.create": "Транспорт добавлен",
  "vehicle.update": "Транспорт изменён",
  "vehicle.delete": "Транспорт удалён",
  "booking.status": "Статус брони изменён",
  "account.create": "Аккаунт администратора создан",
  "account.update": "Аккаунт администратора изменён",
  "account.password_reset": "Пароль сотрудника сброшен",
  "account.delete": "Аккаунт администратора удалён",
  "profile.password_change": "Пароль изменён владельцем аккаунта",
};

type Actor = { id: string; login: string } | null;

export async function logAudit(
  actor: Actor,
  action: string,
  opts: { entityType?: string; entityId?: string; details?: string; loginOverride?: string } = {}
) {
  try {
    await prisma.auditLog.create({
      data: {
        adminId: actor?.id ?? null,
        adminLogin: actor?.login ?? opts.loginOverride ?? "—",
        action,
        entityType: opts.entityType,
        entityId: opts.entityId,
        details: opts.details?.slice(0, 500),
        ip: await getClientIp(),
      },
    });
  } catch (error) {
    console.error("audit log write failed", error);
  }
}

export function changedFields<T extends Record<string, unknown>>(
  before: T,
  after: Record<string, unknown>,
  keys: string[]
) {
  const norm = (v: unknown) => (v === null || v === undefined || v === "" ? "" : String(v));
  return keys.filter((k) => norm(before[k]) !== norm(after[k]));
}
