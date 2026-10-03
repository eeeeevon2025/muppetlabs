"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCartItems, saveCartItems, clampQuantity } from "@/lib/cart";
import { getProduct } from "@/lib/products";
import { checkoutSchema } from "@/lib/validation";
import { db } from "@/lib/db";
import type { Order } from "@/lib/types";

export async function addToCartAction(productSlug: string, formData: FormData) {
  const product = getProduct(productSlug);
  if (!product) return;

  const requested = Number(formData.get("quantity"));
  const quantity = clampQuantity(Number.isFinite(requested) && requested > 0 ? requested : 1) || 1;

  const items = await getCartItems();
  const existing = items.find((i) => i.productSlug === productSlug);
  if (existing) {
    existing.quantity = clampQuantity(existing.quantity + quantity);
  } else {
    items.push({ productSlug, quantity });
  }
  await saveCartItems(items);
  revalidatePath("/store/cart");
  revalidatePath("/store");
}

export async function updateCartQuantityAction(productSlug: string, formData: FormData) {
  const requested = Number(formData.get("quantity"));
  const quantity = clampQuantity(Number.isFinite(requested) ? requested : 0);

  const items = await getCartItems();
  const next =
    quantity === 0
      ? items.filter((i) => i.productSlug !== productSlug)
      : items.map((i) => (i.productSlug === productSlug ? { ...i, quantity } : i));

  await saveCartItems(next);
  revalidatePath("/store/cart");
}

export async function removeFromCartAction(productSlug: string) {
  const items = await getCartItems();
  await saveCartItems(items.filter((i) => i.productSlug !== productSlug));
  revalidatePath("/store/cart");
}

export type CheckoutFormState = { error?: string } | undefined;

export async function checkoutAction(
  _prevState: CheckoutFormState,
  formData: FormData,
): Promise<CheckoutFormState> {
  const items = await getCartItems();
  if (items.length === 0) {
    return { error: "Your cart is empty." };
  }

  const parsed = checkoutSchema.safeParse({
    shippingName: formData.get("shippingName"),
    email: formData.get("email"),
    shippingAddress: formData.get("shippingAddress"),
    shippingCity: formData.get("shippingCity"),
    shippingPostalCode: formData.get("shippingPostalCode"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check your shipping details and try again." };
  }

  const totalCents = items.reduce((sum, item) => {
    const product = getProduct(item.productSlug);
    return product ? sum + product.priceCents * item.quantity : sum;
  }, 0);

  const order: Order = {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    items,
    totalCents,
    shippingName: parsed.data.shippingName,
    shippingAddress: parsed.data.shippingAddress,
    shippingCity: parsed.data.shippingCity,
    shippingPostalCode: parsed.data.shippingPostalCode,
    email: parsed.data.email,
  };

  db.append<Order>("orders", order);
  await saveCartItems([]);
  redirect(`/store/order/${order.id}`);
}
