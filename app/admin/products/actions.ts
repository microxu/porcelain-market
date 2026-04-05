"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import {
  createProductInDb,
  updateProductInDb,
  deleteProductInDb,
  revalidateProductPages,
} from "@/services/product-service";
import { requireAdmin } from "@/lib/auth-guard";

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function getString(formData: FormData, key: string) {
  return String(formData.get(key) || "").trim();
}

function getOptionalString(formData: FormData, key: string) {
  const value = getString(formData, key);
  return value || null;
}

function parseImageUrls(formData: FormData) {
  const imageUrlsRaw = getString(formData, "imageUrls");

  return imageUrlsRaw
    .split("\n")
    .map((url) => url.trim())
    .filter(Boolean);
}

async function generateUniqueSlug(title: string, excludeId?: number) {
  const baseSlug = slugify(title);
  let slug = baseSlug;

  const existing = await prisma.product.findFirst({
    where: excludeId
      ? {
        slug: baseSlug,
        NOT: { id: excludeId },
      }
      : {
        slug: baseSlug,
      },
    select: { id: true },
  });

  if (existing) {
    slug = `${baseSlug}-${Date.now()}`;
  }

  return slug;
}

export async function createProduct(formData: FormData) {
  await requireAdmin();

  const title = getString(formData, "title");
  const description = getOptionalString(formData, "description");
  const price = getString(formData, "price");
  const brand = getOptionalString(formData, "brand");
  const condition = getOptionalString(formData, "condition");
  const era = getOptionalString(formData, "era");
  const material = getOptionalString(formData, "material");
  const width = getOptionalString(formData, "width");
  const height = getOptionalString(formData, "height");
  const depth = getOptionalString(formData, "depth");
  const imageUrls = parseImageUrls(formData);

  if (!title || !price) {
    throw new Error("Title and price are required.");
  }

  const slug = await generateUniqueSlug(title);

  const product = await createProductInDb({
    title,
    slug,
    description,
    price,
    brand,
    condition,
    era,
    material,
    width,
    height,
    depth,
    imageUrls,
  });

  revalidateProductPages(product.slug);

  redirect(`/products/${product.slug}`);
}

export async function updateProduct(formData: FormData) {
  await requireAdmin();

  const id = Number(getString(formData, "id"));
  const originalSlug = getString(formData, "originalSlug");

  const title = getString(formData, "title");
  const description = getOptionalString(formData, "description");
  const price = getString(formData, "price");
  const brand = getOptionalString(formData, "brand");
  const condition = getOptionalString(formData, "condition");
  const era = getOptionalString(formData, "era");
  const material = getOptionalString(formData, "material");
  const width = getOptionalString(formData, "width");
  const height = getOptionalString(formData, "height");
  const depth = getOptionalString(formData, "depth");
  const status = getString(formData, "status") as
    | "AVAILABLE"
    | "DRAFT"
    | "SOLD"
    | "RESERVED";
  const imageUrls = parseImageUrls(formData);

  if (!id || !title || !price) {
    throw new Error("Id, title and price are required.");
  }

  if (status !== "DRAFT" &&
    status !== "AVAILABLE" &&
    status !== "RESERVED" &&
    status !== "SOLD") {
    throw new Error("Invalid status.");
  }

  const slug = await generateUniqueSlug(title, id);

  const product = await updateProductInDb(id, {
    title,
    slug,
    description,
    price,
    brand,
    condition,
    era,
    material,
    width,
    height,
    depth,
    status,
    imageUrls,
  });

  revalidateProductPages(originalSlug);
  if (originalSlug !== product.slug) {
    revalidateProductPages(product.slug);
  }

  redirect(`/products/${product.slug}`);
  
}

export async function deleteProduct(formData: FormData) {
  await requireAdmin();

  const id = Number(getString(formData, "id"));
  const slug = getString(formData, "slug");

  if (!id) {
    throw new Error("Invalid product id.");
  }

  await deleteProductInDb(id);

  if (slug) {
    revalidateProductPages(slug);
  }

  redirect("/admin/products");
}