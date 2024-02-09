/*
  Warnings:

  - A unique constraint covering the columns `[user_id]` on the table `DeliveryPerson` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "DeliveryPerson_user_id_key" ON "DeliveryPerson"("user_id");
