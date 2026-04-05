import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { getAllOrdersForAdmin } from "@/services/order-service";

export default async function NavbarContent() {
  const session = await getServerSession(authOptions);
  const isAdmin = session?.user?.role === "ADMIN";

  if (!session?.user) {
    return (
      <Link href="/login" className="hover:text-gray-600">
        Sign in
      </Link>
    );
  }

  let paidOrdersCount = 0;

  if (isAdmin) {
    const orders = await getAllOrdersForAdmin();
    paidOrdersCount = orders.filter((order) => order.status === "PAID").length;
  }

  return (
    <Link href="/orders" className="relative hover:text-gray-600">
      <span>Orders</span>
      {isAdmin && paidOrdersCount > 0 && (
        <span className="ml-2 inline-flex min-w-[20px] items-center justify-center rounded-full bg-amber-500 px-2 py-0.5 text-xs font-semibold text-white">
          {paidOrdersCount}
        </span>
      )}
    </Link>
  );
}