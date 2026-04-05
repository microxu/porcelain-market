import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import {
  getAllOrdersForAdmin,
  getOrdersForUser,
} from "@/services/order-service";

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

function formatDate(date: string | Date) {
  return new Intl.DateTimeFormat("en-NZ", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

function formatCurrency(amount: string, currency = "NZD") {
  return new Intl.NumberFormat("en-NZ", {
    style: "currency",
    currency,
  }).format(Number(amount));
}

export default async function OrdersContent() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const isAdmin = session.user.role === "ADMIN";

  const orders = isAdmin
    ? await getAllOrdersForAdmin()
    : await getOrdersForUser(session.user.id);

  const paidOrdersCount = isAdmin
    ? orders.filter((order) => order.status === "PAID").length
    : 0;

  return (
    <>
      <div className="mb-6 text-sm text-gray-500">
        <Link href="/" className="hover:text-gray-700 hover:underline">
          Home
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800">Orders</span>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold">Orders</h1>
        <p className="mt-2 text-sm text-gray-500">
          {isAdmin ? "All customer orders" : "Your order history"}
        </p>
      </div>

      {isAdmin && paidOrdersCount > 0 && (
        <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {paidOrdersCount} paid order{paidOrdersCount > 1 ? "s" : ""} need attention.
        </div>
      )}

      {orders.length === 0 ? (
        <div className="rounded-2xl border bg-white p-8 text-center text-gray-500">
          No orders yet.
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="rounded-2xl border bg-white p-5 shadow-sm"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-lg font-semibold">
                      Order #{order.id.slice(-8).toUpperCase()}
                    </h2>
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getStatusBadgeClasses(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </div>

                  <p className="text-sm text-gray-500">
                    Placed on {formatDate(order.createdAt)}
                  </p>

                  {isAdmin && (
                    <div className="text-sm text-gray-600">
                      <div>
                        Customer: {order.customerName || order.user?.name || "—"}
                      </div>
                      <div>
                        Email: {order.email || order.user?.email || "—"}
                      </div>
                    </div>
                  )}

                  <div className="text-sm text-gray-700">
                    <div>
                      {order.items.length} item{order.items.length > 1 ? "s" : ""}
                    </div>
                    <div className="mt-1">
                      {order.items.slice(0, 2).map((item) => (
                        <div key={item.id}>{item.productTitle}</div>
                      ))}
                      {order.items.length > 2 && (
                        <div className="text-gray-500">
                          +{order.items.length - 2} more
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-start gap-3 md:items-end">
                  <div className="text-lg font-semibold">
                    {formatCurrency(order.totalAmount, order.currency)}
                  </div>

                  <Link
                    href={`/orders/${order.id}`}
                    className="inline-flex rounded-xl border px-4 py-2 text-sm font-medium hover:bg-gray-50"
                  >
                    View details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}