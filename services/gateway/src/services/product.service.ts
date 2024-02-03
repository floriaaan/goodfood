import { productServiceClient } from "@gateway/services/clients";
import { ProductId, Product } from "@gateway/proto/product_pb";

export const getProduct = (id: string): Promise<Product | undefined> => {
  return new Promise((resolve, reject) => {
    productServiceClient.readProduct(new ProductId().setId(id), (error, response) => {
      if (error) {
        reject(error);
      } else {
        resolve(response);
      }
    });
  });
};
