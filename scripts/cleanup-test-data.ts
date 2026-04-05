import { prisma } from "@/lib/prisma";
import { ProductStatus } from "@prisma/client";

async function main() {
  console.log("Cleaning test orders and carts...");

  const soldProductIds = await prisma.orderItem.findMany({
    select: { productId: true },
    distinct: ["productId"],
  });

  const productIds = soldProductIds.map((item) => item.productId);

  const deletedOrderItems = await prisma.orderItem.deleteMany({});
  console.log(`Deleted order items: ${deletedOrderItems.count}`);

  const deletedOrders = await prisma.order.deleteMany({});
  console.log(`Deleted orders: ${deletedOrders.count}`);

  const deletedCartItems = await prisma.cartItem.deleteMany({});
  console.log(`Deleted cart items: ${deletedCartItems.count}`);

  const deletedCarts = await prisma.cart.deleteMany({});
  console.log(`Deleted carts: ${deletedCarts.count}`);

  if (productIds.length > 0) {
    const updatedProducts = await prisma.product.updateMany({
      where: {
        id: { in: productIds },
        status: ProductStatus.SOLD,
      },
      data: {
        status: ProductStatus.AVAILABLE,
      },
    });

    console.log(`Reset products to AVAILABLE: ${updatedProducts.count}`);
  }

  console.log("Cleanup complete.");
}

main()
  .catch((error) => {
    console.error("Cleanup failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });