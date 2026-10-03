import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { getProduct, formatCents } from "@/lib/products";
import type { Order } from "@/lib/types";
import { Badge, Button, Card } from "@/components/ui";

export const metadata: Metadata = {
  title: "Order Confirmed",
};

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = db.find<Order>("orders", id);
  if (!order) notFound();

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-16 text-center sm:px-6">
      <Badge color="var(--primary)">Order placed</Badge>
      <h1 className="font-display mt-4 text-4xl font-normal">Thanks, {order.shippingName.split(" ")[0]}!</h1>
      <p className="mt-3 text-text-secondary">
        Order confirmation <span className="font-mono">{order.id.slice(0, 8)}</span> — a receipt would normally go to {order.email}.
      </p>

      <Card className="mt-8 text-left">
        <h2 className="font-display font-normal">Items</h2>
        <ul className="mt-3 flex flex-col gap-2 text-sm">
          {order.items.map((item) => {
            const product = getProduct(item.productSlug);
            if (!product) return null;
            return (
              <li key={item.productSlug} className="flex justify-between">
                <span>
                  {product.name} × {item.quantity}
                </span>
                <span className="font-semibold">{formatCents(product.priceCents * item.quantity)}</span>
              </li>
            );
          })}
        </ul>
        <div className="mt-3 flex justify-between border-t-[3px] border-foreground pt-3 font-display font-normal">
          <span>Total</span>
          <span>{formatCents(order.totalCents)}</span>
        </div>
        <p className="mt-4 text-sm text-text-secondary">
          Shipping to {order.shippingAddress}, {order.shippingCity} {order.shippingPostalCode}
        </p>
      </Card>

      <Link href="/store" className="mt-8 inline-block">
        <Button variant="outline">Back to store</Button>
      </Link>
    </div>
  );
}
