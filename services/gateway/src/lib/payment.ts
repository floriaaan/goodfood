import { Basket, UserIdRequest } from "@gateway/proto/basket_pb";
import { basketServiceClient, productServiceClient } from "@gateway/services/clients";
import { Product, ProductId } from "@gateway/proto/product_pb";

export const reduceProductFromStock = async (userId: string) => {
  const basket: Basket.AsObject = await new Promise((resolve, reject) => {
    basketServiceClient.getBasket(new UserIdRequest().setUserId(userId), (error, response) => {
      if (error) reject(error);
      else resolve(response.toObject());
    });
  });

  const products = await Promise.all(
    basket.productsList.map(async (product) => {
      return (await new Promise((resolve, reject) => {
        productServiceClient.readProduct(new ProductId().setId(product.id), (error, response) => {
          if (error) reject(error);
          else resolve(response.toObject());
        });
      })) as Product.AsObject;
    }),
  );

  return products.reduce((acc, product) => {
    return acc + product.price * (basket.productsList.find((p) => p.id === product.id)?.quantity || 1);
  }, 0);
};
