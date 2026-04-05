import Link from "next/link";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { getOrderById } from "@/services/order-service";
import AdminOrderActions from "@/components/admin-order-actions";

type Props = {
  params: Promise<{ id: string }>;
};

function getStatusBadgeClasses(status: string) {
  switch (status) {
    case "PAID":
      return "bg-green-100 text-green-700";
    case "SHIPPED":
      return "bg-blue-100 text-blue-700";
    case "FAILED":
      return "bg-red-100 text-red-700";
    case "CANCELLED":
      return "bg-gray-100 text-gray-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

export default async function OrderContent({ params }: Props) {
  const { id } = await params;
  const [order, session] = await Promise.all([
    getOrderById(id),
    getServerSession(authOptions),
  ]);

  if (!order) {
    return notFound();
  }

  const isAdmin = session?.user?.role === "ADMIN";

  return (
    <>
      <div className="mb-6 text-sm text-gray-500">
        <Link href="/" className="hover:text-gray-700 hover:underline">
          Home
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800">Order</span>
      </div>

      <h1 className="text-3xl font-bold mb-8">Order Details</h1>

      {isAdmin && (
        <div className="mb-6">
          <AdminOrderActions
            orderId={order.id}
            currentStatus={order.status}
          />
        </div>
      )}

      <div className="rounded-2xl border p-6 space-y-4 mb-8">
        <div className="flex justify-between gap-4">
          <span className="text-gray-500">Order ID</span>
          <span className="font-medium break-all text-right">{order.id}</span>
        </div>

        <div className="flex justify-between gap-4 items-center">
          <span className="text-gray-500">Status</span>
          <span
            className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${getStatusBadgeClasses(
              order.status
            )}`}
          >
            {order.status}
          </span>
        </div>

        <div className="flex justify-between gap-4">
          <span className="text-gray-500">Email</span>
          <span className="font-medium text-right">
            {order.email ?? "N/A"}
          </span>
        </div>

        <div className="flex justify-between gap-4">
          <span className="text-gray-500">Phone</span>
          <span className="font-medium text-right">
            {order.phone ?? "N/A"}
          </span>
        </div>

        <div className="flex justify-between gap-4">
          <span className="text-gray-500">Currency</span>
          <span className="font-medium">{order.currency}</span>
        </div>

        <div className="flex justify-between gap-4">
          <span className="text-gray-500">Total</span>
          <span className="font-medium">
            {order.currency} {order.totalAmount}
          </span>
        </div>

        <div className="flex justify-between gap-4">
          <span className="text-gray-500">Shipping Method</span>
          <span className="font-medium text-right">
            {order.shippingMethod ?? "N/A"}
          </span>
        </div>

        <div className="flex justify-between gap-4">
          <span className="text-gray-500">Shipping Cost</span>
          <span className="font-medium text-right">
            {order.shippingCost != null
              ? `${order.currency} ${order.shippingCost}`
              : "N/A"}
          </span>
        </div>

        <div className="flex justify-between gap-4">
          <span className="text-gray-500">Created At</span>
          <span className="font-medium text-right">
            {new Date(order.createdAt).toLocaleString()}
          </span>
        </div>

        <div className="pt-2 border-t">
          <p className="text-gray-500 mb-2">Shipping Address</p>
          <div className="text-sm text-gray-800 space-y-1">
            <p>{order.customerName ?? "N/A"}</p>
            <p>{order.shippingAddress1 ?? ""}</p>
            {order.shippingAddress2 && <p>{order.shippingAddress2}</p>}
            <p>
              {[order.shippingCity, order.shippingRegion, order.shippingPostcode]
                .filter(Boolean)
                .join(", ")}
            </p>
            <p>{order.shippingCountry ?? ""}</p>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Items</h2>

        <div className="space-y-4">
          {order.items.map((item) => (
            <div
              key={item.id}
              className="rounded-xl border p-4 flex items-start justify-between gap-4"
            >
              <div>
                <Link
                  href={`/products/${item.productSlug}`}
                  className="font-medium hover:underline"
                >
                  {item.productTitle}
                </Link>

                <p className="text-sm text-gray-500 mt-1">
                  Product ID: {item.productId}
                </p>
              </div>

              <div className="font-medium">
                {order.currency} {item.unitPrice}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}