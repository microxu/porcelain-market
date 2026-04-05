"use client";

import { useTransition } from "react";
import { OrderStatus } from "@prisma/client";
import { updateOrderStatusAction } from "@/app/orders/[id]/actions";
import { useToast } from "@/components/toast-provider";

type Props = {
  orderId: string;
  currentStatus: OrderStatus;
};

export default function AdminOrderActions({
  orderId,
  currentStatus,
}: Props) {
  const [isPending, startTransition] = useTransition();
  const { showToast } = useToast();

  function handleUpdate(status: OrderStatus) {
    startTransition(async () => {
      try {
        await updateOrderStatusAction(orderId, status);
        showToast(`Order marked as ${status.toLowerCase()}.`, "success");
      } catch (error) {
        showToast(
          error instanceof Error ? error.message : "Failed to update order.",
          "error"
        );
      }
    });
  }

  return (
    <div className="flex flex-wrap gap-3">
      <button
        type="button"
        disabled={isPending || currentStatus === OrderStatus.SHIPPED}
        onClick={() => handleUpdate(OrderStatus.SHIPPED)}
        className="rounded-xl border px-4 py-2 text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? "Updating..." : "Mark as shipped"}
      </button>

      <button
        type="button"
        disabled={isPending || currentStatus === OrderStatus.CANCELLED}
        onClick={() => handleUpdate(OrderStatus.CANCELLED)}
        className="rounded-xl border px-4 py-2 text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? "Updating..." : "Cancel order"}
      </button>
    </div>
  );
}