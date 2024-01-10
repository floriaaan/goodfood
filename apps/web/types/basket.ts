export type Basket = {
  products: BasketItem[];
  restaurantId: string;
};

export type BasketItem = {
  id: string;
  quantity: number;
};

export const DEFAULT_BASKET: Basket = { products: [], restaurantId: "" };
