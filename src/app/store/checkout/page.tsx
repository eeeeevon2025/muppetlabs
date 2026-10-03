import type { Metadata } from "next";
import Link from "next/link";
import { getCartItems } from "@/lib/cart";
import { getProduct, formatCents } from "@/lib/products";
import { Badge, Card } from "@/components/ui";
import CheckoutForm from "@/components/CheckoutForm";

export const metadata: Metadata = {
  title: "Checkout",
};

export default async function CheckoutPage() {
  const items = await getCartItems();

  const lineItems = items
    .map((item) => ({ item, product: getProduct(item.productSlug) }))
    .filter((li): li is { item: (typeof items)[number]; product: NonNullable<ReturnType<typeof getProduct>> } => Boolean(li.product));
  const subtotalCents = lineItems.reduce((sum, li) => sum + li.product.priceCents * li.item.quantity, 0);

  if (lineItems.length === 0) {
    return (
      <div className="mx-auto w-full max-w-2xl px-4 py-16 text-center sm:px-6">
        <h1 className="font-display text-3xl font-normal">Your cart is empty</h1>
        <p className="mt-3 text-text-secondary">
          <Link href="/store" className="link-brutal">
            Browse the store
          </Link>{" "}
          before checking out.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-16 sm:px-6">
      <Badge color="var(--primary)">Checkout</Badge>
      <h1 className="font-display mt-4 text-4xl font-normal">Checkout</h1>

      <Card className="mt-6">
        <h2 className="font-display font-normal">Order summary</h2>
        <ul className="mt-3 flex flex-col gap-2 text-sm">
          {lineItems.map(({ item, product }) => (
            <li key={product.slug} className="flex justify-between">
              <span>
                {product.name} × {item.quantity}
              </span>
              <span className="font-bold">{formatCents(product.priceCents * item.quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-3 flex justify-between border-t-[3px] border-foreground pt-3 font-display font-normal">
          <span>Total</span>
          <span>{formatCents(subtotalCents)}</span>
        </div>
      </Card>

      <Card className="mt-6">
        <h2 className="font-display font-normal">Shipping details</h2>
        <div className="mt-4">
          <CheckoutForm defaultEmail="" />
        </div>
      </Card>
    </div>
  );
}
