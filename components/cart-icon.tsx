// components/cart-icon.tsx
import Link from "next/link";
import { getCartItemCount } from "@/services/cart-service";

export default async function CartIcon() {
  const count = await getCartItemCount();

  return (
    <Link href="/cart" className="relative inline-flex">
      <span aria-label="Cart">🛒</span>

      {count > 0 && (
        <span className="absolute -top-2 -right-2 min-w-5 rounded-full bg-red-600 px-1 text-center text-xs text-white">
          {count}
        </span>
      )}
    </Link>
  );
}