import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Все страницы у нас и так рендерятся динамически (Header читает cookie сессии),
// поэтому CSP на основе nonce ничего не стоит нам в производительности —
// статической генерации, которую нужно было бы отключать, у нас нет.
export function proxy(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const isDev = process.env.NODE_ENV === "development";

  const cspHeader = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ""};
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data: https://mc.yandex.ru https://mc.yandex.com;
    connect-src 'self' https://mc.yandex.ru https://mc.yandex.com wss://mc.yandex.ru wss://mc.yandex.com;
    frame-src https://mc.yandex.ru https://mc.yandex.com;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
  `;
  const contentSecurityPolicyHeaderValue = cspHeader.replace(/\s{2,}/g, " ").trim();

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", contentSecurityPolicyHeaderValue);

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });
  response.headers.set("Content-Security-Policy", contentSecurityPolicyHeaderValue);

  return response;
}

export const config = {
  matcher: [
    {
      source: "/((?!api|_next/static|_next/image|favicon.ico).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
