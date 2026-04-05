-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "customerName" TEXT,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "shippingAddress1" TEXT,
ADD COLUMN     "shippingAddress2" TEXT,
ADD COLUMN     "shippingCity" TEXT,
ADD COLUMN     "shippingCost" DECIMAL(10,2),
ADD COLUMN     "shippingCountry" TEXT,
ADD COLUMN     "shippingMethod" TEXT,
ADD COLUMN     "shippingPostcode" TEXT,
ADD COLUMN     "shippingRegion" TEXT;
