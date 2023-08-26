-- CreateEnum
CREATE TYPE "MessageType" AS ENUM ('USER_REQUEST', 'OUTPUT');

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "message_type" "MessageType" NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);
