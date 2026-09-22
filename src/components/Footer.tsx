export function Footer() {
  return (
    <footer className="mt-16 border-t border-black/10 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-gray-500">
        <p className="font-semibold text-brand-navy">Арендатра</p>
        <p className="mt-1">
          Маркетплейс аренды легковых авто и спецтехники от частных владельцев и компаний.
        </p>
        <p className="mt-4">© {new Date().getFullYear()} Арендатра. Все права защищены.</p>
      </div>
    </footer>
  );
}
