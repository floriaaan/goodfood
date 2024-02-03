-- CreateEnum
CREATE TYPE "MessageType" AS ENUM ('USER_CLAIM', 'USER_PUSH', 'USER_EMAIL', 'RESTAURANT_PUSH', 'RESTAURANT_EMAIL');

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "image" TEXT,
    "callback_url" TEXT,
    "type" "MessageType" NOT NULL,
    "user_id" TEXT,
    "restaurant_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "read_at" TIMESTAMP(3),

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);
