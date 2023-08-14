import {log} from "@basket/lib/log";
import {Data} from "@basket/types";
import {ProductRequest} from "@basket/types/basket";
import client from "@basket/lib/redis";
import {RedisBasket} from "@basket/types/redisBasket";

export const DeleteProduct = async (
    data: Data<ProductRequest>,
    callback: (err: any, response: any) => void
) => {
    try {
        const {request} = data;
        const {product_id, user_id} = request;

        const basket = await client.get(`user:${user_id}`);
        if (!basket) {
            callback(null, "Basket not found");
            return;
        }

        const storedBasket: RedisBasket = JSON.parse(basket);
        const newBasket = {
            products_ids: storedBasket.products_ids.filter(productId => productId !== product_id),
            restaurant_id: storedBasket.restaurant_id
        };
        log.info(basket);
        await client.set(`user:${user_id}`, JSON.stringify(newBasket));
        callback(null, {user_id, ...newBasket});
    } catch (error) {
        log.error(error);
        callback(error, null);
    }
};
