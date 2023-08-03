-- CreateEnum
CREATE TYPE "Method" AS ENUM ('PERCENT', 'VALUE');

-- CreateTable
CREATE TABLE "Promotions" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "reduction" TEXT NOT NULL,
    "method" "Method" NOT NULL,

    CONSTRAINT "Promotions_pkey" PRIMARY KEY ("id")
);

