import { PARTNER_NAME, partnerUrl } from "@/lib/partner";

// Блок со ссылкой на сайт-партнёр: показывается, только если задан PARTNER_URL
export function PartnerBlock({
  title = "Нужны песок, щебень или ПГС для работ?",
  text = "Сыпучие материалы и спецтехнику можно купить у продавцов Республики Коми и НАО на нашем втором сайте.",
  path = "/catalog?group=MATERIALS",
  className = "",
}: {
  title?: string;
  text?: string;
  path?: string;
  className?: string;
}) {
  const href = partnerUrl(path);
  if (!href) return null;
  return (
    <aside className={`rounded-2xl border border-orange-200 bg-orange-50 p-5 ${className}`}>
      <p className="font-bold text-brand-navy">{title}</p>
      <p className="mt-1 text-sm text-gray-700">{text}</p>
      <a
        href={href}
        className="mt-3 inline-block rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-600"
      >
        Перейти на {PARTNER_NAME}
      </a>
    </aside>
  );
}
