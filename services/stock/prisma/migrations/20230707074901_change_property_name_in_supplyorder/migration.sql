/*
  Warnings:

  - You are about to drop the column `ingredient_id` on the `SupplyOrder` table. All the data in the column will be lost.
  - Added the required column `ingredient_restaurant_id` to the `SupplyOrder` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "SupplyOrder" DROP CONSTRAINT "SupplyOrder_ingredient_id_fkey";

-- AlterTable
ALTER TABLE "SupplyOrder" DROP COLUMN "ingredient_id",
ADD COLUMN     "ingredient_restaurant_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "SupplyOrder" ADD CONSTRAINT "SupplyOrder_ingredient_restaurant_id_fkey" FOREIGN KEY ("ingredient_restaurant_id") REFERENCES "IngredientRestaurant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
