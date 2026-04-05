import * as React from "react";
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
  Link,
} from "@react-email/components";

type OrderItem = {
  id: string;
  productTitle: string;
  productSlug: string;
  unitPrice: string;
};

type Props = {
  customerName?: string | null;
  orderId: string;
  createdAt: string;
  email?: string | null;
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
  items: OrderItem[];
  orderUrl?: string;
};

function formatCurrency(amount: string, currency = "NZD") {
  return new Intl.NumberFormat("en-NZ", {
    style: "currency",
    currency,
  }).format(Number(amount));
}

function buildAddress(props: Props) {
  const lines = [
    props.customerName || "",
    props.shippingAddress1 || "",
    props.shippingAddress2 || "",
    [props.shippingCity, props.shippingRegion, props.shippingPostcode]
      .filter(Boolean)
      .join(", "),
    props.shippingCountry || "",
  ].filter(Boolean);

  return lines;
}

export default function OrderConfirmationEmail(props: Props) {
  const {
    customerName,
    orderId,
    createdAt,
    currency,
    totalAmount,
    shippingCost,
    shippingMethod,
    items,
    orderUrl,
  } = props;

  const addressLines = buildAddress(props);
  const shortOrderId = orderId.slice(-8).toUpperCase();

  return (
    <Html>
      <Head />
      <Preview>Your order #{shortOrderId} has been confirmed</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>Thanks for your order</Heading>

          <Text style={paragraph}>
            Hi {customerName || "there"},
          </Text>

          <Text style={paragraph}>
            We’ve received your order and your payment has been confirmed.
          </Text>

          <Section style={section}>
            <Text style={label}>Order number</Text>
            <Text style={value}>#{shortOrderId}</Text>

            <Text style={label}>Order date</Text>
            <Text style={value}>
              {new Intl.DateTimeFormat("en-NZ", {
                dateStyle: "medium",
                timeStyle: "short",
              }).format(new Date(createdAt))}
            </Text>
          </Section>

          <Hr style={hr} />

          <Heading as="h2" style={subheading}>
            Items
          </Heading>

          {items.map((item) => (
            <Section key={item.id} style={itemRow}>
              <Text style={itemTitle}>{item.productTitle}</Text>
              <Text style={itemPrice}>
                {formatCurrency(item.unitPrice, currency)}
              </Text>
            </Section>
          ))}

          <Hr style={hr} />

          <Heading as="h2" style={subheading}>
            Shipping
          </Heading>

          {shippingMethod && (
            <>
              <Text style={label}>Method</Text>
              <Text style={value}>{shippingMethod}</Text>
            </>
          )}

          {shippingCost != null && (
            <>
              <Text style={label}>Shipping cost</Text>
              <Text style={value}>
                {formatCurrency(shippingCost, currency)}
              </Text>
            </>
          )}

          {addressLines.length > 0 && (
            <>
              <Text style={label}>Delivery address</Text>
              {addressLines.map((line, index) => (
                <Text key={index} style={value}>
                  {line}
                </Text>
              ))}
            </>
          )}

          <Hr style={hr} />

          <Section style={section}>
            <Text style={totalLabel}>Total</Text>
            <Text style={totalValue}>
              {formatCurrency(totalAmount, currency)}
            </Text>
          </Section>

          {orderUrl && (
            <Text style={paragraph}>
              You can view your order here:{" "}
              <Link href={orderUrl} style={link}>
                View order details
              </Link>
            </Text>
          )}

          <Text style={footer}>
            Porcelain Market
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "32px 20px",
  backgroundColor: "#ffffff",
  maxWidth: "600px",
};

const heading = {
  fontSize: "28px",
  lineHeight: "36px",
  margin: "0 0 20px",
};

const subheading = {
  fontSize: "18px",
  lineHeight: "28px",
  margin: "0 0 12px",
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "26px",
  margin: "0 0 16px",
};

const section = {
  margin: "0 0 16px",
};

const label = {
  fontSize: "13px",
  lineHeight: "20px",
  color: "#6b7280",
  margin: "0",
};

const value = {
  fontSize: "15px",
  lineHeight: "24px",
  color: "#111827",
  margin: "0 0 10px",
};

const itemRow = {
  display: "flex",
  justifyContent: "space-between",
  gap: "12px",
  marginBottom: "12px",
};

const itemTitle = {
  fontSize: "15px",
  lineHeight: "24px",
  color: "#111827",
  margin: "0",
};

const itemPrice = {
  fontSize: "15px",
  lineHeight: "24px",
  color: "#111827",
  margin: "0",
};

const totalLabel = {
  fontSize: "16px",
  lineHeight: "24px",
  fontWeight: "700",
  margin: "0",
};

const totalValue = {
  fontSize: "18px",
  lineHeight: "28px",
  fontWeight: "700",
  margin: "4px 0 0",
};

const hr = {
  borderColor: "#e5e7eb",
  margin: "24px 0",
};

const link = {
  color: "#111827",
  textDecoration: "underline",
};

const footer = {
  fontSize: "12px",
  lineHeight: "20px",
  color: "#6b7280",
  marginTop: "28px",
};