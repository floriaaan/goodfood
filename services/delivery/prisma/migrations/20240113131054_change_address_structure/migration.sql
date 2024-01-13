/*
  Warnings:

  - You are about to drop the column `address` on the `Delivery` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `DeliveryPerson` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[address_id]` on the table `DeliveryPerson` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Delivery" DROP COLUMN "address",
ADD COLUMN     "address_id" TEXT;

-- AlterTable
ALTER TABLE "DeliveryPerson" DROP COLUMN "location",
ADD COLUMN     "address_id" TEXT;

-- CreateTable
CREATE TABLE "Address" (
    "id" TEXT NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "lng" DOUBLE PRECISION NOT NULL,
    "street" TEXT,
    "city" TEXT,
    "zipcode" TEXT,
    "country" TEXT,
    "delivery_id" TEXT NOT NULL,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeliveryPersonAddress" (
    "id" TEXT NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "lng" DOUBLE PRECISION NOT NULL,
    "street" TEXT,
    "city" TEXT,
    "zipcode" TEXT,
    "country" TEXT,
    "delivery_person_id" TEXT NOT NULL,

    CONSTRAINT "DeliveryPersonAddress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Address_delivery_id_key" ON "Address"("delivery_id");

-- CreateIndex
CREATE UNIQUE INDEX "DeliveryPersonAddress_delivery_person_id_key" ON "DeliveryPersonAddress"("delivery_person_id");

-- CreateIndex
CREATE UNIQUE INDEX "DeliveryPerson_address_id_key" ON "DeliveryPerson"("address_id");

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_delivery_id_fkey" FOREIGN KEY ("delivery_id") REFERENCES "Delivery"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeliveryPersonAddress" ADD CONSTRAINT "DeliveryPersonAddress_delivery_person_id_fkey" FOREIGN KEY ("delivery_person_id") REFERENCES "DeliveryPerson"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
