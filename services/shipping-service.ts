import { ShippingClass } from "@prisma/client";

type ShippingZone = "NZ" | "INTERNATIONAL";

type CartItemForShipping = {
  product: {
    shippingClass: ShippingClass;
  };
};

export type ShippingQuote = {
  shippingZone: ShippingZone;
  shippingMethod: string;
  shippingCost: number;
};

function normalizeCountry(country: string) {
  return country.trim().toLowerCase();
}

export function getShippingZone(country: string): ShippingZone {
  const normalized = normalizeCountry(country);

  if (
    normalized === "new zealand" ||
    normalized === "nz" ||
    normalized === "aotearoa"
  ) {
    return "NZ";
  }

  return "INTERNATIONAL";
}

function getRateForClass(
  shippingZone: ShippingZone,
  shippingClass: ShippingClass
) {
  const rates = {
    NZ: {
      SMALL: 10,
      MEDIUM: 18,
      LARGE: 30,
      OVERSIZED: 60,
    },
    INTERNATIONAL: {
      SMALL: 35,
      MEDIUM: 55,
      LARGE: 90,
      OVERSIZED: 160,
    },
  } as const;

  return rates[shippingZone][shippingClass];
}

export function calculateShippingForItems(
  items: CartItemForShipping[],
  country: string
): ShippingQuote {
  const shippingZone = getShippingZone(country);

  const shippingCost = items.reduce((sum, item) => {
    return sum + getRateForClass(shippingZone, item.product.shippingClass);
  }, 0);

  return {
    shippingZone,
    shippingMethod:
      shippingZone === "NZ"
        ? "NZ Standard Shipping"
        : "International Standard Shipping",
    shippingCost,
  };
}