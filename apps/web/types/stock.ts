export type Ingredient = {
  id: number;
  name: string;
  description: string | null;
};

export type IngredientRestaurantList = {
  ingredientRestaurantsList: IngredientRestaurant[];
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
  unitPrice: number;

  ingredientRestaurantId: number;
  ingredientRestaurant: IngredientRestaurant;

  supplierId?: number;
  supplier: Supplier;

  createdAt: string | Date;
  updatedAt: string | Date;
};
