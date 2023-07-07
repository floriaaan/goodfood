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

export type GetIngredientRequest = {
  id: number;
};

export type GetIngredientsResponse = {
  ingredients: Ingredient[];
};

export type CreateIngredientRequest = {
  name: string;
  description?: string;
};

export type UpdateIngredientRequest = {
  id: number;
  name: string;
  description?: string;
};

export type DeleteIngredientRequest = {
  id: number;
};

export type DeleteIngredientResponse = {
  success: boolean;
};

export type GetSupplierRequest = {
  id: number;
};

export type GetSuppliersResponse = {
  suppliers: Supplier[];
};

export type CreateSupplierRequest = {
  name: string;
  contact: string;
};

export type UpdateSupplierRequest = {
  id: number;
  name: string;
  contact: string;
};

export type DeleteSupplierRequest = {
  id: number;
};

export type DeleteSupplierResponse = {
  success: boolean;
};

export type GetIngredientRestaurantRequest = {
  id: number;
};

export type GetIngredientRestaurantsByRestaurantRequest = {
  restaurant_id: string;
};

export type GetIngredientRestaurantsByRestaurantResponse = {
  ingredient_restaurants: IngredientRestaurant[];
};

export type GetIngredientRestaurantsByProductRequest = {
  product_id: string;
};

export type GetIngredientRestaurantsByProductResponse = {
  ingredient_restaurants: IngredientRestaurant[];
};

export type CreateIngredientRestaurantRequest = {
  alert_threshold: number;
  quantity: number;
  in_product_list: string[];

  unit_price: number;
  price_per_kilo: number;

  restaurant_id: string;
  ingredient_id: number;
  supplier_id: number;
};

export type UpdateIngredientRestaurantRequest = {
  id: number;
  alert_threshold: number;
  quantity: number;
  in_product_list: string[];

  unit_price: number;
  price_per_kilo: number;

  restaurant_id: string;
  ingredient_id: number;
  supplier_id: number;
};

export type DeleteIngredientRestaurantRequest = {
  id: number;
};

export type DeleteIngredientRestaurantResponse = {
  success: boolean;
};

export type GetSupplyOrderRequest = {
  id: number;
};

export type GetSupplyOrdersByRestaurantRequest = {
  restaurant_id: string;
};

export type GetSupplyOrdersByRestaurantResponse = {
  supply_orders: SupplyOrder[];
};

export type GetSupplyOrdersBySupplierRequest = {
  supplier_id: number;
};

export type GetSupplyOrdersBySupplierResponse = {
  supply_orders: SupplyOrder[];
};

export type GetSupplyOrdersByIngredientRestaurantRequest = {
  ingredient_restaurant_id: number;
};

export type GetSupplyOrdersByIngredientRestaurantResponse = {
  supply_orders: SupplyOrder[];
};

export type CreateSupplyOrderRequest = {
  quantity: number;

  ingredient_restaurant_id: number;
  supplier_id: number;
};

export type UpdateSupplyOrderRequest = {
  id: number;
  quantity: number;
  unit_price: number;

  ingredient_restaurant_id: number;
  supplier_id: number;
};

export type DeleteSupplyOrderRequest = {
  id: number;
};

export type DeleteSupplyOrderResponse = {
  success: boolean;
};
