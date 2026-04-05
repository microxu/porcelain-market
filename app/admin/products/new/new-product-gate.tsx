import { createProduct } from "../actions";
import { requireAdmin } from "@/lib/auth-guard";

export default async function NewProductGate() {
    await requireAdmin();

    return (
        <main className="max-w-3xl mx-auto px-6 py-10">
            <h1 className="text-3xl font-bold mb-8">Add Product</h1>

            <form action={createProduct} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium mb-2">Title</label>
                    <input
                        name="title"
                        type="text"
                        required
                        className="w-full rounded-lg border px-4 py-2"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <textarea
                        name="description"
                        rows={5}
                        defaultValue="Original box: Yes"
                        className="w-full rounded-lg border px-4 py-2"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Price</label>
                    <input
                        name="price"
                        type="text"
                        required
                        placeholder="1200.00"
                        className="w-full rounded-lg border px-4 py-2"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Brand</label>
                    <input
                        name="brand"
                        type="text"
                        defaultValue="Lladro"
                        className="w-full rounded-lg border px-4 py-2"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Condition</label>
                    <input
                        name="condition"
                        type="text"
                        defaultValue="Excellent"
                        className="w-full rounded-lg border px-4 py-2"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Era</label>
                    <input
                        name="era"
                        type="text"
                        className="w-full rounded-lg border px-4 py-2"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Material</label>
                    <input
                        name="material"
                        type="text"
                        defaultValue="Porcelain"
                        className="w-full rounded-lg border px-4 py-2"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Width (cm)</label>
                    <input
                        name="width"
                        type="text"
                        placeholder="20.00"
                        className="w-full rounded-lg border px-4 py-2"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Height (cm)</label>
                    <input
                        name="height"
                        type="text"
                        placeholder="45.00"
                        className="w-full rounded-lg border px-4 py-2"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Depth (cm)</label>
                    <input
                        name="depth"
                        type="text"
                        placeholder="15.00"
                        className="w-full rounded-lg border px-4 py-2"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">
                        Image URLs (one per line)
                    </label>
                    <textarea
                        name="imageUrls"
                        rows={5}
                        defaultValue={`/images/lladro/1301/1301-1.jpg`}
                        placeholder="One image URL per line"
                        className="w-full rounded-lg border px-4 py-2"
                    />
                </div>

                <button
                    type="submit"
                    className="rounded-lg bg-black text-white px-6 py-3"
                >
                    Create Product
                </button>
            </form>
        </main>
    );
}