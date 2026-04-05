-- CreateEnum
CREATE TYPE "ShippingClass" AS ENUM ('SMALL', 'MEDIUM', 'LARGE', 'OVERSIZED');

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "shippingClass" "ShippingClass" NOT NULL DEFAULT 'MEDIUM';
