import { Suspense } from "react";
import OrdersContent from "./orders-content";

export default function OrdersPage() {
  return (
    <main className="max-w-6xl mx-auto px-6 py-10">
      <Suspense fallback={<div>Loading orders...</div>}>
        <OrdersContent />
      </Suspense>
    </main>
  );
}