import Link from "next/link";
import { Suspense } from "react";
import { HomeAuthNav } from "@/components/home-auth-nav";

function AuthNavFallback() {
  return (
    <div className="flex items-center gap-6 text-sm whitespace-nowrap">
      <Link href="/products" className="hover:underline">
        Products
      </Link>
      <span className="text-gray-400">Loading...</span>
    </div>
  );
}

export default function Home() {
  return (
    <main className="max-w-6xl mx-auto px-6 py-16">
      <div className="grid grid-cols-[auto_1fr] items-center gap-8 mb-10">
        <Link href="/" className="text-xl font-semibold whitespace-nowrap">
          Porcelain Market
        </Link>

        <div className="justify-self-end">
          <Suspense fallback={<AuthNavFallback />}>
            <HomeAuthNav />
          </Suspense>
        </div>
      </div>

      <h1 className="text-4xl font-bold mb-4">Porcelain Collection</h1>
      <p className="text-lg text-gray-600 mb-8">
        Vintage Lladro and Boehm pieces.
      </p>

      <Link
        href="/products"
        className="inline-block px-6 py-3 rounded-lg bg-black text-white"
      >
        View Products
      </Link>
    </main>
  );
}