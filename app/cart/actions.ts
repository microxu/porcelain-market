"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import {
  createCart,
  addProductToCart,
  removeProductFromCart,
  getActiveCartById,
} from "@/services/cart-service";

const CART_COOKIE_NAME = "cartId";

export type AddToCartState = {
  success: boolean;
  message: string;
};

async function getOrCreateCartId() {
  const cookieStore = await cookies();
  const existingCartId = cookieStore.get(CART_COOKIE_NAME)?.value;

  if (existingCartId) {
    const existingActiveCart = await getActiveCartById(existingCartId);

    if (existingActiveCart) {
      return existingActiveCart.id;
    }
  }

  const cart = await createCart();

  cookieStore.set(CART_COOKIE_NAME, cart.id, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });

  return cart.id;
}

export async function addToCart(
  prevState: AddToCartState,
  formData: FormData
): Promise<AddToCartState> {
  const productId = Number(formData.get("productId"));

  if (!productId) {
    return {
      success: false,
      message: "Invalid product id.",
    };
  }

  try {
    const cartId = await getOrCreateCartId();
    const result = await addProductToCart(cartId, productId);

    revalidatePath("/cart");
    revalidatePath("/", "layout");

    if (result.alreadyInCart) {
      return {
        success: true,
        message: "Already in cart.",
      };
    }

    return {
      success: true,
      message: "Added to cart.",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to add to cart.",
    };
  }
}

export async function removeFromCart(formData: FormData) {
  const productId = Number(formData.get("productId"));
  const cookieStore = await cookies();
  const cartId = cookieStore.get(CART_COOKIE_NAME)?.value;

  if (!cartId || !productId) {
    return;
  }

  await removeProductFromCart(cartId, productId);

  revalidatePath("/cart");
  revalidatePath("/", "layout");
}