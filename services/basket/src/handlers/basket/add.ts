import { log } from "@basket/lib/log";
import { Data } from "@basket/types";

import client from "@basket/lib/redis";
import { AddProductRequest, Basket } from "@basket/types/basket";

export const AddProduct = async (
  { request }: Data<AddProductRequest>,
  callback: (err: any, response: Basket | null) => void
) => {
  try {
    const { product_id, user_id, quantity, restaurant_id } = request;
    if (!product_id || !quantity || !user_id)
      throw new Error("Invalid request");

    const basket = await client.get(`user:${user_id}`);

    if (!basket) {
      if (!restaurant_id) throw new Error("Invalid request");
      const newBasket = {
        products: [{ id: product_id, quantity }],
        restaurant_id,
      };

      await client.set(`user:${user_id}`, JSON.stringify(newBasket));
      callback(null, newBasket);
      return;
    }

    const storedBasket: Basket = JSON.parse(basket);
    const productIndex = storedBasket.products.findIndex(
      (p) => p.id === product_id
    );
    if (productIndex !== -1)
      storedBasket.products[productIndex].quantity += quantity;
    else storedBasket.products.push({ id: product_id, quantity });

    const newBasket = {
      ...storedBasket,
      restaurant_id: restaurant_id || storedBasket.restaurant_id,
    };

    await client.set(`user:${user_id}`, JSON.stringify(newBasket));

    callback(null, newBasket);
  } catch (error) {
    log.error(error);
    callback(error, null);
  }
};
