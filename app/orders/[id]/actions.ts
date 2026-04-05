"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { OrderStatus } from "@prisma/client";
import { updateOrderStatus } from "@/services/order-service";

export async function updateOrderStatusAction(
  orderId: string,
  status: OrderStatus
) {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  await updateOrderStatus(orderId, status);

  revalidatePath("/orders");
  revalidatePath(`/orders/${orderId}`);
}