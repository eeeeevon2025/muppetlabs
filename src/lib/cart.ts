import { cookies } from "next/headers";
import type { CartItem } from "@/lib/types";

const CART_COOKIE = "muppet_cart";
const MAX_QUANTITY = 20;

export async function getCartItems(): Promise<CartItem[]> {
  const store = await cookies();
  const raw = store.get(CART_COOKIE)?.value;
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (i): i is CartItem =>
        typeof i === "object" &&
        i !== null &&
        typeof (i as CartItem).productSlug === "string" &&
        typeof (i as CartItem).quantity === "number",
    );
  } catch {
    return [];
  }
}

export async function saveCartItems(items: CartItem[]) {
  const store = await cookies();
  store.set(CART_COOKIE, JSON.stringify(items), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export function clampQuantity(value: number): number {
  return Math.max(0, Math.min(Math.floor(value), MAX_QUANTITY));
}
