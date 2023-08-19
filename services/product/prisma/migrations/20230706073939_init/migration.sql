/*
  Warnings:

  - A unique constraint covering the columns `[libelle]` on the table `Allergen` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Allergen_libelle_key" ON "Allergen"("libelle");
