import { Suspense } from "react";
import Link from "next/link";
import { getProductsForCatalog } from "@/services/product-service";
import AdminEditLink from "./admin-edit-link";

function getStatusLabel(status: string) {
  switch (status) {
    case "DRAFT":
      return "Draft";
    case "AVAILABLE":
      return "Available";
    case "RESERVED":
      return "Reserved";
    case "SOLD":
      return "Sold";
    default:
      return status;
  }
}

function AdminEditFallback() {
  return <div className="mt-3 h-5" />;
}

export default async function ProductsPage() {
  const products = await getProductsForCatalog();

  return (
    <main className="max-w-6xl mx-auto px-6 py-10">
      <div className="mb-6 text-sm text-gray-500">
        <Link href="/" className="hover:text-gray-700 hover:underline">
          Home
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800">Products</span>
      </div>

      <h1 className="text-3xl font-bold mb-8">Products</h1>

      {products.length === 0 ? (
        <p>No products yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className={`border rounded-xl p-4 transition ${
                product.status === "AVAILABLE"
                  ? "hover:shadow-md"
                  : "opacity-70 grayscale"
              }`}
            >
              <Link href={`/products/${product.slug}`} className="block">
                <div className="aspect-square bg-gray-100 rounded-lg mb-4 overflow-hidden flex items-center justify-center">
                  {product.images[0] ? (
                    <img
                      src={product.images[0].imageUrl}
                      alt={product.title}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <span className="text-sm text-gray-500">No image</span>
                  )}
                </div>

                <h2 className="text-lg font-semibold hover:underline">
                  {product.title}
                </h2>
              </Link>

              <p className="text-sm text-gray-500 mt-1">
                {product.brand ?? "Unknown brand"}
              </p>

              <p className="text-base font-medium mt-2">${product.price}</p>

              {product.status !== "AVAILABLE" && (
                <span className="inline-block mt-2 text-xs px-2 py-1 rounded bg-gray-200 text-gray-600">
                  {getStatusLabel(product.status)}
                </span>
              )}

              <Suspense fallback={<AdminEditFallback />}>
                <AdminEditLink productId={product.id} />
              </Suspense>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}