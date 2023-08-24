export type ProductRequest = {
    user_id: number;
    product_id: string;
    restaurant_id: string;
};

export type UserId = {
    id: number;
};
// todo: change to product minimum ({count: number, id: string, price: number}}})
export type Basket = {
    user_id: number;
    products_ids: string[];
    restaurant_id: string;
};

export type RestaurantRequest = {
    user_id: number;
    restaurant_id: string;
};
