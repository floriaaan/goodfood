export type Product = {
  id: string;
  name: string;
  image: string;
  comment: string;
  price: number;
  preparation: string;
  weight: string;
  kilocalories: string;
  nutriscore: number | string;
  type: ProductType;

  restaurantId: string;
  isOutOfStock?: boolean;
  canMake?: number;

  categoriesList: Category[];
  allergensList: Allergen[];
  recipeList: Recipe[];
};

export enum ProductType {
  ENTREES = 0,
  PLATS = 1,
  DESSERTS = 2,
  BOISSONS = 3,
  SNACKS = 4,
  EXTRA = 5,
}

export const ProductTypeLabels = {
  [ProductType.ENTREES]: "Entrées",
  [ProductType.PLATS]: "Plats",
  [ProductType.DESSERTS]: "Desserts",
  [ProductType.BOISSONS]: "Boissons",
  [ProductType.SNACKS]: "Snacks",
  [ProductType.EXTRA]: "Extra",
} as const;

export type Allergen = {
  id: string;
  libelle: string;
};

export type Category = {
  id: string;
  libelle: string;
  hexaColor: string;
  icon: string;
};

export type Recipe = {
  ingredientId: string;
  quantity: number;
};

export type ExtendedProduct = Product &
  Partial<{
    stock_quantity: string;
    additional_information: [string, string] | [string];
  }>;
