-- CreateTable
CREATE TABLE "Ingredient" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Ingredient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IngredientRestaurant" (
    "id" SERIAL NOT NULL,
    "alert_threshold" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "in_product_list" TEXT[],
    "unit_price" DOUBLE PRECISION NOT NULL,
    "price_per_kilo" DOUBLE PRECISION NOT NULL,
    "restaurant_id" TEXT NOT NULL,
    "ingredient_id" INTEGER NOT NULL,
    "supplier_id" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IngredientRestaurant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Supplier" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "contact" TEXT NOT NULL,

    CONSTRAINT "Supplier_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Ingredient_name_key" ON "Ingredient"("name");

-- AddForeignKey
ALTER TABLE "IngredientRestaurant" ADD CONSTRAINT "IngredientRestaurant_ingredient_id_fkey" FOREIGN KEY ("ingredient_id") REFERENCES "Ingredient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IngredientRestaurant" ADD CONSTRAINT "IngredientRestaurant_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "Supplier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
