import Link from "next/link";
import { getCartSummary } from "@/services/cart-service";
import { removeFromCart } from "./actions";
import CartCheckoutPanel from "@/components/cart-checkout-panel";

export default async function CartContent() {
  const { items, total, currency } = await getCartSummary();

  if (items.length === 0) {
    return <p>Your cart is empty.</p>;
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      <div className="space-y-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="border rounded-xl p-4 flex items-start gap-4"
          >
            <div className="w-24 h-24 bg-gray-100 rounded overflow-hidden flex items-center justify-center">
              {item.product.images[0] ? (
                <img
                  src={item.product.images[0].imageUrl}
                  alt={item.product.title}
                  className="w-full h-full object-contain"
                />
              ) : (
                <span className="text-xs text-gray-500">No image</span>
              )}
            </div>

            <div className="flex-1">
              <Link
                href={`/products/${item.product.slug}`}
                className="font-semibold hover:underline"
              >
                {item.product.title}
              </Link>

              <p className="text-sm text-gray-500 mt-1">
                {item.product.brand ?? "Unknown brand"}
              </p>

              <p className="mt-2 font-medium">
                ${item.product.price.toString()}
              </p>
            </div>

            <form action={removeFromCart}>
              <input type="hidden" name="productId" value={item.product.id} />
              <button className="text-sm text-red-600 hover:underline">
                Remove
              </button>
            </form>
          </div>
        ))}
      </div>

      <CartCheckoutPanel
        itemCount={items.length}
        subtotal={total}
        currency={currency}
      />
    </div>
  );
}