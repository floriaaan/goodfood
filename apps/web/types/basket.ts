export type Basket = {
  productsList: BasketItem[];
  restaurantId: string;
};

export type BasketItem = {
  id: string;
  quantity: number;
};

export const DEFAULT_BASKET: Basket = { productsList: [], restaurantId: "" };
