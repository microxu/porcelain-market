import Link from "next/link";
import { Suspense } from "react";
import CartIcon from "@/components/cart-icon";
import NavbarContent from "@/components/navbar-content";

export default function Navbar() {
  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-xl font-semibold">
          Porcelain Collection
        </Link>

        <nav className="flex items-center gap-6 text-sm">
          <Link href="/" className="hover:text-gray-600">
            Home
          </Link>

          <Link href="/products" className="hover:text-gray-600">
            Products
          </Link>

          <Suspense fallback={null}>
            <NavbarContent />
          </Suspense>

          <Suspense fallback={<span>🛒</span>}>
            <CartIcon />
          </Suspense>
        </nav>
      </div>
    </header>
  );
}