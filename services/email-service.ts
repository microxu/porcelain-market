import OrderConfirmationEmail from "@/emails/order-confirmation-email";
import { resend } from "@/lib/resend";

type OrderEmailItem = {
  id: string;
  productTitle: string;
  productSlug: string;
  unitPrice: string;
};

type SendOrderConfirmationEmailParams = {
  to: string;
  customerName?: string | null;
  orderId: string;
  createdAt: string;
  currency: string;
  totalAmount: string;
  shippingCost?: string | null;
  shippingMethod?: string | null;
  shippingCountry?: string | null;
  shippingRegion?: string | null;
  shippingCity?: string | null;
  shippingPostcode?: string | null;
  shippingAddress1?: string | null;
  shippingAddress2?: string | null;
  items: OrderEmailItem[];
  orderUrl?: string;
};

export async function sendOrderConfirmationEmail(
  params: SendOrderConfirmationEmailParams
) {
  const from = process.env.EMAIL_FROM;

  if (!from) {
    throw new Error("Missing EMAIL_FROM environment variable.");
  }

  const { data, error } = await resend.emails.send({
    from,
    to: params.to,
    subject: `Order confirmation #${params.orderId.slice(-8).toUpperCase()}`,
    react: OrderConfirmationEmail({
      customerName: params.customerName,
      orderId: params.orderId,
      createdAt: params.createdAt,
      currency: params.currency,
      totalAmount: params.totalAmount,
      shippingCost: params.shippingCost,
      shippingMethod: params.shippingMethod,
      shippingCountry: params.shippingCountry,
      shippingRegion: params.shippingRegion,
      shippingCity: params.shippingCity,
      shippingPostcode: params.shippingPostcode,
      shippingAddress1: params.shippingAddress1,
      shippingAddress2: params.shippingAddress2,
      items: params.items,
      orderUrl: params.orderUrl,
    }),
  });

  if (error) {
    throw new Error(error.message || "Failed to send confirmation email.");
  }

  return data;
}