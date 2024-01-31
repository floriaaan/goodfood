-- DropForeignKey
ALTER TABLE "DeliveryAddress" DROP CONSTRAINT "DeliveryAddress_delivery_id_fkey";

-- DropForeignKey
ALTER TABLE "DeliveryPersonAddress" DROP CONSTRAINT "DeliveryPersonAddress_delivery_person_id_fkey";

-- AddForeignKey
ALTER TABLE "DeliveryAddress" ADD CONSTRAINT "DeliveryAddress_delivery_id_fkey" FOREIGN KEY ("delivery_id") REFERENCES "Delivery"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeliveryPersonAddress" ADD CONSTRAINT "DeliveryPersonAddress_delivery_person_id_fkey" FOREIGN KEY ("delivery_person_id") REFERENCES "DeliveryPerson"("id") ON DELETE CASCADE ON UPDATE CASCADE;
