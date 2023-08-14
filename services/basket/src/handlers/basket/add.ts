import {log} from "@basket/lib/log";
import {Data} from "@basket/types";
import {ProductRequest} from "@basket/types/basket";

import client from "@basket/lib/redis";
import {RedisBasket} from "@basket/types/redisBasket";

export const AddProduct = async (
    {request}: Data<ProductRequest>,
    callback: (err: any, response: any) => void
) => {
    try {
        const {product_id, user_id, restaurant_id} = request;
        const basket = await client.get(`user:${user_id}`);

        if (!basket) {
            await client.set(`user:${user_id}`, JSON.stringify({products_ids: [product_id], restaurant_id}));
            callback(null, {product_id, user_id});
            return;
        }

        const storedBasket: RedisBasket = JSON.parse(basket);
        const newBasket = {
            products_ids: [...storedBasket.products_ids, product_id],
            restaurant_id: storedBasket.restaurant_id
        };
        await client.set(`user:${user_id}`, JSON.stringify(newBasket));

        callback(null, {user_id, newBasket});
    } catch (error) {
        log.error(error);
        callback(error, null);
    }
};
