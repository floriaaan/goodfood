/*
  Warnings:

  - The primary key for the `RestaurantAddress` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `RestaurantAddress` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[restaurant_id]` on the table `RestaurantAddress` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `restaurant_id` to the `RestaurantAddress` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Delivery" DROP CONSTRAINT "Delivery_restaurant_id_fkey";

-- AlterTable
ALTER TABLE "RestaurantAddress" DROP CONSTRAINT "RestaurantAddress_pkey",
DROP COLUMN "id",
ADD COLUMN     "restaurant_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "RestaurantAddress_restaurant_id_key" ON "RestaurantAddress"("restaurant_id");

-- AddForeignKey
ALTER TABLE "Delivery" ADD CONSTRAINT "Delivery_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "RestaurantAddress"("restaurant_id") ON DELETE RESTRICT ON UPDATE CASCADE;
