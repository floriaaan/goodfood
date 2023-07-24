/*
  Warnings:

  - Added the required column `restaurant_id` to the `Delivery` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `Delivery` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Delivery" ADD COLUMN     "restaurant_id" TEXT NOT NULL,
ADD COLUMN     "user_id" TEXT NOT NULL;
