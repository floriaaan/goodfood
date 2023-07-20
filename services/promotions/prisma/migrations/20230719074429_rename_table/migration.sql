/*
  Warnings:

  - You are about to drop the `Promotions` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Promotions";

-- CreateTable
CREATE TABLE "Promotion" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "reduction" TEXT NOT NULL,
    "method" "Method" NOT NULL,

    CONSTRAINT "Promotion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Promotion_code_key" ON "Promotion"("code");
