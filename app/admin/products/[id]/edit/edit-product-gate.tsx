import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth-guard";
import { getProductById } from "@/services/product-service";
import { updateProduct, deleteProduct } from "@/app/admin/products/actions";

export default async function EditProductGate({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    await requireAdmin();

    const { id } = await params;
    const product = await getProductById(Number(id));

    if (!product) {
        notFound();
    }

    return (
        <main className="max-w-4xl mx-auto px-6 py-10">
            <h1 className="text-3xl font-bold mb-8">Edit Product</h1>

            <form action={updateProduct} className="space-y-6">
                <input type="hidden" name="id" value={product.id} />
                <input type="hidden" name="originalSlug" value={product.slug} />

                <div>
                    <label className="block text-sm font-medium mb-1">Title</label>
                    <input
                        name="title"
                        defaultValue={product.title}
                        required
                        className="w-full border rounded px-3 py-2"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea
                        name="description"
                        defaultValue={product.description ?? ""}
                        rows={5}
                        className="w-full border rounded px-3 py-2"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Price</label>
                    <input
                        name="price"
                        defaultValue={product.price ?? ""}
                        required
                        className="w-full border rounded px-3 py-2"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <input
                        name="brand"
                        defaultValue={product.brand ?? ""}
                        placeholder="Brand"
                        className="w-full border rounded px-3 py-2"
                    />
                    <input
                        name="condition"
                        defaultValue={product.condition ?? ""}
                        placeholder="Condition"
                        className="w-full border rounded px-3 py-2"
                    />
                    <input
                        name="era"
                        defaultValue={product.era ?? ""}
                        placeholder="Era"
                        className="w-full border rounded px-3 py-2"
                    />
                    <input
                        name="material"
                        defaultValue={product.material ?? ""}
                        placeholder="Material"
                        className="w-full border rounded px-3 py-2"
                    />
                    <input
                        name="width"
                        defaultValue={product.width ?? ""}
                        placeholder="Width"
                        className="w-full border rounded px-3 py-2"
                    />
                    <input
                        name="height"
                        defaultValue={product.height ?? ""}
                        placeholder="Height"
                        className="w-full border rounded px-3 py-2"
                    />
                    <input
                        name="depth"
                        defaultValue={product.depth ?? ""}
                        placeholder="Depth"
                        className="w-full border rounded px-3 py-2"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Status</label>
                    <select
                        name="status"
                        defaultValue={product.status}
                        className="w-full border rounded px-3 py-2"
                    >
                        <option value="DRAFT">Draft</option>
                        <option value="AVAILABLE">Available</option>
                        <option value="RESERVED">Reserved</option>
                        <option value="SOLD">Sold</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">
                        Image URLs (one per line)
                    </label>
                    <textarea
                        name="imageUrls"
                        defaultValue={product.images.map((img) => img.imageUrl).join("\n")}
                        rows={6}
                        className="w-full border rounded px-3 py-2"
                    />
                </div>

                <button className="px-4 py-2 rounded bg-black text-white">
                    Update Product
                </button>
            </form>

            <div className="mt-10 border-t pt-6">
                <h2 className="text-lg font-semibold text-red-600 mb-3">Danger Zone</h2>

                <form action={deleteProduct}>
                    <input type="hidden" name="id" value={product.id} />
                    <input type="hidden" name="slug" value={product.slug} />
                    <button className="px-4 py-2 rounded bg-red-600 text-white">
                        Delete Product
                    </button>
                </form>
            </div>
        </main>
    );
}