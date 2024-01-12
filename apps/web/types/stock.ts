export type Ingredient = {
  id: number;
  name: string;
  description: string | null;
};

export type IngredientRestaurant = {
  id: number;
  key: string;

  alertThreshold: number;
  quantity: number;
  inProductListList: string[];

  unitPrice: number;
  pricePerKilo: number;

  restaurantId: string;

  ingredientId: number;
  ingredient: Ingredient;

  supplierId: number;
  supplier: Supplier;

  updatedAt: string | Date;
};

export type Supplier = {
  id: number;
  name: string;
  contact: string;
};

export type SupplyOrder = {
  id: number;

  quantity: number;
  unit_price: number;

  ingredient_restaurant_id: number;
  ingredient_restaurant: IngredientRestaurant;

  supplier_id: number;
  supplier: Supplier;

  created_at: string | Date;
  updated_at: string | Date;
};
