import { prisma } from "@/lib/prisma";
import { cacheLife } from "next/cache";
import { revalidatePath } from "next/cache";
import { ProductStatus } from "@prisma/client";

function serializeProduct(product: any) {
  return {
    ...product,
    price: product.price?.toString() ?? null,
    width: product.width?.toString() ?? null,
    height: product.height?.toString() ?? null,
    depth: product.depth?.toString() ?? null,
  };
}

export async function getProductsForCatalog() {
  "use cache";
  cacheLife("minutes");

  const products = await prisma.product.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      images: {
        orderBy: { sortOrder: "asc" },
        take: 1,
      },
    },
  });

  const sortedProducts = products.sort((a, b) => {
    const aAvailable = a.status === "AVAILABLE";
    const bAvailable = b.status === "AVAILABLE";

    if (aAvailable && !bAvailable) return -1;
    if (!aAvailable && bAvailable) return 1;

    return b.createdAt.getTime() - a.createdAt.getTime();
  });

  return sortedProducts.map(serializeProduct);
}

export async function getProductBySlug(slug: string) {
  "use cache";
  cacheLife("minutes");

  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      images: {
        orderBy: { sortOrder: "asc" },
      },
      categories: {
        include: {
          category: true,
        },
      },
    },
  });
    if (!product) return null;

    return serializeProduct(product);
}

export async function getProductById(id: number) {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      images: {
        orderBy: { sortOrder: "asc" },
      },
      categories: {
        include: {
          category: true,
        },
      },
    },
  });

  if (!product) return null;
  return serializeProduct(product);
}

export async function updateProductPriceInDb(id: number, price: string) {
  return prisma.product.update({
    where: { id },
    data: { price },
  });
}

export async function createProductInDb(data: {
  title: string;
  slug: string;
  description?: string | null;
  price: string;
  brand?: string | null;
  condition?: string | null;
  era?: string | null;
  material?: string | null;
  width?: string | null;
  height?: string | null;
  depth?: string | null;
  imageUrls?: string[];
}) {
  return prisma.product.create({
    data: {
      title: data.title,
      slug: data.slug,
      description: data.description ?? null,
      price: data.price,
      brand: data.brand ?? null,
      condition: data.condition ?? null,
      era: data.era ?? null,
      material: data.material ?? null,
      width: data.width ?? null,
      height: data.height ?? null,
      depth: data.depth ?? null,
      status: "AVAILABLE",
      images:
        data.imageUrls && data.imageUrls.length > 0
          ? {
              create: data.imageUrls.map((url, index) => ({
                imageUrl: url,
                sortOrder: index + 1,
              })),
            }
          : undefined,
    },
  });
}

export async function updateProductInDb(
  id: number,
  data: {
    title: string;
    slug: string;
    description?: string | null;
    price: string;
    brand?: string | null;
    condition?: string | null;
    era?: string | null;
    material?: string | null;
    width?: string | null;
    height?: string | null;
    depth?: string | null;
    status: ProductStatus;
    imageUrls?: string[];
  }
) {
  return prisma.product.update({
    where: { id },
    data: {
      title: data.title,
      slug: data.slug,
      description: data.description ?? null,
      price: data.price,
      brand: data.brand ?? null,
      condition: data.condition ?? null,
      era: data.era ?? null,
      material: data.material ?? null,
      width: data.width ?? null,
      height: data.height ?? null,
      depth: data.depth ?? null,
      status: data.status,
      images: {
        deleteMany: {},
        ...(data.imageUrls && data.imageUrls.length > 0
          ? {
              create: data.imageUrls.map((url, index) => ({
                imageUrl: url,
                sortOrder: index + 1,
              })),
            }
          : {}),
      },
    },
  });
}

export async function deleteProductInDb(id: number) {
  return prisma.product.delete({
    where: { id },
  });
}

export function revalidateAdminProductEditPage(id: number) {
  revalidatePath(`/admin/products/${id}/edit`);
}

export function revalidateProductPages(slug: string) {
  revalidatePath("/products");
  revalidatePath(`/products/${slug}`);
}

export async function updateProductPrice(
  id: number,
  price: string,
  slug: string
) {
  await updateProductPriceInDb(id, price);
  revalidateProductPages(slug);
}

