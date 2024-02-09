import { Allergen } from "@product/types/Allergen";
import { Category } from "@product/types/Category";


export const enum ProductType {
  ENTREES = 0,
  PLATS = 1,
  DESSERTS = 2,
  BOISSONS = 3,
  SNACKS = 4,
}

export interface Product {
  id: string;
  name: string;
  image: string;
  comment: string;
  price: number;
  preparation: string;
  weight: string;
  kilocalories: string;
  nutriscore: string;
  restaurant_id: string;
  type: ProductType;
  categories: Category[];
  allergens: Allergen[];
  recipe: Recipe[];
}

export interface ProductList {
  products: Product[];
}

export interface ProductTypeList {
  productType: string[];
}

export interface ProductId {
  id: Product["id"];
}

export interface ProductIngredient {
  id: string;
  product_id: string;
  ingredient_id: string;
  quantity: number;
}

export interface RestaurantId {
  id: string;
}

export interface Image {
  name: string;
  data: string;
}

export interface Url {
  path: string;
}


export interface RecipeResponse {
  productId: string;
  recipe: {
    ingredient_id: string;
    quantity: number;
  }[];
}

export interface Recipe {
  id: string;
  product_id: string;
  ingredient_id: string;
  quantity: number;
}
