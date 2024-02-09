-- DropForeignKey
ALTER TABLE "Address" DROP CONSTRAINT "Address_restaurantId_fkey";

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
