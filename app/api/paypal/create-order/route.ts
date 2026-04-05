import { NextResponse } from "next/server";
import { getCartSummary } from "@/services/cart-service";
import { createPayPalOrder } from "@/services/paypal-service";
import { calculateShippingForItems } from "@/services/shipping-service";
import { ProductStatus } from "@prisma/client";
import { validateCheckoutDetails } from "@/lib/checkout";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const checkoutDetails = body?.checkoutDetails;

    const validationError = validateCheckoutDetails(checkoutDetails);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const { cart, items, total, currency } = await getCartSummary();

    if (!cart || items.length === 0) {
      return NextResponse.json(
        { error: "Your cart is empty." },
        { status: 400 }
      );
    }

    const unavailableItem = items.find(
      (item) => item.product.status !== ProductStatus.AVAILABLE
    );

    if (unavailableItem) {
      return NextResponse.json(
        {
          error: `Product "${unavailableItem.product.title}" is no longer available.`,
        },
        { status: 400 }
      );
    }

    const shippingQuote = calculateShippingForItems(
      items,
      checkoutDetails.shippingCountry
    );

    const grandTotal = total + shippingQuote.shippingCost;

    const paypalOrder = await createPayPalOrder({
      amount: grandTotal.toFixed(2),
      currencyCode: currency,
    });

    return NextResponse.json({
      id: paypalOrder.id,
    });
  } catch (error) {
    console.error("Failed to create PayPal order:", error);

    return NextResponse.json(
      { error: "Failed to create PayPal order." },
      { status: 500 }
    );
  }
}