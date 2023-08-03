/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `Promotions` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Promotions_code_key" ON "Promotions"("code");
