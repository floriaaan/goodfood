import { productServiceClient } from "@gateway/services/clients";
import { ProductId, Product, RecipeResponse } from "@gateway/proto/product_pb";

export const getProduct = (id: string): Promise<Product | undefined> => {
  return new Promise((resolve, reject) => {
    productServiceClient.readProduct(new ProductId().setId(id), (error, response) => {
      if (error) {
        console.error(error);
        reject(error);
      } else {
        resolve(response);
      }
    });
  });
};

export const getIngredientByProduct = (id: string): Promise<RecipeResponse | undefined> => {
  return new Promise((resolve, reject) => {
    productServiceClient.getIngredientByProduct(new ProductId().setId(id), (error, response) => {
      if (error) {
        console.error(error);
        reject(error);
      } else {
        resolve(response);
      }
    });
  });
};
