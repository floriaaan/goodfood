-- CreateTable
CREATE TABLE "RestaurantAddress" (
    "id" TEXT NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "lng" DOUBLE PRECISION NOT NULL,
    "street" TEXT,
    "city" TEXT,
    "zipcode" TEXT,
    "country" TEXT,

    CONSTRAINT "RestaurantAddress_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Delivery" ADD CONSTRAINT "Delivery_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "RestaurantAddress"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
