"use client";

export function OwnerForm({
  action,
  initial,
}: {
  action: (formData: FormData) => void;
  initial?: {
    name: string;
    description: string | null;
    phone: string | null;
    email: string | null;
    city: string | null;
    address: string | null;
    isActive: boolean;
  };
}) {
  return (
    <form action={action} className="flex max-w-xl flex-col gap-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Название / имя владельца
        </label>
        <input
          type="text"
          name="name"
          required
          defaultValue={initial?.name}
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
          <label className="mb-1 block text-sm font-medium text-gray-700">Телефон</label>
          <input
            type="text"
            name="phone"
            defaultValue={initial?.phone ?? ""}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            defaultValue={initial?.email ?? ""}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Город</label>
          <input
            type="text"
            name="city"
            defaultValue={initial?.city ?? "Москва"}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Адрес</label>
          <input
            type="text"
            name="address"
            defaultValue={initial?.address ?? ""}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
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
