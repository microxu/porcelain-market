import { prisma } from "@/lib/prisma";
import { CartStatus, OrderStatus, ProductStatus, Prisma } from "@prisma/client";

type CreateOrderFromCartParams = {
    cartId: string;
    userId?: string | null;
    paypalOrderId: string;
    paypalCaptureId?: string | null;
    email?: string | null;
    customerName?: string | null;
    phone?: string | null;
    shippingCountry?: string | null;
    shippingRegion?: string | null;
    shippingCity?: string | null;
    shippingPostcode?: string | null;
    shippingAddress1?: string | null;
    shippingAddress2?: string | null;
    shippingCost?: number | null;
    shippingMethod?: string | null;
    currency: string;
    totalAmount: number;
};

export async function createOrderFromCart({
    cartId,
    userId,
    paypalOrderId,
    paypalCaptureId,
    email,
    customerName,
    phone,
    shippingCountry,
    shippingRegion,
    shippingCity,
    shippingPostcode,
    shippingAddress1,
    shippingAddress2,
    shippingCost,
    shippingMethod,
    currency,
    totalAmount,
}: CreateOrderFromCartParams) {
    return prisma.$transaction(async (tx) => {
        const existingOrder = await tx.order.findUnique({
            where: { paypalOrderId },
            include: { items: true },
        });

        if (existingOrder) {
            return existingOrder;
        }

        const cart = await tx.cart.findUnique({
            where: { id: cartId },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                    orderBy: { createdAt: "desc" },
                },
            },
        });

        if (!cart) {
            throw new Error("Cart not found.");
        }

        if (cart.items.length === 0) {
            throw new Error("Cart is empty.");
        }

        if (cart.status !== CartStatus.ACTIVE) {
            throw new Error("Cart is no longer active.");
        }

        const productIds = cart.items.map((item) => item.product.id);

        const updatedProducts = await tx.product.updateMany({
            where: {
                id: { in: productIds },
                status: ProductStatus.AVAILABLE,
            },
            data: {
                status: ProductStatus.SOLD,
            },
        });

        if (updatedProducts.count !== productIds.length) {
            throw new Error("Some products are no longer available.");
        }

        const order = await tx.order.create({
            data: {
                cartId,
                userId: userId ?? null,
                paypalOrderId,
                paypalCaptureId: paypalCaptureId ?? null,
                email: email ?? null,
                customerName: customerName ?? null,
                phone: phone ?? null,
                shippingCountry: shippingCountry ?? null,
                shippingRegion: shippingRegion ?? null,
                shippingCity: shippingCity ?? null,
                shippingPostcode: shippingPostcode ?? null,
                shippingAddress1: shippingAddress1 ?? null,
                shippingAddress2: shippingAddress2 ?? null,
                shippingCost:
                    shippingCost != null
                        ? new Prisma.Decimal(shippingCost.toFixed(2))
                        : null,
                shippingMethod: shippingMethod ?? null,
                currency,
                totalAmount: new Prisma.Decimal(totalAmount.toFixed(2)),
                status: OrderStatus.PAID,
                items: {
                    create: cart.items.map((item) => ({
                        productId: item.product.id,
                        productTitle: item.product.title,
                        productSlug: item.product.slug,
                        unitPrice: item.product.price,
                    })),
                },
            },
            include: {
                items: true,
            },
        });

        await tx.cart.update({
            where: { id: cartId },
            data: {
                status: CartStatus.CONVERTED,
            },
        });

        return order;
    });
}

export async function getOrderById(orderId: string) {
    const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
            items: true,
        },
    });

    if (!order) return null;

    return {
        ...order,
        totalAmount: order.totalAmount.toString(),
        shippingCost: order.shippingCost?.toString() ?? null,
        items: order.items.map((item) => ({
            ...item,
            unitPrice: item.unitPrice.toString(),
        })),
    };
}

function serializeOrders(orders: any[]) {
    return orders.map((order) => ({
        ...order,
        totalAmount: order.totalAmount.toString(),
        shippingCost: order.shippingCost?.toString() ?? null,
        items: order.items.map((item: any) => ({
            ...item,
            unitPrice: item.unitPrice.toString(),
        })),
    }));
}

export async function getOrdersForUser(userId: string) {
    const orders = await prisma.order.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        include: {
            items: {
                select: {
                    id: true,
                    productTitle: true,
                    productSlug: true,
                    unitPrice: true,
                },
            },
        },
    });

    return serializeOrders(orders);
}

export async function getAllOrdersForAdmin() {
    const orders = await prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        include: {
            items: {
                select: {
                    id: true,
                    productTitle: true,
                    productSlug: true,
                    unitPrice: true,
                },
            },
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
        },
    });

    orders.sort((a, b) => {
        const aPriority = a.status === "PAID" ? 0 : 1;
        const bPriority = b.status === "PAID" ? 0 : 1;

        if (aPriority !== bPriority) {
            return aPriority - bPriority;
        }

        return b.createdAt.getTime() - a.createdAt.getTime();
    });

    return serializeOrders(orders);
}

export async function updateOrderStatus(
    orderId: string,
    status: OrderStatus
) {
    return prisma.$transaction(async (tx) => {
        const order = await tx.order.findUnique({
            where: { id: orderId },
            include: {
                items: true,
            },
        });

        if (!order) {
            throw new Error("Order not found.");
        }

        if (order.status === status) {
            return order;
        }

        const updatedOrder = await tx.order.update({
            where: { id: orderId },
            data: { status },
            include: {
                items: true,
            },
        });

        if (status === OrderStatus.CANCELLED) {
            const productIds = order.items.map((item) => item.productId);

            if (productIds.length > 0) {
                await tx.product.updateMany({
                    where: {
                        id: { in: productIds },
                        status: ProductStatus.SOLD,
                    },
                    data: {
                        status: ProductStatus.AVAILABLE,
                    },
                });
            }
        }

        return updatedOrder;
    });
}