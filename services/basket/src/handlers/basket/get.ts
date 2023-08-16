import {UserId} from "@basket/types/basket";
import {Data} from "@basket/types";
import {log} from "@basket/lib/log";
import client from "@basket/lib/redis";
import {RedisBasket} from "@basket/types/redisBasket";

export const GetBasket = async (
    {request}: Data<UserId>,
    callback: (err: any, response: any) => void
) => {
    try {
        const {id} = request;
        if (!id) {
            throw new Error("Invalid request");
        }
        const basket = await client.get(`user:${id}`);
        if (!basket) {
            callback(null, {});
        } else {
            const storedBasket: RedisBasket = JSON.parse(basket);
            callback(null, {
                user_id: id,
                ...storedBasket
            });
        }
    } catch (error) {
        log.error(error);
        callback(error, null);
    }
};
