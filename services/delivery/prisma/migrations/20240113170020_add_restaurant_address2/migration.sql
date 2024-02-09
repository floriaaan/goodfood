/*
  Warnings:

  - You are about to drop the column `restaurant_id` on the `RestaurantAddress` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id]` on the table `RestaurantAddress` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `id` to the `RestaurantAddress` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Delivery" DROP CONSTRAINT "Delivery_restaurant_id_fkey";

-- DropIndex
DROP INDEX "RestaurantAddress_restaurant_id_key";

-- AlterTable
ALTER TABLE "RestaurantAddress" DROP COLUMN "restaurant_id",
ADD COLUMN     "id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "RestaurantAddress_id_key" ON "RestaurantAddress"("id");

-- AddForeignKey
ALTER TABLE "Delivery" ADD CONSTRAINT "Delivery_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "RestaurantAddress"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
