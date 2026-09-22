"use client";

type Category = { id: string; name: string; group: string };
type Owner = { id: string; name: string };

export function VehicleForm({
  action,
  categories,
  owners,
  initial,
}: {
  action: (formData: FormData) => void;
  categories: Category[];
  owners: Owner[];
  initial?: {
    title: string;
    description: string | null;
    pricePerHour: string | null;
    minHours: number;
    city: string | null;
    isActive: boolean;
    categoryId: string;
    ownerId: string;
  };
}) {
  return (
    <form action={action} className="flex max-w-xl flex-col gap-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Название</label>
        <input
          type="text"
          name="title"
          required
          placeholder="Toyota Camry 2023"
          defaultValue={initial?.title}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Описание</label>
        <textarea
          name="description"
          rows={3}
          defaultValue={initial?.description ?? ""}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Цена (₽ / час)
          </label>
          <input
            type="number"
            name="pricePerHour"
            min={0}
            defaultValue={initial?.pricePerHour ?? ""}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Мин. срок аренды, ч
          </label>
          <input
            type="number"
            name="minHours"
            min={1}
            required
            defaultValue={initial?.minHours ?? 4}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Категория
          </label>
          <select
            name="categoryId"
            required
            defaultValue={initial?.categoryId}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="">Выберите</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Владелец
          </label>
          <select
            name="ownerId"
            required
            defaultValue={initial?.ownerId}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="">Выберите</option>
            {owners.map((o) => (
              <option key={o.id} value={o.id}>
                {o.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Город</label>
        <input
          type="text"
          name="city"
          defaultValue={initial?.city ?? "Москва"}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-gray-700">
        <input
          type="checkbox"
          name="isActive"
          defaultChecked={initial?.isActive ?? true}
        />
        Активен (виден в каталоге)
      </label>

      <button
        type="submit"
        className="rounded-lg bg-brand-blue px-4 py-2.5 font-medium text-white hover:bg-brand-navy"
      >
        Сохранить
      </button>
    </form>
  );
}
