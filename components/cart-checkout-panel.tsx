"use client";

import { useMemo, useState } from "react";
import CheckoutForm from "@/components/checkout-form";
import PayPalCheckoutButton from "@/components/paypal-checkout-button";
import type { CheckoutDetails } from "@/lib/checkout";

type Props = {
  itemCount: number;
  subtotal: number;
  currency: string;
};

export default function CartCheckoutPanel({
  itemCount,
  subtotal,
  currency,
}: Props) {
  const [formData, setFormData] = useState<CheckoutDetails>({
    customerName: "",
    email: "",
    phone: "",
    shippingCountry: "New Zealand",
    shippingRegion: "",
    shippingCity: "",
    shippingPostcode: "",
    shippingAddress1: "",
    shippingAddress2: "",
  });

  function handleChange(name: string, value: string) {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  // 这里只是前端预估，真正的金额以后端为准
  const shippingCost = useMemo(() => {
    const country = formData.shippingCountry.trim().toLowerCase();
    return country === "new zealand" || country === "nz" ? 18 : 55;
  }, [formData.shippingCountry]);

  const total = subtotal + shippingCost;

  return (
    <div className="space-y-6">
      <CheckoutForm formData={formData} onChange={handleChange} />

      <aside className="h-fit rounded-2xl border p-5 space-y-4">
        <h2 className="text-lg font-semibold">Order Summary</h2>

        <div className="flex items-center justify-between text-sm">
          <span>Items</span>
          <span>{itemCount}</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span>Shipping</span>
          <span>
            {currency} {shippingCost.toFixed(2)}
          </span>
        </div>

        <div className="flex items-center justify-between font-medium">
          <span>Total</span>
          <span>
            {currency} {total.toFixed(2)}
          </span>
        </div>

        <div className="pt-2">
          <PayPalCheckoutButton checkoutDetails={formData} />
        </div>
      </aside>
    </div>
  );
}