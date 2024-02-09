import { log } from "@basket/lib/log";
import { Data } from "@basket/types";
import client from "@basket/lib/redis";
import { Basket, RemoveProductRequest } from "@basket/types/basket";

export const RemoveProduct = async (
  { request }: Data<RemoveProductRequest>,
  callback: (err: any, response: Basket | null) => void
) => {
  try {
    const { product_id, user_id, quantity } = request;
    if (!product_id || !user_id) throw new Error("Invalid request");

    const basket = await client.get(`user:${user_id}`);
    if (!basket) throw new Error("No basket found");

    const storedBasket: Basket = JSON.parse(basket);

    const productIndex = storedBasket.products.findIndex(
      (p) => p.id === product_id
    );
    if (productIndex === -1) throw new Error("Product not found");

    if (quantity >= storedBasket.products[productIndex].quantity) {
      storedBasket.products.splice(productIndex, 1);
    } else {
      storedBasket.products[productIndex].quantity -= quantity;
    }

    const newBasket = { ...storedBasket };
    await client.set(`user:${user_id}`, JSON.stringify(newBasket));
    
    callback(null, newBasket);
  } catch (error) {
    log.error(error);
    callback(error, null);
  }
};
