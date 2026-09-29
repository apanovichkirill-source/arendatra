export const PERMISSION_SECTIONS = [
  { key: "vehicles", label: "Транспорт", hasEdit: true },
  { key: "owners", label: "Владельцы", hasEdit: true },
  { key: "bookings", label: "Брони", hasEdit: true },
  { key: "reviews", label: "Отзывы (модерация)", hasEdit: true },
  { key: "buyers", label: "Арендаторы (персональные данные)", hasEdit: false },
  { key: "audit", label: "Журнал аудита", hasEdit: false },
] as const;

export type Permission =
  | "vehicles.view"
  | "vehicles.edit"
  | "owners.view"
  | "owners.edit"
  | "bookings.view"
  | "bookings.edit"
  | "reviews.view"
  | "reviews.edit"
  | "buyers.view"
  | "audit.view";

export const ALL_PERMISSIONS: Permission[] = PERMISSION_SECTIONS.flatMap((s) =>
  s.hasEdit
    ? ([`${s.key}.view`, `${s.key}.edit`] as Permission[])
    : ([`${s.key}.view`] as Permission[])
);

export type AdminAccess = { isSuper: boolean; permissions: string[] };

// Право на изменение включает право на просмотр раздела.
export function can(admin: AdminAccess, permission: Permission) {
  if (admin.isSuper) return true;
  if (admin.permissions.includes(permission)) return true;
  if (permission.endsWith(".view")) {
    return admin.permissions.includes(permission.replace(".view", ".edit"));
  }
  return false;
}

// Оставляем только известные права и добавляем view к каждому edit.
export function normalizePermissions(raw: string[]): Permission[] {
  const known = new Set<string>(ALL_PERMISSIONS);
  const result = new Set<Permission>();
  for (const p of raw) {
    if (!known.has(p)) continue;
    result.add(p as Permission);
    if (p.endsWith(".edit")) result.add(p.replace(".edit", ".view") as Permission);
  }
  return [...result];
}
