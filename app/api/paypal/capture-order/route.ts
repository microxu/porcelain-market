import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getCartSummary } from "@/services/cart-service";
import { capturePayPalOrder } from "@/services/paypal-service";
import { createOrderFromCart } from "@/services/order-service";
import { calculateShippingForItems } from "@/services/shipping-service";
import { ProductStatus } from "@prisma/client";
import { validateCheckoutDetails } from "@/lib/checkout";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { sendOrderConfirmationEmail } from "@/services/email-service";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const orderID = body?.orderID as string | undefined;
    const checkoutDetails = body?.checkoutDetails;

    const session = await getServerSession(authOptions);
    const userId = session?.user?.id ?? null;

    if (!orderID) {
      return NextResponse.json(
        { error: "Missing PayPal order ID." },
        { status: 400 }
      );
    }

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

    const captureResult = await capturePayPalOrder(orderID);

    if (captureResult.status !== "COMPLETED") {
      return NextResponse.json(
        {
          error: "Payment was not completed.",
          details: captureResult,
        },
        { status: 400 }
      );
    }

    const paypalCaptureId =
      captureResult.purchase_units?.[0]?.payments?.captures?.[0]?.id ?? null;

    const payerEmail = captureResult.payer?.email_address ?? null;

    const order = await createOrderFromCart({
      cartId: cart.id,
      userId,
      paypalOrderId: orderID,
      paypalCaptureId,
      email: checkoutDetails.email || payerEmail,
      customerName: checkoutDetails.customerName,
      phone: checkoutDetails.phone,
      shippingCountry: checkoutDetails.shippingCountry,
      shippingRegion: checkoutDetails.shippingRegion,
      shippingCity: checkoutDetails.shippingCity,
      shippingPostcode: checkoutDetails.shippingPostcode,
      shippingAddress1: checkoutDetails.shippingAddress1,
      shippingAddress2: checkoutDetails.shippingAddress2,
      shippingCost: shippingQuote.shippingCost,
      shippingMethod: shippingQuote.shippingMethod,
      currency,
      totalAmount: grandTotal,
    });

    if (order.email) {
      try {
        const baseUrl =
          process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL || "";

        await sendOrderConfirmationEmail({
          to: order.email ?? "",
          customerName: order.customerName,
          orderId: order.id,
          createdAt: order.createdAt.toISOString(),
          currency: order.currency,
          totalAmount: order.totalAmount.toString(),
          shippingCost: order.shippingCost?.toString() ?? null,
          shippingMethod: order.shippingMethod ?? null,
          shippingCountry: order.shippingCountry ?? null,
          shippingRegion: order.shippingRegion ?? null,
          shippingCity: order.shippingCity ?? null,
          shippingPostcode: order.shippingPostcode ?? null,
          shippingAddress1: order.shippingAddress1 ?? null,
          shippingAddress2: order.shippingAddress2 ?? null,
          items: order.items.map((item) => ({
            id: item.id,
            productTitle: item.productTitle,
            productSlug: item.productSlug,
            unitPrice: item.unitPrice.toString(),
          })),
          orderUrl: baseUrl ? `${baseUrl}/orders/${order.id}` : undefined,
        });
      } catch (emailError) {
        console.error("Failed to send order confirmation email:", emailError);

        throw new Error("Order placed, but failed to send confirmation email.");
      }
    }

    order.items.forEach((item) => {
      revalidatePath(`/products/${item.productSlug}`);
    });

    revalidatePath("/products");
    revalidatePath("/", "layout");

    const response = NextResponse.json({
      success: true,
      orderId: order.id,
    });

    response.cookies.set("cartId", "", {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });

    return response;
  } catch (error) {
    console.error("Failed to capture PayPal order:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to capture PayPal order.",
      },
      { status: 500 }
    );
  }
}