/*
  Warnings:

  - A unique constraint covering the columns `[key]` on the table `IngredientRestaurant` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `key` to the `IngredientRestaurant` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "IngredientRestaurant" ADD COLUMN     "key" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "IngredientRestaurant_key_key" ON "IngredientRestaurant"("key");
