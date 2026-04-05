import { Suspense } from "react";
import EditProductGate from "./edit-product-gate";

type Props = {
  params: Promise<{ id: string }>;
};

function LoadingEditPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-10">
      <p className="text-sm text-gray-500">Loading...</p>
    </main>
  );
}

export default function EditProductPage({ params }: Props) {
  return (
    <Suspense fallback={<LoadingEditPage />}>
      <EditProductGate params={params} />
    </Suspense>
  );
}