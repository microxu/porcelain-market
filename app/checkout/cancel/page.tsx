import Link from "next/link";

export default function CheckoutCancelPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-4">Checkout cancelled</h1>
      <p className="text-gray-700 mb-6">
        Your payment was cancelled. Your cart is still available.
      </p>

      <Link href="/cart" className="underline">
        Return to cart
      </Link>
    </main>
  );
}