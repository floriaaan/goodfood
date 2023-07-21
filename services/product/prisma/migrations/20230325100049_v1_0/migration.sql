/*
  Warnings:

  - Added the required column `restaurant_id` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "restaurant_id" INTEGER NOT NULL;
