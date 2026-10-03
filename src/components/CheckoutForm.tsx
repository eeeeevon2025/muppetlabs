"use client";

import { useActionState } from "react";
import { checkoutAction, type CheckoutFormState } from "@/app/store/actions";
import { Button, Field, TextInput, FormNotice } from "@/components/ui";

export default function CheckoutForm({ defaultEmail }: { defaultEmail: string }) {
  const [state, formAction, pending] = useActionState<CheckoutFormState, FormData>(
    checkoutAction,
    undefined,
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <Field label="Full name" htmlFor="shippingName">
        <TextInput id="shippingName" name="shippingName" autoComplete="name" required maxLength={80} />
      </Field>
      <Field label="Email" htmlFor="email">
        <TextInput id="email" name="email" type="email" autoComplete="email" required defaultValue={defaultEmail} />
      </Field>
      <Field label="Shipping address" htmlFor="shippingAddress">
        <TextInput id="shippingAddress" name="shippingAddress" autoComplete="street-address" required maxLength={200} />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="City" htmlFor="shippingCity">
          <TextInput id="shippingCity" name="shippingCity" autoComplete="address-level2" required maxLength={100} />
        </Field>
        <Field label="Postal code" htmlFor="shippingPostalCode">
          <TextInput id="shippingPostalCode" name="shippingPostalCode" autoComplete="postal-code" required maxLength={20} />
        </Field>
      </div>

      {state?.error && <FormNotice kind="error" message={state.error} />}

      <Button type="submit" disabled={pending} className="mt-2 w-full py-3">
        {pending ? "Placing order..." : "Place order"}
      </Button>
      <p className="text-center text-xs text-text-secondary">
        Demo checkout — no real payment is collected.
      </p>
    </form>
  );
}
