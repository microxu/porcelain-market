// services/cart-service.ts
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { CartStatus, ProductStatus } from "@prisma/client";

const CART_COOKIE = "cartId";

export async function getCartIdFromCookie() {
  const cookieStore = await cookies();
  return cookieStore.get(CART_COOKIE)?.value ?? null;
}

export async function getActiveCartById(cartId: string) {
  return prisma.cart.findFirst({
    where: {
      id: cartId,
      status: CartStatus.ACTIVE,
    },
  });
}

export async function getCart() {
  const cartId = await getCartIdFromCookie();
  if (!cartId) return null;

  return prisma.cart.findUnique({
    where: { id: cartId,
        status: CartStatus.ACTIVE,
     },
    include: {
      items: {
        include: {
          product: {
            include: {
              images: {
                orderBy: { sortOrder: "asc" },
                take: 1,
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });
}

export async function getCartItemCount() {
  const cartId = await getCartIdFromCookie();
  if (!cartId) return 0;

  const cart = await prisma.cart.findFirst({
    where: {
      id: cartId,
      status: CartStatus.ACTIVE,
    },
    select: {
      id: true,
    },
  });

  if (!cart) {
    return 0;
  }

  return prisma.cartItem.count({
    where: { cartId: cart.id },
  });
}

export async function getCartById(cartId: string) {
  return prisma.cart.findUnique({
    where: { id: cartId },
    include: {
      items: {
        orderBy: { createdAt: "desc" },
        include: {
          product: {
            include: {
              images: {
                orderBy: { sortOrder: "asc" },
                take: 1,
              },
            },
          },
        },
      },
    },
  });
}

export async function createCart(userId?: string) {
  return prisma.cart.create({
    data: {
      userId,
      status: "ACTIVE",
    },
  });
}

export async function addProductToCart(cartId: string, productId: number) {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { id: true, status: true },
  });

  if (!product) {
    throw new Error("Product not found.");
  }

  if (product.status !== ProductStatus.AVAILABLE) {
    throw new Error("Only available products can be added to cart.");
  }

  const existingItem = await prisma.cartItem.findUnique({
    where: {
      cartId_productId: {
        cartId,
        productId,
      },
    },
  });

  if (existingItem) {
    return {
      alreadyInCart: true,
      item: existingItem,
    };
  }

  const item = await prisma.cartItem.create({
    data: {
      cartId,
      productId
    },
  });

  return {
    alreadyInCart: false,
    item,
  };
}

export async function removeProductFromCart(cartId: string, productId: number) {
  return prisma.cartItem.deleteMany({
    where: {
      cartId,
      productId,
    },
  });
}
export async function getCartSummary() {
  const cart = await getCart();
  const items = cart?.items ?? [];

  const total = items.reduce((sum, item) => {
    return sum + Number(item.product.price);
  }, 0);

  return {
    cart,
    items,
    total,
    currency: "NZD",
  };
}