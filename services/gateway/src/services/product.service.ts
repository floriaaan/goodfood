import { Product, ProductId, RecipeResponse } from "@gateway/proto/product_pb";
import { productServiceClient } from "@gateway/services/clients";
import { getIngredientRestaurantsByProduct } from "@gateway/services/stock.service";

export const getProduct = (id: string): Promise<Product | undefined> => {
  return new Promise((resolve, reject) => {
    productServiceClient.readProduct(new ProductId().setId(id), (error, response) => {
      if (error) reject(error);
      else resolve(response);
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

export const extendProduct = async (
  product: Product.AsObject,
): Promise<Product.AsObject | (Product.AsObject & { isOutOfStock?: boolean; canMake?: number })> => {
  const ir = await getIngredientRestaurantsByProduct(product.id);
  if (!ir || ir.length === 0) return product;
  const ingredient_restaurant = ir.map((ir) => ir.toObject());

  const extendedProduct: Product.AsObject & {
    isOutOfStock?: boolean;
    canMake?: number;
  } = { ...product };

  if (
    ingredient_restaurant.some((i) => {
      const recipe = product.recipeList.find((r) => r.ingredientId === i.ingredientId.toString());
      if (!recipe) return false;
      return i.quantity < recipe.quantity;
    })
  ) {
    extendedProduct.isOutOfStock = true;
    extendedProduct.canMake = 0;
  } else {
    extendedProduct.isOutOfStock = false;
    extendedProduct.canMake = Math.min(
      ...ingredient_restaurant.map((i) => {
        const recipe = product.recipeList.find((r) => r.ingredientId === i.ingredientId.toString());
        if (!recipe) return 0;
        return Math.floor(i.quantity / recipe.quantity);
      }),
    );
  }

  return extendedProduct;
};
