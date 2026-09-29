import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const secret = new TextEncoder().encode(process.env.AUTH_SECRET);

const BUYER_COOKIE = "buyer_session";
const ADMIN_COOKIE = "admin_session";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 дней — обычные пользователи
const ADMIN_MAX_AGE_SECONDS = 60 * 60 * 8; // 8 часов — админка, короче для безопасности

type BuyerPayload = { buyerId: string };
type AdminPayload = { adminId: string; iat?: number };

async function sign(payload: Record<string, unknown>, maxAgeSeconds: number) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${maxAgeSeconds}s`)
    .sign(secret);
}

async function verify<T>(token: string | undefined): Promise<T | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as T;
  } catch {
    return null;
  }
}

export async function createBuyerSession(buyerId: string) {
  const token = await sign({ buyerId }, MAX_AGE_SECONDS);
  const store = await cookies();
  store.set(BUYER_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

export async function getBuyerSession() {
  const store = await cookies();
  const token = store.get(BUYER_COOKIE)?.value;
  return verify<BuyerPayload>(token);
}

export async function clearBuyerSession() {
  const store = await cookies();
  store.delete(BUYER_COOKIE);
}

export async function createAdminSession(adminId: string) {
  const token = await sign({ adminId }, ADMIN_MAX_AGE_SECONDS);
  const store = await cookies();
  store.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ADMIN_MAX_AGE_SECONDS,
  });
}

export async function getAdminSession() {
  const store = await cookies();
  const token = store.get(ADMIN_COOKIE)?.value;
  return verify<AdminPayload>(token);
}

export async function clearAdminSession() {
  const store = await cookies();
  store.delete(ADMIN_COOKIE);
}
