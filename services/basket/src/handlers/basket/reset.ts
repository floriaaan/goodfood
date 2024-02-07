import { log } from "@basket/lib/log";
import { Data } from "@basket/types";
import client from "@basket/lib/redis";
import { Basket, BasketItem, UserIdRequest } from "@basket/types/basket";

export const Reset = async (
  { request }: Data<UserIdRequest>,
  callback: (err: any, response: Basket | null) => void,
) => {
  try {
    const { user_id } = request;
    if (!user_id) throw new Error("Invalid request");

    const basket = await client.get(`user:${user_id}`);

    if (!basket) {
      const emptyBasket = {
        products: [] as BasketItem[],
        restaurant_id: "",
      };
      await client.set(`user:${user_id}`, JSON.stringify(emptyBasket));
      callback(null, emptyBasket);
    }

    const storedBasket: Basket = JSON.parse(basket);
    const newBasket = { products: [], restaurant_id: storedBasket.restaurant_id } as Basket;
    await client.set(`user:${user_id}`, JSON.stringify(newBasket));
    callback(null, newBasket);
    return;
  } catch (error) {
    log.error(error);
    callback(error, null);
  }
};
