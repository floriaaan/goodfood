import { Data } from "@basket/types";
import { log } from "@basket/lib/log";
import client from "@basket/lib/redis";
import { Basket, BasketItem, UserIdRequest } from "@basket/types/basket";

export const GetBasket = async (
  { request }: Data<UserIdRequest>,
  callback: (err: any, response: Basket | null) => void
) => {
  try {
    const { user_id } = request;
    if (!user_id) throw new Error("Invalid request");

    const basket = await client.get(`user:${user_id}`);
    if (!basket) {
      const newBasket = {
        products: [] as BasketItem[],
        restaurant_id: "",
      };
      await client.set(`user:${user_id}`, JSON.stringify(newBasket));
      callback(null, newBasket);
    } else {
      const storedBasket: Basket = JSON.parse(basket);
      callback(null, storedBasket);
    }
  } catch (error) {
    log.error(error);
    callback(error, null);
  }
};
