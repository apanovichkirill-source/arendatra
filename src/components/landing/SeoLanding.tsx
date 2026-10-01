import Link from "next/link";
import { headers } from "next/headers";
import { VehicleCard } from "@/components/catalog/VehicleCard";
import { PageHero } from "@/components/PageHero";
import { formatPrice, PRICING_NOTE } from "@/lib/format";
import { SITE_URL } from "@/lib/site";
import type { SeoPageModel } from "@/lib/seo-pages";
import { RentalCalculator } from "@/components/landing/RentalCalculator";

function Cards({ vehicles }: { vehicles: SeoPageModel["vehicles"] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {vehicles.map((v) => (
        <VehicleCard
          key={v.id}
          slug={v.slug}
          title={v.title}
          pricePerHour={v.pricePerHour}
          city={v.city}
          ownerName={v.owner.name}
          categoryName={v.category.name}
          categoryGroup={v.category.group}
          attributes={v.attributes as Record<string, string> | null}
        />
      ))}
    </div>
  );
}

const pill =
  "rounded-full border border-black/10 bg-white px-3 py-1 text-sm text-brand-blue hover:border-brand-blue";

export async function SeoLanding({ page }: { page: SeoPageModel }) {
  const nonce = (await headers()).get("x-nonce") || undefined;

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: page.breadcrumbs.map((b, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: b.name,
        item: b.href ? `${SITE_URL}${b.href}` : `${SITE_URL}${page.path}`,
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: page.faq.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ];

  return (
    <>
      <PageHero title={page.h1} eyebrow={page.eyebrow}>
        <nav aria-label="Навигация" className="mt-4 text-sm text-white/60">
          {page.breadcrumbs.map((b, i) => (
            <span key={`${b.name}-${i}`}>
              {i > 0 && " / "}
              {b.href ? (
                <Link href={b.href} className="hover:text-white">
                  {b.name}
                </Link>
              ) : (
                <span className="text-white">{b.name}</span>
              )}
            </span>
          ))}
        </nav>
      </PageHero>

      <div className="mx-auto max-w-6xl px-4 py-8">
        {jsonLd.map((block, i) => (
          <script
            key={i}
            type="application/ld+json"
            nonce={nonce}
            dangerouslySetInnerHTML={{ __html: JSON.stringify(block) }}
          />
        ))}

        <div className="max-w-3xl space-y-3 text-gray-700">
          {page.intro.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>

        {page.vehicles.length > 0 && (
          <section className="mt-8">
            <h2 className="mb-4 text-xl font-bold text-brand-navy">{page.vehiclesTitle}</h2>
            <Cards vehicles={page.vehicles} />
            <p className="mt-3 text-xs text-gray-400">{PRICING_NOTE}</p>
          </section>
        )}

        {page.fallbackVehicles && page.fallbackVehicles.length > 0 && (
          <section className="mt-8">
            <h2 className="mb-2 text-xl font-bold text-brand-navy">{page.fallbackTitle}</h2>
            {page.fallbackText && (
              <p className="mb-4 max-w-3xl text-sm text-gray-600">{page.fallbackText}</p>
            )}
            <Cards vehicles={page.fallbackVehicles} />
          </section>
        )}

        {page.priceTable && (
          <section className="mt-10">
            <h2 className="mb-3 text-xl font-bold text-brand-navy">{page.priceTable.title}</h2>
            <div className="overflow-x-auto rounded-xl border border-black/10 bg-white">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-500">
                  <tr>
                    <th className="px-4 py-2 font-medium">Техника</th>
                    <th className="px-4 py-2 font-medium">Тариф за час</th>
                  </tr>
                </thead>
                <tbody>
                  {page.priceTable.rows.map((r) => (
                    <tr key={r.href} className="border-t border-black/5">
                      <td className="px-4 py-2">
                        <Link href={r.href} className="text-brand-blue hover:underline">
                          {r.name}
                        </Link>
                      </td>
                      <td className="px-4 py-2 text-gray-700">
                        {r.price === null ? "по запросу" : `от ${formatPrice(r.price)}`}
                        {r.price !== null && !r.inCity && (
                          <span className="ml-2 text-xs text-gray-400">по региону</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-xs text-gray-400">{PRICING_NOTE}</p>
          </section>
        )}

        {page.priceTable && <RentalCalculator rows={page.priceTable.rows} />}

        {page.sections.map((s) => (
          <section key={s.title} className="mt-10">
            <h2 className="mb-3 text-xl font-bold text-brand-navy">{s.title}</h2>
            {s.paragraphs?.map((p) => (
              <p key={p} className="mb-2 max-w-3xl text-gray-700">
                {p}
              </p>
            ))}
            {s.bullets && (
              <ul className="list-inside list-disc space-y-1 text-gray-700">
                {s.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            )}
          </section>
        ))}

        <section className="mt-10">
          <h2 className="mb-3 text-xl font-bold text-brand-navy">Частые вопросы</h2>
          <div className="space-y-4">
            {page.faq.map((f) => (
              <div key={f.q} className="rounded-xl border border-black/10 bg-white p-4">
                <h3 className="font-semibold text-brand-navy">{f.q}</h3>
                <p className="mt-1 text-sm text-gray-600">{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        {page.linkGroups
          .filter((g) => g.links.length > 0)
          .map((g) => (
            <section key={g.title} className="mt-10">
              <h2 className="mb-3 text-lg font-bold text-brand-navy">{g.title}</h2>
              <div className="flex flex-wrap gap-2">
                {g.links.map((l) => (
                  <Link key={l.href} href={l.href} className={pill}>
                    {l.label}
                  </Link>
                ))}
              </div>
            </section>
          ))}
      </div>
    </>
  );
}
