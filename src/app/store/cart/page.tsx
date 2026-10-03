import type { Metadata } from "next";
import Link from "next/link";
import { getCartItems } from "@/lib/cart";
import { getProduct, formatCents } from "@/lib/products";
import { Badge, Button, Card, TextInput } from "@/components/ui";
import { updateCartQuantityAction, removeFromCartAction } from "@/app/store/actions";

export const metadata: Metadata = {
  title: "Your Cart",
};

export default async function CartPage() {
  const items = await getCartItems();
  const lineItems = items
    .map((item) => ({ item, product: getProduct(item.productSlug) }))
    .filter((li): li is { item: (typeof items)[number]; product: NonNullable<ReturnType<typeof getProduct>> } => Boolean(li.product));

  const subtotalCents = lineItems.reduce((sum, li) => sum + li.product.priceCents * li.item.quantity, 0);

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-16 sm:px-6">
      <Badge color="var(--accent)">Cart</Badge>
      <h1 className="font-display mt-4 text-4xl font-normal">Your cart</h1>

      {lineItems.length === 0 ? (
        <p className="mt-6 text-text-secondary">
          Your cart is empty.{" "}
          <Link href="/store" className="link-brutal">
            Browse the store
          </Link>
          .
        </p>
      ) : (
        <div className="mt-8 flex flex-col gap-4">
          {lineItems.map(({ item, product }) => (
            <Card key={product.slug} className="flex flex-row items-center gap-4">
              <div
                className="flex h-14 w-14 shrink-0 items-center justify-center border-[3px] border-foreground font-display text-xs font-normal"
                style={{
                  backgroundColor: product.color,
                  color: product.color === "#4ADE80" ? "#000000" : "#FFFFFF",
                }}
                aria-hidden
              >
                {product.tag.slice(0, 3)}
              </div>
              <div className="flex-1">
                <p className="font-bold">{product.name}</p>
                <p className="text-sm text-text-secondary">{formatCents(product.priceCents)} each</p>
              </div>
              <form action={updateCartQuantityAction.bind(null, product.slug)} className="flex items-center gap-2">
                <TextInput
                  type="number"
                  name="quantity"
                  defaultValue={item.quantity}
                  min={0}
                  max={20}
                  className="w-16"
                  aria-label={`Quantity for ${product.name}`}
                />
                <Button type="submit" variant="outline">
                  Update
                </Button>
              </form>
              <form action={removeFromCartAction.bind(null, product.slug)}>
                <Button type="submit" variant="ghost">
                  Remove
                </Button>
              </form>
            </Card>
          ))}

          <Card className="flex flex-row items-center justify-between">
            <p className="font-display text-lg font-normal">Subtotal</p>
            <p className="font-display text-lg font-normal">{formatCents(subtotalCents)}</p>
          </Card>

          <Link href="/store/checkout">
            <Button variant="primary" className="w-full py-3">
              Proceed to checkout
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
