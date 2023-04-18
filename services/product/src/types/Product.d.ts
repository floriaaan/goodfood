import { Category } from "@prisma/client";
import { Empty } from "google-protobuf/google/protobuf/empty_pb";

export enum ProductType {
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
	nutriscore: number;
	restaurant_id: string;
	type: Product_type;
	categories: Category[];
	allergens: Allergen[];
}

export interface ProductList {
	products: Product[];
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

export interface RestaurantId{
	id: string;
}