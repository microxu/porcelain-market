import { Suspense } from "react";
import OrderContent from "./order-content";

type Props = {
  params: Promise<{ id: string }>;
};

export default function OrderDetailPage({ params }: Props) {
  return (
    <main className="max-w-4xl mx-auto px-6 py-10">
      <Suspense fallback={<div>Loading order...</div>}>
        <OrderContent params={params} />
      </Suspense>
    </main>
  );
}