export type BasketItem = {
  id: string;
  quantity: number;
};

export type Basket = {
  restaurant_id: string;
  products: BasketItem[];
};

export type UserIdRequest = {
  user_id: string;
};

export type AddProductRequest = {
  user_id: string;
  product_id: string;
  quantity: number;

  restaurant_id?: string;
};

export type RemoveProductRequest = {
  user_id: string;
  product_id: string;
  quantity: number;
};

export type UpdateRestaurantRequest = {
  user_id: string;
  restaurant_id: string;
};

export type BasketRequest = {
  user_id: string;
  basket: Basket;
};
