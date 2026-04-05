import { Suspense } from "react";
import NewProductGate from "./new-product-gate";

function LoadingAdminPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-10">
      <p className="text-sm text-gray-500">Loading...</p>
    </main>
  );
}

export default function NewProductPage() {
  return (
    <Suspense fallback={<LoadingAdminPage />}>
      <NewProductGate />
    </Suspense>
  );
}