import {UserId} from "@basket/types/basket";
import {Data} from "@basket/types";
import {log} from "@basket/lib/log";
import client from "@basket/lib/redis";
import {RedisBasket} from "@basket/types/redisBasket";

export const GetBasket = async (
    data: Data<UserId>,
    callback: (err: any, response: any) => void
) => {
    try {
        const {request} = data;
        const {id} = request;
        const basket = await client.get(`user:${id}`);
        if (!basket) {
            callback(null, {});
        } else {
            log.debug(basket)
            const {products_ids, restaurant_id}: RedisBasket = JSON.parse(basket);
            callback(null, {
                user_id: id,
                products_ids,
                restaurant_id
            });
        }
    } catch (error) {
        log.error(error);
        callback(error, null);
    }
};
