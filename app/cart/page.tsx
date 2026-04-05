import { Suspense } from "react";
import CartContent from "./cart-content";

export default function CartPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-8">Cart</h1>

      <Suspense fallback={<div>Loading cart...</div>}>
        <CartContent />
      </Suspense>
    </main>
  );
}