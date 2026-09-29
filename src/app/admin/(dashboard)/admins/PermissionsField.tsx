import { PERMISSION_SECTIONS } from "@/lib/admin-permissions";

export function PermissionsField({ selected }: { selected: string[] }) {
  const has = (p: string) => selected.includes(p);
  return (
    <fieldset>
      <legend className="mb-2 text-sm font-medium text-gray-700">Доступ к разделам</legend>
      <div className="overflow-hidden rounded-lg border border-gray-200">
        {PERMISSION_SECTIONS.map((s) => (
          <div
            key={s.key}
            className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 px-3 py-2 last:border-b-0"
          >
            <span className="text-sm text-gray-800">{s.label}</span>
            <div className="flex gap-4 text-sm text-gray-600">
              <label className="flex items-center gap-1.5">
                <input
                  type="checkbox"
                  name="perm"
                  value={`${s.key}.view`}
                  defaultChecked={has(`${s.key}.view`) || has(`${s.key}.edit`)}
                />
                просмотр
              </label>
              {s.hasEdit && (
                <label className="flex items-center gap-1.5">
                  <input
                    type="checkbox"
                    name="perm"
                    value={`${s.key}.edit`}
                    defaultChecked={has(`${s.key}.edit`)}
                  />
                  изменение
                </label>
              )}
            </div>
          </div>
        ))}
      </div>
      <p className="mt-2 text-xs text-gray-500">
        «Изменение» автоматически даёт и просмотр. Управление аккаунтами доступно только главному
        администратору.
      </p>
    </fieldset>
  );
}
