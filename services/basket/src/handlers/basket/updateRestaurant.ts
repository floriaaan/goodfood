import { log } from "@basket/lib/log";
import client from "@basket/lib/redis";
import { Data } from "@basket/types";
import { Basket, UpdateRestaurantRequest } from "@basket/types/basket";

export const UpdateRestaurant = async (
  { request }: Data<UpdateRestaurantRequest>,
  callback: (err: any, response: Basket | null) => void
) => {
  try {
    const { restaurant_id, user_id } = request;
    if (!restaurant_id || !user_id) throw new Error("Invalid request");

    const newBasket = { products: [], restaurant_id };
    await client.set(`user:${user_id}`, JSON.stringify(newBasket));

    callback(null, newBasket);
  } catch (error) {
    log.error(error);
    callback(error, null);
  }
};
