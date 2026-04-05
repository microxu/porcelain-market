import Link from "next/link";

export default function CheckoutSuccessPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-4">Payment successful</h1>
      <p className="text-gray-700 mb-6">
        Thank you. Your payment has been completed successfully.
      </p>

      <div className="flex gap-4">
        <Link href="/products" className="underline">
          Continue shopping
        </Link>
        <Link href="/cart" className="underline">
          Back to cart
        </Link>
      </div>
    </main>
  );
}