/*
  Warnings:

  - A unique constraint covering the columns `[stripe_id]` on the table `Payment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `stripe_id` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "stripe_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Payment_stripe_id_key" ON "Payment"("stripe_id");
