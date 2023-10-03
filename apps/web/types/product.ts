export type Product = {
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
};

export enum ProductType {
  ENTREES = 0,
  PLATS = 1,
  DESSERTS = 2,
  BOISSONS = 3,
  SNACKS = 4,
  EXTRA = 5,
}

export type Allergen = {
  id: string;
  libelle: string;
};

export type Category = {
  id: string;
  libelle: string;
  hexa_color: string;
  icon: string;
};

export type ExtendedProduct = Product &
  Partial<{
    stock_quantity: string;
    additional_information: string[];
  }>;
