import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { SignOutButton } from "@/components/auth-buttons";

export async function HomeAuthNav() {
  const session = await getServerSession(authOptions);
  const isAdmin = session?.user?.role === "ADMIN";

  return (
    <nav className="flex items-center gap-8 text-sm whitespace-nowrap">
      <Link href="/products" className="hover:underline">
        Products
      </Link>

      {isAdmin && (
        <Link href="/admin/products/new" className="hover:underline">
          Add New
        </Link>
      )}

      {!session ? (
        <Link href="/login" className="hover:underline">
          Login
        </Link>
      ) : (
        <SignOutButton />
      )}
    </nav>
  );
}