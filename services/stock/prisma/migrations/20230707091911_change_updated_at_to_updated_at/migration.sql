/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `IngredientRestaurant` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `SupplyOrder` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `SupplyOrder` table. All the data in the column will be lost.
  - Added the required column `updated_at` to the `IngredientRestaurant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `SupplyOrder` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "IngredientRestaurant" DROP COLUMN "updatedAt",
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "SupplyOrder" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;
