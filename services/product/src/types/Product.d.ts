import { Allergen } from "@product/types/Allergen";
import { Category } from "@product/types/Category";


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
	type: ProductType;
	categories: Category[];
	allergens: Allergen[];
}

export interface ProductList {
	products: Product[];
}

export interface ProductTypeList {
	productTypes: ProductType[];
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