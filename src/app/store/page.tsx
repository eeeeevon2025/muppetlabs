import type { Metadata } from "next";
import Link from "next/link";
import { PRODUCTS, formatCents } from "@/lib/products";
import { getCartItems } from "@/lib/cart";
import { Badge, Button, Card, TextInput } from "@/components/ui";
import { addToCartAction } from "@/app/store/actions";

export const metadata: Metadata = {
  title: "Store",
  description: "Merch inspired by all four corners of the trait map. Demo store, no real payments.",
};

export default async function StorePage() {
  const cartItems = await getCartItems();
  const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <div>
      <div className="border-b-[3px] border-foreground bg-surface-alt">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <Badge color="var(--primary)">Store</Badge>
              <h1 className="font-display mt-4 text-4xl font-normal sm:text-5xl">Merch for every archetype</h1>
              <p className="mt-3 max-w-xl text-lg text-text-secondary">
                A demo storefront — no real payments are processed, and prices are in fictional Muppet Bucks.
              </p>
            </div>
            <Link href="/store/cart">
              <Button variant="outline">
                View cart {cartCount > 0 && `(${cartCount})`}
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PRODUCTS.map((product) => (
            <Card key={product.slug} className="flex flex-col gap-3 p-0">
              <div
                className="flex h-32 items-center justify-center border-b-[3px] border-foreground font-display text-2xl font-normal"
                style={{
                  backgroundColor: product.color,
                  color: product.color === "#4ADE80" ? "#000000" : "#FFFFFF",
                }}
                aria-hidden
              >
                {product.tag}
              </div>
              <div className="flex flex-col gap-3 px-4 pb-4">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-display font-normal leading-tight">{product.name}</p>
                  <Badge color={product.color}>{product.tag}</Badge>
                </div>
                <p className="text-sm text-text-secondary">{product.description}</p>
                <p className="font-display text-lg font-normal">{formatCents(product.priceCents)}</p>
                <form action={addToCartAction.bind(null, product.slug)} className="mt-auto flex items-center gap-2">
                  <TextInput
                    type="number"
                    name="quantity"
                    defaultValue={1}
                    min={1}
                    max={20}
                    className="w-16"
                    aria-label={`Quantity for ${product.name}`}
                  />
                  <Button type="submit" className="flex-1">
                    Add to cart
                  </Button>
                </form>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
