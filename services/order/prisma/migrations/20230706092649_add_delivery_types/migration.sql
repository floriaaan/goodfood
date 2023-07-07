/*
  Warnings:

  - Added the required column `delivery_type` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "DeliveryType" AS ENUM ('TAKEAWAY', 'DELIVERY');

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "delivery_type" "DeliveryType" NOT NULL;
