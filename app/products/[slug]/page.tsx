import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/services/product-service";
import { addToCart } from "@/app/cart/actions";
import AdminProductEditLink from "./admin-product-edit-link";
import AddToCartButton from "@/components/add-to-cart-button";

type Props = {
  params: Promise<{ slug: string }>;
};

async function ProductDetailContent({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) return notFound();

  const isAvailable = product.status === "AVAILABLE";

  return (
    <>
      <div className="mb-6 text-sm text-gray-500">
        <Link href="/" className="hover:text-gray-700 hover:underline">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link href="/products" className="hover:text-gray-700 hover:underline">
          Products
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800">{product.title}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div>
          <div className="grid gap-4">
            {product.images.length > 0 ? (
              product.images.map((image) => (
                <img
                  key={image.id}
                  src={image.imageUrl}
                  alt={product.title}
                  className="w-full rounded-xl border object-cover"
                />
              ))
            ) : (
              <div className="aspect-square bg-gray-100 rounded-xl flex items-center justify-center">
                No image
              </div>
            )}
          </div>
        </div>

        <div>
          <h1 className="text-3xl font-bold">{product.title}</h1>
          <p className="text-xl mt-3">${product.price}</p>
          <p className="mt-2 text-sm text-gray-600">
            Status: {product.status}
          </p>

          {!isAvailable && (
            <p className="mt-3 text-sm text-gray-500">
              This item is currently not available for purchase.
            </p>
          )}

          <Suspense fallback={null}>
            <AdminProductEditLink productId={product.id} />
          </Suspense>

          <div className="mt-6 space-y-2 text-sm">
            {product.brand && (
              <p>
                <strong>Brand:</strong> {product.brand}
              </p>
            )}
            {product.condition && (
              <p>
                <strong>Condition:</strong> {product.condition}
              </p>
            )}
            {product.era && (
              <p>
                <strong>Era:</strong> {product.era}
              </p>
            )}
            {product.material && (
              <p>
                <strong>Material:</strong> {product.material}
              </p>
            )}
            {product.width && (
              <p>
                <strong>Width:</strong> {product.width} cm
              </p>
            )}
            {product.height && (
              <p>
                <strong>Height:</strong> {product.height} cm
              </p>
            )}
            {product.depth && (
              <p>
                <strong>Depth:</strong> {product.depth} cm
              </p>
            )}
          </div>

          {product.description && (
            <div className="mt-6">
              <h2 className="font-semibold mb-2">Description</h2>
              <p className="text-gray-700 whitespace-pre-line">
                {product.description}
              </p>
            </div>
          )}

          {product.categories.length > 0 && (
            <div className="mt-6">
              <h2 className="font-semibold mb-2">Categories</h2>
              <div className="flex flex-wrap gap-2">
                {product.categories.map((pc) => (
                  <span
                    key={pc.category.id}
                    className="px-3 py-1 rounded-full bg-gray-100 text-sm"
                  >
                    {pc.category.name}
                  </span>
                ))}
              </div>
            </div>
          )}

         <AddToCartButton productId={product.id} disabled={!isAvailable} />
        </div>
      </div>
    </>
  );
}

export default function ProductDetailPage({ params }: Props) {
  return (
    <main className="max-w-5xl mx-auto px-6 py-10">
      <Suspense fallback={<div>Loading product...</div>}>
        <ProductDetailContent params={params} />
      </Suspense>
    </main>
  );
}