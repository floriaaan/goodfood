import {log} from "@basket/lib/log";
import {Data} from "@basket/types";
import {RestaurantRequest} from "@basket/types/basket";
import client from "@basket/lib/redis";
import {RedisBasket} from "@basket/types/redisBasket";

export const UpdateRestaurant = async (
    {request}: Data<RestaurantRequest>,
    callback: (err: any, response: any) => void
) => {
    try {
        const {restaurant_id, user_id} = request;
        if (!restaurant_id || !user_id) {
            throw new Error("Invalid request");
        }

        const basket = await client.get(`user:${user_id}`);

        if (!basket) {
            callback(null, {});
            return;
        }

        const storedBasket: RedisBasket = JSON.parse(basket);
        const newBasket = {
            products_ids: storedBasket.products_ids,
            restaurant_id
        };
        await client.set(`user:${user_id}`, JSON.stringify(newBasket));

        callback(null, {user_id, ...newBasket});
    } catch (error) {
        log.error(error);
        callback(error, null);
    }
};
