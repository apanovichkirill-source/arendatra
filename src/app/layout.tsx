import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CookieBanner } from "@/components/CookieBanner";
import { CityPrompt } from "@/components/CityPrompt";
import { GeoCapture } from "@/components/GeoCapture";
import { YandexMetrika } from "@/components/YandexMetrika";
import { getBuyerSession } from "@/lib/session";
import { SITE_URL } from "@/lib/site";
import { SERVICE_CITIES } from "@/lib/cities";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "cyrillic"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "cyrillic"],
});

const DESCRIPTION =
  "Аренда спецтехники и легкового транспорта в Республике Коми и Ненецком автономном округе: автокраны, автовышки, экскаваторы, бульдозеры, вахтовые автобусы и легковые авто. Работаем в Сыктывкаре, Ухте, Усинске, Печоре, Воркуте, Сосногорске, Кожве, Нарьян-Маре и Харьягинском. Почасовые тарифы, бронирование без предоплаты.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Арендатра — аренда спецтехники и транспорта в Коми и НАО",
  description: DESCRIPTION,
  openGraph: {
    type: "website",
    locale: "ru_RU",
    siteName: "Арендатра",
    description: DESCRIPTION,
  },
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const nonce = (await headers()).get("x-nonce") || undefined;
  const buyerSession = await getBuyerSession();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Арендатра",
    description: DESCRIPTION,
    url: SITE_URL,
    telephone: "+7-495-123-45-67",
    priceRange: "₽₽",
    areaServed: SERVICE_CITIES.map((city) => ({
      "@type": "City",
      name: city,
    })),
  };

  return (
    <html
      lang="ru"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          nonce={nonce}
           
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Header />
        <CityPrompt />
        <main className="flex-1">{children}</main>
        <Footer />
        <CookieBanner />
        <YandexMetrika />
        {buyerSession && <GeoCapture />}
      </body>
    </html>
  );
}
