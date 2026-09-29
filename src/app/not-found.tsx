import Link from "next/link";
import { LogoMark } from "@/components/Logo";

export default function NotFound() {
  return (
    <div className="bg-blueprint-light">
      <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-20 text-center">
        <div className="relative">
          <span className="font-display absolute -left-16 top-6 text-7xl font-extrabold text-brand-blue/15 sm:-left-24 sm:text-8xl">
            4
          </span>
          <span className="font-display absolute -right-16 top-6 text-7xl font-extrabold text-brand-blue/15 sm:-right-24 sm:text-8xl">
            4
          </span>
          <LogoMark className="animate-float-soft relative h-40 w-auto sm:h-48" />
        </div>
        <h1 className="mt-6 text-3xl font-extrabold text-brand-navy">Страница не найдена</h1>
        <p className="mt-2 text-gray-500">
          Такой страницы не существует или она была удалена. Наш строитель уже ищет её.
        </p>
        <div className="mt-6 flex gap-3">
          <Link
            href="/catalog"
            className="rounded-lg bg-brand-orange px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-orange-dark"
          >
            В каталог
          </Link>
          <Link
            href="/"
            className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            На главную
          </Link>
        </div>
      </div>
    </div>
  );
}
