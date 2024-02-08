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
  } = { ...product, isOutOfStock: true, canMake: 0 };

  if (product.recipeList.length === 0) return extendedProduct;

  if (
    // Check if the product is out of stock by comparing the quantity of each ingredient
    !ingredient_restaurant.some((i) => {
      // Get the quantity needed for the recipe
      const recipe = product.recipeList.find((r) => r.ingredientId === i.ingredientId.toString());
      // If the recipe doesn't exist, the product is out of stock
      if (!recipe) return false;
      // If the quantity of the ingredient is less than the quantity needed for the recipe, the product is out of stock
      return i.quantity < recipe.quantity;
    })
  ) {
    extendedProduct.isOutOfStock = false;

    // This code calculates the maximum number of products that can be made based on the available ingredients in the restaurant.
    // It does this by mapping over each ingredient in the restaurant and finding the corresponding recipe in the product's recipe list.
    // If the recipe doesn't exist for an ingredient, it returns 0, meaning no product can be made from that ingredient.
    // If the recipe does exist, it calculates how many products can be made from that ingredient by dividing the quantity of the ingredient in the restaurant by the quantity required by the recipe.
    // It uses Math.floor to round down to the nearest whole number, as you can't make a fraction of a product.
    // Finally, it uses Math.min to find the smallest number from the array of possible quantities, as this is the limiting factor in how many products can be made.
    extendedProduct.canMake = Math.min(
      ...ingredient_restaurant.map((i) => {
        const recipe = product.recipeList.find((r) => r.ingredientId === i.id.toString());
        if (!recipe) return 0;
        return Math.floor(i.quantity / recipe.quantity);
      }),
    );
  }

  return extendedProduct;
};
