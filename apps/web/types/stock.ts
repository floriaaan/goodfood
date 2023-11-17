export type Ingredient = {
  id: number;
  name: string;
  description: string | null;
};

export type IngredientRestaurant = {
  id: number;
  key: string;

  alert_threshold: number;
  quantity: number;
  in_product_list: string[];

  unit_price: number;
  price_per_kilo: number;

  restaurant_id: string;

  ingredient_id: number;
  ingredient: Ingredient;

  supplier_id: number;
  supplier: Supplier;

  updated_at: string | Date;
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
