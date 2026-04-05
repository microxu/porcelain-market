"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import { useRouter } from "next/navigation";
import type { CheckoutDetails } from "@/lib/checkout";
import { useToast } from "@/components/toast-provider";

declare global {
  interface Window {
    paypal?: {
      Buttons: (options: {
        createOrder: () => Promise<string>;
        onApprove: (data: { orderID?: string }) => Promise<void>;
        onError?: (err: unknown) => void;
        onCancel?: () => void;
        style?: {
          layout?: "vertical" | "horizontal";
          shape?: "rect" | "pill";
          label?: "paypal" | "checkout" | "pay" | "buynow";
        };
      }) => {
        render: (selectorOrElement: string | HTMLElement) => Promise<void>;
      };
    };
  }
}

type Props = {
  disabled?: boolean;
  checkoutDetails: CheckoutDetails;
};

export default function PayPalCheckoutButton({
  disabled = false,
  checkoutDetails,
}: Props) {
  const router = useRouter();
  const { showToast } = useToast();

  const containerRef = useRef<HTMLDivElement | null>(null);
  const renderedRef = useRef(false);
  const latestCheckoutDetailsRef = useRef(checkoutDetails);

  const [sdkReady, setSdkReady] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    latestCheckoutDetailsRef.current = checkoutDetails;
  }, [checkoutDetails]);

  useEffect(() => {
    if (
      !sdkReady ||
      !containerRef.current ||
      !window.paypal ||
      renderedRef.current ||
      disabled
    ) {
      return;
    }

    renderedRef.current = true;

    window.paypal
      .Buttons({
        style: {
          layout: "vertical",
          shape: "rect",
          label: "paypal",
        },

        async createOrder() {
          setErrorMessage("");

          const response = await fetch("/api/paypal/create-order", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              checkoutDetails: latestCheckoutDetailsRef.current,
            }),
          });

          const data = await response.json();

          if (!response.ok) {
            const message = data?.error || "Failed to create PayPal order.";
            setErrorMessage(message);
            showToast(message, "error");
            throw new Error(message);
          }

          return data.id;
        },

        async onApprove(data) {
          setErrorMessage("");

          const response = await fetch("/api/paypal/capture-order", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              orderID: data.orderID,
              checkoutDetails: latestCheckoutDetailsRef.current,
            }),
          });

          const result = await response.json();

          if (!response.ok) {
            const message =
              result?.error || "Failed to capture PayPal order.";
            setErrorMessage(message);
            showToast(message, "error");
            throw new Error(message);
          }

          showToast("Order placed successfully!", "success");
          router.push(`/orders/${result.orderId}`);
          router.refresh();
        },

        onCancel() {
          showToast("Checkout was cancelled.", "info");
          router.push("/checkout/cancel");
        },

        onError(err) {
          console.error("PayPal button error:", err);
          const message = "Something went wrong with PayPal checkout.";
          setErrorMessage(message);
          showToast(message, "error");
        },
      })
      .render(containerRef.current);
  }, [sdkReady, disabled, router, showToast]);

  if (disabled) {
    return (
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-500">
        Checkout is unavailable right now.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <Script
        src={`https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}&currency=NZD`}
        strategy="afterInteractive"
        onLoad={() => setSdkReady(true)}
      />

      <div ref={containerRef} className="min-h-[45px]" />

      {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}
    </div>
  );
}