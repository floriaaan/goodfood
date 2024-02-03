import { log } from "@basket/lib/log";
import { Data } from "@basket/types";
import client from "@basket/lib/redis";
import { Basket, UpdateRestaurantRequest } from "@basket/types/basket";

export const UpdateRestaurant = async (
  { request }: Data<UpdateRestaurantRequest>,
  callback: (err: any, response: Basket | null) => void
) => {
  try {
    const { restaurant_id, user_id } = request;
    if (!restaurant_id || !user_id) throw new Error("Invalid request");

    const basket = await client.get(`user:${user_id}`);

    if (!basket) {
      const newBasket = { products: [], restaurant_id } as Basket;
      await client.set(`user:${user_id}`, JSON.stringify(newBasket));
      callback(null, newBasket);
      return;
    }

    const storedBasket: Basket = JSON.parse(basket);
    const newBasket = {
      ...storedBasket,
      restaurant_id,
    };
    await client.set(`user:${user_id}`, JSON.stringify(newBasket));

    callback(null, newBasket);
  } catch (error) {
    log.error(error);
    callback(error, null);
  }
};
