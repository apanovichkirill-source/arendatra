import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center">
      <h1 className="text-3xl font-bold text-brand-navy">Страница не найдена</h1>
      <p className="mt-2 text-gray-500">
        Такой страницы не существует или она была удалена.
      </p>
      <div className="mt-6 flex gap-3">
        <Link
          href="/catalog"
          className="rounded-lg bg-brand-orange px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-orange-dark"
        >
          В каталог
        </Link>
        <Link
          href="/"
          className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          На главную
        </Link>
      </div>
    </div>
  );
}
