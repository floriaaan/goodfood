/*
  Warnings:

  - A unique constraint covering the columns `[addressId]` on the table `Restaurant` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Restaurant" ALTER COLUMN "addressId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Restaurant_addressId_key" ON "Restaurant"("addressId");
