import { Data } from "@basket/types";
import { log } from "@basket/lib/log";
import client from "@basket/lib/redis";
import { Basket, BasketRequest } from "@basket/types/basket";

export const SaveBasket = async (
  { request }: Data<BasketRequest>,
  callback: (err: any, response: Basket | null) => void
) => {
  try {
    const { user_id, basket } = request;
    if (!user_id) throw new Error("Invalid request");

    await client.set(`user:${user_id}`, JSON.stringify(basket));

    callback(null, basket);
  } catch (error) {
    log.error(error);
    callback(error, null);
  }
};
