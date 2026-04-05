"use client";

import Link from "next/link";
import { useActionState, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";
import { addToCart } from "@/app/cart/actions";
import type { AddToCartState } from "@/app/cart/actions";
import { useToast } from "@/components/toast-provider";

type Props = {
  productId: number;
  disabled?: boolean;
};

const initialState: AddToCartState = {
  success: false,
  message: "",
};

function SubmitButton({ disabled }: { disabled?: boolean }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={disabled || pending}
      className="px-4 py-2 rounded bg-black text-white disabled:bg-gray-400 disabled:cursor-not-allowed"
    >
      {disabled ? "Not Available" : pending ? "Adding..." : "Add to Cart"}
    </button>
  );
}

export default function AddToCartButton({ productId, disabled }: Props) {
  const router = useRouter();
  const { showToast } = useToast();

  const [state, formAction] = useActionState(addToCart, initialState);
  const [showCartLink, setShowCartLink] = useState(false);
  const lastToastMessageRef = useRef("");

  useEffect(() => {
    if (!state.message) return;
    if (lastToastMessageRef.current === state.message) return;

    lastToastMessageRef.current = state.message;

    showToast(state.message, state.success ? "success" : "error");

    setShowCartLink(state.success);

    if (state.success) {
      router.refresh();
    }
  }, [state.message, state.success, router, showToast]);

  return (
    <div className="mt-6 space-y-2">
      <form action={formAction}>
        <input type="hidden" name="productId" value={productId} />
        <SubmitButton disabled={disabled} />
      </form>

      {showCartLink && (
        <Link
          href="/cart"
          className="inline-block text-sm text-blue-600 hover:underline"
        >
          View cart
        </Link>
      )}
    </div>
  );
}