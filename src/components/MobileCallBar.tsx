"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PHONES } from "@/lib/contacts";

// Нижняя панель на телефонах: позвонить или оставить номер в один тап (не в админке)
export function MobileCallBar() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;
  const main = PHONES[0];
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 gap-2 border-t border-black/10 bg-white/95 px-3 pt-2 shadow-[0_-4px_16px_rgba(0,0,0,0.08)] backdrop-blur sm:hidden"
      style={{ paddingBottom: "calc(0.5rem + env(safe-area-inset-bottom, 0px))" }}
    >
      <a
        href={`tel:${main.tel}`}
        className="rounded-lg bg-brand-orange py-2.5 text-center text-sm font-semibold text-white"
      >
        Позвонить
      </a>
      <Link
        href="/kontakty#callback"
        className="rounded-lg border border-brand-blue py-2.5 text-center text-sm font-semibold text-brand-blue"
      >
        Перезвоните мне
      </Link>
    </div>
  );
}
