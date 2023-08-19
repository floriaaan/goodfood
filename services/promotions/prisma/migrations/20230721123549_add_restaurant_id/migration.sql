/*
  Warnings:

  - Added the required column `restaurant_id` to the `Promotion` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Promotion" ADD COLUMN     "restaurant_id" TEXT NOT NULL;
