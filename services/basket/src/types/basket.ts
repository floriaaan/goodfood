export type ProductRequest = {
    user_id: number;
    product_id: string;
    restaurant_id: string;
};

export type UserId = {
    id: number;
};

export type Basket = {
    user_id: string;
    products_ids: string[];
    restaurant_id: string;
};

export type RestaurantId = {
    id: string;
};
